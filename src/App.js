import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./WelcomeScreen";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MainUi from "./components/MainUi";
import StartScreens from "./components/StartScreens";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main" element={<MainUi />} />
        <Route path="/start" element={<StartScreens />} />
      </Routes>
    </Router>
  );
}

export default App;
