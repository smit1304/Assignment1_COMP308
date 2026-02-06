import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Games from "./pages/Games";
import Library from "./pages/Library";
import GameDetails from "./pages/GameDetails";

export default function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/games" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public browsing */}
        <Route path="/games" element={<Games />} />
        <Route path="/games/:id" element={<GameDetails />} />

        {/* Private library */}
        <Route element={<ProtectedRoute />}>
          <Route path="/library" element={<Library />} />
        </Route>

        <Route path="*" element={<p style={{ padding: 20 }}>404</p>} />
      </Routes>
    </div>
  );
}
