import React, { useEffect, useState } from 'react';
import { useAuth } from '../security/AuthContext'; // Assuming you have a useAuth hook for authentication
import { useNavigate } from 'react-router-dom';
import { fetchGetWithAuth } from '../security/fetchWithAuth';

function Profile() {
  const { user, logout } = useAuth();
  const [blips, setBlips] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      const fetchBlips = async () => {
        try {
          const data = await fetchGetWithAuth(`/api/blips?userId=${user.id}`);
          setBlips(data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchBlips();
    }
  }, [user, navigate]); // Re-run when user changes

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <h1>Profile</h1>
      {user ? (
        <div>
          <div>
            <img
              src={user.avatarUrl || '/default-avatar.png'}
              alt="Avatar"
              style={{ width: '100px', height: '100px', borderRadius: '50%' }}
            />
            <p><strong>Name:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          {/* Logout button */}
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Redirecting to login...</p>
      )}

      {/* Display user blips */}
      <h2>Your Blips</h2>
      {error && <p>{error}</p>}
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