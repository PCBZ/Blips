import React from 'react';
import { useAuth } from '../security/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const { user, logout } = useAuth(); // Get the user and logout function from AuthContext
  const navigate = useNavigate(); // Initialize the navigate function
  const { getBlips } = useAuth();
  const [blips, setBlips] = useState([]);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate('/register'); // Redirect to the Register page
  };

  useEffect(() => {
    const fetchBlips = async () => {
      try {
        const data = await getBlips();
        setBlips(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBlips();
  }, []);

  return (
    <div>
      <h1>Blips</h1>
      {error && <p>{error}</p>}
      <Link to="/new-blip">
        <button>Create New Blip</button>
      </Link>
      <ul>
        {blips.map((blip) => (
          <li key={blip.id}>
            <p>{blip.content}</p>
            {blip.imageUrl && <img src={blip.imageUrl} alt="Blip" />}
            <small>
              Posted by <strong>{blip.user.username}</strong> at: {new Date(blip.updatedAt).toLocaleString()}
            </small>
            <br />
            <Link to={`/blip/${blip.id}`}>Detail</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;