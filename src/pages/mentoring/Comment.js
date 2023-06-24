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

    const [more, setMore] = useState(false);
    const [moreId, setMoreId] = useState(-1);
    const [updateId, setUpdateId] = useState(-1);
    const [review, setReview] = useState([]);
    const [reviewNum, setReviewNum] = useState(0);

    useEffect(() => {
        if (props.review != undefined) {
            setReview(props.review);
            setReviewNum(props.review.length);
            console.log(reviewNum);
        }
    }, [props.review])

    function createComment(content) {
        axios
            .post(`/mentoring/${id}`, {
                content: `${content}`
            })
            .then(function (response) {
                const newReview = [
                    ...review,
                    {
                        "menti": `${user.id}`,
                        "review": `${content}`,
                        "reviewId": response.data.reviewId
                    }
                ];
                setReview(newReview);
                setReviewNum(reviewNum + 1);
                setInputValue('');
            })
            .catch(function (error) {
                // 오류발생시 실행
            });
    }

    function updateComment(reviewId, content) {
        axios.put(`/mentoring/${id}`, {
            reviewId: `${reviewId}`,
            content: `${content}`
        })
            .then(function (response) {
                console.log(response);
                const updatedReview = review.map(review => {
                    if (review.reviewId === reviewId) {
                        review.review = `${content}`;
                    }
                    setUpdateInput("");
                    return review;
                });
                setReview(updatedReview);
                console.log(review);
                alert("댓글 수정 성공");
                setUpdateInput("");
                setUpdateId(-1)
            }).catch(function (error) {
                // 오류발생시 실행
            })
    }
    function deleteComment(reviewId) {
        axios.delete(`/mentoring/${id}`, {
            data: {
                reviewId: `${reviewId}`
            }
        })
            .then(function (response) {
                console.log(response);
                const filteredReview = review.filter(review => review.reviewId !== reviewId);
                setReview(filteredReview);
                setReviewNum(reviewNum - 1);
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
            console.log(review);
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
    const handleUpdateSubmit = (event, reviewId) => {
        event.preventDefault();
        console.log(updateInput);
        updateComment(reviewId, updateInput);
    };

    function clickMore(id) {
        setMoreId(id);
        setMore(!more);
        console.log(moreId);
    }

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


            {review.map((k, i) => {
                return (
                    <div key={k.reviewId}>{/* 댓글하나 */}
                        <div className='align-row'>
                            <img img src={comment} className='comment' />
                            <span style={{ width: '5px' }}></span>
                            <div className='align-side'>
                                <div style={{ textAlign: 'start' }}>
                                    <div style={{ fontSize: '13px' }}>{k.menti}</div>
                                    {k.reviewId === updateId ? <><Form onSubmit={(event) => handleUpdateSubmit(event, updateId)} className='align-side' tyle={{ width: '150%' }}>
                                        <Form.Control
                                            className="me-auto"
                                            value={updateInput}
                                            onChange={handleUpdateChange}
                                        />
                                        {/* <Button variant="blue" type="submit" style={{ width: '50%' }}>수정</Button> */}
                                    </Form>
                                    </> : k.review}
                                </div>
                                <div style={{ textAlign: 'end' }}>
                                    {user.id === k.menti ? <img src={moreImg} className="more" onClick={() => clickMore(k.reviewId)} />
                                        : null}
                                    <div>
                                        {(more == true) && (moreId === k.reviewId) ? <ListGroup>
                                            <ListGroup.Item action onClick={() => handleClick(k.review, k.reviewId)}>수정</ListGroup.Item>
                                            <ListGroup.Item action onClick={() => deleteComment(k.reviewId)}>삭제</ListGroup.Item>
                                        </ListGroup> : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                    </div>

                )
            })}

            <div className='align-side'>{/* 댓글달기*/}
                <Form onSubmit={handleSubmit} style={{ width: '100%' }} className='align-side'>
                    <Form.Control style={{ width: '90%' }}
                        className="me-auto"
                        placeholder="최고의 멘토, 추천합니다!"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <span style={{ width: '5px' }}></span>
                    <Button variant="blue" type="submit" style={{ width: '10%' }}>등록</Button>
                </Form>
            </div>

        </div >
    )

}

export default Comment;