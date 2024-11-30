import React, { useEffect, useState } from 'react';
import { useAuth } from '../security/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchGet } from '../network/fetcher';
import '../css/Home.css';
import '../css/Banner.css';
import '../css/Blip.css';
import defaultAvatar from '../assets/images/default_avatar.jpg';

function Home() {
  const { user, isAuthenticated } = useAuth(); // Get the user, logout function, and getBlips function from AuthContext
  const navigate = useNavigate(); // Initialize the navigate function
  const [blips, setBlips] = useState([]);
  const [error, setError] = useState(null);
  const [news, setNews] = useState([]);

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
      <h1 className='home-page-h1'>Top News</h1>
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
            </div>
          </div>
        ))}
      </div>

      <h1 className='home-page-h1'>Blips</h1>
      <div className='home-page-blip-list-container'>
        <div className='home-page-blip-header'>
          {error && <p className='error-message'>{error}</p>}
          {user && (
            <div>
              <label>Hello, {user.username}!</label>
            </div>
          )}
          {!user && (
            <button className='big-button' onClick={handleNavigateToLogin}>Login</button>
          )}
          {user && (
            <button className='big-button' onClick={handleCreateNewBlip}>Create New Blip</button>
          )}
        </div>
        <ul className="blip-list">
          {blips.map((blip) => (
            <li key={blip.id} className="blip-item">
              <div className="blip-container" onClick={ () => navigate(`/blip/${blip.id}`) }>
                <div className="blip-header">
                  <img 
                    src={blip.user.avatarUrl || defaultAvatar} 
                    alt={`${blip.user.username}'s avatar`} 
                    className="blip-avatar"
                    onClick={
                      (e) => {
                        e.stopPropagation();
                        if (user && blip.user.id === user.id) {
                          navigate('/profile');
                        } else {
                          navigate(`/guest-profile/${blip.user.id}`, { 
                            state: { 
                              username: blip.user.username, 
                              avatarUrl: blip.user.avatarUrl } 
                          });
                        }
                      }
                    }
                  />
                  <label>
                    <strong>{blip.user.username}</strong> at:{" "}
                    {new Date(blip.updatedAt).toLocaleString()}
                  </label>
                </div>
                {blip.imageUrl && (
                  <img src={blip.imageUrl} alt="Blip" className="blip-image"/>
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

export default Home;