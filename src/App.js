// import logo from './logo.svg';
import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
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
import { setStudyCategory, setQnaCategory, setBookCategory, setLectureCategory } from "./store.js";

import PwithMain from "./pages/pwithmain/PwithMain.js";
import Search from "./pages/pwithmain/Search.js";
import StudyMain from "./pages/study/StudyMain.js";
import RoomMain from "./pages/studyroom/RoomMain.js";
import RoomCreate from "./pages/studyroom/RoomCreate.js";
import LiveRoom from "./pages/studyroom/LiveRoom";
import RoomDetail from "./pages/studyroom/RoomDetail.js";
import MentoringRoomDetail from "./pages/studyroom/MentoringRoomDetail.js";
import {
  MentoringRoomPaySuccess,
} from "./pages/studyroom/MentoringRoomPay.js";
import CommunityMain from "./pages/community/CommunityMain.js";
import MentoringMain from "./pages/mentoring/MentoringMain.js";
import MentoringCreate from "./pages/mentoring/MetoringCreate";

import MentoringPaySuccess from "./pages/mentoring/MentoringPaySuccess.js";

import Login from "./pages/member/login.js";
import Join from "./pages/member/join.js";
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
  Admin,
} from "./pages/member/mypageComp.js";
import { HelpId, HelpPw, ResetPw } from "./pages/member/help.js";
import { clearUser } from "./store.js";
import { setUnread } from "./store.js";
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
import MentoringPayCancel from "./pages/mentoring/MentoringPayCancel";
import MentoringPayFail from "./pages/mentoring/MentoringPayFail";

const alramType = ["새로운 스터디 신청입니다", "새로운 멘토링 신청입니다", "새로운 댓글이 달렸어요!", "새로운 댓글이 달렸어요!", "새로운 쪽지가 왔어요!", "멘토링이 삭제됐습니다."]
const alramMoveTo = ["/studyroom/", "/mentoring/", "/study/", "/community/qna/", "/mypage/chat", "/mentoring/"]

