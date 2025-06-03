// UsersContext.jsx
import React, { createContext, useEffect, useState } from "react";
import socket from "../../socket";

export const UsersContext = createContext();

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleInitialData = (rows) => {
      setUsers(rows);
      setLoading(false);
      console.log("🚀 ~ handleInitialData ~ rows:", rows)
    };

    socket.on("initialData", handleInitialData);
    socket.on("rowAdded", (row) => setUsers((prev) => [...prev, row]));
    socket.on("rowUpdated", (updatedRow) =>
      setUsers((prev) =>
        prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
      )
    );
    socket.on("rowDeleted", (id) =>
      setUsers((prev) => prev.filter((row) => row.id !== id))
    );

    socket.emit("requestInitialData");

    return () => {
      socket.off("initialData", handleInitialData);
      socket.off("rowAdded");
      socket.off("rowUpdated");
      socket.off("rowDeleted");
    };
  }, []);

  // دوال تعديل البيانات ترسل للـ socket
  const addUser = (user) => socket.emit("addRow", user);
  const updateUser = (user) => socket.emit("updateRow", user);
  const deleteUser = (id) => socket.emit("deleteRow", id);

  return (
    <UsersContext.Provider
      value={{ users, loading, addUser, updateUser, deleteUser }}
    >
      {children}
    </UsersContext.Provider>
  );
}
