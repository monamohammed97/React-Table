import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside style={{ width: "200px", backgroundColor: "#eee", padding: 20 }}>
      <h3>Welcome {user?.userName}</h3>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <NavLink
              to="/"
              end
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
              })}
            >
              Home
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
              Weather
            </NavLink>
          </li>

          {user?.role === "admin" && (
            <li>
              <NavLink
                to="/admin/chart"
                style={({ isActive }) => ({
                  fontWeight: isActive ? "bold" : "normal",
                })}
              >
                Admin Chart
              </NavLink>
            </li>
          )}

          {user?.role === "user" && (
            <li>
              <NavLink
                to="/user/profileDetails"
                style={({ isActive }) => ({
                  fontWeight: isActive ? "bold" : "normal",
                })}
              >
                Profile Details
              </NavLink>
            </li>
          )}
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
