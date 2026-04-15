import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";

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
import Gallery from "./pages/Gallery";
import Mission from "./pages/Mission";
import Team from "./pages/Team";
import Partners from "./pages/Partners";
import Reports from "./pages/Reports";
import Contact from "./pages/Contact";
import Publications from "./pages/Publications";
import Login from "./pages/Login";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminContentEditor from "./pages/admin/AdminContentEditor";
import AdminDonors from "./pages/admin/AdminDonors";

// Donor Pages
import DonorLogin from "./pages/donor/DonorLogin";
import DonorRegister from "./pages/donor/DonorRegister";
import DonorDashboard from "./pages/donor/DonorDashboard";
import DonorProfile from "./pages/donor/DonorProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
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
      { path: "gallery", Component: Gallery },
      { path: "mission", Component: Mission },
      { path: "team", Component: Team },
      { path: "partners", Component: Partners },
      { path: "reports", Component: Reports },
      { path: "contact", Component: Contact },
      { path: "publications", Component: Publications },
      { path: "login", Component: Login },
    ],
  },
  {
    path: "/admin",
    children: [
      { path: "login", Component: AdminLogin },
      { path: "dashboard", Component: AdminDashboard },
      { path: "gallery", Component: AdminGallery },
      { path: ":type/new", Component: AdminContentEditor },
      { path: "donors", Component: AdminDonors },
    ],
  },
  {
    path: "/donor",
    children: [
      { path: "login", Component: DonorLogin },
      { path: "register", Component: DonorRegister },
      { path: "dashboard", Component: DonorDashboard },
      { path: "profile", Component: DonorProfile },
    ],
  },
]);
