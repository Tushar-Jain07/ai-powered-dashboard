import { RouteObject } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import SignIn from '../pages/SignIn';

export const routes: RouteObject[] = [
  {
    path: '/signin',
    element: <SignIn />
  },
  {
    path: '/',
    element: <Dashboard />
  }
];

export default routes;