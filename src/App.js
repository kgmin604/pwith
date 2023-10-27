// import logo from './logo.svg';
import axios from "axios";
import "./App.css";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // bootstrap css 파일 사용
import { Form } from "react-bootstrap"; // bootstrap의 component 사용
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
//import Cookies from 'js-cookie';
// import { useCookies, Cookies } from 'react-cookie';
import { setStudyCategory, setQnaCategory, setContentCategory} from "./store.js";

import PwithMain from "./pages/pwithmain/PwithMain.js";
import StudyMain from "./pages/study/StudyMain.js";
import RoomMain from "./pages/studyroom/RoomMain.js";
import RoomCreate from "./pages/studyroom/RoomCreate.js";
import LiveRoom from "./pages/studyroom/LiveRoom";
import RoomDetail from "./pages/studyroom/RoomDetail.js";
import MentoringRoomDetail from "./pages/studyroom/MentoringRoomDetail.js";
import{
  MentoringRoomPaySuccess,
} from "./pages/studyroom/MentoringRoomPay.js";
import CommunityMain from "./pages/community/CommunityMain.js";
import MentoringMain from "./pages/mentoring/MentoringMain.js";
import MentoringCreate from "./pages/mentoring/MetoringCreate";
import Login from "./pages/member/login.js";
import Join from "./pages/member/join.js";
import Help from "./pages/member/help.js";
import Mypage from "./pages/member/mypage.js";
import Auth from "./pages/auth/Auth.js";
import AuthJoin from "./pages/auth/AuthJoin.js";
import {
  Account,
  WritingList,
  CommentList,
  Chat,
  PwChange,
  Withdraw,
  NameChange,
} from "./pages/member/mypageComp.js";
import { HelpId, HelpPw, ResetPw } from "./pages/member/help.js";
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
import PortfolioManage from "./pages/mentoring/PortfolioManage";
import { WebSocketProvider } from "./hooks/WebsocketHooks";

