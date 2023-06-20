import React, { useState,useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import "./mentoring.css";
import { Form, Nav, Stack, Button, Card, Row, Col } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function MentoringCreate() {

    let navigate = useNavigate();
    let user = useSelector((state) => state.user);
    let dispatch = useDispatch();

    const words = ['웹', '프론트엔드', '백엔드', '인공지능', '자바', 'c언어'];
    const [selectedWords, setSelectedWords] = useState([]); // 클릭한 단어 배열

    let [portfolio, setportfolio] = useState({
        'image':'',
        'title': '',
        'subject': '',
        'content': ''
    })//제목, 분야, 내용

    function postPortfolio() {
        const updatedSubject = JSON.stringify(selectedWords);
      
        setportfolio({
          ...portfolio,
          subject: updatedSubject
        });
      
        axios({
          method: "POST",
          url: "/mentoring/create",
          data: {
            // title: `${portfolio['title']}`,
            subject: updatedSubject,
            content: `${portfolio['content']}`,
            image: `${portfolio['image']}`
          }
        })
          .then(function (response) {
            console.log(response);
            alert("새 글이 등록되었습니다.");
            navigate("../mentoring/main");
          })
          .catch(function (error) {
            console.log(error);
            alert("요청을 처리하지 못했습니다.");
          });
      } 

    useEffect(() => {
        console.log(portfolio);
      }, [portfolio]);

    const handleWordClick = (word) => {
        if (selectedWords.includes(word)) {
            setSelectedWords(prevWords => prevWords.filter(w => w !== word));
            console.log(selectedWords);
          } else {
            setSelectedWords(prevWords => [...prevWords, word]);
            console.log(selectedWords);
          }
    };



    function checkTitle() {
        portfolio['title'] === "" || portfolio['content'] === "" ? alert("제목 또는 내용을 입력해주세요.") :
            postPortfolio();
    }



    const getValue = e => {
        const { name, value } = e.target;
        setportfolio({
            ...portfolio,
            [name]: value
        })
    };

    return (
        <div className="MentoringCreate">
            <h5 style={{ fontFamily: 'TmoneyRoundWind' }}>포트폴리오 작성하기</h5>
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
                        setportfolio({
                            ...portfolio,
                            content: data
                        })
                    }}
                    style={{ width: '500px' }}
                />

                <div className='selectSubject'>
                    <hr/>
                    {words.map((word, index) => (
                        <span
                            key={index}
                            style={{
                                color: selectedWords.includes(word) ? 'blue' : 'gray',
                                marginRight: index % 3 === 2 ? '10px' : '5px'
                            }}
                            // onMouseEnter={() => { setSelectedWords(prevWords => [...prevWords, word]) }}
                            // onMouseLeave={() => { setSelectedWords(prevWords => prevWords.filter(w => w !== word)) }}
                            onClick={() => { handleWordClick(word) }}
                        >
                            {word}
                        </span>
                    ))}

                </div>

                <Button className="submit-button" variant="blue" style={{ margin: "5px" }}
                    onClick={() => { checkTitle(); }}>등록</Button>
            </div>


        </div>
    );
}




export default MentoringCreate;