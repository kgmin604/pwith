import React from 'react';
import "./studyroom.css";
import "../../assets/modal.css"
import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


function RoomMain(){
    let user = useSelector((state) => state.user);
    let navigate = useNavigate();

    let tmpData1 = {
        'roomId' : 1,
        'roomName' : '웹개발 아자아자',
        'leader' : 'Kim',
        'studentsList' : ['Part', 'Choi', 'Son'],
        'joinP' : 4,
        'totalP' : 5

    };
    let tmpData2 = {
        'roomId' : 2,
        'roomName' : '플라스크 개발',
        'leader' : 'Son',
        'studentsList' : ['Choi'],
        'joinP' : 2,
        'totalP' : 4

    };
    let tmpData3 = {
        'roomId' : 3,
        'roomName' : 'react 기초',
        'leader' : 'Part',
        'studentsList' : ['Kim'],
        'joinP' : 2,
        'totalP' : 2
    };
    let [rooms, setRooms] = useState([tmpData1, tmpData2, tmpData3]);
    
    
    return(
        <>
            <div className="room-part">
                <div className="row">
                    <div className="col-md-3">
                        <div className="profile">
                            <img src="/user.png" alt="User" />
                            <h2 className="name"><span>{user.name}</span>님</h2>
                            <div className="info">
                                <div className="area" style={{'border-right':'solid 1px lightgray'}}>
                                    <p>참여중인<br></br>스터디</p>
                                    <h2>3개</h2> {/* 서버 연결 후 수정!!! */}
                                </div>
                                <div className="area">
                                    <p>참여중인<br></br>멘토링</p>
                                    <h2>3개</h2> {/* 서버 연결 후 수정!!! */}
                                </div>
                            </div>
                            <div className="create-btn" onClick={ ()=>navigate('./create')}>스터디 만들기</div>
                        </div>
                    </div>
                    <div class="col-md-9">
                        <div className="list-area">
                            <h2><span style={{'color':'#98afca'}}>▶</span>스터디</h2>
                            <div className="items">
                            {
                                rooms.map((room, index) => (
                                    <a className="item" key={index} onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/studyroom/${room.roomId}`);
                                    }}>
                                    <h3>{room.roomName}</h3>
                                    </a>
                                ))
                            }
                            </div>
                        </div>
                        <div className="list-area">
                            <h2><span style={{'color':'#98afca'}}>▶</span>멘토링</h2>
                            <div className="items">
                            {
                                rooms.map((room, index) => (
                                    <a className="item" key={index} onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/studyroom/${room.roomId}`);
                                    }}>
                                    <h3>{room.roomName}</h3>
                                    </a>
                                ))
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default RoomMain;