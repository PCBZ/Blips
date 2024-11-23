import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import NewBlip from './components/NewBlip';
import BlipDetail from "./components/BlipDetail";
import './App.css';

function App() {
  return (
    <div className="App">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/new-blip" element={<NewBlip />} />
        <Route path="/blip/:id" element={<BlipDetail />} />
      </Routes>
    </div>
  );
}

export default App;