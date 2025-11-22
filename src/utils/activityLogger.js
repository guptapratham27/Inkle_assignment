const Activity = require('../models/Activity');

const logActivity = async (actorId, action, targetUserId = null, targetPostId = null) => {
  try {
    await Activity.create({
      actor: actorId,
      targetUser: targetUserId,
      targetPost: targetPostId,
      action
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

module.exports = { logActivity };

