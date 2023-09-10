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
        console.log(currentPathWithQuery);
        axios({
            method: "GET",
            url: `${currentPathWithQuery}`
        })
        .then(function(response){
            console.log(response.data);
            if(response.data.status===200){
                let accessToken = response.headers['authorization']; // 응답헤더에서 토큰 받기

                localStorage.setItem('Authorization', accessToken);

                dispatch(
                    loginUser({
                      id: response.data.data.id,
                      name: response.data.data.nickname,
                    })
                );
                /*
                axios.defaults.headers.common[
                    'Authorization'
                  ] = `${accessToken}`;
                */
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

    return(
        <></>
    );
}

export default Auth;