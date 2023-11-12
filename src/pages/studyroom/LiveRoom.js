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
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons/faArrowsRotate";
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

const LiveRoom = ({type}) => {
    const socketRef = useRef();
    const studyLiveSocket = useWebSocket(`${type}Live`);
    const SOCKET_SERVER_URL = `http://localhost:8080/${type}`;
    const pcsRef = useRef({});
    const textRef = useRef(null);
    const localVideoRef = useRef(null);
    const localStreamRef = useRef();
    const editorRef = useRef(null)
    const [users, setUsers] = useState([]);
    const [roomChat, setRoomChat] = useState([]);
    const [isMikeOn, setIsMikeOn] = useState(undefined);
    const [isCameraOn, setIsCameraOn] = useState(undefined);
    const [isCodeOn, setIsCodeOn] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [myCode, setMyCode] = useState({ language: '', content: '' });
    const [myIndex, setMyIndex] = useState(0);
    const [isMyCodeUpload, setIsMyCodeUpload] = useState(false)
    const [isClicked, setIsClicked] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [clickedUser, setClickedUser] = useState({})
    const [bardText, setBardText] = useState('');
    const [bardAnswer, setBardAnswer] = useState('');
    const [isBardLoading, setIsBardLoading] = useState(false)
    const [marker, setMarker] = useState([{
        startRow: 0,
        startCol: 0,
        endRow: 0,
        endCol: 0,
        className: `error-marker-${myIndex}`,
        type: 'background'
    }])
    const [myMarker, setMyMarker] = useState([{
        startRow: 0,
        startCol: 0,
        endRow: 0,
        endCol: 0,
        className: `error-marker-${myIndex}`,
        type: 'background'
    }])


    const user = useSelector((state) => state.user);
    const currentUser = useSelector((state) => state.user);

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
            socketRef.current?.emit('join_room', {
                room: roomId,
                name: user.name,
            });
        } catch (e) {
            console.log(`getUserMedia error: ${e}`);
        }
    }, []);

    const createPeerConnection = useCallback((socketID, name, index) => {
        try {
            const pc = new RTCPeerConnection(pc_config);

            pc.onicecandidate = (e) => {
                if (!(socketRef.current && e.candidate)) return;
                socketRef.current.emit('candidate', {
                    candidate: e.candidate,
                    candidateSendID: socketRef.current.id,
                    candidateReceiveID: socketID,
                });
            };

            pc.oniceconnectionstatechange = (e) => {
            };

            pc.ontrack = (e) => {
                setUsers((oldUsers) =>
                    oldUsers
                        .filter((user) => user.id !== socketID)
                        .concat({
                            id: socketID,
                            name,
                            index,
                            stream: e.streams[0],
                        }),
                );
            };

            if (localStreamRef.current) {
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
        studyLiveSocket?.emit("enter", data);
    }

    function LeaveRoom() {
        let data = {
            roomId: Number(roomId)
        };
        studyLiveSocket?.emit("leave", data);
    }

    function uploadCode() {
        if (!selectedLanguage) {
            alert("언어를 선택해주세요")
            return
        } else if (!myCode.content) {
            alert("코드를 입력해주세요")
            return
        }
        const data = {
            roomId: Number(roomId),
            language: selectedLanguage,
            code: myCode.content,
            sender: user.name,
        };
        studyLiveSocket?.emit("codeSend", data);
        setIsMyCodeUpload(true)
    }

    const askBard = () => {
        if (!bardText) return
        setIsBardLoading(true)
        axios({
            method: "POST",
            url: `/study-room/${roomId}/code-bard`,
            data: {
                text: bardText
            }
        })
            .then(async (response) => {
                try {
                    await setBardAnswer(response.data.data.answer);
                    setIsBardLoading(false)
                    setBardText('')
                } catch {
                }
            })
            .catch(function (error) {
                console.log(error);
                setIsBardLoading(false)
                alert("요청을 처리하지 못했습니다")
            });

    }

    const onChangeSelection = (e) => {
        setMarker({
            startRow: e?.anchor?.row,
            startCol: e?.anchor?.column,
            endRow: e?.cursor?.row,
            endCol: e?.cursor?.column,
            className: `error-marker-${myIndex}`,
            type: 'background'
        })
    }

    const markCode = (language, code, writer, prevMarker) => {
        if (prevMarker) {
            const data = {
                roomId: Number(roomId),
                language: language,
                code: code,
                sender: writer,
                marker: [...prevMarker, marker]
            };
            studyLiveSocket?.emit("codeSend", data);
        }
        else {
            const data = {
                roomId: Number(roomId),
                language: language,
                code: code,
                sender: writer,
                marker: [marker]
            };
            studyLiveSocket?.emit("codeSend", data);

        }
        console.log(prevMarker)
    }

    useEffect(() => { console.log(users) }, [users])
    useEffect(() => { console.log(myIndex) }, [myIndex])


    useEffect(() => {
        socketRef.current = io.connect(SOCKET_SERVER_URL);
        getLocalStream();

        let index
        socketRef.current.on('index', (data) => {
            setMyIndex(data)
            index = data
        });

        socketRef.current.on('all_users', (allUsers) => {
            allUsers.forEach(async (user) => {
                if (!localStreamRef.current) return;
                const pc = createPeerConnection(user.id, user.name, user.index);
                if (!(pc && socketRef.current)) return;
                pcsRef.current = { ...pcsRef.current, [user.id]: pc };
                try {
                    const localSdp = await pc.createOffer({
                        offerToReceiveAudio: true,
                        offerToReceiveVideo: true,
                    });
                    await pc.setLocalDescription(new RTCSessionDescription(localSdp));
                    socketRef.current?.emit('offer', {
                        sdp: localSdp,
                        offerSendID: socketRef.current.id,
                        offerSendName: currentUser.name,
                        offerSendIndex: index,
                        offerReceiveID: user.id,
                    });
                    console.log(index)
                } catch (e) {
                    console.error(e);
                }
            });
        });

        socketRef.current.on(
            'getOffer',
            async (data) => {
                const { sdp, offerSendID, offerSendName, offerSendIndex } = data;
                if (!localStreamRef.current) return;
                const pc = createPeerConnection(offerSendID, offerSendName, offerSendIndex);
                if (!(pc && socketRef.current)) return;
                pcsRef.current = { ...pcsRef.current, [offerSendID]: pc };
                try {
                    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                    const localSdp = await pc.createAnswer({
                        offerToReceiveVideo: true,
                        offerToReceiveAudio: true,
                    });
                    await pc.setLocalDescription(new RTCSessionDescription(localSdp));
                    socketRef.current?.emit('answer', {
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
                const pc = pcsRef.current[answerSendID];
                if (!pc) return;
                pc.setRemoteDescription(new RTCSessionDescription(sdp));
            },
        );

        socketRef.current.on(
            'getCandidate',
            async (data) => {
                const pc = pcsRef.current[data.candidateSendID];
                if (!pc) return;
                await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
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
        if (!studyLiveSocket) return
        studyLiveSocket?.connect();
        studyLiveSocket.on("connect", (data) => {
            EnterRoom();
        });
        studyLiveSocket.on("sendFrom", (data) => {
            setRoomChat((prevRoomChat) => [...prevRoomChat, data]);
        });
        studyLiveSocket.on("codeUploadFrom", (data) => {
            console.log('codeUploadFrom', data.marker)

            if (data.sender === currentUser.name) {
                if (data.marker) {
                    setMyMarker(data.marker)
                }
                return
            }
            setUsers(users => {
                return users.map(user => {
                    if (user.name === data.sender) {
                        return { ...user, language: data.language, code: data.code, marker: data.marker };
                    }
                    return user;
                });
            });
        });
        studyLiveSocket.on("disconnect", (data) => {
            LeaveRoom();
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
        setClickedUser(user)
    }
    const borderColor=['rgba(255, 213, 0, 0.7)','rgba(255, 0, 0, 0.7)','rgba(0, 255, 10, 0.7)','rgba(128, 0, 255, 0.7)']


    return (
        <div className="live-room" ref={ref}>
            <div className="left-space">
                <div className="people-list">
                    <div onClick={() => onClickSomeone({})}>
                        <video
                            style={{
                                width: 150,
                                height: 150,
                                margin: 5,
                                backgroundColor: 'black',
                                borderWidth: 5,
                                borderColor: borderColor[myIndex]
                            }}
                            muted
                            ref={localVideoRef}
                            autoPlay
                        />
                        <div class='user-name'>{user.name}</div>
                    </div>

                    {users.map((user, index) => (
                        <div onClick={() => onClickSomeone(user)} >
                            <Video key={index} user={user} clickedUser={clickedUser} stream={user.stream} />
                        </div>

                    ))}
                </div>

                <div className="screen">
                    {!clickedUser?.id && <><div className="header">
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
                            <div>{isMyCodeUpload ? '재업로드' : '업로드 하기'}</div>
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
                            markers={myMarker}
                            value={myCode?.content}
                            style={{ 'width': '100%' }}
                            setOptions={{
                                tabSize: 2,
                                useWorker: false
                            }} /></>}
                    {clickedUser?.id && clickedUser?.language && clickedUser?.code &&
                        <>
                            <div onClick={() => markCode(clickedUser?.language, clickedUser?.code, clickedUser?.name, clickedUser?.marker)}>코드 하이라이트</div>
                            <AceEditor
                                mode={clickedUser.language}
                                theme="monokai"
                                name="blah2"
                                ref={editorRef}
                                fontSize={14}
                                showPrintMargin={true}
                                showGutter={true}
                                highlightActiveLine={true}
                                value={clickedUser.code}
                                style={{ 'width': '100%' }}
                                setOptions={{
                                    tabSize: 2,
                                    useWorker: false
                                }}
                                readOnly={true}
                                markers={clickedUser.marker ?? marker}
                                onSelectionChange={onChangeSelection} />
                        </>
                    }
                </div>
                {isCodeOn && <div className="ask-bard">
                    <div className="header">
                        {isBardLoading && <div className="bard-loading">바드가 답변을 작성하고 있습니다...</div>}
                        <FontAwesomeIcon className="close-button" icon={faXmark} onClick={() => { setIsCodeOn(false) }} />
                    </div>
                    {!bardAnswer && <textarea className="question" value={bardText} placeholder="바드에게 질문하기"
                        onChange={(e) => setBardText(e.target.value)} />}
                    {!bardAnswer && <div class="submit-button" onClick={() => { askBard() }}><FontAwesomeIcon icon={faPaperPlane} color="white" size="2x" /></div>}

                    {bardAnswer && <div className="answer" >{bardAnswer}</div>}
                    {bardAnswer && <div class="refresh-button" onClick={() => { setBardAnswer('') }}><FontAwesomeIcon icon={faArrowsRotate} color="white" size="2x" /></div>}
                </div>}
            </div>

            {showChat && <Chat roomId={roomId} roomChat={roomChat} setRoomChat={setRoomChat} setShowChat={setShowChat} isClicked={isClicked} handleDivClick={handleDivClick} />}


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
        </div >
    )
}

export default LiveRoom;
