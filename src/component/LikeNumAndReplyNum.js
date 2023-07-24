import React from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import heartOutline from "../assets/img/heart-outline.png";
import heartFull from "../assets/img/heart-full.png"
import comment from "../assets/img/comment.png"

function LikeNumAndReplyNum(props) {
    const { id, liked, setLiked, likes, setLikes, replyNum, baseUrl } = props;
    const user = useSelector((state) => state.user);
    const sendLikeSignal = () => {
        if(baseUrl===undefined||id===undefined)return
        axios.post(`${baseUrl}/${id}/like`, {
            postId: id
        })
            .then(function (response) {
                setLiked(response.data.liked)
                setLikes(response.data.likes)
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
            {liked === true && <img src={heartFull} className="heart" onClick={() => clickHeart()} />}
            {(liked === false || liked === undefined) && <img src={heartOutline} className="heart" onClick={() => clickHeart()} />}
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