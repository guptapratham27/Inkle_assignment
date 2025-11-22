import { useState } from 'react';
import { postAPI, likeAPI, adminAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onDelete, onRefresh }) => {
  const { user, isAdmin } = useAuth();
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (liked) {
        await likeAPI.unlike(post._id);
        setLiked(false);
      } else {
        await likeAPI.like(post._id);
        setLiked(true);
      }
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      if (isAdmin) {
        await adminAPI.deletePost(post._id);
      } else {
        await postAPI.delete(post._id);
      }
      if (onDelete) onDelete(post._id);
      if (onRefresh) onRefresh();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete post');
    }
  };

  const handleBlock = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to block @${post.author.username}? Their posts will be hidden from you.`)) return;
    
    setLoading(true);
    
    try {
      await userAPI.blockUser(post.author._id);
      alert('User blocked successfully. Their posts will no longer appear in your feed.');
      if (onRefresh) {
        setTimeout(() => {
          onRefresh();
        }, 100);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        return;
      }
      alert(error.response?.data?.error || 'Failed to block user');
    } finally {
      setLoading(false);
    }
  };

  const canDelete = post.author?._id?.toString() === user?._id?.toString() || isAdmin;
  const canBlock = post.author?._id?.toString() !== user?._id?.toString();

  return (
    <div className="post-card">
      <div className="post-header">
        <span className="post-author">@{post.author.username}</span>
        <div className="post-actions">
          {canBlock && (
            <button type="button" className="block-btn" onClick={handleBlock} disabled={loading}>
              Block User
            </button>
          )}
          {canDelete && (
            <button type="button" className="delete-btn" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
      <div className="post-content">{post.content}</div>
      <div className="post-footer">
        <button
          type="button"
          className={`like-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={loading}
        >
          {liked ? '❤️ Liked' : '🤍 Like'}
        </button>
        <span className="post-date">
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default PostCard;

