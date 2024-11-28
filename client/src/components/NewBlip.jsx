import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPostWithAuth } from "../security/fetchWithAuth.js";
import styles from "../css/NewBlip.module.css";

const NewBlipPage = () => {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
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
        formData.append("image", imageFile);
      }

      await fetchPostWithAuth("/api/blips", formData, true);

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.newBlipWrapper}>
      <div className={styles.newBlipContainer}>
        <h1 className={styles.title}>New Blip</h1>
        <form onSubmit={handlePostBlip}>
          <div className={styles.formGroup}>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write your blip here..."
              className={styles.textarea}
            />
          </div>
          {imagePreview && (
            <div>
              <img
                src={imagePreview}
                alt="Selected preview"
                className={styles.imagePreview}
              />
            </div>
          )}
          <div className={styles.formGroup}>
            <label htmlFor="imageFile" className={styles.label}>
              Select Image (optional):
            </label>
            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.inputFile}
            />
          </div>
          <button type="submit" className={styles.submitBtn}>Post Blip</button>
        </form>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
};

export default NewBlipPage;