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
  UserCircle,
  Building2,
  BarChart3,
  Menu,
  X,
  LogIn
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router";
import { DesktopLanguageSelector, MobileLanguageSelector } from "./GoogleTranslate";

export default function TwoLayerNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          label: "Volunteer",
          href: "/volunteer",
          icon: <Users className="w-5 h-5" />,
          description: "Give your time and skills"
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
          label: "Impact Stories",
          href: "/impact",
          icon: <Award className="w-5 h-5" />,
          description: "Real-world change we're making"
        },
        {
          label: "News",
          href: "/news",
          icon: <FileText className="w-5 h-5" />,
          description: "Latest announcements"
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
          label: "Reports",
          href: "/reports",
          icon: <BarChart3 className="w-5 h-5" />,
          description: "Annual reports and transparency"
        }
      ]
    }
  ];

  const secondaryNavItems = [
    { label: "Food Support", href: "/food-support" },
    { label: "Education", href: "/education" },
    { label: "Healthcare", href: "/healthcare" },
    { label: "Economic Empowerment", href: "/economic" },
    { label: "Gallery", href: "/gallery" },
    { label: "Impact Stories", href: "/impact" }
  ];

  return (
    <nav
      id="main-nav"
      ref={dropdownRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}
    >
      {/* Top Layer - Primary Navigation */}
      <div className={`relative z-10 transition-colors duration-300 ${isScrolled
        ? 'bg-blue-700/95 backdrop-blur-md'
        : 'bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600'
        }`}>
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6"
          style={{
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
            paddingRight: 'max(1rem, env(safe-area-inset-right))'
          }}
        >
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-10 h-10 bg-transparent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <img
                  src="/logo.png"
                  alt="Crossborders Outreach Logo"
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                />
              </div>
              <div className="text-white hidden sm:block">
                <div className="font-bold text-base sm:text-lg leading-tight">Cross-Borders</div>
                <div className="text-xs opacity-80">Outreach Ministry Inc</div>
              </div>
              <div className="text-white sm:hidden">
                <div className="font-bold text-sm leading-tight">Cross-Borders</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
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
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 font-semibold transition-all duration-200 text-sm ${activeDropdown === item.label ? 'bg-white/15 text-white' : ''}`}
                  >
                    {item.label}
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
                        <div className="w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 overflow-hidden">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.href}
                              to={subItem.href}
                              onClick={() => setActiveDropdown(null)}
                              className={`flex items-start gap-3 px-4 py-3 hover:bg-blue-50 transition-colors duration-150 group ${location.pathname === subItem.href ? 'bg-blue-50/80' : ''}`}
                            >
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${location.pathname === subItem.href
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                                }`}>
                                {subItem.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`font-semibold transition-colors duration-150 ${location.pathname === subItem.href
                                  ? 'text-blue-600'
                                  : 'text-gray-900 group-hover:text-blue-600'
                                  }`}>
                                  {subItem.label}
                                </div>
                                <div className="text-sm text-gray-500 mt-0.5 truncate">
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
              ))}

              <Link
                to="/news"
                className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${location.pathname === '/news'
                  ? 'bg-white/20 text-white'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
              >
                News
              </Link>
              <Link
                to="/events"
                className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${location.pathname === '/events'
                  ? 'bg-white/20 text-white'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
              >
                Events
              </Link>
              <Link
                to="/contact"
                className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${location.pathname === '/contact'
                  ? 'bg-white/20 text-white'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
              >
                Contact
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <DesktopLanguageSelector />

              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 text-sm font-semibold"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden lg:inline">Login</span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link
                to="/donate"
                className="flex px-4 sm:px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 text-sm whitespace-nowrap items-center gap-1.5"
              >
                <Heart className="w-4 h-4 hidden sm:block" />
                Donate
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
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
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="text-white font-bold text-lg">Menu</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 text-white hover:bg-white/10 rounded-lg transition-colors"
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
                      <span className="font-semibold text-gray-900">{item.label}</span>
                      <span className={`text-gray-400 transition-transform duration-200 text-lg ${mobileExpandedItem === item.label ? 'rotate-45' : ''}`}>+</span>
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
                                  ? 'bg-blue-50'
                                  : 'hover:bg-gray-50'
                                  }`}
                              >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${location.pathname === subItem.href
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-blue-100 text-blue-600'
                                  }`}>
                                  {subItem.icon}
                                </div>
                                <div>
                                  <div className={`font-medium ${location.pathname === subItem.href ? 'text-blue-600' : 'text-gray-900'}`}>{subItem.label}</div>
                                  <div className="text-sm text-gray-500">{subItem.description}</div>
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
                  to="/news"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 font-semibold border-b border-gray-100 ${location.pathname === '/news' ? 'text-blue-600' : 'text-gray-900'}`}
                >
                  News
                </Link>

                <Link
                  to="/events"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 font-semibold border-b border-gray-100 ${location.pathname === '/events' ? 'text-blue-600' : 'text-gray-900'}`}
                >
                  Events
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 font-semibold border-b border-gray-100 ${location.pathname === '/contact' ? 'text-blue-600' : 'text-gray-900'}`}
                >
                  Contact
                </Link>

                <MobileLanguageSelector onClose={() => setMobileMenuOpen(false)} />

                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 font-semibold text-gray-900 border-b border-gray-100"
                >
                  <LogIn className="w-5 h-5 text-blue-600" />
                  Login
                </Link>

                <div className="pt-3">
                  <Link
                    to="/donate"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg text-base"
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

      {/* Bottom Layer - Secondary Navigation (ALL screen sizes) */}
      <div className={`relative z-0 block bg-white border-b border-gray-200 transition-shadow duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
        <div
          className="max-w-7xl mx-auto"
          style={{
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
            paddingRight: 'max(1rem, env(safe-area-inset-right))'
          }}
        >
          <div
            className="flex items-center gap-1 py-2 overflow-x-auto"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              maskImage: 'linear-gradient(to right, black 90%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, black 90%, transparent 100%)',
            }}
          >
            {secondaryNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${location.pathname === item.href
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}