import React, { use, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css"; // Assuming you have a CSS file for styling
import Home from "../../assets/Home";
import WeatherIcon from "../../assets/WeatherIcon";
import SettingIcon from "../../assets/SettingIcon";
import ProfileI from "../../assets/ProfileI";
import Logout from "../../assets/Logout";
import ChartIcon from "../../assets/ChartIcon";
import Arrow from "../../assets/Arrow";
export default function Sidebar() {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside className={`${isCollapsed ? "collapsed" : ""} sidebar`}>
      <div
        className="arrow-side"
        onClick={() => {
          setIsCollapsed(!isCollapsed);
        }}
      >
        <Arrow />
      </div>
      <div>
        {!isCollapsed ? (
          <h3>Welcome {user?.userName} 👋</h3>
        ) : (
          <h3>👋 {user?.userName.charAt(0).toUpperCase()} </h3>
        )}
      </div>
      <nav>
        <ul className="side-menu" style={{ listStyle: "none", padding: 0 }}>
          <li>
            <NavLink
              to="/"
              end
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
              })}
            >
              <Home />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/weather"
              end
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
              })}
            >
              <WeatherIcon />
              <span>Weather</span>
            </NavLink>
          </li>

          {user?.role === "admin" && (
            <>
              <li>
                <NavLink
                  to="/admin/chart"
                  style={({ isActive }) => ({
                    fontWeight: isActive ? "bold" : "normal",
                  })}
                >
                  <ChartIcon />
                  <span>Chart</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/setting"
                  style={({ isActive }) => ({
                    fontWeight: isActive ? "bold" : "normal",
                  })}
                >
                  <SettingIcon />
                  <span>Settings</span>
                </NavLink>
              </li>
            </>
          )}

          {user?.role === "user" && (
            <li>
              <NavLink
                to="/user/profileDetails"
                style={({ isActive }) => ({
                  fontWeight: isActive ? "bold" : "normal",
                })}
              >
                <ProfileI />
                <span> Profile Details</span>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      <div className="logout">
        <button onClick={logout}>
          <span>Logout</span>
          <Logout />
        </button>
      </div>
    </aside>
  );
}
