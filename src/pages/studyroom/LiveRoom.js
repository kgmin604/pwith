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
import io from 'socket.io-client';
import screenImg from "./screen.png"
import userImg from "./user.png"
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { useNavigate, useParams } from "react-router-dom";

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const LiveRoom = () => {
    const { id } = useParams();
    const [isMikeOn, setIsMikeOn] = useState(undefined)
    const [isCameraOn, setIsCameraOn] = useState(undefined)
    const [isCodeOn, setIsCodeOn] = useState(true)
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

    const socketRef = useRef();
    // 자신의 비디오
    const myVideoRef = useRef(null);
    // 다른사람의 비디오
    const otherVideoRef = useRef(null);
    // peerConnection
    const peerRef = useRef();

    const getMedia = async () => {

        // 자신이 원하는 자신의 스트림정보
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        if (myVideoRef.current) {
            myVideoRef.current.srcObject = stream
            console.log('stream', stream)
        }

        // 스트림을 peerConnection에 등록
        stream.getTracks().forEach((track) => {
            if (!peerRef.current) {
                return;
            }
            peerRef.current.addTrack(track, stream);
        });

        peerRef.current.addEventListener("icecandidate", handleIce);
        peerRef.current.addEventListener("addstream", handleAddStream);
    }

    function handleIce(data) {
        console.log("sent candidate");
        socket.emit("ice", data.candidate);
      }
      
      function handleAddStream(data) {
        if(otherVideoRef.current){
            otherVideoRef.current.srcObject = data.stream;
        }
      }

    const createOffer = async () => {
        console.log("create Offer");
        if (!(peerRef.current && socketRef.current)) {
            return;
        }
        const sdp = await peerRef.current.createOffer();
        peerRef.current.setLocalDescription(sdp);
        console.log('createOffer setRemoteDescription 시그널 상태',  peerRef.current.signalingState)
        console.log("sent the offer");
        socketRef.current.emit("offer", sdp);
    };

    const createAnswer = async (sdp) => {
        console.log("createAnswer");
        if (!(peerRef.current && socketRef.current)) {
            return;
        }
        console.log('createAnswer setRemoteDescription 시그널 상태', peerRef.current.signalingState)
        peerRef.current.setRemoteDescription(sdp);

        const answerSdp = await peerRef.current.createAnswer();
        console.log('createAnswer setLocalDescription 시그널 상태', peerRef.current.signalingState)
        peerRef.current.setLocalDescription(answerSdp);
        console.log("sent the answer");
        socketRef.current.emit("answer", answerSdp);
    }
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        socketRef.current = io("http://localhost:5000", {
            cors: {
                origin: "*",
            },
            transports: ["polling"],
            autoConnect: false,
        });
        socketRef.current.connect()
        peerRef.current = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:stun1.l.google.com:19302",
                        "stun:stun2.l.google.com:19302",
                        "stun:stun3.l.google.com:19302",
                        "stun:stun4.l.google.com:19302",
                    ],
                },
            ],
        });
        console.log("연결 시도");

        socketRef.current.on("connect", (data) => {
            // socket 연결 성공. 서버와 통신 시작.
            console.log("Socket connected");
            socketRef.current.emit("join_room", id);
        });

        socketRef.current.on("welcome", () => {
            console.log('welcome 받음')
            createOffer();
        });

        socketRef.current.on("offer", (sdp) => {
            console.log("recv Offer");
            createAnswer(sdp);
        });

        // answer를 전달받을 PeerA만 해당됩니다.
        // answer를 전달받아 PeerA의 RemoteDescription에 등록
        socketRef.current.on("answer", async (sdp) => {
            console.log("recv Answer");
            if (!peerRef.current) {
                return;
            }

            // if (peerRef.current.signalingState !== "stable") {
            try {
                console.log('on answer setRemoteDescription 시그널 상태', peerRef.current.signalingState)
                peerRef.current.setRemoteDescription(sdp);
            } catch (error) {
                console.error("원격 설명 설정 오류:", error);
            }
            // } else {
            //     console.error("잘못된 상태에서 원격 설명을 설정하려고 시도했습니다:", peerRef.current.signalingState);
            // }
        });

        socketRef.current.on("ice", async (candidate) => {
            if (!peerRef.current) {
                return;
            }
            peerRef.current.addIceCandidate(candidate);
        });

        getMedia()

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            socketRef.current.disconnect();
        };
    }, []);

    const onClickMike = async () => {
        if (!myVideoRef.current) return
        myVideoRef.current
            .getAudioTracks()
            .forEach((track) => (track.enabled = !track.enabled));
        setIsMikeOn((prev) => !prev)
    };

    const onClickCamera = async () => {
        if (!myVideoRef.current) return
        setIsCameraOn((prev) => !prev);
        myVideoRef.current.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
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
                    <div className="people"><video autoPlay playsInline className="my-camera" ref={myVideoRef} />
                        <div className="user-name">내 닉네임</div>
                    </div>
                    <div className="people"><video autoPlay playsInline className="my-camera" ref={otherVideoRef} />
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
