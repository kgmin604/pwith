import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, clearUser } from "../../store.js";

function MentoringPaySuccess() {
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const currentPath = location.pathname;
    const currentPathWithQuery = location.pathname + location.search;

    // 리다이렉트용 정규식
    const regex = /\/mentoring\/(\d+)/;
    const match = currentPathWithQuery.match(regex);

    const mentoringRoomId = match[1];
    const finalPath = `/mentoringroom/${mentoringRoomId}`;

    useEffect(() => {
        axios({
            method: "GET",
            url: `${currentPathWithQuery}`,
        })
        .then(function (response) {
            alert("결제가 완료되었습니다.");
            navigate(`${finalPath}`);
        })
        .catch(function (error) {
            alert("에러가 발생했습니다.");
            console.log(error);
        });
    }, []);
    
    return(
      <>
        <div className="modal-wrap"></div>
      </>
    );
}

export default MentoringPaySuccess;