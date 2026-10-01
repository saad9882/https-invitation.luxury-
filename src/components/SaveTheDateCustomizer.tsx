"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SaveTheDateTemplate } from "@/data/templates";

// Random Name & Date Pools for Inspiration
const NAME_POOLS: Record<string, { partner1: string[]; partner2: string[]; venues: string[] }> = {
  bridgerton: {
    partner1: ["Daphne", "Penelope", "Eloise", "Francesca", "Marina", "Hyacinth"],
    partner2: ["Simon", "Colin", "Benedict", "Anthony", "George", "Gregory"],
    venues: ["Clyvedon Castle", "Bridgerton House, London", "Aubrey Hall", "Somerset House"],
  },
  france: {
    partner1: ["Amélie", "Chloé", "Léa", "Manon", "Camille", "Juliette"],
    partner2: ["Pierre", "Bastien", "Matthieu", "Lucas", "Arthur", "Antoine"],
    venues: ["Château de Chantilly, Paris", "Villa Ephrussi de Rothschild", "Château de Vaux-le-Vicomte", "Provence Lavender Estate"],
  },
  muslim: {
    partner1: ["Yasmin", "Layla", "Fatima", "Aisha", "Mariam", "Zara"],
    partner2: ["Zayd", "Farhan", "Tariq", "Karim", "Mustafa", "Hamza"],
    venues: ["The Grand Sapphire Ballroom", "Alhambra Palace Hall", "Royal Majestic Hall", "Serenade Garden Pavilion"],
  },
  global: {
    partner1: ["Sophia", "Olivia", "Emma", "Mia", "Isabella", "Amelia"],
    partner2: ["Ethan", "Noah", "Liam", "Lucas", "Oliver", "Alexander"],
    venues: ["The Glasshouse, New York", "Aman Venice Garden, Italy", "Botanical Conservatory", "Modern Loft Rooftop"],
  },
};

const DATES_POOL = [
  "2027-09-18",
  "2027-06-05",
  "2027-08-21",
  "2027-10-12",
  "2027-07-17",
  "2027-05-29",
  "2028-06-10",
  "2028-09-02",
];

const FONTS = [
  { name: "Cinzel (Classic Serif)", class: "font-cinzel" },
  { name: "Parisienne (Elegant Script)", class: "font-parisienne" },
  { name: "Great Vibes (Calligraphy)", class: "font-calligraphy" },
  { name: "Playfair Display (Editorial)", class: "font-playfair" },
  { name: "Montserrat (Minimalist)", class: "font-sans-alt" },
];

const PRESET_COLORS: Record<string, { bg: string; text: string; accent: string; namesFontClass: string; bodyFontClass: string }> = {
  bridgerton: {
    bg: "#EBE7E0",
    text: "#2b3b4c", // Elegant navy
    accent: "#c5a059", // Soft Gold
    namesFontClass: "font-cinzel",
    bodyFontClass: "font-playfair",
  },
  france: {
    bg: "#FBF9F6",
    text: "#524345", // Rose-tinted charcoal
    accent: "#c49da4", // Dusty rose
    namesFontClass: "font-parisienne",
    bodyFontClass: "font-sans-alt",
  },
  muslim: {
    bg: "#FAF7F2", // Mapped to the light user-uploaded arch background
    text: "#634a15", // Deep gold/bronze
    accent: "#a87a2a", // Muted gold foil
    namesFontClass: "font-cinzel",
    bodyFontClass: "font-playfair",
  },
  global: {
    bg: "#F4F1EC",
    text: "#222222", // Minimal black
    accent: "#8B7E74", // Taupe / Eucalyptus sage
    namesFontClass: "font-playfair",
    bodyFontClass: "font-sans-alt",
  },
};

// Helper to adjust padding depending on background layout frame
function getLayoutSpacingClass(templateId: string) {
  switch (templateId) {
    case "bridgerton":
      return "pt-[28%] pb-[14%] px-[12%]";
    case "france":
      return "pt-[22%] pb-[10%] px-[12%]";
    case "muslim":
      return "pt-[22%] pb-[14%] px-[12%]";
    case "global":
      return "pt-[15%] pb-[10%] pl-[10%] pr-[24%]";
    default:
      return "pt-[10%] pb-[10%] px-[10%]";
  }
}

