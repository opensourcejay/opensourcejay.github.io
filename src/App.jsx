import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelector('.main-content')?.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Speaking from './pages/Speaking';
import ContactModal from './components/ContactModal';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen || isContactOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isContactOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((isOpen) => !isOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openContactModal = () => {
    setIsMobileMenuOpen(false);
    setIsContactOpen(true);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        {/* Mobile Header */}
        <header className="mobile-header">
          <div className="mobile-header-content">
            <div className="mobile-logo">
              <img src="/images/avatar.png" alt="" className="profile-initial-mobile" />
              <span className="mobile-name">Jay</span>
            </div>
            <button 
              className={`hamburger-menu ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="primary-sidebar"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <div 
          className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={closeMobileMenu}
        ></div>

        {/* Sidebar */}
        <aside id="primary-sidebar" className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-profile">
            <img src="/images/avatar.png" alt="Portrait of Jay" className="profile-image" />
            <h1 className="sidebar-name">Jay</h1>
            <p className="sidebar-title">Open Source Engineer</p>
            <p className="sidebar-bio">
              Advocating for accessible technology and creating pathways in tech.
            </p>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section">
              <h3 className="nav-section-title">Navigation</h3>
              <div className="sidebar-nav-links">
                <NavLink to="/" end className="sidebar-nav-link" onClick={closeMobileMenu}>
                  <img src="https://cdn-icons-png.flaticon.com/512/25/25694.png" alt="Home" className="nav-icon" />
                  <span>Home</span>
                </NavLink>
                <NavLink to="/blog" className="sidebar-nav-link" onClick={closeMobileMenu}>
                  <img src="https://cdn-icons-png.flaticon.com/512/2593/2593549.png" alt="Blog" className="nav-icon" />
                  <span>Blog</span>
                </NavLink>
                <NavLink to="/speaking" className="sidebar-nav-link" onClick={closeMobileMenu}>
                  <img src="https://cdn-icons-png.flaticon.com/512/1082/1082810.png" alt="Speaking" className="nav-icon" />
                  <span>Speaking</span>
                </NavLink>
              </div>
            </div>
          </nav>

          <div className="sidebar-contact">
            <h3 className="nav-section-title">Contact</h3>
            <button type="button" className="sidebar-contact-button" onClick={openContactModal}>
              <span className="sidebar-contact-icon" aria-hidden="true">@</span>
              <span>Send a message</span>
            </button>
          </div>

          <div className="sidebar-footer">
            <p className="sidebar-footer-text">© 2026 <a href="https://github.com/opensourcejay" target="_blank" rel="noopener noreferrer">OpensourceJay</a></p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/speaking" element={<Speaking />} />
          </Routes>
        </main>

        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      </div>
    </Router>
  );
}

export default App;