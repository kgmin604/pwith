import React from 'react';
import axios from "axios";

import "./studyroom.css";
import "../../assets/modal.css"
import { useState, useEffect  } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


function RoomMain(){
    let user = useSelector((state) => state.user);
    let navigate = useNavigate();

    let [rooms, setRooms] = useState([]);
    let [rooms2, setRooms2] = useState([]);

    let [chkAxios, setChkAxios] = useState(false);

    useEffect(()=>{
        axios({
            method: "GET",
            url: "/studyroom"
        })
        .then(function (response) {
            setRooms(response.data.studyRoom);
            setRooms2(response.data.mentoringRoom);
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
                <div><span onClick={()=>navigate('../login')}>로그인</span> 후 사용해주세요!</div>
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
                            <h2><span style={{'color':'#98afca'}}>▶</span>스터디</h2>
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
                                        <a className="item" key={index} onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/studyroom/${room.roomId}`);
                                        }}>
                                        <h3>{room.title}{room.leader===user.id?' 👑':''}</h3>
                                        </a>
                                    ))
                                }
                                </div>
                            }
                        </div>
                        <div className="list-area">
                            <h2><span style={{'color':'#98afca'}}>▶</span>멘토링</h2>
                            <div className="items">
                            {
                                rooms2.map((room, index) => (
                                    <a className="item" key={index} onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/mentoring/${room.roomId}`);
                                    }}>
                                    <h3>{room.title}</h3>
                                    </a>
                                ))
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }</>
    );
}


export default RoomMain;