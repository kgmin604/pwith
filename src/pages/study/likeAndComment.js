import React, { useEffect, useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import LikeNumAndReplyNum from '../../component/LikeNumAndReplyNum';
import Reply from '../../component/Reply';
import WriteReplyForm from '../../component/WriteReplyForm';

function LikeAndComment(props) {
    const id = props.id;
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(0);

    const [reply, setReply] = useState([]);
    const [replyNum, setReplyNum] = useState(0);

    useEffect(() => {
        if (props !== undefined) {
            setLikes(props.likes);
            setLiked(props.liked);
            setReply(props.reply);
            setReplyNum(props.reply.length);
            console.log(props);
        }
    }, [props])

    return (
        <div className='likeAndComment'>
            <LikeNumAndReplyNum id={id} liked={liked} setLiked={setLiked} likes={likes} setLikes={setLikes} replyNum={replyNum} />
            <hr />
            {reply.map((item) => {
                return <Reply item={item} id={id} reply={reply} setReply={setReply} replyNum={replyNum} />
            })}
            <WriteReplyForm id={id} reply={reply} setReply={setReply} replyNum={replyNum} setReplyNum={setReplyNum} />
        </div>
    )

}

export default LikeAndComment;




