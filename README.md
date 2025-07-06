# 🤖 AI-Powered Analytics Dashboard

A modern, full-stack analytics dashboard built with React, Node.js, and Material-UI. Features real-time data visualization, machine learning model management, and interactive analytics with a beautiful, responsive design.

![Dashboard Preview](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.0-green)
![Material UI](https://img.shields.io/badge/Material%20UI-5.0-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 📊 **Analytics & Visualization**
- **Interactive Charts**: Line, Bar, Pie, and Area charts using Recharts
- **Real-time Data**: Live updates via WebSocket connections
- **KPI Cards**: Real-time metrics with trend indicators
- **Data Tables**: Searchable and paginated data displays
- **Advanced Analytics**: Multi-dimensional data analysis

### 🔐 **Authentication & Security**
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for different user roles
- **Protected Routes**: Secure access to dashboard features
- **Session Management**: Automatic token refresh and validation

### 🎨 **Modern UI/UX**
- **Material UI Design**: Beautiful, consistent component library
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes
- **Intuitive Navigation**: Easy-to-use sidebar navigation
- **Loading States**: Smooth loading animations and feedback

### 🤖 **AI & ML Features**
- **Machine Learning Models**: Model management and deployment
- **Performance Metrics**: Real-time model performance tracking
- **Feature Importance**: Visual representation of model features
- **Prediction Capabilities**: Real-time predictions and forecasts
- **Model Training**: Automated model training pipelines

### 📈 **Data Management**
- **Multiple Data Sources**: Connect to CSV, API, Database, and more
- **Real-time Synchronization**: Live data updates across all sources
- **Data Source Health**: Monitor connection status and performance
- **Schema Management**: Automatic schema detection and validation
- **Data Export**: Export reports in various formats (PDF, CSV, Excel)

### 📋 **Dashboard Management**
- **Customizable Widgets**: Drag-and-drop widget placement
- **Multiple Dashboards**: Create and manage multiple dashboard views
- **Dashboard Sharing**: Share dashboards with team members
- **Template Library**: Pre-built dashboard templates

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI-Powered-Dashboard
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   node src/index.js
   ```
   Backend will run on: `http://localhost:5000`

2. **Start the frontend application**
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on: `http://localhost:3000`

3. **Access the application**
   Open your browser and go to: `http://localhost:3000`

## 📁 Project Structure

```
AI-Powered Dashboard/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   └── index.js        # Main server file with all endpoints
│   ├── package.json        # Backend dependencies
│   └── node_modules/       # Backend packages
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components (Login, Dashboard, etc.)
│   │   ├── contexts/      # React contexts (Auth, Theme, Notifications)
│   │   ├── services/      # API services and utilities
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── types/         # TypeScript type definitions
│   │   ├── App.tsx        # Main App component
│   │   └── index.tsx      # React entry point
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── node_modules/      # Frontend packages
├── README.md              # Project documentation
└── .gitignore            # Git ignore rules
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type safety and better development experience
- **Material-UI 5** - Beautiful component library
- **Recharts** - Powerful charting library
- **React Router 6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Token authentication
- **CORS** - Cross-origin resource sharing

## 🔧 Configuration

### Environment Variables

Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```env
PORT=5000
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📊 Dashboard Features

### 🏠 **Main Dashboard**
- Overview of key performance indicators
- Real-time sales and revenue charts
- Customer distribution visualization
- Recent activity feed
- Quick action buttons

### 📊 **Data Sources**
- Connect to multiple data sources
- Monitor connection health
- View data schemas
- Real-time data synchronization
- Data source configuration

### 🤖 **ML Models**
- Machine learning model management
- Model performance metrics
- Feature importance analysis
- Prediction capabilities
- Model training status

### 📈 **Reports**
- Custom report generation
- Export functionality (PDF, CSV, Excel)
- Scheduled reports
- Historical data analysis
- Report templates

### 👤 **User Management**
- User profile management
- Password change functionality
- Account settings
- Role management
- Session management

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile

### Health Check
- `GET /api/health` - Server status and health

### WebSocket Events
- `connection` - Client connects
- `disconnect` - Client disconnects
- `subscribe-to-dashboard` - Subscribe to dashboard updates
- `unsubscribe-from-dashboard` - Unsubscribe from updates

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the build folder to your hosting platform
```

### Backend Deployment (Heroku/Railway)
```bash
cd backend
# Set environment variables in your hosting platform
npm start
```

### Environment Variables for Production
```env
# Frontend
REACT_APP_API_URL=https://your-backend-url.com/api

# Backend
PORT=5000
CLIENT_URL=https://your-frontend-url.com
JWT_SECRET=your_production_jwt_secret
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Server-side validation for all inputs
- **Secure Headers** - Security headers for API responses
- **Role-based Access** - Different permissions for different users

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- **Desktop computers** (1920x1080 and above)
- **Tablets** (768px - 1024px)
- **Mobile phones** (320px - 768px)

## 🧪 Development

### Available Scripts

```bash
# Backend
npm start          # Start production server
npm run dev        # Start development server with nodemon

# Frontend
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### Code Style
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Consistent naming conventions

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill processes using ports 3000 and 5000
taskkill /F /IM node.exe
```

**Module not found errors**
```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

**Authentication issues**
- Clear browser localStorage
- Check JWT token expiration
- Verify API URL configuration

### Getting Help
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Include error messages and steps to reproduce

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material-UI** for the beautiful component library
- **Recharts** for the excellent charting library
- **React team** for the amazing framework
- **Node.js community** for the robust backend ecosystem

## 📞 Support

If you have any questions or need help:
- **Open an issue** in the repository
- **Check the documentation** for common solutions
- **Review existing issues** for similar problems

---

**Built with ❤️ using modern web technologies**

*This project demonstrates best practices in full-stack development with React, Node.js, and real-time data visualization.* 