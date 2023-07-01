import React, { useEffect, useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import axios from "axios";
import { Form, Nav, Stack, Button, Table, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import WriteReplyForm from '../../component/WriteReplyForm';
import LikeNumAndReplyNum from '../../component/LikeNumAndReplyNum';

import comment from "./img/comment.png"
import moreImg from "./img/more.png"


function LikeAndComment(props) {

    const user = useSelector((state) => state.user);
    const id = props.id;
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(0);

    const [reply, setReply] = useState([]);
    const [replyNum, setReplyNum] = useState(0);

    const [more, setMore] = useState(false);
    const [moreId, setMoreId] = useState(-1);
    const [updateId, setUpdateId] = useState(-1);

    useEffect(() => {
        if (props != undefined) {
            setLikes(props.likes);
            setLiked(props.liked);
            setReply(props.reply);
            setReplyNum(props.reply.length);
            console.log(props);
        }
    }, [props])






    function updateComment(commentId, content) {
        axios.put(`/study/${id}`, {
            replyId: `${commentId}`,
            content: `${content}`
        })
            .then(function (response) {
                console.log(response);
                const updatedReply = reply.map(reply => {
                    if (reply.commentId === commentId) {
                        reply.comment = `${content}`;
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
        axios.delete(`/study/${id}`, {
            data: {
                replyId: `${commentId}`
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
            <LikeNumAndReplyNum id={id} liked={liked} setLiked={setLiked} likes={likes} setLikes={setLikes} replyNum={replyNum} />
            <hr />

            {reply.map((k, i) => {
                const date = JSON.stringify(k.date).slice(3, 11);

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

            <WriteReplyForm id={id} reply={reply} setReply={setReply} replyNum={replyNum} setReplyNum={setReplyNum} />

        </div>
    )

}

export default LikeAndComment;


