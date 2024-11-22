import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPostWithAuth } from '../security/fetchWithAuth.js';

const NewBlipPage = () => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const handlePostBlip = async (e) => {
    e.preventDefault();

    try {
      setError(null);

      const data = { content, imageUrl };
      const newBlip = await fetchPostWithAuth("/api/blips", data);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>New Blip</h1>
      <form onSubmit={handlePostBlip}>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="imageUrl">Image URL (optional):</label>
          <input
            id="imageUrl"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <button type="submit">Post Blip</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default NewBlipPage;