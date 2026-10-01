"use client";

import React from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { LanguageProvider } from "@/lib/LanguageContext";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LanguageProvider>
  );
}

export default Layout;
