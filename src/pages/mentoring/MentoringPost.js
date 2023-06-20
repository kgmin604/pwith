import React, { useEffect, useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./mentoring.css";
import "../../App.css";
import axios from "axios";
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LikeAndComment from './likeAndComment.js';

function MentoringPost() {
    let user = useSelector((state) => state.user);
    let { id } = useParams();

    const [post, setPost] = useState({});

    useEffect(() => {
        axios.get(`/mentoring/${id}`)
            .then(response => {
                setPost(response.data);
                console.log(response.data); // post에 담긴 데이터 확인
            })
            .catch(error => console.error(error));
    }, []);


    // const { content,image,subject, writer} = post;
    const parse = require('html-react-parser');
    const parsedContent = parse(post.content);

    



    return (
        <div className="MentoringPost">
            <h4 >멘토링</h4>
            <hr style={{ width: '100%', margin: '0 auto' }} />

            <div className="MentoringTitle">
                
                <p>{post.writer}</p>
            </div>
            <hr style={{ width: '50%', margin: '0 auto' }} />

            {user.id === post.writer ? <Stack direction="horizontal" className="rewrite-delete-Btn align-right" gap={3}>
                    <Button variant='blue'>수정</Button>
                    <Button variant='blue'>삭제</Button>
                </Stack>
                : null
            }


            <div className="mentoringContent">
                <p cols="50" rows="10">
                    {parsedContent}
                </p>
            </div>
            <LikeAndComment />
            {/* <LikeAndComment id={post.writer} commentNum={post.commentNum}/> */}
        </div>
    );

}

export default MentoringPost;