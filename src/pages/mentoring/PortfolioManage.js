import React, { useState, useEffect, useRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import "./mentoring.css";
import axios from 'axios';
import Switch from "react-switch";
import { Form, Nav, Stack, Button, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cropper from "react-cropper";
import 'cropperjs/dist/cropper.css';
import MDEditor from '@uiw/react-md-editor';


const subjectPairs = {
    '0': '웹개발',
    '1': '모바일 앱 개발',
    '2': '게임 개발',
    '3': '프로그래밍 언어',
    '4': '알고리즘 · 자료구조',
    '5': '데이터베이스',
    '6': '자격증',
    '7': '개발 도구',
    '8': '데이터 사이언스',
    '9': '데스크톱 앱 개발',
    '10': '교양 · 기타'
}

function PortfolioManage() {
    const words = ['웹개발', '모바일 앱 개발', '게임 개발', '프로그래밍 언어', '알고리즘 · 자료구조', '데이터베이스', '자격증', '개발 도구', '데이터 사이언스', '데스크톱 앱 개발', '교양 · 기타'];
    const [portfolio, setPortfolio] = useState({})
    const [checked, setChecked] = useState();
    const user = useSelector((state) => state.user);
    const [selectedWords, setSelectedWords] = useState(portfolio?.subject ?? []); // 클릭한 단어 배열
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDisabled, setIsDisabled] = useState(user.id === null);
    const navigate = useNavigate()
    const { myPortfolio } = useParams();
    const [isCrop, setIsCrop] = useState(false);
    const [inputImage, setInputImage] = useState(null); // 유저가 첨부한 이미지
    const [imgUrl, setImgUrl] = useState(portfolio?.mentoPic);
    const cropperRef = useRef(null); // react-cropper 컴포넌트를 참조
    const handleChange = (checked) => {
        axios({
            method: "PATCH",
            url: `/mentoring/${myPortfolio}/state`,
        })
            .then(function (response) {
                if (response.data.status === 200) {
                    alert("포트폴리오 상태가 변경되었습니다.")
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        setChecked(checked);
    };
    useEffect(() => {
        axios({
            method: "GET",
            url: `/mentoring/${myPortfolio}`,
        })
            .then(function (response) {
                setPortfolio(response.data.data);
                setSelectedWords(response.data.data.subject)
                setImgUrl(response.data.data.mentoPic)
                if (response.data.data.isOpen === 1) { setChecked(true); } else { setChecked(false); }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    function checkDelete() {
        // eslint-disable-next-line no-restricted-globals
        const result = confirm("정말 삭제하시겠습니까?");
        if (result) {
            deletePortfolio()
        }
    }
    const deletePortfolio = () => {
        axios({
            method: "DELETE",
            url: `/mentoring/${myPortfolio}`,
        })
            .then(function (response) {
                if (response.status === 200) {
                    alert("삭제되었습니다.")
                    navigate("../mentoring/main")
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const updatePortfolio = () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        // 이미지를 Blob으로 변환
        cropper.getCroppedCanvas().toBlob((blob) => {
            // Blob을 FormData로 감싸기
            const formData = new FormData();
            const updatedSubject = JSON.stringify(selectedWords);
            formData.append('mentoPic', blob, `${user.id}.jpg`);
            formData.append('data', JSON.stringify({
                'subject': selectedWords,
                'brief': portfolio.brief,
                'content': portfolio.content,
                'tuition': portfolio.tuition,
                'duration': portfolio.duration,
            }));
            axios({
                method: "PATCH",
                url: `/mentoring/${myPortfolio}`,
                data: formData
            },
            )
                .then(function (response) {
                    if (response.data.status === 200) {
                        alert("수정이 완료됐습니다")
                        setIsUpdating(false)
                        navigate(`../mentoring/main`)
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
    }
    function checkTitle() {
        portfolio['title'] === "" || portfolio['content'] === "" ? alert("제목 또는 내용을 입력해주세요.") :
            updatePortfolio();
    }
    const onClickJoinBtn = () => {
        axios({
            method: "POST",
            url: `/mentoring/${myPortfolio}/apply`,
        })
            .then(function (response) {
                if (response.status === 200) {
                    alert("멘토링 신청 성공!")
                    navigate("/mypage/chat")
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const getValue = e => {
        const { name, value } = e.target;
        setPortfolio({
            ...portfolio,
            [name]: value
        })
    };
    const handleWordClick = (word) => {
        const wordIndex = words.indexOf(word);
        if (selectedWords.includes(wordIndex)) {
            setSelectedWords(prevWords => prevWords.filter(w => w !== wordIndex));
        } else {
            setSelectedWords(prevWords => [...prevWords, wordIndex]);
        }
    };

    const onCrop = () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        if (cropper) {
            setIsCrop(false);
            setImgUrl(cropper.getCroppedCanvas().toDataURL());
        }
    };
    return (
        <div className="PortfolioManage">
            <div className="row">
                <div className="col-md-3" style={{ textAlign: 'center' }}>
                    <Category />
                </div>
                {!isUpdating ? <div className="col-md-6">
                    {user.id === portfolio?.mentoId && <div className='manage-bar' style={{ justifyContent: 'space-between' }}>
                        <h5>포트폴리오 관리</h5>
                        <div className='manage-bar' style={{ gap: 5, margin: '0px 20px' }}>
                            <div onClick={() => { setIsUpdating(true) }}>
                                수정
                            </div>
                            <div onClick={checkDelete}>
                                삭제
                            </div>
                        </div>
                    </div>}

                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '10px' }}>
                        <div className="mento">{portfolio.mentoNick}</div>
                        {user.id === portfolio?.mentoId && <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <p style={{ margin: '0px 5px' }}>포트폴리오 On/Off</p>
                            <Switch onChange={handleChange} checked={checked} />
                        </div>}

                    </div>

                    <div className="brief">"{portfolio.brief}"</div>
                    <div className="subjectWrapper">
                        {portfolio.subject?.map((item, index) => (
                            <div className="subject">
                                <div>{subjectPairs[item]}</div>
                            </div>
                        ))}
                    </div>
                    <hr />
                    <div className='scroll-box'>{portfolio.content}</div>
                    <div className="bottom" style={{ display: 'flex' }}>
                        <div className="price">1회 멘토링 : {portfolio.duration}시간 / {portfolio.tuition}원</div>
                        {user.id !== portfolio?.mentoId && <div style={{ justifySelf: 'center', marginTop: '20px' }}>
                            <Button variant="blue" className="joinBtn" onClick={onClickJoinBtn} disabled={isDisabled}>신청하기</Button>
                        </div>}

                    </div>
                </div> :
                    <div className="col-md-6">
                        {user.id === portfolio?.mentoId && <div className='manage-bar' style={{ justifyContent: 'space-between' }}>
                            <h5>포트폴리오 수정</h5>
                        </div>}
                        <hr />
                        <div className='mentoPic-area' >
                            <form>
                                <label
                                    htmlFor="imageUpload"
                                    className='btn-area'
                                >
                                    사진 수정
                                </label>
                                <input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        setInputImage(URL.createObjectURL(e.target.files[0]));
                                        setIsCrop(true);
                                    }}
                                    onCancel={() => {
                                        setIsCrop(false);
                                    }}
                                    style={{ 'display': 'none' }}
                                />
                            </form>
                            {imgUrl && <img
                                width={'150px'}
                                height={'150px'}
                                src={imgUrl}
                                className='child'
                            />}

                        </div>

                        <div className='form-wrapper-update'>
                            <input className="title-input-update" type='text' value={portfolio.brief} onChange={getValue} name='brief' />
                            <MDEditor height={865} style={{ width: '100%' }} value={portfolio.content} onChange={(value, event) => {
                                setPortfolio({
                                    ...portfolio,
                                    content: value
                                })
                            }} />
                            <div className='selectSubject'>
                                <hr />
                                <div>카테고리 선택(최대 3개)</div>
                                {words.map((word, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            color: selectedWords.includes(index) ? 'blue' : 'gray',
                                            marginRight: index % 3 === 2 ? '10px' : '5px'
                                        }}
                                        onClick={() => { handleWordClick(word) }}>
                                        #{word}
                                    </span>
                                ))}
                            </div>

                            <div className='selectPrice'>
                                1회당 가격:
                                <input className="duration-input" value={portfolio.duration} onChange={getValue} name='duration' />시간 /
                                <input className="tuition-input" value={portfolio.tuition} onChange={getValue} name='tuition' />원
                            </div>

                            <Button className="submit-button" variant="blue" style={{ margin: "5px" }}
                                onClick={() => { checkTitle(); }}>수정</Button>
                        </div>
                        {
                            !isCrop ? null :
                                <>
                                    <div className="room-cropper-wrap"></div>
                                    <div className="room-cropper-area">
                                        <h3> 멘토링 이미지 업로드
                                            <span>(150 X 150 권장)</span>
                                            <div className="x-btn" onClick={(e) => { e.stopPropagation(); setIsCrop(false); }}>X</div>
                                        </h3>
                                        <Cropper
                                            ref={cropperRef}
                                            style={{ height: 400, width: "100%" }}
                                            zoomTo={0.5}
                                            initialAspectRatio={1}
                                            preview=".img-preview"
                                            src={inputImage}
                                            viewMode={1}
                                            minCropBoxHeight={10}
                                            minCropBoxWidth={10}
                                            background={false}
                                            responsive={true}
                                            autoCropArea={1}
                                            checkOrientation={false}
                                            guides={true}
                                            aspectRatio={150 / 150}
                                        />
                                        <div className="btn-area">
                                            <button
                                                onClick={e => { e.stopPropagation(); onCrop(); }}
                                                className="room-crop-btn"
                                            >적용하기</button>
                                        </div>
                                    </div>
                                </>
                        }

                    </div>}
                <div className="col-md-3"></div>
            </div>
        </div >
    );
}

function Category() {
    return <>
        <h5>Mentoring</h5>
        <hr style={{ width: '60%', margin: '0 auto' }} />
        <Nav defaultActiveKey="#" className="flex-column">
            <Link to="#"><div style={{ color: '#282c34' }}>멘토링</div></Link>
        </Nav>
    </>
}

export default PortfolioManage