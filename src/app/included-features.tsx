"use client";

import React from "react";
import { motion } from "framer-motion";

const TRADITIONAL_ITEMS = [
  "Forgotten in a drawer",
  "All the same, no personality",
  "Just paper, no emotion",
  "No idea who's confirmed",
  "Printing and shipping costs",
];

const OUR_ITEMS = [
  "An experience your guests will always remember",
  "Unique illustrations of your story and venue",
  "Music, animations and moments that move",
  "Dashboard to manage all RSVPs",
  "Instant delivery to everyone, no hidden costs",
];

export function IncludedFeatures() {
  return (
    <>
      {/* Section 1: The Difference Comparison Grid */}
      <section id="the-difference" className="bg-[#EBE7E0] border-t border-[#D4C4B7] py-24 px-4 md:px-8 w-full flex flex-col items-center">
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
          
          {/* Header */}
          <span className="text-[10px] tracking-widest uppercase text-[#7A7571] text-center mb-4 font-bold font-sans">
            THE DIFFERENCE
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#5C2C35] text-center max-w-2xl mx-auto font-light leading-tight">
            Your wedding deserves <span className="italic">something extraordinary</span>.
          </h2>
          <p className="text-sm font-sans text-[#7A7571] text-center max-w-xl mx-auto mt-6">
            Imagine your guests&apos; faces when they receive something they&apos;ve never seen before...
          </p>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 w-full max-w-4xl mx-auto mt-16 px-4">
            
            {/* Left Column - Traditional */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] tracking-widest uppercase text-[#7A7571] text-center mb-2 font-bold font-sans">
                TRADITIONAL INVITATION
              </span>
              {TRADITIONAL_ITEMS.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="bg-[#EBE7E0]/50 border border-[#D4C4B7]/50 rounded-2xl p-4 flex items-center gap-4"
                >
                  <div className="w-6 h-6 rounded-full bg-[#E1DCD3] text-[#7A7571] flex items-center justify-center flex-shrink-0 text-[10px] font-bold font-mono select-none">
                    X
                  </div>
                  <span className="text-sm text-[#7A7571]/70 font-sans font-medium">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Right Column - Us */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] tracking-widest uppercase text-[#7A7571] text-center mb-2 font-bold font-sans">
                YOUR INVITATION WITH US
              </span>
              {OUR_ITEMS.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="bg-[#FBF9F6] border border-[#D4C4B7] rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-6 h-6 rounded-full bg-[#E1DCD3] text-[#5C2C35] flex items-center justify-center flex-shrink-0 select-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-3 h-3 text-[#5C2C35]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-sm text-[#5C2C35] font-sans font-semibold">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>

          </div>

          {/* Bottom Quote */}
          <p className="text-base md:text-lg font-serif italic text-[#7A7571] mt-16 max-w-xl text-center leading-relaxed px-4">
            &ldquo;The first impression of your wedding starts with the invitation. Make it unforgettable.&rdquo;
          </p>

        </div>
      </section>

      {/* Section 2: Our Story */}
      <section id="our-story" className="bg-[#EBE7E0] pb-24 px-4 md:px-8 w-full flex flex-col items-center">
        <div className="max-w-3xl mx-auto w-full flex flex-col items-center">
          
          {/* Divider Line */}
          <div className="w-full max-w-4xl border-t border-[#D4C4B7]/60 mb-24" />

          {/* Header */}
          <span className="text-[10px] tracking-widest uppercase text-[#7A7571] text-center mb-4 font-bold font-sans">
            OUR STORY
          </span>
          <h2 className="text-4xl font-serif text-[#5C2C35] text-center font-light">
            Do you know our story?
          </h2>
          <div className="w-12 h-[1px] bg-[#D4C4B7] mx-auto mt-6 mb-12" />

          {/* Story Content */}
          <div className="max-w-2xl mx-auto flex flex-col gap-8 text-center px-4">
            <p className="text-[15px] font-sans font-light leading-relaxed text-[#7A7571]">
              LUXURY Invitation was born from a &ldquo;yes, I do&rdquo;. When we were planning our own wedding, we realized how difficult it was to find digital invitations that matched the aesthetic we had built in our minds. Everything was either too technical, too generic, or lacked that magical personal touch.
            </p>
            <p className="text-[15px] font-sans font-light leading-relaxed text-[#7A7571]">
              So, we decided to create our own. A platform where elegance, beautiful typography, and rich visual storytelling come together, allowing couples to invite their loved ones in a way that feels intimate, premium, and unique.
            </p>
            <p className="text-[15px] font-sans font-light leading-relaxed text-[#7A7571]">
              The rest is history. What started as a personal project for our wedding quickly grew as our friends, then friends of friends, and eventually thousands of couples around the world asked to use our designs to announce their special day.
            </p>
            <p className="text-[15px] font-sans font-light leading-relaxed text-[#7A7571]">
              Our mission is to translate every love story into an unforgettable digital experience, making sure the first impression of your wedding is as magical as the day itself.
            </p>
          </div>

          {/* Sign-off */}
          <div className="mt-16 text-center flex flex-col items-center">
            <span className="font-serif italic text-[#5C2C35] text-base flex items-center gap-1.5 font-normal">
              Thank you for trusting us.
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#5C2C35]">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </span>
            <span className="font-serif italic text-xs text-[#7A7571] mt-2 block font-normal">
              &mdash; With all our love, the team at LUXURY Invitation
            </span>
          </div>

        </div>
      </section>
    </>
  );
}

export default IncludedFeatures;
