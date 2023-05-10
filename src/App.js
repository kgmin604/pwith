// import logo from './logo.svg';
import axios from "axios";
import "./App.css";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // bootstrap css 파일 사용
import { Navbar, Container, Nav, Form, Button } from "react-bootstrap"; // bootstrap의 component 사용
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import PwithMain from "./pages/pwithmain/PwithMain.js";
import StudyMain from "./pages/study/StudyMain.js";
import RoomMain from "./pages/studyroom/RoomMain.js";
import CommunityMain from "./pages/community/CommunityMain.js";
import MentoringMain from "./pages/mentoring/MentoringMain.js";
import Login from "./pages/member/login.js";
import Join from "./pages/member/join.js";
import Help from "./pages/member/help.js";
import Mypage from "./pages/member/mypage.js";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearUser } from "./store.js";
import StudyCreate from "./pages/study/StudyCreate.js";
import StudyPost from "./pages/study/StudyPost.js";
import CommunityIT from "./pages/community/CommunityIT";
import CommunityBootcamp from "./pages/community/CommunityBootcamp";
import CommunityQna from "./pages/community/CommunityQna";
import CommunitySumup from "./pages/community/CommunitySumup";

function App() {
  let navigate = useNavigate();
  let user = useSelector((state) => state.user);
  let dispatch = useDispatch();

  if (localStorage.getItem("authentication") !== null) {
    dispatch(
      loginUser({
        id: localStorage.getItem("id"),
        name: localStorage.getItem("name"),
      })
    );
  }

  function logout() {
    axios({
      method: "GET",
      url: "/logout",
      data: {
        requestType: "logout",
      },
    })
      .then(function (response) {
        console.log(response);
        localStorage.removeItem("authentication");
        localStorage.removeItem("id");
        localStorage.removeItem("name");
        dispatch(clearUser());
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <>
    <div className="wrap">
      <div className="top-area">
        {user.id === "" ? (
          <div className="top-msg"></div>
        ) : (
          <div className="top-msg">
            {" "}
            {user.name}님 안녕하세요!{" "}
            <u className="mybtn" onClick={logout}>
              로그아웃
            </u>
          </div>
        )}

        <nav className="navbar" style={{}}>
          <div className="btn pwith-logo" onClick={() => navigate("/")}></div>
          <ul className="navbar-menu" style={{ "margin-right": "40px" }}>
            <li className="navbar-btn" onClick={() => navigate("/study")}>
              스터디
            </li>
            <li className="navbar-btn" onClick={() => navigate("/studyroom")}>
              스터디룸
            </li>
            <li className="navbar-btn" onClick={() => navigate("/community/sumup")}>
              커뮤니티
            </li>
            <li className="navbar-btn" onClick={() => navigate("/mentoring")}>
              멘토링
            </li>
          </ul>
          
          <Form className="d-flex" style={{ 'width': "280px", 'height': "40px", 'margin-left':'80px' }}>
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
          {user.id === "" ? (
            <div className="mem-area">
              <div
                className="mem-btn"
                style={{ width: "70px" }}
                onClick={() => navigate("./login")}
              >
                로그인
              </div>
              <div
                className="mem-btn"
                style={{
                  width: "90px",
                  color: "white",
                  "background-color": "#98afca",
                }}
                onClick={() => navigate("./join")}
              >
                회원가입
              </div>
            </div>
          ) : (
            <div className="mem-area">
              <div
                className="mem-btn"
                style={{ width: "70px" }}
                onClick={() => navigate("./mypage/chat")}
              >
                채팅함
              </div>
              <div
                className="mem-btn"
                style={{
                  width: "90px",
                  color: "white",
                  "background-color": "#98afca",
                }}
                onClick={() => navigate("./mypage")}
              >
                MyPage
              </div>
            </div>
          )}
        </nav>
      </div>
      <Routes>
        <Route path="/" element={ <PwithMain/> } />
        <Route path="/study" element={<StudyMain />}></Route>
          <Route path="/study/create" element={<StudyCreate />} />
          <Route path="/study/:id" element={<StudyPost />} /> {/* 글상세페이지 */}   
        <Route path="/studyroom" element={<RoomMain />} />
        <Route path="/community" element={<CommunityMain />} >
              <Route path="sumup" element={<CommunitySumup /> }/>
              <Route path="bootcamp" element={<CommunityBootcamp />}/>
              <Route path="it" element={<CommunityIT/>}/>
              <Route path="qna" element={<CommunityQna/>}/>
          </Route>
        <Route path="/mentoring" element={<MentoringMain />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/help" element={<Help />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
    </div>
    <div className="bottom-area">
        <div style={{'width':'1280px', 'margin':'0 auto','line-height':'80px','font-size':'small'}}>
          @Pwith team</div>
    </div>
    </>
  );
}

export default App;
