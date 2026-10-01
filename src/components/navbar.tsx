import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { LimitModal } from "./limit-modal";
import { useLanguage } from "@/lib/LanguageContext";

const NAV_MENU_EN = [
  { name: "HOW IT WORKS", href: "/#how-it-works" },
  { name: "TESTIMONIALS", href: "/#testimonials" },
  { name: "TEMPLATES", href: "/templates" },
  { name: "PRICING", href: "/pricing", isSpecial: true },
  { name: "DASHBOARD", href: "/dashboard" },
];

const NAV_MENU_FR = [
  { name: "COMMENT ÇA MARCHE", href: "/#how-it-works" },
  { name: "TÉMOIGNAGES", href: "/#testimonials" },
  { name: "MODÈLES", href: "/templates" },
  { name: "TARIFS", href: "/pricing", isSpecial: true },
  { name: "TABLEAU DE BORD", href: "/dashboard" },
];

const CherubIcon = () => (
  <svg className="w-6 h-6 text-[#2A2726] flex-shrink-0" viewBox="0 0 64 64" fill="currentColor">
    {/* Head */}
    <circle cx="32" cy="24" r="5" />
    {/* Halo */}
    <ellipse cx="32" cy="15" rx="6" ry="1.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    {/* Body */}
    <path d="M32 31c-4 0-7.5 3-7.5 7.5v9.5h15v-9.5c0-4.5-3.5-7.5-7.5-7.5z" opacity="0.8" />
    {/* Left Wing */}
    <path d="M21 21c-5.5 1.5-9.5 7-9.5 14 0 5 6 6 9.5 3v-1.5c-2.5 0.8-4.5 0-5.5-3 0-4 4-8.5 8.5-10v-2.5z" />
    {/* Right Wing */}
    <path d="M43 21c5.5 1.5 9.5 7 9.5 14 0 5-6 6-9.5 3v-1.5c2.5 0.8 4.5 0 5.5-3 0-4-4-8.5-8.5-10v-2.5z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-4 h-4 text-[#2A2726] hover:text-[#7A7571] transition-colors cursor-pointer flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4-9m0 18c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296A3.746 3.746 0 0112 3m0 0a9.004 9.004 0 018.716 6.747M12 3a9.004 9.004 0 00-8.716 6.747" />
  </svg>
);

