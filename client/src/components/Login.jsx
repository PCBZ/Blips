import React, { useState } from 'react';
import { useAuth } from '../security/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../css/Login.module.css';

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.form_wrapper}>
      <div className={styles.title_container}>
        <h2>Login</h2>
      </div>
      {error && <p className={styles.error_message}>{error}</p>} {/* Display error if any */}
      <form onSubmit={handleLogin} className={styles.form_container}>
        <div className={styles.row}>
          <div className={styles.col_half}>
            <label>
              Email:
              <div className={styles.input_field}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </label>
          </div>
          <div className={styles.col_half}>
            <label>
              Password:
              <div className={styles.input_field}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </label>
          </div>
        </div>
        <input type="submit" value="Login" className={styles.submit_button} />
      </form>
      <div className={styles.create_account}>
        <p>
          Don't have an account?{' '}
          <Link to="/register" className={styles.register_link}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;