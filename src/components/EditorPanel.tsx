"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { PLANS, PlanId } from "@/lib/plans";

const LUXURY_VENUES = [
  { name: "Villa Montalcino", address: "Tremezzo, Lake Como, Italy", lat: 45.9786, lng: 9.2274 },
  { name: "Villa Sola Cabiati", address: "Tremezzo, Lake Como, Italy", lat: 45.9786, lng: 9.2274 },
  { name: "Villa d'Este", address: "Cernobbio, Lake Como, Italy", lat: 45.8453, lng: 9.0792 },
  { name: "Château de Chantilly", address: "Chantilly, France", lat: 49.1938, lng: 2.4853 },
  { name: "Villa Ephrussi de Rothschild", address: "Saint-Jean-Cap-Ferrat, France", lat: 43.6946, lng: 7.3275 },
  { name: "Aman Venice", address: "Venice, Italy", lat: 45.4357, lng: 12.3323 },
  { name: "Château de Vaux-le-Vicomte", address: "Maincy, France", lat: 48.5658, lng: 2.7141 },
];

export interface EditorPanelProps {
  plan: PlanId;
  templateId: string;
  partner1: string; setPartner1: (val: string) => void;
  partner2: string; setPartner2: (val: string) => void;
  initials: string; setInitials: (val: string) => void;
  weddingDate: string; setWeddingDate: (val: string) => void;
  weddingTime: string; setWeddingTime: (val: string) => void;
  calendarUrl: string; setCalendarUrl: (val: string) => void;
  venueName: string; setVenueName: (val: string) => void;
  venueAddress: string; setVenueAddress: (val: string) => void;
  mapUrl: string; setMapUrl: (val: string) => void;
  latitude: number; setLatitude: (val: number) => void;
  longitude: number; setLongitude: (val: number) => void;
  timeline: Array<{ time: string; title: string; description: string }>;
  setTimeline: React.Dispatch<React.SetStateAction<Array<{ time: string; title: string; description: string }>>>;
  dressCodeTitle: string; setDressCodeTitle: (val: string) => void;
  dressCodeLines: string[]; setDressCodeLines: React.Dispatch<React.SetStateAction<string[]>>;
  giftNote: string; setGiftNote: (val: string) => void;
  giftItems: Array<{ type: "card" | "bank" | "registry" | "custom"; title: string; description: string; link?: string }>;
  setGiftItems: React.Dispatch<React.SetStateAction<Array<{ type: "card" | "bank" | "registry" | "custom"; title: string; description: string; link?: string }>>>;
  rsvpWeb3Key: string; setRsvpWeb3Key: (val: string) => void;
  rsvpEmail: string; setRsvpEmail: (val: string) => void;
  rsvpCc: string; setRsvpCc: (val: string) => void;
  rsvpDeadline: string; setRsvpDeadline: (val: string) => void;
  rsvpDeadlineText: string; setRsvpDeadlineText: (val: string) => void;
  rsvpFields: {
    allowPlusOnes: boolean;
    dietaryRestrictions: boolean;
    collectPhone: boolean;
    songRequest: boolean;
    needTransport: boolean;
    needAccommodation: boolean;
  };
  setRsvpFields: React.Dispatch<React.SetStateAction<{
    allowPlusOnes: boolean;
    dietaryRestrictions: boolean;
    collectPhone: boolean;
    songRequest: boolean;
    needTransport: boolean;
    needAccommodation: boolean;
  }>>;
  showRestaurants: boolean; setShowRestaurants: (val: boolean) => void;
  restaurants: Array<{ name: string; location: string; link: string }>;
  setRestaurants: React.Dispatch<React.SetStateAction<Array<{ name: string; location: string; link: string }>>>;
  showAccommodations: boolean; setShowAccommodations: (val: boolean) => void;
  accommodations: Array<{ name: string; stars?: string; meta: string; link: string }>;
  setAccommodations: React.Dispatch<React.SetStateAction<Array<{ name: string; stars?: string; meta: string; link: string }>>>;
  showFaq: boolean; setShowFaq: (val: boolean) => void;
  faqs: Array<{ question: string; answer: string }>;
  setFaqs: React.Dispatch<React.SetStateAction<Array<{ question: string; answer: string }>>>;
  namesFont: string; setNamesFont: (val: string) => void;
  headersFont: string; setHeadersFont: (val: string) => void;
  bodyFont: string; setBodyFont: (val: string) => void;
  bgColor: string; setBgColor: (val: string) => void;
  textColor: string; setTextColor: (val: string) => void;
  accentColor: string; setAccentColor: (val: string) => void;
  inviteText: string; setInviteText: (val: string) => void;
  requestText: string; setRequestText: (val: string) => void;
  heroMediaUrl: string; setHeroMediaUrl: (val: string) => void;
  venueMediaUrl: string; setVenueMediaUrl: (val: string) => void;
  musicMediaUrl: string; setMusicMediaUrl: (val: string) => void;
  music: string; setMusic: (val: string) => void;
  floralsEnabled: boolean; setFloralsEnabled: (val: boolean) => void;
  splashStyle: string; setSplashStyle: (val: string) => void;
  splashIntroOption: string; setSplashIntroOption: (val: string) => void;
  blocks: Array<{ id: string; type: string; content: string }>;
  setBlocks: React.Dispatch<React.SetStateAction<Array<{ id: string; type: string; content: string }>>>;
}

