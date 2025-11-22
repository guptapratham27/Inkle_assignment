import { useState } from 'react';
import { postAPI } from '../services/api';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setError('');
    setLoading(true);

    try {
      await postAPI.create({ content });
      setContent('');
      if (onPostCreated) onPostCreated();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <h3>Create Post</h3>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          maxLength={1000}
          rows={4}
        />
        <div className="post-actions">
          <span className="char-count">{content.length}/1000</span>
          <button type="submit" disabled={loading || !content.trim()}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

