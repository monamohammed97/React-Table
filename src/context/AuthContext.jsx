import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userName, password) => {
    if (userName === "admin" && password === "123") {
      const loggedAdmin = { userName, role: "admin" };
      localStorage.setItem("user", JSON.stringify(loggedAdmin));
      setUser({ userName, role: "admin" });
      return "admin";
    }
    if (userName === "user" && password === "123") {
      const loggedUser = { userName, role: "user" };
      localStorage.setItem("user", JSON.stringify(loggedUser));
      setUser({ userName, role: "user" });
      return "user";
    }
    return null;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAuthenticated = !!user;
  const role = user?.role || null;

  return (
    <AuthContext.Provider
      value={{ user, role, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
