import axios from "axios";
import React, { useEffect, useState } from "react";

function Join() {
  // const [joinData, setJoinData] = useState(null);

  // function getData() { // GET 방식 test
  //   axios({
  //     method: "GET",
  //     url: "/join",
  //   })
  //     .then((response) => {
  //       const res = response.data;
  //       setJoinData({
  //         memberId: res.id,
  //         memberPw: res.pw,
  //         pwChk: res.pwChk,
  //         memberName: res.name,
  //         memberEmail: res.email,
  //       });
  //     })
  //     .catch((error) => {
  //       if (error.response) {
  //         console.log(error.response);
  //         console.log(error.response.status);
  //         console.log(error.response.headers);
  //       }
  //     });
  // }

  function postData() {
    let num1 = document.getElementById("memberId").value;
    let num2 = document.getElementById("memberPw").value;
    let num3 = document.getElementById("pwChk").value;
    let num4 = document.getElementById("memberName").value;
    let num5 = document.getElementById("memberEmail").value;
    // 이거 react에서 많이 쓰는 방식 맞니? 일단 기본 문법으로 써봤어. 더 좋은 코드 있으면 예쁘게 바꿔줘 ~! - 채영

    axios({
      method: "POST",
      url: "/join",
      data: {
        memberId: `${num1}`,
        memberPw: `${num2}`,
        pwChk: `${num3}`,
        memberName: `${num4}`,
        memberEmail: `${num5}`,
      },
    })
      .then(function a(response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    // 서버에 데이터를 전달하기 위해서는 axios를 사용해야 하고, form 태그 필요해서 추가
    <>
      <form method="POST">
        <input placeholder="아이디" id="memberId"></input>
        <br></br>
        <input placeholder="비밀번호" id="memberPw"></input>
        <br></br>
        <input placeholder="비밀번호 확인" id="pwChk"></input>
        <br></br>
        <input placeholder="이름" id="memberName"></input>
        <br></br>
        <input placeholder="이메일" id="memberEmail"></input>
        <br></br>
        {/* 닉네임 안 쓰기로 했어서 지웠어 */}
      </form>
      <button onClick={postData}>입력</button>
    </>
  );
}
export default Join;
