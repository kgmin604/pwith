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

    useEffect(() => {
        axios.get(`/study/${id}`)
            .then((response)=>{
                setPost(response.data)
                console.log(response.data)
            })
            .catch();
    }, []);

    if (!post) {
        return <div>Loading...</div>;
    }

    const { title, writer, content, views, totalP,commentNum,likes,commentList } = post;
    const parse = require('html-react-parser');
    const parsedContent = parse(content);


    return (
        <div className="StudyPost">
            <h4 style={{ textAlign: 'left'}}>스터디 모집</h4>
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

            <div>
                <p>인원수:{totalP}</p>
            </div>
            <Button variant='blue'>스터디 참여하기</Button>
            <LikeAndComment id={id} likes={post.likes} liked={post.liked} replyList={post.replyList}/>
        </div>
    );

}

export default StudyPost;