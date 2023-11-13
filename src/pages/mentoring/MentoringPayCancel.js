import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const MentoringPayCancel = () => {
	const  navigate = useNavigate();

    useEffect(() => {
        alert("결제가 취소되었습니다.");
		navigate("/mentoring/main")
    }, []);
    
    return(
      <>
        <div className="modal-wrap"></div>
      </>
    );
}

export default MentoringPayCancel