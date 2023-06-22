import React from 'react';
import "./studyroom.css";
import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Select from 'react-select'
import axios from "axios";

function RoomCreate(){
    let navigate = useNavigate();
    let [msg, setMsg] = useState('');
    let [userinput, setUserinput] = useState({
        'title': '',
        'category': '',
        'totalP': ''
    });

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
          width: '400px',
        }),
    };

    function requestCreate() {
        axios({
            method: "POST",
            url: "/studyroom/create",
            data: {
                title: `${userinput['title']}`,
                category: `${userinput['category']}`,
                totalP: `${userinput['totalP']}`
            }
        })
            .then(function (response) {
                alert("스터디룸이 개설되었습니다.");
                navigate("../studyroom");

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function checkCreate(event){
        event.stopPropagation();
        if(userinput['title']===''){
            setMsg('! 이름을 입력해주세요.');
        }
        else if(userinput['category']===''){
            setMsg('! 카테고리를 선택해주세요.');
        }
        else if(userinput['totalP']===''){
            setMsg('! 인원을 설정해주세요');
        }
        else if(!(2 <= Number(userinput['totalP']) && Number(userinput['totalP'])<=50)){
            setMsg('! 인원을 2명 이상 50명 이하로 설정해주세요');
        }
        else{
            setMsg('');
            requestCreate();
        }
    }

    function changeInput(e){
        let copyUserinput = {...userinput};
        copyUserinput[e.target.id] = e.target.value;
        setUserinput(copyUserinput);
    }

    return(
        <>
            <div className="create-wrap">
                <div className="title">
                    스터디룸 개설
                </div>
                <form method="POST">
                    <div className="item">
                        <p className="name">스터디 이름</p>
                        <input 
                            id = 'title'
                            className="input-area" 
                            placeholder='최대 20글자'
                            onChange={ e=>changeInput(e) }
                        ></input>
                    </div>
                    <div className="item">
                        <p className="name">카테고리</p>
                        <Select styles={customStyles}
                            onChange={(e) => setUserinput({
                                ...userinput,
                                category: e.value
                            })}
                            placeholder = "-선택-"
                            options = { category }
                        />
                    </div>
                    <div className="item">
                        <p className="name">인원수</p>
                        <input
                            id = 'totalP'
                            className="input-area" 
                            placeholder='최대 50명'
                            type='number'
                            onChange={ e=>changeInput(e) }
                        ></input>
                    </div>
                    <div className="create-btn" onClick={ (e)=>checkCreate(e) }>
                        만들기
                    </div>
                    <div className="message">{msg}</div>
                </form>
            </div>
        </>
    );
}

export default RoomCreate