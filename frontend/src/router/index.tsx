import { Navigate, useRoutes } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
};

const routes = [
  {
    path: '/signin',
    element: <SignIn />
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: '', element: <Navigate to="/dashboard" /> },
      { path: 'dashboard', element: <Dashboard /> },
      // ...other protected routes
    ]
  }
];