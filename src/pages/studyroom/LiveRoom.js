import React from "react";
import "./liveroom.css";
import { useState, useRef, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from "@fortawesome/free-solid-svg-icons/faMicrophone";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons/faMicrophoneSlash";
import { faVideo } from "@fortawesome/free-solid-svg-icons/faVideo";
import { faVideoSlash } from "@fortawesome/free-solid-svg-icons/faVideoSlash";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { io } from 'socket.io-client';
import screenImg from "./screen.png"
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Video from "./Video";
import Chat from "./Chat";

const pc_config = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302',
        },
    ],
};

const SOCKET_SERVER_URL = 'http://localhost:8080';
const LiveRoom = () => {
    const socketRef = useRef();
    const pcsRef = useRef({});
    const localVideoRef = useRef(null);
    const localStreamRef = useRef();
    const [users, setUsers] = useState([]);
    const [roomChat, setRoomChat] = useState([]);
    const [isMikeOn, setIsMikeOn] = useState(undefined)
    const [isCameraOn, setIsCameraOn] = useState(undefined)
    const [isCodeOn, setIsCodeOn] = useState(true)
    const [showChat, setShowChat] = useState(false)
    const [isClicked, setIsClicked] = useState(false);
    const user = useSelector((state) => state.user);
    const roomId = useParams().id;

    const handleDivClick = () => {
        setIsClicked(true);
    };

    const ref = useRef(null);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsClicked(false);
        }
    };


    const getLocalStream = useCallback(async () => {
        try {
            const localStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    width: 240,
                    height: 240,
                },
            });
            localStreamRef.current = localStream;
            if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
            if (!socketRef.current) return;
            socketRef.current.emit('join_room', {
                room: roomId,
                name: user.name,
            });
        } catch (e) {
            console.log(`getUserMedia error: ${e}`);
        }
    }, []);

    const createPeerConnection = useCallback((socketID, name) => {
        try {
            const pc = new RTCPeerConnection(pc_config);

            pc.onicecandidate = (e) => {
                if (!(socketRef.current && e.candidate)) return;
                console.log('onicecandidate');
                socketRef.current.emit('candidate', {
                    candidate: e.candidate,
                    candidateSendID: socketRef.current.id,
                    candidateReceiveID: socketID,
                });
            };

            pc.oniceconnectionstatechange = (e) => {
                console.log(e);
            };

            pc.ontrack = (e) => {
                console.log('ontrack success');
                setUsers((oldUsers) =>
                    oldUsers
                        .filter((user) => user.id !== socketID)
                        .concat({
                            id: socketID,
                            name,
                            stream: e.streams[0],
                        }),
                );
            };

            if (localStreamRef.current) {
                console.log('localstream add');
                localStreamRef.current.getTracks().forEach((track) => {
                    if (!localStreamRef.current) return;
                    pc.addTrack(track, localStreamRef.current);
                });
            } else {
                console.log('no local stream');
            }

            return pc;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }, []);

    useEffect(() => {
        socketRef.current = io.connect(SOCKET_SERVER_URL);
        getLocalStream();

        socketRef.current.on('all_users', (allUsers) => {
            allUsers.forEach(async (user) => {
                if (!localStreamRef.current) return;
                const pc = createPeerConnection(user.id, user.name);
                if (!(pc && socketRef.current)) return;
                pcsRef.current = { ...pcsRef.current, [user.id]: pc };
                try {
                    const localSdp = await pc.createOffer({
                        offerToReceiveAudio: true,
                        offerToReceiveVideo: true,
                    });
                    console.log('create offer success');
                    await pc.setLocalDescription(new RTCSessionDescription(localSdp));
                    socketRef.current.emit('offer', {
                        sdp: localSdp,
                        offerSendID: socketRef.current.id,
                        offerSendName: user.name,
                        offerReceiveID: user.id,
                    });
                } catch (e) {
                    console.error(e);
                }
            });
        });

        socketRef.current.on(
            'getOffer',
            async (data) => {
                const { sdp, offerSendID, offerSendName } = data;
                console.log('get offer');
                if (!localStreamRef.current) return;
                const pc = createPeerConnection(offerSendID, offerSendName);
                if (!(pc && socketRef.current)) return;
                pcsRef.current = { ...pcsRef.current, [offerSendID]: pc };
                try {
                    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                    console.log('answer set remote description success');
                    const localSdp = await pc.createAnswer({
                        offerToReceiveVideo: true,
                        offerToReceiveAudio: true,
                    });
                    await pc.setLocalDescription(new RTCSessionDescription(localSdp));
                    socketRef.current.emit('answer', {
                        sdp: localSdp,
                        answerSendID: socketRef.current.id,
                        answerReceiveID: offerSendID,
                    });
                } catch (e) {
                    console.error(e);
                }
            },
        );

        socketRef.current.on(
            'getAnswer',
            (data) => {
                const { sdp, answerSendID } = data;
                console.log('get answer');
                const pc = pcsRef.current[answerSendID];
                if (!pc) return;
                pc.setRemoteDescription(new RTCSessionDescription(sdp));
            },
        );

        socketRef.current.on(
            'getCandidate',
            async (data) => {
                console.log('get candidate');
                const pc = pcsRef.current[data.candidateSendID];
                if (!pc) return;
                await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
                console.log('candidate add success');
            },
        );

        socketRef.current.on('user_exit', (data) => {
            if (!pcsRef.current[data.id]) return;
            pcsRef.current[data.id].close();
            delete pcsRef.current[data.id];
            setUsers((oldUsers) => oldUsers.filter((user) => user.id !== data.id));
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }

            if(localStreamRef.current){
                localStreamRef.current.getVideoTracks()[0].stop()
                localStreamRef.current = null;
            }
            users.forEach((user) => {
                if (!pcsRef.current[user.id]) return;
                pcsRef.current[user.id].close();
                delete pcsRef.current[user.id];
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createPeerConnection, getLocalStream]);

    const onClickMike = async () => {
        if (!localVideoRef.current) return
        localVideoRef.current.srcObject
            .getAudioTracks()
            .forEach((track) => (track.enabled = !track.enabled));
        setIsMikeOn((prev) => !prev)
    };

    const onClickCamera = async () => {
        if (!localVideoRef.current) return
        setIsCameraOn((prev) => !prev);
        localVideoRef.current.srcObject.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
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
                    <div>
                    <video
                        style={{
                            width: 150,
                            height: 150,
                            margin: 5,
                            backgroundColor: 'black',
                        }}
                        muted
                        ref={localVideoRef}
                        autoPlay
                    />
                    <div class='user-name'>{user.name}</div>
                    </div>
                    
                    {users.map((user, index) => (
                        <Video key={index} name={user.name} stream={user.stream} />
                    ))}
                </div>

                <div className="screen">
                    <img className="screen-data" src={screenImg} />
                </div>
                {isCodeOn && <div className="code-upload">
                    <div className="header"><div>코드 업로드</div><FontAwesomeIcon icon={faXmark} onClick={() => { setIsCodeOn(false) }} /></div>
                    <textarea placeholder="코드를 업로드 하세요!" /></div>}
            </div >

            {showChat && <Chat roomChat={roomChat} setRoomChat={setRoomChat} setShowChat={setShowChat} isClicked={isClicked} handleDivClick={handleDivClick} />}


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
