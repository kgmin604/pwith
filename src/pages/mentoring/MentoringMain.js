import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import "./mentoring.css";
import { Form, Nav, Stack, Button, Card, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import PortfolioModal from './PortfolioModal';

function MentoringMain() {
    const navigate = useNavigate();
    const mentoList = [
        {
            'writer': '멘토1',
            'subject': ['과목1', '과목2', '과목3', '과목4'],
            'image': "https://cdn.inflearn.com/public/courses/329963/cover/26550c58-624a-41c8-86dc-fea75b6c3b22/thumbnail-frontnew.png",
            'brief': '한줄소개1',
            'content': '이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!많은 관심 부탁드립니다:)전자책 소개 링크 바로가기 🎇 안녕하세요.게임 프로그래머로 7년째 일하고 있는 물고기입니다 🥕게임 업계가 궁금하시거나 게임 프로그래머로 일하고 싶은 분들, 개발 관련 고민이 있으신 분들 편하게 연락 주세요!✍ 멘토링 분야게임 프로그래머 포트폴리오 만들기이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!이번에 멘토링 노하우를 듬뿍담은 전자책이 출간되었습니다!'
        },
        {
            'writer': '멘토2',
            'subject': ['과목1', '과목2'],
            'image': "https://cdn.inflearn.com/public/courses/329963/cover/26550c58-624a-41c8-86dc-fea75b6c3b22/thumbnail-frontnew.png",
            'brief': '한줄소개2',
            'content': '내용내용내용'
        },
        {
            'writer': '멘토3',
            'subject': ['과목1'],
            'image': "https://cdn.inflearn.com/public/courses/329605/cover/7f7d4d9a-e739-482c-8e16-71081b4793b5/329605-eng.jpg",
            'brief': '한줄소개3',
            'content': '내용내용내용'
        }, {
            'writer': '멘토4',
            'subject': ['과목1', '과목2', '과목3'],
            'image': "https://cdn.inflearn.com/public/courses/329963/cover/26550c58-624a-41c8-86dc-fea75b6c3b22/thumbnail-frontnew.png",
            'brief': '한줄소개4',
            'content': '내용내용내용'
        }
    ]
    // const [mentoList, setMentoList] = useState([]);
    const [userinput, setUserinput] = useState('');


    // useEffect(() => {
    //     axios({
    //         method: "GET",
    //         url: "/mentoring/main",
    //     })
    //         .then(function (response) {
    //             setMentoList(response.data);
    //             console.log(response.data);
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });

    // }, []);

    // useEffect(() => {
    //     console.log(mentoList);
    // }, [mentoList])

    function searchMentor() {
        axios({
            method: "GET",
            url: "/mentoring/main",
            params: {
                value: `${userinput}`
            }
        })
            .then(function (response) {
                // setMentoList(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div className="MentoringMain">
            <div className="row">
                <div className="col-md-3">
                    {Category()}
                </div>

                <div className="col-md-8">
                    <Stack direction="horizontal" gap={3} style={{ padding: "5px" }}>
                        <Form.Control
                            className="me-auto"
                            placeholder="원하는 멘토를 찾아보세요!"
                            onChange={(e) => { e.stopPropagation(); setUserinput(e.target.value); }}
                            onKeyDown={(e) => { if (e.key === "Enter") searchMentor(); }}
                        />
                        <Button
                            variant="blue"
                            onClick={(e) => { e.stopPropagation(); searchMentor(); }}
                        >
                            🔍
                        </Button>
                    </Stack>
                    <hr />
                    <Row className="row-cols-1 row-cols-md-4 g-2" style={{ padding: '10px' }}>
                        {mentoList.map((k, i) => {
                            return (MentoCard(k, i)
                            )
                        })}
                    </Row>
                </div>

                <div className="col-md-3"></div>
            </div>
        </div>
    );
}

function MentoCard(k, i) {
    const [showModal, setShowModal] = useState(false);
    return <>
        {showModal && <PortfolioModal portfolio={k} setShowModal={setShowModal} />}
        <Col key={i} xs={12} sm={6} md={4} className="mb-2" onClick={() => setShowModal(true)}>
            <Card style={{ width: '15rem', height: '20rem' }}>
                <Card.Img variant="top" src={k.image} style={{ width: '100%', height: '50%', objectFit: 'cover' }} />
                <Card.Body>
                    <Card.Title>{k.writer}</Card.Title>
                    <Card.Text>{k.brief}</Card.Text>
                    {/* <Button variant="blue" onClick={() => navigate(`../mentoring/${k.writer}`)}>상세정보</Button> */}
                </Card.Body>
            </Card>
        </Col>
    </>;
}

function Category() {
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
