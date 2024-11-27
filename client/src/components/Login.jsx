import React, { useState } from 'react';
import { useAuth } from '../security/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { login, loading } = useAuth(); // Get login function and error from the AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    // Call login function from the AuthContext
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error if any */}
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input 
            type="text" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </label>
        <br />
        <label>
          Password:
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      <div style={{ marginTop: '10px' }}>
        <p>
          Don't have an account?{' '}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;