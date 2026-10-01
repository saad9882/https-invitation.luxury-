// src/components/PricingPlans.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PLANS, PlanId } from "@/lib/plans";


export function PricingPlans() {
  const router = useRouter();

  const handleSelect = (planId: PlanId) => {
    if (planId === "excellence") {
      // Bespoke, no template step.
      router.push(`/design/custom?plan=${planId}`);
    } else {
      router.push("/templates");
    }
  };

  const planOrder: PlanId[] = ["essential", "premium", "excellence"];

  return (
    <section
      className="relative w-full bg-[#EBE7E0] py-24 px-6 sm:px-8 md:px-12"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-4xl md:text-5xl text-[#5C2C35] font-normal">
            Choose your plan
          </h1>
          <span style={{ fontFamily: "var(--font-accent)" }} className="text-lg md:text-xl italic text-[#C9A56B] mt-2 block font-medium">
            From ready-to-personalize to entirely bespoke
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {planOrder.map((id) => {
            const plan = PLANS[id];
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`relative flex flex-col h-full rounded-[1.75rem] border bg-white/70 backdrop-blur-sm p-8 ${plan.mostPopular ? "border-[#C9A56B] shadow-xl md:-translate-y-3" : "border-[#D4C4B7] shadow-sm"
                  }`}
              >
                {plan.mostPopular && (
                  <span
                    style={{ fontFamily: "var(--font-sans)" }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5C2C35] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full"
                  >
                    Most chosen
                  </span>
                )}

                <span style={{ fontFamily: "var(--font-sans)" }} className="text-xs uppercase tracking-widest text-[#8a5a45] font-semibold">
                  Wedding invitation
                </span>
                <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl text-[#5C2C35] mt-1">
                  {plan.name}
                </h2>
                <p style={{ fontFamily: "var(--font-sans)" }} className="text-sm text-[#5C2C35]/70 mt-2 leading-relaxed">
                  {plan.tagline}
                </p>

                <div className="mt-6 flex items-end gap-1">
                  <span style={{ fontFamily: "var(--font-display)" }} className="text-4xl text-[#5C2C35]">
                    {plan.price}€
                  </span>
                  <span style={{ fontFamily: "var(--font-sans)" }} className="text-xs text-[#5C2C35]/60 mb-1">
                    EUR
                  </span>
                </div>

                {plan.extrasIncluded && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {plan.extrasIncluded.map((extra) => (
                      <span
                        key={extra}
                        style={{ fontFamily: "var(--font-sans)" }}
                        className="text-[10px] uppercase tracking-wide bg-[#C9A56B]/15 text-[#8a5a45] px-2.5 py-1 rounded-full font-semibold"
                      >
                        {extra}
                      </span>
                    ))}
                  </div>
                )}

                <ul style={{ fontFamily: "var(--font-sans)" }} className="mt-6 space-y-3 text-sm text-[#5C2C35]/85 flex-1">
                  {plan.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="text-[#C9A56B] mt-0.5">✓</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {plan.features.directDesignerContact && (
                  <p style={{ fontFamily: "var(--font-sans)" }} className="text-xs text-[#5C2C35]/60 italic mt-4">
                    Direct contact with your personal designer after the order.
                  </p>
                )}

                <button
                  onClick={() => handleSelect(id)}
                  style={{ fontFamily: "var(--font-sans)" }}
                  className="mt-8 w-full bg-[#5C2C35] hover:bg-[#4A2229] text-white py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-colors cursor-pointer border-0"
                >
                  {id === "excellence" ? "Start bespoke design" : "Choose " + plan.name}
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center max-w-2xl mx-auto">
          <h3 style={{ fontFamily: "var(--font-accent)" }} className="italic text-2xl text-[#5C2C35] mb-2">
            You&apos;ll-Love-It Promise
          </h3>
          <p style={{ fontFamily: "var(--font-sans)" }} className="text-sm text-[#5C2C35]/70 leading-relaxed">
            We work with you, revision after revision, until your invitation moves you. You won&apos;t share it with the world until every detail feels exactly the way you dreamed it.
          </p>
        </div>
      </div>
    </section>
  );
}

export default PricingPlans;