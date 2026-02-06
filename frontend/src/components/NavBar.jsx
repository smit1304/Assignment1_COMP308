import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const nav = useNavigate();
  const { user, logout } = useAuth();

  const onLogout = async () => {
    await logout();
    nav("/login");
  };

  return (
    <div style={{ padding: 12, borderBottom: "1px solid #ddd", display: "flex", gap: 12 }}>
      <Link to="/games">All Games</Link>
      <Link to="/library">My Library</Link>
      <div style={{ flex: 1 }} />
      {user ? (
        <>
          <span style={{ opacity: 0.8 }}>Hi, {user.username || "user"}</span>
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </div>
  );
}
