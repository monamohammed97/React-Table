import { io } from "socket.io-client";

const socket = io("https://6e5e301e-f5da-46b0-b30c-825fce9b8969-00-17z9v3fsimhm0.worf.replit.dev", {
  autoConnect: false, // ما يتصل أوتوماتيكي
    transports: ['websocket', 'polling'], // ممكن تضيفي هذي عشان تزيد الثبات

});

export default socket;
