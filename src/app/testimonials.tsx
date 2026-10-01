"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";


interface ReviewItem {
  title: string;
  body: string;
  name: string;
  rating: number;
}

const INITIAL_REVIEWS_EN: ReviewItem[] = [
  {
    title: "Amazing experience",
    body: "We couldn't have asked for a better way to invite our loved ones. The animations are incredibly smooth and the setup was completely seamless.",
    name: "CLARA & MARK",
    rating: 5,
  },
  {
    title: "Amazing, Easy, Unique Experience",
    body: "Our guests were blown away by how beautiful the digital invitation was! Having the maps, RSVP, and music all in one place made it so convenient.",
    name: "JOAO & LUIS",
    rating: 5,
  },
  {
    title: "Absolutely beautiful x",
    body: "The customization options allowed us to match our theme perfectly. The support team was incredibly helpful and quick to respond to our questions.",
    name: "EMILY & JAMES",
    rating: 5,
  },
  {
    title: "A masterpiece of digital design",
    body: "Every single page transitions with a luxury feel that matches the competitor's premium look. The RSVP dashboard is incredibly detailed and useful.",
    name: "SOPHIE & ANTOINE",
    rating: 5,
  },
  {
    title: "So simple to personalize",
    body: "We created ours in less than an hour! It is so easy to share via WhatsApp and the RSVP updates are instant. Highly recommend this to everyone.",
    name: "MARIA & PAOLO",
    rating: 5,
  },
  {
    title: "Guests were completely wowed",
    body: "We received so many messages praising the elegant layout. It sets a luxurious tone for the wedding right from the very first link shared.",
    name: "HANNAH & GARRET",
    rating: 5,
  },
];

const INITIAL_REVIEWS_FR: ReviewItem[] = [
  {
    title: "Une expérience incroyable",
    body: "Nous n'aurions pas pu rêver d'une meilleure façon d'inviter nos proches. Les animations sont incroyablement fluides et la configuration s'est faite sans aucun problème.",
    name: "CLARA & MARK",
    rating: 5,
  },
  {
    title: "Expérience unique, facile et géniale",
    body: "Nos invités ont été époustouflés par la beauté de l'invitation numérique ! Le fait d'avoir les cartes, le RSVP et la musique au même endroit a rendu les choses tellement pratiques.",
    name: "JOAO & LUIS",
    rating: 5,
  },
  {
    title: "Absolument magnifique x",
    body: "Les options de personnalisation nous ont permis de correspondre parfaitement à notre thème. L'équipe d'assistance a été incroyablement serviable et rapide à répondre à nos questions.",
    name: "EMILY & JAMES",
    rating: 5,
  },
  {
    title: "Un chef-d'œuvre de design numérique",
    body: "Chaque transition de page offre une sensation de luxe à la hauteur d'un look haut de gamme. Le tableau de bord RSVP est incroyablement détaillé et utile.",
    name: "SOPHIE & ANTOINE",
    rating: 5,
  },
  {
    title: "Si simple à personnaliser",
    body: "Nous avons créé la nôtre en moins d'une heure ! C'est tellement facile à partager via WhatsApp et les mises à jour RSVP sont instantanées. Je le recommande vivement à tout le monde.",
    name: "MARIA & PAOLO",
    rating: 5,
  },
  {
    title: "Les invités ont été totalement conquis",
    body: "Nous avons reçu tellement de messages louant l'élégance de la mise en page. Cela donne un ton luxueux au mariage dès le premier lien partagé.",
    name: "HANNAH & GARRET",
    rating: 5,
  },
];

// Fixed (non-random) ember field so server + client markup match on hydration.
const EMBERS = [
  { left: "4%", size: 3, duration: 16, delay: 0 },
  { left: "12%", size: 5, duration: 21, delay: 3 },
  { left: "20%", size: 2, duration: 14, delay: 6 },
  { left: "29%", size: 4, duration: 19, delay: 1 },
  { left: "37%", size: 6, duration: 24, delay: 8 },
  { left: "45%", size: 3, duration: 17, delay: 4 },
  { left: "53%", size: 5, duration: 22, delay: 10 },
  { left: "61%", size: 2, duration: 15, delay: 2 },
  { left: "69%", size: 4, duration: 20, delay: 7 },
  { left: "77%", size: 6, duration: 25, delay: 5 },
  { left: "85%", size: 3, duration: 18, delay: 9 },
  { left: "93%", size: 5, duration: 23, delay: 1 },
  { left: "8%", size: 2, duration: 13, delay: 11 },
  { left: "58%", size: 3, duration: 16, delay: 13 },
  { left: "80%", size: 2, duration: 14, delay: 12 },
  { left: "33%", size: 5, duration: 20, delay: 15 },
];

