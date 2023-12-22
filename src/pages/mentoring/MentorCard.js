import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import "./mentorCard.css";
import { Card, Col } from "react-bootstrap";
import PortfolioModal from './PortfolioModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import ReviewModal from './ReviewModal';

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
function MentorCard(props) {
    const { mento } = props
    const [showModal, setShowModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const onClickCard=()=>{
        if(showReviewModal){return}
        setShowModal(true)
    }
    const onClickScore=(score,event)=>{
        event.stopPropagation();
        if(score===-1) return
        setShowReviewModal(true)
    }

    return <>
        {showModal && mento && <PortfolioModal id={mento.id} setShowModal={setShowModal} />}
        {showReviewModal && mento && <ReviewModal id={mento.id} setShowModal={setShowReviewModal} />}
        <Col key={mento.writer} xs={12} sm={4} md={3} className="mb-2" >
            <div className='mento-card' onClick={onClickCard}>
                <div>
                    <div className='mentoInfo'>
                        <div>
                            {mento.mentoPic && <img variant="top" className='mentoPic' src={`${mento.mentoPic}?version=${Math.random()}`} />}
                            <div className='mentorNick'>{mento.mentoNick}</div>
                        </div>
                        <div className='review' onClick={(event)=>onClickScore(mento.score,event)}>
                            <FontAwesomeIcon icon={faStar} className='Score' color='#FFD80C' />
                            <div className='mentoScore'>
                                {mento.score === -1 ? '평가 전' : mento.score}
                            </div>
                            {mento.score !== -1 && <FontAwesomeIcon icon={faChevronRight} color='#D6D6D6' />}
                        </div>
                    </div>
                    <div className='cardBrief'>{mento.brief}</div>
                </div>

                <div className='mento-subject'>
                    <div className="card-subjectWrapper">
                        {mento.subject?.map((item, index) => (
                            <>
                                {index < 2 && <div className="card-subject">
                                    <div>{subjectPairs[item]}</div>
                                </div>}
                            </>
                        ))}
                    </div>
                    <div className="card-subjectWrapper">
                        {mento.subject?.map((item, index) => (
                            <>
                                {index >= 2 && <div className="card-subject">
                                    <div>{subjectPairs[item]}</div>
                                </div>}
                            </>
                        ))}
                    </div>
                </div>

            </div>
        </Col>
    </>;
}

export default MentorCard