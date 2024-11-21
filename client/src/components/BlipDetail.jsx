import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGetWithAuth, fetchPutWithAuth } from "../security/fetchWithAuth";
import { useAuth } from "../security/AuthContext";

function BlipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the current logged-in user from AuthContext
  const [blip, setBlip] = useState(null);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlip = async () => {
      try {
        const data = await fetchGetWithAuth(`/api/blips/${id}`);
        setBlip(data);
        setContent(data.content);
        setImageUrl(data.imageUrl);
      } catch (err) {
        setError("Failed to fetch blip details. Please try again.");
      }
    };
    fetchBlip();
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
      setError("Failed to update the blip. Please try again.");
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
            <button onClick={() => setIsEditing(true)}>Edit</button>
          )}
        </div>
      )}
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}

export default BlipDetail;