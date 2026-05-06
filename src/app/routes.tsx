import { createBrowserRouter, Navigate } from "react-router";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RouteErrorBoundary from "./components/RouteErrorBoundary";

// Public Pages
import Home from "./pages/Home";
import FoodSupport from "./pages/FoodSupport";
import Education from "./pages/Education";
import Healthcare from "./pages/Healthcare";
import Economic from "./pages/Economic";
import Donate from "./pages/Donate";
import Volunteer from "./pages/Volunteer";
import Partner from "./pages/Partner";
import Fundraise from "./pages/Fundraise";
import Blog from "./pages/Blog";
import ImpactStories from "./pages/ImpactStories";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Gallery from "./pages/Gallery";
import Mission from "./pages/Mission";
import Team from "./pages/Team";
import Partners from "./pages/Partners";
import Reports from "./pages/Reports";
import Contact from "./pages/Contact";
import Publications from "./pages/Publications";
import AuthPortal from "./pages/AuthPortal";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminContentEditor from "./pages/admin/AdminContentEditor";
import AdminUsers from "./pages/admin/AdminUsers";

// Donor Pages
import DonorDashboard from "./pages/donor/DonorDashboard";
import DonorProfile from "./pages/donor/DonorProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, Component: Home },
      { path: "food-support", Component: FoodSupport },
      { path: "education", Component: Education },
      { path: "healthcare", Component: Healthcare },
      { path: "economic", Component: Economic },
      { path: "donate", Component: Donate },
      { path: "volunteer", Component: Volunteer },
      { path: "partner", Component: Partner },
      { path: "fundraise", Component: Fundraise },
      { path: "blog", Component: Blog },
      { path: "impact", Component: ImpactStories },
      { path: "news", Component: News },
      { path: "news/:id", Component: NewsArticle },
      { path: "events", Component: Events },
      { path: "events/:id", Component: EventDetail },
      { path: "gallery", Component: Gallery },
      { path: "mission", Component: Mission },
      { path: "team", Component: Team },
      { path: "partners", Component: Partners },
      { path: "reports", Component: Reports },
      { path: "contact", Component: Contact },
      { path: "publications", Component: Publications },
      { path: "login", Component: AuthPortal },
    ],
  },
  {
    path: "/admin",
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "login", element: <Navigate to="/login?type=admin" replace /> },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute redirectTo="/admin/login">
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "gallery",
        element: (
          <ProtectedRoute redirectTo="/admin/login">
            <AdminGallery />
          </ProtectedRoute>
        ),
      },
      {
        path: ":type/new",
        element: (
          <ProtectedRoute redirectTo="/admin/login">
            <AdminContentEditor />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute redirectTo="/admin/login">
            <AdminUsers />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/donor",
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "login", element: <Navigate to="/login?type=donor" replace /> },
      { path: "register", element: <Navigate to="/login?type=donor&mode=register" replace /> },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute redirectTo="/donor/login">
            <DonorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute redirectTo="/donor/login">
            <DonorProfile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
