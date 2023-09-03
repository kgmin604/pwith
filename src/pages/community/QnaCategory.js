import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../study/study.css";
import "./community.css";
import "../../App.css";
import axios from "axios";
import { Nav, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setQnaCategory } from '../../store';

const category = [
    '웹개발',
    '모바일 앱 개발',
    '게임 개발',
    '프로그래밍 언어',
    '알고리즘 · 자료구조',
    '데이터베이스',
    '자격증',
    '개발 도구',
    '데이터 사이언스',
    '데스크톱 앱 개발',
    '교양 · 기타'
]

function QnaCategory() {//카테고리
    const dispatch = useDispatch();
    return <>
        <h5>QnA</h5>
        <hr style={{ width: '60%', margin: '0 auto' }} />
        <Nav defaultActiveKey="#" className="flex-column">
            {category.map((item, index) => (
                <Nav.Link href="#" onClick={() => { dispatch(setQnaCategory(index)) }}><div style={{ color: '#282c34' }}>{item}</div></Nav.Link>
            ))}
        </Nav>
    </>

}
export default QnaCategory;