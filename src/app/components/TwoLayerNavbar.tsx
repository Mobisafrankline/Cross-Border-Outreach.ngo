import { useState, useEffect, useRef } from "react";
import { 
  Heart, 
  ChevronDown,
  User,
  Shield,
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
  Globe,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from "react-router";

export default function TwoLayerNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        setLanguageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguageDropdown(false);
    setMobileMenuOpen(false);
  };

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'pt', label: 'Português', flag: '🇧🇷' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

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
    { label: "News", href: "/news" },
    { label: "Events", href: "/events" },
    { label: "Gallery", href: "/gallery" },
    { label: "Impact Stories", href: "/impact" }
  ];

  return (
    <nav ref={dropdownRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-lg' : ''
    }`}>
      {/* Top Layer - Primary Navigation */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-10 h-10 bg-transparent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <img
                  src="/logo.png"
                  alt="Crossborders Outreach Logo"
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                />
              </div>
              <div className="text-white hidden sm:block">
                <div className="font-bold text-base sm:text-lg leading-tight">Cross-Borders</div>
                <div className="text-xs opacity-90">Outreach Ministry Inc</div>
              </div>
              <div className="text-white sm:hidden">
                <div className="font-bold text-sm leading-tight">Cross-Borders</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {menuItems.map((item) => (
                <div key={item.label} className="relative">
                  <button
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                    className="flex items-center gap-1 text-white hover:text-blue-100 font-semibold transition-colors py-2"
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      activeDropdown === item.label ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.href}
                            to={subItem.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50 transition-colors group"
                          >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors flex-shrink-0">
                              <div className="text-blue-600 group-hover:text-white transition-colors">
                                {subItem.icon}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {subItem.label}
                              </div>
                              <div className="text-sm text-gray-600 mt-0.5">
                                {subItem.description}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <Link
                to="/contact"
                className="text-white hover:text-blue-100 font-semibold transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop Language Dropdown */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setLanguageDropdown(!languageDropdown)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-semibold hidden lg:inline">{currentLanguage.flag} {currentLanguage.code.toUpperCase()}</span>
                  <span className="text-sm font-semibold lg:hidden">{currentLanguage.flag}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${languageDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {languageDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-blue-50 transition-colors ${
                            i18n.language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span className="font-medium">{lang.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop Donor Portal */}
              <Link
                to="/donor/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-semibold"
              >
                <User className="w-4 h-4" />
                <span className="hidden xl:inline">Donor Portal</span>
              </Link>

              {/* Desktop Admin */}
              <Link
                to="/admin/login"
                className="hidden xl:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-semibold"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Donate Button */}
              <Link
                to="/donate"
                className="hidden sm:flex px-4 sm:px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-xl text-sm whitespace-nowrap"
              >
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            
            {/* Mobile Menu Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-700 to-blue-600">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-lg">Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-2">
                {/* Mobile Menu Items with Accordions */}
                {menuItems.map((item) => (
                  <div key={item.label} className="border-b border-gray-100 last:border-0">
                    <button
                      onClick={() => setMobileExpandedItem(mobileExpandedItem === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between py-3 text-left"
                    >
                      <span className="font-semibold text-gray-900">{item.label}</span>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${
                        mobileExpandedItem === item.label ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    <AnimatePresence>
                      {mobileExpandedItem === item.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-3 space-y-1">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.href}
                                to={subItem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                              >
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <div className="text-blue-600">{subItem.icon}</div>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{subItem.label}</div>
                                  <div className="text-sm text-gray-600">{subItem.description}</div>
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
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 font-semibold text-gray-900 border-b border-gray-100"
                >
                  Contact
                </Link>

                {/* Mobile Language Selector */}
                <div className="py-3 border-b border-gray-100">
                  <div className="font-semibold text-gray-900 mb-2">Language</div>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          i18n.language === lang.code 
                            ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                            : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Link
                    to="/donor/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-900"
                  >
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">Donor Portal</span>
                  </Link>
                  
                  <Link
                    to="/admin/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-900"
                  >
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">Admin Dashboard</span>
                  </Link>

                  <Link
                    to="/donate"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold shadow-lg mt-4"
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

      {/* Bottom Layer - Secondary Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {secondaryNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap snap-start ${
                  location.pathname === item.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
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