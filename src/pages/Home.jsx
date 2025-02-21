import React from 'react';

function Home() {
  return (
    <section className="section-home">
      <div className="container">
        <div className="profile-image">
          <div className="profile-initial">J</div>
        </div>
        <h1 className="name">Jay</h1>
        <h2 className="title">Open Source Engineer</h2>
        <p className="bio">Driving open-source innovation by building accessible technology and creating pathways for future innovators.</p>
        <div className="social-links">
          <a href="https://github.com" target="_blank" className="social-link">
            <i className="fab fa-github"></i>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Home;
