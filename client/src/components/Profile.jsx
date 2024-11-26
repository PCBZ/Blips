import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../security/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchGetWithAuth, fetchPutWithAuth } from '../security/fetchWithAuth';
import defaultAvatar from '../assets/images/default_avatar.jpg';

function Profile() {
  const { user, logout, authInitialized } = useAuth();
  const [blips, setBlips] = useState([]);
  const [error, setError] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlips = async () => {
      try {
        const data = await fetchGetWithAuth(`/api/blips?userId=${user.id}`);
        setBlips(data);
      } catch (err) {
        setError(err.message);
      }
    }
    if (!authInitialized) {
      return;
    }
    if (!user) {
      navigate('/login');
    } else {
      fetchBlips();
    }
  }, [authInitialized, user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAvatarClick = () => {
    setShowUpload(true); // Show the upload area when the avatar is clicked
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewAvatar(URL.createObjectURL(file)); // Set the preview image
      setSelectedFile(file); // Save the selected file
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      const updatedUser = await fetchPutWithAuth('/api/auth/upload-avatar', formData, true);
      
      user.avatarUrl = updatedUser.avatarUrl;
      setShowUpload(false);
      setPreviewAvatar(null);
      setSelectedFile(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = () => {
    setShowUpload(false);
    setPreviewAvatar(null);
    setSelectedFile(null);
  };

  return (
    <div>
      <h1>Profile</h1>
      {user ? (
        <div>
          <div onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
            <img
              src={previewAvatar || user.avatarUrl || defaultAvatar}
              alt="Avatar"
              style={{ width: '100px', height: '100px', borderRadius: '50%' }}
            />
          </div>
          {showUpload && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewAvatar && (
                <div>
                  <button onClick={handleSave}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
                </div>
              )}
            </div>
          )}
          <p><strong>Name:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Redirecting to login...</p>
      )}
      {error && <p>{error}</p>}

      {/* Display user blips */}
      <h2>Your Blips</h2>
      <ul>
        {blips.map((blip) => (
          <li key={blip.id} className="blip-item">
            <div className="blip-container">
              {blip.imageUrl && (
                <img
                  src={blip.imageUrl}
                  alt="Blip"
                  className="blip-image"
                  style={{ height: '200px', width: 'auto' }}
                />
              )}
              <div className="blip-content">
                <p>{blip.content}</p>
                <small>
                  Posted by <strong>{blip.user.username}</strong> at:{' '}
                  {new Date(blip.updatedAt).toLocaleString()}
                </small>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;