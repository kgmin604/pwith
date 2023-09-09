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
import { faCode } from "@fortawesome/free-solid-svg-icons";
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
    const [isCodeOn, setIsCodeOn] = useState(true)
    const [videoStream, setVideoStream] = useState(null); // 비디오 스트림을 따로 저장

    const videoRef = useRef(null);
    const [myStream, setMyStream] = useState(null)
    const [showPeople, setShowPeople] = useState(true)
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


    async function getMedia() {
        const initialConstrains = {
            'video': true,
            'audio': true,
        };
        try {
            const newStream = await navigator.mediaDevices.getUserMedia(initialConstrains);
            videoRef.current.srcObject = newStream
            setMyStream(newStream)
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
        myStream
            .getAudioTracks()
            .forEach((track) => (track.enabled = !track.enabled));
        setIsMikeOn((prev) => !prev)
    };

    const onClickCamera = async () => {
        setIsCameraOn((prev) => !prev);
        myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    };


    const onClickContentStream = () => {
        //컨텐츠
    }

    const onClickCode = () => {
        setIsCodeOn(!isCodeOn)
    }


    return (
        <div className="live-room" ref={ref}>
            <div className="left-space">
                <div className="people-list">
                    <div className="people"><video autoPlay playsInline className="my-camera" ref={videoRef} />
                        <div className="user-name">내 닉네임</div>
                    </div>
                    {data.map((a, i) => {
                        return <div className="people"><img className="user-data" src={userImg} />
                            <div className="user-name">{a}</div>
                        </div>
                    })}
                </div>

                <div className="screen">
                    <img className="screen-data" src={screenImg} />
                </div>
                {isCodeOn && <div className="code-upload">
                    <div className="header"><div>코드 업로드</div><FontAwesomeIcon icon={faXmark} onClick={() => { setIsCodeOn(false) }} /></div>
                    <textarea placeholder="코드를 업로드 하세요!" /></div>}
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
                    <div className="mike-button" onClick={onClickMike}>
                        {isMikeOn ? <FontAwesomeIcon icon={faMicrophoneSlash} color={'white'} size={'2x'} /> :
                            <FontAwesomeIcon icon={faMicrophone} color={'white'} size={'2x'} />}
                    </div>
                    <div className="video-button" onClick={onClickCamera}>
                        {isCameraOn ? <FontAwesomeIcon icon={faVideoSlash} color={'white'} size={'2x'} /> :
                            <FontAwesomeIcon icon={faVideo} color={'white'} size={'2x'} />}
                    </div>
                    <div className="share-button" onClick={onClickContentStream}>
                        <FontAwesomeIcon icon={faArrowUpFromBracket} color={'white'} size={'2x'} />
                    </div>
                    <div className="share-button" onClick={onClickCode}>
                        <FontAwesomeIcon icon={faCode} color={'white'} size={'2x'} />
                    </div>
                </div>
                <div className="control-bar" style={{ marginLeft: 180 }}>
                    {/* <div className="people-button" onClick={() => setShowPeople(!showPeople)}>
                        <FontAwesomeIcon icon={faUsers} color={'white'} size={'2x'} />
                    </div> */}
                    <div className="chat-button" onClick={() => setShowChat(!showChat)}>
                        <FontAwesomeIcon icon={faComment} color={'white'} size={'2x'} />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default LiveRoom;
