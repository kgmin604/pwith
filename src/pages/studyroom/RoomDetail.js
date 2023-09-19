import React from "react";
import axios from "axios";

import io from "socket.io-client";

import "./RoomDetail.css";
import "./liveroom.css";
import { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons/faCrown";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons/faMicrophone";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons/faMicrophoneSlash";
import { faVideo } from "@fortawesome/free-solid-svg-icons/faVideo";
import { faVideoSlash } from "@fortawesome/free-solid-svg-icons/faVideoSlash";
import { faPencil } from "@fortawesome/free-solid-svg-icons/faPencil";
import { faMessage } from "@fortawesome/free-solid-svg-icons/faMessage";

let socket;

function RoomDetail() {

  const chatAreaRef = useRef(null);

  let user = useSelector((state) => state.user);
  let navigate = useNavigate();

  let [roomInfo, setRoomInfo] = useState({
    id: 0,
    name: "",
    image: "",
    notice: "",
    leader: "",
    members: [
      /*
            {
                "image": "",
                "memId": "",
                "nickname": ""
            },
            */
    ],
  });

  let [roomChat, setRoomChat] = useState([]);
  let [myChat, setMyChat] = useState("");

  let [isModalOpen, setIsModalOpen] = useState(false);
  let [isMikeOn, setIsMikeOn] = useState(false);
  let [isCameraOn, setIsCameraOn] = useState(false);
  let [isOn, setIsOn] = useState(false);
  let [isChange, setIsChange] = useState(false);

  let [newNotice, setNewNotice] = useState("");

  // 개인 쪽지 관련 데이터
  let [chatName, setChatName] = useState("");
  let [chatContent, setChatContent] = useState("");
  let [msg, setMsg] = useState("");

  function handleMouseOver(event) {
    event.stopPropagation();
    setIsOn(true);
  }

  function handleMouseOut(event) {
    event.stopPropagation();
    setIsOn(false);
  }

  function changeNotice(e) {
    e.stopPropagation();
    setNewNotice(e.target.value);
  }

  function requestChangeNotice(){
    axios({
      method: "PATCH",
      url: `/study-room/${roomInfo.id}`,
      data:{
        notice: `${newNotice}`
      }
    })
      .then(function (response) {
        setRoomInfo(response.data.data.room);
        setRoomChat(response.data.data.chat);
        setNewNotice(response.data.data.room.notice);
      })
      .catch(function (error) {
        //console.log(error);
      });
  }

  function handleModal(event) {
    event.stopPropagation();
    setIsModalOpen(!isModalOpen);
  }

  function changeNickname(event) {
    event.stopPropagation();
    setChatName(event.target.value);
  }

  function changeContent(event) {
    event.stopPropagation();
    setChatContent(event.target.value);
  }

  function changeChatInput(event) {
    event.stopPropagation();
    setMyChat(event.target.value);
  }

  function requestDeleteRoom(event){
    event.stopPropagation();

    if (window.confirm("정말로 삭제하시겠습니까?")){
      axios({
        method: "DELETE",
        url: `/study-room/${roomInfo.id}`,
      })
        .then(function (response) {
          alert('삭제가 완료되었습니다.');
          navigate('./..');
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  // 소켓 통신 함수

  function sendTo() {
    const url = window.location.href;
    const part = url.split("/");
    const RoomId = part[part.length - 1];
    let data = {
      roomId: Number(RoomId),
      message: myChat,
      sender: user.name,
    };
    socket.emit("sendTo", data);
    document.getElementById("chat-area").value = "";
    setMyChat("");
  }

  function EnterRoom(){
    const url = window.location.href;
    const part = url.split("/");
    const RoomId = part[part.length - 1];
    let data = {
      roomId: Number(RoomId)
    };
    socket.emit("enter",data);
  }

  function LeaveRoom(){
    const url = window.location.href;
    const part = url.split("/");
    const RoomId = part[part.length - 1];
    let data = {
      roomId: Number(RoomId)
    };
    socket.emit("leave",data);
  }

  // room data 받아오기

  useEffect(() => {
    const url = window.location.href;
    const part = url.split("/");
    const RoomId = part[part.length - 1];

    axios({
      method: "GET",
      url: `/study-room/${RoomId}`,
    })
      .then(function (response) {
        setRoomInfo(response.data.data.room);
        setRoomChat(response.data.data.chat);
        setNewNotice(response.data.data.room.notice);
      })
      .catch(function (error) {
        //console.log(error);
      });
  }, []);

  // 소켓 통신하기

  useEffect(() => {
    // socket = io('http://localhost:5000', {
    //     cors: {
    //         origin: '*',
    //     },
    //     transports: ["websocket"],
    // });
    socket = io("http://localhost:5000", {
      cors: {
        origin: "*",
      },
      transports: ["polling"],
      autoConnect: false,
    });
    console.log("연결 시도");
    socket.connect();

    socket.on("connect", (data) => {
      EnterRoom();
      console.log("Socket connected");
    });
    socket.on("sendFrom", (data) => {
      setRoomChat((prevRoomChat) => [...prevRoomChat, data]);
    });
    socket.on("disconnect", (data)=>{
      LeaveRoom();
      console.log("Socket disconnected")
    });
  }, []);

  // 스크롤 영역을 항상 아래로 스크롤하는 함수
  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  };

  // 컴포넌트가 업데이트 될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [roomChat]);

  const pressEnter = (e) => {
    e.stopPropagation();
    if (e.key === 'Enter' && e.shiftKey) { // [shift] + [Enter] 치면 걍 리턴
      return;
    } else if (e.key === 'Enter') { 	   // [Enter] 치면 메시지 보내기
      sendTo();
    }
  };

  return (
    <>
      <div className="room-detail-wrap">
        <div className="row">
          <div className="col-md-3">
            <div className="info-area">
              <img src={`${roomInfo.image}`} alt="User" />
              <div className="info-header">
                <h3>{roomInfo.name}</h3>
                <h3
                  className="leader"
                >
                  LEADER
                  <FontAwesomeIcon
                    icon={faCrown}
                    style={{ color: "rgb(61, 105, 144)", margin: "0 5px" }}
                  />
                  {roomInfo.leader}
                </h3>
              </div>
              <div className="setting">
                <div
                  className="mike-button"
                  onClick={() => setIsMikeOn(!isMikeOn)}
                >
                  {isMikeOn ? (
                    <FontAwesomeIcon
                      icon={faMicrophoneSlash}
                      color={"white"}
                      size={"1x"}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faMicrophone}
                      color={"white"}
                      size={"1x"}
                    />
                  )}
                </div>
                <div
                  className="video-button"
                  onClick={() => setIsCameraOn(!isCameraOn)}
                >
                  {isCameraOn ? (
                    <FontAwesomeIcon
                      icon={faVideoSlash}
                      color={"white"}
                      size={"1x"}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faVideo}
                      color={"white"}
                      size={"1x"}
                    />
                  )}
                </div>
              </div>
              <div
                className="ent-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`./../studyroom/live/${roomInfo.id}`, '_blank');
                }}
              >
                입장하기
              </div>
              {user.name === roomInfo.leader ? (
                <span
                  className="room-delete-btn"
                  onClick={e=>requestDeleteRoom(e)}
                >
                  스터디 삭제하기
                </span>
              ) : null}
            </div>
          </div>
          <div class="col-md-9">
            <div className="content-area">
              <div className="top">
                <h2>{roomInfo.name}</h2>
                <div
                  className="notice"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  <span>📢</span>
                  {isChange ? (
                    <>
                      <input
                        type="text"
                        value={newNotice}
                        onChange={(e) => {
                          changeNotice(e);
                        }}
                      ></input>
                      <div
                        className="notice-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          requestChangeNotice();
                          setIsChange(false);
                        }}
                      >
                        확인
                      </div>
                    </>
                  ) : (
                    <span>{newNotice}</span>
                  )}
                  {isOn && roomInfo.leader === user.name && !isChange ? (
                    <FontAwesomeIcon
                      icon={faPencil}
                      style={{ color: "#9e9e9e", margin: "0 5px" }}
                      className="fapencil"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsChange(true);
                      }}
                    />
                  ) : null}
                </div>
              </div>
              <div className="bottom">
                <div className="member-list">
                  <h2>스터디 멤버</h2>
                  <hr style={{ margin: "0 0" }}></hr>
                  <div className="items">
                    {roomInfo.members.map((member, i) => (
                      <div className="item" key={i}>
                        <h3>{member.nickname}</h3>
                        {member.nickname !== user.name ? (
                          <FontAwesomeIcon
                            icon={faMessage}
                            className="send-btn"
                            onClick={(e) => {
                              setChatName(member.nickname);
                              handleModal(e);
                            }}
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="member-chat">
                  <h2>Chatting</h2>
                  <hr style={{ margin: "0 0" }}></hr>
                  <div 
                    className="chats scroll"
                    ref={chatAreaRef}
                >
                    {roomChat.map((chat, i) => (
                      <>
                        {chat.sender !== user.name ? (
                          <div className="chat-type1">
                            <img src="https://pwith-bucket.s3.ap-northeast-2.amazonaws.com/kkm5424.jpg?version=0.17936649555278406" 
                            onClick={e=>alert(roomInfo.members[`${chat.sender}`])}/>
                            <div className="content">
                              <h3>{chat.sender}</h3>
                              <div className="chat-time">
                                <p style={{ whiteSpace: "pre-line" }} >{chat.content}</p>
                                <time>{chat.date}</time>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="chat-type2">
                            <div className="chat-time">
                              <time>{chat.date}</time>
                              <p style={{ whiteSpace: "pre-line" }}>{chat.content}</p>
                            </div>
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                  <hr style={{ margin: "0 0" }}></hr>
                  <div className="sending-area">
                    <textarea
                      id="chat-area"
                      onChange={(e) => changeChatInput(e)}
                      onKeyDown={pressEnter}
                    ></textarea>
                    <div
                      className="sending-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        sendTo();
                      }}
                    >
                      전송
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isModalOpen === true ? (
          <>
            <div className="modal-wrap"></div>
            <form method="POST">
              <div className="modal">
                <a
                  title="닫기"
                  className="close"
                  onClick={(event) => handleModal(event)}
                >
                  X
                </a>
                <h3>쪽지 보내기</h3>
                <p className="receiver">
                  <input
                    type="text"
                    onChange={(e) => {
                      changeNickname(e);
                    }}
                    placeholder="수신자 아이디 입력"
                    defaultValue={chatName} // 수정
                  ></input>
                </p>
                <p>
                  <textarea
                    name="message"
                    className="text"
                    placeholder="내용 입력"
                    onChange={(e) => changeContent(e)}
                  ></textarea>
                </p>
                <input type="button" value="전송" className="button"></input>
                <div className="message">{msg}</div>
              </div>
            </form>
          </>
        ) : null}
      </div>
    </>
  );
}

export default RoomDetail;