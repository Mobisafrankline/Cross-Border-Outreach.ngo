import { Link } from "react-router";
import { Mail, Phone, Heart, ArrowRight } from "lucide-react";

// Social Icons SVGs to ensure perfect rendering across all versions
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const MediumIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M6.729 17.518C3.014 17.518 0 14.048 0 9.759S3.014 2 6.729 2s6.73 3.469 6.73 7.759-3.015 7.759-6.73 7.759zm10.741 0c-1.849 0-3.348-3.469-3.348-7.759S15.621 2 17.47 2s3.348 3.469 3.348 7.759-1.5 7.759-3.348 7.759zm4.845-.371c-.928 0-1.685-3.3-1.685-7.388s.757-7.388 1.685-7.388 1.685 3.3 1.685 7.388-.757 7.388-1.685 7.388z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.65-.41 3.34-1.28 4.71-1.07 1.67-2.73 2.87-4.66 3.33-1.92.46-4.04.38-5.87-.41-1.83-.8-3.32-2.28-4.14-4.08-.82-1.81-.97-3.95-.36-5.84.6-1.88 1.83-3.48 3.51-4.43 1.68-.96 3.73-1.26 5.61-.83v4.11c-.55-.21-1.16-.27-1.74-.18-.58.08-1.13.33-1.57.73-.44.39-.77.92-.93 1.5-.16.57-.14 1.19.04 1.75.19.56.55 1.05 1.04 1.39.48.33 1.08.5 1.67.48.59-.02 1.16-.24 1.62-.61.45-.37.78-.88.94-1.45.09-.32.14-.65.13-.98V.02z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Facebook", icon: <FacebookIcon />, href: "https://www.facebook.com/profile.php?id=61582215896020", color: "hover:bg-[#1877F2]" },
    { name: "Instagram", icon: <InstagramIcon />, href: "https://www.instagram.com/crossbordersoutreach/", color: "hover:bg-[#E4405F]" },
    { name: "LinkedIn", icon: <LinkedinIcon />, href: "https://www.linkedin.com/company/crossborders-outreach", color: "hover:bg-[#0A66C2]" },
    { name: "Medium", icon: <MediumIcon />, href: "https://medium.com/@crossbordersoutreach", color: "hover:bg-[#000000]" },
    { name: "X", icon: <XIcon />, href: "https://x.com/CrossbordersO", color: "hover:bg-[#000000]" },
    { name: "TikTok", icon: <TiktokIcon />, href: "#", color: "hover:bg-[#000000]" },
    { name: "YouTube", icon: <YoutubeIcon />, href: "https://www.youtube.com/@crossbordersoutreach", color: "hover:bg-[#FF0000]" },
  ];

  const quickLinks = [
    { label: "Mission & Vision", href: "/mission" },
    { label: "Impact Stories", href: "/impact" },
    { label: "Annual Reports", href: "/reports" },
    { label: "Volunteer", href: "/volunteer" },
    { label: "Partner With Us", href: "/partner" },
  ];

  const programs = [
    { label: "Food Support", href: "/food-support" },
    { label: "Education Support", href: "/education" },
    { label: "Healthcare Outreach", href: "/healthcare" },
    { label: "Economic Empowerment", href: "/economic" },
  ];

  return (
    <footer className="bg-[#0B132B] text-slate-300 relative overflow-hidden pt-12">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600 rounded-full opacity-5 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full opacity-5 blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* CTA Banner Area */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="bg-gradient-to-br from-blue-900/50 to-slate-900/50 border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-sm shadow-2xl">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Ready to make a lasting impact?
              </h2>
              <p className="text-blue-100/80 text-lg">
                Join our mission today. Your contribution, whether time or resources, helps build stronger communities worldwide.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
              <Link 
                to="/donate" 
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/25 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Donate Now
              </Link>
              <Link 
                to="/volunteer" 
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Get Involved
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <Link to="/" className="flex items-center gap-3 mb-6 group inline-flex">
                <div className="bg-white p-2 rounded-xl group-hover:scale-105 transition-transform duration-300">
                  <img
                    src="/logo.png"
                    alt="Cross-borders Outreach Logo"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div>
                  <div className="font-bold text-white text-xl tracking-wide">
                    Crossborders
                  </div>
                  <div className="text-sm font-medium text-blue-400">
                    Outreach Ministry Inc
                  </div>
                </div>
              </Link>
              <p className="text-slate-400 leading-relaxed mb-8 pr-4">
                Transforming lives across borders through compassion, dedication, and sustainable community impact. We believe in empowering communities for a brighter, self-reliant future.
              </p>
              
              {/* Social Media Grid */}
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.name}`}
                    className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 transition-all duration-300 ${social.color} hover:text-white hover:-translate-y-1 hover:shadow-lg`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="lg:col-span-2 lg:col-start-6">
              <h3 className="text-white font-bold tracking-wider uppercase text-sm mb-6">Quick Links</h3>
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href} 
                      className="text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500/0 group-hover:bg-blue-500 transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs Column */}
            <div className="lg:col-span-2 lg:col-start-8">
              <h3 className="text-white font-bold tracking-wider uppercase text-sm mb-6">Our Programs</h3>
              <ul className="space-y-4">
                {programs.map((prog) => (
                  <li key={prog.label}>
                    <Link 
                      to={prog.href} 
                      className="text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500/0 group-hover:bg-blue-500 transition-colors" />
                      {prog.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div className="lg:col-span-3 lg:col-start-10">
              <h3 className="text-white font-bold tracking-wider uppercase text-sm mb-6">Contact Us</h3>
              <ul className="space-y-5">
                <li>
                  <a 
                    href="tel:+14049806138" 
                    className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-blue-600/20 group-hover:border-blue-500/30 transition-colors">
                      <Phone className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Phone</div>
                      <div className="font-medium">+1 (404) 980 6138</div>
                    </div>
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:info@cross-bordersoutreach.ngo" 
                    className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-blue-600/20 group-hover:border-blue-500/30 transition-colors">
                      <Mail className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Email</div>
                      <div className="font-medium break-all">info@cross-bordersoutreach.ngo</div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/20">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm font-medium text-center md:text-left">
              &copy; {currentYear} Crossborders Outreach Ministry Inc. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/privacy" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/accessibility" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}