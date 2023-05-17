import React from 'react';
import "./member.css";
import { useSelector } from "react-redux"
import { Button } from "react-bootstrap";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ToggleButton from 'react-bootstrap/ToggleButton';

function Account(){
    let user = useSelector((state) => state.user);
    return(
        <>
            <h3 className="my-header">회원정보 관리</h3>
            <div className="acc-wrap">
                <div className="acc-box"> <div className="acc-header">아이디</div>{user.id}</div>
                <div className="acc-box"> <div className="acc-header">비밀번호</div>
                <Button variant="secondary" size="sm"> 비밀번호 변경 </Button>
                </div>
                <div className="acc-box"> <div className="acc-header">이름</div>{user.name}</div>
                <div className="acc-box"> <div className="acc-header">이메일</div> test@naver.com {user.email}
                    <Button variant="secondary" size="sm"> 이메일 인증 </Button>
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
    const [sel, setSel] = useState(1);

    return(
        <>
            <div style={{'padding':'0 0', 'margin':'0 0'}}>
                <h3 className="my-header">채팅</h3>
                <div className="chat-select">
                    <ul style={{'padding':'0 0'}}>
                        <li className={sel===1? "chat-btn-click" : "chat-btn"} onClick={()=>setSel(1)}>일반</li>
                        <li className={sel===2? "chat-btn-click" : "chat-btn"} onClick={()=>setSel(2)}>스터디</li>
                        <li className={sel===3? "chat-btn-click" : "chat-btn"} onClick={()=>setSel(3)}>멘토링</li>
                    </ul>
                </div>
                <div className="chat-bottom">
                    <div className="chat-list">
                        <div className="chat-list-content">
                            <div style={{'width':'60px','height':'60px','float':'left','borderRadius':'40px', 'backgroundColor':'white','border':'solid 1px gray','margin':'5px'}}></div>
                            <div style={{'float':'left', 'width':'70px', 'padding':'5px 10px'}}>
                                <h5 className="chat-list-name">이름</h5>
                                <span className="chat-list-name-cont">내용</span>
                            </div>
                        </div>
                        <div className="chat-list-content">
                            <div style={{'width':'60px','height':'60px','float':'left','borderRadius':'40px', 'backgroundColor':'white','border':'solid 1px gray','margin':'5px'}}></div>
                            <div style={{'float':'left', 'width':'70px', 'padding':'5px 10px'}}>
                                <h5 className="chat-list-name">이름</h5>
                                <span className="chat-list-name-cont">내용</span>
                            </div>
                        </div>
                        <div className="chat-list-content">
                            <div style={{'width':'60px','height':'60px','float':'left','borderRadius':'40px', 'backgroundColor':'white','border':'solid 1px gray','margin':'5px'}}></div>
                            <div style={{'float':'left', 'width':'70px', 'padding':'5px 10px'}}>
                                <h5 className="chat-list-name">이름</h5>
                                <span className="chat-list-name-cont">내용</span>
                            </div>
                        </div>
                    </div>
                    <div className="chatting"></div>
                </div>
            </div>
        </>
    );
}

function Mentor(){
     const [checked, setChecked] = useState(false);
    const [radioValue, setRadioValue] = useState('1');

    return(
        <>
            <div style={{'padding':'0 0', 'margin':'0 0'}}>
                <h3 className="my-header">멘토 신청</h3>
                <ToggleButton
                    className="mb-2"
                    id="toggle-check"
                    type="checkbox"
                    variant="outline-primary"
                    checked={checked}
                    value="1"
                    onChange={(e) => setChecked(e.currentTarget.checked)}
                >
                    Checked
                </ToggleButton>
            </div>
        </>
    );
}

export  {Account, WritingList, Chat, Mentor}