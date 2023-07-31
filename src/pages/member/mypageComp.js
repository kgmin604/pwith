import React from 'react';
import axios from "axios";

import "./member.css";
import "./writinglist.css";
import "../../assets/modal.css";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ToggleButton from 'react-bootstrap/ToggleButton';
import { loginUser, clearUser } from '../../store.js'
import Cropper from "react-cropper";
import 'cropperjs/dist/cropper.css';

function Account(){
    let navigate = useNavigate();

    /* 개인정보 */
    let [user, setUser] = useState({
        'name': '',
        'id':'',
        'email':'',
        'image':''
    })

    /* 이미지 업로드 */
    const cropperRef = useRef(null); // react-cropper 컴포넌트를 참조
    const [inputImage, setInputImage] = useState(null); // 유저가 첨부한 이미지

    let [isCrop, setIsCrop] = useState(false);

    const onCrop = () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        if (cropper) {
          let copy = { ...user };
          copy['image'] = '/change.png'; // 변경 상태 알림용
          setUser(copy);
          setIsCrop(false);
      
          // 이미지를 Blob으로 변환
          cropper.getCroppedCanvas().toBlob((blob) => {
            // Blob을 FormData로 감싸기
            const formData = new FormData();
            formData.append('newImage', blob, `${user.id}.jpg`);
      
            // 서버로 업로드하기 위한 API 요청
            axios({
              method: "PATCH",
              url: "/mypage/account/image",
              data: formData, // FormData 전달
            })
            .then(function (response) {
              let copy = { ...user };
              copy['image'] = cropper.getCroppedCanvas().toDataURL(); // response의 결과로 바꾸기
              setUser(copy);
            })
            .catch(function (error) {
              console.log(error);
            });
          }, 'image/jpeg'); // S3에 객체 유형 설정
        }
      };

    useEffect(()=>{
        axios({
            method: "GET",
            url: "/mypage/account"
        })
        .then(function (response) {
            let copy={...user};
            copy['name']=response.data.data.nickname;
            copy['id']=response.data.data.id;
            copy['email']=response.data.data.email;
            copy['image']=response.data.data.image;
            setUser(copy);
        })
        .catch(function (error) {
            console.log(error);
        });
    },[])

    return(
        <>
            <h3 className="my-header">회원정보 관리</h3>
            <div className="acc-wrap">
                <div className="img-area">
                <img src={user.image}/>
                    <form>
                        <label 
                            htmlFor="imageUpload" 
                            className='img-btn'
                        >
                            이미지 업로드
                        </label>
                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                e.stopPropagation(); 
                                setInputImage(URL.createObjectURL(e.target.files[0]));
                                setIsCrop(true);
                            }}
                            style={{'display':'none'}}
                        />
                    </form>
                </div>
                {
                    !isCrop ? null :
                    <>
                    <div className="cropper-wrap"></div>
                        <div className="cropper-area">
                            <h3>프로필 이미지 업로드 
                                <span>(150x150 권장)</span>
                                <div className="x-btn" onClick={(e)=>{e.stopPropagation(); setIsCrop(false);}}>X</div>
                            </h3>
                            
                            <Cropper
                                ref={cropperRef}
                                style={{ height: 400, width: "100%"}}
                                zoomTo={0.5}
                                initialAspectRatio={1}
                                preview=".img-preview"
                                src={inputImage}
                                viewMode={1}
                                minCropBoxHeight={10}
                                minCropBoxWidth={10}
                                background={false}
                                responsive={true}
                                autoCropArea={1}
                                checkOrientation={false}
                                guides={true}
                                aspectRatio={1} // 비율 1:1
                            />
                            <div className="btn-area">
                                <button
                                    onClick={e=>{e.stopPropagation(); onCrop();}}
                                    className="crop-btn"
                                >적용하기</button>
                            </div>
                        </div>
                    </>
                }
                
                <div className="info-area">
                    <div className="acc-box">
                        <h5>닉네임</h5>
                        <div>{user.name}
                            <em 
                                className="text-btn" 
                                style={{'marginLeft':'15px'}}
                                onClick={(e)=>{e.stopPropagation(); navigate('./changename');}}
                            >변경</em>
                        </div>
                    </div>
                    <div className="acc-box">
                        <h5>아이디</h5>
                        <div>{user.id}</div>
                    </div>
                    <div className="acc-box">
                        <h5>비밀번호</h5>
                        <div 
                            className="text-btn"
                            onClick={(e)=>{e.stopPropagation(); navigate('./changepw');}}
                        ><em>비밀번호 변경</em></div>
                    </div>
                    <div className="acc-box">
                        <h5>이메일</h5>
                        <div>{user.email}</div>
                    </div>
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

