import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import axios from "axios";
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

function StudyPost() {
    let navigate = useNavigate();
    return (
        <div className="StudyPost">
            <div class="row">

                {/* 카테고리 */}
                <div class="col-md-3" style={{ fontFamily: 'TmoneyRoundWind' }}>
                    <h5 >분야별 스터디 보기</h5>
                    <hr style={{ width: '60%', margin: '0 auto' }} />
                    <Nav defaultActiveKey="/home" className="flex-column">
                        <Nav.Link href="#"><div style={{ color: '#282c34' }}>프론트엔드</div></Nav.Link>
                        <Nav.Link eventKey="link-1"><div style={{ color: '#282c34' }}>백엔드</div></Nav.Link>
                        <Nav.Link eventKey="link-2"><div style={{ color: '#282c34' }}>인공지능</div></Nav.Link>
                        <Nav.Link eventKey="link-2"><div style={{ color: '#282c34' }}>컴퓨터사이언스</div></Nav.Link>
                    </Nav>
                </div>

                {/* 글내용*/}
                <div class="col-md-6">

                    <h4 style={{ textAlign: 'left', fontFamily: 'TmoneyRoundWind' }}>스터디 모집</h4>
                    <hr style={{ width: '100%', margin: '0 auto' }} />

                    <div className="studyTitle">
                        <h5>글제목입니다</h5>
                    </div>
                    <hr style={{ width: '50%', margin: '0 auto' }} />

                    {/* 글작성자만 보이도록 구현해야함 */}
                    <Stack direction="horizontal" className="rewrite-delete-Btn align-right" gap={3}> 
                        <Button variant='blue'>수정</Button>
                        <Button variant='blue'>삭제</Button>
                    </Stack>

                    <div className="studyContent">
                        <p cols="50" rows="10">
                            내용 블라 블라 블라 ...
                            내용 블라 블라 블라 ...
                            내용 블라 블라 블라 ...
                            내용 블라 블라 블라 ...
                        </p>
                    </div>

                    <Button variant='blue'>스터디 참여하기</Button>

                </div>
            </div>
        </div>

    );

}

export default StudyPost;