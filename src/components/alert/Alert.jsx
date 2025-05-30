import React from "react";
import "./alert.css";
export default function Alert({ color, zIndex }) {
  return (
    <div className={`alert ${color} ${zIndex}`}>
      <p>
        {color == "rejected"
          ? "Invalid username or password. Please try again."
          : "Welcome back! You are successfully logged in."}
      </p>
    </div>
  );
}
