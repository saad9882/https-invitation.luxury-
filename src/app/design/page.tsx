"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { EditorPanel } from "@/components/EditorPanel";
import { isValidPlanId, PlanId } from "@/lib/plans";
import { getTemplateById } from "@/data/templates";

function DesignContent() {
  const params = useSearchParams();
  const router = useRouter();

  const planParam = params.get("plan");
  
  // Enforce validation and default to "essential" with warning if invalid.
  let plan: PlanId = "essential";
  if (planParam) {
    if (isValidPlanId(planParam)) {
      plan = planParam;
    } else {
      console.warn(`[LUXURY Customizer] Invalid plan ID "${planParam}" provided. Defaulting to "essential".`);
      plan = "essential";
    }
  } else {
    console.warn("[LUXURY Customizer] Plan ID parameter is missing. Defaulting to 'essential'.");
    plan = "essential";
  }

  const templateParam = params.get("template");

  // State hook definitions for all customizable fields
  const [partner1, setPartner1] = useState("Charlotte");
  const [partner2, setPartner2] = useState("Julian");
  const [initials, setInitials] = useState("C & J");
  const [weddingDate, setWeddingDate] = useState("2027-09-18");
  const [weddingTime, setWeddingTime] = useState("17:00");
  const [calendarUrl, setCalendarUrl] = useState("");
  const [venueName, setVenueName] = useState("Villa Montalcino");
  const [venueAddress, setVenueAddress] = useState("Tremezzo, Lake Como, Italy");
  const [mapUrl, setMapUrl] = useState("https://maps.google.com/?q=Villa+Montalcino,Lake+Como,Italy");
  const [latitude, setLatitude] = useState(45.9786);
  const [longitude, setLongitude] = useState(9.2274);

  // Schedule / Order of the Day
  const [timeline, setTimeline] = useState<Array<{ time: string; title: string; description: string }>>([
    { time: "17:00", title: "Arrival & Welcome Drinks", description: "Reception and welcome cocktails at the villa" },
    { time: "18:00", title: "Ceremony", description: "The most special moment of the day" },
    { time: "19:00", title: "Cocktail Hour & Dinner", description: "Al fresco dining under the stars" },
    { time: "22:00", title: "Party", description: "Let's dance the night away!" },
    { time: "01:30", title: "Last Dance", description: "Farewell and beautiful memories" },
  ]);

  // Dress Code
  const [dressCodeTitle, setDressCodeTitle] = useState("Formal Attire");
  const [dressCodeLines, setDressCodeLines] = useState<string[]>([
    "We kindly ask you to dress formally to join us on this very special day.",
    "Please avoid wearing white — it is reserved for the bride.",
    "Embrace romantic tones — champagne, blush, sage, plum, or midnight."
  ]);

  // Gifts & Registry
  const [giftNote, setGiftNote] = useState("Your presence is the greatest gift of all. For those who wish to give a little something, you can do so in the following ways:");
  const [giftItems, setGiftItems] = useState<Array<{ type: "card" | "bank" | "registry" | "custom"; title: string; description: string; link?: string }>>([
    { type: "card", title: "Card preferred", description: "A card box will be available at the welcome table on the day — no need to bring anything in advance." },
    { type: "bank", title: "Bank Transfer", description: "If you'd prefer to send a gift by bank transfer, please message us directly or transfer to IBAN: IT00X0000000000000000000000" },
    { type: "registry", title: "Online Gift Registry", description: "Browse our curated wedding registry wishlist.", link: "https://example.com/registry" }
  ]);

  // RSVP & Web3Forms
  const [rsvpWeb3Key, setRsvpWeb3Key] = useState("");
  const [rsvpEmail, setRsvpEmail] = useState("harveyandkarina@gmail.com");
  const [rsvpCc, setRsvpCc] = useState("");
  const [rsvpDeadline, setRsvpDeadline] = useState("2027-08-01");
  const [rsvpDeadlineText, setRsvpDeadlineText] = useState("Please respond by August 1st, 2027");
  const [rsvpFields, setRsvpFields] = useState({
    allowPlusOnes: true,
    dietaryRestrictions: true,
    collectPhone: true,
    songRequest: true,
    needTransport: true,
    needAccommodation: true,
  });

  // Optional Sections (Restaurants & Cafes, Accommodations, FAQ)
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [restaurants, setRestaurants] = useState<Array<{ name: string; location: string; link: string }>>([
    { name: "Les Sources de Fontanille", location: "Massignac", link: "https://maps.google.com/?q=Les+Sources+de+Fontanille" },
    { name: "Les Foudres", location: "Cognac", link: "https://maps.google.com/?q=Les+Foudres+Cognac" },
    { name: "La Ruelle", location: "Angoulême", link: "https://maps.google.com/?q=La+Ruelle+Angouleme" }
  ]);

  const [showAccommodations, setShowAccommodations] = useState(true);
  const [accommodations, setAccommodations] = useState<Array<{ name: string; stars?: string; meta: string; link: string }>>([
    { name: "Domaine des Etangs, Auberge Resorts", stars: "★★★★★", meta: "20 min drive · Massignac", link: "https://aubergeresorts.com/domainedesetangs/" },
    { name: "Chais Monnet Hôtel & Spa", stars: "★★★★★", meta: "45 min drive · Cognac", link: "https://chaismonnethotel.com" }
  ]);

  const [showFaq, setShowFaq] = useState(true);
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([
    { question: "What is the dress code?", answer: "Formal / black tie optional — see the Dress Code section for details." },
    { question: "Is parking available on site?", answer: "Yes, complimentary on-site parking is available for all guests throughout the celebration." },
    { question: "Can I bring a plus one?", answer: "Plus ones are noted on your RSVP form — please check your options above or contact us directly." }
  ]);

  // Aesthetics & Media
  const [namesFont, setNamesFont] = useState("font-serif");
  const [headersFont, setHeadersFont] = useState("font-serif");
  const [bodyFont, setBodyFont] = useState("font-sans");
  const [bgColor, setBgColor] = useState("#EBE7E0");
  const [textColor, setTextColor] = useState("#5C2C35");
  const [accentColor, setAccentColor] = useState("#C9A56B");
  const [inviteText, setInviteText] = useState("Together with their families");
  const [requestText, setRequestText] = useState("request the pleasure of your company");
  const [heroMediaUrl, setHeroMediaUrl] = useState("");
  const [venueMediaUrl, setVenueMediaUrl] = useState("");
  const [musicMediaUrl, setMusicMediaUrl] = useState("");
  const [music, setMusic] = useState("None");
  const [floralsEnabled, setFloralsEnabled] = useState(true);
  const [splashStyle, setSplashStyle] = useState("wax-seal");
  const [splashIntroOption, setSplashIntroOption] = useState("Option A");
  const [blocks, setBlocks] = useState<Array<{ id: string; type: string; content: string }>>([]);

  const sendUpdatesToIframe = useCallback(() => {
    const iframe = document.getElementById("template-preview-iframe") as HTMLIFrameElement | null;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        {
          type: "UPDATE_INVITATION",
          data: {
            partner1,
            partner2,
            initials,
            weddingDate,
            weddingTime,
            calendarUrl,
            venueName,
            venueAddress,
            mapUrl,
            latitude,
            longitude,
            timeline,
            dressCodeTitle,
            dressCodeLines,
            giftNote,
            giftItems,
            rsvpWeb3Key,
            rsvpEmail,
            rsvpCc,
            rsvpDeadline,
            rsvpDeadlineText,
            rsvpFields,
            showRestaurants,
            restaurants,
            showAccommodations,
            accommodations,
            showFaq,
            faqs,
            namesFont,
            headersFont,
            bodyFont,
            bgColor,
            textColor,
            accentColor,
            inviteText,
            requestText,
            heroMediaUrl,
            venueMediaUrl,
            musicMediaUrl,
            music,
            floralsEnabled,
            splashStyle,
            splashIntroOption,
            blocks,
          },
        },
        "*"
      );
    }
  }, [
    partner1,
    partner2,
    initials,
    weddingDate,
    weddingTime,
    calendarUrl,
    venueName,
    venueAddress,
    mapUrl,
    latitude,
    longitude,
    timeline,
    dressCodeTitle,
    dressCodeLines,
    giftNote,
    giftItems,
    rsvpWeb3Key,
    rsvpEmail,
    rsvpCc,
    rsvpDeadline,
    rsvpDeadlineText,
    rsvpFields,
    showRestaurants,
    restaurants,
    showAccommodations,
    accommodations,
    showFaq,
    faqs,
    namesFont,
    headersFont,
    bodyFont,
    bgColor,
    textColor,
    accentColor,
    inviteText,
    requestText,
    heroMediaUrl,
    venueMediaUrl,
    musicMediaUrl,
    music,
    floralsEnabled,
    splashStyle,
    splashIntroOption,
    blocks,
  ]);

  useEffect(() => {
    sendUpdatesToIframe();
  }, [sendUpdatesToIframe]);

  const handleIframeLoad = () => {
    sendUpdatesToIframe();
  };

  // Gating rule: If plan isn't excellence, we must have a selected template.
  if (!templateParam && plan !== "excellence") {
    return (
      <div className="min-h-screen bg-[#EBE7E0] text-[#2A2726] flex items-center justify-center p-6 sm:p-12 font-sans">
        <div className="max-w-md w-full border border-[#D4C4B7] bg-white/70 backdrop-blur-sm p-8 sm:p-10 rounded-[2rem] text-center shadow-md">
          <span className="text-[#C9A56B] text-4xl mb-4 block">✦</span>
          <h2 className="text-2xl font-serif text-[#5C2C35] mb-3">No Template Selected</h2>
          <p className="text-sm text-[#5C2C35]/75 leading-relaxed mb-6">
            Please pick a template style for your invitation before launching the customizer workspace.
          </p>
          <button
            onClick={() => router.push("/templates")}
            className="w-full bg-[#5C2C35] hover:bg-[#4A2229] text-white py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer border-0"
          >
            Go to Template Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen font-sans bg-[#EBE7E0] text-[#2A2726] overflow-hidden">
      {/* LEFT PANEL: The customizable editor tools panel */}
      <div className="w-full max-w-md h-full flex-shrink-0">
        <EditorPanel
          plan={plan}
          templateId={templateParam || "template_3"}
          partner1={partner1} setPartner1={setPartner1}
          partner2={partner2} setPartner2={setPartner2}
          initials={initials} setInitials={setInitials}
          weddingDate={weddingDate} setWeddingDate={setWeddingDate}
          weddingTime={weddingTime} setWeddingTime={setWeddingTime}
          calendarUrl={calendarUrl} setCalendarUrl={setCalendarUrl}
          venueName={venueName} setVenueName={setVenueName}
          venueAddress={venueAddress} setVenueAddress={setVenueAddress}
          mapUrl={mapUrl} setMapUrl={setMapUrl}
          latitude={latitude} setLatitude={setLatitude}
          longitude={longitude} setLongitude={setLongitude}
          timeline={timeline} setTimeline={setTimeline}
          dressCodeTitle={dressCodeTitle} setDressCodeTitle={setDressCodeTitle}
          dressCodeLines={dressCodeLines} setDressCodeLines={setDressCodeLines}
          giftNote={giftNote} setGiftNote={setGiftNote}
          giftItems={giftItems} setGiftItems={setGiftItems}
          rsvpWeb3Key={rsvpWeb3Key} setRsvpWeb3Key={setRsvpWeb3Key}
          rsvpEmail={rsvpEmail} setRsvpEmail={setRsvpEmail}
          rsvpCc={rsvpCc} setRsvpCc={setRsvpCc}
          rsvpDeadline={rsvpDeadline} setRsvpDeadline={setRsvpDeadline}
          rsvpDeadlineText={rsvpDeadlineText} setRsvpDeadlineText={setRsvpDeadlineText}
          rsvpFields={rsvpFields} setRsvpFields={setRsvpFields}
          showRestaurants={showRestaurants} setShowRestaurants={setShowRestaurants}
          restaurants={restaurants} setRestaurants={setRestaurants}
          showAccommodations={showAccommodations} setShowAccommodations={setShowAccommodations}
          accommodations={accommodations} setAccommodations={setAccommodations}
          showFaq={showFaq} setShowFaq={setShowFaq}
          faqs={faqs} setFaqs={setFaqs}
          namesFont={namesFont} setNamesFont={setNamesFont}
          headersFont={headersFont} setHeadersFont={setHeadersFont}
          bodyFont={bodyFont} setBodyFont={setBodyFont}
          bgColor={bgColor} setBgColor={setBgColor}
          textColor={textColor} setTextColor={setTextColor}
          accentColor={accentColor} setAccentColor={setAccentColor}
          inviteText={inviteText} setInviteText={setInviteText}
          requestText={requestText} setRequestText={setRequestText}
          heroMediaUrl={heroMediaUrl} setHeroMediaUrl={setHeroMediaUrl}
          venueMediaUrl={venueMediaUrl} setVenueMediaUrl={setVenueMediaUrl}
          musicMediaUrl={musicMediaUrl} setMusicMediaUrl={setMusicMediaUrl}
          music={music} setMusic={setMusic}
          floralsEnabled={floralsEnabled} setFloralsEnabled={setFloralsEnabled}
          splashStyle={splashStyle} setSplashStyle={setSplashStyle}
          splashIntroOption={splashIntroOption} setSplashIntroOption={setSplashIntroOption}
          blocks={blocks} setBlocks={setBlocks}
        />
      </div>

      {/* RIGHT PANEL: Live preview of selected template inside an iPhone container */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 bg-[#EBE7E0] overflow-y-auto">
        <div className="relative w-[320px] h-[640px] md:w-[360px] md:h-[720px] border-[10px] border-[#2A2726] rounded-[3rem] bg-black shadow-2xl overflow-hidden flex flex-col">
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-50 flex items-center justify-between px-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1C1C1E] block" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#09090B] block" />
          </div>
          
          {/* Viewport for preview iframe */}
          <div className="flex-1 w-full h-full relative bg-white">
            <iframe
              id="template-preview-iframe"
              onLoad={handleIframeLoad}
              src={`${templateParam ? getTemplateById(templateParam)?.demoUrl || "/demos/template_3/index.html" : "/demos/template_3/index.html"}?preview=1`}
              className="w-full h-full border-0 select-none"
              title="Live Invitation Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DesignPage() {
  return (
    <React.Suspense fallback={<div className="bg-[#EBE7E0] min-h-screen flex items-center justify-center font-sans text-sm text-[#5C2C35]">Loading...</div>}>
      <DesignContent />
    </React.Suspense>
  );
}