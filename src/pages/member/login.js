import "./member.css";
import "../../App.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, clearUser } from "./../../store.js";
import kakaoLogo from "./../../assets/img/kakao_logo.png";
import naverLogo from "./../../assets/img/naver_logo.png";
import googleLogo from "./../../assets/img/google_logo.png";

function Login() {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  let [userinput, setUserinput] = useState({
    memId: "",
    memPw: "",
  });


  // 소셜 로그인 처리 
  function SocialLogin(name) {
    axios({
      method: "GET",
      url: `/member/login/auth/${name}`,
    })
    .then(function (response) {
      console.log(response.data);
      window.location.href = response.data.data.auth_url;
      /*
      axios({
        method: "POST",
        url: `${response.data.data.auth_url}`
      })
      .then(function(response){
        console.log(response.data);
        if(response.data.status===200){
            console.log("소셜 로그인 데이터");
            console.log(response.data.data);
            dispatch(
              loginUser({
                id: response.data.data.id,
                name: response.data.data.nickname,
                isSocial: response.data.data.isSocial
              })
            );
            navigate("/");
        }
      })
      .catch(function(error){
        
        if(error.response.data.status===400){
          alert("유효하지 않은 페이지입니다.");
          navigate("/");
        }
        if(error.response.data.status===409){
          alert("이미 사용중인 이메일입니다.");
          navigate("/");
        }
        
      })
      */
    })
    .catch(function(error){
      console.log(error);
    })
  }
  
  function inputChange(e) {
    let copyUserinput = { ...userinput };
    copyUserinput[e.target.id] = e.target.value;
    setUserinput(copyUserinput);
  }

  function postLogin() {
    axios({
      method: "POST",
      url: "/member/login",
      data: {
        id: `${userinput["memId"]}`,
        password: `${userinput["memPw"]}`,
      },
    })
      .then(function (response) {
        if (response.data.status === 200) {
          dispatch(
            loginUser({
              id: response.data.data.id,
              name: response.data.data.nickname,
              isSocial: response.data.data.isSocial,
              image:response.data.data.image
            })
          );
          navigate("/");
        }
      })
      .catch(function (error) {
        if (error.response.data.status == 404) {
          alert("없는 아이디입니다.");
        } else if (error.response.data.status == 400) {
          alert("잘못된 비밀번호입니다.");
        }
      });
  }

  function checkLogin() {
    userinput["memId"] === "" || userinput["memPw"] === ""
      ? alert("아이디 또는 비밀번호를 입력해주세요.")
      : postLogin();
  }

  return (
    <>
      <div style={{ height: "510px" }} className="round-box">
        <div className="top-message">로그인</div>

        <form method="POST">
          <input
            style={{ "margin-top": "20px" }}
            className="box-design1"
            placeholder=" 아이디"
            id="memId"
            onChange={(e) => inputChange(e)}
          ></input>
          <input
            style={{ "margin-top": "20px" }}
            className="box-design1"
            placeholder=" 비밀번호"
            type="password"
            id="memPw"
            onChange={(e) => inputChange(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter") checkLogin();
            }}
          ></input>
          <div
            className="box-design2 mybtn"
            onClick={checkLogin}
            style={{ "margin-top": "30px" }}
          >
            로그인
          </div>
        </form>

        <div className="login-bottom">
          <span
            className="item"
            onClick={(e) => {
              e.stopPropagation();
              navigate("../member/join");
            }}
          >
            회원가입
          </span>
          <span className="partition">|</span>
          <span
            className="item"
            onClick={(e) => {
              e.stopPropagation();
              navigate("../member/id");
            }}
          >
            아이디 찾기
          </span>
          <span className="partition">|</span>
          <span
            className="item"
            onClick={(e) => {
              e.stopPropagation();
              navigate("../member/password");
            }}
          >
            비밀번호 찾기
          </span>
        </div>

        <hr style={{ width: "90%", margin: "15px auto" }}></hr>
        <span className="small-msg-center">소셜 계정으로 로그인하기</span>
        <div className="social-logo-list">
          <img className="social-logo" src={kakaoLogo} onClick={(e) => {
              e.stopPropagation();
              SocialLogin("kakao");
            }}></img>
          <img
            className="social-logo"
            src={naverLogo}
            onClick={(e) => {
              e.stopPropagation();
              SocialLogin("naver");
            }}
          ></img>
          <img className="social-logo" src={googleLogo} onClick={(e) => {
              e.stopPropagation();
              SocialLogin("google");
            }}></img>
        </div>
      </div>
    </>
  );
}

export default Login;
