import { Outlet } from "react-router";
import TwoLayerNavbar from "./TwoLayerNavbar";
import Footer from "./Footer";
import { GoogleTranslateInit } from "./GoogleTranslate";
import CustomerSupportChat from "./CustomerSupportChat";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <GoogleTranslateInit />
      <TwoLayerNavbar />
      {/* The navbar is fixed to the top. Mobile: 56px (pt-14), Desktop: 112px (lg:pt-28). */}
      <main className="flex-1 pt-14 lg:pt-28">
        <Outlet />
      </main>
      <Footer />
      <CustomerSupportChat />
    </div>
  );
}