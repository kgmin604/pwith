import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import "./mentoring.css";
import { Card, Col } from "react-bootstrap";
import PortfolioModal from './PortfolioModal';

function MentoCard(props) {
    const { mento } = props
    const [showModal, setShowModal] = useState(false);
    return <>
        {showModal && mento && <PortfolioModal id={mento.id} setShowModal={setShowModal} />}
        <Col key={mento.writer} xs={12} sm={6} md={4} className="mb-2" onClick={() => setShowModal(true)}>
            <Card style={{ width: '15rem', height: '20rem' }}>
                <Card.Img variant="top" src={mento.mentoPic} style={{ width: '100%', height: '50%', objectFit: 'cover' }} />
                <Card.Body>
                    <Card.Title>{mento.writer}</Card.Title>
                    <Card.Text>{mento.brief}</Card.Text>
                </Card.Body>
            </Card>
        </Col>
    </>;
}

export default MentoCard