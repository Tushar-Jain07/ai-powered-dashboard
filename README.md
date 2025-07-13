# AI-Powered Dashboard

An interactive analytics dashboard with AI capabilities, built with React, TypeScript, Material-UI, and Node.js.

## Features

- Interactive dashboard with draggable and resizable widgets
- KPI cards and data visualization
- Data tables with filtering and sorting
- AI chat assistant integration (requires OpenAI API key)
- User authentication system
- Dark/light theme support
- Responsive design

## Local Development

1. Clone the repository
2. Create a `.env` file in the `backend` directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
3. Install dependencies:
   ```
   npm run install:all
   ```
4. Start the development servers:
   ```
   npm run dev
   ```
5. Access the application at `http://localhost:3003`

## Deployment on Vercel

This project is configured for easy deployment on Vercel using the included `vercel.json` configuration.

### Deployment Steps

1. Fork or clone this repository to your GitHub account
2. Sign up or log in to [Vercel](https://vercel.com)
3. Click "New Project" and import your repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: Leave empty (uses the repository root)
   - **Build Command**: Leave empty (defined in vercel.json)
   - **Output Directory**: Leave empty (defined in vercel.json)

5. Add Environment Variables:
   - `OPENAI_API_KEY`: Your OpenAI API key

6. Click "Deploy"

### Understanding the Deployment

The `vercel.json` configuration:
- Builds the frontend as a static site
- Deploys the backend as a serverless API
- Configures routing so the frontend can communicate with the backend
- All API calls are routed to the backend/api/index.js serverless function

## License

MIT # Vercel deployment trigger
