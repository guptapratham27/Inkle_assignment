const Activity = require('../models/Activity');
const Block = require('../models/Block');
const User = require('../models/User');
const Post = require('../models/Post');

const formatActivityMessage = (activity) => {
  const actorName = activity.actor?.username || 'Unknown';
  const targetUserName = activity.targetUser?.username || '';
  const targetPostContent = activity.targetPost?.content?.substring(0, 50) || '';

  switch (activity.action) {
    case 'post_created':
      return `${actorName} made a post`;
    case 'post_liked':
      return `${actorName} liked ${targetUserName}'s post`;
    case 'user_followed':
      return `${actorName} followed ${targetUserName}`;
    case 'user_deleted':
      return `User deleted by ${actorName}`;
    case 'post_deleted':
      return `Post deleted by ${actorName}`;
    default:
      return 'Unknown activity';
  }
};

const getActivityFeed = async (req, res) => {
  try {
    const userId = req.user._id;

    const blockedUsers = await Block.find({ blocker: userId }).select('blocked');
    const blockedUserIds = blockedUsers.map(b => b.blocked.toString());

    const query = {
      actor: { $nin: blockedUserIds }
    };

    const activities = await Activity.find(query)
      .populate('actor', 'username')
      .populate('targetUser', 'username')
      .populate('targetPost', 'content')
      .sort({ createdAt: -1 })
      .limit(100);

    const formattedActivities = activities.map(activity => ({
      id: activity._id,
      message: formatActivityMessage(activity),
      action: activity.action,
      createdAt: activity.createdAt
    }));

    res.json({ activities: formattedActivities });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getActivityFeed };

