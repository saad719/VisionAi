import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function StartScreen() {
  const navigate = useNavigate();

  return (
    <div className="start-screen">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <button className="sidebar-button" onClick={() => navigate("/main")}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/oda0auxt2r-13%3A374?alt=media&token=3c90f807-953c-4370-bbe2-35f4640197d9"
            alt="Not Found"
            className="plus"
          />
          <span> New Chat</span>
        </button>
        <hr className="divider" />
        <button className="sidebar-button">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/oda0auxt2r-104%3A64?alt=media&token=478b81a3-1683-4ce3-b80a-754786bef7b3"
            alt="Not Found"
            className="delete"
          />
          <span> Clear Conversations</span>
        </button>
        <button className="sidebar-button" onClick={() => navigate("/")}>
          <img
             src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/oda0auxt2r-104%3A46?alt=media&token=8304a27b-2f46-4b1d-b3e5-b1573ea9a266"
             alt="Not Found"
             className="logout"
          />
          <span> Log Out</span>

        </button>
      </aside>

      {/* Main Content */}
      <main className="content">
        <section className="examples-section">
          <h2>Examples</h2>
          <div className="example-box">
            <p>“Show instances of theft near entrance”</p>
          </div>
          <div className="example-box">
            <p>“Detect suspicious activities in a parking lot”</p>
          </div>
        </section>

        <section className="capabilities-section">
          <h2>Capabilities</h2>
          <ul>
            <li>Analyzes video feeds in real-time</li>
            <li>Customizable alerts for specific scenarios</li>
          </ul>
        </section>

        <section className="limitations-section">
          <h2>Limitations</h2>
          <ul>
            <li>May misinterpret complex scenarios</li>
            <li>Depends on quality of input feeds</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
