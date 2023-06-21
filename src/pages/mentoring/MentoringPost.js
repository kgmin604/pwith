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
    const [review, setReview] = useState([]);
    const [dataUrl, setDataUrl] = useState('');

    useEffect(() => {
        axios.get(`/mentoring/${id}`)
            .then(response => {
                console.log(response.data); // post에 담긴 데이터 확인

                setPost(response.data.portfolio);
                setReview(response.data.review);

                const image = response.data.portfolio.image; // 이미지 데이터
                if (typeof image === 'string' && image.length > 0) {
                    const url = `data:image/jpeg;base64,${image}`;
                    setDataUrl(url);
                } else {
                    console.error('Invalid image data:', image);
                }
            })
            .catch(error => console.error(error));
    }, []);

    function joinMentoring(){
        if(user.id===null){
            alert("로그인이 필요합니다")
        }
        else{
            axios.get(`/mentoring/${id}`, {
                params: {
                  apply: 'go'
                }
              })
              .then(function (response) {
                   alert("신청이 완료되었습니다.")
              }).catch(function (error) {
                    console.log(error);
              }).then(function() {
                  // 항상 실행
              });
        }
    }

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
                    <h5>{post.brief}</h5>
                    <hr style={{ width: '100%', margin: '0 auto' }} />
                    {
                        user.id === post.mento ? <Stack direction="horizontal" className="rewrite-delete-Btn align-right" gap={3} style={{ margin: '5px' }}>
                            <Button variant='blue'>수정</Button>
                            <Button variant='blue'>삭제</Button>
                        </Stack>
                            : null
                    }

                    <div className="MentoringTitle" style={{ display: 'flex', justifyContent: 'center' }} >
                        <img src={dataUrl} style={{ borderRadius: '100%', width: '150px', height: '150px', margin: '10px' }} />

                    </div>
                    <h4>{post.mento}</h4>
                    <hr style={{ width: '50%', margin: '0 auto' }} />

                    <div className="mentoringContent">
                        <p cols="50" rows="10">
                            {parsedContent}
                        </p>
                    </div>

                    <Button variant='blue' onClick={()=>joinMentoring()} style={{margin:'20px'}}>멘토링 신청하기</Button>
                    <Comment id={id} mento={post.mento} review={review} />
                </div>


                <div class="col-md-3">
                </div>


            </div>
        </div>
    );

}

export default MentoringPost;