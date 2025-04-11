import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; // central axios instance
import ContentArea from "./ContentArea";
import "./UserProfile.css";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideoComments, setSelectedVideoComments] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedVideos, setSelectedVideos] = useState(new Set());
  const [videoMetadata, setVideoMetadata] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [youtubeUserId, setYoutubeUserId] = useState("");
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
        const { data } = await API.get(`/user/${userId}`);
        setUserDetails(data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        alert("Something went wrong while fetching your data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  // Add other logic like handling video selection, modal control, etc...

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      {loading ? (
        <p>Loading...</p>
      ) : userDetails ? (
        <div>
          <p>
            <strong>Email:</strong> {userDetails.email}
          </p>
          {/* Display tracked videos or ContentArea */}
          <ContentArea
            videos={userDetails.trackedVideos || []}
            selectedVideoId={selectedVideoId}
            onSelectVideo={setSelectedVideoId}
            selectedVideos={selectedVideos}
            setSelectedVideos={setSelectedVideos}
            videoMetadata={videoMetadata}
            setVideoMetadata={setVideoMetadata}
            selectedVideoComments={selectedVideoComments}
            setSelectedVideoComments={setSelectedVideoComments}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            youtubeUserId={youtubeUserId}
            setYoutubeUserId={setYoutubeUserId}
          />
        </div>
      ) : (
        <p>User not found.</p>
      )}
    </div>
  );
};

export default UserProfile;
