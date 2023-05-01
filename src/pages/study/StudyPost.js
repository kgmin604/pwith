import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

function StudyPost() {
    let navigate = useNavigate();
    return (
        <div className="StudyPost">
            <div class="row">

                {/* 카테고리 */}
                <div class="col-md-3" style={{fontFamily:'TmoneyRoundWind'}}>
                    <h5 >분야별 스터디 보기</h5>
                    <hr style={{ width: '60%', margin: '0 auto' }} />
                    <Nav defaultActiveKey="/home" className="flex-column">
                        <Nav.Link href="#"><div style={{ color: '#282c34' }}>프론트엔드</div></Nav.Link>
                        <Nav.Link eventKey="link-1"><div style={{ color: '#282c34' }}>백엔드</div></Nav.Link>
                        <Nav.Link eventKey="link-2"><div style={{ color: '#282c34' }}>인공지능</div></Nav.Link>
                        <Nav.Link eventKey="link-2"><div style={{ color: '#282c34' }}>컴퓨터사이언스</div></Nav.Link>
                    </Nav>
                </div>

                {/* 글내용*/}
                <div class="col-md-6">

                    <h4 style={{textAlign:'left', fontFamily:'TmoneyRoundWind'}}>스터디 모집</h4>
                    <hr style={{ width: '100%', margin: '0 auto' }} />

                    <div className="studyTitle">
                        <h5>글제목입니다</h5>
                    </div>
                    <hr style={{ width: '50%', margin: '0 auto' }} />
                    
                    <div className="studyContent">
                        <p>피어나는 뭇 피가 우리의 커다란 할지니, 용기가 있는가? 
                            우리 끝까지 넣는 너의 인간이 방지하는 보라. 이상이 길을 사는가 할지라도 인생을 그러므로 이상을 안고, 만물은 봄바람이다. 가슴에 그러므로 그들의 불어 무엇을 영원히 피는 있는가? 석가는 피부가 산야에 어디 열락의 부패뿐이다. 
                            사람은 소금이라 스며들어 살았으며, 웅대한 이상은 듣는다. 아니한 현저하게 피고, 열락의 만천하의 무엇을 위하여서, 약동하다. 설레는 품었기 노년에게서 전인 얼마나 약동하다. 끝에 설산에서 끝까지 실로 황금시대다. 
                            찾아다녀도, 목숨이 보내는 교향악이다.같이, 만천하의 그림자는 피어나는 들어 열락의 인간에 원대하고, 무엇을 보라. 현저하게 이 얼마나 바이며, 그들을 사랑의 보라. 쓸쓸한 같이, 심장의 풀밭에 과실이 구할 것은 모래뿐일 되는 것이다. 속에서 눈에 반짝이는 아니더면, 유소년에게서 것이다. 있는 너의 이상은 청춘의 위하여서. 공자는 넣는 만천하의 기쁘며, 봄날의 없으면 아니다. 가지에 눈에 그들의 그들의 피가 것이다. 창공에 청춘이 그들의 소금이라 아름답고 찬미를 우리의 것이다. 이상을 위하여, 이것은 아름답고 속에 이상, 영락과 산야에 있다.
                        </p>
                    </div>

                    <Button variant='blue'>스터디 참여하기</Button>

                </div>
            </div>
        </div>

    );

}

export default StudyPost;