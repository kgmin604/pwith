import React from 'react';
import axios from "axios";

import "./member.css";
import { useSelector } from "react-redux"
import { Button } from "react-bootstrap";
import { useState } from "react";
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
                    <Button variant="secondary" size="sm" onClick={()=>navigate('./change')}>비밀번호 변경 </Button>
                </div>
                <div className="acc-box"> <div className="acc-header">이름</div>{user.name}</div>
                <div className="acc-box"> <div className="acc-header">이메일</div> test@naver.com {user.email}
                    <Button variant="secondary" size="sm" onClick={()=>navigate('./email')}> 이메일 인증 </Button>
                </div>
            </div>
        </>
    );
}

function WritingList(){
    let [sel, setSel] = useState(1);

    return(
        <>
            <div style={{'padding':'0 0', 'margin':'0 0'}}>
                <h3 className="my-header">내가 쓴 글 목록</h3>
                <div className="chat-select">
                    <ul style={{'padding':'0 0'}}>
                        <li className={sel===1? "chat-btn-click" : "chat-btn"} onClick={()=>setSel(1)}>스터디</li>
                        <li className={sel===2? "chat-btn-click" : "chat-btn"} onClick={()=>setSel(2)}>커뮤니티</li>
                    </ul>
                </div>
                <div className="chat-bottom">
                </div>
            </div>
        </>
    );
}

function Chat(){
    let tmpData = {
        'id' : 'kgminee',
        'date' : '05/31 9:13',
        'content' : '개발중입니다.'
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

    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (event, index) => {
        event.stopPropagation(); // 이벤트 버블링 중단
        setSelectedItem(index);
      };

    return(
        <>
            <div style={{'padding':'0 0', 'margin':'0 0'}}>
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
                    <div className="chat-box scroll-area"> {/* 오른쪽 구역: 채팅 내용 */}
                        <div className="title">
                            <h2>{chatList['id']}</h2>
                        </div>
                        {
                            selectedItem === null ? <></> :
                            <div className="content">
                            {
                                Array.from({ length: 10 }, (_, i) => {
                                    const type = tmpMsg2['type'] === 1 ? "받은 쪽지" : "보낸 쪽지";
                                    return (
                                    <div className="item" key={i}>
                                        <time>{tmpMsg2['time']}</time>
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
            </div>
        </>
    );
}

function PwChange(){
    let navigate = useNavigate();
    let user = useSelector((state) => state.user);

    let [userinput, setUserinput] = useState({
        'curPw': '',
        'newPw': '',
        'newPwChk': ''
    });
    let [is,setIs] = useState({
        'curPw': true, // ***********************************************수정해야함
        'newPw': false,
        'newPwChk': false
    });
    let [msg,setMsg] = useState({
        'curPw': '',
        'newPw': '',
        'newPwChk': ''
    })
    
    function checkPw(){ // ***********************************************수정해야함
        let copyIs = {...is};
        copyIs['joinPw'] = false;
        setIs(copyIs);
    }

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
        axios({
            method: "POST",
            url: "/account/changepw",
            data: {
              //memId: `${user.id}`,
              oldPw: `${userinput['curPw']}`,
              newPw: `${userinput['newPw']}`,
            },
          })
            .then(function (response) {
              console.log(response);
              alert('비밀번호가 변경되었습니다.');
              navigate("/");
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
        //checkPw();
        if(!is['curPw']){
            copyMsg['curPw']='현재 비밀번호가 일치하지 않습니다.';
            setMsg(copyMsg);
        }
        else if(!is['newPw']){
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

    let [modify, setModify] = useState(false);
    let [email, setEmail] = useState('test@gmail.com');

    function emailChange(){ // **************************** axios 요청 추가

    }

    function emailChangeRequest(){
        const emailRE = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if(emailRE.test(email)){
            emailChange();
            setModify(false);
        }
        else{
            alert('잘못된 이메일 형식입니다.');
        }
    }

    return(
        <>
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
        </>
    );
}

export  {Account, WritingList, Chat, PwChange, Email }