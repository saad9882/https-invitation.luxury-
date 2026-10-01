"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar, Footer } from "@/components";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session_id");
  const slugParam = searchParams.get("slug");

  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [slug, setSlug] = useState<string>(slugParam || "");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [liveUrl, setLiveUrl] = useState("");

  useEffect(() => {
    async function verifyOrder() {
      try {
        const query = sessionId ? `session_id=${sessionId}` : `slug=${slugParam}`;
        const res = await fetch(`/api/stripe/verify?${query}`);
        const data = await res.json();

        if (data.success && data.slug) {
          setSlug(data.slug);
          setInvitation(data.invitation);
          if (typeof window !== "undefined" && data.invitation?.templateId) {
            localStorage.setItem("std_paid_" + data.invitation.templateId, "true");
          }
        } else {
          setError(data.error || "Could not verify transaction.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load order.");
      } finally {
        setLoading(false);
      }
    }

    if (sessionId || slugParam) {
      verifyOrder();
    } else {
      setLoading(false);
    }
  }, [sessionId, slugParam]);

  useEffect(() => {
    if (slug && typeof window !== "undefined") {
      const host = window.location.host;
      const protocol = window.location.protocol;
      let cleanHost = host;
      if (cleanHost.startsWith("www.")) {
        cleanHost = cleanHost.substring(4);
      }
      
      const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || cleanHost;
      if (cleanHost.includes("localhost")) {
        const port = window.location.port ? `:${window.location.port}` : "";
        setLiveUrl(`${protocol}//${slug}.localhost${port}`);
      } else {
        setLiveUrl(`${protocol}//${slug}.${baseDomain}`);
      }
    }
  }, [slug]);

  const handleCopy = () => {
    if (liveUrl) {
      navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#EBE7E0] min-h-screen flex flex-col justify-between font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 pt-28 pb-16">
          <div className="max-w-md w-full border border-[#D4C4B7] bg-white/80 backdrop-blur-sm p-10 rounded-[2rem] text-center shadow-md">
            <span className="text-[#C9A56B] text-3xl animate-pulse block mb-4">✦</span>
            <h2 className="text-xl font-serif text-[#5C2C35] mb-2">Vérification du paiement & Finalisation...</h2>
            <p className="text-xs text-[#7A7571]">Veuillez patienter pendant la mise en ligne de votre site de faire-part sur mesure.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#EBE7E0] min-h-screen flex flex-col justify-between font-sans selection:bg-[#F0EBE1]">
      <Navbar />
      <main className="flex-1 pt-28 pb-16 px-6 sm:px-8 md:px-12 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white/80 backdrop-blur-sm border border-[#D4C4B7] rounded-[2.5rem] p-8 sm:p-12 shadow-lg text-center space-y-6">
          {/* Champagne/Gold Seal */}
          <div className="w-16 h-16 rounded-full bg-[#C9A56B]/15 border border-[#C9A56B]/40 flex items-center justify-center mx-auto text-[#8a5a45] text-2xl">
            ✓
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#8a5a45] font-bold bg-[#C9A56B]/20 px-3 py-1 rounded-full inline-block mb-3">
              Paiement Confirmé
            </span>
            <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl sm:text-3xl font-serif text-[#5C2C35] font-normal">
              Votre Faire-part est en Ligne !
            </h1>
            <p className="text-xs sm:text-sm text-[#5C2C35]/75 mt-2 max-w-sm mx-auto leading-relaxed">
              Félicitations ! Votre site de faire-part de mariage a été publié avec succès et est prêt à être partagé avec vos proches.
            </p>
          </div>

          {/* Invitation Link Box */}
          {liveUrl && (
            <div className="p-4 border border-[#D4C4B7] bg-[#FBF9F6] rounded-2xl text-left space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#7A7571] font-bold block">
                Votre lien d&apos;invitation direct
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={liveUrl}
                  className="flex-1 bg-white border border-[#D4C4B7]/70 rounded-lg px-3 py-2 text-xs text-[#2A2726] font-mono select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="bg-[#5C2C35] hover:bg-[#4A2229] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-0 whitespace-nowrap"
                >
                  {copied ? "Copié ! ✓" : "Copier"}
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {invitation?.plan === "save_the_date" ? (
              <Link
                href={`/templates/${invitation.templateId || "bridgerton"}?paid=true`}
                className="flex-1 bg-[#5C2C35] hover:bg-[#4A2229] text-white py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all inline-block text-center border-0 cursor-pointer shadow-sm"
              >
                📥 Télécharger mon PDF HD ↗
              </Link>
            ) : (
              <Link
                href={liveUrl || `/invite/${slug}`}
                target="_blank"
                className="flex-1 bg-[#5C2C35] hover:bg-[#4A2229] text-white py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all inline-block text-center border-0 cursor-pointer shadow-sm"
              >
                Voir le Faire-part ↗
              </Link>
            )}
            <Link
              href="/"
              className="flex-1 border border-[#D4C4B7] hover:bg-[#F0EBE1]/40 text-[#5C2C35] py-3.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all inline-block text-center cursor-pointer"
            >
              Retour à l&apos;Accueil
            </Link>
          </div>

          {/* Order Details Summary */}
          {invitation && (
            <div className="pt-6 border-t border-[#D4C4B7]/60 text-left text-xs text-[#5C2C35]/80 space-y-1.5 font-sans">
              <div className="flex justify-between">
                <span className="text-[#7A7571]">Mariés :</span>
                <span className="font-semibold">{invitation.partner1} & {invitation.partner2}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A7571]">Date du Mariage :</span>
                <span>{invitation.weddingDateDisplay || invitation.weddingDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A7571]">Lieu :</span>
                <span>{invitation.venueName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A7571]">Formule :</span>
                <span className="uppercase font-bold text-[#8a5a45]">{invitation.plan}</span>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#EBE7E0] min-h-screen flex items-center justify-center font-sans text-sm text-[#5C2C35]">
          Chargement de la confirmation...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
