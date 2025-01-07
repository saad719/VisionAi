import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="sign">
      <div className="logo"></div>
      <h1>Welcome to VisionAI</h1>
      <p>Log in with your account to continue</p>
      <button onClick={() => navigate("/login")}>Log In</button>
      <button onClick={() => navigate("/signup")}>Sign Up</button>
    </div>
  );
}
