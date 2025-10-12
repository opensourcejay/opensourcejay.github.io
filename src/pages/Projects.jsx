import React from 'react';

function Projects() {
  return (
    <section className="section-projects">
      <div className="container">
        <h2 className="section-title">Projects</h2>
        <div className="projects-grid">
          <article className="project-card">
            <div className="project-content">
              <h3>BlackEndpoints</h3>
              <p className="project-tech">React • Supabase</p>
              <p className="project-description">A free and open-source platform designed to help users easily discover and support Black-owned businesses. Built for accessibility, transparency, and community-driven contributions, ensuring visibility and economic empowerment.</p>
              <div className="project-links">
                <a href="https://github.com/blackendpoints" target="_blank" className="project-link">
                  <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" className="project-icon" />
                  View Code
                </a>
              </div>
            </div>
          </article>

          <article className="project-card">
            <div className="project-content">
              <h3>CAMEO</h3>
              <p className="project-tech">DALL-E-3 • GPT-Image-1 • Sora</p>
              <p className="project-description">Turn your imagination into reality with CAMEO – your gateway to next-generation AI-powered media creation. Seamlessly generate stunning images and captivating videos using Azure's cutting-edge AI models.</p>
              <div className="project-links">
                <a href="https://github.com/opensourcejay/CAMEO" target="_blank" className="project-link">
                  <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" className="project-icon" />
                  View Code
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Projects;