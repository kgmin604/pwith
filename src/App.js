// import logo from './logo.svg';
import axios from "axios"; // axios 추가 - 채영
import "./App.css";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // bootstrap css 파일 사용
import { Navbar, Container, Nav, Form, Button } from "react-bootstrap"; // bootstrap의 component 사용
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import StudyMain from "./pages/study/StudyMain.js";
import RoomMain from "./pages/studyroom/RoomMain.js";
import CommunityMain from "./pages/community/CommunityMain.js";
import MentoringMain from "./pages/mentoring/MentoringMain.js";
import Login from "./pages/member/login.js";
import Join from "./pages/member/join.js";
import Help from "./pages/member/help.js";
import Mypage from "./pages/member/mypage.js";
import StudyCreate from "./pages/study/StudyCreate.js";
import StudyPost from "./pages/study/StudyPost.js";


function App() {
  let navigate = useNavigate();
  let [user, setUser] = useState("");

  return (
    <div className="App">
      <Navbar bg="white" variant="light" style={{ height: "200px" }}>
        <Container className="grounp-flex top-area">
          <img src="/pwith-logo.png" className="btn" onClick={() => navigate("/")}
          />
          <Nav className="me-auto">
            <Nav.Link
              className="categoryIcon"
              style={{ "margin-left": "40px" }}
              onClick={() => navigate("/study")}
            >
              스터디 모집
            </Nav.Link>
            <Nav.Link
              className="categoryIcon"
              onClick={() => navigate("./studyroom")}
            >
              스터디룸
            </Nav.Link>
            <Nav.Link
              className="categoryIcon"
              onClick={() => navigate("./community")}
            >
              커뮤니티
            </Nav.Link>
            <Nav.Link
              className="categoryIcon"
              onClick={() => navigate("./mentoring")}
            >
              멘토링
            </Nav.Link>

            <Form
              className="d-flex"
              style={{ "margin-left": "250px", height: "40px" }}
            >
              <Form.Control
                type="search"
                placeholder="검색"
                className="me-2"
                aria-label="Search"
              />
              <div
                className="btn"
                style={{
                  border: "solid 1px",
                  "border-color": "#98AFCA",
                  "background-color": "white",
                  height: "40px",
                }}
              >
                🔍{" "}
              </div>
            </Form>

            {user === "" ? (
              <Nav className="me-auto">
                <Nav.Link
                  className="loginIcon"
                  style={{ color: "#98AFCA" }}
                  onClick={() => navigate("./login")}
                >
                  로그인
                </Nav.Link>
                <Nav.Link
                  className="joinIcon"
                  style={{ color: "white" }}
                  onClick={() => navigate("./join")}
                >
                  회원가입
                </Nav.Link>
              </Nav>
            ) : (
              <div className="mybtn" onClick={() => navigate("./mypage")}>
                마이페이지
              </div>
            )}
          </Nav>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<div>메인페이지입니다 🌷🌼🌻🌸</div>} />
        <Route path="/study" element={<StudyMain />} />
        <Route path="/study/create" element={<StudyCreate/>} />
        <Route path="/study/:id" element={ <StudyPost/> }/> {/* 글상세페이지 */}
        <Route path="/studyroom" element={<RoomMain />} />
        <Route path="/community" element={<CommunityMain />} />
        <Route path="/mentoring" element={<MentoringMain />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/join" element={<Join />} />
        <Route path="/help" element={<Help />} />
        <Route path="/mypage" element={<Mypage />} />

      </Routes>
    </div>
  );
}

export default App;
