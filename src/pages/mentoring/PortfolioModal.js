import React from "react";
import "./mentoring.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";

function PortfolioModal(props) {
    const setShowModal = props.setShowModal
    const portfolio = props.portfolio
    console.log(portfolio)
    const onClickExit = () => {
        setShowModal(false)
    }
    return <div className="modal-backdrop">
        <div className="modal-view">
            <div className="modal-title">
                <h3 >멘토링</h3>
                <FontAwesomeIcon icon={faXmark} size='lg' onClick={onClickExit} />
            </div>
            <div className="scroll-box">
                <div className="mento">{portfolio.writer}</div>
                <div className="brief">{portfolio.brief}</div>
                <div className="subjectWrapper">
                    {portfolio.subject.map((item, index) => (
                        <div className="subject">
                            <div>{item}</div>
                        </div>
                    ))}
                </div>
                <hr />
                <div>{portfolio.content}</div>
            </div>
            <div className="bottom">
                <div className="price">1회 멘토링 : 1시간 / 29,700원 / 1명</div>
                <Button variant="blue" className="joinBtn">신청하기</Button>
            </div>

        </div>
    </div>
}

export default PortfolioModal