function App() {
  let navigate = useNavigate();
  let user = useSelector((state) => state.user);
  let dispatch = useDispatch();

  // 로그인 유지 목적
  useEffect(()=>{
    axios({
      method: "GET",
      url: "/check"
    })
    .then(function (response) {
      console.log("로그인 요청");
      console.log(response);
      if(response.data.status===200){
        dispatch(
          loginUser({
            id: response.data.data.id,
            name: response.data.data.nickname,
            isSocial: response.data.data.isSocial
          })
        );
      }
      })
      .catch(function (error) {
        console.log(error);
      });
  },[])

  //스터디룸에서는 네브바 숨기기
  const location = useLocation();
  const isStudyRoomPath =
    location.pathname.startsWith(`/studyroom/live`) &&
    !location.pathname.includes("main") &&
    !location.pathname.includes("create");

  let [isModal, setIsModal] = useState(false); // 알림함
  let [isNav, setIsNav] = useState(0);

  function logout() {
    axios({
      method: "GET",
      url: "/member/logout",
    })
      .then(function (response) {
        if (response.data.status == 200) {
          dispatch(clearUser());
          navigate("/");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  // access 만료 테스트
  function test() {
    axios({
      method: "GET",
      url: "/login-require-test",
      headers: {
        Authorization: `${localStorage.getItem("Authorization")}`, // Access Token을 Authorization 헤더에 추가
      },
    })
      .then(function (response) {
        if (response.data.status == 200) {
          localStorage.removeItem("Authorization");
          localStorage.setItem(
            "Authorization",
            response.headers["authorization"]
          );
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <WebSocketProvider>
      <div className="wrap">
        {!isStudyRoomPath && (
          <div className="top-area">
            {user.name === null ? (
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
            <nav className="navbar">
              <div
                className="btn pwith-logo"
                onClick={(e) => {
                  e.stopPropagation();
                  alert(user.name);
                  navigate("/");
                }}
              ></div>
              <ul className="navbar-menu" style={{ "margin-right": "40px" }}>
                <div className="parent-container">
                  <li
                    className="navbar-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/study/main");
                      setIsNav(0);
                      dispatch(setStudyCategory(null));
                    }}
                    onMouseEnter={() => setIsNav(1)}
                    onMouseLeave={() => setIsNav(0)}
                  >
                    스터디
                    {isNav === 1 ? (
                      <div
                        className="navbar-modal"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <ul className="lst">
                          <li
                            className="lst-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/study/main");
                              setIsNav(0);
                              dispatch(setStudyCategory(null));
                            }}
                          >
                            스터디
                          </li>
                        </ul>
                      </div>
                    ) : null}
                  </li>
                </div>
                <div className="parent-container">
                  <li
                    className="navbar-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/studyroom");
                      setIsNav(0);
                    }}
                    onMouseEnter={() => setIsNav(2)}
                    onMouseLeave={() => setIsNav(0)}
                  >
                    스터디룸
                    {isNav === 2 ? (
                      <div
                        className="navbar-modal"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        onMouseEnter={() => setIsNav(2)}
                        onMouseLeave={() => setIsNav(0)}
                      >
                        <ul className="lst">
                          <li
                            className="lst-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/studyroom");
                              setIsNav(0);
                            }}
                          >
                            스터디룸
                          </li>
                        </ul>
                      </div>
                    ) : null}
                  </li>
                </div>
                <div className="parent-container">
                  <li
                    className="navbar-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/community/main");
                      setIsNav(0);
                      dispatch(setQnaCategory(null));
                      dispatch(setContentCategory(null));
                    }}
                    onMouseEnter={() => setIsNav(3)}
                    onMouseLeave={() => setIsNav(0)}
                  >
                    커뮤니티
                    {isNav === 3 ? (
                      <div
                        className="navbar-modal"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <ul className="lst">
                          <li
                            className="lst-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/community/it");
                              setIsNav(0);
                            }}
                          >
                            IT뉴스
                          </li>
                          <li
                            className="lst-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/community/qna/main");
                              setIsNav(0);
                              dispatch(setQnaCategory(null));
                            }}
                          >
                            QnA
                          </li>
                          <li
                            className="lst-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/community/content");
                              dispatch(setContentCategory(null));
                              setIsNav(0);
                            }}
                          >
                            학습콘텐츠
                          </li>
                        </ul>
                      </div>
                    ) : null}
                  </li>
                </div>
                <div className="parent-container">
                  <li
                    className="navbar-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/mentoring/main");
                      setIsNav(0);
                    }}
                    onMouseEnter={() => setIsNav(4)}
                    onMouseLeave={() => setIsNav(0)}
                  >
                    멘토링
                    {isNav === 4 ? (
                      <div
                        className="navbar-modal"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <ul className="lst">
                          <li
                            className="lst-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/mentoring/main");
                              setIsNav(0);
                            }}
                          >
                            멘토링
                          </li>
                          <li
                            className="lst-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/mentoring/create");
                              setIsNav(0);
                            }}
                          >
                            포트폴리오 작성
                          </li>
                        </ul>
                      </div>
                    ) : null}
                  </li>
                </div>
              </ul>
              <Form
                className="d-flex"
                style={{
                  width: "280px",
                  height: "40px",
                  "margin-left": "80px",
                }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  🔍{" "}
                </div>
              </Form>
              {user.name === null ? (
                <div className="mem-area">
                  <div
                    className="mem-btn"
                    style={{ width: "70px" }}
                    onClick={() => navigate("./member/login")}
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
                    onClick={() => navigate("./member/join")}
                  >
                    회원가입
                  </div>
                </div>
              ) : (
                <div className="mem-area">
                  <div className="parent-container">
                    <div
                      className="mem-btn"
                      style={{ width: "70px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsModal(!isModal);
                      }}
                    >
                      알림함
                      {
                        // 조건 추가 필요
                        <>
                          <div className="notice_new">N</div>
                        </>
                      }
                      {!isModal ? null : (
                        <>
                          <div
                            className="drop-down"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <div className="item">
                              <h5>{"댓글이 달렸습니다."}</h5>
                              <h6>
                                {
                                  "저 같이 하고싶어요! 날짜랑 시간은 어떻게 될까요? 궁금해용궁금해"
                                }
                              </h6>
                            </div>
                            <div className="item">
                              <h5>{"댓글이 달렸습니다."}</h5>
                              <h6>
                                {
                                  "저 같이 하고싶어요! 날짜랑 시간은 어떻게 될까요? 궁금해용궁금해"
                                }
                              </h6>
                            </div>
                            <div className="item">
                              <h5>{"댓글이 달렸습니다."}</h5>
                              <h6>
                                {
                                  "저 같이 하고싶어요! 날짜랑 시간은 어떻게 될까요? 궁금해용궁금해"
                                }
                              </h6>
                            </div>
                            <div className="item">
                              <h5>{"댓글이 달렸습니다."}</h5>
                              <h6>
                                {
                                  "저 같이 하고싶어요! 날짜랑 시간은 어떻게 될까요? 궁금해용궁금해"
                                }
                              </h6>
                            </div>
                            <div className="item">
                              <h5>{"댓글이 달렸습니다."}</h5>
                              <h6>
                                {
                                  "저 같이 하고싶어요! 날짜랑 시간은 어떻게 될까요? 궁금해용궁금해"
                                }
                              </h6>
                            </div>
                            <div className="item">
                              <h5>{"댓글이 달렸습니다."}</h5>
                              <h6>
                                {
                                  "저 같이 하고싶어요! 날짜랑 시간은 어떻게 될까요? 궁금해용궁금해"
                                }
                              </h6>
                            </div>
                            <div className="item">
                              <h5>{"댓글이 달렸습니다."}</h5>
                              <h6>
                                {
                                  "저 같이 하고싶어요! 날짜랑 시간은 어떻게 될까요? 궁금해용궁금해"
                                }
                              </h6>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
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
        )}
        <Routes>
          <Route path="/" element={<PwithMain />} />
          <Route path="/study" element={<StudyMain />}>
            <Route path="main" element={<StudyBoard />} />
            <Route path=":id" element={<StudyPost />} />
          </Route>
          <Route path="/study/create" element={<StudyCreate />} />
          <Route path="/studyroom" element={<RoomMain />} />
          <Route path="/studyroom/create" element={<RoomCreate />} />
          <Route path="/studyroom/:id" element={<RoomDetail />} />
          <Route path="/studyroom/live/:id" element={<LiveRoom />} />
          <Route path="/mentoringroom/:id" element={<MentoringRoomDetail />} />
          <Route path="/mentoring-room/:id/pay/success" element={<MentoringRoomPaySuccess />} />
          <Route path="/community" element={<CommunityMain />}>
            <Route path="main" element={<CommunityBoard />} />
            <Route path="it" element={<CommunityIT />} />
          </Route>
          <Route path="/community/content" element={<CommunityContent />} />
          <Route path="/community/qna/main" element={<CommunityQna />} />
          <Route path="/community/qna/create" element={<QnaCreate />} />
          <Route path="/community/qna/:id" element={<QnaPost />} />
          <Route path="/mentoring/main" element={<MentoringMain />} />
          <Route path="/mentoring/create" element={<MentoringCreate />} />
          <Route path="/mentoring/:myPortfolio" element={<PortfolioManage />} />
          <Route path="member/login" element={<Login />} />
          <Route path="member/join" element={<Join />} />
          <Route path="member/id" element={<HelpId />} />
          <Route path="member/password" element={<HelpPw />} />
          <Route path="member/password/*" element={<ResetPw />} />
          <Route path="/mypage" element={<Mypage />}>
            <Route path="account/changepw" element={<PwChange />} />
            <Route path="account/changename" element={<NameChange />} />
            <Route path="account" element={<Account />} />
            <Route path="writinglist" element={<WritingList />} />
            <Route path="commentlist" element={<CommentList />} />
            <Route path="chat" element={<Chat />} />
            <Route path="withdraw" element={<Withdraw />} />
          </Route>
          <Route path="/oauth/callback/naver" element={<Auth />} />
          <Route path="/oauth/callback/google" element={<Auth />} />
          <Route path="/oauth/callback/kakao" element={<Auth />} />
          <Route path="/member/login/auth" element={<AuthJoin/>} />
          <Route
            path="*"
            element={
              <div className="img-error">
                <img src="/error_404.png"></img>
                <div>잘못된 주소입니다.</div>
              </div>
            }
          />
        </Routes>
      </div>
      {!isStudyRoomPath && (
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
      )}
    </WebSocketProvider>
  );
}
export default App;
