"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

interface StepItem {
  labelFr: string;
  labelEn: string;
  titleFr: string;
  titleEn: string;
  bodyFr: string;
  bodyEn: string;
  icon: React.ReactNode;
}

const STEPS: StepItem[] = [
  {
    labelFr: "ÉTAPE 1 — 01",
    labelEn: "STEP 1 — 01",
    titleFr: "Choisissez votre forfait & style",
    titleEn: "Choose your plan & style",
    bodyFr: "Sélectionnez votre formule et l'un de nos designs d'invitation créés à la main.",
    bodyEn: "Pick your plan and one of our hand-curated invitation designs.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 md:w-6 h-6 text-[#5C2C35]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 0" />
      </svg>
    ),
  },
  {
    labelFr: "ÉTAPE 2 — 02",
    labelEn: "STEP 2 — 02",
    titleFr: "Partagez vos informations",
    titleEn: "Share your details",
    bodyFr: "Parlez-nous de votre journée — noms, date, lieu et informations clés.",
    bodyEn: "Tell us about your day — names, date, location and key info.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 md:w-6 h-6 text-[#5C2C35]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" />
      </svg>
    ),
  },
  {
    labelFr: "ÉTAPE 3 — 03",
    labelEn: "STEP 3 — 03",
    titleFr: "Nous nous occupons du reste",
    titleEn: "We take care of the rest",
    bodyFr: "Nous concevons votre faire-part avec le souci du détail et vous le livrons prêt.",
    bodyEn: "We design your invitation with attention to detail and deliver it ready.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 md:w-6 h-6 text-[#5C2C35]">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.187.904zM18 10.5l-.562-1.688L15.75 8.25l1.688-.562L18 6l.562 1.688 1.688.562-1.688.562L18 10.5z" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  const { language } = useLanguage();

  return (
    <section id="how-it-works" className="bg-[#EBE7E0] border-t border-[#D4C4B7] py-24 w-full">
      <div className="max-w-4xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center mb-16 px-4">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-[#5C2C35] leading-tight">
            {language === "fr" ? (
              <>
                Comment nous créons la <span className="italic">magie ensemble</span>
              </>
            ) : (
              <>
                How we create <span className="italic">magic together</span>
              </>
            )}
          </h2>
        </div>

        {/* Timeline Container Layout */}
        <div className="max-w-2xl mx-auto relative px-6 z-10">
          {/* The Connecting Line */}
          <div className="absolute left-[49px] md:left-[54px] top-0 bottom-0 w-[1px] bg-[#D4C4B7] -z-10" />

          {/* Timeline Steps */}
          <div className="flex flex-col gap-12 relative z-10">
            {STEPS.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                className="flex flex-row gap-6 md:gap-10 items-start"
              >
                {/* Left Side: Icon Container */}
                <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full flex-shrink-0 flex items-center justify-center bg-[#EBE7E0] border border-[#D4C4B7] shadow-sm select-none">
                  {step.icon}
                </div>

                {/* Right Side: Text Content */}
                <div className="flex-1 text-left pt-2.5">
                  <span className="text-xs font-sans font-bold tracking-widest text-[#D4A574] mb-2 uppercase block">
                    {language === "fr" ? step.labelFr : step.labelEn}
                  </span>
                  <h3 className="text-2xl font-serif text-[#5C2C35] mb-3 font-normal">
                    {language === "fr" ? step.titleFr : step.titleEn}
                  </h3>
                  <p className="text-base font-sans text-[#7A7571] leading-relaxed">
                    {language === "fr" ? step.bodyFr : step.bodyEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
