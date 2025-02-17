import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { discoverPosts, fetchMarkdownPost, extractMetadata } from '../../utils';

function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const postIds = await discoverPosts();
      const loadedPosts = await Promise.all(
        postIds.map(async (id) => {
          const post = await fetchMarkdownPost(id);
          return post ? { id, ...extractMetadata(post.raw) } : null;
        })
      );

      setPosts(
        loadedPosts
          .filter(Boolean)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
      );
    }

    loadPosts();
  }, []);

  return (
    <section className="section-blog">
      <div className="container">
        <h2 className="section-title">Latest Posts</h2>
        <div className="blog-grid">
          {posts.map((post) => (
            <article key={post.id} className="blog-post">
              <Link to={`/blog/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="blog-post-image">
                  <img src={post.image} alt={post.title} />
                </div>
                <div className="blog-post-content">
                  <h3 className="blog-post-title">{post.title}</h3>
                  <p className="blog-post-excerpt">{post.excerpt}</p>
                  <div className="blog-post-meta">
                    <span className="blog-post-author">{post.author}</span>
                    <span className="blog-post-date">{post.date}</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Blog;