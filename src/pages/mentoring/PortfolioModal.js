import React, { useEffect, useState } from "react";
import "./mentoring.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
function PortfolioModal(props) {
    const setShowModal = props.setShowModal
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const [portfolio, setPortfolio] = useState({})
    const classes = [1, 2, 4, 8]
    const [selectedClass, setSelectedClass] = useState(1);
    const id = props.id
    const onClickExit = () => {
        setShowModal(false)
    }
    const handleClassChange = (e) => {
        setSelectedClass(parseInt(e.target.value, 10));
    };

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
        if(!user?.id||portfolio?.isJoining){return}
        axios({
            method: "POST",
            url: `/mentoring/${id}/apply`,
            data:{
                classes:selectedClass
            }
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
                <MDEditor.Markdown
                    style={{ padding: 10 }}
                    source={portfolio.content}
                />
            </div>
            <div className="bottom">
                <div className="price">1회 멘토링 : {portfolio.tuition}원</div>
                <div className="classes">횟수 선택: <fieldset>{classes.map((item) => <div className="classes-button" key={item} ><label >
                    <input type="radio" name="classes" value={item} defaultChecked={item===1} onChange={handleClassChange} />
                    <span>{item}회</span>
                </label></div>)}</fieldset>
                </div>
                <Button variant="blue" className="joinBtn" onClick={onClickJoinBtn} disabled={!user?.id||portfolio?.isJoining}>신청하기</Button>
            </div>

        </div>
    </div>
}

export default PortfolioModal