import React from "react";
import "./ContentArea.css";

const ContentArea = ({
  selectedVideoId,
  selectedVideoComments,
  extractYouTubeId,
}) => {
  return (
    <div className="content-area">
      <h3>Video Comments</h3>

      {selectedVideoId && (
        <div className="video-preview">
          <iframe
            title="YouTube Video"
            src={`https://www.youtube.com/embed/${extractYouTubeId(
              selectedVideoId
            )}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* Display comments or a message if there are no comments */}
      {selectedVideoComments.length > 0 ? (
        <ul className="comments-list">
          {selectedVideoComments.map((comment) => (
            <li key={comment.commentId} className="comment-item">
              <div className="comment-content">
                <p>{comment.text}</p>
                <small>By {comment.author}</small>
                <small className="comment-timestamp">
                  {new Date(comment.timestamp).toLocaleString()}
                </small>
                <div className="likes">
                  <span>{comment.likes} Likes</span>
                </div>
              </div>

              {/* Display replies if any */}
              {comment.replies.length > 0 && (
                <ul className="replies-list">
                  {comment.replies.map((reply) => (
                    <li key={reply.replyId} className="reply-item">
                      <p>{reply.text}</p>
                      <small>By {reply.author}</small>
                      <small className="reply-timestamp">
                        {new Date(reply.timestamp).toLocaleString()}
                      </small>
                      <div className="likes">
                        <span>{reply.likes} Likes</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments to display. Click a video to load comments.</p>
      )}
    </div>
  );
};

export default ContentArea;
