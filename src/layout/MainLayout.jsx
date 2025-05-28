import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sideBar/SideBar";

export default function MainLayout() {
  return (
    <div>
      <Sidebar />
      <Outlet />
    </div>
  );
}
