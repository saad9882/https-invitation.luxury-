"use client";

import React from "react";
import Link from "next/link";
import { Navbar, Footer } from "@/components";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#EBE7E0] text-[#2A2726] flex flex-col justify-between selection:bg-[#F0EBE1]">
      <Navbar />
      
      <main className="max-w-xl mx-auto px-6 py-32 md:py-48 flex flex-col items-center justify-center text-center flex-1 w-full gap-6">
        <h1 className="text-7xl md:text-8xl font-serif text-[#5C2C35] font-light tracking-wide">
          404
        </h1>
        <div className="h-[1px] w-16 bg-[#D4C4B7] mx-auto opacity-60" />
        <p className="text-xl font-serif italic text-[#5C2C35]">
          Page Not Found
        </p>
        <p className="font-sans text-sm text-[#7A7571] leading-relaxed max-w-sm">
          We apologize, but the invitation page or resource you are looking for has moved or does not exist.
        </p>
        <Link href="/">
          <button className="bg-[#5C2C35] hover:bg-[#4A2229] text-white px-8 py-3.5 rounded-full font-sans font-bold text-[10px] tracking-widest uppercase transition-all shadow-lg cursor-pointer border-0 mt-4">
            Return to Home
          </button>
        </Link>
      </main>

      <Footer />
    </div>
  );
}
