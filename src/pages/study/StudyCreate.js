import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import axios from "axios";
import { Button } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from "react-router-dom";
import Select from 'react-select'

let totalP = [];
for (let i = 4; i <= 50; i++) {
    let op = {};

    op.value = `${i}`;
    op.label = `${i}` + '명';

    totalP.push(op);
}

let category=[
    {value:0, label:'웹개발'},
    {value:1, label:'모바일 앱 개발'},
    {value:2, label:'게임 개발'},  
    {value:3, label:'프로그래밍 언어'},
    {value:4, label:'알고리즘 · 자료구조'},
    {value:5, label:'데이터베이스'},
    {value:6, label:'자격증'},
    {value:7, label:'개발 도구'},
    {value:8, label:'데이터 사이언스'},
    {value:9, label:'데스크톱 앱 개발'},
    {value:10, label:'교양 · 기타'},
];

const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '200px', // 원하는 크기로 설정
    }),
  };


function StudyCreate() {
    let navigate = useNavigate();

    let [postContent, setPostContent] = useState({
        'title': '',
        'content': '',
        'category': '',
        'totalP': '50'
    })//제목, 내용, 카테고리, 총 인원수 
    // const [viewContent, setViewContent] = useState([]);//각각 적힌 내용들이 담길 배열

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
                alert("새 글이 등록되었습니다.");
                navigate("../study/main");

            })
            .catch(function (error) {
                console.log(error);
            });
    }



    function checkTitle() {
        postContent['title'] === "" || postContent['content'] === "" ? alert("제목 또는 내용을 입력해주세요.") : 
        postContent['category']==="" ? alert("카테고리를 선택해주세요") :
        postStudyContent();

        console.log(postContent);
        
    }



    const getValue = e => {
        const { name, value } = e.target;
        setPostContent({
            ...postContent,
            [name]: value
        })
    };


    return (
        <div className="StudyCreate">

            <h5 style={{ fontFamily: 'TmoneyRoundWind' }}>스터디 모집글 작성하기</h5>
            <div className='form-wrapper'>
                <input className="title-input" type='text' placeholder='제목' onChange={getValue} name='title' />
                <CKEditor
                    editor={ClassicEditor}
                    data=" "
                    config={{
                        placeholder: "내용을 입력하세요.",
                    }}
                    onReady={editor => {
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setPostContent({
                            ...postContent,
                            content: data
                        })
                    }}
                />
                <div >
                <div className="selectCategory" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin:'10px'}}>
                <p>카테고리: </p>
                    <Select styles={customStyles}
                        onChange={(e) => setPostContent({
                            ...postContent,
                            category: e.value
                        })}
            	        placeholder = "-선택-"
                        options = { category }
                    />
                </div>

                <div className="selectTotalP" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p>인원수: </p>
                    <Select
                        onChange={(e) => setPostContent({
                            ...postContent,
                            totalP: e.value
                        })}
            	        placeholder = "50"
                        options = { totalP }
                        defaultValue={totalP[49]}
                    />
                    <p>/50</p>
                        
                </div>
                </div>



                <Button className="submit-button" variant="blue" style={{ margin: "5px" }}
                    onClick={() => { checkTitle(); }}>입력</Button>
            </div>


        </div>
    );
}

export default StudyCreate;