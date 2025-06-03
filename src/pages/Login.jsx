import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Title from "../components/Title";
import loginImg from "../assets/login1.avif";
import Arrow from "../assets/Arrow";
import Eye from "../assets/Eye";
import EyeWithSlash from "../assets/EyeWithSlash";
import Alert from "../components/alert/Alert";
export default function Login() {
  const [userInfo, setUserInfo] = useState({ userName: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const isAnyFieldEmpty =
    !userInfo.userName.trim() || !userInfo.password.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userRole = login(userInfo.userName, userInfo.password);
    if (userRole == "admin" || userRole == "user") {
      navigate("/", { replace: true });
      localStorage.setItem("login", isError);
      setIsLoading(false);
    } else {
      setIsError(true);
      setIsLoading(false);
      setUserInfo({ userName: "", password: "" });
    }
    setTimeout(() => {
      setIsError(false);
    }, 2000);
  };

  return (
    <div className="form-container">
      <div className="form-content">
        <form onSubmit={handleSubmit}>
          <Title className={"text-center"}>Welcome Back!</Title>
          <p>Join our community and enjoy exclusive services.</p>
          <input
            type="text"
            placeholder="User Name"
            name="userName"
            value={userInfo.userName}
            onChange={handleChange}
          />
          <div className="p-relative">
            <input
              type={`${showPassword ? "text" : "password"}`}
              name="password"
              placeholder="Password"
              value={userInfo.password}
              onChange={handleChange}
            />
            {userInfo.password != "" ? (
              showPassword ? (
                <EyeWithSlash
                  onClick={() => {
                    setShowPassword(false);
                  }}
                />
              ) : (
                <Eye
                  onClick={() => {
                    setShowPassword(true);
                  }}
                />
              )
            ) : null}
          </div>

          <div className="flex-input mb-1">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me </label>
          </div>
          <button
            type="submit"
            className={`${isAnyFieldEmpty || isLoading ? "disabled" : ""}`}
          >
            Login
          </button>
          <NavLink className={"login-link"} to="/forgot-password">
            <span>Forgot Password?</span>
            <div className="box">
              <Arrow />
            </div>
          </NavLink>
          <NavLink className={"login-link"} to="/forgot-password">
            <span>Sign Up/Register</span>
            <div className="box">
              <Arrow />
            </div>
          </NavLink>
        </form>
        <div className="form-image">
          <img src={loginImg} alt="login" />
        </div>
      </div>
      {isError && <Alert color={"rejected"} />}
    </div>
  );
}
