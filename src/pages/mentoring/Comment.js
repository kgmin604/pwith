import React, { useEffect, useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./mentoring.css";
import "../../App.css";
import axios from "axios";
import { Form, Nav, Stack, Button, Table, ListGroup } from "react-bootstrap";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import comment from "./img/comment.png"
import moreImg from "./img/more.png"

function Comment(props) {
    let user = useSelector((state) => state.user);
    const mento = props.mento;
    const id = props.id;

    //더미데이터
    const [more, setMore] = useState(false);
    const [review, setReview] = useState(props.review);
    const [reviewNum, setReviewNum] = useState(Array.length(review));

    function createComment(content) {
        axios.post(`/mentoring/${id}`, {
            content: `${content}`
        })
            .then(function (response) {
                const newReview = [...review, {
                    "reviewId": response.data,
                    "review": `${content}`
                }];
                setReview(newReview);
            })
            .catch(function (error) {
                // 오류발생시 실행
            })
    }

    function updateComment(reviewId, content) {
        axios.put(`/mentoring/${id}`, {
            reviewId: `${reviewId}`,
            content: `${content}`
        })
            .then(function (response) {
                if (response === 1) {
                    const updatedReview = review.map(review => {
                        if (review.reviewId === reviewId) {
                            review.content = `${content}`;
                        }
                        return review;
                    });
                    setReview(updatedReview);
                    alert("댓글 수정 성공");
                }
                else {
                    alert("댓글 수정 실패");
                }
            }).catch(function (error) {
                // 오류발생시 실행
            })
    }
    function deleteComment(reviewId) {
        axios.delete(`/mentoring/${id}`, {
            reviewId: `${reviewId}`
        })
            .then(function (response) {
                if (response === 1) {
                    const filteredReview = review.filter(review => review.reviewId !== reviewId);
                    setReview(filteredReview);
                    setReviewNum(reviewNum - 1);
                    alert("댓글 삭제 성공");
                }
                else {
                    alert("댓글 삭제 실패");
                }
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
        console.log(inputValue);
        createComment(inputValue);
    };


    const [updateInput, setUpdateInput] = useState('');
    const handleClick = (content) => {
        setUpdateInput(content);
    }
    const handleUpdateChange = (event) => {
        setUpdateInput(event.target.value);
    };
    const handleUpdateSubmit = (event, reviewId) => {
        event.preventDefault();
        console.log(updateInput);
        updateComment(reviewId, updateInput);
    };

    return (
        <div className='Comment'>
            <div className='align-row'>
                <div className='align-row'>
                    <img src={comment} className='comment' />
                    <span style={{ width: '5px' }}></span>
                    {reviewNum}
                </div>
            </div>

            <hr />

            <div className='align-row '>{/* 댓글하나 */}
                <img img src={comment} className='comment' />
                <span style={{ width: '5px' }}></span>
                <div className='align-side'>
                    {review.map((k, i) => {
                        <div key={k.reviewId}>
                            <div style={{ textAlign: 'start' }}>
                                <div>{k.menti}</div>
                                {updateInput ? <>
                                    <Form onSubmit={handleUpdateSubmit(k.reviewId)} style={{ width: '90%' }}>
                                        <Form.Control
                                            className="me-auto"
                                            value={updateInput}
                                            onChange={handleUpdateChange}
                                        />
                                    </Form>
                                    <Button variant="blue" type="submit" style={{ width: '10%' }}>수정</Button>
                                </> : k.review}
                            </div>
                            <div style={{ textAlign: 'end' }}>
                                {user === k.menti ? <img src={moreImg} className="more" onClick={() => setMore(!more)} />
                                    : null}
                                <div>
                                    {more === true ? <ListGroup>
                                        <ListGroup.Item action onClick={() => handleClick(k.review, k.reviewId)}>수정</ListGroup.Item>
                                        <ListGroup.Item action onClick={() => deleteComment(k.reviewId)}>삭제</ListGroup.Item>
                                    </ListGroup> : null}
                                </div>
                            </div>
                        </div>
                    })}
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
                <Button variant="blue" type="submit" style={{ width: '10%' }}>등록</Button>
            </div>

        </div>
    )

}

export default Comment;