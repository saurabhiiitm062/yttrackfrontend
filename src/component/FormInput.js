import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
      const response = await axios.post(
        "http://localhost:4343/api/monitor/get-video-meta",
        {
          videoUrl: url,
        }
      );
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
        const response = await axios.post(
          "http://localhost:4343/api/user/add-video-to-track",
          {
            userId,
            videoUrl,
          }
        );

        alert(response.data.message);
      } catch (err) {
        console.error("Error adding video to track:", err);
        alert("Failed to add video to track.");
      }
    }
  };

  return (
    <div className="form-container">
      <h3 className="form-title">Track YouTube Video</h3>
      <input
        className="input-field"
        type="text"
        value={videoUrl}
        onChange={handleVideoUrlChange}
        placeholder="Enter YouTube Video URL"
      />
      <button className="paste-button" onClick={handlePasteFromClipboard}>
        Paste from Clipboard
      </button>

      {videoMetaData && (
        <div className="video-meta-container">
          <img
            src={videoMetaData.thumbnails?.high?.url}
            alt="Video Thumbnail"
          />
          <h4>Video Title: {videoMetaData.title}</h4>
          <p>Channel: {videoMetaData.channelTitle}</p>
          <p>
            Uploaded on:{" "}
            {new Date(videoMetaData.publishedAt).toLocaleDateString()}
          </p>
          <div className="likescomments">
            <p>Likes: {videoMetaData.likeCount}</p>
            <p>Dislikes: {videoMetaData.dislikeCount}</p>
            <p>Comments: {videoMetaData.commentCount}</p>
          </div>

          <button onClick={handleAddToTrack}>Add To Track</button>
        </div>
      )}
    </div>
  );
};

export default FormInput;
