import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Portfolios from "./pages/Portfolios";
import PortfolioDetails from "./pages/PortfolioDetails";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AppLayout from "./components/AppLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/portfolios"
  element={
    <ProtectedRoute>
      <AppLayout>
        <Portfolios />
      </AppLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/portfolios/:id"
  element={
    <ProtectedRoute>
      <AppLayout>
        <PortfolioDetails />
      </AppLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin"
  element={
    <AdminRoute>
      <AppLayout>
        <AdminDashboard />
      </AppLayout>
    </AdminRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}