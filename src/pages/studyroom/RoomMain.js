import React from 'react';
import axios from "axios";

import "./studyroom.css";
import "../../assets/modal.css"
import { useState, useEffect  } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";


function RoomMain(){
    let user = useSelector((state) => state.user);
    let navigate = useNavigate();

    let [rooms, setRooms] = useState([]);
    let [rooms2, setRooms2] = useState([]);

    let [chkAxios, setChkAxios] = useState(false);

    let [type,setType] = useState('study'); // 'study' or 'mentoring'

    useEffect(()=>{
        axios({
            method: "GET",
            url: "/study-room"
        })
        .then(function (response) {
            console.log(response.data);
            setRooms(response.data.data.studyRoom);
            setRooms2(response.data.data.mentoringRoom);
            setChkAxios(true);
        })
        .catch(function (error) {
            console.log(error);
        });
    },[])
    
    return(
        <>{
            user.id === null ?
            <div className="img-error">
                <img src='/error_login.png'></img>
                <div><span onClick={()=>navigate('../member/login')}>로그인</span> 후 사용해주세요!</div>
            </div>
            :
            <div className="room-part">
                <div className="row">
                    <div className="col-md-3">
                        <div className="profile">
                            <img src="/user.png" alt="User" />
                            <h2 className="name"><span>{user.name}</span>님</h2>
                            <div className="info">
                                <div className="area" style={{'border-right':'solid 1px lightgray'}}>
                                    <p>참여중인<br></br>스터디</p>
                                    <h2>{rooms.length}개</h2>
                                </div>
                                <div className="area">
                                    <p>참여중인<br></br>멘토링</p>
                                    <h2>{rooms2.length}개</h2>
                                </div>
                            </div>
                            <div className="create-btn" onClick={ ()=>navigate('./create')}>스터디 만들기</div>
                        </div>
                    </div>
                    <div class="col-md-9">
                        <div className="list-area">
                            <div className="header">
                                <h2 
                                    className={(type)==='study'?'sel':''}
                                    onClick={e=>{e.stopPropagation(); setType('study');}}
                                >스터디</h2>
                                <h2>/</h2>
                                <h2 
                                    className={(type)==='mentoring'?'sel':''}
                                    onClick={e=>{e.stopPropagation(); setType('mentoring');}}
                                >멘토링</h2>
                            </div>
                            <br></br>
                            {
                                type==='study'?
                                <>
                                    {
                                    chkAxios && rooms.length === 0 ? 
                                    <>
                                        <div className="img-notice">
                                            <img src='/img_study.png'></img>
                                            <div>참여한 스터디가 없네요! {" "}
                                                <span onClick={(e)=>{e.stopPropagation(); navigate('../study/main'); }}>
                                                    스터디 둘러보기
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <div className="items">
                                    {
                                        rooms.map((room, index) => (
                                            <div className="item" key={index} onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/studyroom/${room.id}`);
                                            }}>
                                                <div className="img-area">
                                                    <img src={room.image}/>
                                                    <div className="join-area">
                                                        <FontAwesomeIcon icon={faUser} />
                                                        <span>4명</span>
                                                    </div>
                                                </div>
                                                <h3>{room.name}</h3>
                                            </div>
                                        ))
                                    }
                                    </div>
                                }
                                </>
                                :
                                <>
                                {
                                    chkAxios && rooms2.length === 0 ? 
                                    <>
                                        <div className="img-notice">
                                            <img src='/img_study.png'></img>
                                            <div>참여한 멘토링이 없네요! {" "}
                                                <span onClick={(e)=>{e.stopPropagation(); navigate('../mentoring/main'); }}>
                                                    멘토링 둘러보기
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <div className="items">
                                    {
                                        rooms2.map((room, index) => (
                                            <div className="item" key={index} onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/studyroom/${room.id}`);
                                            }}>
                                                <div className="img-area">
                                                    <img src={room.image}/>
                                                    <div className="join-area">
                                                        <FontAwesomeIcon icon={faUser} />
                                                        <span>4명</span>
                                                    </div>
                                                </div>
                                                <h3>{room.name}</h3>
                                            </div>
                                        ))
                                    }
                                    </div>
                                }
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        }</>
    );
}


export default RoomMain;