import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload } from "react-icons/fa";
import "./mainuistyles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function MainUi() {
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [uploadedFilename, setUploadedFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const chatRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Handle video file upload
  const handleFileUpload = async () => {
    if (!videoFile) {
      setMessage("Please select a video file first.");
      return;
    }

    setLoading(true);
    setMessage("Uploading file...");
    setDownloadLink("");

    try {
      const formData = new FormData();
      formData.append("file", videoFile);

      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload file");

      const data = await response.json();
      if (data.error) {
        setMessage("Error: " + data.error);
      } else {
        setUploadedFilename(data.filename);
        setMessage("File uploaded successfully!");
        setChatMessages((prev) => [
          ...prev,
          { type: "file", content: videoFile.name, status: "Uploaded" },
        ]);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle video processing
  const handleProcessVideo = async () => {
    if (!uploadedFilename) {
      setMessage("No uploaded video found. Upload first, then process.");
      return;
    }
    if (!inputMessage.trim()) {
      setMessage("Please enter prompts to process (e.g., 'person,dog').");
      return;
    }

    setLoading(true);
    setMessage("Processing video, please wait...");
    setDownloadLink("");

    try {
      const promptsArray = inputMessage.split(",").map((p) => p.trim()).filter(Boolean);

      const response = await fetch("http://localhost:5000/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: uploadedFilename,
          prompts: promptsArray,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process video.");
      }

      const data = await response.json();
      if (data.error) {
        setMessage("Error: " + data.error);
      } else {
        setMessage("Video processed successfully!");
        setDownloadLink(data.download_url);

        // Add processed video download and frame details to the chat
        setChatMessages((prev) => [
          ...prev,
          {
            type: "processed",
            content: "Processed Video",
            downloadLink: data.download_url,
            frames: data.frames,
            timestamps: data.timestamps,
          },
        ]);
      }
    } catch (error) {
      console.error("Error processing video:", error);
      setMessage("Error processing video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Render chat messages
  const renderMessages = () =>
    chatMessages.map((msg, index) => (
      <div key={index} className={`chat-message ${msg.type}`}>
        {msg.type === "text" && <p>{msg.content}</p>}
        {msg.type === "file" && (
          <div>
            <p>{msg.content}</p>
            {msg.status && <p>Status: {msg.status}</p>}
          </div>
        )}
        {msg.type === "processed" && (
          <div>
            <p>{msg.content}</p>
            {msg.downloadLink && (
              <a href={msg.downloadLink} target="_blank" rel="noopener noreferrer">
                Download Video
              </a>
            )}
            {msg.frames?.length > 0 && (
              <div className="frames-container">
                <h4>Detected Frames:</h4>
                {msg.frames.map((frame, i) => (
                  <div key={i} className="frame-item">
                    <a href={frame} target="_blank" rel="noopener noreferrer">
                      <img src={frame} alt={`Frame ${i + 1}`} className="frame-thumbnail" />
                    </a>
                    <p>Timestamp: {msg.timestamps[i]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    ));

  return (
    <div className="start-screen">
      <aside className="sidebar">
        <button className="sidebar-button" onClick={() => navigate("/main")}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/oda0auxt2r-13%3A374?alt=media&token=3c90f807-953c-4370-bbe2-35f4640197d9"
            alt="New Chat"
            className="plus"
          />
          <span> New Chat</span>
        </button>
        <hr className="divider" />
        <button className="sidebar-button">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/oda0auxt2r-104%3A64?alt=media&token=478b81a3-1683-4ce3-b80a-754786bef7b3"
            alt="Clear Conversations"
            className="delete"
          />
          <span> Clear Conversations</span>
        </button>
        <button className="sidebar-button" onClick={() => navigate("/")}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/oda0auxt2r-104%3A46?alt=media&token=8304a27b-2f46-4b1d-b3e5-b1573ea9a266"
            alt="Log Out"
            className="logout"
          />
          <span> Log Out</span>
        </button>
      </aside>

      <main className="content">
        <div className="chat-container">
          <div className="chat-body" ref={chatRef}>
            {renderMessages()}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type prompts (e.g., 'person,dog')"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="chat-input"
            />
            <div className="send-icon" onClick={handleProcessVideo}>
              <i className="fas fa-paper-plane"></i>
            </div>
            <label htmlFor="fileInput" className="upload-icon">
              <FaUpload size={20} />
            </label>
            <input
              id="fileInput"
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              style={{ display: "none" }}
            />
            <button onClick={handleFileUpload} disabled={loading}>
              {loading ? "Uploading..." : "Upload Video"}
            </button>
          </div>
          {message && <p className="status-message">{message}</p>}
        </div>
      </main>
    </div>
  );
}
