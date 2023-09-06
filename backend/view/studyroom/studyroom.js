import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import express from "express";
import Chat from "../../schema.js";
import db from "../../model/db_mongo.js";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});
instrument(wsServer, {
  auth: false,
});

db();

function saveDB(sender, content, date, roomId) {
  Chat.create({
    sender: sender,
    content: content,
    createdAt: date,
    roomId: roomId,
  });
}

function publicRooms() {
  // const sids = wsServer.sockets.adapter.sids;
  // const rooms = wsServer.sockets.adapter.rooms;
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;

  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

function formatDate(date) {
  const TIME_ZONE = 9 * 60 * 60 * 1000; // 9hr
  const result = new Date(date + TIME_ZONE);
  return result.toISOString().replace("T", " ").slice(0, -8);
}

wsServer.on("connection", (socket) => {
  // TODO socket["userId"] = 로그인 사용자의 ID(쿠키 추출) **
  // TODO socket["nickname"] = 로그인 사용자의 nickname(DB 접근)
  socket["userId"] = 1; // dummy
  socket["nickname"] = "나무늘보"; // dummy

  socket.on("enter", (roomId, done) => {
    socket.join(roomId);
    const newCount = countRoom(roomId);
    done(newCount); // 본인 count++
    socket.to(roomId).emit("in", socket.nickname, newCount); // 남 count++
    // wsServer.sockets.emit("room_change", publicRooms()); // send to all sockets
  });
  socket.on("sendTo", (message, roomId, done) => {
    const now = Date.now();
    const formattedNow = formatDate(now);

    saveDB(socket.nickname, message, now, roomId);
    socket
      .to(roomId)
      .emit("sendFrom", `${socket.nickname} : ${message} (${formattedNow})`);
    done(formattedNow);
  });
  socket.on("leave", (roomId, done) => {
    socket.to(roomId).emit("out", socket.nickname, countRoom(roomId) - 1);
    socket.leave(roomId);
    done();
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("out", socket.nickname, countRoom(room) - 1);
      socket.leave(room);
    });
  });
  //   socket.on("disconnect", () => {
  //     wsServer.sockets.emit("room_change", publicRooms());
  //   });
});

httpServer.listen(3000, handleListen);
