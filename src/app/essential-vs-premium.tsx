"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

export function EssentialVsPremium() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const router = useRouter();
  const { language } = useLanguage();

  return (
    <section id="essential-vs-premium" className="bg-[#EBE7E0] border-t border-[#D4C4B7] py-24 w-full flex flex-col items-center">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center px-4">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-light text-[#5C2C35] leading-tight">
            {language === "fr" ? "Essentiel vs Premium" : "Essential vs Premium"}
          </h2>
          <p className="text-xs font-sans tracking-widest text-[#7A7571] mt-4 mb-12 max-w-lg mx-auto uppercase font-semibold">
            {language === "fr" 
              ? "Votre modèle choisi, repensé selon vos goûts ou créé à partir de zéro" 
              : "Your chosen template, redesigned to your taste or created from scratch"}
          </p>
        </motion.div>

        {/* The Interactive Slider Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="w-[320px] md:w-[400px] h-[600px] md:h-[700px] relative rounded-[2rem] border border-[#D4C4B7] bg-[#FBF9F6] overflow-hidden shadow-2xl group select-none"
        >
          
          {/* Top Info Labels & Badges */}
          <div className="absolute top-6 left-6 z-30 flex flex-col items-start gap-2 pointer-events-none">
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#7A7571] font-bold">
              {language === "fr" ? "VOTRE MODÈLE SÉLECTIONNÉ" : "YOUR SELECTED TEMPLATE"}
            </span>
            <span className="bg-[#FBF9F6]/90 backdrop-blur-sm text-[#7A7571] border border-[#D4C4B7] px-3 py-1 rounded-full text-[9px] font-bold tracking-wider shadow-sm">
              {language === "fr" ? "ESSENTIEL" : "ESSENTIAL"}
            </span>
          </div>

          <div className="absolute top-6 right-6 z-30 flex flex-col items-end gap-2 pointer-events-none">
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#7A7571] font-bold text-right">
              {language === "fr" ? "REPENSÉ POUR VOTRE MARIAGE" : "REDESIGNED FOR YOUR WEDDING"}
            </span>
            <span className="bg-[#5C2C35] text-[#FBF9F6] px-3 py-1 rounded-full text-[9px] font-bold tracking-wider shadow-sm">
              PREMIUM
            </span>
          </div>

          {/* Base Image (Essential) */}
          <img
            src="/image/essential.png"
            alt="Essential Template Invitation Style"
            className="w-full h-full object-cover absolute inset-0 select-none pointer-events-none"
          />

          {/* Overlay Image (Premium) */}
          <div
            className="absolute inset-0 w-full h-full select-none pointer-events-none"
            style={{
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            }}
          >
            <img
              src="/image/premium.png"
              alt="Premium Invitation Style"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </div>

          {/* Slider Input overlay */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="w-full h-full absolute inset-0 z-20 opacity-0 cursor-ew-resize"
            aria-label="Before and After Slider"
          />

          {/* The Drag Handle (Vertical line + center circle) */}
          <div
            className="absolute top-0 bottom-0 z-10 w-[2px] bg-[#5C2C35] pointer-events-none transition-all duration-75"
            style={{ left: `${sliderPosition}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full bg-[#5C2C35] text-white flex items-center justify-center font-bold font-mono text-sm pointer-events-none shadow-lg transition-all duration-75 select-none"
            style={{ left: `${sliderPosition}%` }}
          >
            &lt; &gt;
          </div>
        </motion.div>

        {/* Description & Pricing Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col items-center w-full"
        >
          <p className="text-sm font-sans text-[#7A7571] text-center max-w-2xl mt-12 mb-8 leading-relaxed">
            {language === "fr" 
              ? "L'offre Essentiel personnalise le modèle choisi. L'offre Premium le repense pour votre mariage. L'offre Excellence est un design entièrement sur-mesure, sans modèle." 
              : "Essential personalizes your chosen template. Premium redesigns it for your wedding. Excellence is a completely bespoke design, with no template."}
          </p>

          {/* Pricing Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md sm:max-w-2xl">
            <button
              onClick={() => router.push("/design/custom?plan=excellence")}
              className="w-full sm:w-auto rounded-full bg-[#5C2C35] border border-[#5C2C35] px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#4C242C] hover:scale-[1.03] hover:shadow-lg active:scale-95 cursor-pointer border-0"
            >
              {language === "fr" ? "Commencer avec Excellence" : "Start with Excellence"} &middot; 900&euro;
            </button>
            <button
              onClick={() => router.push("/templates")}
              className="w-full sm:w-auto rounded-full bg-[#5C2C35] border border-[#5C2C35] px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#4C242C] hover:scale-[1.03] hover:shadow-lg active:scale-95 cursor-pointer border-0"
            >
              {language === "fr" ? "Commencer avec Premium" : "Start with Premium"} &middot; 500&euro;
            </button>
            <button
              onClick={() => router.push("/templates")}
              className="w-full sm:w-auto rounded-full bg-transparent border border-[#5C2C35] px-8 py-4 text-sm font-semibold text-[#5C2C35] transition-all duration-300 hover:bg-[#5C2C35] hover:text-white hover:scale-[1.03] hover:shadow-lg active:scale-95 cursor-pointer"
            >
              {language === "fr" ? "Commencer avec Essentiel" : "Start with Essential"} &middot; 150&euro;
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default EssentialVsPremium;
