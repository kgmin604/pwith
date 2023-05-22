import axios from "axios";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function Mypage(){
    let navigate = useNavigate();
    return(
        <>
        <div className="mypage-wrap">
            <form method='POST'>
                <ul className="mypageList">
                    <li className="mypageList-btn" onClick={()=>navigate('./account')}>회원정보 관리</li>
                    <li className="mypageList-btn" onClick={()=>navigate('./writinglist')}>내 글 목록</li>
                    <li className="mypageList-btn" onClick={()=>navigate('./chat')}>쪽지함</li>
                </ul>
                <div className="mypage-area"> 
                    <Outlet></Outlet>
                </div>
            </form>
        </div>
        
        </>
    );
}

export default Mypage;