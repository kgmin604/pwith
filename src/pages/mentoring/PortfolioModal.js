import React, { useEffect, useState } from "react";
import "./mentoring.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";


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
function PortfolioModal(props) {
    const setShowModal = props.setShowModal
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const [isDisabled, setIsDisabled] = useState(user.id === null);
    const [portfolio, setPortfolio] = useState({})
    const id = props.id
    const onClickExit = () => {
        setShowModal(false)
    }
    useEffect(() => {
        axios({
            method: "GET",
            url: `/mentoring/${id}`,
        })
            .then(function (response) {
                setPortfolio(response.data.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);
    const onClickJoinBtn = () => {
        axios({
            method: "POST",
            url: `/mentoring/${id}/apply`,
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

    return <div className="modal-backdrop">
        <div className="modal-view">
            <div className="modal-title">
                <h3 >멘토링</h3>
                <FontAwesomeIcon icon={faXmark} size='lg' onClick={onClickExit} />
            </div>
            <div className="scroll-box">
                <div className="mento">{portfolio.mentoNick}</div>
                <div className="brief">{portfolio.brief}</div>
                <div className="subjectWrapper">
                    {portfolio.subject?.map((item, index) => (
                        <div className="subject">
                            <div>{subjectPairs[item]}</div>
                        </div>
                    ))}
                </div>
                <hr />
                <div>{portfolio.content}</div>
            </div>
            <div className="bottom">
                <div className="price">1회 멘토링 : {portfolio.duration}시간 / {portfolio.tuition}원</div>
                {portfolio.isFirst ?
                    <Button variant="blue" className="joinBtn" onClick={onClickJoinBtn} disabled={isDisabled}>첫수업 무료</Button> :
                    <Button variant="blue" className="joinBtn" onClick={onClickJoinBtn} disabled={isDisabled}>신청하기</Button>}
            </div>

        </div>
    </div>
}

export default PortfolioModal