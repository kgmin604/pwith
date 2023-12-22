// const socket = io(); // 자동으로 backend의 socket.io와 연결

// const msgForm = document.querySelector("form");
// const msgList = document.querySelector("ul");
// const joinCnt = document.querySelector("h3");

// const roomId = 123; // TODO dummy (URL에서 추출)

// // msgList.onload = enterRoom;
// window.onload = enterRoom; // TODO http API 코드 구현 후 위로 변경하기

// // 해당 URL(스터디룸 준비 페이지) 로딩과 동시에 http API 요청 + enterRoom() 호출
// // 채팅 정보는 http API 요청을 통해서 불러온다
// function enterRoom() {
//   console.log("ENTER ROOM");
//   socket.emit("enter", roomId, (newCount) => {
//     joinCnt.innerText = `참여자수: ${newCount}`;
//     msgForm.addEventListener("submit", handleMessageSubmit);
//   });
// }

// // '나가기' 버튼 클릭 시
// function leaveRoom() {
//   socket.emit("leave", roomId, () => {
//     // TODO 이전 페이지로 redirect
//   });
// }

// function handleMessageSubmit(event) {
//   event.preventDefault();
//   const input = msgForm.querySelector("input");
//   const value = input.value;
//   socket.emit("sendTo", value, roomId, (curDate) => {
//     addMessage(`You: ${value} (${curDate})`);
//   });
//   input.value = "";
// }

// function addMessage(message) {
//   const msg = document.createElement("li");
//   msg.innerText = message;
//   msgList.appendChild(msg);
// }

// socket.on("sendFrom", addMessage);

// socket.on("in", (user, newCount) => {
//   joinCnt.innerText = `참여자수: ${newCount}`;
//   addMessage(`[${user}]님이 입장하였습니다.`);
// });

// socket.on("out", (user, newCount) => {
//   joinCnt.innerText = `참여자수: ${newCount}`;
//   addMessage(`[${user}]님이 퇴장하였습니다.`);
// });

// // socket.on("room_change", (rooms) => {
// //   const roomList = welcome.querySelector("ul");
// //   roomList.innerHTML = "";
// //   if (rooms.length === 0) {
// //     return;
// //   }
// //   rooms.forEach((room) => {
// //     const li = document.createElement("li");
// //     li.innerText = room;
// //     roomList.append(li);
// //   });
// // });
