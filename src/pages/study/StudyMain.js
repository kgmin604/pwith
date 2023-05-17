import "bootstrap/dist/css/bootstrap.min.css";
import "./study.css";
import "../../App.css";
import React, { useState, useEffect} from 'react';
import { Form, Nav, Stack, Button, Table, Accordion } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StudyCategory from "./StudyCategory";
import axios from "axios";
import { loginUser } from "../../store";

function StudyMain() {
  let navigate = useNavigate();
  let user = useSelector((state) => state.user);
  let dispatch = useDispatch();

  const [postContent, setPostContent] = useState({//글정보
    'no': '',//글번호
    'title': '',//글제목
    'view': '',//조회수
    'date': '',//날짜
    'headCount': '',//인원
    'content': '',//글내용
  })

  const [postList, setPostList] = useState([])//글정보가 담길 배열들

  useEffect(() => {
    axios({
      method: "GET",
      url: "/study",
    })
      .then(function (response) {
        setPostList(response.data);

      })
      .catch(function (error) {
        console.log(error);
        alert("글을 불러오지 못했습니다.");
      });
  },[]);

  if (localStorage.getItem("authentication") !== null) {
    dispatch(
      loginUser({
        id: localStorage.getItem("id"),
        name: localStorage.getItem("name"),
      })
    );
  }

    

  return (
    <div className="StudyMain">
      <div class="row">
        <div class="col-md-3" style={{'margin-bottom':'500px'}}>
          {Category()}
        </div>

        <div class="col-md-6">
          <Stack direction="horizontal" gap={3} style={{ padding: "5px" }}>
            <Form.Control className="me-auto" placeholder="원하는 스터디를 찾아보세요!" />
            <Button variant="blue">🔍</Button>
            <div className="vr" />
            {user.id === "" ? null: 
            (<div>
              
            <Nav.Link onClick={() => navigate("./create")}>
              <Button variant="blue"
              >New</Button>
            </Nav.Link>
            </div>)}
            
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
              {/* onClick={navigate(`./${row[0]}`) */}

              {
                postList.map(row=> (
                      <tr className="postCol" key={row[0]} onClick={console.log(1)}>
                      <td>{row[0]}</td> 
                      <td colSpan={2}>{row[1]}</td>
                      <td>{row[6]}</td>
                      <td>{row[3]}</td>
                      <td>{row[8]}</td>
                    </tr>
                  )
                )
              }
            </tbody>
          </Table>
          <div>

    </div>

          

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
      <Accordion.Body onClick={() => { }}> ALL</Accordion.Body>
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
