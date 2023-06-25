import React, { useEffect, useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../study/study.css";
import "./community.css";
import "../../App.css";
import axios from "axios";
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import LikeAndComment from './QnaLikeAndComment';

function QnaPost(props) {
    let user = useSelector((state) => state.user);
    let navigate = useNavigate();
    let { id } = useParams();

    const [post, setPost] = useState(null);
    const [reply, setReply] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);


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

    function updatePost(content) {
        axios.put(`/community/qna/${id}`, {
            postId: `${id}`,
            content: `${content}`
        })
            .then(function (response) {
                setIsUpdating(false);
                navigate(`../community/qna/${id}`);
                alert("글 수정 성공");
            }).catch(function (error) {
                // 오류발생시 실행
            })
    }

    function deletePost() {
        axios.delete(`/community/qna/${id}`, {
            data: {
                postId: `${id}`
            }
        })
            .then(function (response) {
                navigate(`../community/qna/main`);
                alert("글 삭제 성공");
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    function checkDelete() {
        // eslint-disable-next-line no-restricted-globals
        const result = confirm("정말 글을 삭제하시겠습니까?");
        if (result) {
            deletePost()
        }
    }


    return (
        <div className="QnaPost">
            {
                !isUpdating?<div>
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
                                        <button className="control-btn" onClick={()=>setIsUpdating(true)}>수정</button>
                                        <button className="control-btn" onClick={()=>checkDelete()}>삭제</button>
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
                    <LikeAndComment id={id} likes={post.likes} liked={post.liked} reply={reply} />

                    <div class="col-md-3"></div>
                </div>
            </div>

        </div>:<div>
          <div className='StudyCreate' style={{textAlign:'start',width:'60%',margin:'auto'}}>
                    <h5>QnA 글 수정하기</h5>
                    <h3>{post.title}</h3>
                    <hr style={{ width: '100%', margin: '0 auto',marginBottom:'10px' }} />
                    <div className='form-wrapper' style={{width:'100%'}}>
                        <div style={{width:'100%'}}>
                            <CKEditor
                                editor={ClassicEditor}
                                data=" "
                                config={{
                                    placeholder: "내용을 입력하세요.",
                                }}
                                onReady={editor => {
                                    editor.setData(post.content);
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setPost({
                                        ...post,
                                        content: data
                                    })
                                }}
                                
                            />
                            <div style={{display:'flex',justifyContent:'center'}}>
                                    <Button
                                        className="submit-button"
                                        variant="blue"
                                        onClick={() => updatePost(post.content)}
                                        style={{margin:'10px'}}
                                    > 수정
                                    </Button>
                                </div>

                            </div>


                        </div>


                    </div>
            </div>}
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