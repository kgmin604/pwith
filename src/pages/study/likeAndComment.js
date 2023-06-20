import React, { useEffect, useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import axios from "axios";
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import heartOutline from "./img/heart-outline.png";
import heartFull from "./img/heart-full.png"
import comment from "./img/comment.png"

function LikeAndComment(props) {
    const id = props.id;
    const [likes, setLikes] = useState(props.like);
    // const [commentNum,setCommentNum]=useState(props.commentNum);
    // const [liked,setLiked]=useState(props.liked);

    //더미데이터
    const [liked,setLiked]=useState(false);

    //liked가 1이면 꽉찬 하트, liked가 0이면 빈 하트 누르면 post 요청 보내고 프론트에서 토글

    // useEffect(() => {
    //     console.log(liked);
    //     // 원하는 동작 수행
    //   }, [liked]);

    const sendLikeSignal = () => {
        setLiked(!liked);
        // axios.post(`/study/${id}/like`, {
        //     postId: id
        // })
        //     .then(function (response) {
        //         axios.get(`/study/${id}/like`)
        //             .then((response) => {
        //                 // setLikes(response.data.likes)
        //                 // console.log(response.data)
        //             })
        //             .catch(function (error) {
        //                 // GET 요청 실패 처리
        //             });
        //     })
        //     .catch(function (error) {
        //         // 요청 실패 시 처리할 로직
        //     });
    };

    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(inputValue);
    };



    return (
        <div className='likeAndComment'>
            <div className='align-row'>
                <div className='align-row'>{/* 하트 */}
                    {liked===false?<img src={heartOutline} className="heart" onClick={()=>sendLikeSignal()}/>
                    :<img src={heartFull} className="heart" onClick={()=>sendLikeSignal()}/>
                    }
                    <span style={{ width: '5px' }}></span>
                    {likes}
                </div>
                <span style={{ width: '10px' }}></span>
                <div className='align-row'>
                    <img src={comment} className='comment' />
                    <span style={{ width: '5px' }}></span>
                    {/* {commentNum} */}
                </div>
            </div>

            <hr />

            <div className='align-row'>{/* 댓글하나 */}
                <img img src={comment} className='comment' />
                <span style={{ width: '5px' }}></span>
                <div className='align-side'>
                    <div style={{textAlign:'start'}}>
                        <div>박주연</div>
                        <div>스터디 추천 추천이용</div>
                    </div>
                    <div style={{textAlign:'end'}}>
                        <div>수정,삭제</div>
                        <div style={{color:'#888888'}}>13.05.60</div>
                    </div>
                </div>
            </div>

            <div className='align-side'>{/* 댓글달기*/}
            <Form onSubmit={handleSubmit} style={{ width: '90%' }}>
                <Form.Control
                    className="me-auto"
                    placeholder="최고의 스터디, 추천합니다!"
                    value={inputValue}
                    onChange={handleInputChange}
                    
                />
            </Form>
            <span style={{ width: '5px' }}></span>
            <Button variant="blue" type="submit" style={{ width: '10%'}}>등록</Button>
            </div>

        </div>
    )

}

export default LikeAndComment;