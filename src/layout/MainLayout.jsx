import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./main.css";
import Alert from "../components/alert/Alert";
import Loader from "../components/loader/Loader";
import Sidebar from "../components/sideBar/Sidebar";
export default function MainLayout() {
  const [loginSuccess, setLoginSuccess] = useState(
    !!localStorage.getItem("login")
  );
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    setTimeout(() => {
      setLoginSuccess(false);
      localStorage.removeItem("login");
    }, 3000);
  }, [loginSuccess]);
  return (
    <>
      <div className="main-layout">
        <Sidebar />
        <div className="container">
          <Outlet />
        </div>
      </div>
      {isLoading && (
        <div className="loader-box">
          <Loader />
        </div>
      )}
      {loginSuccess && <Alert color="accepted" zIndex="zIndex"/>}
    </>
  );
}
