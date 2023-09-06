import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true }, // nickname
    content: { type: String, required: true },
    createdAt: { type: Date, required: true },
    roomId: { type: Number, required: true }, // 객체로 해도 될 듯
  },
  { versionKey: false, collection: "studyroom_chat" }
);

const Chat = mongoose.model("chat", chatSchema);

export default Chat;
