import React from 'react';
import axios from "axios";

import "./member.css";
import "./modal.css";
import { useSelector } from "react-redux"
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ToggleButton from 'react-bootstrap/ToggleButton';

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
    let [sel, setSel] = useState(0); // 0: 스터디 글 목록 1: 커뮤니티 글 목록
    let [mypost, setMypost] = useState([]);

    function loadWritingList(){
        axios({
          method: "GET",
          url: "/mypage/writinglist",
          data: {
             type : 0
          },
        })
        .then(function (response) {
            setMypost(response.data.myPost);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    function getWritingList(type){
        axios({
          method: "POST",
          url: "/mypage/writinglist",
          data: {
             type : `${type}`
          },
        })
        .then(function (response) {
            setMypost(response.data.myPost);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    useEffect(() => {
        loadWritingList();
    }, []); 

    return(
        <>
            <div style={{'padding':'0 0', 'margin':'0 0'}} >
                <h3 className="my-header">내가 쓴 글 목록</h3>
                <div className="chat-select">
                <ul style={{ padding: '0 0' }}>
                    <li 
                        className={sel === 0 ? "chat-btn-click" : "chat-btn"} 
                        onClick={(event) => { event.stopPropagation(); setSel(0); getWritingList(0); }}
                    >스터디</li>
                    <li 
                        className={sel === 1 ? "chat-btn-click" : "chat-btn"} 
                        onClick={(event) => { event.stopPropagation(); setSel(1); getWritingList(1);}}
                    >커뮤니티</li>
                </ul>
                </div>
                <div className="chat-bottom">
                {
                    mypost === [] ? null : 
                    mypost.map((post, index) => (
                        <div className="item" key={index}>
                            <h3>{post[2]}</h3> {/* 인덱스 대신 문자열로 변경 필요 */}
                            <p>{post[4]}</p>    {/* 인덱스 대신 문자열로 변경 필요 */}
                        </div>
                    ))
                }
                </div>
            </div>
        </>
    );
}

function Chat(){
    let tmpData = {
        'id' : 'kgminee',
        'date' : '05/31 9:13',
        'content' : '개발중입니다.다암런아러미ㅏㄴㅇ멀;ㅣ나ㅓㅇ리마넝리ㅏㅁ넝;리ㅓㅁㄴ이라ㅓㅑㅓㅈ디ㅏㄴㅇ러ㅣㅏㅓㄹㅇ니ㅏㅓ'
    };
    let [chatList, setChatList] = useState(tmpData);

    let tmpMsg = {
        'type' : 1,
        'date' : '05/31 9:13',
        'content' : '개발중입니다.'
    };
    let tmpMsg2 = {
        'type' : 2,
        'date' : '05/31 9:14',
        'content' : '노는중입니다.노는중입니다.노는중입니다.노는중입니다.노는중입니다.노는중입니다.노는중입니다.노는중입니다.노는중입니다.노는중입니다.노는중입니다.노는중입니다.노는중입니다.노는중입니다.노는중입니다.노는중입니다.노는중입니다.'
    };

    let [selectedItem, setSelectedItem] = useState(null);
    let handleItemClick = (event, index) => {
        event.stopPropagation(); // 이벤트 버블링 중단
        setSelectedItem(index);
    };
    
    let [open, setOpen] = useState(false);
    let handleModal = (event) => {
        event.stopPropagation();
        setOpen(!open);
    }
    return(
        <>
            <div className ="mypage-chat" style={{'padding':'0 0', 'margin':'0 0'}}>
                <h3 className="my-header">쪽지함</h3>
                <div className="chat-bottom">
                    <div className="chat-boxes scroll-area"> {/* 왼쪽구역: 채팅한 계정들*/}
                        {
                            // 테스트 코드
                            Array.from({ length: 10 }, (_, i) => (
                            <a 
                                className={`item ${selectedItem === i ? 'selected' : ''}`}
                                key={i}
                                onClick={(event) => handleItemClick(event, i)}
                            >
                                <time>{chatList['date']}</time>
                                <h3>{chatList['id']}</h3>
                                <p>{chatList['content']}</p>
                            </a>
                            ))
                        }
                    </div>
                    <div className="chat-box scroll-area scroll-area-hidden"> {/* 오른쪽 구역: 채팅 내용 */}
                        <div className="title">
                        {
                            selectedItem === null ? <></> :
                            <>
                                <h2>{chatList['id']}</h2>
                                <a className="send" title ="쪽지 보내기" onClick={ (event) => handleModal(event) }>💌</a>
                            </>
                        }
                        </div>
                        {
                            selectedItem === null ? <></> :
                            <div className="content">
                            {
                                Array.from({ length: 10 }, (_, i) => {
                                    const type = tmpMsg2['type'] === 1 ? "받은 쪽지" : "보낸 쪽지";
                                    return (
                                    <div className="item" key={i}>
                                        <time>{tmpMsg2['date']}</time>
                                        <p className="type">{type}</p>
                                        <p className="text">{tmpMsg2['content']}</p>
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
                        <div className="modal">
                            <a title="닫기" className="close" onClick={(event)=>handleModal(event)}>X</a>
                            <h3>쪽지 보내기</h3>
                            <p>
                                <textarea name="message" class="text" placeholder="내용 입력"></textarea>
                            </p>
                            <input type="submit" value="전송" class="button"></input>
                        </div>
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