function ReviewCard({ item, index, language }: { item: ReviewItem; index: number; language: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="review-card relative bg-white/[0.07] backdrop-blur-md border border-white/15 rounded-2xl p-6 flex flex-col gap-3 transition-colors duration-300 hover:bg-white/[0.1] hover:border-[#C9A56B]/40"
    >
      {/* Stars */}
      <div className="flex gap-1 text-[#C9A56B] mb-1 select-none">
        {[...Array(5)].map((_, i) => {
          const isFilled = i < (item.rating || 5);
          return (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFilled ? "currentColor" : "none"}
              stroke={isFilled ? "none" : "currentColor"}
              strokeWidth={isFilled ? undefined : 1.5}
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          );
        })}
      </div>

      {/* Review Title */}
      <h3 style={{ fontFamily: "var(--font-sans)" }} className="text-base font-semibold text-white">
        {item.title}
      </h3>

      {/* Review Body */}
      <p
        style={{ fontFamily: "var(--font-sans)" }}
        className={`text-sm text-white/80 leading-relaxed transition-all duration-300 ${expanded ? "line-clamp-none" : "line-clamp-4"
          }`}
      >
        {item.body}
      </p>

      {/* Read More / Read Less */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        style={{ fontFamily: "var(--font-sans)" }}
        className="text-[10px] tracking-widest uppercase text-white/60 mt-2 hover:text-[#C9A56B] transition-colors cursor-pointer w-fit select-none flex items-center gap-1 border-0 bg-transparent p-0"
      >
        {expanded
          ? (language === "fr" ? "Lire moins" : "Read less")
          : (language === "fr" ? "Lire plus" : "Read more")}
        <span
          className={`inline-block transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
        >
          &#9662;
        </span>
      </button>

      {/* Reviewer Name */}
      <span
        style={{ fontFamily: "var(--font-sans)" }}
        className="text-[10px] tracking-widest uppercase text-white/60 mt-auto pt-2 select-none"
      >
        — {item.name}
      </span>
    </motion.div>
  );
}

export function Testimonials() {
  const { language } = useLanguage();
  const [reviews, setReviews] = useState<ReviewItem[]>(
    language === "fr" ? INITIAL_REVIEWS_FR : INITIAL_REVIEWS_EN
  );

  useEffect(() => {
    setReviews(language === "fr" ? INITIAL_REVIEWS_FR : INITIAL_REVIEWS_EN);
  }, [language]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews && data.reviews.length > 0) {
          const normalized = data.reviews.map((r: any) => ({
            title: r.title || "Review",
            body: r.experience || r.body || "",
            name: r.fullName || r.name || "Anonymous",
            rating: Number(r.rating) || 5,
          }));
          setReviews(normalized);
        }
      })
      .catch((err) => console.error("Error fetching reviews:", err));
  }, []);

  return (
    <section
      id="testimonials"
      className="relative w-full py-24 md:py-32 overflow-hidden flex flex-col items-center"
      style={{
        background: "linear-gradient(180deg, #2a1218 0%, #1a0d10 55%, #120a0b 100%)",
      }}
    >
      {/* Candlelit ambient glow, replaces the video */}
      <div className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[#C9A56B]/25 blur-[160px] -z-10" />
      <div className="pointer-events-none absolute bottom-[-15%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#5C2C35]/40 blur-[140px] -z-10" />

      {/* Floating embers */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {EMBERS.map((e, i) => (
          <span
            key={i}
            className="ember absolute bottom-0 rounded-full"
            style={{
              left: e.left,
              width: e.size,
              height: e.size,
              // @ts-ignore custom props read by the keyframe below
              "--duration": `${e.duration}s`,
              "--delay": `${e.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle film grain for a cinematic, storytelling feel */}
      <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.05] -z-10" style={{ mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      <div className="max-w-6xl mx-auto w-full px-6 flex flex-col items-center">
        {/* Section Header */}
        <h2
          style={{ fontFamily: "var(--font-accent)" }}
          className="text-center italic text-4xl md:text-5xl text-white mb-12 z-10 font-medium max-w-4xl px-4 leading-normal"
        >
          {language === "fr" ? "Dans chaque détail, une histoire qui mérite d'être racontée" : "In every detail, a story worth telling"}
        </h2>

        {/* Testimonial Grid & Glassmorphism Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 w-full">
          {reviews.map((item, index) => (
            <ReviewCard key={index} item={item} index={index} language={language} />
          ))}
        </div>

        {/* Bottom Action */}
        <div className="flex justify-center mt-12 z-10 w-full">
          <Link
            href="/reviews"
            style={{ fontFamily: "var(--font-sans)" }}
            className="text-xs tracking-widest uppercase text-white hover:text-[#C9A56B] transition-colors cursor-pointer font-semibold select-none"
          >
            {language === "fr" ? "Lire tous les avis" : "Read all reviews"}
          </Link>
        </div>

        {/* Repeating luxury background video */}
        <div className="mt-16 w-full max-w-4xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-10 aspect-video">
          <video
            src="/reviews.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <style jsx>{`
        .ember {
          background: radial-gradient(circle, rgba(201, 165, 107, 0.95) 0%, rgba(201, 165, 107, 0) 70%);
          opacity: 0;
          animation: ember-float var(--duration) linear infinite;
          animation-delay: var(--delay);
        }
        @keyframes ember-float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          8% {
            opacity: 0.85;
          }
          85% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-520px) translateX(24px);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ember {
            animation: none;
            opacity: 0.3;
          }
        }
      `}</style>
    </section>
  );
}

export default Testimonials;