// Helper to scale names text size dynamically based on name length
function getNameFontSizeClass(name1: string, name2: string) {
  const maxLen = Math.max(name1 ? name1.length : 0, name2 ? name2.length : 0);
  if (maxLen > 12) return "text-xl sm:text-2xl md:text-3xl";
  if (maxLen > 8) return "text-2xl sm:text-3xl md:text-4xl";
  return "text-4xl sm:text-5xl md:text-6xl";
}

interface CustomizerProps {
  initialTemplate: SaveTheDateTemplate;
  allTemplates: SaveTheDateTemplate[];
}

export function SaveTheDateCustomizer({ initialTemplate, allTemplates }: CustomizerProps) {
  const router = useRouter();
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Active theme / template state
  const [activeTemplate, setActiveTemplate] = useState<SaveTheDateTemplate>(initialTemplate);
  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueCity, setVenueCity] = useState("");

  // Styling customizations
  const [namesFont, setNamesFont] = useState("");
  const [bodyFont, setBodyFont] = useState("");
  const [textColor, setTextColor] = useState("");
  const [accentColor, setAccentColor] = useState("");

  // PDF Export loading state
  const [isExporting, setIsExporting] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const paidParam = urlParams.get("paid");
      const paidStorage = localStorage.getItem("std_paid_" + activeTemplate.id);
      if (paidParam === "true" || paidStorage === "true") {
        setIsPaid(true);
      }
    }
  }, [activeTemplate.id]);

  // Load fonts and set template variables on mount/template change
  useEffect(() => {
    // Append fonts dynamically
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Great+Vibes&family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Parisienne&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Apply template presets
    applyTemplateDefaults(activeTemplate.id);
  }, [activeTemplate]);

  const applyTemplateDefaults = (templateId: string) => {
    const pool = NAME_POOLS[templateId] || NAME_POOLS.global;
    
    // Pick random names, venue, date
    const r1 = pool.partner1[Math.floor(Math.random() * pool.partner1.length)];
    const r2 = pool.partner2[Math.floor(Math.random() * pool.partner2.length)];
    const vFull = pool.venues[Math.floor(Math.random() * pool.venues.length)];
    const parts = vFull.split(",");
    
    setPartner1(r1);
    setPartner2(r2);
    setWeddingDate(DATES_POOL[Math.floor(Math.random() * DATES_POOL.length)]);
    setVenueName(parts[0].trim());
    setVenueCity(parts[1] ? parts[1].trim() : "Lake Como, Italy");

    // Load styling presets
    const preset = PRESET_COLORS[templateId] || PRESET_COLORS.global;
    setNamesFont(preset.namesFontClass);
    setBodyFont(preset.bodyFontClass);
    setTextColor(preset.text);
    setAccentColor(preset.accent);
  };

  const handleRandomize = () => {
    applyTemplateDefaults(activeTemplate.id);
  };

  const formatDateLong = (dateStr: string) => {
    if (!dateStr) return "18 Septembre 2027";
    try {
      const d = new Date(dateStr + "T12:00:00");
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("fr-FR", { month: "long", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const handleExportPDF = async () => {
    if (!printAreaRef.current) return;
    setIsExporting(true);

    try {
      // 1. Dynamic script loader for html2canvas & jsPDF
      await new Promise<void>((resolve, reject) => {
        if ((window as any).html2canvas && (window as any).jspdf) {
          resolve();
          return;
        }

        const s1 = document.createElement("script");
        s1.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        s1.onload = () => {
          const s2 = document.createElement("script");
          s2.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          s2.onload = () => resolve();
          s2.onerror = reject;
          document.head.appendChild(s2);
        };
        s1.onerror = reject;
        document.head.appendChild(s1);
      });

      const element = printAreaRef.current;
      const html2canvas = (window as any).html2canvas;
      const { jsPDF } = (window as any).jspdf;

      // Render overlay at higher scale for crisp print quality
      const canvas = await html2canvas(element, {
        scale: 3, // High DPI
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL("image/png");
      
      // Standard 5x7 inches wedding invitation card aspect ratio (e.g. 127mm x 178mm)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [127, 178], // 5x7 ratio
      });

      pdf.addImage(imgData, "PNG", 0, 0, 127, 178, undefined, "FAST");
      pdf.save(`save_the_date_${partner1.toLowerCase()}_and_${partner2.toLowerCase()}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("An error occurred during PDF generation. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrimaryAction = () => {
    if (isPaid) {
      handleExportPDF();
    } else {
      // Store customizer state to localStorage before checkout
      const stdState = {
        plan: "save_the_date",
        templateId: activeTemplate.id,
        partner1,
        partner2,
        weddingDate,
        venueName,
        venueCity,
        namesFont,
        bodyFont,
        textColor,
        accentColor,
      };
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("luxury_invitation_user") || localStorage.getItem("awff_user");
        const user = userStr ? JSON.parse(userStr) : { email: "guest@luxuryinvitation.co" };
        localStorage.setItem("luxury_design_" + user.email, JSON.stringify(stdState));
        localStorage.setItem("awff_design_" + user.email, JSON.stringify(stdState));
        localStorage.setItem("std_draft", JSON.stringify(stdState));
      }
      router.push(`/checkout?plan=save_the_date&template=${activeTemplate.id}`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#EBE7E0] text-[#2A2726] font-sans selection:bg-[#F0EBE1] overflow-x-hidden">
      {/* 1. LEFT CONTROL PANEL */}
      <div className="w-full lg:max-w-md bg-[#FBF9F6] border-b lg:border-b-0 lg:border-r border-[#D4C4B7] flex flex-col p-6 sm:p-8 space-y-6 flex-shrink-0">
        
        {/* Navigation & Header */}
        <div className="space-y-2">
          <Link
            href="/templates"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#7A7571] hover:text-[#5C2C35] transition-colors"
          >
            ← Retour à la Galerie
          </Link>
          <div className="flex justify-between items-center border-b border-[#D4C4B7]/40 pb-4 pt-1">
            <div>
              <h1 className="text-xl font-serif font-light tracking-wide text-[#5C2C35]">Studio Save the Date</h1>
              <p className="text-[9px] uppercase tracking-widest text-[#C9A56B] font-bold mt-0.5">Créateur Sur Mesure</p>
            </div>
            <button
              onClick={handleRandomize}
              className="px-3 py-1.5 border border-[#D4C4B7] hover:bg-[#EBE7E0]/40 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer bg-transparent"
              title="Mélanger les détails pour s'inspirer"
            >
              🎲 Mélanger
            </button>
          </div>
        </div>

        {/* Template Selector Thumbnails */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-[#7A7571] font-bold block">
            Sélectionner le Style
          </label>
          <div className="grid grid-cols-4 gap-2">
            {allTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  const tpl = allTemplates.find((x) => x.id === t.id);
                  if (tpl) setActiveTemplate(tpl);
                }}
                className={`p-1 border rounded-xl overflow-hidden text-center transition-all bg-white cursor-pointer ${
                  activeTemplate.id === t.id
                    ? "border-[#5C2C35] ring-2 ring-[#5C2C35]/10 shadow-sm scale-102"
                    : "border-[#D4C4B7]/60 hover:border-[#7A7571]"
                }`}
              >
                <div className="aspect-[3/4] bg-[#EBE7E0] rounded-lg overflow-hidden mb-1 relative">
                  <img src={t.phoneImage} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[8px] uppercase tracking-wider font-semibold block text-ellipsis truncate px-0.5">
                  {t.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Customization Controls Panel */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <h2 className="text-[10px] uppercase tracking-widest text-[#7A7571] font-bold border-b border-[#D4C4B7]/40 pb-1">
            Détails de la Carte
          </h2>

          <div className="flex flex-col gap-3.5">
            {/* Partner 1 Name */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-wider font-semibold text-[#7A7571]">Prénom du 1er Marié(e)</span>
              <input
                type="text"
                value={partner1}
                onChange={(e) => setPartner1(e.target.value)}
                placeholder="Amélie"
                className="border-b border-[#D4C4B7] bg-transparent pb-1 text-sm text-[#2A2726] placeholder-[#7A7571]/35 focus:border-[#5C2C35] focus:outline-none transition-colors"
              />
            </div>

            {/* Partner 2 Name */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-wider font-semibold text-[#7A7571]">Prénom du 2ème Marié(e)</span>
              <input
                type="text"
                value={partner2}
                onChange={(e) => setPartner2(e.target.value)}
                placeholder="Pierre"
                className="border-b border-[#D4C4B7] bg-transparent pb-1 text-sm text-[#2A2726] placeholder-[#7A7571]/35 focus:border-[#5C2C35] focus:outline-none transition-colors"
              />
            </div>

            {/* Date Selection */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-wider font-semibold text-[#7A7571]">Date du Mariage</span>
              <input
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="border-b border-[#D4C4B7] bg-transparent pb-1 text-sm text-[#2A2726] focus:border-[#5C2C35] focus:outline-none transition-colors cursor-pointer"
              />
            </div>

            {/* Venue Location Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#7A7571]">Lieu de la Cérémonie</span>
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="Château de Chantilly"
                  className="border-b border-[#D4C4B7] bg-transparent pb-1 text-xs text-[#2A2726] focus:border-[#5C2C35] focus:outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#7A7571]">Ville / Pays</span>
                <input
                  type="text"
                  value={venueCity}
                  onChange={(e) => setVenueCity(e.target.value)}
                  placeholder="Paris, France"
                  className="border-b border-[#D4C4B7] bg-transparent pb-1 text-xs text-[#2A2726] focus:border-[#5C2C35] focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Typography Styling Options */}
          <h2 className="text-[10px] uppercase tracking-widest text-[#7A7571] font-bold border-b border-[#D4C4B7]/40 pb-1 pt-4">
            Typographie & Style
          </h2>

          <div className="flex flex-col gap-3.5">
            {/* Names Font Style */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-wider font-semibold text-[#7A7571]">Police des Prénoms</span>
              <select
                value={namesFont}
                onChange={(e) => setNamesFont(e.target.value)}
                className="border border-[#D4C4B7] bg-[#FBF9F6] p-1.5 text-xs text-[#2A2726] rounded-[2px] focus:outline-none"
              >
                {FONTS.map((f) => (
                  <option key={f.class} value={f.class}>{f.name}</option>
                ))}
              </select>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#7A7571]">Couleur Principale</span>
                <div className="flex items-center gap-2 border-b border-[#D4C4B7] pb-1">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-5 h-5 rounded border-0 p-0 cursor-pointer bg-transparent"
                  />
                  <span className="text-[10px] font-mono uppercase">{textColor}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#7A7571]">Couleur d&apos;Accent</span>
                <div className="flex items-center gap-2 border-b border-[#D4C4B7] pb-1">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-5 h-5 rounded border-0 p-0 cursor-pointer bg-transparent"
                  />
                  <span className="text-[10px] font-mono uppercase">{accentColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer PDF Export button */}
        <div className="pt-4 border-t border-[#D4C4B7] flex flex-col gap-2 font-sans">
          <button
            onClick={handlePrimaryAction}
            disabled={isExporting}
            className="w-full bg-[#5C2C35] hover:bg-[#4A2229] disabled:bg-[#5C2C35]/50 text-white py-3.5 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer border-0 shadow-md flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Génération du PDF HD...</span>
              </>
            ) : isPaid ? (
              <>
                <span>📥 Télécharger le PDF HD</span>
              </>
            ) : (
              <>
                <span>💳 Payer 75€ & Télécharger le PDF</span>
              </>
            )}
          </button>
          <p className="text-[8px] text-center text-[#7A7571] leading-relaxed">
            {isPaid
              ? "Génère un fichier PDF haute définition (13x18 cm) prêt à imprimer."
              : "Paiement sécurisé par Stripe (75€). Téléchargement instantané du PDF vectoriel prêt à imprimer."}
          </p>
        </div>
      </div>

      {/* 2. RIGHT PREVIEW WINDOW */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto bg-[#EBE7E0]">
        
        {/* Styled Card Container floating in shadow */}
        <div className="shadow-2xl hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] transition-shadow duration-500 rounded-[2rem] overflow-hidden bg-white select-none">
          <div
            id="save-the-date-print-area"
            ref={printAreaRef}
            className="w-[325px] h-[455px] sm:w-[350px] sm:h-[490px] md:w-[380px] md:h-[532px] relative overflow-hidden flex flex-col items-center justify-between p-8 sm:p-10 select-none bg-cover bg-center"
            style={{
              backgroundImage: `url(${activeTemplate.phoneImage})`,
            }}
          >
            {/* Aesthetic Font Class Injection Overlay */}
            <style dangerouslySetInnerHTML={{__html: `
              .font-cinzel { font-family: 'Cinzel', serif; letter-spacing: 0.15em; }
              .font-parisienne { font-family: 'Parisienne', cursive; }
              .font-calligraphy { font-family: 'Great Vibes', cursive; }
              .font-playfair { font-family: 'Playfair Display', serif; }
              .font-sans-alt { font-family: 'Montserrat', sans-serif; letter-spacing: 0.08em; }
            `}} />

            {/* CARD CONTENT LAYER OVERLAY */}
            <div className={`w-full h-full flex flex-col justify-between items-center text-center z-10 select-none ${getLayoutSpacingClass(activeTemplate.id)}`}>
              
              {/* Top Section: Save the Date Header */}
              <div className="space-y-1 sm:space-y-1.5 mt-2">
                <span
                  className={`${bodyFont} text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] block`}
                  style={{ color: accentColor }}
                >
                  SE MARIENT
                </span>
                <h3
                  className="font-serif text-[18px] sm:text-[21px] tracking-[0.35em] uppercase font-light block"
                  style={{ color: textColor }}
                >
                  SAVE THE DATE
                </h3>
                <div className="w-6 h-[1.5px] mx-auto mt-2 opacity-50" style={{ backgroundColor: accentColor }} />
              </div>

              {/* Middle Section: Celebrants Names */}
              <div className="my-auto py-2 w-full">
                <div
                  className={`${namesFont} ${getNameFontSizeClass(partner1, partner2)} font-light tracking-wide leading-none capitalize`}
                  style={{ color: textColor }}
                >
                  {partner1}
                </div>
                <div
                  className="font-serif text-base sm:text-lg font-light italic my-0.5 opacity-70"
                  style={{ color: accentColor }}
                >
                  &
                </div>
                <div
                  className={`${namesFont} ${getNameFontSizeClass(partner1, partner2)} font-light tracking-wide leading-none capitalize`}
                  style={{ color: textColor }}
                >
                  {partner2}
                </div>
              </div>

              {/* Bottom Section: Date & Location Details */}
              <div className="space-y-2 mb-2 w-full">
                <div className="w-12 h-[1px] mx-auto opacity-30" style={{ backgroundColor: accentColor }} />
                
                {/* Date */}
                <div
                  className="font-serif text-[13px] sm:text-[15px] font-light tracking-[0.08em] block font-semibold"
                  style={{ color: textColor }}
                >
                  {formatDateLong(weddingDate)}
                </div>

                {/* Venue details */}
                <div className="space-y-0.5">
                  <span
                    className={`${bodyFont} text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.18em] block`}
                    style={{ color: accentColor }}
                  >
                    {venueName}
                  </span>
                  <span
                    className="font-sans text-[8px] sm:text-[9px] tracking-[0.1em] opacity-80 block uppercase"
                    style={{ color: textColor }}
                  >
                    {venueCity}
                  </span>
                </div>
                
                {/* Note */}
                <span
                  className={`${bodyFont} text-[7px] sm:text-[8px] uppercase tracking-widest block opacity-75 font-semibold pt-2`}
                  style={{ color: textColor }}
                >
                  Faire-part officiel à suivre
                </span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default SaveTheDateCustomizer;
