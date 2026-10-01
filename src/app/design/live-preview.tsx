"use client";

import React, { useState, useEffect } from "react";

const ensureExternalLink = (url: string): string => {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^(https?:)?\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

interface LivePreviewProps {
  partner1: string;
  partner2: string;
  weddingDate: string;
  venueName: string;
  venueAddress: string;

  namesFont: string;
  headersFont: string;
  bodyFont: string;

  bgColor: string;
  textColor: string;
  accentColor: string;

  inviteText: string;
  requestText: string;
  ceremonyText: string;
  rsvpDeadlineText: string;

  dressCode: string;
  timeline: string;
  registryLink: string;

  heroMediaUrl: string;
  venueMediaUrl: string;
  musicMediaUrl: string;

  music: string;
  musicPlaying: boolean;
  setMusicPlaying: (val: boolean) => void;
  floralsEnabled: boolean;
  splashStyle: string;

  // New Block-based props & coordinates states
  blocks: Array<{ id: string; type: string; content: string }>;
  latitude: number;
  longitude: number;
  splashIntroOption: string;
}

export function LivePreview({
  partner1, partner2, weddingDate, venueName, venueAddress,
  namesFont, headersFont, bodyFont,
  bgColor, textColor, accentColor,
  inviteText, requestText, ceremonyText, rsvpDeadlineText,
  dressCode, timeline, registryLink,
  heroMediaUrl, venueMediaUrl, musicMediaUrl,
  music, musicPlaying, setMusicPlaying,
  floralsEnabled, splashStyle,
  blocks, latitude, longitude, splashIntroOption
}: LivePreviewProps) {
  const [triggerSplash, setTriggerSplash] = useState(false);
  const [splashVisible, setSplashVisible] = useState(false);

  // Trigger splash intro animation when splashStyle or splashIntroOption updates or manually replayed
  const replaySplash = () => {
    setSplashVisible(true);
    setTriggerSplash(false);
    setTimeout(() => {
      setTriggerSplash(true);
    }, 100);
    setTimeout(() => {
      setSplashVisible(false);
    }, 2000); // Fades out after 2s
  };

  useEffect(() => {
    replaySplash();
  }, [splashStyle, splashIntroOption]);

  // Format date display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Saturday, October 17, 2026";
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isVideoUrl = (url: string) => {
    if (!url) return false;
    return url.startsWith("data:video") || url.includes("video") || url.endsWith(".mp4");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 select-none">
      
      {/* Dynamic Style Injection for Premium Google Fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Bodoni+Moda:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;600&family=Inter:wght@300;400;600&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif !important; }
        .font-bodoni { font-family: 'Bodoni Moda', serif !important; }
        .font-lora { font-family: 'Lora', serif !important; }
        .font-montserrat { font-family: 'Montserrat', sans-serif !important; }
        .font-inter { font-family: 'Inter', sans-serif !important; }
      `}} />

      {/* Hidden custom audio element player */}
      {musicMediaUrl && musicPlaying && (
        <audio src={musicMediaUrl} autoPlay loop style={{ display: "none" }} />
      )}

      {/* iPhone 17 Pro Max Mockup Container */}
      <div 
        className="relative w-[340px] h-[670px] border-[8px] border-[#1C1C1E] rounded-[48px] bg-black overflow-hidden flex flex-col shadow-xl transition-all duration-300"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {/* Dynamic Island Pill Cutout */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1C1C1E] block" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#09090B] block" />
        </div>

        {/* Scrollable Viewport Invitation Body */}
        <div className="flex-1 overflow-y-auto px-6 py-16 flex flex-col justify-between items-center text-center relative rounded-[40px]">
          
          {/* Main Hero Background Media (Image or Video) */}
          {heroMediaUrl && (
            <div className="absolute inset-0 z-0">
              {isVideoUrl(heroMediaUrl) ? (
                <video src={heroMediaUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <img src={heroMediaUrl} className="absolute inset-0 w-full h-full object-cover" alt="Hero background custom asset" />
              )}
              {/* Soft overlay gradient for editorial readability */}
              <div className="absolute inset-0 bg-black/15" />
            </div>
          )}

          {/* Top Graphic Ornaments */}
          <div className="mt-4 min-h-[3rem] flex items-center justify-center z-10">
            {floralsEnabled && (
              <svg className="w-10 h-10 opacity-50" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M12 3c-1.5 2-3 4-3 6s1.5 3 3 3M12 9c1.5 2 3 4 3 6s-1.5 3-3 3M12 15c-1.5 2-3 4-3 6" />
              </svg>
            )}
          </div>

          {/* Invitation Text Content Card */}
          <div className="space-y-4 my-auto z-10 bg-[#FBF9F6]/85 backdrop-blur-sm p-5 border border-[#D4C4B7]/40 rounded-[2px] w-full">
            <p className={`text-[9px] uppercase tracking-widest text-[#7A7571] font-semibold ${bodyFont}`}>
              {inviteText}
            </p>
            
            <h2 className={`text-2xl font-light tracking-wide leading-tight ${namesFont}`} style={{ color: textColor }}>
              {partner1 || "Partner 1"}
              <span className="block text-xs text-[#7A7571] my-1.5 italic">and</span>
              {partner2 || "Partner 2"}
            </h2>

            <div className="h-[1px] w-12 mx-auto my-4" style={{ backgroundColor: accentColor }} />

            <p className={`text-[10px] text-[#7A7571] tracking-wide leading-relaxed ${bodyFont}`}>
              {requestText}
            </p>

            <p className={`text-xs uppercase tracking-wider font-semibold pt-2 ${headersFont}`}>
              {formatDate(weddingDate)}
            </p>
          </div>

          {/* DYNAMIC BLOCKS FLOW: Render blocks inline */}
          {blocks.length > 0 && (
            <div className="w-full space-y-4 mt-6 z-10 p-2 bg-[#FBF9F6]/60 backdrop-blur-sm rounded-[2px] border border-[#D4C4B7]/30">
              {blocks.map((block) => (
                <div key={block.id} className="w-full">
                  {block.type === "graphic" && (
                    <div className="w-full text-center">
                      {block.content === "divider" && (
                        <div className="flex items-center justify-center my-3 opacity-60">
                          <div className="h-[1px] w-12 bg-[#D4C4B7]" />
                          <span className="mx-2 text-xs" style={{ color: accentColor }}>✦</span>
                          <div className="h-[1px] w-12 bg-[#D4C4B7]" />
                        </div>
                      )}
                      {block.content === "heart" && (
                        <span className="text-sm my-2 block" style={{ color: accentColor }}>♥</span>
                      )}
                      {block.content === "leaves" && (
                        <div className="flex items-center justify-center my-3 opacity-55" style={{ color: accentColor }}>
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v18M12 3c-1.5 2-3 4-3 6s1.5 3 3 3M12 9c1.5 2 3 4 3 6s-1.5 3-3 3M12 15c-1.5 2-3 4-3 6" />
                          </svg>
                        </div>
                      )}
                      {block.content === "monogram" && (
                        <div className="w-8 h-8 rounded-full border border-[#D4C4B7]/50 flex items-center justify-center font-serif text-[9px] italic my-3 mx-auto opacity-75 shadow-sm bg-transparent" style={{ color: textColor }}>
                          {partner1 ? partner1[0] : "C"}{partner2 ? partner2[0] : "J"}
                        </div>
                      )}
                    </div>
                  )}

                  {block.type === "image" && (
                    <div className="my-3 max-w-[120px] mx-auto overflow-hidden rounded-[2px] border border-[#D4C4B7]/40 shadow-sm bg-transparent p-1">
                      <img src={block.content} alt="Custom block content" className="w-full h-auto object-contain" />
                    </div>
                  )}

                  {block.type === "text" && (
                    <p className={`text-[10px] text-[#7A7571] leading-relaxed italic my-2 px-3 ${bodyFont}`}>
                      {block.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Ceremony & Details section card with stylised google maps */}
          <div className="w-full space-y-4 mt-6 p-5 z-10 bg-[#FBF9F6]/85 backdrop-blur-sm border border-[#D4C4B7]/40 rounded-[2px] relative overflow-hidden">
            {venueMediaUrl && (
              <div className="absolute inset-0 z-0 opacity-15">
                {isVideoUrl(venueMediaUrl) ? (
                  <video src={venueMediaUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <img src={venueMediaUrl} className="absolute inset-0 w-full h-full object-cover" alt="Venue background custom asset" />
                )}
              </div>
            )}

            <div className="relative z-10 space-y-2">
              <p className={`text-[9px] uppercase tracking-widest text-[#7A7571] font-semibold ${bodyFont}`}>{ceremonyText}</p>
              <h4 className={`text-sm font-semibold ${headersFont}`}>{venueName || "Grand Villa Hotel"}</h4>
              <p className={`text-[10px] text-[#7A7571] max-w-[200px] mx-auto leading-relaxed ${bodyFont}`}>
                {venueAddress || "Lake Como, Italy"}
              </p>
            </div>

            {/* Stylised Grayscale Maps Iframe Widget */}
            <div className="relative z-10 w-full h-28 rounded-[2px] overflow-hidden border border-[#D4C4B7]/60 my-2">
              <iframe 
                src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`}
                className="w-full h-full border-0 filter grayscale opacity-75"
                title="Google Map Venue Widget"
              />
            </div>

            {/* Dress code & timeline details */}
            <div className="relative z-10 border-t border-[#D4C4B7]/40 pt-4 space-y-3 text-[10px] text-[#7A7571] font-sans">
              {dressCode && (
                <div>
                  <span className="uppercase tracking-widest text-[8px] font-semibold text-[#2A2726] block">Dress Code</span>
                  <span className={bodyFont}>{dressCode}</span>
                </div>
              )}
              {timeline && (
                <div>
                  <span className="uppercase tracking-widest text-[8px] font-semibold text-[#2A2726] block">Schedule</span>
                  <span className={`leading-relaxed ${bodyFont}`}>{timeline}</span>
                </div>
              )}
            </div>
            
            {/* Interactive RSVP Action Panel */}
            <div className="relative z-10 pt-4 flex flex-col gap-2 max-w-[180px] mx-auto">
              <button 
                className="w-full bg-[#2A2726] text-[#FBF9F6] py-2 rounded-full text-[9px] uppercase font-bold tracking-wider hover:bg-[#7A7571] transition-all cursor-pointer border-0"
                style={{ backgroundColor: accentColor }}
              >
                RSVP Online
              </button>
              
              {/* Get Directions Directions Maps Link */}
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-[#D4C4B7] text-[#2A2726] py-1.5 rounded-full text-[9px] uppercase font-bold tracking-wider hover:bg-[#F0EBE1] transition-all cursor-pointer bg-transparent block text-center font-sans"
              >
                Get Directions
              </a>

              {registryLink && (
                <a 
                  href={ensureExternalLink(registryLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-[#D4C4B7] text-[#2A2726] py-1.5 rounded-full text-[9px] uppercase font-bold tracking-wider hover:bg-[#F0EBE1] transition-all cursor-pointer bg-transparent block text-center"
                >
                  Wedding Registry
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Music playback toggle button: modern vinyl record player layout in bottom-right corner */}
        {music !== "None" && (
          <div className="absolute bottom-4 right-4 z-45">
            <button 
              onClick={() => setMusicPlaying(!musicPlaying)}
              className={`w-10 h-10 rounded-full bg-[#D4A574] border border-[#D4C4B7] flex items-center justify-center shadow-lg text-[#FBF9F6] transition-all cursor-pointer outline-none hover:bg-[#C29260] ${
                musicPlaying ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "3s" }}
              title={musicPlaying ? `Pause ${music}` : `Play ${music}`}
            >
              {/* Spinning vinyl center details */}
              <div className="w-3.5 h-3.5 rounded-full bg-[#FBF9F6] flex items-center justify-center border border-[#D4C4B7]">
                <div className="w-1 h-1 rounded-full bg-[#2A2726]" />
              </div>
            </button>
          </div>
        )}

        {/* 3. Animation Splash Preview Overlays */}
        {splashVisible && (
          <div className="absolute inset-0 z-40 bg-[#FBF9F6] flex flex-col items-center justify-center p-6 text-center select-none rounded-[40px] transition-all">
            
            {/* OPTION A: Envelope Reveal */}
            {splashIntroOption === "Option A" ? (
              <div 
                className={`flex flex-col items-center justify-center transition-all duration-1000 ${
                  triggerSplash ? "scale-95 opacity-0 translate-y-8" : "scale-100 opacity-100 translate-y-0"
                }`}
              >
                <div className="w-36 h-20 border border-[#D4C4B7] bg-[#F0EBE1] relative rounded-[2px] shadow-md flex items-center justify-center mb-4">
                  <div className="absolute inset-x-0 top-0 h-8 bg-[#E5DEC9] clip-path-triangle border-b border-[#D4C4B7]" />
                  <span className="text-[9px] font-sans tracking-widest text-[#7A7571] uppercase z-10 font-bold">AWFF</span>
                </div>
                <p className="font-serif italic text-[#2A2726] text-xs">Opening Envelope...</p>
                <p className="text-[9px] text-[#7A7571] tracking-widest uppercase mt-1">Option A active</p>
              </div>
            ) : (
              // OPTION B: Cinematic Vignette Overlay
              <div 
                className={`absolute inset-0 bg-[#FBF9F6] flex flex-col items-center justify-center text-center p-8 transition-all duration-1000 ${
                  triggerSplash ? "opacity-0 scale-105" : "opacity-100 scale-100"
                }`}
              >
                <div className="space-y-4 max-w-[240px] text-[#2A2726]">
                  <h1 className="text-xl font-serif tracking-widest font-light">AWFF</h1>
                  <div className="h-[1px] w-8 bg-[#D4A574] mx-auto opacity-50" />
                  <p className="text-[9px] uppercase tracking-widest text-[#7A7571] font-semibold">Bespoke Digital Invitation</p>
                  <p className="text-xs italic font-serif opacity-75">Loading cinematic presentation...</p>
                  <p className="text-[8px] text-[#7A7571] uppercase mt-2">Option B active</p>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Manual Intro Replay Button */}
      <button 
        onClick={replaySplash}
        className="mt-4 border border-[#D4C4B7] bg-[#FBF9F6] hover:bg-[#F0EBE1] text-[#2A2726] text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-full cursor-pointer focus:outline-none transition-all flex items-center gap-1.5 shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Replay Intro Animation
      </button>
    </div>
  );
}
