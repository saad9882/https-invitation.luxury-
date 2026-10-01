"use client";

import React from "react";
import PricingPlans from "@/components/PricingPlans";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#2A2726] font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 container mx-auto px-8 py-24 max-w-3xl mt-10">
        <h1 className="text-4xl font-serif font-normal tracking-wide text-center mb-4">
          Privacy Policy
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#7A7571] text-center mb-12 font-semibold">
          Last Updated: July 1, 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-[#7A7571]">
          <section className="space-y-3">
            <h2 className="text-xl font-serif text-[#2A2726] font-normal tracking-wide">
              1. Information We Collect
            </h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </section>

          <div className="h-[1px] w-full bg-[#D4C4B7]/40" />

          <section className="space-y-3">
            <h2 className="text-xl font-serif text-[#2A2726] font-normal tracking-wide">
              2. How We Use Your Information
            </h2>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            <p>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
            </p>
          </section>

          <div className="h-[1px] w-full bg-[#D4C4B7]/40" />

          <section className="space-y-3">
            <h2 className="text-xl font-serif text-[#2A2726] font-normal tracking-wide">
              3. Data Security &amp; Sharing
            </h2>
            <p>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
            </p>
            <p>
              Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
            </p>
          </section>

          <div className="h-[1px] w-full bg-[#D4C4B7]/40" />

          <section className="space-y-3">
            <h2 className="text-xl font-serif text-[#2A2726] font-normal tracking-wide">
              4. Contact Our Privacy Officer
            </h2>
            <p>
              If you have any questions or concerns regarding our privacy practices, please contact us at:
            </p>
            <p className="font-semibold text-[#2A2726]">
              LUXURY Invitation Privacy Team<br />
              Email: privacy@luxuryinvitation.co<br />
              Address: Via Regina 46, Cernobbio, Lake Como, Italy
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
