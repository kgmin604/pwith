import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import axios from "axios";
import { Button } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {useNavigate } from "react-router-dom";

function StudyCreate() {
    let navigate = useNavigate();

    let [postContent, setPostContent] = useState({
        'title': '',
        'content': ''
    })//제목과 내용이 담길 변수-> 백엔드에 전달해줘야함
    // const [viewContent, setViewContent] = useState([]);//각각 적힌 내용들이 담길 배열

    function postStudyContent(){
        axios({
            method:"POST",
            url:"/create",
            data:{
                title:`${postContent['title']}`,//글 제목->title
                content:`${postContent['content']}`//글 내용->content
            }
        })
            .then(function(response){
                console.log(response);
                navigate("../study");
                alert("새 글이 등록되었습니다.");
                
            })
            .catch(function (error) {
                console.log(error);
                
              });
    }

    function checkPost(){
        postContent['title'] ===""||postContent['content'] ===""  ? alert("제목 또는 내용을 입력해주세요."): postStudyContent();
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
                        console.log(postContent);
                    }}
                />

                <Button className="submit-button" variant="blue" style={{ margin: "5px" }}
                    onClick={() => {checkPost();}}>입력</Button>
            </div>


        </div>
    );
}


export default StudyCreate;