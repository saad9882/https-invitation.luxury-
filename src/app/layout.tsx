import "./globals.css";
import type { Metadata } from "next";
import { playfairDisplay, cormorantGaramond, inter } from "@/lib/fonts";
import { Layout, FixedPlugin, StickyCTA } from "@/components";

export const metadata: Metadata = {
  title: "LUXURY Invitation | Faire-part de Mariage Numérique Haut de Gamme",
  description:
    "Créez des faire-part de mariage numériques interactifs d'exception avec animations fluides et suivi RSVP intégré.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfairDisplay.variable} ${cormorantGaramond.variable} ${inter.variable}`}>
      <head>
        <script
          defer
          data-site="YOUR_DOMAIN_HERE"
          src="https://api.nepcha.com/js/nepcha-analytics.js"
        ></script>
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="font-sans bg-[#FBF9F6] text-[#2A2726]">
        <Layout>
          {children}
          <FixedPlugin />
          <StickyCTA />
        </Layout>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
          integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </body>
    </html>
  );
}
