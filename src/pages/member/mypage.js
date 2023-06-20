import axios from "axios";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function Mypage(){
    let navigate = useNavigate();
    let user = useSelector((state) => state.user);

    return(
        <>{
            user.id === null ?
            <div className="img-error">
                <img src='/error_abnormal.png'></img>
                <div>비정상적 접근입니다.</div>
            </div>
            :
            <div className="mypage-wrap">
                <ul className="mypageList">
                    <li className="mypageList-btn" onClick={()=>navigate('./account')}>회원정보 관리</li>
                    <li className="mypageList-btn" onClick={()=>navigate('./writinglist')}>내 글 목록</li>
                    <li className="mypageList-btn" onClick={()=>navigate('./chat')}>쪽지함</li>
                </ul>
                <div className="mypage-area"> 
                    <Outlet></Outlet>
                </div>
            </div>
        }</>
    );
}

export default Mypage;