import React from "react";
import {useSelector } from "react-redux";
import axios from "axios";

import heartOutline from "../assets/img/heart-outline.png";
import heartFull from "../assets/img/heart-full.png"
import comment from "../assets/img/comment.png"

function LikeNumAndReplyNum(props) {
    const { id, liked, setLiked, likes, setLikes, replyNum } = props;
    const user = useSelector((state) => state.user);
    const sendLikeSignal = () => {
        axios.post(`/study/${id}/like`, {
            postId: id
        })
            .then(function (response) {
                axios.get(`/study/${id}/like`)
                    .then((response) => {
                        console.log(response.data)
                        if (liked === 1) {//원래 좋아요 눌러져있음-다시 누르면 감소
                            setLikes(likes - 1);
                            setLiked(0);
                        }
                        else {
                            setLikes(likes + 1);
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
    function clickHeart() {
        if (user.id === null) {
            alert("로그인이 필요합니다")
            return;
        }
        sendLikeSignal();
    }
    return <div className='align-row'>
        <div className='align-row'>{/* 하트 */}
            {liked !== 0 && <img src={heartFull} className="heart" onClick={() => clickHeart()} />}
            {liked === 0 && <img src={heartOutline} className="heart" onClick={() => clickHeart()} />}
            <span style={{ width: '5px' }}></span>
            {likes}
        </div>
        <span style={{ width: '10px' }}></span>
        <div className='align-row'>
            <img src={comment} className='comment' />
            <span style={{ width: '5px' }}></span>
            {replyNum}
        </div>
    </div>;
}

export default LikeNumAndReplyNum;