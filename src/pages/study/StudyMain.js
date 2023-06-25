import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import React, { useState, useEffect } from 'react';
import { Form, Nav, Stack, Button, Table, Accordion } from "react-bootstrap";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateStudyPostList } from "../../store.js";


function StudyMain() {
  let studyPostList = useSelector((state) => state.studyPostList);
  let dispatch = useDispatch();

  /* -- StudyBoard.js로 이동
  useEffect(() => {
    const updateStudy = () => {
      axios({
        method: "GET",
        url: "/study/main",
      })
        .then(function (response) {
          dispatch(updateStudyPostList(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    updateStudy();
  }, []);
  */

  return (
    <div className="StudyMain">
      <div class="row">
        <div class="col-md-3">
          {Category()}
        </div>

        <div class="col-md-6">
          <Outlet></Outlet>
        </div>

        <div class="col-md-3">추천스터디</div>
      </div>
    </div>
  );

}

function Category() {//카테고리
  return <>
    
    <h5>Study</h5>
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

}



// function Category() {//카테고리
//   return <Accordion defaultActiveKey="0">
//     <Accordion.Item eventKey="0">
//       <Accordion.Header>개발 · 프로그래밍</Accordion.Header>
//       <Accordion.Body onClick={() => { }}> ALL</Accordion.Body>
//       <Accordion.Body>웹개발</Accordion.Body>
//       <Accordion.Body>풀스택</Accordion.Body>
//       <Accordion.Body>모바일 앱 개발</Accordion.Body>
//       <Accordion.Body>게임 개발</Accordion.Body>
//       <Accordion.Body>프로그래밍 언어</Accordion.Body>
//       <Accordion.Body>알고리즘 · 자료구조</Accordion.Body>
//       <Accordion.Body>데이터베이스</Accordion.Body>
//       <Accordion.Body>데스옵스 · 인프라</Accordion.Body>
//       <Accordion.Body>자격증</Accordion.Body>
//       <Accordion.Body>개발 도구</Accordion.Body>
//       <Accordion.Body>데이터 사이언스</Accordion.Body>
//       <Accordion.Body>데스크톱 앱 개발</Accordion.Body>
//       <Accordion.Body>교양 · 기타</Accordion.Body>
//     </Accordion.Item>
//     <Accordion.Item eventKey="1">
//       <Accordion.Header>보안 · 네트워크</Accordion.Header>
//       <Accordion.Body>ALL</Accordion.Body>
//       <Accordion.Body>보안</Accordion.Body>
//       <Accordion.Body>네트워크</Accordion.Body>
//       <Accordion.Body>시스템</Accordion.Body>
//       <Accordion.Body>클라우드</Accordion.Body>
//       <Accordion.Body>블록체인</Accordion.Body>
//       <Accordion.Body>자격증</Accordion.Body>
//       <Accordion.Body>기타</Accordion.Body>
//     </Accordion.Item>
//     <Accordion.Item eventKey="2">
//       <Accordion.Header>데이터 사이언스</Accordion.Header>
//       <Accordion.Body> ALL</Accordion.Body>
//       <Accordion.Body>데이터 분석</Accordion.Body>
//       <Accordion.Body>인공지능</Accordion.Body>
//       <Accordion.Body>데이터시각화</Accordion.Body>
//       <Accordion.Body>데아터 수집 · 처리</Accordion.Body>
//       <Accordion.Body> 자격증 </Accordion.Body>
//       <Accordion.Body>기타</Accordion.Body>
//     </Accordion.Item>
//     <Accordion.Item eventKey="2">
//       <Accordion.Header>게임 개발</Accordion.Header>
//       <Accordion.Body> ALL</Accordion.Body>
//       <Accordion.Body>게임 프로그래밍</Accordion.Body>
//       <Accordion.Body>게임 기획</Accordion.Body>
//       <Accordion.Body>게임 아트 · 그래픽</Accordion.Body>
//       <Accordion.Body>기타</Accordion.Body>
//     </Accordion.Item>
//   </Accordion>;
// }

export default StudyMain;
