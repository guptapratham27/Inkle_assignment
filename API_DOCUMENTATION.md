# Social Activity Feed API - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Request/Response Examples](#requestresponse-examples)
6. [Error Handling](#error-handling)
7. [User Roles & Permissions](#user-roles--permissions)
8. [Postman Collection](#postman-collection)

---

## Overview

This is a comprehensive REST API for a social media activity feed application with role-based access control. The API supports user authentication, posts, likes, follows, blocking, activity feeds, and administrative operations.

**Base URL:** `http://localhost:3000/api`

---

## Base URL

All API endpoints are prefixed with `/api`

```
http://localhost:3000/api
```

---

## Authentication

Most endpoints require authentication using JWT (JSON Web Tokens). Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

**Public Endpoints (No Authentication Required):**
- `POST /api/auth/signup`
- `POST /api/auth/login`

**Protected Endpoints (Authentication Required):**
- All other endpoints require a valid JWT token

---

## API Endpoints

### 1. Authentication

#### Signup
Create a new user account.

**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `username`: Required, 3-30 characters, unique
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "69221103d850c59026da0aaa",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Responses:**
- `400`: User already exists or validation error
- `500`: Server error

---

#### Login
Authenticate and get JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "69221103d850c59026da0aaa",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Responses:**
- `401`: Invalid credentials
- `500`: Server error

---

### 2. User Management

#### Get Current User Profile
Get authenticated user's profile.

**Endpoint:** `GET /api/users/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "_id": "69221103d850c59026da0aaa",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### Get User by ID
Get a specific user's profile.

**Endpoint:** `GET /api/users/:id`

**Path Parameters:**
- `id` (string, required): User's MongoDB ObjectId

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "user": {
    "_id": "69221103d850c59026da0aaa",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `404`: User not found
- `401`: Authentication required

---

#### Block User
Block a user to hide their posts and activities.

**Endpoint:** `POST /api/users/:id/block`

**Path Parameters:**
- `id` (string, required): User ID to block

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "User blocked successfully"
}
```

**Error Responses:**
- `400`: Cannot block yourself / User already blocked
- `404`: User not found
- `401`: Authentication required

**Note:** Once blocked, the user's posts and activities will be automatically filtered from your feed.

---

#### Unblock User
Unblock a previously blocked user.

**Endpoint:** `DELETE /api/users/:id/block`

**Path Parameters:**
- `id` (string, required): User ID to unblock

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "User unblocked successfully"
}
```

**Error Responses:**
- `404`: User not blocked
- `401`: Authentication required

---

### 3. Posts

#### Create Post
Create a new post.

**Endpoint:** `POST /api/posts`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "This is my first post!"
}
```

**Validation Rules:**
- `content`: Required, max 1000 characters

**Response (201 Created):**
```json
{
  "message": "Post created successfully",
  "post": {
    "_id": "69221103d850c59026da0aaa",
    "author": {
      "_id": "69221103d850c59026da0aaa",
      "username": "john_doe"
    },
    "content": "This is my first post!",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "deletedAt": null
  }
}
```

**Error Responses:**
- `400`: Validation error
- `401`: Authentication required
- `500`: Server error

---

#### Get All Posts
Get all posts in the feed (excluding blocked users).

**Endpoint:** `GET /api/posts`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "posts": [
    {
      "_id": "69221103d850c59026da0aaa",
      "author": {
        "_id": "69221103d850c59026da0aaa",
        "username": "john_doe"
      },
      "content": "This is my first post!",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "deletedAt": null
    }
  ]
}
```

**Filters Applied:**
- Excludes posts from blocked users
- Excludes deleted posts
- Returns up to 50 most recent posts
- Sorted by creation date (newest first)

---

#### Delete Post
Delete a post (author or admin/owner only).

**Endpoint:** `DELETE /api/posts/:id`

**Path Parameters:**
- `id` (string, required): Post ID to delete

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Post deleted successfully"
}
```

**Error Responses:**
- `403`: Permission denied (not author or admin)
- `404`: Post not found
- `401`: Authentication required

**Permissions:**
- Post author can delete their own posts
- Admin/Owner can delete any post

---

### 4. Likes

#### Like Post
Like a post.

**Endpoint:** `POST /api/posts/:id/like`

**Path Parameters:**
- `id` (string, required): Post ID to like

**Headers:**
```
Authorization: Bearer <token>
```

**Response (201 Created):**
```json
{
  "message": "Post liked successfully",
  "like": {
    "_id": "69221103d850c59026da0aaa",
    "user": "69221103d850c59026da0aaa",
    "post": "69221103d850c59026da0aaa",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Post already liked / Cannot like post from blocked user
- `404`: Post not found
- `401`: Authentication required

**Note:** You cannot like posts from blocked users. Each user can like a post only once.

---

#### Unlike Post
Remove a like from a post.

**Endpoint:** `DELETE /api/posts/:id/like`

**Path Parameters:**
- `id` (string, required): Post ID to unlike

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Post unliked successfully"
}
```

**Error Responses:**
- `404`: Like not found
- `401`: Authentication required

---

### 5. Follow System

#### Follow User
Follow a user.

**Endpoint:** `POST /api/users/:id/follow`

**Path Parameters:**
- `id` (string, required): User ID to follow

**Headers:**
```
Authorization: Bearer <token>
```

**Response (201 Created):**
```json
{
  "message": "User followed successfully"
}
```

**Error Responses:**
- `400`: Cannot follow yourself / Already following
- `404`: User not found
- `401`: Authentication required

---

#### Unfollow User
Unfollow a user.

**Endpoint:** `DELETE /api/users/:id/follow`

**Path Parameters:**
- `id` (string, required): User ID to unfollow

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "User unfollowed successfully"
}
```

**Error Responses:**
- `404`: Not following this user
- `401`: Authentication required

---

### 6. Activity Feed

#### Get Activity Feed
Get the activity feed showing all network activities.

**Endpoint:** `GET /api/activity`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "activities": [
    {
      "id": "69221103d850c59026da0aaa",
      "message": "john_doe made a post",
      "action": "post_created",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "69221103d850c59026da0aab",
      "message": "jane_smith liked john_doe's post",
      "action": "post_liked",
      "createdAt": "2024-01-15T10:25:00.000Z"
    },
    {
      "id": "69221103d850c59026da0aac",
      "message": "jane_smith followed john_doe",
      "action": "user_followed",
      "createdAt": "2024-01-15T10:20:00.000Z"
    }
  ]
}
```

