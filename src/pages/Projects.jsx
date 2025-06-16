import React from 'react';

function Projects() {
  return (
    <section className="section-projects">
      <div className="container">
        <h2 className="section-title">Open Source Projects</h2>
        <div className="projects-grid">
          <article className="project-card">
            <div className="project-image">
              <img src="https://placehold.co/800x400/000000/ffffff/png?text=BlackEndpoints" alt="Community Hub Project" />
            </div>
            <div className="project-content">
              <h3>Black Business Directory</h3>
              <p className="project-tech">React • Supabase</p>
              <p className="project-description">A free and open-source platform designed to help users easily discover and support Black-owned businesses. Built for accessibility, transparency, and community-driven contributions, ensuring visibility and economic empowerment.</p>
              <div className="project-links">
                <a href="https://github.com/blackendpoints" target="_blank" className="project-link">
                  <i className="fab fa-github"></i> View Code
                </a>
                <a href="https://blackendpoints.com" target="_blank" className="project-link">
                  <i className="fas fa-external-link-alt"></i> Live Demo
                </a>
              </div>
            </div>
          </article>

                    <article className="project-card">
            <div className="project-image">
              <img src="https://placehold.co/800x400/000000/ffffff/png?text=CAMEO" alt="Creative AI Media Engine Orchestrator" />
            </div>
            <div className="project-content">
              <h3>AI Media Engine Generator</h3>
              <p className="project-tech">dall-e-3 • gpt-image-1 • Sora</p>
              <p className="project-description">Turn your imagination into reality with CAMEO – your gateway to next-generation AI-powered media creation. Seamlessly generate stunning images and captivating videos using Azure's cutting-edge AI models.</p>
              <div className="project-links">
                <a href="https://github.com/opensourcejay/CAMEO" target="_blank" className="project-link">
                  <i className="fab fa-github"></i> View Code
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