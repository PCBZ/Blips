import React, { useEffect, useState } from 'react';
import { useAuth } from '../security/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { fetchGet } from '../network/fetcher';

function Home() {
  const { user, logout, isAuthenticated } = useAuth(); // Get the user, logout function, and getBlips function from AuthContext
  const navigate = useNavigate(); // Initialize the navigate function
  const [blips, setBlips] = useState([]);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/login'); // Redirect to the Login page after logging out
  };

  useEffect(() => {
    const fetchBlips = async () => {
      try {
        const data = await fetchGet('/api/blips');
        setBlips(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBlips();
  }, []);

  const handleCreateNewBlip = () => {
    if (isAuthenticated) {
      navigate('/new-blip');
    } else {
      navigate('/login');
    }
  }

  return (
    <div>
      <h1>Blips</h1>
      {error && <p>{error}</p>}
      {user && (
        <div>
          <p>Hello, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button> {/* Logout button */}
        </div>
      )}
      {!user && (
        <p>Please log in to view and create Blips.</p> // Message if the user is not logged in
      )}
      <button onClick={handleCreateNewBlip}>Create New Blip</button>
      <ul>
        {blips.map((blip) => (
          <li key={blip.id} className="blip-item">
            <div className="blip-container">
              {blip.imageUrl && (
                <img src={blip.imageUrl} alt="Blip" className="blip-image" style={{height: "200px", width: "auto"}}/>
              )}
            <div className="blip-content">
              <p>{blip.content}</p>
              <small>
                Posted by <strong>{blip.user.username}</strong> at:{" "}
                {new Date(blip.updatedAt).toLocaleString()}
              </small>
              <br />
              <Link to={`/blip/${blip.id}`}>Detail</Link>
            </div>
          </div>
        </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;