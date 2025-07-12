import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "./Components/NavBar";
import MainPage from "./Components/MainPage";
import Login from "./Components/Login";
import Register from "./Components/Register";
import AdminDashboard from "./Components/AdminDashboard";
import ScrollToTop from "./Components/ScrollToTop";

function App() {
  return (
    <Router>
      <div className="app">
        <NavBar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </AnimatePresence>
        <ScrollToTop />
      </div>
    </Router>
  );
}

export default App;
