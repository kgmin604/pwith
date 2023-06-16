import "bootstrap/dist/css/bootstrap.min.css";
import "./community.css";
import "../../App.css";
import React, { useState } from 'react';
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearUser } from "../../store";

function CommunityQna(props) {
    let navigate = useNavigate();
    let user = useSelector((state) => state.user);
    let dispatch = useDispatch();

    let postList = [];
    return (
        <div className="CommunityQna">
            <div class="row">
                <div class="col-md-3">
                {Category()}
                </div>
                <div class="col-md-6">
                <Stack direction="horizontal" gap={3} style={{ padding: "5px" }}>
                    <Form.Control className="me-auto" placeholder="궁금한 것이 무엇인가요?" />
                    <Button variant="blue">🔍</Button>
                    <div className="vr" />
                    {user.id === "" ? null :
                        (<div>
                            <Nav.Link onClick={() => { navigate("../community/qna/create"); }}>
                                <Button variant="blue"
                                >New</Button>
                            </Nav.Link>
                        </div>)}

                </Stack>

                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>no.</th>
                            <th colSpan={2}>글제목</th>
                            <th>조회수</th>
                            <th>날짜</th>
                            <th>인원</th>
                        </tr>
                    </thead>
                    <tbody>

                        {postList.map(function (row, index) {
                            return (
                                <tr className="postCol" key={row[0]} onClick={() => navigate(`../${index + 1}`)}>
                                    <td>{row[0]}</td>
                                    <td colSpan={2}>{row[1]}</td>
                                    <td>{row[6]}</td>
                                    <td>{row[3]}</td>
                                    <td>{row[8]}</td>
                                </tr>
                            );
                        }
                        )}
                    </tbody>
                </Table>
                </div>
                

            </div>

        </div>
    );
}

function Category() {//카테고리
    return <>

        <h5>QnA</h5>
        <hr style={{ width: '60%', margin: '0 auto' }} />
        <Nav defaultActiveKey="#" className="flex-column">
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>웹개발</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>모바일 앱 개발</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>게임 개발</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>프로그래밍 언어</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>알고리즘 · 자료구조</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>데이터베이스</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>자격증</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>개발 도구</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>데이터 사이언스</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>데스크톱 앱 개발</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>교양 · 기타</div></Nav.Link>
        </Nav>
    </>

}

export default CommunityQna;