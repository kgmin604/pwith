import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import "./mentoring.css";
import { Card, Col } from "react-bootstrap";
import PortfolioModal from './PortfolioModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

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
function MentoCard(props) {
    const { mento } = props
    const [showModal, setShowModal] = useState(false);
    const score = [1, 2, 3, 4, 5]
    return <>
        {showModal && mento && <PortfolioModal id={mento.id} setShowModal={setShowModal} />}
        <Col key={mento.writer} xs={12} sm={6} md={4} className="mb-2" onClick={() => setShowModal(true)}>
            <Card style={{ width: '220px', height: '380px' }}>
                <Card.Img variant="top" src={`${mento.mentoPic}?version=${Math.random()}`} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                <Card.Body>
                    <Card.Title>{mento.writer}</Card.Title>
                    <Card.Text className='cardBrief'>{mento.brief}</Card.Text>
                    {mento.score === -1 && <Card.Text className='noScore'>아직 평가가 안됐습니다</Card.Text>}
                    {mento.score !== -1 && <Card.Text>{score.map((a, i) => {
                        if (a > mento.score) {
                            return <></>
                        }
                        return (<FontAwesomeIcon icon={faStar} className='Score' />)
                    })}</Card.Text>}
                    <Card.Text>
                        <div className="card-subjectWrapper">
                            {mento.subject?.map((item, index) => (
                                <div className="card-subject">
                                    <div>{subjectPairs[item]}</div>
                                </div>
                            ))}
                        </div>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    </>;
}

export default MentoCard