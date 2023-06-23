// import logo from './logo.svg';
import axios from "axios";
import "./App.css";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // bootstrap css 파일 사용
import { Form } from "react-bootstrap"; // bootstrap의 component 사용
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
//import Cookies from 'js-cookie';
// import { useCookies, Cookies } from 'react-cookie';

import PwithMain from "./pages/pwithmain/PwithMain.js";
import StudyMain from "./pages/study/StudyMain.js";
import RoomMain from "./pages/studyroom/RoomMain.js";
import RoomCreate from "./pages/studyroom/RoomCreate.js";
import CommunityMain from "./pages/community/CommunityMain.js";
import MentoringMain from "./pages/mentoring/MentoringMain.js";
import MentoringCreate from "./pages/mentoring/MetoringCreate";
import MentoringPost from "./pages/mentoring/MentoringPost";
import Login from "./pages/member/login.js";
import Join from "./pages/member/join.js";
import Help from "./pages/member/help.js";
import Mypage from "./pages/member/mypage.js";
import {
  Account,
  WritingList,
  Chat,
  Mentor,
  PwChange,
  Email,
} from "./pages/member/mypageComp.js";
import { loginUser, clearUser } from "./store.js";
import StudyCreate from "./pages/study/StudyCreate.js";
import StudyPost from "./pages/study/StudyPost.js";
import StudyBoard from "./pages/study/StudyBoard";
import CommunityIT from "./pages/community/CommunityIT";
import CommunityQna from "./pages/community/CommunityQna";
import CommunityBoard from "./pages/community/CommunityBoard";
import CommunityContent from "./pages/community/CommunityContent";
import QnaCreate from "./pages/community/QnaCreate";
import QnaPost from "./pages/community/QnaPost";

function App() {
  let navigate = useNavigate();
  let user = useSelector((state) => state.user);
  let dispatch = useDispatch();

  // 로그인 유지 목적
  // useEffect(()=>{
  //   axios({
  //     method: "POST",
  //     url: "/",
  //     data: {
  //       chkSession: 1
  //     },
  //   })
  //   .then(function (response) {
  //     dispatch(
  //       loginUser({
  //         id: response.data.id,
  //         name: response.data.name,
  //         email: response.data.email
  //       })
  //     );
  //     console.log("로그인 요청");
  //     console.log(response);
  //     navigate("/");
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // },[])

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
        dispatch(clearUser());

        //localStorage.removeItem("id");
        //localStorage.removeItem("name");
        //localStorage.removeItem("email");
        navigate("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <>
      <div className="wrap">
        <div className="top-area">
          {user.id === null ? (
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
            <div
              className="btn pwith-logo"
              onClick={(e) => {
                e.stopPropagation();
                if(window.location.pathname === "/"){ // 현재 접속중인 경로 확인
                  //window.location.href = "/"; // 새로고침
                }
                else{
                  navigate("/");
                }
              }}
            ></div>
            <ul className="navbar-menu" style={{ "margin-right": "40px" }}>
              <li
                className="navbar-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if(window.location.pathname === "/study/main"){ // 현재 접속중인 경로 확인
                    //window.location.href = "/study/main"; // 새로고침
                  }
                  else{
                    navigate("/study/main");
                  }
                }}
              >
                스터디
              </li>
              <li 
                className="navbar-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  if(window.location.pathname === "/studyroom"){ // 현재 접속중인 경로 확인
                    //window.location.href = "/studyroom"; // 새로고침
                  }
                  else{
                    navigate("/studyroom");
                  }
                }}
              >
                스터디룸
              </li>
              <li
                className="navbar-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  if(window.location.pathname === "/community/main"){ // 현재 접속중인 경로 확인
                    //window.location.href = "/community/main"; // 새로고침
                  }
                  else{
                    navigate("/community/main");
                  }
                }}
              >
                커뮤니티
              </li>
              <li
                className="navbar-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if(window.location.pathname === "/mentoring/main"){ // 현재 접속중인 경로 확인
                    //window.location.href = "/mentoring/main"; // 새로고침
                  }
                  else{
                    navigate("/mentoring/main");
                  }
                }}
              >
                멘토링
              </li>
            </ul>

            <Form
              className="d-flex"
              style={{ width: "280px", height: "40px", "margin-left": "80px" }}
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
            {user.id === null ? (
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
                  onClick={() => navigate("/mypage/chat")}
                >
                  쪽지함
                </div>
                <div
                  className="mem-btn"
                  style={{
                    width: "90px",
                    color: "white",
                    "background-color": "#98afca",
                  }}
                  onClick={() => navigate("./mypage/account")}
                >
                  MyPage
                </div>
              </div>
            )}
          </nav>
        </div>
        <Routes>
          <Route path="/" element={<PwithMain />} />
          <Route path="/study" element={<StudyMain />}>
            <Route path="main" element={<StudyBoard />} />
            <Route path=":id" element={<StudyPost />} />
          </Route>
          <Route path="/study/create" element={<StudyCreate />} />
          <Route path="/studyroom" element={<RoomMain />} />
          <Route path="/studyroom/create" element={<RoomCreate />} />
          <Route path="/community" element={<CommunityMain />}>
            <Route path="main" element={<CommunityBoard />} />
            <Route path="it" element={<CommunityIT />} />
            <Route path="content" element={<CommunityContent />} />
          </Route>
          <Route path="/community/qna/main" element={<CommunityQna />} />
          <Route path="/community/qna/create" element={<QnaCreate />} />
          <Route path="/community/qna/:id" element={<QnaPost />} />
          <Route path="/mentoring/main" element={<MentoringMain />} />
          <Route path="/mentoring/create" element={<MentoringCreate />} />
          <Route path="/mentoring/:id" element={<MentoringPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/help" element={<Help />} />
          <Route path="/mypage" element={<Mypage />}>
            <Route path="account/changepw" element={<PwChange />} />
            <Route path="account/email" element={<Email />} />
            <Route path="account" element={<Account />} />
            <Route path="writinglist" element={<WritingList />} />
            <Route path="chat" element={<Chat />} />
          </Route>
          <Route path="*" element={ 
            <div className="img-error">
              <img src='/error_404.png'></img>
              <div>잘못된 주소입니다.</div>
            </div>
          } />
        </Routes>
      </div>
      <div className="bottom-area">
        <div
          style={{
            width: "1200px",
            margin: "0 auto",
            "line-height": "80px",
            "font-size": "small",
          }}
        >
          @Pwith team
        </div>
      </div>
    </>
  );
}

export default App;
