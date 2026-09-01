import { useState, useEffect, useRef } from "react";
import {
  Heart,
  Utensils,
  GraduationCap,
  Stethoscope,
  TrendingUp,
  DollarSign,
  Users,
  Handshake,
  Gift,
  BookOpen,
  Award,
  FileText,
  Target,
  Globe,
  UserCircle,
  Building2,
  BarChart3,
  Menu,
  X,
  LogIn,
  Search,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router";
import { DesktopLanguageSelector, MobileLanguageSelector } from "./GoogleTranslate";

export default function TwoLayerNavbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileExpandedItem(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusableSelectors = [
      'a[href]', 'button:not([disabled])', 'input:not([disabled])',
      'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])'
    ];

    const getFocusable = () =>
      Array.from(drawer.querySelectorAll<HTMLElement>(focusableSelectors.join(',')));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const focusable = getFocusable();
    if (focusable.length > 0) focusable[0].focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const menuItems = [
    {
      label: "What We Do",
      dropdown: [
        {
          label: "Food Support",
          href: "/food-support",
          icon: <Utensils className="w-5 h-5" />,
          description: "Providing nutritious meals to communities"
        },
        {
          label: "Education Support",
          href: "/education",
          icon: <GraduationCap className="w-5 h-5" />,
          description: "Empowering through quality education"
        },
        {
          label: "Health Outreach",
          href: "/healthcare",
          icon: <Stethoscope className="w-5 h-5" />,
          description: "Accessible healthcare for all"
        },
        {
          label: "Economic Empowerment",
          href: "/economic",
          icon: <TrendingUp className="w-5 h-5" />,
          description: "Building sustainable livelihoods"
        },
        {
          label: "Helping Needy Families",
          href: "/helping-families",
          icon: <Heart className="w-5 h-5" />,
          description: "Supporting vulnerable families"
        }
      ]
    },
    {
      label: "Ways to Give",
      dropdown: [
        {
          label: "Donate",
          href: "/donate",
          icon: <DollarSign className="w-5 h-5" />,
          description: "Make a financial contribution"
        },
        {
          label: "Partner with Us",
          href: "/partner",
          icon: <Handshake className="w-5 h-5" />,
          description: "Corporate and organizational partnerships"
        },
        {
          label: "Fundraise",
          href: "/fundraise",
          icon: <Gift className="w-5 h-5" />,
          description: "Start your own fundraising campaign"
        }
      ]
    },
    {
      label: "Stories",
      dropdown: [
        {
          label: "Blog",
          href: "/blog",
          icon: <BookOpen className="w-5 h-5" />,
          description: "Read our latest updates"
        },
        {
          label: "Company News",
          href: "/company-news",
          icon: <FileText className="w-5 h-5" />,
          description: "Official company announcements"
        },

        {
          label: "Publications",
          href: "/publications",
          icon: <BookOpen className="w-5 h-5" />,
          description: "Latest publications"
        }
      ]
    },
    {
      label: "About Us",
      dropdown: [
        {
          label: "Mission and Vision",
          href: "/mission",
          icon: <Target className="w-5 h-5" />,
          description: "Our purpose and goals"
        },
        {
          label: "Team",
          href: "/team",
          icon: <UserCircle className="w-5 h-5" />,
          description: "Meet the people behind our work"
        },
        {
          label: "Partners",
          href: "/partners",
          icon: <Building2 className="w-5 h-5" />,
          description: "Organizations we work with"
        },
        {
          label: "Opportunities",
          href: "/opportunities",
          icon: <Users className="w-5 h-5" />,
          description: "Give your time and skills"
        }
      ]
    }
  ];

  const utilityLinks = [
    { label: "Help", href: "/contact" }
  ];

  // Secondary navigation links (bottom bar)
  const secondaryNavItems = [
    { label: "What We Do", hasDropdown: true, key: "What We Do" },
    { label: "Ways to Give", hasDropdown: true, key: "Ways to Give" },
    { label: "Stories", hasDropdown: true, key: "Stories" },
    { label: "About Us", hasDropdown: true, key: "About Us" },
    { label: "Events", href: "/events" },
    { label: "Gallery", href: "/gallery" },
    { label: "Reports", href: "/reports" },
    { label: "Impact Stories", href: "/impact" },
  ];

  return (
    <nav
      id="main-nav"
      ref={dropdownRef}
      className="fixed top-0 left-0 right-0 z-50 shadow-md"
    >
      {/* ═══ TOP BAR — Gabriel Style Off-White Strip ═══ */}
      <div className="relative z-20 bg-offwhite border-b border-slate-200">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6"
          style={{
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
            paddingRight: 'max(1rem, env(safe-area-inset-right))'
          }}
        >
          <div className="flex items-center justify-between h-14">
            {/* Logo + Org Name (top bar) */}
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2.5 group flex-shrink-0 min-w-0 pr-1">
              <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shrink-0">
                <img
                  src="/logo.png"
                  alt="Crossborders Outreach Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-navy-900 truncate">
                <div className="font-extrabold text-[12px] sm:text-[15px] leading-tight tracking-tight truncate">The Cross Borders</div>
                <div className="text-[9px] sm:text-[11px] text-slate-500 font-bold tracking-widest uppercase leading-none mt-0.5">Outreach International</div>
              </div>
            </Link>

            {/* Utility links + actions (right side) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {utilityLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-2.5 py-1 text-slate-600 hover:text-blue-700 text-xs font-bold uppercase tracking-wider transition-colors hidden sm:inline-flex items-center"
                >
                  {link.label}
                </Link>
              ))}

              <DesktopLanguageSelector />

              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 px-3 py-1 text-slate-600 hover:text-blue-700 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>

              {/* Partner CTA */}
              <Link
                to="/partner"
                className="hidden md:flex px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded text-sm font-bold transition-colors whitespace-nowrap items-center gap-1.5 border border-sky-700 shadow-sm"
              >
                <Handshake className="w-4 h-4" />
                Partner With Us
              </Link>

              {/* Donate CTA - always visible */}
              <Link
                to="/donate"
                className="flex px-4 sm:px-5 py-2 bg-gold-500 hover:bg-gold-600 text-navy-900 rounded text-sm font-bold transition-colors whitespace-nowrap items-center gap-1.5 shadow-sm"
              >
                <Heart className="w-4 h-4 hidden sm:block" />
                Donate
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-800 hover:bg-slate-100 rounded transition-colors duration-200 border border-slate-200"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BOTTOM BAR — White main navigation ═══ */}
      <div className="hidden lg:block relative z-10 bg-white border-b-2 border-gold-400">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6"
          style={{
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
            paddingRight: 'max(1rem, env(safe-area-inset-right))'
          }}
        >
          <div className="hidden lg:flex items-center justify-center h-14 w-full">
            {/* Navigation Items */}
            <div className="flex items-center gap-2">
              {secondaryNavItems.map((item) => {
                if (item.hasDropdown) {
                  const menuGroup = menuItems.find(m => m.label === item.key);
                  if (!menuGroup) return null;

                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => handleDropdownEnter(item.label)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                        aria-expanded={activeDropdown === item.label}
                        aria-haspopup="true"
                        className={`flex items-center gap-1 px-4 py-3 text-slate-800 hover:text-blue-700 hover:bg-slate-50 font-bold transition-all duration-200 text-sm border-b-2 ${
                          activeDropdown === item.label
                            ? 'bg-slate-50 text-blue-700 border-blue-700'
                            : 'border-transparent'
                        }`}
                      >
                        {item.label}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        }`} />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, y: -5, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -5, scale: 0.98 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute top-full left-0 pt-1 z-50"
                          >
                            <div className="w-[320px] bg-white rounded-lg shadow-xl border border-slate-100 py-2.5 overflow-hidden">
                              {menuGroup.dropdown.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  to={subItem.href}
                                  onClick={() => setActiveDropdown(null)}
                                  className={`flex items-start gap-3.5 px-4 py-3.5 hover:bg-orange-50 transition-all duration-150 group relative ${location.pathname === subItem.href ? 'bg-orange-50' : ''}`}
                                >
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${location.pathname === subItem.href
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-orange-100 text-blue-700 group-hover:bg-blue-700 group-hover:text-white'
                                    }`}>
                                    {subItem.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className={`font-bold transition-colors duration-150 ${location.pathname === subItem.href
                                      ? 'text-blue-700'
                                      : 'text-slate-800 group-hover:text-blue-700'
                                      }`}>
                                      {subItem.label}
                                    </div>
                                    <div className="text-sm text-slate-500 mt-0.5 truncate">
                                      {subItem.description}
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                // Plain link (Events, Gallery, Contact)
                return (
                  <Link
                    key={item.label}
                    to={item.href!}
                    className={`px-4 py-3 text-sm font-bold transition-all duration-200 border-b-2 ${
                      location.pathname === item.href
                        ? 'bg-slate-50 text-blue-700 border-blue-700'
                        : 'text-slate-800 hover:text-blue-700 hover:bg-slate-50 border-transparent'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Mobile Menu Overlay ═══ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              aria-hidden="true"
            />

            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              ref={drawerRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-2xl lg:hidden overflow-y-auto"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <div className="p-4 border-b border-gray-200 bg-offwhite">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="text-navy-900 font-extrabold text-lg">Menu</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-1">
                {menuItems.map((item) => (
                  <div key={item.label} className="border-b border-gray-100 last:border-0">
                    <button
                      onClick={() => setMobileExpandedItem(mobileExpandedItem === item.label ? null : item.label)}
                      aria-expanded={mobileExpandedItem === item.label}
                      className="w-full flex items-center justify-between py-3 text-left"
                    >
                      <span className="font-bold text-slate-800">{item.label}</span>
                      <span className={`text-slate-400 transition-transform duration-200 text-lg ${mobileExpandedItem === item.label ? 'rotate-45' : ''}`}>+</span>
                    </button>

                    <AnimatePresence>
                      {mobileExpandedItem === item.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pb-3 space-y-1">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.href}
                                to={subItem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-150 ${location.pathname === subItem.href
                                  ? 'bg-orange-50'
                                  : 'hover:bg-slate-50'
                                  }`}
                              >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${location.pathname === subItem.href
                                  ? 'bg-blue-700 text-white'
                                  : 'bg-orange-100 text-blue-700'
                                  }`}>
                                  {subItem.icon}
                                </div>
                                <div>
                                  <div className={`font-bold ${location.pathname === subItem.href ? 'text-blue-700' : 'text-slate-800'}`}>{subItem.label}</div>
                                  <div className="text-sm text-slate-500">{subItem.description}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                <Link
                  to="/events"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 font-bold border-b border-gray-100 ${location.pathname === '/events' ? 'text-blue-700' : 'text-slate-800'}`}
                >
                  Events
                </Link>

                <Link
                  to="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 font-bold border-b border-gray-100 ${location.pathname === '/blog' ? 'text-blue-700' : 'text-slate-800'}`}
                >
                  Blog
                </Link>

                <Link
                  to="/company-news"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 font-bold border-b border-gray-100 ${location.pathname === '/company-news' ? 'text-blue-700' : 'text-slate-800'}`}
                >
                  Company News
                </Link>

                <Link
                  to="/gallery"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 font-bold border-b border-gray-100 ${location.pathname === '/gallery' ? 'text-blue-700' : 'text-slate-800'}`}
                >
                  Gallery
                </Link>

                <Link
                  to="/reports"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 font-bold border-b border-gray-100 ${location.pathname === '/reports' ? 'text-blue-700' : 'text-slate-800'}`}
                >
                  Reports
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 font-bold border-b border-gray-100 ${location.pathname === '/contact' ? 'text-blue-700' : 'text-slate-800'}`}
                >
                  Contact
                </Link>

                <MobileLanguageSelector onClose={() => setMobileMenuOpen(false)} />

                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 font-bold text-slate-800 border-b border-gray-100"
                >
                  <LogIn className="w-5 h-5 text-blue-700" />
                  Login
                </Link>

                <div className="pt-3 flex flex-col gap-2">
                  <Link
                    to="/partner"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold"
                  >
                    <Handshake className="w-5 h-5" />
                    Partner With Us
                  </Link>
                  <Link
                    to="/donate"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gold-500 hover:bg-gold-600 text-navy-900 rounded-lg font-bold"
                  >
                    <Heart className="w-5 h-5" />
                    Donate Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
