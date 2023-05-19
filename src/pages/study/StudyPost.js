import React, { useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import axios from "axios";
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store";

function StudyPost(props) {
    let { id } = useParams();
    let index=parseInt(id)-1;
    let post = props.postList[index];
    let studyId = post[0];
    let title = post[1];
    let writer = post[2];
    let date = post[3];
    let content=post[4];
    let category = post[5];
    let views = post[6];
    let joiningP = post[7];
    let totalP = post[8];

    
    



    return (
        <div className="StudyPost">
            <h4 style={{ textAlign: 'left', fontFamily: 'TmoneyRoundWind' }}>스터디 모집</h4>
            <hr style={{ width: '100%', margin: '0 auto' }} />

            <div className="studyTitle">
                <p>{title}</p>
            </div>
            <hr style={{ width: '50%', margin: '0 auto' }} />

            {/* 글작성자만 보이도록 구현해야함 */}
            <Stack direction="horizontal" className="rewrite-delete-Btn align-right" gap={3}>
                <Button variant='blue'>수정</Button>
                <Button variant='blue'>삭제</Button>
            </Stack>

            <div className="studyContent">
                <p cols="50" rows="10">
                    {content}
                </p>
            </div>

            <div>
                <p>인원수:{joiningP}/{totalP}</p>
            </div>
            <Button variant='blue'>스터디 참여하기</Button>
        </div>
    );

}

export default StudyPost;