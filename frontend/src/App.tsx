// frontend/src/App.tsx

import React from "react";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardAdmin from "./pages/DashboardAdmin";

import Header from "./components/Header";

import ProtectedRoute from "./routes/ProtectedRoute";

const App: React.FC = () => {
  return (
    <AuthProvider>
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/dashboardAdmin" element={<DashboardAdmin />}/>
          </Routes>
        </div>
    </AuthProvider>
  );
};

export default App;
