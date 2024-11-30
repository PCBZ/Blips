import React, { useEffect, useState } from 'react';
import { useAuth } from '../security/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchPutWithAuth } from '../security/fetchWithAuth';
import { fetchGet } from '../network/fetcher';
import defaultAvatar from '../assets/images/default_avatar.jpg';
import '../css/Profile.css';
import '../css/Blip.css';

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
        const data = await fetchGet(`/api/blips?userId=${user.id}`);
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
    <div className="profile-wrapper">
      <div className='profile-container'>
        <h1 className="profile-header-h1">Profile</h1>
        <div className='profile-header'>
          {user ? (
            <div className='profile-header-card'>
              <div className="profile-avatar-container">
                <img
                  src={previewAvatar || user.avatarUrl || defaultAvatar}
                  alt="Avatar"
                  className='profile-avatar'
                  onClick={handleAvatarClick}
                />
                {showUpload && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                )}
                {previewAvatar && (
                  <div className='profile-button-container'>
                    <button className='small-button' onClick={handleSave}>save</button>
                    <button className='small-button' onClick={handleCancel}>cancel</button>
                  </div>
                )}
              </div>
              <div className='profile-info-container'>
                <label><strong>Name:</strong> {user.username}</label>
                <label><strong>Email:</strong> {user.email}</label>
                <button className='big-button' onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <p>Redirecting to login...</p>
          )}
        </div>
        {error && <p className='error-message'>{error}</p>}

        <h2>Your Blips</h2>
        <ul className='blip-list'>
          {blips.map((blip) => (
            <li key={blip.id} className="blip-item" onClick={ () => navigate(`/blip/${blip.id}`) }>
              <div className="blip-container">
                {blip.imageUrl && (
                  <img src={blip.imageUrl} alt="Blip" />
                )}
                <label>{blip.content}</label>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Profile;