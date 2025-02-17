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
        </div>
      </div>
    </section>
  );
}

export default Projects;