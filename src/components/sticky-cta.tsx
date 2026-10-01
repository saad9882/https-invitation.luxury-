"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { LimitModal } from "./limit-modal";
import { useLanguage } from "@/lib/LanguageContext";

export function StickyCTA() {
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const { language } = useLanguage();

  // Control visibility on scroll so it appears after scrolling down a bit
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStartDesigning = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/templates"); // Redirect to templates first
  };

  // Hide on customizer page to avoid overlapping controls
  if (pathname === "/design") return null;

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-auto px-4 max-w-full"
          >
            <button
              onClick={handleStartDesigning}
              className="bg-[#5C2C35]/95 backdrop-blur-sm hover:bg-[#4A2229] hover:scale-102 text-white px-8 py-4 rounded-full font-sans text-xs tracking-widest uppercase transition-all shadow-2xl flex items-center gap-2 border-0 cursor-pointer whitespace-nowrap"
            >
              {language === "fr" ? (
                <>Créer mon invitation &middot; Commencer ici à partir de 150&euro; &rarr;</>
              ) : (
                <>Create my invitation &middot; Start here from 150&euro; &rarr;</>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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

export default StickyCTA;
