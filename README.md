# Task Management API

A robust REST API for managing tasks and users with role-based access control, built with Node.js, Express, and MongoDB.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [Security](#security)
- [Production Deployment](#production-deployment)

## Features

- ✅ User authentication & authorization (JWT-based)
- ✅ Role-based access control (Admin, User)
- ✅ Task management (CRUD operations)
- ✅ Rate limiting for API protection
- ✅ Input validation with Joi
- ✅ Secure password hashing with bcrypt
- ✅ Refresh token mechanism
- ✅ User management endpoints

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Joi
- **Security:** bcrypt, rate-limiter-flexible
- **Environment:** dotenv

## Prerequisites

- Node.js v16 or higher
- MongoDB (Atlas or local instance)
- npm or yarn package manager

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd task-management-api

# Install dependencies
npm install

# Install devDependencies (if applicable)
npm install --save-dev <dev-tools>
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
MONGOURI=mongodb+srv://<username>:<password>@cluster.mongodb.net/task-management

# JWT Configuration
JWT_SECRET=your_very_secure_random_string_min_32_characters_here

```

**⚠️ Security Notes:**
- Never commit `.env` to version control
- Use strong, randomly generated `JWT_SECRET`
- Rotate secrets regularly
- Use environment-specific configurations

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

Server will start on `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user" (optional, defaults to "user")
}

Response: 201 Created
{
  "message": "User registered successfully"
}
```

#### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Refresh Token
```
POST /auth/refresh
Cookie: refreshToken=<refresh_token>

Response: 200 OK
{
  "accessToken": "eyJhbGc...",
  "user": { ... }
}
```

#### Logout
```
POST /auth/logout
Authorization: Bearer <access_token>

Response: 200 OK
{
  "message": "Logged out successfully"
}
```

### User Endpoints

#### Get All Users (Admin only)
```
GET /users
Authorization: Bearer <access_token>

Response: 200 OK
[
  {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
]
```

#### Get Current User
```
GET /users/me
Authorization: Bearer <access_token>

Response: 200 OK
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

#### Update User Role (Admin only)
```
PATCH /users/:id/role
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "role": "admin"
}

Response: 200 OK
```

#### Delete User (Admin only)
```
DELETE /users/:id
Authorization: Bearer <access_token>

Response: 200 OK
```

### Task Endpoints

#### Create Task
```
POST /tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task description",
  "priority": "high",
  "status": "pending"
}

Response: 201 Created
```

#### Get All Tasks
```
GET /tasks
Authorization: Bearer <access_token>

Response: 200 OK
```

#### Get Task by ID
```
GET /tasks/:id
Authorization: Bearer <access_token>

Response: 200 OK
```

#### Update Task
```
PATCH /tasks/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "completed"
}

Response: 200 OK
```

#### Delete Task
```
DELETE /tasks/:id
Authorization: Bearer <access_token>

Response: 200 OK
```

#### Get Task Statistics
```
GET /tasks/stats
Authorization: Bearer <access_token>

Response: 200 OK
{
  "totalTasks": 10,
  "completedTasks": 7,
  "pendingTasks": 3
}
```

## Project Structure

```
task-management-api/
├── src/
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # Server entry point
│   ├── db/
│   │   └── config.js             # MongoDB connection
│   ├── middleware/
│   │   ├── auth-handler.js       # JWT authentication & authorization
│   │   ├── rate-limiter.js       # Rate limiting middleware
│   │   └── validate.js           # Input validation middleware
│   ├── models/
│   │   ├── user.model.js         # User schema
│   │   └── task.model.js         # Task schema
│   ├── utils/
│   │   └── jwt-token.js          # JWT utilities
│   ├── routes/
│   │   └── v1/
│   │       └── routes.js         # Route aggregator
│   └── v1/
│       └── components/
│           ├── auth/             # Authentication module
│           ├── users/            # Users module
│           └── tasks/            # Tasks module
├── .env                          # Environment variables
├── .gitignore                    # Git ignore file
├── package.json                  # Dependencies & scripts
└── README.md                     # This file
```

## Error Handling

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid credentials |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

### Error Response Format

```json
{
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

## Security

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens with expiration (Access: 7m, Refresh: 15d)
- ✅ HTTP-only cookies for refresh tokens
- ✅ Rate limiting to prevent brute force attacks
- ✅ Input validation with Joi schemas
- ✅ Role-based access control (RBAC)
- ✅ CORS and security headers ready for configuration

### Security Recommendations

1. Always use HTTPS in production
2. Implement CORS policies
3. Enable security headers (Helmet.js)
4. Regularly rotate JWT secrets
5. Monitor rate limit thresholds
6. Use strong passwords (enforced by validator)
7. Implement request logging
8. Keep dependencies updated

## Production Deployment

### Environment Configuration

```env
NODE_ENV=production
PORT=3000
MONGOURI=<production-mongodb-uri>
JWT_SECRET=<strong-production-secret>
```

### Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] MongoDB connection tested
- [ ] JWT_SECRET changed to production value
- [ ] Rate limiting configured appropriately
- [ ] HTTPS enabled
- [ ] CORS configured for allowed domains
- [ ] Error logging implemented
- [ ] Database backups scheduled
- [ ] Monitoring & alerting set up

### Deploy Commands

```bash
# Install production dependencies
npm install --production

# Start the server
npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start server.js --name "task-api"
pm2 save
```

### Monitoring

- Monitor CPU and memory usage
- Log all authentication failures
- Track API response times
- Monitor database connection pool
- Set up alerts for error rates

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, please create an issue in the repository.