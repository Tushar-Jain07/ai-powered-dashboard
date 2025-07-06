# AI-Powered Dashboard Backend

This is the backend API for the AI-Powered Dashboard application.

## Setup

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=5000
CLIENT_URL=https://your-frontend-url.vercel.app
```

## Deployment

This backend can be deployed to Render.com:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add the environment variables
5. Deploy

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/analytics` - Get analytics data 