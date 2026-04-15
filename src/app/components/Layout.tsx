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
      {/* The navbar is fixed to the top and is exactly 117px tall (64px + 53px). We use inline style to guarantee padding and avoid Tailwind JIT misses. */}
      <main className="flex-1" style={{ paddingTop: '117px' }}>
        <Outlet />
      </main>
      <Footer />
      <CustomerSupportChat />
    </div>
  );
}