const SparkleIcon = () => (
  <svg className="w-3.5 h-3.5 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
  </svg>
);

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [showLimitModal, setShowLimitModal] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(true);
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();

  const handleOpen = () => setOpen((cur) => !cur);

  React.useEffect(() => {
    const handleResize = () => window.innerWidth >= 960 && setOpen(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStartDesigning = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/templates"); // Direct to /templates gallery so they pick a template style
  };

  const navMenu = language === "fr" ? NAV_MENU_FR : NAV_MENU_EN;

  return (
    <>
      {showBanner && (
        <div className="fixed top-0 left-0 w-full h-10 bg-[#5C2C35] text-white flex items-center justify-center text-[8px] sm:text-[10px] tracking-widest font-bold z-50 border-b border-[#D4C4B7]/20 px-8 text-center select-none uppercase">
          <span>
            {language === "fr" 
              ? "ÉDITION D'ÉTÉ · 15€ DE RÉDUCTION AVEC LE CODE SUMMER15 · JUSQU'AU 31 AOÛT" 
              : "SUMMER EDITION · 15€ OFF WITH CODE SUMMER15 · UNTIL AUGUST 31"}
          </span>
          <button 
            onClick={() => setShowBanner(false)}
            className="absolute right-4 text-white/80 hover:text-white bg-transparent border-0 cursor-pointer text-xs focus:outline-none"
            aria-label="Close Announcement"
          >
            ✕
          </button>
        </div>
      )}
      <nav
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[95%] max-w-7xl rounded-[32px] bg-[#FBF9F6] border border-[#D4C4B7]/30 shadow-md px-6 sm:px-8 py-3 ${
          showBanner ? "top-14" : "top-4"
        } ${open ? "rounded-[24px]" : ""}`}
      >
        <div className="flex items-center justify-between">
          {/* Logo & Brand Name */}
          <Link
            href="/"
            className="flex items-center gap-2 font-serif text-[#2A2726] uppercase hover:opacity-90 transition-opacity"
          >
            <CherubIcon />
            <span className="font-serif font-normal text-lg sm:text-2xl normal-case tracking-wide">
              {language === "fr" ? "Faire-part de Luxe" : "Luxury Invitation"}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navMenu.map(({ name, href, isSpecial }) => (
              <li key={name}>
                <Link
                  href={href}
                  className={`font-sans text-[10px] xl:text-[11px] tracking-widest font-bold text-[#2A2726] hover:text-[#7A7571] transition-all uppercase ${isSpecial
                    ? "border border-[#D4C4B7] rounded-full px-4 py-1.5 hover:bg-[#F0EBE1]/40"
                    : ""
                    }`}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions & CTA */}
          <div className="hidden lg:flex items-center gap-5">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity bg-transparent border-0 cursor-pointer p-1"
              title={language === "fr" ? "Switch to English" : "Passer en Français"}
            >
              <GlobeIcon />
              <span className="text-[10px] font-sans font-bold tracking-widest text-[#2A2726]">{language.toUpperCase()}</span>
            </button>
            <button
              onClick={handleStartDesigning}
              className="bg-[#5C2C35] hover:bg-[#4A2229] text-white px-5 py-2.5 rounded-full font-sans font-bold text-[10px] tracking-widest flex items-center gap-1.5 transition-all cursor-pointer border-0"
            >
              <SparkleIcon />
              {language === "fr" ? "Créer mon invitation" : "Create my invitation"}
            </button>
          </div>

          {/* Mobile menu toggle button */}
          <button
            className="inline-block lg:hidden text-[#2A2726] p-1.5 focus:outline-none bg-transparent border-0 cursor-pointer"
            onClick={handleOpen}
          >
            {open ? (
              <XMarkIcon strokeWidth={2} className="h-5 w-5" />
            ) : (
              <Bars3Icon strokeWidth={2} className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile menu drawer inside the pill */}
        <div
          className={`overflow-hidden transition-all duration-300 lg:hidden ${open ? "max-h-[400px] opacity-100 mt-4 pt-4 border-t border-[#D4C4B7]/40" : "max-h-0 opacity-0 pointer-events-none"
            }`}
        >
          <ul className="flex flex-col gap-4 text-left">
            {navMenu.map(({ name, href, isSpecial }) => (
              <li key={name}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`font-sans text-[10px] tracking-widest font-bold text-[#2A2726] hover:text-[#7A7571] transition-all uppercase block py-1 ${isSpecial
                    ? "inline-block border border-[#D4C4B7] rounded-full px-4 py-1"
                    : ""
                    }`}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t border-[#D4C4B7]/30 flex items-center justify-between">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 bg-transparent border-0 cursor-pointer p-1"
            >
              <GlobeIcon />
              <span className="text-[10px] font-sans font-semibold tracking-widest text-[#7A7571]">{language.toUpperCase()}</span>
            </button>
            <button
              onClick={(e) => { setOpen(false); handleStartDesigning(e); }}
              className="bg-[#5C2C35] hover:bg-[#4A2229] text-white px-5 py-2.5 rounded-full font-sans font-bold text-[10px] tracking-widest flex items-center gap-1.5 transition-all cursor-pointer border-0"
            >
              <SparkleIcon />
              {language === "fr" ? "Créer mon invitation" : "Create my invitation"}
            </button>
          </div>
        </div>
      </nav>

      {/* Security Limit Modal */}
      <LimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        onGoToDesign={() => {
          setShowLimitModal(false);
          router.push("/templates");
        }}
      />
    </>
  );
}

export default Navbar;
