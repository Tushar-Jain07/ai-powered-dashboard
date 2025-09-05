# AI-Powered Dashboard Backend

A production-ready Node.js backend for the AI-Powered Analytics Dashboard.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Data Management**: CRUD operations for user data with validation
- **AI Integration**: OpenAI GPT-3.5-turbo for chat functionality
- **Security**: Rate limiting, input validation, XSS protection, CORS
- **Logging**: Comprehensive logging with Winston
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Database**: MongoDB with Mongoose ODM
- **API Documentation**: RESTful API with proper validation

## Quick Start

### Prerequisites

- Node.js 14+ 
- MongoDB (local or cloud)
- OpenAI API key

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ai-dashboard
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key
   NODE_ENV=development
   ```

3. **Start the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/change-password` - Change password

### Data Management
- `GET /api/data` - Get user's data entries (with pagination & filtering)
- `GET /api/data/:id` - Get single data entry
- `POST /api/data` - Create new data entry
- `POST /api/data/bulk` - Bulk create data entries
- `PUT /api/data/:id` - Update data entry
- `DELETE /api/data/:id` - Delete data entry
- `GET /api/data/stats` - Get user statistics
- `GET /api/data/export` - Export user data (JSON/CSV)

### AI Chat
- `POST /api/chat` - Chat with AI (non-streaming)
- `GET /api/chat/stream` - Chat with AI (streaming)
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/history` - Clear chat history
- `GET /api/chat/status` - Get AI service status

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/stats` - Get user statistics
- `GET /api/user/activity` - Get user activity log
- `GET /api/user` - Get all users (admin only)
- `GET /api/user/:id` - Get user by ID (admin only)
- `PUT /api/user/:id` - Update user (admin only)
- `DELETE /api/user/:id` - Delete user (admin only)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/analytics` - Get analytics data
- `GET /api/dashboard/widgets` - Get widget configuration
- `PUT /api/dashboard/widgets` - Update widget configuration
- `GET /api/dashboard/alerts` - Get dashboard alerts
- `PUT /api/dashboard/alerts/:id/read` - Mark alert as read
- `GET /api/dashboard/performance` - Get performance metrics

### System
- `GET /api/health` - Health check
- `GET /api/test` - Test endpoint

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` | No |
| `OPENAI_API_KEY` | OpenAI API key | - | No |
| `PORT` | Server port | `5005` | No |
| `NODE_ENV` | Environment | `development` | No |
| `ALLOWED_ORIGINS` | CORS allowed origins | - | No |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` | No |
| `RATE_LIMIT_MAX_REQUESTS` | Rate limit max requests | `100` | No |
| `BCRYPT_ROUNDS` | Bcrypt salt rounds | `12` | No |
| `LOG_LEVEL` | Logging level | `info` | No |

## Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Comprehensive validation using express-validator
- **XSS Protection**: Prevents cross-site scripting attacks
- **NoSQL Injection Protection**: Sanitizes MongoDB queries
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with configurable rounds
- **Account Lockout**: Prevents brute force attacks

## Error Handling

The API uses a centralized error handling system:

```javascript
{
  "success": false,
  "error": "Error message",
  "details": [] // Validation errors (development only)
}
```

## Logging

Comprehensive logging with Winston:

- **Console**: Development logging with colors
- **Files**: Error and combined logs in `logs/` directory
- **HTTP Requests**: Morgan middleware for request logging
- **Security Events**: Authentication and authorization events
- **API Usage**: Track API endpoint usage

## Database Models

### User
- Authentication and profile information
- Role-based access control
- Preferences and settings
- Account security features

### DataEntry
- User data entries with validation
- Category and tag support
- Metadata tracking
- Soft delete functionality

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Linting

```bash
# Check for linting errors
npm run lint

# Fix linting errors
npm run lint:fix
```

## Production Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure MongoDB Atlas or production database
4. Set up proper CORS origins
5. Configure rate limiting
6. Set up monitoring and logging

### Vercel Deployment
The backend is configured for Vercel serverless deployment:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5005
CMD ["npm", "start"]
```

## Monitoring

- **Health Checks**: `/api/health` endpoint
- **Performance Metrics**: Response times and error rates
- **Security Logging**: Authentication and authorization events
- **API Usage**: Track endpoint usage and performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and tests
6. Submit a pull request

## License

MIT