import { io } from "socket.io-client";

const socket = io("https://thorough-surprise-production.up.railway.app/", {
  autoConnect: false, // ما يتصل أوتوماتيكي
    transports: ['websocket', 'polling'], // ممكن تضيفي هذي عشان تزيد الثبات

});

export default socket;
