"use client";

import React, { useState } from "react";
import Link from "next/link";


export function ConciergeIntake() {
  const [coupleNames, setCoupleNames] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vision, setVision] = useState("");
  const [referencePhoto, setReferencePhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferencePhoto(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission to backend API
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      /*
        TODO: Implement real CRM / backend POST request.
        Example payload:
        {
          coupleNames,
          eventDate,
          email,
          phone,
          vision,
          referencePhoto: referencePhoto ? referencePhoto.name : null
        }
        
        Send this data to your backend endpoint (e.g., /api/concierge-intake) or CRM integration.
      */
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center border border-[#D4C4B7] bg-white/70 backdrop-blur-sm p-8 sm:p-12 rounded-[2rem] shadow-md animate-fade-in">
        <div className="w-16 h-16 rounded-full border border-[#C9A56B] bg-[#C9A56B]/10 flex items-center justify-center mx-auto mb-6 text-[#5C2C35]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
          </svg>
        </div>
        <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl text-[#5C2C35] tracking-wide mb-4">
          Thank you
        </h2>
        <p style={{ fontFamily: "var(--font-sans)" }} className="text-sm text-[#5C2C35]/80 leading-relaxed mb-8">
          Your details have been registered on our Excellence tier system. Your dedicated concierge designer will reach out within 24h to begin crafting your bespoke invitation from scratch.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/">
            <button className="w-full bg-[#5C2C35] hover:bg-[#4A2229] text-white py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer border-0">
              Return to Homepage
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-12 border border-[#D4C4B7] bg-white/70 backdrop-blur-sm p-8 sm:p-12 rounded-[2rem] shadow-md">
      <div className="text-center mb-8 border-b border-[#D4C4B7]/60 pb-6">
        <h1 style={{ fontFamily: "var(--font-display)" }} className="text-3xl text-[#5C2C35] font-normal">
          Excellence Intake
        </h1>
        <span style={{ fontFamily: "var(--font-sans)" }} className="text-xs uppercase tracking-widest text-[#C9A56B] mt-2 block font-semibold">
          100% Bespoke Design Service
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 font-sans text-xs">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider text-[#7A7571] font-semibold">Couple&apos;s Names</label>
          <input
            type="text"
            required
            placeholder="e.g. Charlotte & Julian"
            value={coupleNames}
            onChange={(e) => setCoupleNames(e.target.value)}
            className="border-b border-[#D4C4B7] bg-transparent pb-1.5 text-xs focus:border-[#5C2C35] focus:outline-none transition-colors text-[#2A2726]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider text-[#7A7571] font-semibold">Target Event Date</label>
          <input
            type="date"
            required
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="border-b border-[#D4C4B7] bg-transparent pb-1.5 text-xs focus:border-[#5C2C35] focus:outline-none transition-colors text-[#2A2726]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider text-[#7A7571] font-semibold">Contact Email Address</label>
          <input
            type="email"
            required
            placeholder="e.g. charlotte@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-b border-[#D4C4B7] bg-transparent pb-1.5 text-xs focus:border-[#5C2C35] focus:outline-none transition-colors text-[#2A2726]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider text-[#7A7571] font-semibold">Contact Phone Number (Optional)</label>
          <input
            type="tel"
            placeholder="e.g. +33 6 1234 5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border-b border-[#D4C4B7] bg-transparent pb-1.5 text-xs focus:border-[#5C2C35] focus:outline-none transition-colors text-[#2A2726]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider text-[#7A7571] font-semibold">Describe Your Vision</label>
          <textarea
            required
            rows={4}
            placeholder="Describe your theme, desired vibe, art preferences, colors, elements you would like us to custom illustrate..."
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            className="border border-[#D4C4B7] bg-transparent p-2 text-xs focus:border-[#5C2C35] focus:outline-none transition-colors rounded-[2px] resize-none h-28 text-[#2A2726]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider text-[#7A7571] font-semibold">Optional Reference Photo</label>
          <div className="border border-dashed border-[#D4C4B7] bg-transparent p-4 rounded-[2px] text-center relative hover:bg-[#F0EBE1]/30 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            <p className="text-[10px] text-[#5C2C35] font-semibold">
              {referencePhoto ? `Selected: ${referencePhoto.name}` : "Upload vision moodboard or reference photo"}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#5C2C35] hover:bg-[#4A2229] text-white py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer border-0 disabled:bg-[#5C2C35]/50 disabled:cursor-not-allowed mt-4"
        >
          {isSubmitting ? "Submitting Request..." : "Submit to Concierge"}
        </button>
      </form>
    </div>
  );
}

export default ConciergeIntake;
