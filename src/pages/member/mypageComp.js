import React from 'react';
import axios from "axios";
import "./member.css";
import "./writinglist.css";
import "./admin.css";
import "../../assets/modal.css";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { loginUser } from '../../store.js'
import Cropper from "react-cropper";
import 'cropperjs/dist/cropper.css';

function Account() {
    let navigate = useNavigate();
    let userData = useSelector((state) => state.user);
    const dispatch = useDispatch();

    /* 개인정보 */
    let [user, setUser] = useState({
        'name': '',
        'id': '',
        'email': '',
        'image': ''
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
            }, 'image/jpeg');
        }
    };

    useEffect(() => {
        axios({
            method: "GET",
            url: "/mypage/account"
        })
            .then(function (response) {
                let copy = { ...user };
                copy['name'] = response.data.data.nickname;
                copy['id'] = response.data.data.id;
                copy['email'] = response.data.data.email;
                copy['image'] = response.data.data.image;
                setUser(copy);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [])

    return (
        <>
            <h3 className="my-header">회원정보 관리</h3>
            <div className="acc-wrap">
                <div className="img-area">
                    {user.image && <img src={`${user.image}?version=${Math.random()}`} alt="프로필사진" />}
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
                            onCancel={() => {
                                // 파일 선택 취소 시 실행되는 함수
                                setIsCrop(false);
                            }}
                            style={{ 'display': 'none' }}
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
                                    <div className="x-btn" onClick={(e) => { e.stopPropagation(); setIsCrop(false); }}>X</div>
                                </h3>

                                <Cropper
                                    ref={cropperRef}
                                    style={{ height: 400, width: "100%" }}
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
                                        onClick={e => { e.stopPropagation(); onCrop(); }}
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
                                style={{ 'marginLeft': '15px' }}
                                onClick={(e) => { e.stopPropagation(); navigate('./changename'); }}
                            >변경</em>
                        </div>
                    </div>
                    <div className="acc-box">
                        <h5>아이디</h5>
                        <div>{user.id}</div>
                    </div>
                    <div className="acc-box">
                        <h5>비밀번호</h5>
                        {
                            userData.isSocial===true ? null : 
                            <div
                                className="text-btn"
                                onClick={(e) => { e.stopPropagation(); navigate('./changepw'); }}
                            ><em>비밀번호 변경</em></div>
                        }
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

function WritingList() {
    let navigate = useNavigate();
    let [sel, setSel] = useState(0); // 0: 스터디 글 목록 1: 커뮤니티 글 목록
    let [mypost, setMypost] = useState([]);
    const parse = require('html-react-parser');//html 파싱

    function getWritingList(type) {
        let type_text = (type === 0 ? 'study' : 'community');
        setMypost([]);
        axios({
            method: "GET",
            url: `/mypage/writing-list/${type_text}`
        })
            .then(function (response) {
                console.log(response.data);
                setMypost(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        getWritingList(0);
    }, []);

    function movePage(event, id) {
        event.stopPropagation();
        if (sel === 0) { // 스터디 글
            navigate(`/study/${id}`);
        }
        else if (sel === 1) { // 커뮤니티 글
            navigate(`/community/qna/${id}`);
        }
    }

    return (
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
                            onClick={(event) => { event.stopPropagation(); setSel(1); getWritingList(1); }}
                        >커뮤니티</li>
                    </ul>
                </div>
                <div className="writinglist-bottom scroll-area">
                    {
                        mypost.length === 0 ? null :
                            mypost.map((post, index) => {
                                return (
                                    <div
                                        className="item"
                                        key={index}
                                        onClick={e => movePage(e, post.id)}
                                    >
                                        <time>{post.curDate}</time>
                                        <h3 className="header">{post.title}</h3>
                                        <p className="content">{parse(post.content)}</p>
                                    </div>
                                );
                            })
                    }
                </div>
            </div>
        </>
    );
}

function CommentList() {

    let navigate = useNavigate();
    let [sel, setSel] = useState(0); // 0: 스터디 댓글 목록 1: 커뮤니티 댓글 목록
    let [mycomment, setMycomment] = useState([]);
    const parse = require('html-react-parser');//html 파싱

    function getCommentList(type) {
        setMycomment([]);
        let type_text = (type === 0 ? 'study' : 'community');
        axios({
            method: "GET",
            url: `/mypage/comment-list/${type_text}`
        })
            .then(function (response) {
                setMycomment(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        getCommentList(0);
    }, []);

    function movePage(event, id) {
        event.stopPropagation();
        if (sel === 0) { // 스터디 글
            navigate(`/study/${id}`);
        }
        else if (sel === 1) { // 커뮤니티 글
            navigate(`/community/qna/${id}`);
        }
    }

    return (
        <>
            <div className="writinglist">
                <h3 className="my-header">내가 쓴 댓글 목록</h3>
                <div className="type-select">
                    <ul style={{ padding: '0 0' }}>
                        <li
                            className={sel === 0 ? "type-btn-click" : "type-btn"}
                            onClick={(event) => { event.stopPropagation(); setSel(0); getCommentList(0); }}
                        >스터디</li>
                        <li
                            className={sel === 1 ? "type-btn-click" : "type-btn"}
                            onClick={(event) => { event.stopPropagation(); setSel(1); getCommentList(1); }}
                        >커뮤니티</li>
                    </ul>
                </div>
                <div className="writinglist-bottom scroll-area">
                    {
                        mycomment.length === 0 ? null :
                            mycomment.map((comm, index) => {
                                return (
                                    <div
                                        className="item"
                                        key={index}
                                        onClick={e => movePage(e, comm.postId)}
                                    >
                                        <time>{comm.curDate}</time>
                                        <h3 className="header">{comm.title}</h3>
                                        <p className="content">{parse(comm.content)}</p>
                                    </div>
                                );
                            })
                    }
                </div>
            </div>
        </>
    );
}

function Chat() {
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

    function getMsgList() {
        axios({
            method: "POST",
            url: "/mypage/chat/list",
            data: {
                nickname: `${chatList[selectedItem]['nickname']}`
            },
        })
            .then(function (response) {
                setMsgList(response.data.data); // msgList는 딕셔너리 리스트
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    let [content, setContent] = useState('');
    let changeContent = (event) => {
        event.stopPropagation();
        setContent(event.target.value);
    }

    let [nickname, setNickname] = useState('');
    let changeNickname = (event) => {
        event.stopPropagation();
        setNickname(event.target.value);
    }

    let [msg, setMsg] = useState('');

    const parse = require('html-react-parser');//html 파싱

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
                setChatList(response.data.data); // chatList는 딕셔너리 리스트
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [update]);


    function sendRequest() {
        console.log("전송요청");
        axios({
            method: "POST",
            url: "/mypage/chat",
            data: {
                nickname: `${nickname}`,
                content: `${content}`
            },
        })
            .then(function (response) {
                alert("쪽지 전송 완료");
                setOpen(!open);
                setMsg('');
                setContent('');

                setUpdate(update + 1); // 쪽지 리스트 재로딩용
                getMsgList();
            })
            .catch(function (error) {
                if (error.response.data.status === 400) {
                    alert("없는 수신자 닉네임입니다.");
                }
            });
    }

    function checkRequest(event) {
        event.stopPropagation();
        if (nickname === "") {
            setMsg("! 수신자 닉네임를 입력해주세요.");
            return;
        } else if (content === "") {
            setMsg("! 내용을 입력해주세요.");
            return;
        } else {
            sendRequest();
        }
    }

    return (
        <>
            <div className="mypage-chat" style={{ 'padding': '0 0', 'margin': '0 0' }}>
                <h3 className="my-header">쪽지함</h3>
                <a className="send" title="쪽지 보내기" onClick={(event) => { handleModal(event); setNickname(''); }}>💌</a>
                <div className="chat-bottom">
                    <div className="chat-boxes scroll-area"> {/* 왼쪽구역: 채팅한 계정들*/}
                        {
                            chatList.length === 0 ?
                                <div className='signMsg'>쪽지함이<br></br>비어있습니다.</div>
                                :
                                chatList.map((item, i) => {
                                    return (
                                        <a
                                            className={`item ${selectedItem === i ? 'selected' : ''}`}
                                            key={i}
                                            onClick={(event) => handleItemClick(event, i)}
                                        >
                                            <time>{item.date}</time>
                                            <h3>{item.nickname}</h3>
                                            <p>{parse(item.content)}</p>
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
                                        <h2>{chatList[selectedItem]['nickname']}</h2>
                                        <a
                                            className="send"
                                            title="쪽지 보내기"
                                            onClick={(event) => { handleModal(event); setNickname(chatList[selectedItem]['nickname']); }}
                                        > 💌
                                        </a>
                                    </>
                            }
                        </div>
                        {
                            selectedItem === null ? null :
                                <div className="content">
                                    {
                                        msgList.length === 0 ? null :
                                            msgList.map((msg, i) => {
                                                const type = msg['sender'] === user.name ? "보낸 쪽지" : "받은 쪽지";
                                                return (
                                                    <div className="item" key={i}>
                                                        <time>{msg.date}</time>
                                                        <p className={`type ${msg['sender'] === user.name ? 'colortext2' : 'colortext'}`}>{type}</p>
                                                        <p className="text">{parse(msg.content)}</p>
                                                    </div>
                                                );
                                            })
                                    }
                                </div>
                        }
                    </div>
                </div>
                {
                    open === true ?
                        <>
                            <div className="modal-wrap"></div>
                            <form method='POST'>
                                <div className="modal">
                                    <a title="닫기" className="close" onClick={(event) => handleModal(event)}>X</a>
                                    <h3>쪽지 보내기</h3>
                                    <p className="receiver">
                                        <input
                                            type="text"
                                            onChange={e => { changeNickname(e); }}
                                            placeholder="수신자 아이디 입력"
                                            defaultValue={nickname}
                                        ></input>
                                    </p>
                                    <p>
                                        <textarea
                                            name="message"
                                            className="text"
                                            placeholder="내용 입력"
                                            onChange={e => changeContent(e)}>
                                        </textarea>
                                    </p>
                                    <input
                                        type="button"
                                        value="전송"
                                        className="button"
                                        onClick={e => checkRequest(e)}
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

function PwChange() { // 컴포넌트
    let navigate = useNavigate();

    let [userinput, setUserinput] = useState({
        'curPw': '',
        'newPw': '',
        'newPwChk': ''
    });
    let [is, setIs] = useState({
        'newPw': false,
        'newPwChk': false
    });

    let [red, setRed] = useState(0);

    function inputChange(e) {
        let copyUserinput = { ...userinput };
        copyUserinput[e.target.id] = e.target.value;
        setUserinput(copyUserinput);

        let copyIs = { ...is };

        if (e.target.id === 'newPw') {

            const pwRE = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
            // 하나 이상의 문자, 하나 이상의 숫자, 하나 이상의 특수문자, 8글자 이상
            if (!pwRE.test(copyUserinput['newPw'])) {
                copyIs['newPw'] = false;
                setIs(copyIs);
            }
            else {
                copyIs['newPw'] = true;
                setIs(copyIs);
            }
        }

        if (e.target.id === 'newPwChk') {
            if (copyUserinput['newPw'] === copyUserinput['newPwChk']) {
                copyIs['newPwChk'] = true;
                setIs(copyIs);
            }
            else {
                copyIs['newPwChk'] = false;
                setIs(copyIs);
            }
        }
    }

    function changePassword() { // axios 요청
        axios({
            method: "PATCH",
            url: "/mypage/account/password",
            data: {
                oldPw: `${userinput['curPw']}`,
                newPw: `${userinput['newPw']}`,
            },
        })
            .then(function (response) {
                if (response.data.status === 200) { // 성공
                    console.log(response);
                    alert('비밀번호가 변경되었습니다.');
                    navigate("/");
                }
                setRed(0);
            })
            .catch(function (error) {
                console.log(error);
                if (error.response.data.status === 400) { // 실패
                    alert('현재 비밀번호를 잘못 입력했습니다.');
                    setRed(1);
                }
            });
    }

    function clickBtn() {
        if (!is['newPw']) {
            alert('비밀번호는 하나 이상의 문자,숫자,특수문자를 포함한 8글자 이상이여야 합니다.');
            setRed(2);
            return;
        }
        else if (!is['newPwChk']) {
            alert('비밀번호 확인란을 다시 입력해주세요.')
            setRed(3);
            return;
        }
        else {
            changePassword();
        }
    }

    return (
        <>
            <h3 className="my-header">비밀번호 변경</h3>
            <div className="acc-wrap" style={{ 'height': '195px', 'padding': '25px 0' }}>
                <form method="POST">
                    <div className="acc-box" style={{ 'width': '100%' }}>
                        <div className="acc-header" style={{ 'width': '200px' }}>현재 비밀번호</div>
                        <div className="pwc-box-wrap">
                            <input type="password" className={`pwc-box ${red === 1 ? 'red-border' : ''}`} id="curPw" onChange={e => inputChange(e)} />
                        </div>
                    </div>
                    <div className="acc-box" style={{ 'width': '100%' }}>
                        <div className="acc-header" style={{ 'width': '200px' }}>새 비밀번호</div>
                        <div className="pwc-box-wrap">
                            <input type="password" className={`pwc-box ${red === 2 ? 'red-border' : ''}`} id="newPw" onChange={e => inputChange(e)} />
                        </div>
                    </div>
                    <div className="acc-box" style={{ 'width': '100%' }}>
                        <div className="acc-header" style={{ 'width': '200px' }}>새 비밀번호 확인</div>
                        <div className="pwc-box-wrap">
                            <input type="password" className={`pwc-box ${red === 3 ? 'red-border' : ''}`} id="newPwChk" onChange={e => inputChange(e)} />
                        </div>
                    </div>
                </form>
            </div>

            <div style={{ 'width': '100%' }}>
                <Button variant="light" className="pwBtn" onClick={clickBtn}>확인</Button>
            </div>
        </>
    )
}

function Withdraw() {
    let user = useSelector((state) => state.user);
    let navigate = useNavigate();

    let [pw, setPw] = useState('');
    let [msg, setMsg] = useState('');

    // 소셜 로그인 회원 탈퇴
    let [auth, setAuth] = useState('');         // 사용자 입력 값
    let [userAuth, setUserAuth] = useState(''); // 서버로부터 받은 값

    function sendPassword(e){
        e.stopPropagation();
        axios({
            method: "POST",
            url: "/mypage/account",
        })
        .then(function (response) {
            setUserAuth(response.data.data.auth);
            alert("이메일로 전송된 인증번호를 확인해주세요.");
        })
        .catch(function (error) {
            if(error.response.data.status===400){
                alert("존재하지 않는 이메일입니다.");
            }
        });
    }

    function requestWithdraw(e) {
        e.stopPropagation();

        if(user.isSocial){
            if(auth !== userAuth){
                setMsg('인증번호가 일치하지 않습니다. 다시 확인해주세요.');
                return;
            }
            else{
                let confirm_withdraw = window.confirm("정말 탈퇴하시겠습니까?");
    
                if (confirm_withdraw) {
                    axios({
                        method: "DELETE",
                        url: "/mypage/account",
                        data: {
                            password: `${pw}`,
                        }
                    })
                    .then(function (response) {
                        alert("회원 탈퇴가 완료되었습니다.");
                        navigate("./../..");
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                }
                else{
                    alert("취소되었습니다.");
                }
            }
        }
        else{
            if (pw === '') {
                setMsg('비밀번호를 입력해주세요.');
                return;
            }

            let confirm_withdraw = window.confirm("정말 탈퇴하시겠습니까?");
    
            if (confirm_withdraw) {
                axios({
                    method: "DELETE",
                    url: "/mypage/account",
                    data: {
                        password: `${pw}`,
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
            else{
                alert("취소되었습니다.");
            }
        }
    }

    return (
        <>
            <h3 className="my-header">회원 탈퇴</h3>
            {
                user.isSocial?
                <>
                <div className="witdraw-wrap" style={{ 'height': '130px' }}>
                    <form method="POST">
                        <div className="witdraw-box" style={{ 'width': '100%' }}>
                            <div className="witdraw-header" style={{ 'width': '200px' }}>이메일 인증하기</div>
                            <span 
                                className="witdraw-pw-btn"
                                onClick={e=>sendPassword(e)}
                            >인증번호 전송</span>
                            <br></br>
                            <div className="witdraw-header" style={{ 'width': '200px' }}>인증번호 확인</div>
                            <div className="witdraw-box-wrap">
                                <input
                                    className="witdraw-box"
                                    type="password"
                                    onChange={e => { e.stopPropagation(); setAuth(e.target.value); }}
                                />
                            </div>
                            {
                                msg === '' ? null :
                                    <div className="err-msg">{msg}</div>
                            }
                        </div>
                    </form>
                </div>
                </>
                :
                <>
                <div className="witdraw-wrap" style={{ 'height': '80px' }}>
                    <form method="POST">
                        <div className="witdraw-box" style={{ 'width': '100%' }}>
                            <div className="witdraw-header" style={{ 'width': '200px' }}>현재 비밀번호</div>
                            <div className="witdraw-box-wrap">
                                <input
                                    className="witdraw-box"
                                    type="password"
                                    onChange={e => { e.stopPropagation(); setPw(e.target.value); }}
                                    onKeyDown={(e) => { if (e.key === "Enter") requestWithdraw(e) }}
                                />

                            </div>
                            {
                                msg === '' ? null :
                                    <div className="err-msg">{msg}</div>
                            }
                        </div>
                    </form>
                </div>
                </>
            }

            <div style={{ 'width': '100%' }}>
                <Button variant="light" className="witdrawBtn" onClick={(e) => requestWithdraw(e)}>확인</Button>
            </div>
        </>
    );
}

function NameChange() {
    let user = useSelector((state) => state.user);
    let navigate = useNavigate();
    let dispatch = useDispatch();

    let [newName, setNewName] = useState('');
    let [msg, setMsg] = useState('')
    function requestWithdraw(e) {
        e.stopPropagation();

        if (newName === '') {
            setMsg('이름을 입력해주세요.');
            return;
        }

        if (newName === user.name) {
            setMsg('현재 사용중인 닉네임입니다.');
            return;
        }

        axios({
            method: "PATCH",
            url: "/mypage/account/nickname",
            data: {
                newNick: `${newName}`,
            }
        })
            .then(function (response) {
                alert("닉네임이 변경되었습니다.");
                dispatch(
                    loginUser({ name: newName })
                );
                navigate('./..');
            })
            .catch(function (error) {
                console.log(error);
                setMsg("이미 있는 닉네임입니다.");
            });
    }

    return (
        <>
            <h3 className="my-header">닉네임 변경</h3>
            <div className="witdraw-wrap" style={{ 'height': '80px' }}>
                <form method="POST">
                    <div className="witdraw-box" style={{ 'width': '100%' }}>
                        <div className="witdraw-header" style={{ 'width': '200px' }}>변경할 닉네임</div>
                        <div className="witdraw-box-wrap">
                            <input className="witdraw-box" onChange={e => {
                                e.stopPropagation();
                                setNewName(e.target.value);
                            }} />
                        </div>
                        {
                            msg === '' ? null :
                                <div className="err-msg">{msg}</div>
                        }
                    </div>

                </form>
            </div>

            <div style={{ 'width': '100%' }}>
                <Button variant="light" className="witdrawBtn" onClick={(e) => requestWithdraw(e)}>확인</Button>
            </div>
        </>
    );
}

function Admin() {

    let user = useSelector((state) => state.user);
    let navigate = useNavigate();
    let [clickNum, setClickNum] = useState(0);

    let [list, setList] = useState([]);

    useEffect(() => {
        if(user.name !== '관리자'){
            alert('비정상적 접근입니다.');
            navigate('/');
        }
        else{
            axios({
                method: "GET",
                url: `/mypage/admin`,
            })
                .then(function (response) {
                setList(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }, []);

    function requestCheck(e){
        e.stopPropagation();

        if (window.confirm("완료처리 하시겠습니까?")){
            axios({
                method: "POST",
                url: `/mypage/admin`,
                data:{
                    id: Number(clickNum)
                }
            })
            .then(function (response) {
                alert("처리가 완료되었습니다.");
                window.location.reload();
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }

    return (
    <>
        <h3 className="my-header">관리하기</h3>
        <div className="admin-wrap scroll-area">
            <div className="admin-items">
                <div className="admin-header">
                    <div className="admin-id">ID</div>
                    <div className="admin-title">제목</div>
                    <div className="admin-sender">송신자</div>
                    <div className="admin-date">날짜</div>
                    <div className="admin-check">처리여부</div>
                </div>
            {
            list.length === 0 ? null :
            list.map((item,i)=>{
            return(
                <>
                <div className="admin-item" onClick={e=>{e.stopPropagation(); setClickNum(item.id);}}>
                    <div className="admin-id">{item.id}</div>
                    <div className="admin-title">{item.title}</div>
                    <div className="admin-sender">{item.sender}</div>
                    <div className="admin-date">{item.date}</div>
                    <div className="admin-check">{`${item.check?'확인':'미확인'}`}</div>
                </div>
                {
                    clickNum === item.id ?
                    <div className="admin-content">
                        {item.content}
                        <br></br>
                        {
                            !item.check? 
                            <input 
                                className="admin-btn" 
                                type="button" 
                                value="확인"
                                onClick={e=>requestCheck(e)}
                            ></input> : null
                        }
                    </div>
                    : null
                }
                </>
            );})
            }
            </div>
        </div>
    </>
    );
}

export { Account, WritingList, Chat, PwChange, Withdraw, CommentList, NameChange, Admin }