**Activity Types:**
- `post_created`: "ABC made a post"
- `post_liked`: "DEF liked ABC's post"
- `user_followed`: "PQR followed ABC"
- `user_deleted`: "User deleted by Owner"
- `post_deleted`: "Post deleted by Admin"

**Filters Applied:**
- Excludes activities from blocked users
- Returns up to 100 most recent activities
- Sorted by creation date (newest first)

---

### 7. Admin Operations

All admin endpoints require Admin or Owner role.

#### Delete User (Admin/Owner)
Delete a user account.

**Endpoint:** `DELETE /api/admin/users/:id`

**Path Parameters:**
- `id` (string, required): User ID to delete

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `400`: Cannot delete yourself
- `403`: Cannot delete owner / Admins cannot delete other admins
- `404`: User not found
- `401`: Authentication required
- `403`: Insufficient permissions (not admin/owner)

**Restrictions:**
- Cannot delete yourself
- Admins cannot delete other admins (only Owner can)
- Owner cannot be deleted

---

#### Delete Post (Admin/Owner)
Delete any post.

**Endpoint:** `DELETE /api/admin/posts/:id`

**Path Parameters:**
- `id` (string, required): Post ID to delete

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Post deleted successfully"
}
```

**Error Responses:**
- `404`: Post not found
- `401`: Authentication required
- `403`: Insufficient permissions (not admin/owner)

**Note:** Creates an activity log entry when deleted by admin/owner.

---

#### Delete Like (Admin/Owner)
Delete a like.

**Endpoint:** `DELETE /api/admin/likes/:id`

**Path Parameters:**
- `id` (string, required): Like ID to delete

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Like deleted successfully"
}
```

