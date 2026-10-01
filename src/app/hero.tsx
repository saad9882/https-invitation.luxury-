"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import { LimitModal } from "@/components";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface HeroProps {
  activeDemoUrl?: string;
}

function Hero({ activeDemoUrl }: HeroProps) {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();

  React.useEffect(() => {
    if (activeDemoUrl) {
      setIsInteractive(true);
    }
  }, [activeDemoUrl]);

  // --- interactive tilt for the phone ---
  const phoneRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [10, -10]);
  const rotateY = useTransform(smoothX, [0, 1], [-10, 10]);
  const glareX = useTransform(smoothX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(smoothY, [0, 1], ["0%", "100%"]);

  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.55), transparent 45%)`
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isInteractive) return;
    const rect = phoneRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handlePointerLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const handleIframeLoad = () => {
    const iframe = document.getElementById("hero-template-iframe") as HTMLIFrameElement | null;
    if (iframe && iframe.contentDocument) {
      const style = iframe.contentDocument.createElement("style");
      style.textContent = `
        ::-webkit-scrollbar {
          display: none !important;
        }
        html, body {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
      `;
      iframe.contentDocument.head.appendChild(style);
    }
  };

  const handleStartDesigning = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/templates"); // Direct to /templates gallery so they pick a template style
  };

  return (
    <section
      className="relative min-h-screen w-full flex items-center bg-[#F4F0E8] overflow-hidden"
      style={{
        backgroundImage: "url('/image/luxury_envelope_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Ambient background warmth/tint */}
      <div className="pointer-events-none absolute inset-0 bg-white/20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-16 pt-36 pb-20 flex flex-col md:flex-row items-center justify-between gap-12 text-left">
        {/* LEFT COLUMN: Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 max-w-xl flex flex-col items-start gap-5"
        >
          {/* Rating Badge */}
          <div className="flex items-center gap-1.5 bg-[#FBF9F6]/90 border border-[#D4C4B7]/40 px-3.5 py-1.5 rounded-full text-[10px] font-sans font-bold tracking-wider text-[#5C2C35] shadow-sm select-none">
            <span className="text-[#C9A56B]">★</span>
            <span>{language === "fr" ? "4.9 · Choisi par plus de 2 000 couples" : "4.9 · Chosen by +2,000 couples"}</span>
          </div>

          {/* Heading */}
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-4xl sm:text-5xl md:text-6xl text-[#5C2C35] leading-[1.1] font-normal tracking-normal"
          >
            {language === "fr" ? "Nous créons l'invitation de mariage numérique de vos rêves" : "We create your dream digital wedding invitation"}
          </h1>

          {/* Subheading */}
          <p
            style={{ fontFamily: "var(--font-sans)" }}
            className="text-[10px] sm:text-xs tracking-widest text-[#8a5a45] uppercase font-bold"
          >
            {language === "fr" 
              ? "LA PREMIÈRE IMPRESSION DE VOTRE MARIAGE, CONÇUE À LA MAIN PAR NOTRE ATELIER" 
              : "THE FIRST IMPRESSION OF YOUR WEDDING, HAND DESIGNED BY OUR ATELIER"}
          </p>

          {/* CTA & Price */}
          <div className="flex flex-col gap-3 w-full sm:w-auto mt-2">
            <button
              onClick={handleStartDesigning}
              style={{ fontFamily: "var(--font-sans)" }}
              className="magic-button group relative isolate overflow-hidden rounded-full px-9 py-4 font-bold text-xs tracking-widest uppercase text-[#3a2216] transition-transform duration-300 hover:scale-[1.04] active:scale-[0.97] cursor-pointer border-0 w-full sm:w-auto"
            >
              {/* Rotating gold conic glow */}
              <span className="magic-glow absolute -inset-[2px] rounded-full opacity-90 group-hover:opacity-100" />
              {/* Base gold-foil gradient */}
              <span className="magic-shimmer absolute inset-[2px] rounded-full" />
              {/* Content */}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
                {language === "fr" ? "Créer mon invitation" : "Create my invitation"}
                <Sparkles className="w-3 h-3 shrink-0 animate-pulse [animation-delay:0.4s]" />
              </span>
              {/* Sparkle burst on hover */}
              <span className="magic-sparkles pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100" />
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
              <Link
                href="/templates"
                style={{ fontFamily: "var(--font-sans)" }}
                className="text-[10px] tracking-widest font-bold uppercase text-[#5C2C35] hover:text-[#C9A56B] transition-colors"
              >
                {language === "fr" ? "Voir les modèles" : "View templates"}
              </Link>
              <span className="text-[10px] text-[#7A7571] font-sans">
                {language === "fr" 
                  ? "À partir de 150€ · sans engagement jusqu'au paiement" 
                  : "From 150€ · no commitment until payment"}
              </span>
            </div>
          </div>

          {/* Partner / Coming soon logo */}
          <div className="mt-8 pt-6 border-t border-[#D4C4B7]/40 w-full flex flex-col items-start gap-2">
            <span className="text-[8px] tracking-widest text-[#7A7571] uppercase font-bold">
              {language === "fr" ? "Bientôt dans" : "Coming soon in"}
            </span>
            <span style={{ fontFamily: "var(--font-display)" }} className="text-xl italic text-[#5C2C35]/60 font-semibold font-serif">
              VOGUE <span className="text-xs tracking-wider uppercase font-sans font-bold pl-1 text-[#7A7571]/60">Wedding Guide</span>
            </span>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Interactive iPhone Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative z-10 flex-shrink-0 flex justify-center items-center"
          style={{ perspective: 1200 }}
        >
          <motion.div
            ref={phoneRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => {
              handlePointerLeave();
              setIsInteractive(false);
            }}
            style={{ rotateX: isInteractive ? 0 : rotateX, rotateY: isInteractive ? 0 : rotateY, transformStyle: "preserve-3d" }}
            className="relative w-[230px] h-[470px] xs:w-[250px] xs:h-[510px] sm:w-[270px] sm:h-[550px] md:w-[290px] md:h-[590px] transition-all duration-300"
          >
            {/* Drop shadow that reacts to tilt */}
            <div className="absolute -inset-x-6 -bottom-8 h-16 bg-[#5C2C35]/20 blur-2xl rounded-full" />

            {/* Titanium frame */}
            <div
              className="absolute inset-0 rounded-[3.1rem] p-[3px] shadow-2xl"
              style={{
                background:
                  "linear-gradient(155deg, #b7a081 0%, #8a7458 22%, #5f4d38 45%, #8a7458 68%, #372c20 100%)",
              }}
            >
              {/* Brushed metal edge highlight */}
              <div className="absolute inset-0 rounded-[3.1rem] pointer-events-none [box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.25),inset_0_1px_2px_rgba(255,255,255,0.4)]" />

              {/* Action button (mute switch) */}
              <div className="absolute -left-[3px] top-[86px] w-[3px] h-9 rounded-l-sm bg-gradient-to-b from-[#8a7458] via-[#4a3c2b] to-[#8a7458] shadow-sm" />
              {/* Volume up */}
              <div className="absolute -left-[3px] top-[130px] w-[3px] h-12 rounded-l-sm bg-gradient-to-b from-[#8a7458] via-[#4a3c2b] to-[#8a7458] shadow-sm" />
              {/* Volume down */}
              <div className="absolute -left-[3px] top-[178px] w-[3px] h-12 rounded-l-sm bg-gradient-to-b from-[#8a7458] via-[#4a3c2b] to-[#8a7458] shadow-sm" />
              {/* Power button */}
              <div className="absolute -right-[3px] top-[140px] w-[3px] h-16 rounded-r-sm bg-gradient-to-b from-[#8a7458] via-[#4a3c2b] to-[#8a7458] shadow-sm" />

              {/* Inner black bezel */}
              <div className="relative w-full h-full rounded-[2.9rem] bg-black p-[7px]">
                {/* Screen */}
                <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Dynamic Island */}
                  <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[86px] h-[24px] bg-black rounded-full z-50 flex items-center justify-end pr-2">
                    <div className="w-[7px] h-[7px] rounded-full bg-[#1a1a1a] ring-1 ring-[#2a2a2a]" />
                  </div>

                  {/* Screen content - live template preview */}
                  <iframe
                    id="hero-template-iframe"
                    onLoad={handleIframeLoad}
                    src={`${activeDemoUrl || "/demos/template_3/index.html"}?preview=1`}
                    className={`w-full h-full border-0 select-none transition-all duration-200 ${
                      isInteractive ? "pointer-events-auto" : "pointer-events-none"
                    }`}
                    title="Featured Template Live Preview"
                  />

                  {/* Transparent interaction overlay for scrolling and clicking */}
                  {!isInteractive && (
                    <div
                      className="absolute inset-0 z-30 cursor-pointer"
                      onClick={() => setIsInteractive(true)}
                      onWheel={(e) => {
                        const iframe = document.getElementById("hero-template-iframe") as HTMLIFrameElement | null;
                        if (iframe && iframe.contentWindow) {
                          iframe.contentWindow.scrollBy({
                            top: e.deltaY,
                            behavior: "auto",
                          });
                        }
                      }}
                    />
                  )}

                  {/* Visual hint tag for interaction */}
                  {!isInteractive && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#5C2C35]/90 text-white text-[9px] font-sans font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-lg z-40 pointer-events-none animate-bounce">
                      {language === "fr" ? "Défiler / Cliquer" : "Scroll / Click to view"}
                    </div>
                  )}

                  {/* Glass glare that follows the cursor */}
                  {!isInteractive && (
                    <motion.div
                      className="pointer-events-none absolute inset-0 mix-blend-overlay"
                      style={{ background: glareBg }}
                    />
                  )}
                  {/* Subtle permanent screen sheen */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/15" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Security Limit Modal */}
      <LimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        onGoToDesign={() => {
          setShowLimitModal(false);
          router.push("/templates");
        }}
      />

      <style jsx>{`
        .magic-glow {
          background: conic-gradient(
            from 0deg,
            #c9a56b,
            #f4e2b8,
            #5c2c35,
            #c9a56b
          );
          filter: blur(6px);
          animation: spin 4s linear infinite;
        }
        .magic-shimmer {
          background: linear-gradient(
            110deg,
            #d9b978 0%,
            #f6e7bf 25%,
            #c9a56b 50%,
            #f6e7bf 75%,
            #d9b978 100%
          );
          background-size: 220% 100%;
          animation: shimmer 3.5s ease-in-out infinite;
        }
        .magic-sparkles {
          background-image: radial-gradient(
              circle,
              rgba(255, 255, 255, 0.9) 1px,
              transparent 1.5px
            ),
            radial-gradient(circle, rgba(255, 255, 255, 0.8) 1px, transparent 1.5px),
            radial-gradient(circle, rgba(255, 255, 255, 0.9) 1px, transparent 1.5px);
          background-size: 40px 40px, 60px 60px, 30px 30px;
          background-position: 10% 20%, 70% 60%, 40% 80%;
          animation: twinkle 1.6s ease-in-out infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.9;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .magic-glow,
          .magic-shimmer,
          .magic-sparkles {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;