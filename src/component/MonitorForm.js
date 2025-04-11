import React, { useState } from "react";
import axios from "axios";
import "./MonitorForm.css";

const MonitorForm = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [youtubeUserId, setYoutubeUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("No authorization token found. Please log in.");
      return;
    }

    if (!videoUrl || !youtubeUserId || !userEmail) {
      alert(
        "Please provide all necessary fields: video URL, YouTube User ID, and Email."
      );
      return;
    }

    try {
      const response = await axios.post(
        "/monitor",
        { videoUrl, youtubeUserId, userEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Monitoring started!");
      }
    } catch (err) {
      console.error("Error starting monitor:", err);
      if (err.response && err.response.status === 401) {
        alert("Unauthorized: Please log in again.");
      } else {
        alert("Error starting monitor. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="monitor-form">
      <h2>Start Monitoring</h2>
      <div>
        <label>Video URL:</label>
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter video URL"
        />
      </div>
      <div>
        <label>YouTube User ID:</label>
        <input
          type="text"
          value={youtubeUserId}
          onChange={(e) => setYoutubeUserId(e.target.value)}
          placeholder="Enter YouTube User ID"
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      <button type="submit">Start Monitoring</button>
    </form>
  );
};

export default MonitorForm;
