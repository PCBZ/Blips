import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPostWithAuth } from '../security/fetchWithAuth.js';

const NewBlipPage = () => {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (optional)
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }
      setImageFile(file);

      // Generate preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result); // Set the preview URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostBlip = async (e) => {
    e.preventDefault();

    try {
      setError(null);

      const formData = new FormData();
      formData.append("content", content);
      if (imageFile) {
        formData.append("image", imageFile); // Add the selected image file
      }

      // Send FormData to the server
      const newBlip = await fetchPostWithAuth("/api/blips", formData, true);

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
          <label htmlFor="imageFile">Select Image (optional):</label>
          <input
            id="imageFile"
            type="file"
            accept="image/*" // Restrict to image files only
            onChange={handleImageChange}
          />
        </div>
        {imagePreview && (
          <div>
            <p>Image Preview:</p>
            <img
              src={imagePreview}
              alt="Selected preview"
              style={{ width: "300px", height: "auto", border: "1px solid #ccc" }}
            />
          </div>
        )}
        <button type="submit">Post Blip</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default NewBlipPage;