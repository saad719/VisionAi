import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Correctly import App component
import "./styles.css"; // Ensure the styles.css exists and has correct paths

const root = ReactDOM.createRoot(document.getElementById("root")); // Ensure the root id matches index.html

root.render(
  <React.StrictMode>
    <App /> {/* Render App for proper routing */}
  </React.StrictMode>
);
