import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import LoginForm from './features/auth/LoginForm';
import RegisterForm from './features/auth/RegisterForm';
import GameList from './features/games/GameList';
import GameDetails from './features/games/GameDetails';
import AdminDashboard from './features/admin/AdminDashboard';
import './styles/App.css';
import './styles/Navbar.css';
import './styles/Forms.css';
import './styles/GameCard.css';
import './styles/SearchBar.css';
import './styles/Admin.css';
import './styles/GameDetails.css';

import ProtectedRoute from './components/ProtectedRoute';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" reverseOrder={false} />
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