**Error Responses:**
- `404`: Like not found
- `401`: Authentication required
- `403`: Insufficient permissions (not admin/owner)

---

### 8. Owner Operations

These endpoints require Owner role only.

#### Create Admin (Owner Only)
Promote a user to admin role.

**Endpoint:** `POST /api/admin/admins`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "69221103d850c59026da0aaa"
}
```

**Response (200 OK):**
```json
{
  "message": "Admin created successfully",
  "user": {
    "_id": "69221103d850c59026da0aaa",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

**Error Responses:**
- `400`: User is already an admin
- `404`: User not found
- `401`: Authentication required
- `403`: Only owner can create admins

---

#### Remove Admin (Owner Only)
Remove admin privileges from a user.

**Endpoint:** `DELETE /api/admin/admins/:id`

**Path Parameters:**
- `id` (string, required): Admin user ID to demote

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Admin deleted successfully"
}
```

**Error Responses:**
- `400`: User is not an admin
- `404`: User not found
- `401`: Authentication required
- `403`: Only owner can delete admins

---

## Error Handling

### HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data or validation error
- `401 Unauthorized`: Authentication required or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Error Response Format

```json
{
  "error": "Error message description"
}
```

### Common Error Messages

- `"Authentication required"`: Missing or invalid JWT token
- `"Invalid credentials"`: Wrong email or password
- `"User not found"`: User ID doesn't exist
- `"Permission denied"`: User doesn't have required permissions
- `"Cannot block yourself"`: Attempting to block own account
- `"User already blocked"`: User is already in blocked list
- `"Post already liked"`: User has already liked this post
- `"Already following this user"`: Already following the user
- `"Only owner can create admins"`: Requires owner role

---

## User Roles & Permissions

### User (Default Role)
**Permissions:**
- Create, view, and delete own posts
- Like and unlike posts
- Follow and unfollow users
- Block and unblock users
- View activity feed

### Admin
**Permissions:**
- All User permissions
- Delete any user (except other admins and owner)
- Delete any post
- Delete any like

### Owner
**Permissions:**
- All Admin permissions
- Create and delete admins
- Delete other admins
- Cannot be deleted

---

## Postman Collection

A complete Postman collection is available at `postman_collection.json`.

### Importing the Collection

1. Open Postman
2. Click **Import** button
3. Select `postman_collection.json` file
4. The collection will be imported with all endpoints pre-configured

### Using the Collection

1. **Set Base URL**: The collection uses `{{baseUrl}}` variable (default: `http://localhost:3000`)
2. **Auto Token Extraction**: The Login endpoint automatically saves the token to `{{token}}` variable
3. **All Endpoints**: All API endpoints are pre-configured with proper headers and example requests

### Collection Variables

- `baseUrl`: API base URL (default: `http://localhost:3000`)
- `token`: JWT token (automatically set after login)

---

## Additional Notes

### Blocking Behavior
- When you block a user, their posts are automatically filtered from your feed
- Their activities are also excluded from your activity feed
- You can unblock users at any time

### Activity Feed
- Shows all network activities in real-time
- Activities are formatted as human-readable messages
- Automatically excludes activities from blocked users

### Soft Deletes
- Posts and likes use soft delete (deletedAt field)
- Deleted resources are filtered from queries
- Admins can still see deleted content for moderation

### Security Features
- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days (configurable)
- Role-based access control enforced on all endpoints
- Input validation on all user inputs

---

## Support

For issues or questions, please refer to the main README.md file or check the project documentation.

