import React from "react";
import { Navbar, Footer } from "@/components";
import TemplateGallery from "@/components/TemplateGallery";

export default function TemplatesPage() {
  return (
    <>
      <Navbar />
      <div className="pt-20 bg-[#EBE7E0] min-h-screen">
        <TemplateGallery />
      </div>
      <Footer />
    </>
  );
}
