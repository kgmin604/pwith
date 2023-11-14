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
    
    useEffect(()=>{
        axios({
            method: "GET",
            url: `${currentPathWithQuery}`
        })
        .then(function(response){
            if(response.data.status===200){
              dispatch(
                loginUser({
                  id: response.data.data.memId,
                  name: response.data.data.nickname,
                  isSocial: response.data.data.isSocial,
                  image:response.data.data.image
                })
              );

              if(response.data.data.nickname === null){
                navigate("/member/login/auth"); // 회원가입 페이지로
              }
              else{
                navigate("/"); // 로그인 페이지로
              }
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
            if(error.response.data.status===401){
              alert("인증에 실패했습니다. 다시 시도해주세요.");
              navigate("/");
            }
            if(error.response.data.status===404){
              alert("제공하지 않는 도메인입니다.");
              navigate("/");
            }
        })
    },[]);
    
    return(
      <>
      <div className="modal-wrap"></div>
      </>
    );
}

export default Auth;