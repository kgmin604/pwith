import React from 'react';
import "./studyroom.css";
import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

function RoomMain(){
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
                <div class="row">
                    <div class="col-md-3"> 
                        구성1
                    </div>
                    <div class="col-md-6">
                        <div>
                            <h2>참여중인 스터디</h2>
                            <div className="items">
                            {
                                rooms.map((room, index) => (
                                    <a className="item" key={room.roomId} onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/studyroom/${room.roomId}`);
                                    }}>
                                    <h3>{room.roomName}</h3>
                                    </a>
                                ))
                            }
                            </div>
                        </div>
                        <div>
                            <h2>참여중인 멘토링</h2>
                            <div className="items">
                            {
                                rooms.map((room, index) => (
                                    <a className="item" key={room.roomId} onClick={(e) => {
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
                    <div class="col-md-3">
                        구성2
                    </div>
                </div>
                </div>
            <div></div>
        </>
    );
}


export default RoomMain;