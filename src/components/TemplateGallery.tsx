"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TEMPLATES,
  SAVE_THE_DATES,
  TemplateSummary,
  SaveTheDateTemplate,
} from "@/data/templates";
import { PLANS } from "@/lib/plans";
import { useLanguage } from "@/lib/LanguageContext";

type ViewMode = "carousel" | "grid" | "compact";

interface TemplateGalleryProps {
  onSelectTemplate?: (demoUrl: string) => void;
}

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps = {}) {
  const router = useRouter();
  const { language } = useLanguage();

  // Layout states for main templates & save the dates
  const [viewMode, setViewMode] = useState<ViewMode>("carousel");
  const [stdViewMode, setStdViewMode] = useState<ViewMode>("carousel");

  // Carousel refs for scrolling
  const carouselRef = useRef<HTMLDivElement>(null);
  const stdCarouselRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.75;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-[#FAF7F2] py-16 px-4 sm:px-6 md:px-12 min-h-screen text-[#3E1F24] select-none">
      <div className="max-w-7xl mx-auto w-full">
        {/* TOP BAR / BACK LINK */}
        <div className="mb-6">
          <Link
            href="/pricing"
            className="text-xs uppercase tracking-widest text-[#7D736A] hover:text-[#3E1F24] transition-colors font-medium"
          >
            {language === "fr" ? "← Voir les tarifs" : "← View pricing plans"}
          </Link>
        </div>

        {/* SECTION 1: MAIN WEDDING INVITATIONS HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl sm:text-5xl font-serif font-normal text-[#3E1F24] tracking-tight"
            >
              {language === "fr" ? "Choisissez votre modèle" : "Choose your template"}
            </h1>
            <p className="text-sm font-sans tracking-wide text-[#7D736A] italic mt-1.5">
              {language === "fr"
                ? "Conçu avec soin pour faire la première impression parfaite."
                : "Thoughtfully designed to make the perfect first impression."}
            </p>
          </div>

          {/* VIEW MODE TOGGLE SWITCH (Carousel / Grid / Compact) */}
          <LayoutSwitcher
            currentMode={viewMode}
            onChangeMode={setViewMode}
          />
        </div>

        {/* SECTION 1: MAIN WEDDING INVITATIONS CONTENT */}
        <div className="relative mb-24">
          {viewMode === "carousel" ? (
            <div>
              <div
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto hide-scrollbar scroll-smooth pb-6 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0"
              >
                {TEMPLATES.map((tpl) => (
                  <div key={tpl.id} className="min-w-[280px] sm:min-w-[330px] md:min-w-[350px] max-w-[360px] flex-shrink-0">
                    <StandardTemplateCard
                      tpl={tpl}
                      onSelect={() => {
                        if (onSelectTemplate && tpl.demoUrl) {
                          onSelectTemplate(tpl.demoUrl);
                        } else {
                          router.push(`/templates/${tpl.id}`);
                        }
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Carousel Nav Controls */}
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => scroll(carouselRef, "left")}
                  aria-label="Previous template"
                  className="w-10 h-10 rounded-full bg-[#E5DFD6] hover:bg-[#DCD5C9] text-[#3E1F24] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                >
                  ‹
                </button>
                <button
                  onClick={() => scroll(carouselRef, "right")}
                  aria-label="Next template"
                  className="w-10 h-10 rounded-full bg-[#E5DFD6] hover:bg-[#DCD5C9] text-[#3E1F24] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                >
                  ›
                </button>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEMPLATES.map((tpl) => (
                <StandardTemplateCard
                  key={tpl.id}
                  tpl={tpl}
                  onSelect={() => {
                    if (onSelectTemplate && tpl.demoUrl) {
                      onSelectTemplate(tpl.demoUrl);
                    } else {
                      router.push(`/templates/${tpl.id}`);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {TEMPLATES.map((tpl) => (
                <CompactTemplateCard
                  key={tpl.id}
                  tpl={tpl}
                  onSelect={() => {
                    if (onSelectTemplate && tpl.demoUrl) {
                      onSelectTemplate(tpl.demoUrl);
                    } else {
                      router.push(`/templates/${tpl.id}`);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: OUR SAVE THE DATES */}
        <div className="pt-14 border-t border-[#D4C4B7]/40">
          {/* Badge */}
          <div className="mb-3">
            <span className="text-[10px] uppercase tracking-widest font-bold bg-[#E6E1D8] text-[#3E1F24] px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3E1F24]" />
              PRODUIT INDÉPENDANT · SAVE THE DATE
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6">
            <div>
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#3E1F24] font-normal tracking-tight"
              >
                {language === "fr" ? "Nos Save the Dates." : "Our Save the Dates."}
              </h2>
              <p className="text-sm font-sans text-[#7D736A] italic mt-1">
                {language === "fr"
                  ? "Un aperçu élégant, conçu pour annoncer la date avant l'invitation complète."
                  : "An elegant preview, designed to announce the date before the full invitation."}
              </p>
            </div>

            {/* View switcher for Save the Dates */}
            <LayoutSwitcher
              currentMode={stdViewMode}
              onChangeMode={setStdViewMode}
            />
          </div>

          {/* Promotional Banner */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EFECE6] border border-[#E1DCD3] text-xs text-[#3E1F24] font-medium shadow-sm max-w-full">
              <span>✦</span>
              <span className="truncate">
                {language === "fr"
                  ? "Vous rêvez d'un Save the Date unique ? Nous le créons pour vous"
                  : "Dreaming of a one-of-a-kind Save the Date? We craft it for you"}
              </span>
              <span>—</span>
            </div>
          </div>

          {/* SAVE THE DATES CONTENT */}
          <div className="relative mb-16">
            {stdViewMode === "carousel" ? (
              <div>
                <div
                  ref={stdCarouselRef}
                  className="flex gap-6 overflow-x-auto hide-scrollbar scroll-smooth pb-6 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0"
                >
                  {SAVE_THE_DATES.map((item) => (
                    <div key={item.id} className="min-w-[260px] sm:min-w-[300px] max-w-[320px] flex-shrink-0">
                      <SaveTheDateCard item={item} />
                    </div>
                  ))}
                </div>

                {/* Carousel Nav Controls */}
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => scroll(stdCarouselRef, "left")}
                    aria-label="Previous Save the Date"
                    className="w-10 h-10 rounded-full bg-[#E5DFD6] hover:bg-[#DCD5C9] text-[#3E1F24] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => scroll(stdCarouselRef, "right")}
                    aria-label="Next Save the Date"
                    className="w-10 h-10 rounded-full bg-[#E5DFD6] hover:bg-[#DCD5C9] text-[#3E1F24] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                  >
                    ›
                  </button>
                </div>
              </div>
            ) : stdViewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {SAVE_THE_DATES.map((item) => (
                  <SaveTheDateCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SAVE_THE_DATES.map((item) => (
                  <SaveTheDateCard key={item.id} item={item} compact />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

{/* LAYOUT SWITCHER COMPONENT */}
function LayoutSwitcher({
  currentMode,
  onChangeMode,
}: {
  currentMode: ViewMode;
  onChangeMode: (mode: ViewMode) => void;
}) {
  return (
    <div className="bg-[#E6E1D8] p-1 rounded-full flex items-center gap-1 shadow-inner border border-[#DCD5C9] self-start sm:self-auto">
      <button
        onClick={() => onChangeMode("carousel")}
        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
          currentMode === "carousel"
            ? "bg-[#3E1F24] text-white shadow"
            : "text-[#3E1F24]/70 hover:text-[#3E1F24]"
        }`}
      >
        <span className="text-[10px]">▮▮▮</span>
        Carrousel
      </button>
      <button
        onClick={() => onChangeMode("grid")}
        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
          currentMode === "grid"
            ? "bg-[#3E1F24] text-white shadow"
            : "text-[#3E1F24]/70 hover:text-[#3E1F24]"
        }`}
      >
        <span className="text-[10px]">⊞</span>
        Grille
      </button>
      <button
        onClick={() => onChangeMode("compact")}
        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
          currentMode === "compact"
            ? "bg-[#3E1F24] text-white shadow"
            : "text-[#3E1F24]/70 hover:text-[#3E1F24]"
        }`}
      >
        <span className="text-[10px]">⣿</span>
        Compact
      </button>
    </div>
  );
}

{/* EXACT MATCH WEDDING TEMPLATE CARD MATCHING TARGET REFERENCE */}
function StandardTemplateCard({
  tpl,
  onSelect,
}: {
  tpl: TemplateSummary;
  onSelect: () => void;
}) {
  const [phoneSrc, setPhoneSrc] = useState(tpl.phoneImage);
  const [envelopeSrc, setEnvelopeSrc] = useState(tpl.envelopeImage);
  const plan = PLANS[tpl.tier];

  return (
    <div className="flex flex-col w-full group">
      <button
        onClick={onSelect}
        className="aspect-[0.98/1] bg-[#E5DFD6] w-full rounded-[2rem] relative overflow-hidden flex items-center justify-between p-4 sm:p-5 hover:shadow-lg transition-all duration-300 border border-transparent group-hover:border-[#D4C4B7]/60 cursor-pointer text-left select-none"
      >
        {/* Top-left Tag Badge */}
        {tpl.tag && (
          <span className="absolute top-4 left-4 z-30 text-[9px] uppercase tracking-wider font-bold bg-[#3E1F24] text-white px-3.5 py-1 rounded-full shadow-sm">
            {tpl.tag}
          </span>
        )}

        {/* SIDE-BY-SIDE MOCKUPS: PHONE (LEFT) & CARD/ENVELOPE (RIGHT) */}
        <div className="w-full h-full flex items-center justify-center gap-3 pt-5 pb-2">
          {/* PHONE MOCKUP (LEFT) */}
          <div className="relative w-[47%] h-[90%] rounded-[1.6rem] bg-black p-[3.5px] shadow-md flex-shrink-0">
            <div className="relative w-full h-full bg-white rounded-[1.4rem] overflow-hidden">
              {/* Top Notch Dynamic Island */}
              <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[36%] h-[11px] bg-black rounded-full z-30" />
              <img
                src={phoneSrc}
                alt={`${tpl.name} Screen`}
                onError={() => setPhoneSrc(tpl.cardImage || "/image/wedding-hero.png")}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* CARD / ENVELOPE MOCKUP (RIGHT) */}
          <div className="relative w-[47%] h-[90%] rounded-[1.4rem] bg-white shadow-sm overflow-hidden flex-shrink-0 border border-black/5">
            <img
              src={envelopeSrc}
              alt={`${tpl.name} Envelope`}
              onError={() => setEnvelopeSrc(tpl.cardImage || "/image/luxury_envelope_bg.png")}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bottom-Right Pill Button */}
        <div className="absolute bottom-4 right-4 z-30 bg-[#FDFBF7] text-[#3E1F24] px-4 py-1.5 rounded-full text-xs font-medium shadow-sm hover:bg-white transition-colors border border-white/60">
          <span>Commander, dès {plan ? plan.price : 175}€</span>
        </div>
      </button>

      {/* CAPTION & DESCRIPTION BELOW CARD */}
      <div className="mt-3.5 px-1">
        <p className="text-sm font-serif leading-relaxed text-[#7D736A]">
          <strong className="font-semibold text-[#3E1F24]">{tpl.name}. </strong>
          {tpl.description || "A period invitation designed with meticulous details for a fairytale wedding."}
        </p>
      </div>
    </div>
  );
}

{/* COMPACT CARD OPTION */}
function CompactTemplateCard({
  tpl,
  onSelect,
}: {
  tpl: TemplateSummary;
  onSelect: () => void;
}) {
  const [phoneSrc, setPhoneSrc] = useState(tpl.phoneImage);

  return (
    <button
      onClick={onSelect}
      className="flex flex-col w-full text-left bg-[#E5DFD6] hover:bg-[#DDD7CC] p-3 rounded-[1.5rem] transition-all cursor-pointer border border-transparent hover:border-[#D4C4B7]/60 group"
    >
      <div className="aspect-[3/4] w-full bg-white rounded-[1rem] overflow-hidden relative shadow-sm mb-2">
        <img
          src={phoneSrc}
          alt={tpl.name}
          onError={() => setPhoneSrc(tpl.cardImage || "/image/wedding-hero.png")}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h4 className="text-xs font-semibold text-[#3E1F24] truncate">{tpl.name}</h4>
      <span className="text-[10px] text-[#7D736A] uppercase tracking-wider mt-0.5">
        Dès 175€
      </span>
    </button>
  );
}

{/* SAVE THE DATE CARD COMPONENT */}
function SaveTheDateCard({
  item,
  compact = false,
}: {
  item: SaveTheDateTemplate;
  compact?: boolean;
}) {
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(item.phoneImage);

  return (
    <div className="flex flex-col w-full group">
      <button
        onClick={() => router.push(`/templates/${item.id}`)}
        className={`${
          compact ? "aspect-[3/4] p-3" : "aspect-[0.98/1] p-5"
        } bg-[#E5DFD6] w-full rounded-[2rem] relative overflow-hidden flex items-center justify-center hover:shadow-lg transition-all duration-300 border border-transparent group-hover:border-[#D4C4B7]/60 cursor-pointer`}
      >
        {item.tag && (
          <span className="absolute top-4 left-4 z-30 text-[9px] uppercase tracking-wider font-bold bg-[#3E1F24] text-white px-3.5 py-1 rounded-full shadow-sm">
            {item.tag}
          </span>
        )}

        {/* Tall Single Preview (Matching Reference Image) */}
        <div className="relative w-[50%] h-[90%] rounded-[1.4rem] bg-white shadow-sm overflow-hidden border border-black/5">
          <img
            src={imgSrc}
            alt={item.name}
            onError={() => setImgSrc("/demos/maison-doree/sda.jpg")}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute bottom-4 right-4 z-30 bg-[#FDFBF7] text-[#3E1F24] px-4 py-1.5 rounded-full text-xs font-medium shadow-sm hover:bg-white transition-colors border border-white/60">
          <span>Commander, dès {item.price}€</span>
        </div>
      </button>

      <div className="mt-3.5 px-1">
        <p className="text-sm font-serif leading-relaxed text-[#7D736A]">
          <strong className="font-semibold text-[#3E1F24]">{item.name}. </strong>
          {item.description}
        </p>
      </div>
    </div>
  );
}

export default TemplateGallery;
