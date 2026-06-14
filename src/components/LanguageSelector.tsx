import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations, Language } from '../translations';
import { cn } from '../utils';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const t = translations[currentLanguage];
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLang = languages.find(l => l.code === currentLanguage);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t.common.selectLanguage}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300",
          "bg-stone-100/50 border border-stone-200/50 hover:bg-stone-200/50 hover:border-stone-300/50",
          "text-stone-600 font-bold uppercase tracking-widest shadow-sm",
          currentLanguage === 'ar' ? "text-xs" : "text-[10px]",
          isOpen && "ring-2 ring-emerald-500/20 border-emerald-500/50 bg-white"
        )}
      >
        <Globe size={14} className={cn("transition-transform duration-500", isOpen && "rotate-180")} />
        <span>{selectedLang?.name}</span>
        <ChevronDown size={12} className={cn("transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl shadow-stone-900/10 border border-stone-200/60 overflow-hidden z-[60] backdrop-blur-xl bg-white/90"
          >
            <div className="p-1.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-medium transition-all duration-200",
                    lang.code === 'ar' ? "text-sm" : "text-xs",
                    currentLanguage === lang.code
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base" aria-hidden="true">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                  {currentLanguage === lang.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check size={14} className="text-emerald-600" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
