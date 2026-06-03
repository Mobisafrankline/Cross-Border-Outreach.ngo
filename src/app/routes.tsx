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
import HelpingFamilies from "./pages/HelpingFamilies";
import Donate from "./pages/Donate";
import Opportunities from "./pages/Opportunities";
import Partner from "./pages/Partner";
import Fundraise from "./pages/Fundraise";
import Blog from "./pages/Blog";
import ImpactStories from "./pages/ImpactStories";
import News from "./pages/News";
import { COBNewsLayout, COBNewsHome, COBNewsSignUp, COBNewsLogin, COBNewsArticle } from "./pages/cob-news";
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
import InitiativeDetail from "./pages/InitiativeDetail";

// Admin Pages
import AdminLayout from "./components/portal/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminContentEditor from "./pages/admin/AdminContentEditor";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminNewsChannel from "./pages/admin/AdminNewsChannel";

// Donor Pages
import DonorLayout from "./components/portal/DonorLayout";
import DonorDashboard from "./pages/donor/DonorDashboard";
import DonorProfile from "./pages/donor/DonorProfile";

// Shared Portal Pages
import ProfileSettings from "./pages/portal/ProfileSettings";

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
      { path: "helping-families", Component: HelpingFamilies },
      { path: "donate", Component: Donate },
      { path: "opportunities", Component: Opportunities },
      { path: "partner", Component: Partner },
      { path: "fundraise", Component: Fundraise },
      { path: "blog", Component: Blog },
      { path: "initiatives/:id", Component: InitiativeDetail },
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
    path: "/global-news",
    Component: COBNewsLayout,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, Component: COBNewsHome },
      { path: "sign-up", Component: COBNewsSignUp },
      { path: "login", Component: COBNewsLogin },
      { path: "article/:id", Component: COBNewsArticle },
    ],
  },
  {
    path: "/admin",
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "login", element: <Navigate to="/login?type=admin" replace /> },
      {
        // All protected admin routes wrapped in AdminLayout
        element: (
          <ProtectedRoute redirectTo="/admin/login">
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", Component: AdminDashboard },
          { path: "gallery", Component: AdminGallery },
          { path: ":type/new", Component: AdminContentEditor },
          { path: "users", Component: AdminUsers },
          { path: "reports", Component: AdminReports },
          { path: "jobs", Component: AdminJobs },
          { path: "applications", Component: AdminApplications },
          { path: "news-channel", Component: AdminNewsChannel },
          { path: "profile", Component: ProfileSettings },
        ],
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
        // All protected donor routes wrapped in DonorLayout
        element: (
          <ProtectedRoute redirectTo="/donor/login">
            <DonorLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", Component: DonorDashboard },
          { path: "profile", Component: ProfileSettings },
          { path: "profile-legacy", Component: DonorProfile },
        ],
      },
    ],
  },
]);
