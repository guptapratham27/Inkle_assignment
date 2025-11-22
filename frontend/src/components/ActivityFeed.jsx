import { useState, useEffect } from 'react';
import { activityAPI } from '../services/api';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadActivities = async () => {
    try {
      const response = await activityAPI.getFeed();
      setActivities(response.data.activities);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
    const interval = setInterval(loadActivities, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="loading">Loading activities...</div>;
  }

  return (
    <div className="activity-feed">
      <h3>Activity Feed</h3>
      {activities.length === 0 ? (
        <div className="empty-state">No activities yet</div>
      ) : (
        <div className="activities-list">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-message">{activity.message}</div>
              <div className="activity-time">
                {new Date(activity.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;

