import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.username || !form.password) return setErr("Please fill all fields.");
    if (form.password !== form.confirm) return setErr("Passwords do not match.");
    try {
      await register(form.username, form.password);
      nav("/games");
    } catch (e2) {
      setErr(e2.message || "Register failed");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 420 }}>
      <h1>Register</h1>
      {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          placeholder="Confirm Password"
          type="password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />
        <button type="submit">Create account</button>
      </form>

      <p style={{ marginTop: 12 }}>
        Have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
