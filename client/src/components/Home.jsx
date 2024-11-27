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
  const [news, setNews] = useState([]);

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/login'); // Redirect to the Login page after logging out
  };

  useEffect(() => {
    const fetchBlips = async () => {
      try {
        const data = await fetchGet('/api/blips');
        setBlips(data);
        console.log(data);
      } catch (err) {
        setError(err.message);
        console.log(err.message);
      }
    };
    const fetchNews = async () => {
      try {
        const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=397de73ade064971aedd51131288c900'); // Replace with your API key
        const data = await response.json();
        setNews(data.articles);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBlips();
    fetchNews();
  }, []);

  const handleCreateNewBlip = () => {
    if (isAuthenticated) {
      navigate('/new-blip');
    } else {
      navigate('/login');
    }
  }

  const handleNavigateToLogin = () => {
    navigate('/login');
  }

  return (
    <div>
      <h1>Top News</h1>
      <div className="banner-container">
        {news && news.map((article, index) => (
          <div key={index} className="banner-item" onClick={() => window.open(article.url, '_blank')}>
            {article.urlToImage && (
              <img 
                src={article.urlToImage} 
                alt="Banner" 
                className="banner-image" 
              />
            )}
            <div className="banner-text">
              <h2>{article.title}</h2>
              <p>{article.description}</p>
            </div>
          </div>
        ))}
      </div>

      <h1>Blips</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {user && (
        <div>
          <p>Hello, {user.username}!</p>
        </div>
      )}
      {!user && (
        <div>
          <p>Please log in to view and create Blips.</p>
          <button onClick={handleNavigateToLogin}>Login</button>
        </div>
      )}
      <button onClick={handleCreateNewBlip}>Create New Blip</button>
      <ul>
        {blips.map((blip) => (
          <li key={blip.id} className="blip-item">
            <div className="blip-container">
              {blip.imageUrl && (
                <img src={blip.imageUrl} alt="Blip" className="blip-image" style={{width: "250px", height: "auto"}}/>
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