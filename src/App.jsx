import React from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import SpeakingEvents from './pages/SpeakingEvents';

function App() {
  return (
    <Router>
      <nav>
        <div className="nav-content">
          <NavLink to="/" className="nav-brand">Jay</NavLink>
          <div className="nav-links">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/blog">Blog</NavLink>
            <NavLink to="/speaking">Speaking</NavLink>
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/speaking" element={<SpeakingEvents />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;