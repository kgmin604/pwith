import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./community.css";
import "../../App.css";
import axios from "axios";
import { Button } from "react-bootstrap";
import MDEditor from '@uiw/react-md-editor';
import { useNavigate } from "react-router-dom";
import Select from 'react-select'

let category = [
    { value: 0, label: '웹개발' },
    { value: 1, label: '모바일 앱 개발' },
    { value: 2, label: '게임 개발' },
    { value: 3, label: '프로그래밍 언어' },
    { value: 4, label: '알고리즘 · 자료구조' },
    { value: 5, label: '데이터베이스' },
    { value: 6, label: '자격증' },
    { value: 7, label: '개발 도구' },
    { value: 8, label: '데이터 사이언스' },
    { value: 9, label: '데스크톱 앱 개발' },
    { value: 10, label: '교양 · 기타' },
];

const customStyles = {
    control: (provided) => ({
        ...provided,
        width: '200px', // 원하는 크기로 설정
    }),
};


function QnaCreate() {
    const navigate = useNavigate();

    const [post, setPost] = useState({
        'title': '',
        'content': '',
        'category': ''
    })
    function postStudyContent() {
        axios({
            method: "POST",
            url: "/community/qna/create",
            data: {
                title: `${post['title']}`,//글 제목->title
                content: `${post['content']}`,//글 내용->content
                category: `${post['category']}`
            }
        })
            .then(function (response) {
                alert("새 글이 등록되었습니다.");
                navigate("../community/qna/main");

            })
            .catch(function (error) {
                console.log(error);
            });
    }
    function checkTitle() {
        !post['title']|| !post['content']? alert("제목 또는 내용을 입력해주세요.") :
            post['category'] === "" ? alert("카테고리를 선택해주세요") :
                postStudyContent();

        console.log(post);

    }

    const getValue = e => {
        const { name, value } = e.target;
        setPost({
            ...post,
            [name]: value
        })
    };
    return (
        <div className="QnaCreate">

            <h5 style={{ fontFamily: 'TmoneyRoundWind' }}>질문글 작성하기</h5>
            <div className='form-wrapper'>
                <input className="title-input" type='text' placeholder='제목' onChange={getValue} name='title' />
                <MDEditor height={865} value={post.content} onChange={(value,event) => {
                        setPost({
                            ...post,
                            content: value
                        })
                    }} />

                <div >
                    <div className="selectCategory" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px' }}>
                        <p>카테고리: </p>
                        <Select styles={customStyles}
                            onChange={(e) => setPost({
                                ...post,
                                category: e.value
                            })}
                            placeholder="-선택-"
                            options={category}
                        />
                    </div>

                </div>



                <Button className="submit-button" variant="blue" style={{ margin: "5px" }}
                    onClick={() => { checkTitle(); }}>입력</Button>
            </div>


        </div>
    );
}

export default QnaCreate;