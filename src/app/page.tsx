"use client";

import React, { useState } from "react";
// components
import { Navbar, Footer } from "@/components";

// sections
import Hero from "./hero";
import IncludedFeatures from "./included-features";
import TemplatesGallery from "@/components/TemplateGallery";
import Testimonials from "./testimonials";
import HowItWorks from "./how-it-works";
import EssentialVsPremium from "./essential-vs-premium";
import Faq from "./faq";

export default function Portfolio() {
  const [activeDemoUrl, setActiveDemoUrl] = useState<string>("/demos/template_3/index.html");

  const handleSelectTemplate = (demoUrl: string) => {
    setActiveDemoUrl(demoUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Navbar />
      <Hero activeDemoUrl={activeDemoUrl} />
      <TemplatesGallery onSelectTemplate={handleSelectTemplate} />
      <Testimonials />
      <HowItWorks />
      <EssentialVsPremium />
      <IncludedFeatures />
      <Faq />
      <Footer />
    </>
  );
}
