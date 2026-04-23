import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
import '../i18n/config';

export default function App() {
  return <RouterProvider router={router} />;
}