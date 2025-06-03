<<<<<<< HEAD
import React from "react";
=======
import React, { useEffect } from "react";
>>>>>>> gh-pages
import { Routes, Route } from "react-router-dom";
import { publicRoutes, authRoutes, adminRoutes, userRoutes } from "./routes";

import MainLayout from "../layout/MainLayout";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";
import PublicRoute from "../layout/PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
<<<<<<< HEAD
export default function App() {
=======

export default function App() {

>>>>>>> gh-pages
  return (
    <Routes>
      {/* Public routes */}
      {publicRoutes.map(({ path, element: Element }) => (
        <Route
          key={path}
          path={path}
          element={
            <PublicRoute>
              <Element />
            </PublicRoute>
          }
        />
      ))}

      {/* Protected routes wrapped with MainLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Auth routes */}
        {authRoutes.map(({ path, element: Element }) => (
          <Route
            key={path}
            index={path === "/"}
            path={path === "/" ? undefined : path.replace("/", "")}
            element={<Element />}
          />
        ))}

        {/* Admin routes */}
        {adminRoutes.map(({ path, element: Element, allowedRoles }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute allowedRoles={allowedRoles}>
                <Element />
              </ProtectedRoute>
            }
          />
        ))}

        {/* User routes */}
        {userRoutes.map(({ path, element: Element, allowedRoles }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute allowedRoles={allowedRoles}>
                <Element />
              </ProtectedRoute>
            }
          />
        ))}
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
