import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./FormInput.css";

const FormInput = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoMetaData, setVideoMetaData] = useState(null);
  const navigate = useNavigate();

  const handleVideoUrlChange = (e) => {
    setVideoUrl(e.target.value);
  };

  useEffect(() => {
    if (videoUrl) {
      fetchVideoMetaData(videoUrl);
    }
  }, [videoUrl]);

  const fetchVideoMetaData = async (url) => {
    if (!url) return;

    try {
      const response = await API.post("/api/monitor/get-video-meta", {
        videoUrl: url,
      });
      setVideoMetaData(response.data);
    } catch (err) {
      console.error("Error fetching video metadata:", err);
      alert("Failed to fetch video metadata.");
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setVideoUrl(text);
    } catch (err) {
      console.error("Error accessing clipboard", err);
      alert("Failed to read from clipboard.");
    }
  };

  const handleAddToTrack = async () => {
    const userToken = localStorage.getItem("authToken");

    if (!userToken) {
      navigate("/login");
    } else {
      const userId = localStorage.getItem("userId");

      try {
        const response = await API.post("/api/user/add-video-to-track", {
          userId,
          videoUrl,
        });

        alert(response.data.message);
      } catch (err) {
        console.error("Error adding video to track:", err);
        alert("Failed to add video to tracking.");
      }
    }
  };

  return (
    <div className="form-container">
      <input
        type="text"
        placeholder="Paste YouTube video URL"
        value={videoUrl}
        onChange={handleVideoUrlChange}
      />
      <button onClick={handlePasteFromClipboard}>Paste from Clipboard</button>
      <button onClick={handleAddToTrack}>Add to Track</button>

      {videoMetaData && (
        <div className="video-metadata">
          <p>
            <strong>Title:</strong> {videoMetaData.title}
          </p>
          <p>
            <strong>Channel:</strong> {videoMetaData.channel}
          </p>
          {/* Add more metadata fields as needed */}
        </div>
      )}
    </div>
  );
};

export default FormInput;
