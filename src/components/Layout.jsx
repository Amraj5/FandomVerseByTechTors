import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import Chatbot from './Chatbot';

export default function Layout() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("fv_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");
  const handleLogout = () => {
    localStorage.removeItem("fv_user");
    setUser(null);
    // Force a small delay to ensure state updates before navigation
    setTimeout(() => navigate("/"), 0);
  };

  return (
    <>
      <Navbar
        user={user}
        onLoginClick={handleLogin}
        onSignupClick={handleSignup}
        onLogout={handleLogout}
        onChatbotClick={() => setIsChatbotOpen(true)}
      />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </>
  );
}