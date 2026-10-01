"use client";

import React from "react";
import { Navbar, Footer } from "@/components";
import ConciergeIntake from "@/components/ConciergeIntake";

export default function CustomDesignPage() {
  return (
    <div className="min-h-screen bg-[#EBE7E0] flex flex-col justify-between font-sans selection:bg-[#F0EBE1]">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-6 sm:px-8">
        <ConciergeIntake />
      </main>
      <Footer />
    </div>
  );
}
