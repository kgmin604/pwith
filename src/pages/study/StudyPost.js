import React, { useEffect, useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import axios from "axios";
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LikeAndComment from './likeAndComment.js';

function StudyPost(props) {
    let user = useSelector((state) => state.user);
    let { id } = useParams();

    const [post, setPost] = useState(null);
    const [reply,setReply] = useState(null);

    useEffect(() => {
        axios.get(`/study/${id}`)
            .then((response)=>{
                setPost(response.data.post);
                setReply(response.data.reply);
                console.log(response.data)
            })
            .catch();
    }, []);

    if (!post) {
        return <div>Loading...</div>;
    }

    const parse = require('html-react-parser');
    const parsedContent = parse(post.content);
    const date=JSON.stringify(post.curDate).slice(3,11);


    return (
        <div className="StudyPost">
            <h4 style={{ textAlign: 'left'}}>스터디 모집</h4>
            <hr style={{ width: '100%', margin: '0 auto' }} />

            <div className="studyTitle">
                <h5>{post.title}</h5>
            </div>
            <hr style={{ width: '50%', margin: '0 auto' }} />
          
                <p className="align-right font-sm">조회수:{post.views}</p>
                <p className="align-right font-sm">작성 날짜: {date}</p>

            {user.id === post.writer ? <Stack direction="horizontal" className="rewrite-delete-Btn align-right" gap={3}>
                    <Button variant='blue'>수정</Button>
                    <Button variant='blue'>삭제</Button>
                </Stack>
                : null}


            <div className="studyContent">
                <p cols="50" rows="10">
                    {parsedContent}
                </p>
            </div>

            <Button variant='blue'>스터디 참여하기</Button>
            <LikeAndComment id={id} likes={post.likes} reply={reply}/>
        </div>
    );

}

export default StudyPost;