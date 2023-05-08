import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { loginUser, clearUser } from "./../../store.js"

function Join() {

  let navigate = useNavigate();

  let [userinput, setUserinput] = useState({
    'joinId': '',
    'joinPw': '',
    'joinPwChk' : '',
    'joinName' : '',
    'joinEmail' : ''
  });
  let [msg,setMsg] = useState({
    'joinId': '',
    'joinPw': '',
    'joinPwChk' : '',
    'joinName' : '',
    'joinEmail' : ''
  })
  let [is,setIs] = useState({
    'joinId': false,
    'joinPw': true,
    'joinPwChk' : false,
    'joinName' : true,
    'joinEmail' : true
  })
  let [poseMsg,setPostMsg] = useState('');
  
  function inputChange(e){
    let copyUserinput = {...userinput};
    copyUserinput[e.target.id] = e.target.value;
    setUserinput(copyUserinput);
    //setTimeout(()=>{console.log(copyUserinput)},10)
    
    let copyMsg = {...msg};
    let copyIs = {...is};

    if(e.target.id === 'joinPw'){
      /*
      const pwRE = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/; // 하나 이상의 문자, 하나 이상의 숫자, 하나 이상의 특수문자, 8글자 이상
      if(!pwRE.test(copyUserinput['joinPw'])){
        copyMsg['joinPw'] = '비밀번호 조건을 만족하지 않습니다.';
        setMsg(copyMsg);
        copyIs['joinPw'] = false;
        setIs(copyIs);
      }
      else{
        copyMsg['joinPw'] = '조건 만족!';
        setMsg(copyMsg);
        copyIs['joinPw'] = true;
        setIs(copyIs);
      }
      */
    }
    if(e.target.id === 'joinPwChk'){
      if(copyUserinput['joinPw']===copyUserinput['joinPwChk']){
        copyMsg['joinPwChk'] = '비밀번호가 일치합니다.';
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
      /*
      const emailRE = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      if(!emailRE.test(copyUserinput['joinEmail'])){
        copyMsg['joinEmail'] = '올바른 이메일 형식이 아닙니다.';
        setMsg(copyMsg);
        copyIs['joinEmail'] = false;
        setIs(copyIs);
      }
      else{
        copyMsg['joinEmail'] = '올바른 이메일 형식입니다.';
        setMsg(copyMsg);
        copyIs['joinEmail'] = true;
        setIs(copyIs);
      }
      */
    }
  }

  function checkID(){
    // 아이디 중복 확인
    axios({
      method: "POST",
      url: "/join",
      data: {
        requestType: 'checkId', // 경민 추가
        memberId: `${userinput['joinId']}`
      },
    })
      .then(function (response) {
        let copyMsg = {...msg};
        let copyIs = {...is};
        if(response.data.code===1){ // 사용 가능
          copyMsg['joinId'] = '사용 가능한 아이디입니다.';
          setMsg(copyMsg);
          copyIs['joinId'] = true;
          setIs(copyIs);
        }
        else if(response.data.code===0) { // 사용 불가
          copyMsg['joinId'] = '이미 있는 아이디입니다.';
          setMsg(copyMsg);
          copyIs['joinId'] = false;
          setIs(copyIs);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function postData() {
    axios({
      method: "POST",
      url: "/join",
      data: {
        requestType: 'join', // 경민 추가
        memberId: `${userinput['joinId']}`,
        memberPw: `${userinput['joinPw']}`,
        pwChk: `${userinput['joinPwChk']}`,
        memberName: `${userinput['joinName']}`,
        memberEmail: `${userinput['joinEmail']}`,
      },
    })
      .then(function (response) {
        console.log(response);
        alert('회원 가입 완료!');
        navigate("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function isPost(){
    if(!is['joinId']){
      setPostMsg('아이디 중복 확인을 해주세요.');
    }
    else if(!is['joinPw']){
      setPostMsg('조건에 맞는 비밀번호를 입력해주세요.');
    }
    else if(!is['joinPwChk']){
      setPostMsg('비밀번호와 일치하지 않습니다.');
    }
    else if(!is['joinName']){
      setPostMsg('이름을 입력해주세요.');
    }
    else if(!is['joinEmail']){
      setPostMsg('형식에 맞는 이메일을 입력해주세요.');
    }
    else{
      setPostMsg('');
      postData();
    }
  }

  return (
    <>
      <div style={{'height':'730px'}} className='round-box'>
        <div style={{'margin-bottom':'40px'}} className = "top-message">회원가입</div>
        <form method="POST">
          <div className="jointext">
            <span>아이디</span>
            <span className="smallMsg mybtn" onClick={checkID}> 중복 확인</span>
          </div>
          <input className="box-design1" id="joinId" onChange={e=>inputChange(e)}></input>
          <div className="msgtext"> {msg['joinId']} </div>

          <div className="jointext">비밀번호</div>
          <input className="box-design1" type='password' id="joinPw" onChange={e=>inputChange(e)}></input>
          <div className="msgtext"> {msg['joinPw']} </div>

          <div className="jointext">비밀번호 확인</div>
          <input className="box-design1" type='password' id="joinPwChk" onChange={e=>inputChange(e)}></input>
          <div className="msgtext"> {msg['joinPwChk']} </div>

          <div className="jointext">이름</div>
          <input className="box-design1" id="joinName" onChange={e=>inputChange(e)}></input>
          <div className="msgtext"> {msg['joinName']} </div>

          <div className="jointext">이메일</div>
          <input className="box-design1" id="joinEmail" onChange={e=>inputChange(e)}></input>
          <div className="msgtext"> {msg['joinEmail']} </div>

          <div className="box-design2 mybtn" onClick={isPost}>회원가입</div>
          <div className="msgtext"> {poseMsg} </div>
        </form>
      </div>
    </>
  );
}
export default Join;
