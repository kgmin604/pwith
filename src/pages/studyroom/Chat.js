import React from "react";
import './liveroom.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useState,useRef, useCallback ,useEffect} from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";


function Chat({ socketRef,roomId,roomChat,setRoomChat, setShowChat, isClicked, handleDivClick }) {
    const textRef = useRef();
    // const socketRef = useRef(null);

    const chatAreaRef = useRef(null);
    const [myChat, setMyChat] = useState("");
    let user = useSelector((state) => state.user);
    const handleResizeHeight = useCallback(() => {
        textRef.current.style.height = textRef.current.scrollHeight + "px";
    }, []);

    // 소켓 통신 함수

    function sendTo() {
        let data = {
            roomId: Number(roomId),
            message: myChat,
            sender: user.name,
        };
        socketRef.current?.emit("send", data);
        document.getElementById("chat-area").value = "";
        setMyChat("");
    }

    // 스크롤 영역을 항상 아래로 스크롤하는 함수
    const scrollToBottom = () => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    };

    // 컴포넌트가 업데이트 될 때마다 스크롤을 아래로 이동
    useEffect(() => {
        console.log(roomChat)
    }, [roomChat]);

    function changeChatInput(event) {
        event.stopPropagation();
        setMyChat(event.target.value);
      }

    const pressEnter = (e) => {
        e.stopPropagation();
        if (e.key === 'Enter' && e.shiftKey) { // [shift] + [Enter] 치면 걍 리턴
            return;
        } else if (e.key === 'Enter') { 	   // [Enter] 치면 메시지 보내기
            sendTo();
        }
    };

    return <div className="right-space">
        <div>
            <div className="header">채팅<FontAwesomeIcon icon={faXmark} onClick={() => { setShowChat(false); }} /></div>
            <div className="chat" ref={chatAreaRef}>
                {roomChat.map((chat, i) => {
                    return <><div className="chat-user">
                        <div className="chat-name">{chat.sender}</div>
                        <div className="chat-time">{chat.date}</div>
                    </div>
                        <div className="chat-content">{chat.content}</div></>
                })}

            </div>
        </div>
        <form className={`chat-input ${isClicked ? 'clicked' : ''}`} onClick={handleDivClick}>
            <textarea id="chat-area" ref={textRef} onInput={handleResizeHeight} onChange={(e) => changeChatInput(e)} onKeyDown={pressEnter}/>
            <div className="iconWrapper"
                onClick={(e) => {
                    e.stopPropagation();
                    sendTo();
                }} >
                <FontAwesomeIcon icon={faPaperPlane} color={'white'} />
            </div>
        </form>
    </div>;
}

export default Chat;