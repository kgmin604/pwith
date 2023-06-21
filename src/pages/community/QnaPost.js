import React, { useEffect, useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../study/study.css";
import "./community.css";
import "../../App.css";
import axios from "axios";
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function QnaPost(props) {
    let user = useSelector((state) => state.user);
    let { id } = useParams();

    const [post, setPost] = useState(null);

    useEffect(() => {
        axios.get(`/community/qna/${id}`)
            .then((response) => {
                setPost(response.data)
                console.log(response.data)
            })
            .catch();
    }, []);

    if (!post) {
        return <div>Loading...</div>;
    }

    const { title, writer, content, views, totalP, commentNum, likes, liked } = post;
    const parse = require('html-react-parser');
    const parsedContent = parse(content);


    return (
        <div className="QnaPost">
            <div class="row">
                <div class="col-md-3">
                    {Category()}
                </div>
                <div class="col-md-6">
                    <h4 style={{ textAlign: 'left' }}>Qna</h4>
                    <hr style={{ width: '100%', margin: '0 auto' }} />

                    <div className="studyTitle">
                        <p>{title}</p>
                    </div>
                    <hr style={{ width: '50%', margin: '0 auto' }} />

                    {user.id === writer ? <Stack direction="horizontal" className="rewrite-delete-Btn align-right" gap={3}>
                        <Button variant='blue'>수정</Button>
                        <Button variant='blue'>삭제</Button>
                    </Stack>
                        : null
                    }


                    <div className="studyContent">
                        <p cols="50" rows="10">
                            {parsedContent}
                        </p>
                    </div>
                    {/* <LikeAndComment id={id} like={post.likes}/> */}

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