function LockBadge() {
  return (
    <span className="text-[8px] uppercase tracking-widest font-bold bg-[#C9A56B]/20 text-[#8a5a45] px-2 py-0.5 rounded-full ml-2">
      Premium Lock
    </span>
  );
}

export function EditorPanel(props: EditorPanelProps) {
  const {
    plan,
    templateId,
    partner1, setPartner1, partner2, setPartner2, initials, setInitials,
    weddingDate, setWeddingDate, weddingTime, setWeddingTime,
    calendarUrl, setCalendarUrl,
    venueName, setVenueName, venueAddress, setVenueAddress, mapUrl, setMapUrl,
    latitude, setLatitude, longitude, setLongitude,
    timeline, setTimeline,
    dressCodeTitle, setDressCodeTitle, dressCodeLines, setDressCodeLines,
    giftNote, setGiftNote, giftItems, setGiftItems,
    rsvpWeb3Key, setRsvpWeb3Key, rsvpEmail, setRsvpEmail, rsvpCc, setRsvpCc,
    rsvpDeadline, setRsvpDeadline, rsvpDeadlineText, setRsvpDeadlineText,
    rsvpFields, setRsvpFields,
    showRestaurants, setShowRestaurants, restaurants, setRestaurants,
    showAccommodations, setShowAccommodations, accommodations, setAccommodations,
    showFaq, setShowFaq, faqs, setFaqs,
    namesFont, setNamesFont, headersFont, setHeadersFont, bodyFont, setBodyFont,
    bgColor, setBgColor, textColor, setTextColor, accentColor, setAccentColor,
    inviteText, setInviteText, requestText, setRequestText,
    heroMediaUrl, setHeroMediaUrl, venueMediaUrl, setVenueMediaUrl, musicMediaUrl, setMusicMediaUrl,
    music, setMusic, floralsEnabled, setFloralsEnabled, splashStyle, setSplashStyle,
    splashIntroOption, setSplashIntroOption,
    blocks, setBlocks
  } = props;

  const planConfig = PLANS[plan];
  const features = planConfig.features;

  const [activeTab, setActiveTab] = useState<
    "details" | "location" | "schedule" | "dresscode" | "gifts" | "rsvp" | "guides" | "aesthetics" | "media"
  >("details");

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  // Timeline item adding state
  const [newTimelineTime, setNewTimelineTime] = useState("");
  const [newTimelineTitle, setNewTimelineTitle] = useState("");
  const [newTimelineDesc, setNewTimelineDesc] = useState("");

  // Dress code line adding state
  const [newDressLine, setNewDressLine] = useState("");

  // Gift item adding state
  const [newGiftType, setNewGiftType] = useState<"card" | "bank" | "registry" | "custom">("registry");
  const [newGiftTitle, setNewGiftTitle] = useState("");
  const [newGiftDesc, setNewGiftDesc] = useState("");
  const [newGiftLink, setNewGiftLink] = useState("");

  // Restaurant adding state
  const [newRestName, setNewRestName] = useState("");
  const [newRestLoc, setNewRestLoc] = useState("");
  const [newRestLink, setNewRestLink] = useState("");

  // Hotel adding state
  const [newHotelName, setNewHotelName] = useState("");
  const [newHotelMeta, setNewHotelMeta] = useState("");
  const [newHotelLink, setNewHotelLink] = useState("");

  // FAQ adding state
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  const apiKeyVal = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const isValidApiKey = apiKeyVal && !apiKeyVal.includes("YOUR_");

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: isValidApiKey ? apiKeyVal : "",
    libraries: ["places"],
  });

  const autocompleteRef = useRef<any>(null);

  const onLoad = (autoInstance: any) => {
    autocompleteRef.current = autoInstance;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        setVenueName(place.name || "");
        setVenueAddress(place.formatted_address || "");
        if (place.geometry.location) {
          setLatitude(place.geometry.location.lat());
          setLongitude(place.geometry.location.lng());
        }
        setMapUrl(`https://maps.google.com/?q=${encodeURIComponent((place.name || "") + " " + (place.formatted_address || ""))}`);
      }
    }
  };

  const handlePublish = () => {
    const userStr = typeof window !== "undefined" ? (localStorage.getItem("luxury_invitation_user") || localStorage.getItem("awff_user")) : null;
    const user = userStr ? JSON.parse(userStr) : { email: "guest@luxuryinvitation.co" };

    const designState = {
      plan,
      templateId,
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
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("luxury_design_" + user.email, JSON.stringify(designState));
      localStorage.setItem("awff_design_" + user.email, JSON.stringify(designState));
    }

    router.push(`/checkout?plan=${plan}&template=${templateId}`);
  };

  return (
    <div className="w-full h-full bg-[#FBF9F6] border-r border-[#D4C4B7] flex flex-col justify-between p-6 overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        <div className="border-b border-[#D4C4B7] pb-3 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-serif font-light text-[#2A2726] tracking-wide">Invitation Workspace</h1>
            <p className="text-[9px] uppercase tracking-widest text-[#7A7571] mt-0.5 font-sans">Bespoke Customizer Studio</p>
          </div>
          <span className="text-[10px] bg-[#5C2C35] text-white px-3 py-1 rounded-full font-sans font-bold uppercase tracking-wide whitespace-nowrap">
            {planConfig.name} · {planConfig.price}€
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 border-b border-[#D4C4B7]/60 pb-2 overflow-x-auto text-[10px] uppercase font-bold tracking-wider no-scrollbar">
          {[
            { id: "details", label: "Names & Date" },
            { id: "location", label: "Venue & Map" },
            { id: "schedule", label: "Order of Day" },
            { id: "dresscode", label: "Dress Code" },
            { id: "gifts", label: "Gifts" },
            { id: "rsvp", label: "RSVP Form" },
            { id: "guides", label: "Guides & FAQ" },
            { id: "aesthetics", label: "Styles" },
            { id: "media", label: "Media" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`pb-1 px-2 border-b-2 transition-all cursor-pointer bg-transparent border-0 whitespace-nowrap ${
                activeTab === t.id ? "border-[#2A2726] text-[#2A2726]" : "border-transparent text-[#7A7571] hover:text-[#2A2726]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 1. DETAILS TAB */}
        {activeTab === "details" && (
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#7A7571] font-semibold border-b border-[#D4C4B7] pb-1.5">
              Celebrants & Date
            </h3>
            <div className="flex flex-col gap-3 font-sans text-xs">
              <Field label="First Celebrant Name" value={partner1} onChange={setPartner1} />
              <Field label="Second Celebrant Name" value={partner2} onChange={setPartner2} />
              <Field
                label="Monogram / Initials (e.g. C & J)"
                value={initials}
                onChange={setInitials}
                placeholder="C & J"
              />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Wedding Date" value={weddingDate} onChange={setWeddingDate} type="date" />
                <Field label="Ceremony Time" value={weddingTime} onChange={setWeddingTime} type="time" />
              </div>
              <p className="text-[10px] text-[#8a5a45] italic bg-[#C9A56B]/10 p-2 rounded-[2px]">
                ✦ Changing the date automatically recalculates and updates the live countdown timer across the page.
              </p>
              <Field
                label="Google Calendar Event Link (Optional)"
                value={calendarUrl}
                onChange={setCalendarUrl}
                placeholder="https://calendar.google.com/... (or leave blank for auto-generate)"
                type="url"
              />
              <Field label="Header Tagline Override" value={inviteText} onChange={setInviteText} />
              <TextAreaField label="Presence Request Override" value={requestText} onChange={setRequestText} rows={8} />
            </div>
          </div>
        )}

        {/* 2. LOCATION TAB */}
        {activeTab === "location" && (
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#7A7571] font-semibold border-b border-[#D4C4B7] pb-1.5">
              Ceremony Location & Map Link
            </h3>
            <div className="space-y-3 font-sans text-xs">
              <Field label="Venue Name" value={venueName} onChange={setVenueName} />
              <Field label="Venue Full Address" value={venueAddress} onChange={setVenueAddress} />
              <Field
                label="Exact Location Link (Google / Apple Maps URL)"
                value={mapUrl}
                onChange={setMapUrl}
                placeholder="https://maps.google.com/?q=..."
                type="url"
              />
              <p className="text-[10px] text-[#8a5a45] italic bg-[#C9A56B]/10 p-2 rounded-[2px]">
                ✦ Insert your exact Google Maps pin link so guests will navigate with 100% precision.
              </p>

              <div className="pt-2">
                <label className="text-[10px] uppercase tracking-wider text-[#7A7571] font-semibold block mb-1">
                  Preset Luxury Destinations
                </label>
                <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto border border-[#D4C4B7] bg-[#FBF9F6] p-2 rounded-[2px]">
                  {LUXURY_VENUES.map((v) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => {
                        setVenueName(v.name);
                        setVenueAddress(v.address);
                        setLatitude(v.lat);
                        setLongitude(v.lng);
                        setMapUrl(`https://maps.google.com/?q=${encodeURIComponent(v.name + " " + v.address)}`);
                      }}
                      className="text-left p-1.5 hover:bg-[#F0EBE1] text-xs rounded border-0 bg-transparent cursor-pointer flex justify-between items-center"
                    >
                      <span className="font-semibold text-[#2A2726]">{v.name}</span>
                      <span className="text-[9px] text-[#7A7571]">{v.address.split(",")[1]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. ORDER OF THE DAY (TIMELINE) TAB */}
        {activeTab === "schedule" && (
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#7A7571] font-semibold border-b border-[#D4C4B7] pb-1.5 flex justify-between items-center">
              <span>Order of the Day</span>
              <span className="text-[9px] text-[#7A7571] font-normal">{timeline.length} events</span>
            </h3>

            <div className="space-y-2">
              {timeline.map((item, idx) => (
                <div key={idx} className="p-2.5 border border-[#D4C4B7] bg-[#F0EBE1]/30 rounded-[2px] space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#5C2C35]">{item.time || "Time"}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const next = [...timeline];
                          [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
                          setTimeline(next);
                        }}
                        className="px-1.5 text-[#7A7571] disabled:opacity-30 border-0 bg-transparent cursor-pointer"
                      >
                        &uarr;
                      </button>
                      <button
                        type="button"
                        disabled={idx === timeline.length - 1}
                        onClick={() => {
                          const next = [...timeline];
                          [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                          setTimeline(next);
                        }}
                        className="px-1.5 text-[#7A7571] disabled:opacity-30 border-0 bg-transparent cursor-pointer"
                      >
                        &darr;
                      </button>
                      <button
                        type="button"
                        onClick={() => setTimeline(timeline.filter((_, i) => i !== idx))}
                        className="text-red-700 font-bold ml-1 border-0 bg-transparent cursor-pointer text-[10px]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={item.time}
                    onChange={(e) => {
                      const next = [...timeline];
                      next[idx].time = e.target.value;
                      setTimeline(next);
                    }}
                    placeholder="e.g. 17:00"
                    className="w-full border-b border-[#D4C4B7] bg-transparent pb-1 text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const next = [...timeline];
                      next[idx].title = e.target.value;
                      setTimeline(next);
                    }}
                    placeholder="Event Title (e.g. Ceremony)"
                    className="w-full border-b border-[#D4C4B7] bg-transparent pb-1 font-semibold text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => {
                      const next = [...timeline];
                      next[idx].description = e.target.value;
                      setTimeline(next);
                    }}
                    placeholder="Description / subtitle..."
                    className="w-full border-b border-[#D4C4B7] bg-transparent pb-1 text-[11px] text-[#7A7571] focus:outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Add Timeline Event Form */}
            <div className="p-3 border border-dashed border-[#D4C4B7] bg-[#FBF9F6] rounded-[2px] space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#7A7571]">Add New Event</span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Time (18:00)"
                  value={newTimelineTime}
                  onChange={(e) => setNewTimelineTime(e.target.value)}
                  className="border border-[#D4C4B7] p-1.5 text-xs bg-transparent rounded-[2px]"
                />
                <input
                  type="text"
                  placeholder="Title (Cocktail Hour)"
                  value={newTimelineTitle}
                  onChange={(e) => setNewTimelineTitle(e.target.value)}
                  className="col-span-2 border border-[#D4C4B7] p-1.5 text-xs bg-transparent rounded-[2px]"
                />
              </div>
              <input
                type="text"
                placeholder="Description (Al fresco drinks & jazz band)"
                value={newTimelineDesc}
                onChange={(e) => setNewTimelineDesc(e.target.value)}
                className="w-full border border-[#D4C4B7] p-1.5 text-xs bg-transparent rounded-[2px]"
              />
              <button
                type="button"
                onClick={() => {
                  if (newTimelineTitle.trim()) {
                    setTimeline([...timeline, { time: newTimelineTime, title: newTimelineTitle, description: newTimelineDesc }]);
                    setNewTimelineTime("");
                    setNewTimelineTitle("");
                    setNewTimelineDesc("");
                  }
                }}
                className="w-full bg-[#5C2C35] hover:bg-[#4A2229] text-white py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer border-0"
              >
                + Add Event to Timeline
              </button>
            </div>
          </div>
        )}

        {/* 4. DRESS CODE TAB */}
        {activeTab === "dresscode" && (
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#7A7571] font-semibold border-b border-[#D4C4B7] pb-1.5">
              Dress Code & Style Lines
            </h3>
            <div className="space-y-3 font-sans text-xs">
              <Field
                label="Dress Code Main Title"
                value={dressCodeTitle}
                onChange={setDressCodeTitle}
                placeholder="Formal Attire / Black Tie Optional"
              />

              <div className="space-y-2 pt-2">
                <label className="text-[10px] uppercase tracking-wider text-[#7A7571] font-semibold block">
                  Dress Code Detail Paragraphs (All Lines Customizable)
                </label>
                {dressCodeLines.map((line, idx) => (
                  <div key={idx} className="flex gap-2 items-start bg-[#F0EBE1]/25 p-2 rounded-[2px] border border-[#D4C4B7]">
                    <textarea
                      value={line}
                      onChange={(e) => {
                        const next = [...dressCodeLines];
                        next[idx] = e.target.value;
                        setDressCodeLines(next);
                      }}
                      rows={2}
                      className="flex-1 bg-transparent border-0 text-xs focus:outline-none resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => setDressCodeLines(dressCodeLines.filter((_, i) => i !== idx))}
                      className="text-red-700 font-bold border-0 bg-transparent cursor-pointer text-xs"
                    >
                      &times;
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add guideline line (e.g. Grass-friendly heels recommended)"
                    value={newDressLine}
                    onChange={(e) => setNewDressLine(e.target.value)}
                    className="flex-1 border border-[#D4C4B7] p-1.5 text-xs bg-transparent rounded-[2px]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newDressLine.trim()) {
                        setDressCodeLines([...dressCodeLines, newDressLine.trim()]);
                        setNewDressLine("");
                      }
                    }}
                    className="bg-[#5C2C35] text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase cursor-pointer border-0 whitespace-nowrap"
                  >
                    + Add Line
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. GIFTS TAB */}
        {activeTab === "gifts" && (
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#7A7571] font-semibold border-b border-[#D4C4B7] pb-1.5">
              Gifts & Registry
            </h3>
            <div className="space-y-3 font-sans text-xs">
              <TextAreaField
                label="Gift Note / Introductory Message"
                value={giftNote}
                onChange={setGiftNote}
                rows={12}
              />

              <div className="space-y-2 pt-2">
                <label className="text-[10px] uppercase tracking-wider text-[#7A7571] font-semibold block">
                  Gift Options (Card, Bank Transfer, Online Registry, etc.)
                </label>
                {giftItems.map((g, idx) => (
                  <div key={idx} className="p-2.5 border border-[#D4C4B7] bg-[#F0EBE1]/30 rounded-[2px] space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#5C2C35] uppercase text-[10px]">{g.type}</span>
                      <button
                        type="button"
                        onClick={() => setGiftItems(giftItems.filter((_, i) => i !== idx))}
                        className="text-red-700 font-bold border-0 bg-transparent cursor-pointer text-xs"
                      >
                        Delete
                      </button>
                    </div>
                    <input
                      type="text"
                      value={g.title}
                      onChange={(e) => {
                        const next = [...giftItems];
                        next[idx].title = e.target.value;
                        setGiftItems(next);
                      }}
                      placeholder="Title (e.g. Bank Transfer / Registry)"
                      className="w-full border-b border-[#D4C4B7] bg-transparent pb-1 font-semibold text-xs focus:outline-none"
                    />
                    <textarea
                      value={g.description}
                      onChange={(e) => {
                        const next = [...giftItems];
                        next[idx].description = e.target.value;
                        setGiftItems(next);
                      }}
                      placeholder="Description & details (IBAN / info)..."
                      rows={2}
                      className="w-full bg-transparent border border-[#D4C4B7] p-1.5 text-[11px] text-[#7A7571] focus:outline-none rounded-[2px]"
                    />
                    {g.type === "registry" && (
                      <input
                        type="url"
                        value={g.link || ""}
                        onChange={(e) => {
                          const next = [...giftItems];
                          next[idx].link = e.target.value;
                          setGiftItems(next);
                        }}
                        placeholder="https://example.com/registry"
                        className="w-full border-b border-[#D4C4B7] bg-transparent pb-1 text-[11px] text-blue-800 focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Add Gift Method */}
              <div className="p-3 border border-dashed border-[#D4C4B7] bg-[#FBF9F6] rounded-[2px] space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#7A7571]">Add Gift Method</span>
                <select
                  value={newGiftType}
                  onChange={(e) => setNewGiftType(e.target.value as any)}
                  className="w-full border border-[#D4C4B7] bg-[#FBF9F6] p-1.5 text-xs text-[#2A2726] rounded-[2px]"
                >
                  <option value="card">Card Box (On the day)</option>
                  <option value="bank">Bank Transfer / IBAN</option>
                  <option value="registry">Online Registry Link</option>
                  <option value="custom">Custom Gift Note</option>
                </select>
                <input
                  type="text"
                  placeholder="Title (e.g. Bank Transfer)"
                  value={newGiftTitle}
                  onChange={(e) => setNewGiftTitle(e.target.value)}
                  className="w-full border border-[#D4C4B7] p-1.5 text-xs bg-transparent rounded-[2px]"
                />
                <textarea
                  placeholder="Instructions or IBAN details..."
                  value={newGiftDesc}
                  onChange={(e) => setNewGiftDesc(e.target.value)}
                  rows={2}
                  className="w-full border border-[#D4C4B7] p-1.5 text-xs bg-transparent rounded-[2px]"
                />
                {newGiftType === "registry" && (
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newGiftLink}
                    onChange={(e) => setNewGiftLink(e.target.value)}
                    className="w-full border border-[#D4C4B7] p-1.5 text-xs bg-transparent rounded-[2px]"
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (newGiftTitle.trim()) {
                      setGiftItems([
                        ...giftItems,
                        { type: newGiftType, title: newGiftTitle, description: newGiftDesc, link: newGiftLink }
                      ]);
                      setNewGiftTitle("");
                      setNewGiftDesc("");
                      setNewGiftLink("");
                    }
                  }}
                  className="w-full bg-[#5C2C35] hover:bg-[#4A2229] text-white py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer border-0"
                >
                  + Add Gift Option
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. RSVP TAB */}
        {activeTab === "rsvp" && (
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#7A7571] font-semibold border-b border-[#D4C4B7] pb-1.5">
              RSVP Controls & Guest Preferences
            </h3>
            <div className="space-y-3 font-sans text-xs">
              <Field
                label="RSVP Notification Email"
                value={rsvpEmail}
                onChange={setRsvpEmail}
                type="email"
                placeholder="Where you want guest RSVPs delivered"
              />
              <Field
                label="RSVP Notification CC (Optional)"
                value={rsvpCc}
                onChange={setRsvpCc}
                type="email"
                placeholder="Second email address for notifications"
              />
              <div className="grid grid-cols-2 gap-3">
                <Field label="RSVP Cut-off Date" value={rsvpDeadline} onChange={setRsvpDeadline} type="date" />
                <Field label="Deadline Display Text" value={rsvpDeadlineText} onChange={setRsvpDeadlineText} />
              </div>

              <div className="space-y-2 pt-2 border-t border-[#D4C4B7]/60">
                <span className="text-[10px] uppercase tracking-wider text-[#7A7571] font-semibold block">
                  Customizable Form Fields
                </span>
                <ToggleRow
                  label="Allow Plus Ones / Companions"
                  sub="Adult and child guest count fields"
                  value={rsvpFields.allowPlusOnes}
                  onToggle={() => setRsvpFields({ ...rsvpFields, allowPlusOnes: !rsvpFields.allowPlusOnes })}
                />
                <ToggleRow
                  label="Dietary Restrictions"
                  sub="Ask guests for allergies & special diets"
                  value={rsvpFields.dietaryRestrictions}
                  onToggle={() => setRsvpFields({ ...rsvpFields, dietaryRestrictions: !rsvpFields.dietaryRestrictions })}
                />
                <ToggleRow
                  label="Collect Phone Number"
                  sub="Contact telephone for guests"
                  value={rsvpFields.collectPhone}
                  onToggle={() => setRsvpFields({ ...rsvpFields, collectPhone: !rsvpFields.collectPhone })}
                />
                <ToggleRow
                  label="Song Request Field"
                  sub="Allow guests to request a dance track"
                  value={rsvpFields.songRequest}
                  onToggle={() => setRsvpFields({ ...rsvpFields, songRequest: !rsvpFields.songRequest })}
                />
                <ToggleRow
                  label="Transport Assistance Field"
                  sub="Checkbox for shuttle to venue"
                  value={rsvpFields.needTransport}
                  onToggle={() => setRsvpFields({ ...rsvpFields, needTransport: !rsvpFields.needTransport })}
                />
                <ToggleRow
                  label="Accommodation Field"
                  sub="Hotel / area where guest is staying"
                  value={rsvpFields.needAccommodation}
                  onToggle={() => setRsvpFields({ ...rsvpFields, needAccommodation: !rsvpFields.needAccommodation })}
                />
              </div>
            </div>
          </div>
        )}

        {/* 7. GUIDES & FAQ TAB */}
        {activeTab === "guides" && (
          <div className="space-y-5">
            <h3 className="text-xs uppercase tracking-widest text-[#7A7571] font-semibold border-b border-[#D4C4B7] pb-1.5">
              Local Guide & Optional Sections
            </h3>

            {/* Restaurants & Cafes */}
            <div className="space-y-3 border border-[#D4C4B7] bg-[#F0EBE1]/20 p-3 rounded-[2px]">
              <ToggleRow
                label="Restaurants & Cafés Section"
                sub="Show/hide local dining suggestions"
                value={showRestaurants}
                onToggle={() => setShowRestaurants(!showRestaurants)}
              />
              {showRestaurants && (
                <div className="space-y-2 pt-2">
                  {restaurants.map((r, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-white border border-[#D4C4B7] rounded-[2px] text-xs">
                      <div>
                        <p className="font-semibold text-[#2A2726]">{r.name}</p>
                        <p className="text-[10px] text-[#7A7571]">{r.location}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRestaurants(restaurants.filter((_, i) => i !== idx))}
                        className="text-red-700 font-bold border-0 bg-transparent cursor-pointer"
                      >
                        &times;
                      </button>
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="Restaurant Name"
                      value={newRestName}
                      onChange={(e) => setNewRestName(e.target.value)}
                      className="border border-[#D4C4B7] p-1.5 text-xs bg-white rounded-[2px]"
                    />
                    <input
                      type="text"
                      placeholder="Location (Massignac)"
                      value={newRestLoc}
                      onChange={(e) => setNewRestLoc(e.target.value)}
                      className="border border-[#D4C4B7] p-1.5 text-xs bg-white rounded-[2px]"
                    />
                  </div>
                  <input
                    type="url"
                    placeholder="Maps Link (https://...)"
                    value={newRestLink}
                    onChange={(e) => setNewRestLink(e.target.value)}
                    className="w-full border border-[#D4C4B7] p-1.5 text-xs bg-white rounded-[2px]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newRestName.trim()) {
                        setRestaurants([...restaurants, { name: newRestName, location: newRestLoc, link: newRestLink }]);
                        setNewRestName("");
                        setNewRestLoc("");
                        setNewRestLink("");
                      }
                    }}
                    className="w-full bg-[#5C2C35] text-white py-1 rounded text-[10px] font-bold uppercase cursor-pointer border-0"
                  >
                    + Add Restaurant
                  </button>
                </div>
              )}
            </div>

            {/* Where to Stay (Accommodations) */}
            <div className="space-y-3 border border-[#D4C4B7] bg-[#F0EBE1]/20 p-3 rounded-[2px]">
              <ToggleRow
                label="Guest Accommodations Section"
                sub="Show/hide hotel and stay options"
                value={showAccommodations}
                onToggle={() => setShowAccommodations(!showAccommodations)}
              />
              {showAccommodations && (
                <div className="space-y-2 pt-2">
                  {accommodations.map((h, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-white border border-[#D4C4B7] rounded-[2px] text-xs">
                      <div>
                        <p className="font-semibold text-[#2A2726]">{h.name}</p>
                        <p className="text-[10px] text-[#7A7571]">{h.meta}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAccommodations(accommodations.filter((_, i) => i !== idx))}
                        className="text-red-700 font-bold border-0 bg-transparent cursor-pointer"
                      >
                        &times;
                      </button>
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="Hotel Name"
                      value={newHotelName}
                      onChange={(e) => setNewHotelName(e.target.value)}
                      className="border border-[#D4C4B7] p-1.5 text-xs bg-white rounded-[2px]"
                    />
                    <input
                      type="text"
                      placeholder="Drive / Distance meta"
                      value={newHotelMeta}
                      onChange={(e) => setNewHotelMeta(e.target.value)}
                      className="border border-[#D4C4B7] p-1.5 text-xs bg-white rounded-[2px]"
                    />
                  </div>
                  <input
                    type="url"
                    placeholder="Hotel Website / Booking URL"
                    value={newHotelLink}
                    onChange={(e) => setNewHotelLink(e.target.value)}
                    className="w-full border border-[#D4C4B7] p-1.5 text-xs bg-white rounded-[2px]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newHotelName.trim()) {
                        setAccommodations([...accommodations, { name: newHotelName, stars: "★★★★★", meta: newHotelMeta, link: newHotelLink }]);
                        setNewHotelName("");
                        setNewHotelMeta("");
                        setNewHotelLink("");
                      }
                    }}
                    className="w-full bg-[#5C2C35] text-white py-1 rounded text-[10px] font-bold uppercase cursor-pointer border-0"
                  >
                    + Add Hotel
                  </button>
                </div>
              )}
            </div>

            {/* FAQ */}
            <div className="space-y-3 border border-[#D4C4B7] bg-[#F0EBE1]/20 p-3 rounded-[2px]">
              <ToggleRow
                label="Frequently Asked Questions (FAQ)"
                sub="Show/hide interactive FAQ accordions"
                value={showFaq}
                onToggle={() => setShowFaq(!showFaq)}
              />
              {showFaq && (
                <div className="space-y-2 pt-2">
                  {faqs.map((f, idx) => (
                    <div key={idx} className="p-2 bg-white border border-[#D4C4B7] rounded-[2px] text-xs space-y-1">
                      <div className="flex justify-between items-center font-semibold text-[#2A2726]">
                        <span>{f.question}</span>
                        <button
                          type="button"
                          onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                          className="text-red-700 font-bold border-0 bg-transparent cursor-pointer"
                        >
                          &times;
                        </button>
                      </div>
                      <p className="text-[11px] text-[#7A7571]">{f.answer}</p>
                    </div>
                  ))}

                  <input
                    type="text"
                    placeholder="Question (e.g. Can children attend?)"
                    value={newFaqQ}
                    onChange={(e) => setNewFaqQ(e.target.value)}
                    className="w-full border border-[#D4C4B7] p-1.5 text-xs bg-white rounded-[2px]"
                  />
                  <textarea
                    placeholder="Answer..."
                    value={newFaqA}
                    onChange={(e) => setNewFaqA(e.target.value)}
                    rows={2}
                    className="w-full border border-[#D4C4B7] p-1.5 text-xs bg-white rounded-[2px]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newFaqQ.trim()) {
                        setFaqs([...faqs, { question: newFaqQ, answer: newFaqA }]);
                        setNewFaqQ("");
                        setNewFaqA("");
                      }
                    }}
                    className="w-full bg-[#5C2C35] text-white py-1 rounded text-[10px] font-bold uppercase cursor-pointer border-0"
                  >
                    + Add FAQ
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 8. AESTHETICS TAB */}
        {activeTab === "aesthetics" && (
          <div className="space-y-5">
            <h3 className="text-xs uppercase tracking-widest text-[#7A7571] font-semibold border-b border-[#D4C4B7] pb-1.5 flex items-center">
              Typography & Fonts
              {!features.allowFullTypography && <LockBadge />}
            </h3>
            <fieldset disabled={!features.allowFullTypography} className="flex flex-col gap-3 disabled:opacity-60 font-sans text-xs">
              <SelectField label="Names Font" value={namesFont} onChange={setNamesFont} options={["font-serif", "font-cinzel", "font-bodoni", "font-lora", "font-montserrat"]} />
              <SelectField label="Headers Font" value={headersFont} onChange={setHeadersFont} options={["font-serif", "font-cinzel", "font-bodoni", "font-lora", "font-inter"]} />
              <SelectField label="Body Font" value={bodyFont} onChange={setBodyFont} options={["font-sans", "font-montserrat", "font-serif"]} />
            </fieldset>

            <h3 className="text-xs uppercase tracking-widest text-[#7A7571] font-semibold border-b border-[#D4C4B7] pb-1.5 pt-2">
              Color Palette
            </h3>
            <ColorField label="Canvas Background" value={bgColor} onChange={setBgColor} />
            <ColorField label="Primary Text" value={textColor} onChange={setTextColor} />
            <ColorField label="Accent" value={accentColor} onChange={setAccentColor} />

            <div className="pt-2 border-t border-[#D4C4B7]/60 space-y-3 font-sans text-xs">
              <ToggleRow
                label="Botanical Leaves Illustration"
                sub="Monochromatic ornamental SVG border"
                value={floralsEnabled}
                onToggle={() => setFloralsEnabled(!floralsEnabled)}
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-wider text-[#7A7571] font-semibold">Intro Reveal Style</label>
                <select
                  value={splashStyle}
                  onChange={(e) => setSplashStyle(e.target.value)}
                  className="w-full border border-[#D4C4B7] bg-[#FBF9F6] p-2 text-xs text-[#2A2726] rounded-[2px]"
                >
                  <option value="wax-seal">Fading Wax Seal (Traditional)</option>
                  <option value="envelope">Opening Envelope (Elegant Reveal)</option>
                  <option value="video">Cinematic Video Splash</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 9. MEDIA TAB */}
        {activeTab === "media" && (
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#7A7571] font-semibold border-b border-[#D4C4B7] pb-1.5">
              Media & Soundtracks
            </h3>
            <div className="space-y-3 font-sans text-xs">
              <Field
                label="Background Music URL (or Audio Preset)"
                value={musicMediaUrl}
                onChange={setMusicMediaUrl}
                placeholder="assets/music.mp3 or custom audio URL"
              />
              <Field
                label="Hero Video / Background Image URL"
                value={heroMediaUrl}
                onChange={setHeroMediaUrl}
                placeholder="assets/background.mp4"
              />
              <Field
                label="Venue Display Image URL"
                value={venueMediaUrl}
                onChange={setVenueMediaUrl}
                placeholder="assets/display.png"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Publishing CTA */}
      <div className="pt-4 border-t border-[#D4C4B7] mt-3 flex flex-col gap-2.5 font-sans">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#7A7571]">
          <span>{features.revisionRounds} revision rounds included</span>
          {features.directDesignerContact && <span className="text-emerald-700 font-semibold">Direct designer contact ✓</span>}
        </div>
        <button
          onClick={handlePublish}
          className="bg-[#5C2C35] text-white hover:bg-[#4A2229] px-6 py-3 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer border-0 shadow-md"
        >
          Continue to Checkout & Publish
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="uppercase tracking-wider text-[#7A7571] font-semibold text-[10px]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-b border-[#D4C4B7] bg-transparent pb-1 text-xs focus:border-[#2A2726] focus:outline-none transition-colors"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 16,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-1 pt-1">
      <span className="uppercase tracking-wider text-[#7A7571] font-semibold text-[10px]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-[#D4C4B7] bg-transparent p-2 focus:border-[#2A2726] focus:outline-none transition-colors rounded-[2px] resize-none text-xs"
        style={{ height: rows * 4 }}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs uppercase tracking-wider text-[#7A7571] font-semibold">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-[#D4C4B7] bg-transparent p-2 text-xs text-[#2A2726] focus:outline-none rounded-[2px]"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#D4C4B7] pb-2">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-[#2A2726]">{label}</span>
        <span className="text-[10px] text-[#7A7571] mt-0.5">{value.toUpperCase()}</span>
      </div>
      <div className="relative flex items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-full cursor-pointer outline-none bg-transparent opacity-0 absolute right-0 z-10"
        />
        <div className="w-7 h-7 rounded-full border border-[#D4C4B7]" style={{ backgroundColor: value }} />
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  sub,
  value,
  onToggle,
}: {
  label: string;
  sub: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-2.5 border border-[#D4C4B7] rounded-[2px] bg-white">
      <div>
        <p className="text-xs font-semibold text-[#2A2726]">{label}</p>
        <p className="text-[10px] text-[#7A7571] mt-0.5 font-sans">{sub}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider cursor-pointer border transition-all ${
          value ? "bg-[#5C2C35] text-white border-transparent" : "bg-transparent text-[#7A7571] border-[#D4C4B7] hover:border-[#5C2C35]"
        }`}
      >
        {value ? "On" : "Off"}
      </button>
    </div>
  );
}

export default EditorPanel;
