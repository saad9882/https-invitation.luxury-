"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getTemplateById } from "@/data/templates";
import { PLANS, PlanId } from "@/lib/plans";
import { Navbar, Footer } from "@/components";

function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();

  const planParam = params.get("plan");
  const templateParam = params.get("template");
  const canceledParam = params.get("canceled");

  const [loading, setLoading] = useState(false);
  const [designData, setDesignData] = useState<any>(null);
  const [userEmail, setUserEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load customizer state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("luxury_invitation_user") || localStorage.getItem("awff_user");
      const user = userStr ? JSON.parse(userStr) : { email: "guest@luxuryinvitation.co" };
      if (user.email !== "guest@luxuryinvitation.co" && user.email !== "guest@awff.co") {
        setUserEmail(user.email);
      }

      const savedDesign = localStorage.getItem("luxury_design_" + user.email) || localStorage.getItem("awff_design_" + user.email);
      if (savedDesign) {
        const parsed = JSON.parse(savedDesign);
        setDesignData(parsed);
        if (parsed.partner1 && parsed.partner2) {
          setCustomerName(`${parsed.partner1} & ${parsed.partner2}`);
        }
      } else {
        const fallbackDesign = localStorage.getItem("luxury_design_guest@luxuryinvitation.co") || localStorage.getItem("awff_design_guest@awff.co");
        if (fallbackDesign) {
          const parsed = JSON.parse(fallbackDesign);
          setDesignData(parsed);
          if (parsed.partner1 && parsed.partner2) {
            setCustomerName(`${parsed.partner1} & ${parsed.partner2}`);
          }
        }
      }
    }
  }, []);

  // Validation: Missing BOTH plan and template is a hard fail.
  if (!planParam && !templateParam) {
    return (
      <div className="bg-[#EBE7E0] min-h-screen flex flex-col justify-between font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 pt-24 pb-12">
          <div className="max-w-md w-full border border-[#D4C4B7] bg-white/80 backdrop-blur-sm p-8 sm:p-10 rounded-[2rem] text-center shadow-md">
            <span className="text-[#C9A56B] text-4xl mb-4 block">✦</span>
            <h2 className="text-2xl font-serif text-[#5C2C35] mb-3">No Template Selected</h2>
            <p className="text-sm text-[#5C2C35]/75 leading-relaxed mb-6">
              Please choose a plan and template style from our collection before proceeding to checkout.
            </p>
            <Link
              href="/templates"
              className="w-full bg-[#5C2C35] hover:bg-[#4A2229] text-white py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors inline-block text-center border-0 cursor-pointer"
            >
              Go to Template Gallery
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Gracefully resolve plan and template
  const planId: PlanId = (planParam as PlanId) || "essential";
  const planConfig = PLANS[planId] || PLANS.essential;

  const tplId = templateParam || "template_3";
  const templateConfig = getTemplateById(tplId);
  const templateName = templateConfig ? templateConfig.name : "Custom Invitation";

  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: planId,
          templateId: tplId,
          userEmail: userEmail || "guest@luxuryinvitation.co",
          customerName: customerName || "Guest",
          designData: designData || {},
        }),
      });

      const resData = await response.json();

      if (resData.success && resData.url) {
        // Clear local storage if published
        if (typeof window !== "undefined") {
          localStorage.removeItem("awff_design_" + userEmail);
        }
        // Redirect to Stripe Hosted Checkout or demo success
        window.location.href = resData.url;
      } else {
        setErrorMessage(resData.error || "Failed to initialize Stripe checkout. Please try again.");
      }
    } catch (err: any) {
      console.error("Checkout initiation error:", err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#EBE7E0] min-h-screen flex flex-col justify-between font-sans selection:bg-[#F0EBE1]">
      <Navbar />
      <main className="flex-1 pt-28 pb-16 px-6 sm:px-8 md:px-12 flex items-center justify-center">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* LEFT: Stripe Secure Checkout Form */}
          <div className="md:col-span-7 bg-white/80 backdrop-blur-sm border border-[#D4C4B7] rounded-[2.5rem] p-8 sm:p-10 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-widest text-[#8a5a45] font-bold bg-[#C9A56B]/20 px-3 py-0.5 rounded-full">
                  Paiement Sécurisé
                </span>
                <span className="text-[10px] text-[#7A7571] flex items-center gap-1 font-medium">
                  🔒 Chiffrement SSL 256 bits
                </span>
              </div>
              <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl sm:text-3xl font-serif text-[#5C2C35] font-normal">
                Finaliser & Publier
              </h1>
              <p className="text-xs text-[#5C2C35]/70 mt-1">
                Vous serez redirigé en toute sécurité vers Stripe pour finaliser votre commande.
              </p>
            </div>

            {canceledParam && (
              <div className="p-3 border border-amber-300 bg-amber-50 rounded-xl text-xs text-amber-800">
                Le paiement a été annulé. Vous pouvez modifier vos informations ci-dessous et réessayer.
              </div>
            )}

            {errorMessage && (
              <div className="p-3 border border-red-300 bg-red-50 rounded-xl text-xs text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleStripeCheckout} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-[#7A7571] font-bold">
                  Adresse e-mail pour le reçu &amp; l&apos;accès
                </label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="border-b border-[#D4C4B7] bg-transparent pb-2 focus:border-[#5C2C35] focus:outline-none text-sm transition-colors placeholder:text-[#7A7571]/40"
                />
              </div>

              <div className="flex flex-col gap-1.5 pt-2">
                <label className="text-[10px] uppercase tracking-widest text-[#7A7571] font-bold">
                  Titulaire de la carte / Contact principal
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="ex. Amélie & Pierre"
                  className="border-b border-[#D4C4B7] bg-transparent pb-2 focus:border-[#5C2C35] focus:outline-none text-sm transition-colors placeholder:text-[#7A7571]/40"
                />
              </div>

              {/* Supported Payment Methods Badges */}
              <div className="pt-3 border-t border-[#D4C4B7]/40 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#7A7571] font-semibold block">
                  Moyens de paiement acceptés via Stripe
                </span>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#5C2C35]">
                  <span className="px-2.5 py-1 bg-[#FBF9F6] border border-[#D4C4B7] rounded-md font-semibold">💳 Cartes Bancaires</span>
                  <span className="px-2.5 py-1 bg-[#FBF9F6] border border-[#D4C4B7] rounded-md font-semibold"> Apple Pay</span>
                  <span className="px-2.5 py-1 bg-[#FBF9F6] border border-[#D4C4B7] rounded-md font-semibold">G Google Pay</span>
                  <span className="px-2.5 py-1 bg-[#FBF9F6] border border-[#D4C4B7] rounded-md font-semibold">Virements Bancaires</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#5C2C35] hover:bg-[#4A2229] text-white py-4 rounded-full font-bold text-xs tracking-widest uppercase transition-all border-0 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Redirection vers Stripe...</span>
                  ) : (
                    <span>Payer par Stripe — {planConfig.price}€</span>
                  )}
                </button>
              </div>
            </form>

            <p className="text-[10px] text-center text-[#7A7571] leading-relaxed">
              En cliquant sur « Payer par Stripe », vous serez redirigé vers la passerelle sécurisée. Votre faire-part sera mis en ligne immédiatement après validation du paiement.
            </p>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="md:col-span-5 border border-[#D4C4B7] bg-white/60 backdrop-blur-sm rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div>
              <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-serif text-[#5C2C35] font-normal">
                Récapitulatif de Commande
              </h2>
              <p className="text-xs text-[#7A7571] mt-0.5">Détails de votre formule sélectionnée</p>
            </div>

            <div className="space-y-4 text-sm text-[#5C2C35]/80">
              <div className="flex justify-between items-center pb-3 border-b border-[#D4C4B7]/40">
                <div>
                  <span className="font-semibold block">{templateName}</span>
                  <span className="text-[11px] text-[#7A7571]">Faire-part numérique</span>
                </div>
                <span className="text-xs uppercase tracking-widest bg-[#C9A56B]/20 text-[#8a5a45] px-3 py-1 rounded-full font-bold">
                  {planConfig.name}
                </span>
              </div>

              {designData && (
                <div className="space-y-2 text-xs text-[#5C2C35]/70 pt-1 border-b border-[#D4C4B7]/40 pb-4">
                  <p className="uppercase tracking-widest font-semibold text-[9px] text-[#7A7571]">
                    Détails du faire-part personnalisé
                  </p>
                  <p><strong>Hôtes :</strong> {designData.partner1} & {designData.partner2}</p>
                  <p><strong>Date :</strong> {designData.weddingDate}</p>
                  <p><strong>Lieu :</strong> {designData.venueName}</p>
                </div>
              )}

              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex justify-between text-[#7A7571]">
                  <span>Sous-total :</span>
                  <span>{planConfig.price}€</span>
                </div>
                <div className="flex justify-between text-[#7A7571]">
                  <span>Hébergement & Lien direct :</span>
                  <span className="text-emerald-700 font-semibold">Inclus ✓</span>
                </div>
                <div className="flex justify-between text-[#7A7571]">
                  <span>Révisions :</span>
                  <span>{planConfig.features.revisionRounds} sessions</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-base font-bold text-[#5C2C35] pt-3 border-t border-[#D4C4B7]/60">
                <span>Total à régler :</span>
                <span className="text-2xl font-serif">{planConfig.price}€</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#EBE7E0] min-h-screen flex items-center justify-center font-sans text-sm text-[#5C2C35]">
          Chargement de la commande...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
