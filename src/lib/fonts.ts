import localFont from "next/font/local";

export const playfairDisplay = localFont({
  src: [
    { path: "../../public/fonts/PlayfairDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/PlayfairDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/PlayfairDisplay-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const cormorantGaramond = localFont({
  src: [
    { path: "../../public/fonts/CormorantGaramond-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/CormorantGaramond-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/CormorantGaramond-Italic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/CormorantGaramond-MediumItalic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-accent",
  display: "swap",
});

export const inter = localFont({
  src: [
    { path: "../../public/fonts/Inter-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Inter-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Inter-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/Inter-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});
