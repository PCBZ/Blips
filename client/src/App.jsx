import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import NewBlip from './components/NewBlip';
import BlipDetail from "./components/BlipDetail";
import Profile from './components/Profile';
import GuestProfile from './components/GuestProfile';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav>
        <div className='nav-container'>
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/new-blip" element={<NewBlip />} />
        <Route path="/blip/:id" element={<BlipDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/guest-profile/:id" element={<GuestProfile />}/>
      </Routes>
    </div>
  );
}

export default App;