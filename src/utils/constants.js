const ACTIVITY_TYPES = {
  POST_CREATED: 'post_created',
  POST_LIKED: 'post_liked',
  USER_FOLLOWED: 'user_followed',
  USER_DELETED: 'user_deleted',
  POST_DELETED: 'post_deleted'
};

const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  OWNER: 'owner'
};

module.exports = { ACTIVITY_TYPES, ROLES };

