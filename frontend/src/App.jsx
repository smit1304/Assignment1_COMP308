import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import LoginForm from './features/auth/LoginForm';
import RegisterForm from './features/auth/RegisterForm';
import GameList from './features/games/GameList';
import GameDetails from './features/games/GameDetails';
import AdminDashboard from './features/admin/AdminDashboard';
import './styles/App.css'; // We'll update this

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    
    if (!user) return <Navigate to="/login" />;
    
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" />;
    }
    
    return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<GameList />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
            <Route path="games/:id" element={<GameDetails />} />
            
            {/* Protected Routes */}
            <Route path="collection" element={
                <ProtectedRoute>
                    <GameList view="collection" /> 
                </ProtectedRoute>
            } />
            
            <Route path="admin" element={
                <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;