import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, clearUser } from "../../store.js";

function MentoringPaySuccess() {
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const currentPathWithQuery = location.pathname + location.search;

    useEffect(() => {
        axios({
            method: "GET",
            url: `${currentPathWithQuery}`,
        })
        .then(function (response) {
            alert("결제가 완료되었습니다.");
            navigate('/studyroom');
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