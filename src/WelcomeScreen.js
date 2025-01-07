import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <img
        src="https://via.placeholder.com/100"
        alt="VisionAI Logo"
        className="logo"
      />
      <h1>Welcome to VisionAI</h1>
      <p>Log in with your account to continue</p>
      <button onClick={() => navigate("/login")}>Log In</button>
      <button onClick={() => navigate("/signup")}>Sign Up</button>
    </div>
  );
}
