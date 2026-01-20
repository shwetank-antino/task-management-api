# Task Management API

A robust REST API for managing tasks and users with role-based access control, built with Node.js, Express, and MongoDB.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Rate Limiting](#rate-limiting)
- [API Documentation](#api-documentation)
- [Swagger / API Documentation](#swagger--api-documentation)
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

This command:
1. Generates Swagger documentation from your routes (`swagger-output.json`)
2. Starts the development server
3. Server will be available at `http://localhost:3000`
4. API documentation available at `http://localhost:3000/api-docs`

### Production

```bash
npm start
```

This command:
1. Generates Swagger documentation from your routes
2. Starts the production server
3. Server will be available at `http://localhost:3000` (or configured PORT)
4. API documentation available at `http://localhost:3000/api-docs`

**Note:** The Swagger documentation auto-generation (`swagger.js`) runs automatically before the server starts. Do not edit the generated `swagger-output.json` file manually.

## Rate Limiting

The API implements rate limiting to protect against abuse and brute force attacks.

### Features

- **Global Middleware:** Applied to all incoming requests
- **Protection:** Prevents excessive requests from a single IP address
- **Configurable:** Limits and windows can be adjusted in `src/middleware/rate-limiter.js`

### Response When Limited

When rate limit is exceeded, the API returns:

```
HTTP 429 Too Many Requests
```

### Recommendations

- **Development:** Use lenient limits to avoid blocking during testing
- **Production:** Configure stricter limits based on your expected traffic
- **Monitoring:** Track 429 responses to identify potential attacks
- **Configuration:** Adjust limits in environment-specific configurations

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

**Token Expiration:**
- **Access Token:** 7 minutes (for API requests)
- **Refresh Token:** 15 days (for obtaining new access tokens)

When your access token expires, use the refresh endpoint to get a new one without re-logging in.
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

## Swagger / API Documentation

Interactive API documentation is available using Swagger UI:

### Accessing the Documentation

```
http://localhost:3000/api-docs
```

### Features

- **Interactive Testing:** Try API endpoints directly from the browser
- **Schema Documentation:** View request/response schemas for all endpoints
- **Authentication:** Built-in Bearer token input for testing protected endpoints
- **Auto-generated:** Documentation is automatically generated from route definitions

### Using Swagger UI

1. Navigate to `http://localhost:3000/api-docs` in your browser
2. Click the **Authorize** button (lock icon) in the top right
3. Enter your Bearer token in the format: `Bearer <your_access_token>`
4. Click **Authorize** and then **Close**
5. Expand any endpoint and click **Try it out** to test it
6. Click **Execute** to send the request

### Auto-generation Process

The Swagger documentation is automatically generated before the server starts:

```bash
# The generation happens automatically when running:
npm start      # Production mode
npm run dev    # Development mode
```

The `swagger.js` file reads your route definitions and generates `swagger-output.json`. **Do not manually edit `swagger-output.json`** as it will be overwritten on the next server startup.

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
- ✅ CORS configured for origin restriction
- ✅ Security headers ready for configuration

### CORS Configuration

**Current Configuration:**

| Setting | Value |
|---------|-------|
| **Allowed Origins** | `http://localhost:3000` |
| **Allowed Methods** | GET, POST, PATCH, DELETE |
| **Allowed Headers** | Content-Type, Authorization |
| **Credentials** | Enabled (cookies included) |

### Authentication Headers

All protected API endpoints require the following header:

```
Authorization: Bearer <access_token>
```

Example:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiI..." \
  https://api.example.com/api/v1/tasks
```

### Security Recommendations

1. **Always use HTTPS in production** - Update Swagger configuration and CORS origins
2. **Implement CORS policies** - Whitelist only trusted domains
3. **Enable security headers** - Consider using Helmet.js for additional protection
4. **Regularly rotate JWT secrets** - Change `JWT_SECRET` periodically in production
5. **Monitor rate limit thresholds** - Adjust limits based on traffic patterns
6. **Use strong passwords** - Enforced by validator (minimum requirements apply)
7. **Implement request logging** - Track all API calls for audit trails
8. **Keep dependencies updated** - Regularly run `npm audit` and update packages
9. **Restrict CORS origins** - Never use wildcard (`*`) in production
10. **Secure refresh tokens** - Ensure HTTP-only cookie flags are set
11. **Monitor API documentation access** - Swagger UI is publicly accessible at `/api-docs`

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

### CORS Configuration for Production

Update `src/app.js` to configure CORS for your production domain:

```javascript
app.use(
  cors({
    origin: [
      'https://yourdomain.com',
      'https://www.yourdomain.com',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)
```

**Important:** Replace with your actual production domain(s). Do not allow unrestricted origins (`*`) in production.

### Swagger Configuration for Production

Update `swagger.js` to use HTTPS scheme and your production domain:

```javascript
const doc = {
  info: {
    title: "Task Management API",
    description: "API documentation for Task Management system",
  },
  host: "yourdomain.com",        // Change to production domain
  schemes: ["https"],             // Change from http to https
  basePath: "/api/v1",           // Optional: update base path
  // ... rest of configuration
};
```

Then regenerate documentation by running:

```bash
npm start
```

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
