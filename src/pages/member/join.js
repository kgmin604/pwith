import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { loginUser, clearUser } from "./../../store.js"
import kakaoLogo from "./../../assets/img/kakao_logo.png"
import naverLogo from "./../../assets/img/naver_logo.png"
import googleLogo from "./../../assets/img/google_logo.png"

function Join() {
  const dispatch = useDispatch();
  let navigate = useNavigate();

  let [userinput, setUserinput] = useState({
    'joinId': '',
    'joinPw': '',
    'joinPwChk' : '',
    'joinName' : '',
    'joinEmail' : '',
    'authNum':''
  });
  let [msg,setMsg] = useState({
    'joinId': '',
    'joinPw': '',
    'joinPwChk' : '',
    'joinName' : '',
    'joinEmail' : '',
    'authNum' : ''
  })
  let [is,setIs] = useState({
    'joinId': false,
    'joinPw': false,
    'joinPwChk' : false,
    'joinEmail' : false,
    'authNum' : false,
  })
  let [auth,setAuth] = useState(null);

  function inputChange(e){
    e.stopPropagation();

    let copyUserinput = {...userinput};
    copyUserinput[e.target.id] = e.target.value;
    setUserinput(copyUserinput);
    
    let copyMsg = {...msg};
    let copyIs = {...is};

    if(e.target.id === 'joinId'){
      const idRE = /^[A-Za-z0-9]{4,15}$/; // 4-15자리

      if(!idRE.test(copyUserinput['joinId'])){
        copyMsg['joinId'] = 'ID 조건을 만족하지 않습니다.';
        setMsg(copyMsg);
        copyIs['joinId'] = false;
        setIs(copyIs);
      }
      else{
        copyMsg['joinId'] = '';
        setMsg(copyMsg);
        copyIs['joinId'] = true;
        setIs(copyIs);
      }
    }

    if(e.target.id === 'joinPw'){
      const pwRE = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/; 
      // 하나 이상의 문자, 하나 이상의 숫자, 하나 이상의 특수문자, 8글자 이상
      if(!pwRE.test(copyUserinput['joinPw'])){
        copyMsg['joinPw'] = '하나 이상의 문자,숫자,특수문자를 포함';
        setMsg(copyMsg);
        copyIs['joinPw'] = false;
        setIs(copyIs);
      }
      else{
        copyMsg['joinPw'] = '';
        setMsg(copyMsg);
        copyIs['joinPw'] = true;
        setIs(copyIs);
      }
    }

    if(e.target.id === 'joinPwChk'){
      if(copyUserinput['joinPw']===copyUserinput['joinPwChk']){
        copyMsg['joinPwChk'] = '';
        setMsg(copyMsg);
        copyIs['joinPwChk'] = true;
        setIs(copyIs);
      }
      else{
        copyMsg['joinPwChk'] = '비밀번호가 일치하지 않습니다.';
        setMsg(copyMsg); 
        copyIs['joinPwChk'] = false;
        setIs(copyIs);
      }
    }
    if(e.target.id === 'joinEmail'){

      // 이메일 변경 시 재인증 필요
      copyIs['authNum'] = false;
      setIs(copyIs);
      copyMsg['authNum'] = '';
      setMsg(copyMsg);

      const emailRE = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      if(!emailRE.test(copyUserinput['joinEmail'])){
        copyMsg['joinEmail'] = '올바른 이메일 형식이 아닙니다.';
        setMsg(copyMsg);
        copyIs['joinEmail'] = false;
        setIs(copyIs);
      }
      else{
        copyMsg['joinEmail'] = '인증하기 버튼을 눌러 이메일 인증을 해주세요';
        setMsg(copyMsg);
        copyIs['joinEmail'] = true;
        setIs(copyIs);
      }
    }
  }

  function clickEmailBtn(e){
    e.stopPropagation();
    let copyMsg = {...msg};

    if(is['joinEmail']){
      axios({
        method: "POST",
        url: "/member/join/email",
        data: {
          email: `${userinput['joinEmail']}`
        },
      })
        .then(function (response) {
          if(response.data.status===200){
            setAuth(response.data.data.auth);
  
            copyMsg['joinEmail'] = '이메일로 전송된 인증번호를 확인해주세요.';
            setMsg(copyMsg);
          }
        })
        .catch(function (error) {
          console.log(error.data);

          if(error.response.data.status==400){
            alert('이미 등록된 이메일 주소입니다.');
          }
        });
    }
    else{
      if(userinput['joinEmail']===''){
        copyMsg['joinEmail'] = '이메일을 입력해주세요.';
      }
    }
  }

  function clickAuthBtn(e){
    let copyMsg = {...msg};
    let copyIs = {...is};
    e.stopPropagation();

    if(auth===null){
      copyMsg['authNum'] = '인증 버튼을 눌러주세요.';
      setMsg(copyMsg);
    }
    else{
      if(auth===userinput['authNum']){
        copyMsg['joinEmail'] = '';
        copyMsg['authNum'] = '인증이 완료되었습니다.';
        setMsg(copyMsg);
        copyIs['authNum'] = true;
        setIs(copyIs);
      }
      else{
        copyMsg['authNum'] = '잘못된 인증번호입니다.';
        setMsg(copyMsg);
      }
    }
  }

  function clickPostBtn(e){
    e.stopPropagation();
    if(!is['joinId']){
      alert('조건에 맞는 아이디를 입력해주세요.')
    }
    else if(!is['joinPw']){
      alert('조건에 맞는 비밀번호를 입력해주세요.')
    }
    else if(!is['joinPwChk']){
      alert('비밀번호 확인을 해주세요.')
    }
    else if(!is['joinEmail']){
      alert('형식에 맞는 이메일 주소를 입력해주세요.')
    }
    else if(!is['authNum']){
      alert('이메일 인증을 진행해주세요.')
    }
    else{
      requestJoin()
    }
  }

  function SocialLogin(name){
    axios({
      method: "GET",
      url: `/member/login/auth/${name}`
    })
      .then(function (response) {
        // 여기에서 id, 비밀번호 입력받기
        window.location.href = response.data.data.auth_url;
      })
      .catch(function (error) {
        
      });
  }

  function requestJoin() {
    axios({
      method: "POST",
      url: "/member/join",
      data: {
        id: `${userinput['joinId']}`,
        password: `${userinput['joinPw']}`,
        nickname: `${userinput['joinName']}`,
        email: `${userinput['joinEmail']}`,
      },
    })
      .then(function (response) {
        if(response.data.status===200){
          alert('회원 가입 완료!');
          navigate("/");
        }
      })
      .catch(function (error) {
        console.log(error);

        if(error.response.data.status==400){
          if(error.response.data.message=="중복된 아이디"){
            alert('이미 있는 아이디입니다.');
          }
          if(error.response.data.message=="중복된 닉네임"){
            alert('이미 있는 닉네임입니다.');
          }
        }
      });
  }


  return (
    <>
      <div style={{'height':'930px'}} className='round-box'>
        <div style={{'margin-bottom':'40px'}} className = "top-message">회원가입</div>
        <form method="POST">

          <div className="join-item">
            <span>아이디</span>
            <div className="join-input">
              <input
                id="joinId" 
                onChange={e=>inputChange(e)}
                placeholder="4-10글자"
                maxlength="10"
              ></input>
            </div>
            <div className="msgtext"> {msg['joinId']} </div>
          </div>

          <div className="join-item">
            <span>비밀번호</span>
            <div className="join-input">
              <input
                type='password' 
                id="joinPw" 
                placeholder="8글자 이상"
                onChange={e=>inputChange(e)}
                maxlength="300"
              ></input>
            </div>
            <div className="msgtext"> {msg['joinPw']} </div>
          </div>

          <div className="join-item">
            <span>비밀번호 확인</span>
            <div className="join-input">
              <input
                type='password' 
                id="joinPwChk" 
                onChange={e=>inputChange(e)}
                maxlength="300"
              ></input>
            </div>
            <div className="msgtext"> {msg['joinPwChk']} </div>
          </div>

          <div className="join-item">
            <span>닉네임</span>
            <div className="join-input">
              <input
                id="joinName" 
                onChange={e=>inputChange(e)}
                placeholder="최대 10글자"
                maxlength="10"
              ></input>
            </div>
            <div className="msgtext"> {msg['joinName']} </div>
          </div>

          <div className="join-item">
            <span>이메일</span>
            <div className="join-input">
              <input
                id="joinEmail" 
                onChange={e=>inputChange(e)}
                style={{'width':'240px'}}
                maxlength="50"
              ></input>
              <div className="auth-btn" onClick={(e)=>clickEmailBtn(e)}>
                인증
              </div>
            </div>
            <div className="msgtext"> {msg['joinEmail']} </div>
          </div>

          <div className="join-item">
            <span>이메일 인증번호</span>
            <div className="join-input">
              <input
                id='authNum'
                onChange={e=>inputChange(e)}
                style={{'width':'240px'}}
                maxlength="6"
              ></input>
              <div className="auth-btn" onClick={(e)=>clickAuthBtn(e)}>
                확인
              </div>
            </div>
            <div className="msgtext"> {msg['authNum']} </div>
          </div>

          <div className="box-design2 mybtn" onClick={ (e)=>clickPostBtn(e) }>회원가입</div>
          
        </form>

        <div>
          <hr style={{'width':'90%', 'margin':'30px auto'}}></hr>
          <span className="small-msg-center">소셜 계정으로 가입하기</span>
          <div className="social-logo-list">
            <img className="social-logo" src={kakaoLogo}></img>
            <img 
              className="social-logo"
              src={naverLogo}
              onClick={e=>{e.stopPropagation(); SocialLogin('naver');}}
            ></img>
            <img className="social-logo" src={googleLogo}></img>
          </div>
        </div>
      </div>
    </>
  );
}
export default Join;
