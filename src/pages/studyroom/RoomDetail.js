import React from 'react';
import axios from "axios";

import "./RoomDetail.css";
import "./liveroom.css";
import { useState, useEffect  } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from "@fortawesome/free-solid-svg-icons/faCrown";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons/faMicrophone";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons/faMicrophoneSlash";
import { faVideo } from "@fortawesome/free-solid-svg-icons/faVideo";
import { faVideoSlash } from "@fortawesome/free-solid-svg-icons/faVideoSlash";
import { faPencil } from "@fortawesome/free-solid-svg-icons/faPencil";
import { faMessage } from "@fortawesome/free-solid-svg-icons/faMessage";


function RoomDetail(){
    let user = useSelector((state) => state.user);
    let navigate = useNavigate();
    
    let [roomInfo, setRoomInfo] = useState({
        id:31,
        name: '방학맞이 알고리즘',
        img:'https://pwith-bucket.s3.ap-northeast-2.amazonaws.com/studyroom/kkm5424203979823822.jpg',
        notice: '공지입니다',
        leader: '경민',
        mem: ['경민', '주연', '채영', '정윤']
    });
    let tmp1 = {
        sender: '경민',
        content: '채팅을 보냈습니다다다다다다다다다다다다다다다다다다다다다다다다다라라라라라라라라라라라라라라라라라라라라라라라라라',
        date: '23/09/05 15:00'
    };
    let tmp2 = {
        sender: '채영',
        content: '답장을 보냈습니다다다다다다다다다다다다다다다라라라라라라라라라라라라',
        date: '23/09/05 16:00'
    };
    let [roomChat, setRoomChat] = useState([tmp1,tmp1,tmp2,tmp2,tmp1,tmp1,tmp2,tmp2,tmp1,tmp1,tmp2,tmp2,]);

    let [isModalOpen, setIsModalOpen] = useState(false);
    let [isMikeOn, setIsMikeOn] = useState(false);
    let [isCameraOn, setIsCameraOn] = useState(false);
    let [isOn, setIsOn] = useState(false);
    let [isChange, setIsChange] = useState(false);

    let [newNotice, setNewNotice] = useState('공지입니다');
    let [chatName, setChatName] = useState('경민');
    let [chatContent, setChatContent] = useState(''); // 개인쪽지
    let [msg, setMsg] = useState(''); // 개인쪽지
    
    function handleMouseOver(event){
        event.stopPropagation();
        setIsOn(true);
    }

    function handleMouseOut(event){
        event.stopPropagation();
        setIsOn(false);
    }

    function changeNotice(e){
        e.stopPropagation();
        setNewNotice(e.target.value);
    }

    function handleModal(event){
        event.stopPropagation();
        setIsModalOpen(!isModalOpen);
    }

    function changeNickname(event){
        event.stopPropagation();
        setChatName(event.target.value);
    }

    function changeContent(event){
        event.stopPropagation();
        setChatContent(event.target.value);
    }

    /*
    useEffect(()=>{
        const url = window.location.href;
        const part = url.split("/");
        const RoomId = part[part.length-1];

        axios({
            method: "GET",
            url: `/study-room/${RoomId}`
        })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    },[])
    */

    return(
    <>
        <div className="room-detail-wrap">
            <div className="row">
                <div className="col-md-3">
                    <div className="info-area">
                        <img src={`${roomInfo.img}`} alt="User" />
                        <div className="info-header">
                            <h3>{roomInfo.name}</h3>
                            <h3 className="leader">
                                LEADER
                                <FontAwesomeIcon icon={faCrown} style={{color: "rgb(61, 105, 144)", 'margin':'0 5px'}}/>
                                {roomInfo.leader}
                            </h3>
                        </div>
                        <div className="setting">
                            <div className="mike-button" onClick={() => setIsMikeOn(!isMikeOn)}>
                                {isMikeOn ? <FontAwesomeIcon icon={faMicrophoneSlash} color={'white'} size={'1x'} /> :
                                    <FontAwesomeIcon icon={faMicrophone} color={'white'} size={'1x'} />}
                            </div>
                            <div className="video-button" onClick={() => setIsCameraOn(!isCameraOn)}>
                                {isCameraOn ? <FontAwesomeIcon icon={faVideoSlash} color={'white'} size={'1x'} /> :
                                    <FontAwesomeIcon icon={faVideo} color={'white'} size={'1x'} />}
                            </div>
                        </div>
                        <div className="ent-btn" onClick={ (e)=>{e.stopPropagation(); navigate(`./../live/${roomInfo.id}`);}}>입장하기</div>
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
                                {
                                    isChange?
                                    <>
                                        <input type="text" value={newNotice} onChange={(e)=>{changeNotice(e); }}></input>
                                        <div 
                                            className="notice-btn"
                                            onClick={(e)=>{e.stopPropagation(); setIsChange(false);}}
                                        >확인</div>
                                    </>
                                    :
                                    <span>{newNotice}</span>
                                }
                                {
                                    isOn && roomInfo.leader === user.name && !isChange ?
                                    <FontAwesomeIcon 
                                        icon={faPencil} style={{color: "#9e9e9e", margin: '0 5px'}} className="fapencil"
                                        onClick={(e)=>{e.stopPropagation(); setIsChange(true); }}
                                    />
                                    : null
                                }
                            </div>
                        </div>
                        <div className="bottom">
                            <div className="member-list">
                                <h2>스터디 멤버</h2>
                                <hr style={{margin:'0 0'}}></hr>
                                <div className="items">
                                {
                                    roomInfo.mem.map((member, i)=>(
                                        <div className="item" key={i}>
                                            <h3>{member}</h3>
                                            <FontAwesomeIcon 
                                                icon={faMessage} className="send-btn"
                                                onClick={(e)=>{ handleModal(e); }}
                                            />
                                        </div>
                                    ))
                                }
                                </div>
                            </div>
                            <div className="member-chat">
                                <h2>Chatting</h2>
                                <hr style={{margin:'0 0'}}></hr>
                                <div className="chats scroll">
                                {
                                    roomChat.map((chat,i)=>(
                                    <>
                                    {
                                        chat.sender!==user.name ? 
                                        <div className='chat-type1'>
                                            <img src="https://pwith-bucket.s3.ap-northeast-2.amazonaws.com/kkm5424.jpg?version=0.17936649555278406"/>
                                            <div className="content">
                                                <h3>{chat.sender}</h3>
                                                <div className="chat-time">
                                                    <p>{chat.content}</p>
                                                    <time>{chat.date}</time>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className='chat-type2'>
                                            <div className="chat-time">
                                                <time>{chat.date}</time>
                                                <p>{chat.content}</p>
                                            </div>
                                        </div>
                                    }
                                    </>
                                    ))
                                }
                                </div>
                                <hr style={{margin:'0 0'}}></hr>
                                <div className="sending-area">
                                    <textarea></textarea>
                                    <div className="sending-btn">전송</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                    isModalOpen === true?
                    <>
                        <div className="modal-wrap"></div>
                        <form method='POST'>
                            <div className="modal">
                                <a title="닫기" className="close" onClick={(event)=>handleModal(event)}>X</a>
                                <h3>쪽지 보내기</h3>
                                <p className="receiver">
                                    <input 
                                        type="text"
                                        onChange={e=>{changeNickname(e);}}
                                        placeholder="수신자 아이디 입력"
                                        defaultValue= {chatName} // 수정
                                    ></input>
                                </p>
                                <p>
                                    <textarea 
                                        name="message" 
                                        className="text" 
                                        placeholder="내용 입력"
                                        onChange={e=>changeContent(e)}>
                                    </textarea>
                                </p>
                                <input
                                    type="button"
                                    value="전송" 
                                    className="button"
                                ></input>
                                <div className="message">{msg}</div>
                            </div>
                        </form>
                    </>
                    :
                    null
                }
        </div>
    </>
    );
}


export default RoomDetail;