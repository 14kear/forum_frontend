// роутинг

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Chat';
import Login from './components/Login';
import Topic from './components/Topics';
import './styles/App.css';
import Register from './components/Register';
import TopicDetail from './components/TopicDetail';
import About from './components/About';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/topics" element={<Topic />} />
            <Route path="/topics/:id" element={<TopicDetail/>} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;