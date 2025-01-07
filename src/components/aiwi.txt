import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function StartScreens() {
  const navigate = useNavigate();

  return (
    <div className="start-screens clip-contents">
      <div className="group-187">
        <div className="left-sidebar">
          <button className="new-chat-button" onClick={() => navigate("/main")}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/oda0auxt2r-13%3A374?alt=media&token=3c90f807-953c-4370-bbe2-35f4640197d9"
              alt="Not Found"
              className="plus"
            />
            <p className="new-chat">New chat</p>
          </button>
          <div className="line" />
          <div className="clear-conversations-1">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/oda0auxt2r-104%3A64?alt=media&token=478b81a3-1683-4ce3-b80a-754786bef7b3"
              alt="Not Found"
              className="delete"
            />
            <p className="clear-conversations">Clear conversations</p>
          </div>
          <button className="logout-1" onClick={() => navigate("/")}>
            <p className="log-out">Log out</p>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/oda0auxt2r-104%3A46?alt=media&token=8304a27b-2f46-4b1d-b3e5-b1573ea9a266"
              alt="Not Found"
              className="logout"
            />
          </button>
        </div>
        <div className="content">
          <div className="group-318">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/oda0auxt2r-14%3A587?alt=media&token=48963f01-1fb0-471d-ad53-fd1813bd95e1"
              alt="Not Found"
              className="contrast-1"
            />
            <p className="examples">Examples</p>
          </div>
          <div className="group-258">
            <p className="capabilities">Capabilities</p>
          </div>
          <div className="group-739">
            <div className="box-01">
              <p className="show-instances-of-theft">
                “Show instances of theft near entrance”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
