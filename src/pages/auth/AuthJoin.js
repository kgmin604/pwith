import "./Auth.css";
import "../../App.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser, clearUser } from "./../../store.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function AuthJoin() {
    const dispatch = useDispatch();
    let navigate = useNavigate();

    let user = useSelector((state) => state.user);

    let [userinput, setUserinput] = useState({
        'joinId': '',
        'joinName' : ''
    });
    let [msg, setMsg] = useState({
        'joinId': '',
        'joinName' : ''
    });
    let [is, setIs] = useState(false);

    function updateInfo(e){
        if(!is) return;

        e.stopPropagation();
        console.log("업데이트 요청");

        axios({
            method: "POST",
            url: "/member/login/auth",
            data:{
                id: user.id,
                memId: userinput.joinId,
                nickname: userinput.joinName
            }
        })
        .then(function(response){
            if (response.data.status === 200) {
                dispatch(
                    loginUser({
                      id: response.data.data.id,
                      name: response.data.data.nickname,
                      isSocial: response.data.data.isSocial,
                    })
                );
                alert("회원가입이 완료되었습니다.");
                navigate("/");
            }
        })
        .catch(function(error){
            if(error.response.data.status===409){
                alert("중복된 아이디입니다.");
            }
            if(error.response.data.status===400){
                alert("중복된 닉네임입니다.");
            }
        })
    }

    function inputChange(e){
        e.stopPropagation();

        let copyUserinput = {...userinput};
        copyUserinput[e.target.id] = e.target.value;
        setUserinput(copyUserinput);

        let copyMsg = {...msg};

        if(e.target.id === 'joinId'){
            const idRE = /^[A-Za-z0-9]{4,15}$/; // 4-15자리

            if(!idRE.test(copyUserinput['joinId'])){
                copyMsg['joinId'] = 'ID 조건을 만족하지 않습니다.';
                setMsg(copyMsg);
                setIs(false);
            }
            else{
                copyMsg['joinId'] = '';
                setMsg(copyMsg);
                setIs(true);
            }
        }
    }

    return(
        <>
        <div style={{'height':'430px'}} className='round-box'>
          <div style={{'marginBottom':'40px'}} className = "top-message">소셜 회원가입</div>
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
  
            <div className="box-design2 mybtn" onClick={ (e)=>updateInfo(e) }>회원가입</div>
            
          </form>
        </div>
      </>
    );
}


export default AuthJoin;