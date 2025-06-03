import { useContext } from "react";
import Loader from "../components/loader/Loader";
import Title from "../components/Title";
import { UsersContext } from "../context/UsersContext";

export default function Users() {
  const { users, loading, addUser, updateUser, deleteUser } = useContext(UsersContext);

  return (
    <div>
      <Title>Real-Time Table</Title>
      {loading ? (
        <Loader />
      ) : (
        <>
          <button
            onClick={() =>
              addUser({ id: Date.now(), name: "new user", email: "new@example.com" })
            }
          >
            ➕
          </button>
          <table border="1" cellPadding="10" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>البريد</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>
                    <button
                      onClick={() =>
                        updateUser({ id: row.id, name: "updated", email: "updated@example.com" })
                      }
                    >
                      ✏️
                    </button>
                    <button onClick={() => deleteUser(row.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
