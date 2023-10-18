import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom'; // 쿼리 문자열까지
import { useDispatch } from "react-redux";
import { loginUser, clearUser } from "./../../store.js";
import { useEffect } from "react";

function MentoringRoomPaySuccess() {
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const currentPath = location.pathname;
    const regex = /\/mentoring-room\/\d+/;
    const result = currentPath.match(regex)[0];

    useEffect(() => {
        axios({
            method: "GET",
            url: "/",
        })
        .then(function (response) {
            alert("결제가 완료되었습니다.");
            navigate(result.replace(/-/g, ""));
        })
        .catch(function (error) {
            console.log(error);
        });
    }, []);
    
    return(
      <>
      <div className="modal-wrap"></div>
      </>
    );
}

export { MentoringRoomPaySuccess }