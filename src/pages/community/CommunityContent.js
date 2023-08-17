import "bootstrap/dist/css/bootstrap.min.css";
import "./community-content.css";
import "../../App.css";
import React, { useState } from 'react';
import { Form, Nav, Stack, Button, Table } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

function CommunityContent(){

    let [type, setType] = useState('책'); // 책 또는 강의

    let tmp = {
        'img':'https://image.yes24.com/goods/4333686/XL',
        'title':'윤성우의 열혈 C 프로그래밍',
        'url':'https://www.yes24.com/Product/Goods/4333686',
        'tags':['C언어','프로그래밍','코딩기초','코코로로딩딩','재미','씨언어','씨리리리언어']
    };
    let tmp2 = {
        'img':'https://image.yes24.com/goods/112208302/XL',
        'title':'이것이 자바다',
        'url':'https://www.yes24.com/Product/Goods/112208302',
        'tags':['자바','프로그래밍']
    };
    let [list, setList] = useState([tmp, tmp2, tmp, tmp, tmp, tmp, tmp2, tmp2]);

    return(
        <>
        <div class="row">
            <div class="col-md-3 category-area">
                <Category/>
            </div>
            <div class="col-md-9 content-area">
                <div className="header">
                    <h3 
                        className={type==='책'?"selected":"non-selected"}
                        onClick={(e)=>{e.stopPropagation(); setType('책');}}
                    >책</h3>
                    <h3>|</h3>
                    <h3 
                        className={type==='강의'?"selected":"non-selected"}
                        onClick={(e)=>{e.stopPropagation(); setType('강의');}}
                    >인터넷 강의</h3>
                </div>
                <div className="body">
                    <div className="items">
                    {
                        list.map((item, i) => (
                            <div 
                                key={i}
                                className="item"
                                onClick={(e)=>{e.stopPropagation(); window.open(item.url, '_blank')}}
                            >
                                <img src={item.img}/>
                                <h5>{item.title}</h5>
                                <div className="tags">
                                {
                                    item.tags.map((tag,j)=>(
                                        <span 
                                            key={j}
                                            className="tag"
                                        >{tag}</span>
                                    ))
                                }
                                </div>
                            </div>
                        ))
                    }
                    </div>
                </div>
            </div>
        </div>
        
        </>
    );
}

function Category() {//카테고리
    return(
        <>
        <h5>학습 콘텐츠</h5>
        <hr style={{ width: '60%', margin: '0 auto' }} />
        <Nav defaultActiveKey="#" className="flex-column">
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>웹개발</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>모바일 앱 개발</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>게임 개발</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>프로그래밍 언어</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>알고리즘 · 자료구조</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>데이터베이스</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>자격증</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>개발 도구</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>데이터 사이언스</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>데스크톱 앱 개발</div></Nav.Link>
            <Nav.Link href="#"><div style={{ color: '#282c34' }}>교양 · 기타</div></Nav.Link>
        </Nav>
        </>
    );
}

export default CommunityContent;