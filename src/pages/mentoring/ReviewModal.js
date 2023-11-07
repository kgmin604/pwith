import React, { useEffect, useState } from "react";
import "./mentoring.css";
import "./reviewCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { faStar } from "@fortawesome/free-solid-svg-icons/faStar";

import axios from "axios";

function ReviewModal(props) {
    const setShowModal = props.setShowModal
    const id = props.id
    const [reviewList, setReviewList] = useState([])
    const onClickExit = () => {
        setShowModal(false)
    }
    const scoreList = [1, 2, 3, 4, 5]



    const _renderReviewCard = (review) => {
        return <div className="review-container">
            <div className="row-wrapper">
            <div className="writer">{review.writer}</div>
            {scoreList.map((_, index) => {
                if (index < review.score) {
                    return <FontAwesomeIcon icon={faStar} color="rgb(252, 196, 25)"></FontAwesomeIcon>
                } else {
                    return <FontAwesomeIcon icon={faStar} color="rgb(181, 181, 181)"></FontAwesomeIcon>
                }
            }
            )}
            </div>
            <div className="review-content">{review.content}</div>
            <div className="review-date">{review.date}</div>
            <div className="divider"></div>
        </div>
    }
    useEffect(() => {
        axios({
            method: "GET",
            url: `/mentoring/${id}/review`,
        })
            .then(function (response) {
                console.log(response.data.data)
                setReviewList(response.data.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [id]);

    return <div className="modal-backdrop" onClick={onClickExit}>
        <div className="modal-view">
            <div className="review-header">
            <div className="review-title">멘티 후기</div>
            <FontAwesomeIcon icon={faXmark} onClick={onClickExit}></FontAwesomeIcon>
            </div>
            <div className="review-scroll-box">
                {reviewList.map((item, index) => (
                    _renderReviewCard(item)
                ))}
            </div>
        </div>
    </div>
}

export default ReviewModal