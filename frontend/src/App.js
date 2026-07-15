import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { PrivateRoute, RoleRoute } from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Temples from "./pages/Temples";
import TempleDetail from "./pages/TempleDetail";
import MyBookings from "./pages/MyBookings";
import Donations from "./pages/Donations";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAddTemple from "./pages/AdminAddTemple";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/temples" element={<Temples />} />
              <Route path="/temples/:id" element={<TempleDetail />} />

              <Route
                path="/my-bookings"
                element={
                  <PrivateRoute>
                    <MyBookings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/donations"
                element={
                  <PrivateRoute>
                    <Donations />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <RoleRoute roles={["ADMIN", "ORGANIZER"]}>
                    <AdminDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/add-temple"
                element={
                  <RoleRoute roles={["ADMIN", "ORGANIZER"]}>
                    <AdminAddTemple />
                  </RoleRoute>
                }
              />

              <Route
                path="*"
                element={
                  <div className="container py-5 text-center">
                    <h2>404 - Page Not Found</h2>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
