import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import React, { useState } from 'react';
import { Form, Nav, Stack, Button, Table,Accordion } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import StudyCategory from "./StudyCategory";

function StudyMain() {
  let navigate = useNavigate();

  const [postContent, setPostContent] = useState({//글정보
    'no':'',//글번호
    'title': '',//글제목
    'view':'',//조회수
    'date':'',//날짜
    'headCount':'',//인원
    'content': '',//글내용
})
    const [postList, setPostList]=useState([0,1,2,3,4,5])//글정보가 담길 배열들

  return (
    <div className="StudyMain">
      <div class="row">
        <div class="col-md-3">
        {Category()}
        </div>
        
        <div class="col-md-6">
          <Stack direction="horizontal" gap={3} style={{ padding: "5px" }}>
            <Form.Control className="me-auto" placeholder="원하는 스터디를 찾아보세요!" />
            <Button variant="blue">🔍</Button>
            <div className="vr" />
            <Nav.Link onClick={() => navigate("./create")}>
              <Button variant="blue"
              >New</Button>
            </Nav.Link>
          </Stack>

          <Table bordered hover>
            <thead>
              <tr>
                <th>no.</th>
                <th colSpan={2}>글제목</th>
                <th>조회수</th>
                <th>날짜</th>
                <th>인원</th>
              </tr>
            </thead>
            <tbody>

        {/* 컴포넌트로 묶어야할 듯 */}

        {
          postList.map(function(){//임시 정보
            return(
              <tr className="postCol">
                <td>0</td>
                <td colSpan={2}>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>@fat</td>
              </tr>
            )
          }
          )
        }
            </tbody>
          </Table>
        </div>
        <div class="col-md-3">추천스터디</div>
      </div>


    </div>

  );
}




export default StudyMain;

function Category() {
  return <Accordion defaultActiveKey="0">
    <Accordion.Item eventKey="0">
      <Accordion.Header>개발 · 프로그래밍</Accordion.Header>
      <Accordion.Body onClick={() => { } }> ALL</Accordion.Body>
      <Accordion.Body>웹개발</Accordion.Body>
      <Accordion.Body>풀스택</Accordion.Body>
      <Accordion.Body>모바일 앱 개발</Accordion.Body>
      <Accordion.Body>게임 개발</Accordion.Body>
      <Accordion.Body>프로그래밍 언어</Accordion.Body>
      <Accordion.Body>알고리즘 · 자료구조</Accordion.Body>
      <Accordion.Body>데이터베이스</Accordion.Body>
      <Accordion.Body>데스옵스 · 인프라</Accordion.Body>
      <Accordion.Body>자격증</Accordion.Body>
      <Accordion.Body>개발 도구</Accordion.Body>
      <Accordion.Body>데이터 사이언스</Accordion.Body>
      <Accordion.Body>데스크톱 앱 개발</Accordion.Body>
      <Accordion.Body>교양 · 기타</Accordion.Body>
    </Accordion.Item>
    <Accordion.Item eventKey="1">
      <Accordion.Header>보안 · 네트워크</Accordion.Header>
      <Accordion.Body>ALL</Accordion.Body>
      <Accordion.Body>보안</Accordion.Body>
      <Accordion.Body>네트워크</Accordion.Body>
      <Accordion.Body>시스템</Accordion.Body>
      <Accordion.Body>클라우드</Accordion.Body>
      <Accordion.Body>블록체인</Accordion.Body>
      <Accordion.Body>자격증</Accordion.Body>
      <Accordion.Body>기타</Accordion.Body>
    </Accordion.Item>
    <Accordion.Item eventKey="2">
      <Accordion.Header>데이터 사이언스</Accordion.Header>
      <Accordion.Body> ALL</Accordion.Body>
      <Accordion.Body>데이터 분석</Accordion.Body>
      <Accordion.Body>인공지능</Accordion.Body>
      <Accordion.Body>데이터시각화</Accordion.Body>
      <Accordion.Body>데아터 수집 · 처리</Accordion.Body>
      <Accordion.Body> 자격증 </Accordion.Body>
      <Accordion.Body>기타</Accordion.Body>
    </Accordion.Item>
    <Accordion.Item eventKey="2">
      <Accordion.Header>게임 개발</Accordion.Header>
      <Accordion.Body> ALL</Accordion.Body>
      <Accordion.Body>게임 프로그래밍</Accordion.Body>
      <Accordion.Body>게임 기획</Accordion.Body>
      <Accordion.Body>게임 아트 · 그래픽</Accordion.Body>
      <Accordion.Body>기타</Accordion.Body>
    </Accordion.Item>
  </Accordion>;
}
