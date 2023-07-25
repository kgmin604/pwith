import './member.css';
import '../../App.css';
import axios from "axios";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import { useDispatch } from "react-redux"
import { loginUser, clearUser } from "./../../store.js"
import kakaoLogo from "./../../assets/img/kakao_logo.png"
import naverLogo from "./../../assets/img/naver_logo.png"
import googleLogo from "./../../assets/img/google_logo.png"

function Login(){
    
    let navigate = useNavigate();
    const dispatch = useDispatch();

    let [userinput, setUserinput] = useState({
      'memId': '',
      'memPw': '',
    });

    function inputChange(e){
      let copyUserinput = {...userinput};
      copyUserinput[e.target.id] = e.target.value;
      setUserinput(copyUserinput);
    }

    function postLogin() {
        axios({
          method: "POST",
          url: "/login",
          data: {
            memberId: `${userinput['memId']}`,
            memberPw: `${userinput['memPw']}`
          },
        })
          .then(function (response) {
            console.log(response);
            if(response.data.code===400){
              alert("아이디 또는 비밀번호를 잘못 입력했습니다.");
            }
            if(response.data.code===401){
              dispatch(
                loginUser({
                  id: response.data.id,
                  name: response.data.name,
                  email: response.data.email
                })
              );
              //localStorage.setItem("id", response.data.id);
              //localStorage.setItem("name", response.data.name);
              //localStorage.setItem("email", response.data.email);
              navigate("/");
              //window.location.href = "/";
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    
    function checkLogin(){
      userinput['memId']==="" || userinput['memPw'] === "" ? alert("아이디 또는 비밀번호를 입력해주세요."): postLogin();
    }
    return(
        <>
            <div style={{'height':'510px'}} className='round-box'>
                <div className="top-message">로그인</div>

                <form method='POST'>
                    <input 
                      style={{'margin-top':'20px'}} 
                      className="box-design1" 
                      placeholder=" 아이디" 
                      id="memId" 
                      onChange={e=>inputChange(e)}>
                    </input>
                    <input 
                      style={{'margin-top':'20px'}} 
                      className="box-design1" 
                      placeholder=" 비밀번호" 
                      type='password' 
                      id="memPw" 
                      onChange={e=>inputChange(e)}
                      onKeyDown={(e) => { if (e.key === "Enter") checkLogin(); }}
                    ></input>
                    <div className="box-design2 mybtn" onClick={checkLogin}>로그인</div>
                </form>

                <div style={{'width':'300px','height':'30px', 'margin':'0 auto','margin-top':'20px'}}>
                    <div 
                        className='mybtn'
                        onClick = {()=>navigate('../help')}
                        style={{'float':'right','margin':'5px','fontSize':'7px' }}
                        
                    >아이디 · 비밀번호 찾기</div>
                    <div style={{'float':'right','margin':'5px','fontSize':'8px'}}>|</div>
                    <div 
                        className='mybtn' 
                        onClick = {()=>navigate('../join')}
                        style={{'float':'right','margin':'5px','fontSize':'7px'}}
                    >회원가입</div>
                </div>
                
                <hr style={{'width':'90%', 'margin':'15px auto'}}></hr>
                <span className="small-msg-center">소셜 계정으로 로그인하기</span>
                <div className="social-logo-list">
                  <img className="social-logo" src={kakaoLogo}></img>
                  <img className="social-logo" src={naverLogo}></img>
                  <img className="social-logo" src={googleLogo}></img>
                </div>

            </div>
        </>
    );
}


export default Login;
