import { useState, useEffect } from 'react';
import { userAPI, postAPI, adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { user, isOwner } = useAuth();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const postsRes = await postAPI.getAll();
      setPosts(postsRes.data.posts);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(userId);
      alert('User deleted successfully');
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await adminAPI.deletePost(postId);
      alert('Post deleted successfully');
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete post');
    }
  };

  const handleCreateAdmin = async () => {
    const userId = prompt('Enter user ID to promote to admin:');
    if (!userId) return;
    try {
      await adminAPI.createAdmin(userId);
      alert('Admin created successfully');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create admin');
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to remove admin privileges?')) return;
    try {
      await adminAPI.deleteAdmin(adminId);
      alert('Admin removed successfully');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to remove admin');
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <div className="tabs">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users & Posts
        </button>
        {isOwner && (
          <button
            className={activeTab === 'admins' ? 'active' : ''}
            onClick={() => setActiveTab('admins')}
          >
            Manage Admins
          </button>
        )}
      </div>

      {activeTab === 'users' && (
        <div>
          <h3>Posts Management</h3>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="posts-list">
              {posts.map((post) => (
                <div key={post._id} className="admin-item">
                  <div>
                    <strong>@{post.author.username}</strong>: {post.content}
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    Delete Post
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'admins' && isOwner && (
        <div>
          <h3>Admin Management</h3>
          <button className="primary-btn" onClick={handleCreateAdmin}>
            Create New Admin
          </button>
          <p>Enter user ID to promote to admin</p>
        </div>
      )}
    </div>
  );
};

export default Admin;

