import React, { createContext, useState, useContext } from 'react';
const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap the app and provide auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Keep track of the logged-in user
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // Save user data to the state
        // localStorage.setItem('authToken', data.token); // Save the token in localStorage
        setIsAuthenticated(true);
        setLoading(false);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        throw new Error('Registration failed. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      setError(error.message); // Set error message in state
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // Save user data to the state
        // localStorage.setItem('authToken', data.token); // Save the token in localStorage
        setLoading(false);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        throw new Error('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setLoading(false);
      setError(error.message); // Set error message in state
    }
  };

  // const logout = () => {
  //   setUser(null);
  //   localStorage.removeItem('authToken'); // Remove the token on logout
  // };

  const logout = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
  };

  const getBlips = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/blips`, {
        method: 'GET',
        // credentials: "include",
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        return data; // Return the list of blips
      } else {
        throw new Error('Failed to fetch blips');
      }
    } catch (error) {
      setError(error.message);
      throw error; // Propagate error to the caller
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading, error, getBlips }}>
      {children}
    </AuthContext.Provider>
  );
};