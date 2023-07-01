import React,{useState} from "react";
import {useSelector } from "react-redux";
import axios from "axios";
import { Form,Button } from "react-bootstrap";

function WriteReplyForm(props) {
    const user = useSelector((state) => state.user);
    const {id,reply,setReply,replyNum,setReplyNum}=props;
    const [inputValue, setInputValue] = useState('');

    function createComment(content) {
        axios
            .post(`/study/${id}`, {
                content: `${content}`
            })
            .then(function (response) {
                const newReply = [
                    ...reply,
                    {
                        "comment": `${content}`,
                        "commentId": response.data.commentId,
                        "date": response.data.date,
                        "writer": `${user.id}`
                    }
                ];
                setReply(newReply);
                setReplyNum(replyNum + 1);
                setInputValue('');
            })
            .catch(function (error) {
                // 오류발생시 실행
            });
    }

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

    return <div className='align-side' style={{ margin: '10px', marginBottom: '20px' }}>{/* 댓글달기*/}
        <Form onSubmit={handleSubmit} className='align-side' style={{ width: '100%' }}>
            <Form.Control style={{ width: '90%' }}
                className="me-auto"
                placeholder="최고의 스터디, 추천합니다!"
                value={inputValue}
                onChange={handleInputChange} />
            <span style={{ width: '5px' }}></span>
            <Button variant="blue" type="submit" style={{ width: '10%' }}>등록</Button>
        </Form>
    </div>;
}

export default WriteReplyForm;