function CommentList(){
    // 수정해야하는 컴포넌트

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
                <h3 className="my-header">내가 쓴 댓글 목록</h3>
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

    let [update, setUpdate] = useState(0);

    let [selectedItem, setSelectedItem] = useState(null);
    useEffect(() => {
        if (selectedItem !== null) {
          getMsgList();
        }
    }, [selectedItem]);
      
    function handleItemClick(event, index) {
        event.stopPropagation();
        setSelectedItem(index);
    }

    function getMsgList(){
        axios({
            method: "POST",
            url: "/mypage/chat",
            data: {
                type: 0,
                oppId : `${chatList[selectedItem]['oppId']}`,
            },
          })
          .then(function (response) {
              setMsgList(response.data); // msgList는 딕셔너리 리스트
          })
          .catch(function (error) {
              console.log(error);
          });
    }

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
    }, [update]);


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

                setUpdate(update+1);
                getMsgList();
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
                        chatList.map((item, i) => {
                            return(
                                <a
                                    className={`item ${selectedItem === i ? 'selected' : ''}`}
                                    key={i}
                                    onClick={(event) => handleItemClick(event, i)}
                                >
                                    <time>{item.date}</time>
                                    <h3>{item.oppId}</h3>
                                    <p>{item.content}</p>
                                </a>
                            );
                        })
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
                                        <p className={`type ${msg['sender'] === user.id ? 'colortext2' : 'colortext'}`}>{type}</p>
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
            <div className="acc-wrap" style={{'height':'195px', 'padding':'25px 0'}}>
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

function Withdraw(){
    let user = useSelector((state) => state.user);
    let navigate = useNavigate();
    
    let [pw,setPw] = useState('');

    let [msg,setMsg] = useState('');

    function requestWithdraw(e){
        e.stopPropagation();

        let confirm_withdraw =  window.confirm("정말 탈퇴하시겠습니까?");
        
        if(pw===''){
            setMsg('비밀번호를 입력해주세요.');
            return;
        }

        if(confirm_withdraw){
            axios({
                method: "DELETE",
                url: "/mypage/account",
                data: {
                    password : `${pw}`,
                }
            })
            .then(function (response) {
                alert("회원 탈퇴가 완료되었습니다.");
                navigate("./../..");
            })
            .catch(function (error) {
                console.log(error);
                alert("잘못된 비밀번호입니다.");
            });
        }
    }

    return(
        <>
           <h3 className="my-header">회원 탈퇴</h3>
            <div className="witdraw-wrap" style={{'height':'80px'}}>
            <form method="POST">
                <div className="witdraw-box" style={{'width':'100%'}}> 
                    <div className="witdraw-header" style={{'width':'200px'}}>현재 비밀번호</div>
                    <div className="witdraw-box-wrap">
                        <input 
                            className="witdraw-box" 
                            type="password" 
                            onChange={e=>{ e.stopPropagation(); setPw(e.target.value);}}
                            onKeyDown={(e) => { if (e.key === "Enter") requestWithdraw(e) }}
                        />

                    </div>
                    {
                    msg==='' ? null :
                    <div className="err-msg">{msg}</div>
                    }
                </div>
                
            </form>
            </div>

            <div style={{'width':'100%'}}>
                <Button variant="light" className="witdrawBtn" onClick={(e)=>requestWithdraw(e)}>확인</Button>
            </div>
        </>
    );
}

function NameChange(){
    let user = useSelector((state) => state.user);
    let navigate = useNavigate();
    
    let [newName,setNewName] = useState('');
    let [msg, setMsg] = useState('')
    function requestWithdraw(e){
        e.stopPropagation();
        
        if(newName===''){
            setMsg('이름을 입력해주세요.');
            return;
        }

        if(newName===user.name){
            setMsg('현재 사용중인 닉네임입니다.');
            return;
        }

        axios({
            method: "POST",
            url: "/mypage/account/changename",
            data: {
                name : `${newName}`,
            }
        })
        .then(function (response) {
            if(response.data.type===1){
                alert("닉네임이 변경되었습니다.");
                navigate('./..');
            }
            else if(response.data.type===0){
                setMsg("이미 있는 닉네임입니다.");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    return(
        <>
           <h3 className="my-header">닉네임 변경</h3>
            <div className="witdraw-wrap" style={{'height':'80px'}}>
            <form method="POST">
                <div className="witdraw-box" style={{'width':'100%'}}> 
                    <div className="witdraw-header" style={{'width':'200px'}}>변경할 닉네임</div>
                    <div className="witdraw-box-wrap">
                        <input className="witdraw-box" type="password" onChange={e=>{
                            e.stopPropagation();
                            setNewName(e.target.value);
                        }}/>
                    </div>
                    {
                    msg==='' ? null :
                    <div className="err-msg">{msg}</div>
                    }
                </div>
                
            </form>
            </div>

            <div style={{'width':'100%'}}>
                <Button variant="light" className="witdrawBtn" onClick={(e)=>requestWithdraw(e)}>확인</Button>
            </div>
        </>
    );
}

export  {Account, WritingList, Chat, PwChange,  Withdraw, CommentList, NameChange }