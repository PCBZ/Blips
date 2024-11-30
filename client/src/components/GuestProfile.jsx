import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { fetchGet } from '../network/fetcher';
import { DEFAULT_AVATAR } from '../config/constants';
import '../css/Profile.css';
import '../css/Blip.css';

function GuestProfile() {
  const [blips, setBlips] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams();
  const { username, avatarUrl } = location.state;

  useEffect(() => {
    const fetchBlips = async (id) => {
      try {
        const data = await fetchGet(`/api/blips?userId=${id}`);
        setBlips(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchBlips(id);
  }, []);

  return (
    <div className="profile-wrapper">
      <div className='profile-container'>
        <h1 className="profile-header-h1">Profile</h1>
        <div className='profile-header'>
          <div className='profile-header-card'>
            <div className="profile-avatar-container">
              <img
                src={avatarUrl || DEFAULT_AVATAR}
                alt="Avatar"
                className='profile-avatar'
              />
            </div>
            <div className='profile-info-container'>
              <label><strong>Name:</strong> {username}</label>
            </div>
          </div>
        </div>
        {error && <p className='error-message'>{error}</p>}

        <h2>{`${username}`}'s Blips</h2>
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

export default GuestProfile;