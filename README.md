# Social Activity Feed

A comprehensive social media activity feed application with proper role-based permissions, featuring both backend API and frontend interface.

**Backend:** Node.js, Express, MongoDB  
**Frontend:** React, Vite

## Features

- **User Authentication**: Signup and Login with JWT tokens
- **User Management**: Create profile, view profiles, block/unblock users
- **Posts**: Create, view, and delete posts
- **Likes**: Like and unlike posts
- **Follow System**: Follow and unfollow other users
- **Activity Feed**: Real-time activity wall showing all network activities
- **Blocking**: Block users to hide their posts from your feed
- **Admin Features**: Admins can delete users, posts, and likes
- **Owner Features**: Owners can do everything admins can do, plus create/delete admins

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

### Frontend
- **Framework**: React
- **Build Tool**: Vite
- **Routing**: React Router
- **HTTP Client**: Axios

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository or navigate to the project directory:
```bash
cd pratham_assignment
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/social_feed
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

4. Make sure MongoDB is running on your system or update `MONGODB_URI` to your MongoDB Atlas connection string.

5. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will start on `http://localhost:3000` (or the port specified in `.env`).

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (Vite default port).

4. Open your browser and navigate to `http://localhost:5173`

**Note:** Make sure the backend server is running before using the frontend.

## API Endpoints

### Quick Reference

**Authentication:**
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login and get JWT token

**Users:**
- `GET /api/users/profile` - Get current user's profile
- `GET /api/users/:id` - Get user by ID
- `POST /api/users/:id/block` - Block a user
- `DELETE /api/users/:id/block` - Unblock a user

**Posts:**
- `POST /api/posts` - Create a new post
- `GET /api/posts` - Get all posts (excluding blocked users)
- `DELETE /api/posts/:id` - Delete a post (owner or admin)

**Likes:**
- `POST /api/posts/:id/like` - Like a post
- `DELETE /api/posts/:id/like` - Unlike a post

**Follow:**
- `POST /api/users/:id/follow` - Follow a user
- `DELETE /api/users/:id/follow` - Unfollow a user

**Activity Feed:**
- `GET /api/activity` - Get activity feed (all network activities)

**Admin (Admin/Owner only):**
- `DELETE /api/admin/users/:id` - Delete a user
- `DELETE /api/admin/posts/:id` - Delete any post
- `DELETE /api/admin/likes/:id` - Delete a like

**Owner Only:**
- `POST /api/admin/admins` - Create a new admin
- `DELETE /api/admin/admins/:id` - Remove admin privileges

**For complete API documentation with request/response examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

## Authentication

All endpoints except `/api/auth/signup` and `/api/auth/login` require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## User Roles

1. **User** (default): Can create posts, like posts, follow users, block users
2. **Admin**: Can do everything a user can do, plus delete users/posts/likes
3. **Owner**: Can do everything an admin can do, plus create/delete admins

## Activity Feed Format

The activity feed shows formatted messages like:
- "ABC made a post"
- "DEF followed ABC"
- "PQR liked ABC's post"
- "User deleted by Owner"
- "Post deleted by Admin"

## Documentation

### Complete API Documentation

For detailed API documentation with request/response examples, error codes, and detailed descriptions, see **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

### Postman Collection

Import the `postman_collection.json` file into Postman to test all endpoints. The collection includes:
- Pre-configured requests for all endpoints with detailed descriptions
- Environment variables for base URL and token
- Auto-token extraction from login response
- Example requests and responses
- Complete endpoint documentation

**To use:**
1. Open Postman
2. Click **Import** button
3. Select `postman_collection.json` file
4. The collection will be imported with all endpoints ready to use
5. Login first to automatically save the token

## Project Structure

```
pratham_assignment/
├── src/
│   ├── models/          # MongoDB models (User, Post, Like, Follow, Block, Activity)
│   ├── routes/          # API route definitions
│   ├── controllers/     # Business logic controllers
│   ├── middleware/      # Authentication, validation, permissions
│   ├── utils/           # Helper functions and constants
│   └── app.js           # Express app setup
├── config/
│   └── database.js      # MongoDB connection
├── .env                 # Environment variables
├── package.json
├── postman_collection.json
└── README.md
```

## Database Models

- **User**: username, email, password (hashed), role
- **Post**: author, content, createdAt, deletedAt
- **Like**: user, post, createdAt, deletedAt
- **Follow**: follower, following, createdAt
- **Block**: blocker, blocked, createdAt
- **Activity**: actor, targetUser, targetPost, action, createdAt

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation
- Soft deletes for posts and likes

## Quick Start Guide

### 1. Setup Backend
```bash
# Install dependencies
npm install

# Create .env file with MongoDB connection
# Start server
npm start
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Create Owner Account
```bash
npm run create-owner
```

### 4. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Health Check: http://localhost:3000/health

## Important Notes

- Posts from blocked users are automatically filtered from the feed
- Users cannot block themselves
- Users cannot follow themselves
- Admins cannot delete other admins (only owners can)
- Owners cannot be deleted
- All deletions by admins/owners are logged in the activity feed
- JWT tokens expire after 7 days (configurable in .env)
- All passwords are hashed using bcrypt

## Scripts Available

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run create-owner` - Create owner user account
- `npm run remove-test-data` - Remove test users and data

## Testing

### Using Postman
1. Import `postman_collection.json` into Postman
2. Use Login endpoint to get token (automatically saved)
3. Test all endpoints with pre-configured requests

### Using Frontend
1. Start both backend and frontend servers
2. Navigate to http://localhost:5173
3. Sign up or login
4. Test all features through the UI

## Troubleshooting

### Backend Issues
- Ensure MongoDB is running or MongoDB Atlas connection is correct
- Check .env file has correct configuration
- Verify JWT_SECRET is set
- Check server logs for errors

### Frontend Issues
- Ensure backend server is running on port 3000
- Check browser console for errors
- Verify API_URL in frontend/src/services/api.js matches backend URL
- Clear browser cache and localStorage if authentication issues occur

## Additional Resources

- **Complete API Documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Postman Collection**: [postman_collection.json](./postman_collection.json)

