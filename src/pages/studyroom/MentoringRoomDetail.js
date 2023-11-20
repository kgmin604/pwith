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
import { faStar } from "@fortawesome/free-solid-svg-icons/faStar";
import { useWebSocket } from "../../hooks/WebsocketHooks";
import { stopPropagation } from "ace-builds/src-noconflict/ace";


function MentoringRoomDetail() {
  
  /********************* 전 범위에서 사용 *********************/
  let [reLoad, setReLoad] = useState(0);

  const chatAreaRef = useRef(null);

  let user = useSelector((state) => state.user);
  let navigate = useNavigate();

  let [roomInfo, setRoomInfo] = useState({ 
    id: 0,
    name: "",
    image: "",
    notice: "",
    mento: {
      "image": "",
      "memId": "",
      "nickname": ""
    },
    menti:{
      "image": "",
      "memId": "",
      "nickname": ""
    },
  });
  let [imgData, setImgData] = useState({});

  let [roomChat, setRoomChat] = useState([]);
  let [myChat, setMyChat] = useState("");

  let [isMikeOn, setIsMikeOn] = useState(false);
  let [isCameraOn, setIsCameraOn] = useState(false);
  let [isOn, setIsOn] = useState(false);
  let [isChange, setIsChange] = useState(false);

 /********************* 웹소켓  *********************/
  const socket = useWebSocket('mentoringReady');

  /********************* 정산 관리 *********************/
  let [paybackOpen, setPaybackOpen] = useState(false);
  let [paybackData, setPaybackData] = useState({
    'bank':'',
    'account':'',
    'refund': 0
  });
  let handlePaybackModal = (event) => {
    event.stopPropagation();
    setPaybackOpen(!paybackOpen);
  }
  function inputPaybackData(e){
    e.stopPropagation();
    let copy = {...paybackData};
    copy[e.target.id] = e.target.value;
    setPaybackData(copy);
  }
  function requestPayback(e){
    e.stopPropagation();
    if(paybackData.account==='' || paybackData.bank===''){
      alert('정보를 전부 입력해주세요.');
      return;
    }
    if(paybackData.refund <= 0){
      alert("정산받을 수업 수가 유효하지 않습니다.");
      return;
    }
    if(paybackData.refund > (numData.menti-numData.refund)){
      alert(`정산받을 수 있는 수업 수는 최대 ${(numData.menti-numData.refund)}회 입니다.`);
      return;
    }

    if (window.confirm("입력한 정보가 맞습니까?")){
      axios({
        method: "POST",
        url: `/mentoring-room/${roomInfo.id}/refund`,
        data: {
          bank: paybackData.bank,
          account: paybackData.account,
          classes: Number(paybackData.refund)
        }
      })
        .then(function (response) {
          alert("환급 요청이 완료되었습니다. 2~3일 내 해당 계좌로 수업료가 입금될 예정입니다.");
          let copy = {...paybackData};
          window.location.reload();
        })
        .catch(function (e) {
          alert('요청에 실패했습니다. 다시 시도해주세요.');
        });
    }
  }

  /********************* 추가 결제 관리 *********************/
  let [isPay, setIsPay] = useState(false);

  function PayMouseOver(event){
    event.stopPropagation();
    setIsPay(true);
  }
  function PayMouseOut(event){
    event.stopPropagation();
    setIsPay(false);
  }

  function payment(e, classes) {
    e.stopPropagation();
    axios({
      method: "POST",
      url: `/mentoring-room/${roomInfo.id}/pay`,
      // headers: {
      //   "Access-Control-Allow-Origin": "*"
      // },
      data: {
        "classes": classes // 나중에 수정
      }
    })
      .then(function (response) {
        window.location.href = response.data.data.pay_url;
      })
      .catch(function (e) {
        alert('요청에 실패했습니다. 다시 시도해주세요.');
        console.log(e);
      });
  }

  /********************* 리뷰, 모달창 관리 *********************/

  let [review, setReview] = useState(null); // 리뷰 관리
  /*
  {
    "content": null,
    "date": null,
    "id": null,
    "score": null
  }
  */

  let [open, setOpen] = useState(false);
  let [newContent,setNewContent] = useState("");
  let handleModal = (event) => {
      event.stopPropagation();
      setOpen(!open);
      setNewContent('');
      if(review===null){
        setReviewType(0);
        setReviewStar(0);
      }else{
        setReviewType(1);
        setReviewStar(review.score);
      }
  }
  let [reviewStar, setReviewStar] = useState(0);
  let [reviewType, setReviewType] = useState(0); // 0: 리뷰 작성 모드 1: 리뷰 보기 모드

  function writeReview(event){
    event.stopPropagation();
    if(reviewType === 1){
      if (window.confirm("리뷰를 재작성 하시겠습니까?")){
        setReviewType(0);
        setReviewStar(0);
      }
    }
    else{
      if(review === null){ // 처음 작성
        axios({
          method: "POST",
          url: `/mentoring-room/${roomInfo.id}`,
          data:{
            content: newContent,
		        score: reviewStar
        }})
        .then(function (response) {
          alert("후기 작성이 완료되었습니다.");
          setOpen(!open);
          setReLoad(reLoad+1); // 업데이트용
        })
        .catch(function (error) {
          alert("요청을 처리하지 못했습니다. 다시 시도해주세요.");
        });
      }
      else{ // 기존 작성 변경
        axios({
          method: "PATCH",
          url: `/mentoring-room/${roomInfo.id}/${review.id}`,
          data:{
            content: newContent,
		        score: reviewStar
        }})
        .then(function (response) {
          alert("후기 재작성이 완료되었습니다.");
          setOpen(!open);
          setReLoad(reLoad+1); // 업데이트용
        })
        .catch(function (error) {
          alert("요청을 처리하지 못했습니다. 다시 시도해주세요.");
        });
      }
    }
  }

  function deleteReview(event){
    event.stopPropagation();
    if(reviewType === 1){
      if (window.confirm("리뷰를 삭제하시겠습니까?")){
        axios({
          method: "DELETE",
          url: `/mentoring-room/${roomInfo.id}/${review.id}`,
          data:{
            content: newContent,
		        score: reviewStar
        }})
        .then(function (response) {
          alert("후기가 삭제되었습니다.");
          setOpen(!open);
          setReLoad(reLoad+1); // 업데이트용
        })
        .catch(function (error) {
          alert("요청을 처리하지 못했습니다. 다시 시도해주세요.");
        });
      }
    }
  }

  /********************* 공지 관리 *********************/

  let [newNotice, setNewNotice] = useState("");

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
      url: `/mentoring-room/${roomInfo.id}`,
      data:{
        notice: `${newNotice}`
      }
    })
      .then(function (response) {
      })
      .catch(function (error) {
      });
  }

  /********************* 수업 횟수 확인 *********************/

  let [numData, setNumData] = useState({ // 수업 횟수 체크
    total: 0,
    mento: 0,
    menti: 0,
    refund: 0
  });

  function MenteeClick(e){
    e.stopPropagation();
    if(user.name === roomInfo.mento.nickname) return; // 멘토라면 돌아가기

    let confirm_check = window.confirm("수업 완료로 상태를 변경하시겠습니까? 취소할 수 없습니다.");
    if (confirm_check) {
      axios({
        method: "GET",
        url: `/mentoring-room/${roomInfo.id}/lesson`,
        params:{
          check : "menti",
        }
      })
      .then(function (response) {
        setReLoad(reLoad+1);
        alert('수업 완료처리 되었습니다.');
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  function MentorClick(e){
    e.stopPropagation();
    if(user.name !== roomInfo.mento.nickname) return; // 멘티라면 돌아가기

    let confirm_check = window.confirm("수업 완료로 상태를 변경하시겠습니까? 취소할 수 없습니다.");
    if (confirm_check) {
      axios({
        method: "GET",
        url: `/mentoring-room/${roomInfo.id}/lesson`,
        params:{
          check : "mento",
        }
      })
      .then(function (response) {
        setReLoad(reLoad+1);
        alert('수업 완료처리 되었습니다.');
      })
      .catch(function (error) {
        console.log(error);
        alert(`${error.response.data.message}입니다.`)
      });
    }
  }

  /********************* 룸 삭제 *********************/

  function requestDeleteRoom(event){
    event.stopPropagation();
    
    if (window.confirm("정말로 삭제하시겠습니까?")){

      if(numData.total !== numData.refund){
        alert("멘토링을 완료한 후 삭제할 수 있습니다. (모든 수업을 요청하고 환급을 완료하십시오.)");
        return;
      }

      axios({
        method: "DELETE",
        url: `/mentoring-room/${roomInfo.id}`,
      })
        .then(function (response) {
          alert('삭제가 완료되었습니다.');
          navigate('/studyroom');
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    
  }

  /********************* 채팅 관리 *********************/

  function changeChatInput(event) {
    event.stopPropagation();
    setMyChat(event.target.value);
  }

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
    socket?.emit("enter",data);
  }

  function LeaveRoom(RoomId){
    // const url = window.location.href;
    // const part = url.split("/");
    // const RoomId = part[part.length - 1];
    let data = {
      roomId: Number(RoomId)
    };
    socket?.emit("leave",data);
  }

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
    if (e.key === 'Enter' && e.shiftKey) { // [shift] + [Enter] 치면 그냥 리턴
      return;
    } else if (e.key === 'Enter') { 	   // [Enter] 치면 메시지 보내기
      sendTo();
    }
  };

  useEffect(() => {
    if(!socket) return

    socket.connect();
    EnterRoom();

    socket.on("connect", (data) => {
      console.log("Socket connected");
    });
    socket.on("sendFrom", (data) => {
      setRoomChat((prevRoomChat) => [...prevRoomChat, data]);
    });
    socket.on("disconnect", (data)=>{
      console.log("Socket disconnected")
    });
  }, [socket]);

  /********************* 데이터 받아오기 *********************/

  useEffect(() => {
    const url = window.location.href;
    const part = url.split("/");
    const RoomId = part[part.length - 1];

    axios({
      method: "GET",
      url: `/mentoring-room/${RoomId}`,
    })
      .then(function (response) {
        setRoomInfo(response.data.data.room); // 룸 기본 정보
        setRoomChat(response.data.data.chat); // 채팅 정보
        setNewNotice(response.data.data.room.notice); // 공지 정보
        setNumData(response.data.data.lesson); // 남은 수업 정보
        setReview(response.data.data.review); // 리뷰 정보

        if(response.data.data.review !== null) {
          setReviewStar(response.data.data.review.score);
          setReviewType(1)
        }
        else{ // null이라면
          setReviewStar(0);
          setReviewType(0);
        }

        let tmp = {};
        tmp[response.data.data.room.mento.nickname] = response.data.data.room.mento.image;
        tmp[response.data.data.room.menti.nickname] = response.data.data.room.menti.image;
        setImgData(tmp);
      })
      .catch(function (error) {
        alert("요청이 실패했습니다. 다시 시도해주세요.");
      });

      return () => {
        // 컴포넌트가 unmount될 때 실행될 코드
        LeaveRoom(RoomId);
      };
  }, [reLoad]);

  return (
    <>
      <div className="room-detail-wrap">
        <div className="row">
          <div className="col-md-3">
            <div className="info-area">
              <div className="img-area">
                <img src={`${roomInfo.image}?${Date.now()}`} alt="User" />
              </div>
              <div className="info-header">
                <h3>{"멘토링"}</h3>
                <h3
                  className="leader"
                >
                  Mentor
                  <FontAwesomeIcon
                    icon={faCrown}
                    style={{ color: "rgb(61, 105, 144)", margin: "0 5px" }}
                  />
                  {roomInfo.mento.nickname}
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
                  navigate(`./../live/${roomInfo.id}`);
                }}
              >
                입장하기
              </div>
              {
              user.name === roomInfo.mento.nickname ?
              (
                <span
                  className="room-delete-btn"
                  onClick={e=>requestDeleteRoom(e)} // API 연결
                >
                  멘토링 삭제하기
                </span>
              )
               : 
               null
              }
            </div>
          </div>
          <div className="col-md-9">
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
                  {isOn && roomInfo.mento.nickname === user.name && !isChange ? (
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
                <div className="number-list">
                  <h2 className="no-drag">수업 횟수 체크 <span className="num-summary">{`(${numData.menti}회/${numData.total}회)`}</span> </h2>
                  <hr style={{ margin: "0 0" }}></hr>
                  
                  <div className="number-sign no-drag">박스를 클릭해 수업 횟수를 체크해주세요!</div>
                  <div className="sign-items">
                    <div className="sign-item">
                      <div className="number-item both-selected"></div>
                      <span className="no-drag">완료 수업</span>
                    </div>
                    <div className="sign-item">
                      <div className="number-item mentor-selected"></div>
                      <span className="no-drag">멘티 확인 필요</span>
                    </div>
                    <div className="sign-item">
                      <div className="number-item non-selected"></div>
                      <span className="no-drag">남은 수업</span>
                    </div>
                  </div>
                  <hr style={{ margin: "0 0" }}></hr>

                  <div className="number-items">
                  {
                    Array.from({ length: numData.total }, (_, index) => {
                      if (index < numData.menti) { // 둘 다 선택
                        return (
                          <div 
                            key={index} 
                            className={`number-item both-selected`}
                          ></div>
                        );
                      } else if (index < numData.mento) { // 멘토만 선택
                        if(numData.menti === index){
                          return (
                            <div 
                              key={index} 
                              className={`number-item mentor-selected ${user.name!==roomInfo.mento.nickname? "can-click" : ""}`}
                              onClick={e=>{MenteeClick(e)}}
                            ></div>
                          );
                        }
                        else{
                          return (
                            <div 
                              key={index} 
                              className={`number-item mentor-selected`}
                            ></div>
                        );
                        }
                      } else {
                        if(numData.mento === index){
                          return (
                            <div 
                              key={index} 
                              className={`number-item non-selected ${user.name===roomInfo.mento.nickname? "can-click" : ""}`}
                              onClick={e=>{MentorClick(e)}}
                            ></div>
                          );
                        }
                        else{
                          return (
                            <div 
                              key={index} 
                              className={`number-item non-selected`}
                            ></div>
                          );
                        }
                      }
                    })
                  }
                  </div>
                  <div className="review-btn-container">
                  {
                    roomInfo.id === 0 ? null :
                    roomInfo.mento.nickname === user.name ? 
                    <div className="review-btn no-drag" onClick={(e)=>handlePaybackModal(e)}>
                      정산 요청하기
                    </div>
                    :
                    <>
                      <div className="review-btn no-drag" onClick={(e)=>{ handleModal(e);}}>
                        {`${review === null? "리뷰 작성하기" : "작성한 리뷰 보기"}`}
                      </div>
                      <div 
                        className="review-btn no-drag" 
                        onMouseOver={PayMouseOver}
                        onMouseOut={PayMouseOut}
                      >
                        추가 결제하기
                      {
                        isPay ? 
                        <div className="pay-nums">
                          <div className="pay-num" onClick={e=>payment(e,1)}>1회</div>
                          <div className="pay-num" onClick={e=>payment(e,2)}>2회</div>
                          <div className="pay-num" onClick={e=>payment(e,4)}>4회</div>
                        </div> : null
                      }
                      </div>
                    </>
                  } 
                  </div>
                </div>
                {
                    open === true ?
                        <>
                            <div className="modal-wrap"></div>
                            {

                            }
                            <form method='POST'>
                              <div className="modal">
                                <a title="닫기" className="close" onClick={(e)=>handleModal(e)}>X</a>
                                <h3>{`${reviewType === 0 ? "리뷰 작성하기" : "작성한 리뷰"}`}</h3>
                                <div className="star-items">
                                {[1,2,3,4,5].map((a, idx) => {
                                  if(a <= reviewStar){
                                    return (
                                      <div key={idx}>
                                        <FontAwesomeIcon 
                                          icon={faStar} 
                                          style={{color: "#fcc419",}}
                                          onClick={(e) => { e.stopPropagation(); if(reviewType===0) setReviewStar(a); }}
                                        />
                                      </div>
                                    );
                                    }else{
                                      return (
                                        <div key={idx}>
                                          <FontAwesomeIcon 
                                            icon={faStar} 
                                            style={{color: "#b5b5b5",}}
                                            onClick={(e) => {e.stopPropagation(); if(reviewType===0) setReviewStar(a); }}
                                          />
                                        </div>
                                      );}})}
                                    <span>{`(${reviewStar}점)`}</span>
                                  </div>
                                    <p>
                                    {
                                    reviewType === 0 ?
                                      <form><textarea
                                        name="message"
                                        className="text"
                                        placeholder="내용 입력"
                                        onChange={e => {e.stopPropagation(); setNewContent(e.target.value); }}>
                                      </textarea></form>
                                      :
                                      <div className="review-text">
                                        {review.content}
                                      </div>
                                    }
                                    </p>
                                    <input
                                        type="button"
                                        value={`${reviewType === 0 ? "등록하기":"다시쓰기"}`}
                                        className="button"
                                        onClick={e => {
                                          writeReview(e);
                                        }}
                                    ></input>
                                    {
                                    reviewType === 1 ? 
                                    <div 
                                      className="review-delete-btn"
                                      onClick={e=>deleteReview(e)}
                                    >리뷰 삭제하기</div> 
                                    : null
                                    }
                                </div>
                            </form>
                        </>
                        :
                        null
                }

                {
                  paybackOpen === true ? /* 정산 요청 모달 */
                  <>
                    <div className="modal-wrap"></div>
                    <form method='POST'>
                    <div className="modal" style={{'height':'280px'}}>
                      <a title="닫기" className="close" onClick={(e)=>handlePaybackModal(e)}>X</a>
                      <h3>정산 요청하기</h3>
                      <p className="payback-items">
                        <div className="payback-item">
                          <h4>은행</h4>
                          <input id="bank" onChange={e=>inputPaybackData(e)}></input>
                        </div>
                        <div className="payback-item">
                          <h4>계좌번호</h4>
                          <input id="account" onChange={e=>inputPaybackData(e)}></input>
                        </div>
                        <div className="payback-item">
                          <h4>정산받을 수업</h4>
                          <input 
                            id="refund" 
                            onChange={e=>inputPaybackData(e)}
                            type="number"
                            style={{'width':'50px'}}
                          ></input>
                          <span>회 / {(numData.menti - numData.refund)}회</span>
                        </div>
                      </p>
                      <input
                        type="button"
                        value="정산요청"
                        className="button"
                        onClick={ e=>requestPayback(e) }
                      ></input>
                    </div>
                    </form>
                  </>
                  : null
                }

                <div className="member-chat">
                  <h2 className="no-drag">Chatting</h2>
                  <hr style={{ margin: "0 0" }}></hr>
                  <div 
                    className="chats scroll"
                    ref={chatAreaRef}
                >
                    {roomChat.map((chat, i) => (
                      <>
                        {chat.sender !== user.name ? (
                          <div className="chat-type1">
                            <img src={imgData[`${chat.sender}`] === null ? `default_user` : imgData[`${chat.sender}`]} 
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
      </div>
    </>
  );
}

export default MentoringRoomDetail;