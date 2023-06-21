import React, { useEffect, useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./mentoring.css";
import "../../App.css";
import axios from "axios";
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Comment from './Comment.js';

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

    let parsedContent = null;
    if (post.content != null) {
        const parse = require('html-react-parser');
        parsedContent = parse(post.content);
    }






    return (
        <div className="MentoringPost">

            <div class="row">
                <div class="col-md-3"></div>


                <div class="col-md-6">
                    <h4 >멘토링</h4>
                    <hr style={{ width: '100%', margin: '0 auto' }} />
                    {
                        user.id === post.mento ? <Stack direction="horizontal" className="rewrite-delete-Btn align-right" gap={3} style={{margin:'5px'}}>
                            <Button variant='blue'>수정</Button>
                            <Button variant='blue'>삭제</Button>
                        </Stack>
                            : null
                    }

                    <div className="MentoringTitle" style={{ display: 'flex', justifyContent: 'center' }} >
                        <img src={post.image} style={{ borderRadius: '100%', width: '150px', height: '150px',margin:'5px' }} />

                    </div>
                    <p>{post.mento}</p>
                    <hr style={{ width: '50%', margin: '0 auto' }} />

                    


                    <div className="mentoringContent">
                        <p cols="50" rows="10">
                            {parsedContent}
                        </p>
                    </div>
                    <Comment />
                    {/* <Comment id={id} mento={post.mento} review={post.review}/> */}
                </div>


                <div class="col-md-3">
                </div>


            </div>
        </div>
    );

}

export default MentoringPost;