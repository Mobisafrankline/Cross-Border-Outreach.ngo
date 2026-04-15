import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Extend Window to include Google Translate types
declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            autoDisplay?: boolean;
          },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit: () => void;
  }
}

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "sw", label: "Kiswahili", flag: "🇰🇪" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "zh-CN", label: "中文", flag: "🇨🇳" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

function triggerGoogleTranslate(langCode: string) {
  // Google Translate uses a hidden <select> element — we programmatically change its value
  const select = document.querySelector(
    ".goog-te-combo"
  ) as HTMLSelectElement | null;
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event("change"));
  }
}

/**
 * Desktop language dropdown for the navbar.
 * Renders in the top blue bar as a globe icon + language code button,
 * with a dropdown showing all available languages.
 */
export function DesktopLanguageSelector() {
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    setCurrentLang(code);
    triggerGoogleTranslate(code);
    setOpen(false);
  };

  const active = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <div ref={ref} className="hidden md:block relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 text-sm"
      >
        <Globe className="w-4 h-4" />
        <span className="font-semibold hidden lg:inline">
          {active.flag} {active.code.toUpperCase()}
        </span>
        <span className="font-semibold lg:hidden">{active.flag}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full right-0 pt-1 z-50"
          >
            <div className="w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 overflow-hidden">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 transition-colors duration-150 ${
                    currentLang === lang.code
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-medium text-sm">{lang.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Mobile language selector rendered inside the slide-out drawer.
 * Shows a 2-column grid of language buttons.
 */
export function MobileLanguageSelector({
  onClose,
}: {
  onClose: () => void;
}) {
  const [currentLang, setCurrentLang] = useState("en");

  const handleSelect = (code: string) => {
    setCurrentLang(code);
    triggerGoogleTranslate(code);
    onClose();
  };

  return (
    <div className="py-3 border-b border-gray-100">
      <div className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <Globe className="w-4 h-4 text-gray-500" />
        Translate
      </div>
      <div className="grid grid-cols-2 gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-150 text-sm ${
              currentLang === lang.code
                ? "bg-blue-50 text-blue-600 border border-blue-200 font-medium"
                : "hover:bg-gray-50 text-gray-700 border border-gray-200"
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Initialises the hidden Google Translate widget.
 * Render this once at the app level (e.g. in Layout.tsx).
 * It injects the GT script tag and creates the hidden element
 * that the DesktopLanguageSelector / MobileLanguageSelector drive.
 */
export function GoogleTranslateInit() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Define the callback Google Translate will invoke
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: LANGUAGES.map((l) => l.code).join(","),
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // Inject the script tag
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      {/* Hidden container for the Google Translate widget */}
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* Hide the Google Translate top-bar and any injected banners */}
      <style>{`
        .goog-te-banner-frame,
        .skiptranslate,
        #goog-gt-tt,
        .goog-te-balloon-frame {
          display: none !important;
          opacity: 0 !important;
          height: 0 !important;
          border: none !important;
        }
        html, body { 
          top: 0 !important; 
          margin-top: 0 !important; 
          padding-top: 0 !important;
        }
        .goog-text-highlight {
          background: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </>
  );
}
