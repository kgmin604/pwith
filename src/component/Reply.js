import React,{useState} from "react";
import {useSelector } from "react-redux";
import axios from "axios";
import { Form, ListGroup } from "react-bootstrap";

import comment from "../assets/img/comment.png"
import moreImg from "../assets/img/more.png"

function Reply(props) {
    const { reply, id, item, setReply, replyNum, setReplyNum,baseUrl} = props;
    const [more, setMore] = useState(false);
    const [update, setUpdate] = useState(false);
    const user = useSelector((state) => state.user);

    const [updateInput, setUpdateInput] = useState('');
    const handleUpdateChange = (event) => {
        setUpdateInput(event.target.value);
    };
    const handleUpdateSubmit = (event, replyId) => {
        event.preventDefault();
        updateComment(replyId, updateInput);
    };

    function deleteComment(replyId) {
        if(baseUrl===undefined||id===undefined)return
        axios.delete(`${baseUrl}/${id}`, {
            data: {
                id: `${replyId}`
            }
        })
            .then(function (response) {
                const filteredReply = reply.filter(reply => reply.id !== replyId);
                setReply(filteredReply);
                setReplyNum(replyNum - 1);
                console.log('댓글삭제')
                alert("댓글 삭제 성공");
            })
            .catch(function (error) {
                console.log(error)
            })
            .then(function () {
                // always executed
            });
    }
    function updateComment(replyId, content) {
        if(baseUrl===undefined||id===undefined)return
        axios.put(`${baseUrl}/${id}`, {
            id: `${replyId}`,
            content: `${content}`
        })
            .then(function (response) {
                const updatedReply = reply.map(reply => {
                    if (reply.id === replyId) {
                        reply.content = `${content}`;
                    }
                    setUpdateInput("");
                    return reply;
                });
                setReply(updatedReply);
                alert("댓글 수정 성공");
                setUpdate(false);
            }).catch(function (error) {
                // 오류발생시 실행
            })
    }

    return <div key={item.id}>{/* 댓글하나 */}
        <div className='align-row'>
            <img img src={comment} className='comment' />
            <span style={{ width: '5px' }}></span>
            <div className='align-side'>
                <div style={{ textAlign: 'start' }}>
                    <div style={{ fontSize: '13px' }}>{item.writer}</div>
                    {update !== false ? <><Form onSubmit={(event) => handleUpdateSubmit(event, item.id)} className='align-side' tyle={{ width: '150%' }}>
                        <Form.Control
                            className="me-auto"
                            value={updateInput}
                            onChange={handleUpdateChange} />
                    </Form>
                    </> : item.content}
                </div>
                <div style={{ textAlign: 'end' }}>
                    {user.id === item.writer && <img src={moreImg} className="more" onClick={() => setMore(!more)} />}
                    <div>
                        {more && <ListGroup>
                            <ListGroup.Item action onClick={() => {setUpdate(true); setMore(false) }}>수정</ListGroup.Item>
                            <ListGroup.Item action onClick={() => deleteComment(item.id)}>삭제</ListGroup.Item>
                        </ListGroup>}
                    </div>
                    <div style={{ fontSize: '10px'}}>{item.date}</div>
                </div>
            </div>
        </div>
        <hr />
    </div>;
}

export default Reply