"use client";

import React from "react";
import { motion } from "framer-motion";

export function TemplateShowcase() {
  const templates = [
    {
      id: "personal-story",
      title: "Personalized digital design with your story included",
      image: "/image/wedding-hero.png",
      hasOverlay: true,
    },
    {
      id: "classic-seal",
      title: "Classic wax seal digital detail",
      image: "/image/wedding-wax-seal.png",
      hasOverlay: false,
    },
    {
      id: "editorial-theme",
      title: "Editorial layout color theme",
      image: "/image/wedding-palette.png",
      hasOverlay: false,
    },
    {
      id: "modern-rsvp",
      title: "Modern guest rsvp dashboard details",
      image: "/image/wedding-rsvp-dashboard.png",
      hasOverlay: false,
    },
  ];

  return (
    <section id="templates" className="py-20 lg:py-32 px-8 bg-[#EBE7E0] border-t border-[#5C2C35]/10 flex flex-col items-center">
      <div className="container mx-auto max-w-6xl w-full">
        {/* Section Headings */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-[#5C2C35] leading-tight">
            Everything you&apos;ll need.
          </h2>
          <span className="text-2xl md:text-3xl font-serif italic text-[#D4A574] mt-2 block font-light">
            to make your invitation unforgettable.
          </span>
        </div>

        {/* Horizontal Scroll templates carousel */}
        <div className="flex gap-6 overflow-x-auto snap-x hide-scrollbar px-4 md:px-8 mt-12 pb-6 w-full">
          {templates.map((tpl, index) => (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
              className="min-w-[300px] md:min-w-[350px] h-[450px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-lg snap-center relative flex-shrink-0 group bg-[#FBF9F6]"
            >
              <img
                src={tpl.image}
                alt={tpl.title}
                className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition-transform duration-700"
              />
              
              {tpl.hasOverlay && (
                <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/60 to-transparent p-8 text-left">
                  <p className="font-serif text-lg sm:text-xl text-white leading-normal font-light">
                    {tpl.title}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TemplateShowcase;
