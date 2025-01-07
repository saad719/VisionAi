import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import "../styles.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <img
        src="https://via.placeholder.com/100"
        alt="VisionAI Logo"
        className="logo"
      />
      <h1>Sign Up</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Register</button>
      <p>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
  );
}
