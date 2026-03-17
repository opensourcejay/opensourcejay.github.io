import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { discoverPosts, fetchMarkdownPost, extractMetadata } from '../utils';

function Home() {
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    async function loadRecentPosts() {
      const postIds = await discoverPosts();
      const loaded = await Promise.all(
        postIds.map(async (id) => {
          const post = await fetchMarkdownPost(id);
          return post ? { id, ...extractMetadata(post.raw) } : null;
        })
      );
      setRecentPosts(
        loaded
          .filter(Boolean)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3)
      );
    }
    loadRecentPosts();
  }, []);

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

          <div className="home-cta-buttons">
            <Link to="/blog" className="cta-primary">
              Read My Blog <span aria-hidden="true">→</span>
            </Link>
            <Link to="/speaking" className="cta-secondary">
              Book Me to Speak
            </Link>
          </div>

          <div className="home-social-row">
            <a href="https://github.com/opensourcejay" target="_blank" rel="noopener noreferrer" className="home-social-link">
              <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="" />
              GitHub
            </a>
          </div>
        </div>

        <div className="home-highlights">
          <div className="highlight-item">
            <span className="highlight-icon" aria-hidden="true">🌍</span>
            <h3>Open Source Advocate</h3>
            <p>Championing accessible solutions and building tools that empower developers everywhere</p>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon" aria-hidden="true">☁️</span>
            <h3>Cloud & AI Engineer</h3>
            <p>Working with modern cloud platforms and AI technologies to solve real-world problems</p>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon" aria-hidden="true">🎤</span>
            <h3>Speaker</h3>
            <p>Sharing insights and experiences at conferences and events to inspire the tech community</p>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon" aria-hidden="true">📚</span>
            <h3>Teacher</h3>
            <p>Creating pathways for underrepresented groups and mentoring the next generation of technologists</p>
          </div>
        </div>

        {recentPosts.length > 0 && (
          <div className="home-recent-posts">
            <div className="recent-posts-header">
              <h2>Recent Posts</h2>
              <Link to="/blog" className="view-all-link">
                View all posts <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="recent-posts-grid">
              {recentPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className="recent-post-card">
                  <div className="recent-post-body">
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="recent-post-meta">
                      <span className="author">{post.author}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Home;
