import React, { useEffect, useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import "./mentoring.css";
import { Form, Nav, Stack, Button, Card, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { Link, useNavigate} from "react-router-dom";

function MentoringMain() {
    const navigate = useNavigate();

    const [mentoList, setMentoList] = useState([]);

    useEffect(() => {
        axios({
            method: "GET",
            url: "/mentoring/main",
        })
            .then(function (response) {
                setMentoList(response.data);
            })
            .catch(function (error) {
                console.log(error);
                alert("글을 불러오지 못했습니다.");
            });

    }, []);

    useEffect(()=>{
        console.log(mentoList);
    },[mentoList])


    return (
        <div className="MentoringMain">
            <div class="row">
                <div class="col-md-3">
                    {Category()}
                </div>

                <div class="col-md-8">
                    <Stack direction="horizontal" gap={3} style={{ padding: "5px" }}>
                        <Form.Control className="me-auto" placeholder="원하는 멘토를 찾아보세요!" />
                        <Button variant="blue">🔍</Button>
                    </Stack>
                    <hr />
                    <Row className="row-cols-1 row-cols-md-4 g-2" style={{ padding: '10px' }}>
                        {mentoList.map((k, i) => (
                            <Col key={i} xs={12} sm={6} md={4} className="mb-2">
                                <Card style={{ width: '15rem', height: '20rem' }}>
                                    <Card.Img variant="top" src="https://velog.velcdn.com/images/parkheroine/post/00699864-77b5-46bf-8f79-1afe12868918/image.jpeg" style={{ width: '100%', height: '50%', objectFit: 'cover' }}/>
                                    <Card.Body>
                                        <Card.Title>{k.writer}</Card.Title>
                                        <Card.Text>k.title</Card.Text>
                                        <Button variant="blue" onClick={() => navigate(`../mentoring/${k.writer}`)}>상세정보</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>






                </div>

                <div class="col-md-3"></div>
            </div>


        </div>
    );
}

function Category() {//카테고리
    return <>

        <h5>Mentoring</h5>
        <hr style={{ width: '60%', margin: '0 auto' }} />
        <Nav defaultActiveKey="#" className="flex-column">
            <Link to="#"><div style={{ color: '#282c34' }}>멘토링</div></Link>
            <Link to="../mentoring/create"><div style={{ color: '#282c34' }}>포트폴리오 업로드</div></Link>
        </Nav>
    </>

}


export default MentoringMain;