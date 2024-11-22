import React, { createContext, useState, useContext } from 'react';
const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap the app and provide auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Keep track of the logged-in user
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  const register = async (username, email, password) => {
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
      } else {
        setIsAuthenticated(false);
        setUser(null);
        throw new Error('Registration failed. Please try again.');
      }
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
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
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        throw new Error('Login failed. Please check your credentials.');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};