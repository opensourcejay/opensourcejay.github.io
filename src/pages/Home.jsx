import React from 'react';

function Home() {
  return (
    <section className="section-home">
      <div className="home-content">
        <div className="home-hero">
          <h1 className="home-welcome">Hey, I'm Jay</h1>
          <p className="home-subtitle">
            Open Source Engineer advocating for accessible technology
          </p>
          <p className="home-description">
            I build open-source solutions, work with cloud and AI technologies, and create pathways for underrepresented groups in tech.
          </p>
        </div>

        <div className="home-highlights">
          <div className="highlight-item">
            <h3>Open Source Advocate</h3>
            <p>Championing accessible solutions and building tools that empower developers everywhere</p>
          </div>
          <div className="highlight-item">
            <h3>Cloud & AI Engineer</h3>
            <p>Working with modern cloud platforms and AI technologies to solve real-world problems</p>
          </div>
          <div className="highlight-item">
            <h3>Speaker</h3>
            <p>Sharing insights and experiences at conferences and events to inspire the tech community</p>
          </div>
          <div className="highlight-item">
            <h3>Teacher</h3>
            <p>Creating pathways for underrepresented groups and mentoring the next generation of technologists</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
