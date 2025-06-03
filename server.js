// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import cors from "cors";
// import axios from "axios";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "http://localhost:5173" },
// });

// let tableData = [];

// const fetchData = async () => {
//   try {
//     const res = await axios.get("https://jsonplaceholder.typicode.com/users");
//     tableData = res.data;
//     console.log("Data fetched:", tableData);
//   } catch (err) {
//     console.error(err);
//   }
// };

// const startServer = async () => {
//   await fetchData(); // تنتظر حتى تجيب البيانات
//   server.listen(3001, () => {
//     console.log("Server listening on port 3001");
//   });
// };

// startServer();

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);
//   // لما العميل يتصل، نبعت له البيانات فورًا

//   // استقبال طلب إعادة إرسال البيانات
//   socket.on("requestInitialData", () => {
//     socket.emit("initialData", tableData);
//   });
//   // استقبال أوامر التعديل على البيانات من العميل
//   socket.on("addRow", (newRow) => {
//     tableData.push(newRow);
//     io.emit("rowAdded", newRow);
//   });

//   socket.on("updateRow", (updatedRow) => {
//     tableData = tableData.map((row) =>
//       row.id === updatedRow.id ? updatedRow : row
//     );
//     io.emit("rowUpdated", updatedRow);
//   });

//   socket.on("deleteRow", (id) => {
//     tableData = tableData.filter((row) => row.id !== id);
//     io.emit("rowDeleted", id);
//   });
// });
