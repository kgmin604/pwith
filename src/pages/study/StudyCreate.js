import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import axios from "axios";
import { Button } from "react-bootstrap";
import MDEditor from '@uiw/react-md-editor';
import { useNavigate } from "react-router-dom";
import Select from 'react-select'

const customStyles = {
    control: (provided) => ({
        ...provided,
        width: '200px', // 원하는 크기로 설정
        height: '40px'
    }),
};

function StudyCreate() {

    let navigate = useNavigate();
    let [post, setPost] = useState({
        'title': '',
        'content': '',
        'roomId': -1
    });

    let [rooms, setRooms] = useState([]);

    useEffect(() => {
        axios({
            method: "GET",
            url: "/study/create"
        })
            .then(function (response) {
                setRooms(response.data);
                if (response.data.length === 0) {
                    alert('개설된 스터디룸이 없습니다. 스터디룸을 먼저 만들어주세요.');
                    navigate('../studyroom');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    function postStudyContent() {
        axios({
            method: "POST",
            url: "/study/create",
            data: {
                title: `${post['title']}`,
                content: `${post['content']}`,
                roomId: `${post['roomId']}`
            }
        })
            .then(function (response) {
                alert("새 글이 등록되었습니다.");
                navigate("../study/main");
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function checkTitle() {
        if (post['title'] === "" || post['content'] === "") {
            alert("제목 또는 내용을 입력해주세요.");
        }
        else if (post['roomId'] === -1) {
            alert("카테고리를 선택해주세요");
        }
        else {
            postStudyContent();
        }
    }

    const getValue = e => {
        const { name, value } = e.target;
        setPost({
            ...post,
            [name]: value
        })
    };


    return (
        <div className="StudyCreate">

            <h5 className="header">스터디 모집글 작성하기</h5>
            <div className='form-wrapper'>
                <input className="title-input" type='text' placeholder='제목' onChange={getValue} name='title' maxlength='50' />
                <MDEditor height={865} value={post.content} onChange={(value, event) => {
                    setPost({
                        ...post,
                        content: value
                    })
                }} />
                <div className="study-bottom-area">
                    <Select styles={customStyles}
                        onChange={(e) => setPost({
                            ...post,
                            roomId: e.value
                        })}
                        placeholder="스터디 선택하기"
                        options={rooms}
                    />
                    <Button
                        className="submit-button"
                        variant="blue"
                        onClick={() => { checkTitle(); }}
                    > 등록
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default StudyCreate;