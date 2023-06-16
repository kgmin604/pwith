import React, { useEffect, useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import axios from "axios";
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateStudyPostList } from "../../store.js";
import parse from 'html-react-parser';



function StudyPost(props) {
    let user = useSelector((state) => state.user);
    let { id } = useParams();//글번호(주소창)
    let index = parseInt(id) - 1;//찐글번호

    const [post, setPost] = useState(null);

    useEffect(() => {
        axios.get(`/study/${id}`)
            .then(response => setPost(response.data))
            .catch(error => console.error(error));
    }, [id]);

    if (!post) {
        return <div>Loading...</div>;
    }

    const { title, writer, content, views, totalP } = post;
    const parsedContent = parse(content);

    const parse = require('html-react-parser');

    const sendLikeSignal = () => {
        axios.post(`/study/${id}/like`, {
            postId: post.id,
            userId: user.id,
        })
            // .then(function (response) {
            //     axios.get(`/study/${id}/like`)
            //         .then(function (response) {
            //             // GET 요청 응답 처리
            //         })
            //         .catch(function (error) {
            //             // GET 요청 실패 처리
            //         });
            // })
            .catch(function (error) {
                // 요청 실패 시 처리할 로직
            });
    };



    return (
        <div className="StudyPost">
            <h4 style={{ textAlign: 'left', fontFamily: 'TmoneyRoundWind' }}>스터디 모집</h4>
            <hr style={{ width: '100%', margin: '0 auto' }} />

            <div className="studyTitle">
                <p>{title}</p>
            </div>
            <hr style={{ width: '50%', margin: '0 auto' }} />

            {user.id === writer ? null
                : <Stack direction="horizontal" className="rewrite-delete-Btn align-right" gap={3}>
                    <Button variant='blue'>수정</Button>
                    <Button variant='blue'>삭제</Button>
                </Stack>
            }


            <div className="studyContent">
                <p cols="50" rows="10">
                    {parsedContent}
                </p>
            </div>

            <div>
                <p>인원수:{totalP}</p>
            </div>
            <Button variant='blue'>스터디 참여하기</Button>
            <Button variant='red' onClick={sendLikeSignal}>좋아요</Button>
        </div>
    );

}

export default StudyPost;