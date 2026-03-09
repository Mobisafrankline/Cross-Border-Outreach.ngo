import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Globe,
  MessageCircle,
  Send,
} from "lucide-react";

import { FaPinterestP, FaMediumM } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo.png"
                alt="Cross-borders Outreach Logo"
                className="w-12 h-12 object-contain"
              />
              <div>
                <div className="font-bold text-white text-lg leading-tight">
                  Cross-borders Outreach
                </div>
                <div className="text-xs text-gray-400">
                  Ministry Inc
                </div>
              </div>
            </div>

            <p className="text-gray-400 mb-6">
              Transforming lives across borders through compassion, dedication, and sustainable community impact.
            </p>

            {/* Social Media */}
            <div className="flex flex-wrap gap-3">

              <a href="https://www.facebook.com/profile.php?id=61582215896020" target="_blank" rel="noopener noreferrer"
                className="social-btn hover:bg-blue-600">
                <Facebook className="icon" />
              </a>

              <a href="https://x.com/CrossbordersO" target="_blank" rel="noopener noreferrer"
                className="social-btn hover:bg-black">
                <Twitter className="icon" />
              </a>

              <a href="https://www.instagram.com/crossbordersoutreach/" target="_blank" rel="noopener noreferrer"
                className="social-btn hover:bg-pink-600">
                <Instagram className="icon" />
              </a>

              <a href="https://www.linkedin.com/company/crossborders-outreach" target="_blank" rel="noopener noreferrer"
                className="social-btn hover:bg-blue-700">
                <Linkedin className="icon" />
              </a>

              <a href="https://www.youtube.com/@crossbordersoutreach" target="_blank" rel="noopener noreferrer"
                className="social-btn hover:bg-red-600">
                <Youtube className="icon" />
              </a>

              <a href="https://www.pinterest.com/Crossbordersoutreach/" target="_blank" rel="noopener noreferrer"
                className="social-btn hover:bg-red-600">
                <FaPinterestP className="icon text-white text-lg" />
              </a>

              <a href="https://medium.com/@crossbordersoutreach" target="_blank" rel="noopener noreferrer"
                className="social-btn hover:bg-green-700">
                <FaMediumM className="icon text-white text-lg" />
              </a>

              <a href="https://wa.me/+14049806138" target="_blank" rel="noopener noreferrer"
                className="social-btn hover:bg-green-600">
                <MessageCircle className="icon" />
              </a>

              <a href="https://t.me/" target="_blank" rel="noopener noreferrer"
                className="social-btn hover:bg-blue-500">
                <Send className="icon" />
              </a>

              <a href="https://github.com/Mobisafrankline" target="_blank" rel="noopener noreferrer"
                className="social-btn hover:bg-gray-700">
                <Github className="icon" />
              </a>

            </div>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Our Programs</h3>
            <ul className="space-y-3">
              <li><a href="/food-support" className="footer-link">Food Support</a></li>
              <li><a href="/education" className="footer-link">Education Support</a></li>
              <li><a href="/healthcare" className="footer-link">Healthcare Outreach</a></li>
              <li><a href="/economic" className="footer-link">Economic Empowerment</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="/mission" className="footer-link">Mission & Vision</a></li>
              <li><a href="/impact" className="footer-link">Impact Stories</a></li>
              <li><a href="/reports" className="footer-link">Annual Reports</a></li>
              <li><a href="/volunteer" className="footer-link">Volunteer</a></li>
              <li><a href="/partner" className="footer-link">Partner With Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
                <span className="text-gray-400">
                  {/* 140 West Skyline View,<br /> */}
                  Dallas, GA<br />
                  United States
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <a href="tel:+14049806138" className="footer-link">
                  +1 (404) 980 6138
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <a href="mailto:info@crossbordersoutreach.org" className="footer-link">
                  info@cross-bordersoutreach.ngo
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2026 Cross-borders Outreach Ministry Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="/privacy" className="footer-link text-sm">Privacy Policy</a>
            <a href="/terms" className="footer-link text-sm">Terms of Service</a>
            <a href="/accessibility" className="footer-link text-sm">Accessibility</a>
          </div>
        </div>
      </div>

      {/* Reusable Styles */}
      <style jsx>{`
        .social-btn {
          width: 40px;
          height: 40px;
          background: #1f2937;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s;
        }

        .icon {
          width: 20px;
          height: 20px;
          color: white;
        }

        .footer-link {
          color: #9ca3af;
          transition: 0.3s;
        }

        .footer-link:hover {
          color: #60a5fa;
        }
      `}</style>

    </footer>
  );
}