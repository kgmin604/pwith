import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import axios from "axios";
import { Button } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from '../../store';

function StudyCreate() {
    let navigate = useNavigate();

    let [postContent, setPostContent] = useState({
        'title': '',
        'content': '',
        'category':'',
        'totalP': ''
    })//제목, 내용, 카테고리, 총 인원수 
    // const [viewContent, setViewContent] = useState([]);//각각 적힌 내용들이 담길 배열

    let [mainCategory, SetMainCategory] = useState();
    let [subCategory, SetSubCategory] = useState();

    function postStudyContent() {
        axios({
            method: "POST",
            url: "/study/create",
            data: {
                title: `${postContent['title']}`,//글 제목->title
                content: `${postContent['content']}`,//글 내용->content
                category: `${postContent['category']}`,
                totalP: `${postContent['totalP']}`
            }
        })
            .then(function (response) {
                navigate("../study/main");
                alert("새 글이 등록되었습니다.");

            })
            .catch(function (error) {
                console.log(error);

            });
    }

    

    function checkTitle() {
        postContent['title'] === "" || postContent['content'] === "" ? alert("제목 또는 내용을 입력해주세요.") : postStudyContent();
    }



    const getValue = e => {
        const { name, value } = e.target;
        setPostContent({
            ...postContent,
            [name]: value
        })
        console.log(postContent);
    };


    return (
        <div className="StudyCreate">

            <h5 style={{ fontFamily: 'TmoneyRoundWind' }}>스터디 모집글 작성하기</h5>
            <div className='form-wrapper'>
                <input className="title-input" type='text' placeholder='제목' onChange={getValue} name='title' />
                <CKEditor
                    editor={ClassicEditor}
                    data=" "
                    onReady={editor => {
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        console.log({ event, editor, data });
                        setPostContent({
                            ...postContent,
                            content: data
                        })
                    }}
                />
                <div>
                <span>카테고리: </span>
                <select>
                    <option>선택</option>
                    <option>개발 프로그래밍</option>
                    <option>보안 네트워크</option>
                    <option>데이터 사이언스</option>
                    <option>게임 개발</option>
                </select>
                {/* <select>
                    <option>선택2</option>
                    <option>1</option>
                    <option>2</option>
                </select> */}
                </div>

                <div>
                    <span>인원수(최대 50명):</span>
                    <input></input>
                </div>
                

                <Button className="submit-button" variant="blue" style={{ margin: "5px" }}
                    onClick={() => { checkTitle(); }}>입력</Button>
            </div>


        </div>
    );
}


export default StudyCreate;