import React, { useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import axios from "axios";
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateStudyPostList } from "../../store.js";

function StudyPost(props) {
    let studyPostList = useSelector((state) => state.studyPostList);
    let dispatch = useDispatch();
    let { id } = useParams();
    let index = parseInt(id) - 1;
    let post = studyPostList[index];
    let studyId, title, writer, date, content, category, views, joiningP, totalP;

    console.log(post);
    if (Array.isArray(post)) {
        console.log(post[0]);
        studyId = post[0];
        title = post[1];
        writer = post[2];
        date = post[3];
        content = post[4];
        category = post[5];
        views = post[6];
        joiningP = post[7];
        totalP = post[8];
    } else {
        console.log('post is not an array');
    }



    return (
        <div className="StudyPost">
            <h4 style={{ textAlign: 'left', fontFamily: 'TmoneyRoundWind' }}>스터디 모집</h4>
            <hr style={{ width: '100%', margin: '0 auto' }} />

            <div className="studyTitle">
                <p>{title}</p>
            </div>
            <hr style={{ width: '50%', margin: '0 auto' }} />

            글작성자만 보이도록 구현해야함
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