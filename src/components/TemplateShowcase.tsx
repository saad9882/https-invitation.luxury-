"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TemplateSummary } from "@/data/templates";
import { PLANS } from "@/lib/plans";


interface TemplateShowcaseProps {
  template: TemplateSummary;
}

export function TemplateShowcase({ template }: TemplateShowcaseProps) {
  const router = useRouter();
  const plan = PLANS[template.tier];

  return (
    <div className="min-h-screen bg-[#FBF9F6] flex flex-col font-sans">
      {/* Floating back button */}
      <Link
        href="/templates"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FBF9F6]/85 backdrop-blur-md border border-[#D4C4B7]/40 shadow-sm text-[#5C2C35] hover:text-[#C9A56B] transition-colors text-[10px] font-bold uppercase tracking-widest"
      >
        ← All templates
      </Link>

      {/* Preview Area */}
      <div className="w-full h-[80vh] min-h-[500px] relative bg-[#FBF9F6] border-b border-[#D4C4B7]/30">
        {template.demoUrl ? (
          <iframe
            src={template.demoUrl}
            className="w-full h-full border-0"
            allow="autoplay"
            title={`${template.name} Live Preview`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-[#FBF9F6]">
            <div className="relative w-[210px] h-[420px] mb-6 drop-shadow-xl">
              <div
                className="absolute inset-0 rounded-[2.3rem] p-[2px]"
                style={{ background: "linear-gradient(155deg, #b7a081 0%, #8a7458 22%, #5f4d38 45%, #8a7458 68%, #372c20 100%)" }}
              >
                <div className="relative w-full h-full rounded-[2.2rem] bg-black p-[5px]">
                  <div className="relative w-full h-full bg-white rounded-[1.9rem] overflow-hidden">
                    <img src={template.phoneImage} alt={template.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
            <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-serif text-[#5C2C35] mb-2 font-normal">
              {template.name}
            </h3>
            <p className="text-xs text-[#5C2C35]/70 max-w-sm leading-relaxed">
              Our interactive live preview for this design is in final preparation. You can still select it below to build your custom wedding invitation.
            </p>
          </div>
        )}
      </div>

      {/* Plan / Decision Section */}
      <div className="w-full bg-[#EBE7E0] py-16 px-6 sm:px-8 md:px-12 flex flex-col items-center justify-center border-t border-[#D4C4B7]/20">
        <div className="max-w-xl w-full text-center">
          <span className="text-[#C9A56B] text-2xl mb-1 block">✦</span>
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-serif text-[#5C2C35] font-normal mb-2">
            {template.name}
          </h2>
          <p className="text-xs uppercase tracking-widest text-[#5C2C35]/70 mb-8 font-bold">
            This design is part of our {plan.name} collection
          </p>

          {/* Primary Card */}
          <div className="bg-[#FBF9F6] border border-[#D4C4B7]/60 rounded-[2rem] p-8 shadow-sm text-center mb-6">
            <h4 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-serif text-[#5C2C35] font-normal mb-2">
              {plan.name} Collection
            </h4>
            <p className="text-xs text-[#5C2C35]/65 mb-6 max-w-xs mx-auto leading-relaxed">
              Personalize this premium template with your own details, venue locations, RSVP options, and colors.
            </p>
            <button
              onClick={() => router.push(`/design?plan=${template.tier}&template=${template.id}`)}
              className="w-full bg-[#5C2C35] hover:bg-[#4A2229] text-white py-4 rounded-full font-bold text-xs tracking-widest uppercase transition-colors border-0 cursor-pointer shadow-sm"
            >
              Create my invitation with {plan.name} — {plan.price}€
            </button>
          </div>

          {/* Secondary Option */}
          <div className="border border-dashed border-[#5C2C35]/30 rounded-[2rem] p-8 text-center bg-[#FBF9F6]/45">
            <p className="text-xs text-[#5C2C35]/80 mb-4 max-w-xs mx-auto font-medium leading-relaxed">
              Love the feel of {template.name} but want something built entirely from scratch?
            </p>
            <button
              onClick={() => router.push(`/design/custom?plan=excellence&inspiration=${template.id}`)}
              className="w-full border border-[#5C2C35] text-[#5C2C35] hover:bg-[#5C2C35] hover:text-white py-3.5 rounded-full font-bold text-[10px] tracking-widest uppercase transition-all duration-300 bg-transparent cursor-pointer"
            >
              Go fully custom with Excellence — 975€
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateShowcase;
