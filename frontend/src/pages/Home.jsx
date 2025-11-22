import { useState, useEffect } from 'react';
import { postAPI } from '../services/api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import ActivityFeed from '../components/ActivityFeed';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  const loadPosts = async () => {
    try {
      const response = await postAPI.getAll();
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handlePostCreated = () => {
    loadPosts();
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  return (
    <div className="home-container">
      <div className="tabs">
        <button
          className={activeTab === 'posts' ? 'active' : ''}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button
          className={activeTab === 'activity' ? 'active' : ''}
          onClick={() => setActiveTab('activity')}
        >
          Activity Feed
        </button>
      </div>

      {activeTab === 'posts' && (
        <div className="posts-section">
          <CreatePost onPostCreated={handlePostCreated} />
          {loading ? (
            <div className="loading">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="empty-state">No posts yet. Be the first to post!</div>
          ) : (
            <div className="posts-list">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onDelete={handlePostDeleted}
                  onRefresh={loadPosts}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'activity' && <ActivityFeed />}
    </div>
  );
};

export default Home;

