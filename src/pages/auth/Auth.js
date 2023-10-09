import "./Auth.css";
import "../../App.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom'; // 쿼리 문자열까지
import { useDispatch } from "react-redux";
import { loginUser, clearUser } from "./../../store.js";
import { useEffect } from "react";

function Auth() {
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const location = useLocation();
    const currentPathWithQuery = location.pathname + location.search;

    let [userinput, setUserinput] = useState({
        'joinId': '',
        'joinName' : ''
    });
    let [msg, setMsg] = useState({
        'joinId': '',
        'joinName' : ''
    });
    let [is, setIs] = useState(false);

    
    useEffect(()=>{
        axios({
            method: "GET",
            url: `${currentPathWithQuery}`
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
    },[]);
    

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
                setIs(false);
            }
        }
    }

    return(
        <>
        {/*
        <div style={{'height':'430px'}} className='round-box'>
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
  
            <div className="box-design2 mybtn" onClick={ (e)=>e.stopPropagation() }>회원가입</div>
            
          </form>
        </div>
        */}
      </>
    );
}


export default Auth;