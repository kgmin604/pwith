import React, { Component } from "react";
import "./liveroom.css";
import { useState, useRef, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from "@fortawesome/free-solid-svg-icons/faMicrophone";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons/faMicrophoneSlash";
import { faVideo } from "@fortawesome/free-solid-svg-icons/faVideo";
import { faVideoSlash } from "@fortawesome/free-solid-svg-icons/faVideoSlash";
import { faComment, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { io } from 'socket.io-client';
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Video from "./Video";
import Chat from "./Chat";
import AceEditor from "react-ace";
import { useWebSocket } from "../../hooks/WebsocketHooks";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-language_tools";
import 'ace-builds/webpack-resolver';
import axios from "axios";


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
    const studyLiveSocket = useWebSocket('studyLive');
    const pcsRef = useRef({});
    const textRef = useRef(null);
    const localVideoRef = useRef(null);
    const localStreamRef = useRef();
    const [users, setUsers] = useState([]);
    const [roomChat, setRoomChat] = useState([]);
    const [isMikeOn, setIsMikeOn] = useState(undefined);
    const [isCameraOn, setIsCameraOn] = useState(undefined);
    const [isCodeOn, setIsCodeOn] = useState(true);
    const [showChat, setShowChat] = useState(false);
    const [myCode, setMyCode] = useState({ language: '', content: '' });
    const [isClicked, setIsClicked] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [clickedUser, setClickedUser] = useState({})
    const [bardText, setBardText] = useState('');
    const [bardAnswer, setBardAnswer] = useState('');


    const user = useSelector((state) => state.user);
    const roomId = useParams().id;

    const handleDivClick = () => {
        setIsClicked(true);
    };

    const ref = useRef(null);

    const handleLanguageChange = (e) => {
        setSelectedLanguage(e.target.value);
    };
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

    useEffect(() => {
        console.log(users)
    }, [users])

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

    function EnterRoom() {
        let data = {
            roomId: Number(roomId)
        };
        socketRef.current.emit("enter", data);
    }

    function LeaveRoom() {
        let data = {
            roomId: Number(roomId)
        };
        socketRef.current?.emit("leave", data);
    }

    function uploadCode() {
        const data = {
            roomId: Number(roomId),
            language: selectedLanguage,
            code: myCode.content,
            sender: user.id,
        };
        studyLiveSocket?.emit("codeSend", data);
    }

    const askBard = () => {
        console.log(bardText)
        if (!bardText) return
        axios({
            method: "POST",
            url: `/study-room/${roomId}/code-bard`,
            data: {
                text: bardText
            }
        })
            .then(function (response) {
                setBardAnswer(response.data.data.answer);
                console.log(response.data.data.answer)
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    useEffect(() => {
        socketRef.current = io.connect(SOCKET_SERVER_URL);
        // studyLiveSocket = io("http://localhost:5000/study-live", {
        //     cors: {
        //         origin: "*",
        //     },
        //     transports: ["polling"],
        //     autoConnect: false,
        // });
        getLocalStream();

        socketRef.current.on('all_users', (allUsers) => {
            console.log(allUsers)
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

            if (localStreamRef.current) {
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

    useEffect(() => {
        studyLiveSocket?.connect();
        studyLiveSocket.on("connect", (data) => {
            EnterRoom();
            console.log("socket connected");
        });
        studyLiveSocket.on("codeUploadFrom", (data) => {
            console.log(data)
            setUsers(users => {
                return users.map(user => {
                    if (user.name === data.sender) {
                        return { ...user, language: data.language, code: data.code };
                    }
                    return user;
                });
            });
        });
        studyLiveSocket.on("disconnect", (data) => {
            LeaveRoom();
            console.log("socket disconnected")
        });
    }, [studyLiveSocket])

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

    const onClickCode = () => {
        setIsCodeOn(!isCodeOn)
    }

    const onClickSomeone = (user) => {
        console.log(user)
        setClickedUser(user)
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
                        <div onClick={() => onClickSomeone(user)} >
                            <Video key={index} name={user.name} stream={user.stream} />
                        </div>

                    ))}
                </div>

                <div className="screen">
                    <div className="header">
                        <div class="language-select">
                            <div>코드 업로드</div>
                            <select value={selectedLanguage} onChange={handleLanguageChange}>
                                <option value="">-언어 선택-</option>
                                <option value="python">Python</option>
                                <option value="javascript">JavaScript</option>
                                <option value="java">Java</option>
                                <option value="c_cpp">C/C++</option>
                                <option value="html">HTML</option>
                                <option value="css">CSS</option>
                                <option value="markdown">Markdown</option>
                                <option value="sql">SQL</option>
                            </select>
                        </div>
                        <div class="upload-button" onClick={uploadCode}>
                            <div>업로드 하기</div>
                            <FontAwesomeIcon icon={faArrowUpFromBracket} color={'white'} size={'1x'} />
                        </div>
                    </div>
                    <AceEditor
                        placeholder="코드를 입력하세요"
                        mode={selectedLanguage}
                        theme="monokai"
                        name="blah2"
                        ref={textRef}
                        onChange={(evn) => setMyCode({ ...myCode, content: evn })}
                        fontSize={14}
                        showPrintMargin={true}
                        showGutter={true}
                        highlightActiveLine={true}
                        value={myCode?.content}
                        style={{ 'width': '100%' }}
                        setOptions={{
                            tabSize: 2,
                            useWorker: false
                        }} />
                </div>
                {isCodeOn && <div className="ask-bard">
                    <div className="header">
                        <FontAwesomeIcon icon={faXmark} onClick={() => { setIsCodeOn(false) }} />
                    </div>
                    <textarea value={bardText} placeholder="바드에게 질문하기"
                        onChange={(e) => setBardText(e.target.value)} />
                    <div class="submit-button" onClick={() => { askBard() }}><FontAwesomeIcon icon={faPaperPlane} color="white" size="2x" /></div>
                </div>}
            </div>

            {/* {showChat && <Chat socketRef={flaskSocketRef} roomChat={roomChat} setRoomChat={setRoomChat} setShowChat={setShowChat} isClicked={isClicked} handleDivClick={handleDivClick} />} */}


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
                    <div className="share-button" onClick={onClickCode}>
                        <FontAwesomeIcon icon={faCode} color={'white'} size={'2x'} />
                    </div>
                </div>
                <div className="control-bar" style={{ marginLeft: 180 }}>
                    <div className="chat-button" onClick={() => setShowChat(!showChat)}>
                        <FontAwesomeIcon icon={faComment} color={'white'} size={'2x'} />
                    </div>
                </div>
            </div>
            {clickedUser && clickedUser?.language && clickedUser?.code &&
                <AceEditor
                    placeholder="코드를 입력하세요"
                    mode={clickedUser.language}
                    theme="monokai"
                    name="blah2"
                    ref={textRef}
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={clickedUser.code}
                    style={{ 'width': '100%' }}
                    setOptions={{
                        tabSize: 2,
                        useWorker: false
                    }} />}
        </div >
    )
}

export default LiveRoom;
