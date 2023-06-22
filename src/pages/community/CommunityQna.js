import "bootstrap/dist/css/bootstrap.min.css";
import "./community.css";
import "../study/study.css"
import "../../App.css";
import React, { useState, useEffect } from 'react';
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

function CommunityQna(props) {
    let navigate = useNavigate();
    let user = useSelector((state) => state.user);
    let dispatch = useDispatch();

    let [postList, setPostList] = useState([]);

    useEffect(() => {
        axios({
            method: "GET",
            url: "/community/qna/main",
        })
            .then(function (response) {
                console.log(response.data);
                setPostList(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);
    return (
        <div className="CommunityQna">
            <div class="row">
                <div class="col-md-3">
                    {Category()}
                </div>
                <div class="col-md-6 Board">
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

                    {/* <Table bordered hover>
                        <thead>
                            <tr>
                                <th>no.</th>
                                <th colSpan={2}>글제목</th>
                                <th>글쓴이</th>
                                <th>날짜</th>
                                <th>조회수</th>
                                <th>좋아요</th>
                            </tr>
                        </thead>
                        <tbody>
                            {postList.map(function (post, index) {
                                let date = post.curDate.slice(2, 10);
                                return (
                                    <tr className="postCol pointer-cursor" key={post.id} onClick={() => navigate(`../community/qna/${post.id}`)}>
                                        <td >{post.id}</td>
                                        <td colSpan={2} className="text-container">{post.title}</td>
                                        <td>{post.writer}</td>
                                        <td>{date}</td>
                                        <td>{post.views}</td>
                                        <td>{post.likes}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table> */}

                    <div className="posts-area">
                        {
                            postList === null ? null :
                                <>
                                    <div className="post-item" style={{ 'height': '40px' }}>
                                        <strong className=" post-comm">No.</strong>
                                        <strong className=" post-title">제목</strong>
                                        <strong className=" post-writer">글쓴이</strong>
                                        <strong className=" post-comm">작성일</strong>
                                        <strong className=" post-comm">좋아요</strong>
                                        <strong className=" post-comm">조회수</strong>
                                    </div>
                                    <hr style={{ 'width': '100%', "margin": '5px auto' }} />
                                    {
                                        postList.map((post, i) => {
                                            let date = post.curDate.slice(2, 10);
                                            return (
                                                <div
                                                    className="post-item hover-effect"
                                                    key={i}
                                                    onClick={(e) => { e.stopPropagation(); navigate(`../community/qna/${post.id}`) }}
                                                >
                                                    <span className=" post-comm">{post.id}</span>
                                                    <span className=" post-title">{post.title}</span>
                                                    <span className=" post-writer">{post.writer}</span>
                                                    <span className=" post-comm">{post.curDate}</span>
                                                    <span className=" post-comm">{post.likes}</span>
                                                    <span className=" post-comm">{post.views}</span>
                                                </div>
                                            );
                                        })}
                                    <hr style={{ 'width': '100%', "margin": '5px auto' }} />
                                </>
                        }

                    </div>
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