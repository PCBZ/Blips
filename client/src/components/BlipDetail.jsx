import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostWithAuth, fetchPutWithAuth, fetchDeleteWithAuth } from "../security/fetchWithAuth";
import { useAuth } from "../security/AuthContext";
import { fetchGet } from "../network/fetcher";

function BlipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the current logged-in user from AuthContext
  const [blip, setBlip] = useState(null);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState("");

  useEffect(() => {
    const fetchBlip = async () => {
      try {
        const data = await fetchGet(`/api/blips/${id}`);
        setBlip(data);
        setContent(data.content);
        setImageUrl(data.imageUrl);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchComments = async () => {
      try {
        const data = await fetchGet(`/api/comments?blipid=${id}`);
        setComments(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchBlip();
    fetchComments();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedBlip = await fetchPutWithAuth(`/api/blips/${id}`, {
        content,
        imageUrl,
      });
      setBlip(updatedBlip);
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    // Use window.confirm to show a confirmation dialog before proceeding with delete
    const isConfirmed = window.confirm("Are you sure you want to delete this Blip?");
    if (isConfirmed) {
      try {
        await fetchDeleteWithAuth(`/api/blips/${id}`);
        navigate("/"); // Redirect to Home page after successful delete
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }
    try {
      const newComment = await fetchPostWithAuth(`/api/comments`, {
        content: newCommentContent,
        blipId: id,
      });
      setComments([newComment, ...comments]); // Add the new comment to the list
      setNewCommentContent(""); // Clear the input field
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!blip) return <p>Loading...</p>;

  return (
    <div>
      <h1>Blip Details</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        <strong>Posted by:</strong> {blip.user.username}
      </p>
      <p>
        <strong>Last updated at:</strong>{" "}
        {new Date(blip.updatedAt).toLocaleString()}
      </p>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <label>
            Content:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>
          <br />
          <label>
            Image URL:
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <p>{blip.content}</p>
          {blip.imageUrl && <img src={blip.imageUrl} alt="Blip" />}
          {user && user.id === blip.user.id && (
            <>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      )}

    <h2>Comments</h2>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p>{comment.content}</p>
              <small>
                Posted by <strong>{comment.user.username}</strong> at:{" "}
                {new Date(comment.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}

      <form onSubmit={handleAddComment}>
        <textarea
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder="Write a comment..."
        />
        <br />
        <button type="submit">Add Comment</button>
      </form>

    </div>
  );
}

export default BlipDetail;