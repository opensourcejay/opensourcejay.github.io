import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMarkdownPost, discoverPosts, extractMetadata } from '../../utils';

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [navigation, setNavigation] = useState({ prev: null, next: null });

  useEffect(() => {
    async function loadPost() {
      const post = await fetchMarkdownPost(id);
      if (post) {
        const metadata = extractMetadata(post.raw);
        setPost({ id, ...metadata });
      }

      // Load navigation
      const posts = await discoverPosts();
      const currentIndex = posts.findIndex(postId => postId === id);
      
      const getPostInfo = async (id) => {
        const post = await fetchMarkdownPost(id);
        const metadata = post ? extractMetadata(post.raw) : null;
        return metadata ? { id, title: metadata.title } : null;
      };

      setNavigation({
        prev: currentIndex > 0 ? await getPostInfo(posts[currentIndex - 1]) : null,
        next: currentIndex < posts.length - 1 ? await getPostInfo(posts[currentIndex + 1]) : null
      });
    }

    loadPost();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="blog-post-page">
      <Link to="/blog" className="back-button">← Back to Blog</Link>
      <div className="blog-post-header">
        <div className="blog-post-image">
          <img src={post.image} alt={post.title} />
        </div>
        <h1>{post.title}</h1>
        <div className="blog-post-meta">
          <span className="blog-post-author">{post.author}</span>
          <span className="blog-post-date">{post.date}</span>
        </div>
      </div>
      <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      <div className="blog-navigation">
        {navigation.prev ? (
          <Link to={`/blog/${navigation.prev.id}`} className="nav-button prev">
            ← {navigation.prev.title}
          </Link>
        ) : (
          <span></span>
        )}
        {navigation.next ? (
          <Link to={`/blog/${navigation.next.id}`} className="nav-button next">
            {navigation.next.title} →
          </Link>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
}

export default BlogPost;