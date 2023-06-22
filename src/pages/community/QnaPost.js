import React, { useEffect, useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../study/study.css";
import "./community.css";
import "../../App.css";
import axios from "axios";
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import LikeAndComment from './QnaLikeAndComment';

function QnaPost(props) {
    let user = useSelector((state) => state.user);
    let { id } = useParams();

    const [post, setPost] = useState(null);
    const [reply, setReply] = useState(null);

    useEffect(() => {
        axios.get(`/community/qna/${id}`)
            .then((response) => {
                setPost(response.data.post);
                setReply(response.data.reply);
                console.log(response.data);
            })
            .catch();
    }, []);

    if (!post) {
        return <div>Loading...</div>;
    }

    const parse = require('html-react-parser');
    const parsedContent = parse(post.content);
    const date = JSON.stringify(post.curDate).slice(3, 11);


    return (
        <div className="QnaPost">
            <div class="row">
                <div class="col-md-3">
                    {Category()}
                </div>
                <div class="col-md-6 StudyPost">
                    <h2 style={{ textAlign: 'left' }}>Qna</h2>
                    <hr style={{ width: '100%', margin: '0 auto' }} />

                    <div className="study-header">
                        <h3>{post.title}</h3>
                        <p className="info">
                            <strong>작성자</strong> <span className="info-content">{post.writer}</span>
                            <span className="line">|</span>
                            <strong>조회수</strong> <span className="info-content">{post.views}</span>
                            <span className="line">|</span>
                            <strong>등록일</strong> <span className="info-content">{date}</span>
                            {
                                user.id === post.writer ?
                                    <span className="control-part">
                                        <button className="control-btn">수정</button>
                                        <button className="control-btn">삭제</button>
                                    </span>
                                    :
                                    null
                            }
                        </p>
                    </div>
                    <hr style={{ width: '100%', margin: '0 auto' }} />

                    <div className="studyContent">
                        <p cols="50" rows="10">
                            {parsedContent}
                        </p>
                    </div>
                    <LikeAndComment id={id} likes={post.likes} reply={reply} />

                    <div class="col-md-3"></div>
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

export default QnaPost;