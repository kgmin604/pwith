import React from 'react';
import axios from "axios";

import "./member.css";
import "./writinglist.css";
import "../../assets/modal.css";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ToggleButton from 'react-bootstrap/ToggleButton';
import { loginUser, clearUser } from '../../store.js'

function Account(){
    let user = useSelector((state) => state.user);
    let navigate = useNavigate();
    
    return(
        <>
            <h3 className="my-header">회원정보 관리</h3>
            <div className="acc-wrap">
                <div className="acc-box"> <div className="acc-header">아이디</div>{user.id}</div>
                <div className="acc-box"> <div className="acc-header">비밀번호</div>
                    <Button variant="secondary" size="sm" onClick={()=>navigate('./changepw')}>비밀번호 변경 </Button>
                </div>
                <div className="acc-box"> <div className="acc-header">이름</div>{user.name}</div>
                <div className="acc-box"> <div className="acc-header">이메일</div> {user.email}
                    <Button variant="secondary" size="sm" onClick={()=>navigate('./email')} style={{'margin' : '0 10px'}}> 
                        이메일 인증 
                    </Button>
                </div>
            </div>
        </>
    );
}

function WritingList(){
    let navigate = useNavigate();
    let [sel, setSel] = useState(0); // 0: 스터디 글 목록 1: 커뮤니티 글 목록
    let [mypost, setMypost] = useState([]);
    const parse = require('html-react-parser');//html 파싱


    function loadWritingList(){
        axios({
          method: "GET",
          url: "/mypage/writinglist",
          params: {
            type: "study"
          }
        })
        .then(function (response) {
            setMypost(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    function getWritingList(type){
        let type_text = (type === 0 ? 'study' : 'community');
        axios({
            method: "GET",
            url: "/mypage/writinglist",
            params: {
              type: `${type_text}`
            }
        })
        .then(function (response) {
            setMypost(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    useEffect(() => {
        loadWritingList();
    }, []); 

    function movePage(event, id){
        event.stopPropagation();
        if(sel===0){ // 스터디 글
            navigate(`/study/${id}`);
        }
        else if(sel===1){ // 커뮤니티 글
            navigate(`/community/qna/${id}`);
        }
    }

    return(
        <>
            <div className="writinglist">
                <h3 className="my-header">내가 쓴 글 목록</h3>
                <div className="type-select">
                <ul style={{ padding: '0 0' }}>
                    <li 
                        className={sel === 0 ? "type-btn-click" : "type-btn"} 
                        onClick={(event) => { event.stopPropagation(); setSel(0); getWritingList(0); }}
                    >스터디</li>
                    <li 
                        className={sel === 1 ? "type-btn-click" : "type-btn"} 
                        onClick={(event) => { event.stopPropagation(); setSel(1); getWritingList(1);}}
                    >커뮤니티</li>
                </ul>
                </div>
                <div className="writinglist-bottom scroll-area">
                {
                    mypost === [] ? null : 
                    mypost.map((post, index) => {
                    return (
                        <div 
                            className="item" 
                            key={index}
                            onClick = { e => movePage(e, post.id) }
                        >
                            <time>{post.curDate}</time>
                            <h3 className="header">{post.title}</h3>
                            <p className="content">{parse(post.content)}</p>
                        </div>
                    );})
                }
                </div>
            </div>
        </>
    );
}

function Chat(){
    let user = useSelector((state) => state.user);

    let [chatList, setChatList] = useState([]);
    let [msgList, setMsgList] = useState([]);

    let [selectedItem, setSelectedItem] = useState(null);
    let handleItemClick = (event, index) => { // 특정 userid 선택
        event.stopPropagation(); // 이벤트 버블링 중단
        setSelectedItem(index);
        /*
        axios({
            method: "POST",
            url: "/mypage/chat",
            data: {
                type: 0,
                memId : `${user.id}`,
                oppID : `${chatList[selectedItem]['oppId']}`,
            },
          })
          .then(function (response) {
              setMsgList(response.data.msgList); // msgList는 딕셔너리 리스트
          })
          .catch(function (error) {
              console.log(error);
          });
        */
    };

    let [content, setContent] = useState('');
    let changeContent = (event) =>{
        event.stopPropagation();
        setContent(event.target.value);
    }

    let [oppId, setOppId] = useState('');
    let changeOppId = (event) =>{
        event.stopPropagation();
        setOppId(event.target.value);
    }

    let [msg,setMsg] = useState('');

    /* 모달창 관리 */
    let [open, setOpen] = useState(false);
    let handleModal = (event) => {
        event.stopPropagation();
        setOpen(!open);
        setMsg('');
        setContent('');
    }

    useEffect(() => { // 맨 처음 한번만 실행
        axios({
            method: "GET",
            url: "/mypage/chat"
          })
          .then(function (response) {
              setChatList(response.data); // chatList는 딕셔너리 리스트
          })
          .catch(function (error) {
              console.log(error);
          });
      }, []);


    function sendRequest(){
        console.log("전송요청");
        axios({
            method: "POST",
            url: "/mypage/chat",
            data: {
                type: 1,
                oppId : `${oppId}`,
                content : `${content}`
            },
          })
          .then(function (response) {
                alert("쪽지 전송 완료");
                setOpen(!open);
                setMsg('');
                setContent('');
          })
          .catch(function (error) {
                console.log(error);
        });
    }

    function checkOppId(callback) {
        axios({
          method: "POST",
          url: "/mypage/chat",
          data: {
            type: 2,
            oppId: `${oppId}`
          },
        })
          .then(function (response) {
            console.log("쪽지 수신자 아이디 확인");
            console.log(response.data.result);
            if (response.data.result === 1) {
              callback(true);
            } else {
              callback(false);
            }
          })
          .catch(function (error) {
            console.log("쪽지 수신자 아이디 확인 에러");
            console.log(error);
            callback(false);
          });
    }
      
      function checkRequest(event) {
        event.stopPropagation();
        if (oppId === "") {
          setMsg("! 수신자 아이디를 입력해주세요.");
          return;
        } else if (content === "") {
          setMsg("! 내용을 입력해주세요.");
          return;
        } else {
          checkOppId(function (isValid) {
            if (isValid) {
              setMsg("");
              sendRequest();
            } else {
              setMsg("! 없는 수신자 아이디입니다.");
            }
          });
        }
      }

    return(
        <>
            <div className ="mypage-chat" style={{'padding':'0 0', 'margin':'0 0'}}>
                <h3 className="my-header">쪽지함</h3>
                <a className="send" title ="쪽지 보내기" onClick={ (event) => {handleModal(event); setOppId('');} }>💌</a>
                <div className="chat-bottom">
                    <div className="chat-boxes scroll-area"> {/* 왼쪽구역: 채팅한 계정들*/}
                    {
                        chatList.length === 0 ?
                        <div className='signMsg'>쪽지함이<br></br>비어있습니다.</div>
                        :
                        chatList.map((item, i) => (
                            <a
                                className={`item ${selectedItem === i ? 'selected' : ''}`}
                                key={i}
                                onClick={(event) => handleItemClick(event, i)}
                            >
                                <time>{item.date}</time>
                                <h3>{item.oppId}</h3>
                                <p>{item.content}</p>
                            </a>
                        ))
                    }
                    </div>
                    <div className="chat-box scroll-area scroll-area-hidden"> {/* 오른쪽 구역: 채팅 내용 */}
                        <div className="title">
                        {
                            selectedItem === null ? <></> :
                            <>
                                <h2>{chatList[selectedItem]['oppId']}</h2>
                                <a 
                                    className="send" 
                                    title ="쪽지 보내기" 
                                    onClick={ (event) => {handleModal(event); setOppId(chatList[selectedItem]['oppId']);} }
                                > 💌
                                </a>
                            </>
                        }
                        </div>
                        {
                            selectedItem === null ? null :
                            <div className="content">
                            {
                                msgList === [] ? null :
                                msgList.map((msg,i)=>{
                                    const type = msg['sender'] === user.id ? "보낸 쪽지" : "받은 쪽지";
                                    return(
                                    <div className="item" key={i}>
                                        <time>{msg.date}</time>
                                        <p className="type">{type}</p>
                                        <p className="text">{msg.content}</p>
                                    </div>  
                                    );
                                })
                            }
                            </div>
                        }
                    </div>
                </div>
                {
                    open === true?
                    <>
                        <div className="modal-wrap"></div>
                        <form method='POST'>
                            <div className="modal">
                                <a title="닫기" className="close" onClick={(event)=>handleModal(event)}>X</a>
                                <h3>쪽지 보내기</h3>
                                <p className="receiver">
                                    <input 
                                        type="text"
                                        onChange={e=>{changeOppId(e);}}
                                        placeholder="수신자 아이디 입력"
                                        defaultValue= {oppId}
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
                                    onClick={e=>checkRequest(e)}
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

function PwChange(){ // 컴포넌트
    let navigate = useNavigate();

    let [userinput, setUserinput] = useState({
        'curPw': '',
        'newPw': '',
        'newPwChk': ''
    });
    let [is,setIs] = useState({
        'newPw': false,
        'newPwChk': false
    });
    let [msg,setMsg] = useState({
        'curPw': '',
        'newPw': '',
        'newPwChk': ''
    })

    function inputChange(e){
        let copyUserinput = {...userinput};
        copyUserinput[e.target.id] = e.target.value;
        setUserinput(copyUserinput);

        let copyIs = {...is};

        if(e.target.id === 'newPw'){
      
            const pwRE = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/; 
            // 하나 이상의 문자, 하나 이상의 숫자, 하나 이상의 특수문자, 8글자 이상
            if(!pwRE.test(copyUserinput['newPw'])){
              copyIs['newPw'] = false;
              setIs(copyIs);
            }
            else{
              copyIs['newPw'] = true;
              setIs(copyIs);
            }
          }
      
        if(e.target.id === 'newPwChk'){
            if(copyUserinput['newPw']===copyUserinput['newPwChk']){
              copyIs['newPwChk'] = true;
              setIs(copyIs);
            }
            else{
              copyIs['newPwChk'] = false;
              setIs(copyIs);
            }
          }
    }

    function changePassword() { // axios 요청
        let copyMsg ={
            'curPw': '',
            'newPw': '',
            'newPwChk': ''
        }
        axios({
            method: "POST",
            url: "/mypage/account/changepw",
            data: {
              oldPw: `${userinput['curPw']}`,
              newPw: `${userinput['newPw']}`,
            },
          })
            .then(function (response) {
                if(response.data.result===1){ // 성공
                    console.log(response);
                    alert('비밀번호가 변경되었습니다.');
                    navigate("/");
                }
                else if(response.data.result===0){ // 실패
                    copyMsg['curPw']='비밀번호를 잘못 입력했습니다.';
                    setMsg(copyMsg);
                }
            })
            .catch(function (error) {
              console.log(error);
            });
    }

    function clickBtn(){
        let copyMsg ={
            'curPw': '',
            'newPw': '',
            'newPwChk': ''
        }
        if(!is['newPw']){
            copyMsg['newPw']='조건에 맞는 비밀번호를 입력해주세요.';
            setMsg(copyMsg);
        }
        else if(!is['newPwChk']){
            copyMsg['newPwChk']='새 비밀번호와 일치하지 않습니다.';
            setMsg(copyMsg);
        }
        else{
            changePassword();
        }
    }

    return(
        <>
           <h3 className="my-header">비밀번호 변경</h3>
            <div className="acc-wrap" style={{'height':'195px'}}>
            <form method="POST">
                <div className="acc-box" style={{'width':'100%'}}> 
                    <div className="acc-header" style={{'width':'200px'}}>현재 비밀번호</div>
                    <div className="pwc-box-wrap">
                        <input type="password" className="pwc-box" id="curPw" onChange={e=>inputChange(e)}/>
                    </div>
                    <div className="err-msg">{msg['curPw']}</div>
                </div>
                <div className="acc-box" style={{'width':'100%'}}> 
                    <div className="acc-header" style={{'width':'200px'}}>새 비밀번호</div>
                    <div className="pwc-box-wrap">
                        <input type="password" className="pwc-box" id="newPw" onChange={e=>inputChange(e)}/>
                    </div>
                    <div className="err-msg">{msg['newPw']}</div>
                </div>
                <div className="acc-box" style={{'width':'100%'}}> 
                    <div className="acc-header" style={{'width':'200px'}}>새 비밀번호 확인</div>
                    <div className="pwc-box-wrap">
                        <input type="password" className="pwc-box" id="newPwChk" onChange={e=>inputChange(e)}/>
                    </div>
                    <div className="err-msg">{msg['newPwChk']}</div>
                </div>
            </form>
            </div>

            <div style={{'width':'100%'}}>
                <Button variant="light" className="pwBtn" onClick={clickBtn}>확인</Button>
            </div>
        </>
    )
}

function Email(){

    let user = useSelector((state) => state.user);
    let dispatch = useDispatch();

    let [modify, setModify] = useState(false);
    let [email, setEmail] = useState(user.email);

    function emailChange(){ // **************************** axios 요청 추가
        axios({
            method: "POST",
            url: "/mypage/account/email",
            data: {
              newEmail: `${email}`
            },
        })
        .then(function (response) {
            if(response.data.done===1){ // 성공
                console.log(response.data);
                dispatch(
                    loginUser({
                      id: user.id,
                      name: user.name,
                      email: email
                    })
                );
                alert('이메일 변경 완료');
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    function emailChangeRequest(){
        const emailRE = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if(emailRE.test(email)){
            setModify(false);
            emailChange();
        }
        else{
            alert('잘못된 이메일 형식입니다.');
        }
    }

    return(
        <>
        <form method="POST">
            <h3 className="my-header">이메일 인증</h3>
            <div className="acc-wrap" style={{'height':'80px'}}>
                <div className="acc-box" style={{'width':'100%'}}> 
                    <div className="acc-header" style={{'width':'200px'}}>이메일</div>
                    { modify === true?
                    <>
                        <div className="pwc-box-wrap">
                            <input type="text" className="pwc-box" defaultValue={email} onChange={ e=>setEmail(e.target.value) }/>
                        </div>
                        <Button variant="secondary" size="sm" onClick={ emailChangeRequest }> 완료 </Button>
                    </> : <>
                        <div className="pwc-box-wrap">{email}</div>
                        <Button variant="secondary" size="sm" onClick={ ()=>setModify(true)}> 변경 </Button>
                    </>
                    }
                </div>
            </div>
            <div style={{'width':'100%'}}>
                <Button variant="light" onClick={ null } className="pwBtn">인증</Button>
            </div>
        </form>
        </>
    );
}

export  {Account, WritingList, Chat, PwChange, Email }