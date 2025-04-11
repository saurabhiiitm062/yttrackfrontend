import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ContentArea from "./ContentArea"; // Import the ContentArea component
import "./UserProfile.css";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideoComments, setSelectedVideoComments] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedVideos, setSelectedVideos] = useState(new Set()); // Store selected videos
  const [videoMetadata, setVideoMetadata] = useState({}); // To store video metadata
  const [searchQuery, setSearchQuery] = useState(""); // Track search input
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [youtubeUserId, setYoutubeUserId] = useState(""); // State for YouTube User ID input
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("You need to be logged in to view this page");
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.get(
          `http://localhost:4343/api/user/${userId}`
        );
        console.log("Fetched User Details:", data); // Log the fetched data
        setUserDetails(data);
      } catch (err) {
        console.error(err);
        alert("Error fetching user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  // Fetch video metadata for each tracked video when userDetails changes
  useEffect(() => {
    if (userDetails?.trackedVideos?.length > 0) {
      userDetails.trackedVideos.forEach((video) => {
        fetchVideoMetadata(video.videoUrl);
      });
    }
  }, [userDetails]); // Runs when userDetails changes

  const fetchVideoMetadata = async (videoUrl) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User ID not found. Please log in.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:4343/api/videos/get-video-meta",
        {
          videoUrl,
          userId,
        }
      );
      setVideoMetadata((prevData) => ({
        ...prevData,
        [videoUrl]: data, // Store metadata for the specific video
      }));
    } catch (err) {
      console.error("Error fetching video metadata:", err.message);
      alert("Failed to fetch video metadata. Please try again.");
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.delete(
        `http://localhost:4343/api/user/${userId}/tracked-video/${videoId}`
      );
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        trackedVideos: prevDetails.trackedVideos.filter(
          (video) => video._id !== videoId
        ),
      }));
      alert("Video deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Error deleting video");
    }
  };

  const fetchVideoComments = async (videoId) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User ID not found. Please log in.");
      return;
    }

    try {
      const { data } = await axios.get(
        `http://localhost:4343/api/videos/${userId}/${videoId}/comments`
      );
      setSelectedVideoComments(data.comments);
      setSelectedVideoId(videoId);
    } catch (err) {
      console.error("Error fetching video comments:", err.message);
      alert("Error fetching video comments. Please try again.");
    }
  };

  const handleCheckboxChange = (videoId) => {
    setSelectedVideos((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(videoId)) {
        updatedSelected.delete(videoId);
      } else {
        updatedSelected.add(videoId);
      }
      return updatedSelected;
    });
  };

  const handleNotifyMe = () => {
    if (selectedVideos.size === 0) {
      alert("Please select at least one video to receive notifications.");
      return;
    }
    setIsModalOpen(true); // Open the modal when the user clicks "Notify Me On Mail"
  };

  const handleNotifyMeSubmit = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User ID not found. Please log in.");
      return;
    }

    if (!youtubeUserId) {
      alert("Please enter a YouTube User ID.");
      return;
    }

    try {
      await axios.post("http://localhost:4343/api/videos/subscribe", {
        userId,
        videoIds: Array.from(selectedVideos),
        youtubeUserId, // Pass the YouTube User ID with the request
      });
      alert("You will be notified by email for the selected videos.");
      setIsModalOpen(false); // Close the modal after successful submission
    } catch (err) {
      console.error("Error subscribing to notifications:", err.message);
      alert("Failed to subscribe to notifications. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal if the user cancels
  };

  const extractYouTubeId = (videoId) => {
    try {
      const url = new URL(videoId);
      return url.searchParams.get("v") || videoId;
    } catch {
      return videoId;
    }
  };

  // Filter videos based on search query
  const filteredVideos = useMemo(() => {
    if (!userDetails) return [];
    return userDetails.trackedVideos.filter((video) =>
      video.videoUrl.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [userDetails, searchQuery]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="user-profile-container">
      {userDetails ? (
        <div className="user-profile-content">
          <div className="top-bar">
            <h2>User Profile</h2>
            <p className="user-email">{userDetails.email}</p>
          </div>

          <div className="main-content">
            <div className="tracked-videos-box">
              {userDetails.trackedVideos?.length > 0 ? (
                <div className="tvideo">
                  <input
                    type="text"
                    placeholder="Search"
                    className="tvidsearch"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button onClick={handleNotifyMe}>Notify Me On Mail</button>
                  {filteredVideos.map((video) => {
                    const videoUrl = video.videoUrl;
                    const metadata = videoMetadata[videoUrl] || {}; // Access metadata for this video

                    return (
                      <div key={video._id} className="tracked-video">
                        <input
                          type="checkbox"
                          checked={selectedVideos.has(video._id)}
                          onChange={() => handleCheckboxChange(video._id)}
                        />
                        <div
                          className="tt"
                          onClick={() => fetchVideoComments(video._id)}
                          style={{ cursor: "pointer" }}
                        >
                          <h4 className="ttitle">
                            {metadata.title || "Unknown Title"}
                          </h4>
                        </div>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteVideo(video._id)}
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="no-videos">No videos tracked yet.</p>
              )}
            </div>

            <ContentArea
              selectedVideoId={selectedVideoId}
              selectedVideoComments={selectedVideoComments}
              extractYouTubeId={extractYouTubeId}
            />
          </div>
        </div>
      ) : (
        <p>User not found</p>
      )}

      {/* Modal Component */}
      {isModalOpen && (
        <NotificationModal
          youtubeUserId={youtubeUserId}
          setYoutubeUserId={setYoutubeUserId}
          onClose={handleCloseModal}
          onConfirm={handleNotifyMeSubmit}
        />
      )}
    </div>
  );
};

// Modal Component
const NotificationModal = ({
  youtubeUserId,
  setYoutubeUserId,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Confirm Subscription</h3>
        <p>Enter the YouTube User ID:</p>
        <input
          type="text"
          placeholder="YouTube User ID"
          value={youtubeUserId}
          onChange={(e) => setYoutubeUserId(e.target.value)}
        />
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Add To
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