function App() {
  const navigate = useNavigate();
  const { user, unread } = useSelector((state) => state);
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();
  const [alarmList, setAlarmList] = useState([]);

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (user && !isLogin) {
      setIsLogin(true)
    }
  }, [user])
  const getAlramList = () => {
    dispatch(
      setUnread(false)
    );
    axios({
      method: "GET",
      url: "/alarm"
    })
      .then(function (response) {
        if (response.data.status === 200) {
          const data = response.data.data
          setAlarmList(data.alarmList)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //스터디룸에서는 네브바 숨기기
  const location = useLocation();
  const isStudyRoomPath =
    ((location.pathname.startsWith(`/studyroom/live`) || location.pathname.startsWith(`/mentoringroom/live`)) &&
      !location.pathname.includes("main") &&
      !location.pathname.includes("create"))


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
                  //navigate("/");
                  window.location.href = "/";
                }}
              ></div>
              <ul className="navbar-menu" style={{ "marginRight": "40px" }}>
                <div className="parent-container">
                  <li
                    className="navbar-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      //navigate("/study/main");
                      window.location.href = "/study/main";
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
                              window.location.href = "/study/main";
                              //navigate("/study/main");
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
                          window.location.href = "/studyroom";
                        }}
                        onMouseEnter={() => setIsNav(2)}
                        onMouseLeave={() => setIsNav(0)}
                      >
                        <ul className="lst">
                          <li
                            className="lst-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = "/studyroom";
                              // navigate("/studyroom");
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
                      //navigate("/community/main");
                      window.location.href = "/community/main";
                      setIsNav(0);
                      dispatch(setQnaCategory(null));
                      dispatch(setBookCategory({ firstCategory: null, secondCategory: null }));
                      dispatch(setLectureCategory({ firstCategory: null, secondCategory: null }));
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
                              //navigate("/community/it");
                              window.location.href = "/community/it";
                              setIsNav(0);
                            }}
                          >
                            IT뉴스
                          </li>
                          <li
                            className="lst-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              //navigate("/community/qna/main");
                              window.location.href = "/community/qna/main";
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
                              //navigate("/community/content");
                              window.location.href = "/community/content";
                              dispatch(setBookCategory({ firstCategory: null, secondCategory: null }));
                              dispatch(setLectureCategory({ firstCategory: null, secondCategory: null }));
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
                      //navigate("/mentoring/main");
                      window.location.href = "/mentoring/main";
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
                              //navigate("/mentoring/main");
                              window.location.href = "/mentoring/main";
                              setIsNav(0);
                            }}
                          >
                            멘토링
                          </li>
                          <li
                            className="lst-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              //navigate("/mentoring/create");
                              window.location.href = "/mentoring/create";
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
                  "marginLeft": "80px",
                }}
              >
                <Form.Control
                  type="search"
                  placeholder="검색"
                  className="me-2"
                  aria-label="Search"
                  onChange={e => {
                    e.stopPropagation();
                    setSearchText(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // 기본 동작을 막음
                    }
                  }}
                />
                <div
                  className="btn"
                  style={{
                    border: "solid 1px",
                    "borderColor": "#98AFCA",
                    "backgroundColor": "white",
                    height: "40px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/search?value=${searchText}`);
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
                      "backgroundColor": "#98afca",
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
                        if (!isModal) {
                          getAlramList()
                        }
                      }}
                    >
                      알림함
                      {unread === true && <div className="notice_new">N</div>}
                      {!isModal ? null : (
                        <>
                          <div
                            className="drop-down"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}>
                            {alarmList?.map((item, index) => {
                              return <div onClick={() => {
                                if (item.type === 5) {
                                  navigate(`${alramMoveTo[item.type - 1]}`)
                                  return
                                }
                                navigate(`${alramMoveTo[item.type - 1]}${item.contentId}`)
                              }} className={`alram-${index} item`}>
                                <h5>{alramType[item.type - 1]}</h5>
                                <h6>{item.content}</h6>
                              </div>
                            })}
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
                      "backgroundColor": "#98afca",
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
          <Route
            path="/search"
            element={<Search searchText={searchText} />}
          />
          <Route path="/study" element={<StudyMain />}>
            <Route path="main" element={<StudyBoard isLogin={isLogin} />} />
            <Route path=":id" element={<StudyPost />} />
          </Route>
          <Route path="/study/create" element={<StudyCreate />} />
          <Route path="/studyroom" element={<RoomMain />} />
          <Route path="/studyroom/create" element={<RoomCreate />} />
          <Route path="/studyroom/:id" element={<RoomDetail />} />
          <Route path="/studyroom/live/:id" element={<LiveRoom type={'study'} />} />
          <Route path="/mentoringroom/:id" element={<MentoringRoomDetail />} />
          <Route path="/mentoringroom/live/:id" element={<LiveRoom type={'mentoring'} />} />
          <Route path="/mentoring-room/:id/pay/success" element={<MentoringRoomPaySuccess />} />
          <Route path="/mentoring-room/:id/pay/fail" element={<MentoringPayFail />} />
          <Route path="/mentoring-room/:id/pay/cancel" element={<MentoringPayCancel />} />

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
          <Route path="/mentoring/:id/pay/success" element={<MentoringPaySuccess />} />
          <Route path="/mentoring/:id/pay/fail" element={<MentoringPayFail />} />
          <Route path="/mentoring/:id/pay/cancel" element={<MentoringPayCancel />} />
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
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route path="/oauth/callback/naver" element={<Auth />} />
          <Route path="/oauth/callback/google" element={<Auth />} />
          <Route path="/oauth/callback/kakao" element={<Auth />} />
          <Route path="/member/login/auth" element={<AuthJoin />} />
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
              "lineHeight": "80px",
              "fontSize": "small",
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
