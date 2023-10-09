import React, { useState, useEffect, useRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import "./mentoring.css";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MDEditor from '@uiw/react-md-editor';
import Cropper from "react-cropper";
import 'cropperjs/dist/cropper.css';

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
function MentoringCreate() {

    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const [selectedFile, setSelectedFile] = useState(null);
    const words = ['웹개발', '모바일 앱 개발', '게임 개발', '프로그래밍 언어', '알고리즘 · 자료구조', '데이터베이스', '자격증', '개발 도구', '데이터 사이언스', '데스크톱 앱 개발', '교양 · 기타'];
    const [selectedWords, setSelectedWords] = useState([]); // 클릭한 단어 배열
    const [isCrop, setIsCrop] = useState(false);
    const [inputImage, setInputImage] = useState(null); // 유저가 첨부한 이미지
    const [imgUrl, setImgUrl] = useState(null);
    const cropperRef = useRef(null); // react-cropper 컴포넌트를 참조
    const [portfolio, setPortfolio] = useState({
        subject: [],
        brief: '',
        content: '',
        tuition: 20000,
        duration: 1,
    })

    function postPortfolio() {
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
            axios.post('/mentoring', formData)
                .then((response) => {
                    alert("새 글이 등록되었습니다.");
                    navigate("../mentoring/main");
                })
                .catch((error) => {
                    console.error(error);
                    alert("요청을 처리하지 못했습니다.");
                });
        })
    }

    const onCrop = () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        if (cropper) {
            setIsCrop(false);
            setImgUrl(cropper.getCroppedCanvas().toDataURL());
        }
    };

    const handleWordClick = (word) => {
        const wordIndex = words.indexOf(word);
        if (selectedWords.includes(wordIndex)) {
            setSelectedWords(prevWords => prevWords.filter(w => w !== wordIndex));
        } else {
            setSelectedWords(prevWords => [...prevWords, wordIndex]);
        }
    };

    function checkTitle() {
        portfolio['title'] === "" || portfolio['content'] === "" ? alert("제목 또는 내용을 입력해주세요.") :
            postPortfolio();
    }

    const getValue = e => {
        const { name, value } = e.target;
        setPortfolio({
            ...portfolio,
            [name]: value
        })
    };

    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        console.log(portfolio);
    }, [portfolio])

    const onUpload = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    return (
        <div className="MentoringCreate">
            <h5 style={{ fontFamily: 'TmoneyRoundWind' }}>포트폴리오 작성하기</h5>

            <div className='mentoPic-area' >
                <form>
                    <label
                        htmlFor="imageUpload"
                        className='btn-area'
                    >
                       사진 업로드
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

            <div className='form-wrapper'>
                <input className="title-input" type='text' placeholder='한줄소개' onChange={getValue} name='brief' />
                <MDEditor height={865} value={portfolio.content} onChange={(value, event) => {
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
                    <input className="duration-input" type='text' placeholder="1" onChange={getValue} name='duration' />시간 /
                    <input className="tuition-input" type='text' placeholder="20000" onChange={getValue} name='tuition' />원
                </div>

                <Button className="submit-button" variant="blue" style={{ margin: "5px" }}
                    onClick={() => { checkTitle(); }}>등록</Button>
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

        </div>


    );
}




export default MentoringCreate;