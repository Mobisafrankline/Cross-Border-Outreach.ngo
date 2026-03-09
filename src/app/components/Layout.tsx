import { Outlet } from "react-router";
import TwoLayerNavbar from "./TwoLayerNavbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <TwoLayerNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}