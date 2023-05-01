import axios from "axios";
import { useState } from "react";

function Mypage(){
    /* 1: 개인정보 관리 2:내 글 목록 3: 채팅창 4: 멘토등록 */
    let [categoryType,setCategoryType] = useState(1);

    return(
        <>
        <div className="mypage-wrap">
            <ul className="mypageList">
                <li className="mypageList-btn" onClick={()=>setCategoryType(1)}>개인정보 관리</li>
                <li className="mypageList-btn" onClick={()=>setCategoryType(2)}>내 글 목록</li>
                <li className="mypageList-btn" onClick={()=>setCategoryType(3)}>채팅창</li>
                <li className="mypageList-btn" onClick={()=>setCategoryType(4)}>멘토 신청</li>
            </ul>
            <div className="mypage-area"> {categoryType} </div>
        </div>
        
        </>
    );
}

export default Mypage;