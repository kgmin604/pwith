import React from "react";
import "./liveroom.css";
import { useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from "@fortawesome/free-solid-svg-icons/faMicrophone";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons/faMicrophoneSlash";
import { faVideo } from "@fortawesome/free-solid-svg-icons/faVideo";
import { faVideoSlash } from "@fortawesome/free-solid-svg-icons/faVideoSlash";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import screenImg from "./screen.png"
import userImg from "./user.png"
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
const LiveRoom = () => {
    const [isMikeOn, setIsMikeOn] = useState(true)
    const [isCameraOn, setIsCameraOn] = useState(true)

    const [showPeople, setShowPeople] = useState(false)
    const [showChat, setShowChat] = useState(false)

    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    return (
        <div className="live-room">
            <div className="left-space">
                {showPeople && <div className="people-list">
                    {data.map((a, i) => {
                        return <div className="people"><img className="user-data" src={userImg} />
                            <div className="user-name">{a}</div>
                        </div>
                    })}
                </div>}

                <div className="screen">
                    <img className="screen-data" src={screenImg} />
                </div>
            </div >

            {showChat && <div className="right-space">
                <div className="header">채팅<FontAwesomeIcon icon={faXmark} onClick={() => { setShowChat(false) }} /></div>
                <div className="chat-user"><div className="chat-name">박주연</div><div className="chat-time">오후 5:40</div></div>
                <div className="chat-content">울랄라</div>
                <div className="chat-content">어쩌구</div>
                <div className="chat-content">움냔냥</div>
                <div className="chat-user"><div className="chat-name">김경민</div><div className="chat-time">오후 5:40</div></div>
                <div className="chat-content">코딩 공부 같이 해요</div>
                <div className="chat-content">재밌는 코딩 공부</div>
                <div className="chat-user"><div className="chat-name">박주연</div><div className="chat-time">오후 5:40</div></div>
                <div className="chat-content">울랄라</div>
                <div className="chat-content">어쩌구</div>
                <div className="chat-content">움냔냥</div>
            </div>}


            <div className="control-bar-wrapper">
                <div className="control-bar">
                    <div className="mike-button" onClick={() => setIsMikeOn(!isMikeOn)}>
                        {isMikeOn ? <FontAwesomeIcon icon={faMicrophoneSlash} color={'white'} size={'2x'} /> :
                            <FontAwesomeIcon icon={faMicrophone} color={'white'} size={'2x'} />}
                    </div>
                    <div className="video-button" onClick={() => setIsCameraOn(!isCameraOn)}>
                        {isCameraOn ? <FontAwesomeIcon icon={faVideoSlash} color={'white'} size={'2x'} /> :
                            <FontAwesomeIcon icon={faVideo} color={'white'} size={'2x'} />}
                    </div>
                    <div className="share-button" >
                        <FontAwesomeIcon icon={faArrowUpFromBracket} color={'white'} size={'2x'} />
                    </div>
                </div>

                <div className="control-bar" style={{ marginLeft: 180 }}>
                    <div className="people-button" onClick={() => setShowPeople(!showPeople)}>
                        <FontAwesomeIcon icon={faUsers} color={'white'} size={'2x'} />
                    </div>
                    <div className="chat-button" onClick={() => setShowChat(!showChat)}>
                        <FontAwesomeIcon icon={faComment} color={'white'} size={'2x'} />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default LiveRoom
