import React, { useEffect, useState, createRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../pages/study/study.css";
import "../App.css";
import LikeNumAndReplyNum from './LikeNumAndReplyNum';
import Reply from './Reply';
import WriteReplyForm from './WriteReplyForm';

function LikeAndComment(props) {
    const id = props.id
    const type = props.type
    let baseUrl
    if (type !== undefined && type === 'qna') {
        baseUrl = '/community/qna';
    }
    if (type !== undefined && type === 'study') {
        baseUrl = '/study';
    }
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
            <LikeNumAndReplyNum id={id} liked={liked} setLiked={setLiked} likes={likes} setLikes={setLikes} replyNum={replyNum} baseUrl={baseUrl} />
            <hr />
            {reply.map((item) => {
                return <Reply item={item} id={id} reply={reply} setReply={setReply} replyNum={replyNum} baseUrl={baseUrl} />
            })}
            <WriteReplyForm id={id} reply={reply} setReply={setReply} replyNum={replyNum} setReplyNum={setReplyNum} baseUrl={baseUrl} />
        </div>
    )

}

export default LikeAndComment;




