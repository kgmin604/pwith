import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import "./mentoring.css";
import axios from 'axios';
import Switch from "react-switch";
import { Form, Nav, Stack, Button, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

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
    const [portfolio, setPortfolio] = useState({})
    const [checked, setChecked] = useState();
    const user = useSelector((state) => state.user);
    const [isDisabled, setIsDisabled] = useState(user.id === null);
    const navigate = useNavigate()
    const { myPortfolio } = useParams();
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
                if (response.data.data.isOpen === 1) { setChecked(true); } else { setChecked(false); }
            })
            .catch(function (error) {
                console.log(error);
            });

    }, []);

    const modifyPortfolio = () => { }

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
    return (
        <div className="PortfolioManage">
            <div className="row">
                <div className="col-md-3" style={{ textAlign: 'center' }}>
                    <Category />
                </div>

                <div className="col-md-6">
                    {user.id === portfolio?.mentoId && <div className='manage-bar' style={{ justifyContent: 'space-between' }}>
                        <h5>포트폴리오 관리</h5>
                        <div className='manage-bar' style={{ gap: 5, margin: '0px 20px' }}>
                            <div onClick={modifyPortfolio}>
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
                    <div className="bottom">
                        <div className="price">1회 멘토링 : {portfolio.duration}시간 / {portfolio.tuition}원</div>
                        {user.id !== portfolio?.mentoId && portfolio.isFirst ?
                            <Button variant="blue" className="joinBtn" onClick={onClickJoinBtn} disabled={isDisabled}>첫수업 무료</Button> :
                            <Button variant="blue" className="joinBtn" onClick={onClickJoinBtn} disabled={isDisabled}>신청하기</Button>}
                    </div>
                </div>
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
            <Link to="../mentoring/create"><div style={{ color: '#282c34' }}>포트폴리오 작성</div></Link>
            <Link to="../mentoring/5"><div style={{ color: '#282c34' }}>포트폴리오 관리</div></Link>
        </Nav>
    </>
}

export default PortfolioManage