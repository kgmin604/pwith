import React, { useEffect, useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import axios from "axios";
import { Form, Nav, Stack, Button, Table, ListGroup } from "react-bootstrap";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import heartOutline from "./img/heart-outline.png";
import heartFull from "./img/heart-full.png"
import comment from "./img/comment.png"
import moreImg from "./img/more.png"

function LikeAndComment(props) {
    let user = useSelector((state) => state.user);
    const id = props.id;
    const [likes, setLikes] = useState(0);
    const [liked,setLiked]=useState(false);
    const [replyList,setReplyList]=useState([]);

    useEffect(()=>{
        if(props!=undefined){
            setLikes(props.likes);
            setLiked(props.liked);
            setLiked(props.replyList);
            console.log(props);
        }
        
    },[props])

    const [more, setMore] = useState(false);

    const sendLikeSignal = () => {
        axios.post(`/study/${id}/like`, {
            postId: id
        })
            .then(function (response) {
                axios.get(`/study/${id}/like`)
                    .then((response) => {
                        console.log(response.data)
                        setLiked(!liked);
                        if(liked){
                            setLikes(likes-1);
                        }
                        else{
                            setLikes(likes+1);
                        }
                    })
                    .catch(function (error) {
                        // GET 요청 실패 처리
                    });
            })
            .catch(function (error) {
                // 요청 실패 시 처리할 로직
            });
    };

    function updateComment() {

    }
    function deleteComment() {

    }

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
                    {liked === false ? <img src={heartOutline} className="heart" onClick={() => sendLikeSignal()} />
                        : <img src={heartFull} className="heart" onClick={() => sendLikeSignal()} />
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

            {reply.map((k, i) => {
                return (
                    <div  key={k.commentId}>{/* 댓글하나 */}
                    <div className='align-row'>
                        <img img src={comment} className='comment' />
                        <span style={{ width: '5px' }}></span>
                        <div className='align-side'>
                            <div style={{ textAlign: 'start' }}>
                                <div>{k.writer}</div>
                                {updateInput ? <>
                                    <Form onSubmit={handleUpdateSubmit(k.commentId)} style={{ width: '90%' }}>
                                        <Form.Control
                                            className="me-auto"
                                            value={updateInput}
                                            onChange={handleUpdateChange}
                                        />
                                        <Button variant="blue" type="submit" style={{ width: '10%' }}>수정</Button>
                                    </Form>
                                </> : k.comment}
                            </div>

                            <div style={{ textAlign: 'end' }}>
                                {user.id === k.menti ? <img src={moreImg} className="more" onClick={() => setMore(!more)} />
                                    : <div style={{width:'30px',height:'30px'}}></div>}
                                <div>
                                    {more === true ? <ListGroup>
                                        <ListGroup.Item action onClick={() =>{}}>수정</ListGroup.Item>
                                        <ListGroup.Item action onClick={() => {}}>삭제</ListGroup.Item>
                                    </ListGroup> : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    </div>

                )
            })}

                    <div style={{ textAlign: 'start' }}>
                        <div>박주연</div>
                        <div>스터디 추천 추천이용</div>
                    </div>
                    <div style={{ textAlign: 'end' }}>
                        <div className='align-row'>
                            <div>
                                {more === true ? <ListGroup>
                                    <ListGroup.Item action onClick={() => updateComment()}>수정</ListGroup.Item>
                                    <ListGroup.Item action onClick={() => deleteComment()}>삭제</ListGroup.Item>
                                </ListGroup> : null}
                            </div>
                            <img src={moreImg} className="more" onClick={() => setMore(!more)} />
                        </div>
                        <div style={{ color: '#888888' }}>23.01.20</div>
                    </div>

            <div className='align-side'>{/* 댓글달기*/}
                <Form onSubmit={handleSubmit} style={{ width: '100%' }} className='align-side'>
                    <Form.Control style={{ width: '90%' }}
                        className="me-auto"
                        placeholder="최고의 스터디, 추천합니다!"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <span style={{ width: '5px' }}></span>
                    <Button variant="blue" type="submit" style={{ width: '10%' }}>등록</Button>
                </Form>
            </div>

        </div>
    )

}

export default LikeAndComment;