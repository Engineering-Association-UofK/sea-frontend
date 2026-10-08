import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/Layout/NavBar.jsx";
import Footer from "../components/Footer";
import FloatingBot from "../components/bot/FloatingBot.jsx";

const MainLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingBot />
    </div>
  );
};

export default MainLayout;
