"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

function LoginContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  
  // Form states
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  const triggerFadeOut = () => {
    setFadeSplash(true);
    // Remove splash overlay from DOM after opacity fade completes (1000ms)
    setTimeout(() => {
      setShowSplash(false);
    }, 1000);
  };

  useEffect(() => {
    // 1.8 seconds backup timer to fade out splash screen automatically
    const timer = setTimeout(() => {
      triggerFadeOut();
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const redirectPath = searchParams.get("redirect") || "/design";

    try {
      if (isRegistering) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.error || "Failed to register account");
          return;
        }

        localStorage.setItem(
          "awff_user",
          JSON.stringify({ email: data.user.email, name: data.user.name, isLoggedIn: true })
        );
        router.push(redirectPath);
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.error || "Invalid email or password");
          return;
        }

        localStorage.setItem(
          "awff_user",
          JSON.stringify({ email: data.user.email, name: data.user.name, isLoggedIn: true })
        );
        router.push(redirectPath);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
    setError("");
    setName("");
    setPassword("");
  };

  return (
    <div className="relative min-h-screen bg-[#FBF9F6] text-[#2A2726] flex items-center justify-center px-4 font-sans select-none overflow-hidden">
      
      {/* 1. Cinematic Video Splash Screen Overlay */}
      {showSplash && (
        <div 
          className={`absolute inset-0 z-50 bg-[#FBF9F6] transition-opacity duration-1000 ease-in-out ${
            fadeSplash ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <video
            src="/video.mp4"
            autoPlay
            muted
            playsInline
            onEnded={triggerFadeOut}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 2. Centered Minimalist Login form */}
      <div className="max-w-md w-full border border-[#D4C4B7] bg-[#FBF9F6] p-8 sm:p-12 rounded-[2px] shadow-none z-10">
        <div className="text-center mb-10">
          <Link 
            href="/" 
            className="text-xs uppercase tracking-widest text-[#7A7571] hover:text-[#2A2726] transition-colors font-semibold block mb-4"
          >
            &larr; Retour à l&apos;Accueil
          </Link>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#2A2726] tracking-wide">
            {isRegistering ? "Créer un Compte" : "Bienvenue chez LUXURY Invitation"}
          </h1>
          <p className="text-sm text-[#7A7571] font-sans mt-3">
            {isRegistering 
              ? "Inscrivez-vous pour commencer la personnalisation de vos faire-part" 
              : "Connectez-vous pour gérer vos invitations numériques"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-6">
          {isRegistering && (
            <div className="flex flex-col gap-1.5 animate-fade-in">
              <label className="text-xs uppercase tracking-widest text-[#7A7571] font-semibold">
                Nom Complet
              </label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Pierre Dupont"
                className="border-b border-[#D4C4B7] bg-transparent pb-2 font-sans text-sm text-[#2A2726] placeholder-[#7A7571]/50 focus:border-[#2A2726] focus:outline-none transition-colors w-full"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-widest text-[#7A7571] font-semibold">
              Adresse E-mail
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nom@exemple.com"
              className="border-b border-[#D4C4B7] bg-transparent pb-2 font-sans text-sm text-[#2A2726] placeholder-[#7A7571]/50 focus:border-[#2A2726] focus:outline-none transition-colors w-full"
            />
            {error && (
              <span className="text-[#991B1B] text-[11px] mt-1 font-sans font-semibold">
                {error}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-widest text-[#7A7571] font-semibold">
              Mot de Passe
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border-b border-[#D4C4B7] bg-transparent pb-2 font-sans text-sm text-[#2A2726] placeholder-[#7A7571]/50 focus:border-[#2A2726] focus:outline-none transition-colors w-full"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#D4A574] text-[#FBF9F6] py-3.5 mt-4 rounded-full font-sans font-medium text-sm hover:bg-[#C29260] transition-all normal-case focus:outline-none cursor-pointer border-0"
          >
            {isRegistering ? "Créer mon compte" : "Se connecter"}
          </button>
        </form>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#7A7571]">
          {isRegistering ? (
            <button 
              onClick={toggleAuthMode}
              className="hover:text-[#2A2726] transition-colors bg-transparent border-0 cursor-pointer font-medium"
            >
              Déjà un compte ? Se connecter
            </button>
          ) : (
            <>
              <Link href="#forgot" className="hover:text-[#2A2726] transition-colors">
                Mot de passe oublié ?
              </Link>
              <button 
                onClick={toggleAuthMode}
                className="hover:text-[#2A2726] transition-colors bg-transparent border-0 cursor-pointer font-medium"
              >
                Pas encore de compte ? S&apos;inscrire
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="bg-[#EBE7E0] min-h-screen flex items-center justify-center font-sans text-sm text-[#5C2C35]">Loading...</div>}>
      <LoginContent />
    </React.Suspense>
  );
}
