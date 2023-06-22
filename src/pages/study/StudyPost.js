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

    let navigate = useNavigate();

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

    function joinStudyRoom(){
        axios({
            method: "POST",
            url: `/study/${id}`,
            data: {
                roomId: `${post.roomId}`
            }
        })
        .then(function (response) {
            alert("스터디 참여 완료!");
            navigate("../studyroom");
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    return (
        <div className="StudyPost">
            <h2>스터디 모집</h2>
            <hr style={{ width: '100%', margin: '0 auto' }} />
            <div className="study-header">
                <h3>{post.title}</h3>
                <p className = "info">
                    <strong>작성자</strong> <span className="info-content">{post.writer}</span>
                    <span className="line">|</span>
                    <strong>조회수</strong> <span className="info-content">{post.views}</span>
                    <span className="line">|</span>
                    <strong>등록일</strong> <span className="info-content">{date}</span>
                    {
                        user.id === post.writer ?
                        <span className="control-part">
                            <button className="control-btn">수정</button>
                            <button className="control-btn">삭제</button>
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

            <div className="studyroom-join">
                <img src='/img_notebook.png'></img>
                <span>{post.roomTitle}</span> {/* 현재 dummy 값! 받아와서 수정 */}
                <Button 
                    className="button" 
                    variant='blue'
                    onClick={(e)=>{e.stopPropagation(); joinStudyRoom();}}
                >참여하기</Button>
            </div>
            
            <hr style={{ width: '100%', margin: '0 auto' }} />
            
            <LikeAndComment id={id} likes={post.likes} reply={reply}/>
        </div>
    );

}

export default StudyPost;