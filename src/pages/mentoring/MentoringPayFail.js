import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MentoringPayFail = () => {
	const  navigate = useNavigate();

    useEffect(() => {
        alert("결제에 실패했습니다.");
		navigate("/mentoring/main")
    }, []);
    
    return(
      <>
        <div className="modal-wrap"></div>
      </>
    );
}

export default MentoringPayFail