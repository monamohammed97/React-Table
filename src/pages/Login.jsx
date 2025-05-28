import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // لو تستخدم Context

export default function Login() {
  const [userInfo, setUserInfo] = useState({ userName: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userRole = login(userInfo.userName, userInfo.password);
    if (userRole == "admin" || userRole == "user") {
      navigate("/", { replace: true });
    } else {
      setUserInfo({ userName: "", password: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="User Name"
        name="userName"
        value={userInfo.userName}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={userInfo.password}
        onChange={handleChange}
      />
      <button type="submit">Login</button>
    </form>
  );
}
