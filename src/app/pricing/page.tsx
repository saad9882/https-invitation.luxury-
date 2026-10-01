"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import PricingPlans from "@/components/PricingPlans";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#EBE7E0] text-[#2A2726] flex flex-col justify-between font-sans selection:bg-[#F0EBE1]">
      <Navbar />
      <main className="flex-1 pt-12">
        <PricingPlans />
      </main>
      <Footer />
    </div>
  );

}
