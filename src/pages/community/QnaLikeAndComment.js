import React, { useEffect, useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../study/study.css";
import "./community.css";
import "../../App.css";
import axios from "axios";
import { Form, Nav, Stack, Button, Table, ListGroup } from "react-bootstrap";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import heartOutline from "../study/img/heart-outline.png";
import heartFull from "../study/img/heart-full.png"
import comment from "../study/img/comment.png"
import moreImg from "../study/img/more.png"

function LikeAndComment(props) {//좋아요 완료
    let user = useSelector((state) => state.user);
    const id = props.id;

    const [likes, setLikes] = useState(0);
    const [liked,setLiked]=useState(0);
    
    const [reply,setReply]=useState([]);
    const [replyNum, setReplyNum] = useState(0);

    const [more, setMore] = useState(false);
    const [moreId, setMoreId] = useState(-1);
    const [updateId, setUpdateId] = useState(-1);

    useEffect(()=>{
        if(props!=undefined){
            setLikes(props.likes);
            setLiked(props.liked);
            setReply(props.reply);
            setReplyNum(props.reply.length);
            console.log(props);
        }
        
    },[props])

    const sendLikeSignal = () => {
        axios.post(`/community/qna/${id}/like`, {
            postId: id
        })
            .then(function (response) {
                axios.get(`/community/qna/${id}/like`)
                    .then((response) => {
                        console.log(response.data)
                        if(liked===1){//원래 좋아요 눌러져있음-다시 누르면 감소
                            setLikes(likes-1);
                            setLiked(0);
                        }
                        else{
                            setLikes(likes+1);
                            setLiked(1);
                        }

                        setLiked(response.data.likes);
                        setLiked(response.data.liked);
                        
                    })
                    .catch(function (error) {
                        // GET 요청 실패 처리
                    });
            })
            .catch(function (error) {
                // 요청 실패 시 처리할 로직
            });
    };
    function clickHeart(){
        if(user.id===null){
            alert("로그인이 필요합니다")
            return;
        }
        sendLikeSignal();
    }

    function createComment(content) {
        axios
            .post(`/community/qna/${id}`, {
                content: `${content}`
            })
            .then(function (response) {
                console.log(response.data);
                const newReply = [
                    ...reply,
                    {
                        "comment": `${content}`,
                        "commentId": response.data.replyId,//통일 필요
                        "date":`${response.data.date}`,
                        "writer":`${user.id}`
                    }
                ];
                setReply(newReply);
                setReplyNum(replyNum+1);
                setInputValue('');
            })
            .catch(function (error) {
                // 오류발생시 실행
            });
    }

    useEffect(()=>{
        console.log(reply)
    },[reply])

    function updateComment(commentId, content) {
        axios.put(`/community/qna/${id}`, {
            commentId: `${commentId}`,
            content: `${content}`
        })
            .then(function (response) {
                console.log(response);
                const updatedReply = reply.map(reply => {
                    if (reply.commentId === commentId) {
                        reply.content= `${content}`;
                    }
                    setUpdateInput("");
                    return reply;
                });
                setReply(updatedReply);
                console.log(reply);
                alert("댓글 수정 성공");
                setUpdateInput("");
                setUpdateId(-1)
            }).catch(function (error) {
                // 오류발생시 실행
            })
    }

    function deleteComment(commentId) {
        axios.delete(`/community/qna/${id}`, {
            data: {
                commentId: `${commentId}`
            }
        })
            .then(function (response) {
                const filteredReply = reply.filter(reply => reply.commentId !== commentId);
                setReply(filteredReply);
                setReplyNum(replyNum - 1);
                setMore(false);
                alert("댓글 삭제 성공");
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }

    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (user.id === null) {
            alert("로그인이 필요합니다")
        }
        else {
            createComment(inputValue);
        }
    };
    const [updateInput, setUpdateInput] = useState('');
    const handleClick = (content, id) => {
        setUpdateId(id);
        setMore(false);
        setUpdateInput(content);
    }
    const handleUpdateChange = (event) => {
        setUpdateInput(event.target.value);
    };
    const handleUpdateSubmit = (event, commentId) => {
        event.preventDefault();
        console.log(updateInput);
        updateComment(commentId, updateInput);
    };

    function clickMore(id) {
        setMoreId(id);
        setMore(!more);
        console.log(moreId);
    }

    return (
        <div className='likeAndComment'>
            <div className='align-row'>
                <div className='align-row'>{/* 하트 */}
                    {liked===0? <img src={heartOutline} className="heart" onClick={() => clickHeart()} />
                        : <img src={heartFull} className="heart" onClick={() => clickHeart()} />
                    }
                    <span style={{ width: '5px' }}></span>
                    {likes}
                </div>
                <span style={{ width: '10px' }}></span>
                <div className='align-row'>
                    <img src={comment} className='comment' />
                    <span style={{ width: '5px' }}></span>
                    {replyNum}
                </div>
            </div>

            <hr />

            {reply.map((k, i) => {
                const date=JSON.stringify(k.date).slice(3,11);

                return (
                    <div key={k.commentId}>{/* 댓글하나 */}
                        <div className='align-row'>
                            <img img src={comment} className='comment' />
                            <span style={{ width: '5px' }}></span>
                            <div className='align-side'>
                                <div style={{ textAlign: 'start' }}>
                                    <div style={{ fontSize: '13px' }}>{k.writer}</div>
                                    {k.commentId === updateId ? <><Form onSubmit={(event) => handleUpdateSubmit(event, updateId)} className='align-side' tyle={{ width: '150%' }}>
                                        <Form.Control
                                            className="me-auto"
                                            value={updateInput}
                                            onChange={handleUpdateChange}
                                        />
                                    </Form>
                                    </> : k.comment}
                                </div>
                                <div style={{ textAlign: 'end' }}>
                                    {user.id === k.writer ? <img src={moreImg} className="more" onClick={() => clickMore(k.commentId)} />
                                        : null}
                                    <div>
                                        {(more == true) && (moreId === k.commentId) ? <ListGroup>
                                            <ListGroup.Item action onClick={() => handleClick(k.reply, k.commentId)}>수정</ListGroup.Item>
                                            <ListGroup.Item action onClick={() => deleteComment(k.commentId)}>삭제</ListGroup.Item>
                                        </ListGroup> : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                    </div>

                )
            })}

            <div className='align-side' style={{margin:'10px',marginBottom:'20px'}}>{/* 댓글달기*/}
                <Form onSubmit={handleSubmit}  className='align-side' style={{ width: '100%' }}>
                    <Form.Control style={{ width: '90%' }}
                        className="me-auto"
                        placeholder="저도 이게 궁금해요!"
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