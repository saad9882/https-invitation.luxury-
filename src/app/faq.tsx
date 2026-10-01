"use client";

import React from "react";

const FAQS = [
  {
    title: "Can I customize the colors and typography?",
    desc: "Yes, our editing platform allows you to select your exact wedding color palette, upload custom assets, and choose from our curated library of premium serif and sans-serif fonts to match your celebration's theme perfectly.",
  },
  {
    title: "How does the guest RSVP tracking work?",
    desc: "Guests receive your interactive 3D invitation and can RSVP directly on the page. They can specify dietary preferences, guest count, and write a custom note. All guest responses are synced instantly to your Bespoke dashboard.",
  },
  {
    title: "Can we add background music or custom audio?",
    desc: "Absolutely. You can upload any song of your choice (MP3 or WAV) or choose from our pre-selected library of elegant classical and modern instrumentals to play as your guests open their digital envelope.",
  },
  {
    title: "Is it mobile friendly?",
    desc: "Yes, every digital invitation is built using responsive fluid layouts, ensuring your guests experience a stunning, seamless visual opening and interactive flow on both mobile devices and desktop computers.",
  },
];

export function Faq() {
  const [open, setOpen] = React.useState<number | null>(null);
  const handleOpen = (value: number) => setOpen(open === value ? null : value);

  return (
    <section id="faq" className="py-24 lg:py-36 px-8 bg-[#FBF9F6] border-t border-[#D4C4B7]">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16 lg:mb-20">
          <p className="font-sans text-xs uppercase tracking-widest text-[#7A7571] mb-3 font-semibold">
            Questions & Answers
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#2A2726] leading-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mx-auto border-t border-[#D4C4B7]">
          {FAQS.map(({ title, desc }, key) => {
            const isOpen = open === key + 1;
            return (
              <div key={key} className="border-b border-[#D4C4B7]">
                <button
                  onClick={() => handleOpen(key + 1)}
                  className="w-full text-left font-serif text-lg font-normal text-[#2A2726] hover:text-[#7A7571] py-5 flex justify-between items-center transition-colors focus:outline-none"
                >
                  <span>{title}</span>
                  <span className="ml-4 font-sans text-xl font-light text-[#7A7571] transition-transform duration-300">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 pb-6" : "max-h-0"
                  }`}
                >
                  <p className="font-sans text-sm sm:text-base text-[#7A7571] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Faq;
