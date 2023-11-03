// import mongoose from "mongoose";

// const MONGO_SERVER =
//   "mongodb+srv://pwith:pwith1234@cluster0.ezfau5x.mongodb.net/";

// const db = () => {
//   function connect() {
//     mongoose.connect(MONGO_SERVER, { dbName: "pwith_db" });
//   }
//   connect();
//   const conn = mongoose.connection;
//   conn.once("open", () => {
//     console.log("Connected to mongoDB");
//   });
//   conn.on("disconnected", connect);
//   conn.on("error", console.log);
// };

// export default db;
