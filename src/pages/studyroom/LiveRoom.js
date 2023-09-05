import React from "react";
import "./liveroom.css";
import { useState, useRef, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from "@fortawesome/free-solid-svg-icons/faMicrophone";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons/faMicrophoneSlash";
import { faVideo } from "@fortawesome/free-solid-svg-icons/faVideo";
import { faVideoSlash } from "@fortawesome/free-solid-svg-icons/faVideoSlash";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import io from 'socket.io-client';
import screenImg from "./screen.png"
import userImg from "./user.png"
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const LiveRoom = () => {
    const [isMikeOn, setIsMikeOn] = useState(true)
    const [isCameraOn, setIsCameraOn] = useState(true)
    const audioRef = useRef(null);
    let myStream
    const [showPeople, setShowPeople] = useState(false)
    const [showChat, setShowChat] = useState(false)

    const [isClicked, setIsClicked] = useState(false);
    const handleDivClick = () => {
        setIsClicked(true);
    };
    const textRef = useRef();
    const ref = useRef(null);
    const handleResizeHeight = useCallback(() => {
        textRef.current.style.height = textRef.current.scrollHeight + "px";
    }, []);
    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsClicked(false);
        }
    };


    async function getMedia(callback) {
        const initialConstrains = {
            'video': false,
            'audio': true,
        };
        try {
            myStream = await navigator.mediaDevices.getUserMedia(initialConstrains);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        getMedia()
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const onClickMike = async () => {
        if (audioRef.current) {
            const audio = audioRef.current;
            if (isMikeOn) {
                audio.srcObject = null;
            } else {
                try {
                    // 마이크 켜기
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    audio.srcObject = stream;
                } catch (error) {
                    console.error("Failed to get audio stream: ", error);
                }
            }
            setIsMikeOn(!isMikeOn);
        }
    };

    const onClickContentStream = () => {
        setIsCameraOn(!isCameraOn)
    }


    return (
        <div className="live-room" ref={ref}>
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
                <div>
                    <div className="header">채팅<FontAwesomeIcon icon={faXmark} onClick={() => { setShowChat(false) }} /></div>
                    <div className="chat">
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
                    </div>
                </div>
                <form className={`chat-input ${isClicked ? 'clicked' : ''}`} onClick={handleDivClick}>
                    <textarea ref={textRef} onInput={handleResizeHeight} />
                    <div className="iconWrapper">
                        <FontAwesomeIcon icon={faPaperPlane} color={'white'} />
                    </div>
                </form>
            </div>}


            <div className="control-bar-wrapper">
                <div className="control-bar">
                    <div className="mike-button" ref={audioRef} autoPlay controls onClick={onClickMike}>
                        {isMikeOn ? <FontAwesomeIcon icon={faMicrophoneSlash} color={'white'} size={'2x'} /> :
                            <FontAwesomeIcon icon={faMicrophone} color={'white'} size={'2x'} />}
                    </div>
                    <div className="video-button" onClick={onClickContentStream}>
                        {isCameraOn ? <FontAwesomeIcon icon={faVideoSlash} color={'white'} size={'2x'} /> :
                            <FontAwesomeIcon icon={faVideo} color={'white'} size={'2x'} />}
                    </div>
                    {/* <div className="share-button" onClick={onClickContentStream}>
                        <FontAwesomeIcon icon={faArrowUpFromBracket} color={'white'} size={'2x'} />
                    </div> */}
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

export default LiveRoom;
