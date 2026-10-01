"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Invitation {
  id: string;
  slug: string;
  partner1: string;
  partner2: string;
  weddingDate: string;
  venueName: string;
  templateId: string;
  published: boolean;
  paymentStatus: string;
  publicUrl: string;
}

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  plusOneAllowed: boolean;
  secureToken: string;
  guestUrl: string;
  rsvp?: {
    attendance: string;
    guestNames: string[];
    dietaryRequirements: string;
    message: string;
    updatedAt: string;
  } | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guestLoading, setGuestLoading] = useState(false);

  // New Guest Form
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestEmail, setNewGuestEmail] = useState("");
  const [newGuestPlusOne, setNewGuestPlusOne] = useState(false);
  const [addingGuest, setAddingGuest] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!res.ok || !data.success) {
          router.push("/login?redirect=/dashboard");
          return;
        }
        setUser(data.user);

        const invRes = await fetch("/api/user/invitations");
        const invData = await invRes.json();
        if (invData.success && invData.invitations) {
          setInvitations(invData.invitations);
          if (invData.invitations.length > 0) {
            setSelectedSlug(invData.invitations[0].slug);
          }
        }
      } catch (err) {
        console.error("Dashboard init error:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  useEffect(() => {
    if (!selectedSlug) return;
    async function loadGuests() {
      setGuestLoading(true);
      try {
        const res = await fetch(`/api/guests?slug=${selectedSlug}`);
        const data = await res.json();
        if (data.success && data.guests) {
          setGuests(data.guests);
        }
      } catch (err) {
        console.error("Error loading guests:", err);
      } finally {
        setGuestLoading(false);
      }
    }
    loadGuests();
  }, [selectedSlug]);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlug || !newGuestName.trim()) return;
    setAddingGuest(true);

    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: selectedSlug,
          name: newGuestName,
          email: newGuestEmail,
          plusOneAllowed: newGuestPlusOne,
        }),
      });
      const data = await res.json();
      if (data.success && data.guest) {
        setGuests((prev) => [data.guest, ...prev]);
        setNewGuestName("");
        setNewGuestEmail("");
        setNewGuestPlusOne(false);
      }
    } catch (err) {
      console.error("Add guest error:", err);
    } finally {
      setAddingGuest(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("awff_user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F6] flex items-center justify-center font-serif text-[#5C2C35]">
        Loading your luxury dashboard...
      </div>
    );
  }

  const currentInv = invitations.find((i) => i.slug === selectedSlug);

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#2A2726] font-sans pb-20">
      {/* Top Bar */}
      <header className="border-b border-[#D4C4B7]/60 bg-[#FBF9F6] py-4 px-6 sm:px-12 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl tracking-wide text-[#2A2726]">
          Invitation Luxury
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-xs uppercase tracking-widest text-[#7A7571] font-semibold">
            {user?.name || user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="text-xs uppercase tracking-widest text-[#991B1B] hover:underline font-semibold bg-transparent border-0 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 sm:px-12 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#2A2726]">
              Customer Dashboard
            </h1>
            <p className="text-sm text-[#7A7571] mt-1">
              Manage your wedding invitations, custom URLs, and guest RSVPs.
            </p>
          </div>
          <Link
            href="/design"
            className="inline-flex items-center justify-center bg-[#D4A574] text-[#FBF9F6] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#C29260] transition-colors"
          >
            + Create New Invitation
          </Link>
        </div>

        {invitations.length === 0 ? (
          <div className="border border-[#D4C4B7] rounded-lg p-12 text-center bg-white shadow-sm">
            <h3 className="text-2xl font-serif text-[#2A2726] mb-2">No Invitations Yet</h3>
            <p className="text-sm text-[#7A7571] mb-6">
              Create your first bespoke wedding invitation website today.
            </p>
            <Link
              href="/design"
              className="bg-[#D4A574] text-[#FBF9F6] px-8 py-3.5 rounded-full font-medium text-sm hover:bg-[#C29260] transition-colors"
            >
              Start Customizing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: List of Invitations */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <h2 className="text-xs uppercase tracking-widest text-[#7A7571] font-semibold">
                Your Invitations
              </h2>
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => setSelectedSlug(inv.slug)}
                  className={`p-6 border rounded-md cursor-pointer transition-all ${
                    selectedSlug === inv.slug
                      ? "border-[#D4A574] bg-white shadow-md"
                      : "border-[#D4C4B7]/60 bg-white/50 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif text-lg font-medium text-[#2A2726]">
                      {inv.partner1} & {inv.partner2}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${
                        inv.published
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {inv.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A7571]">{inv.weddingDate}</p>
                  <p className="text-xs text-[#D4A574] font-mono mt-2 truncate">
                    {inv.publicUrl}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Column: Selected Invitation Details & Guest Link Generator */}
            {currentInv && (
              <div className="lg:col-span-2 flex flex-col gap-8">
                {/* 1. Invitation Overview Card */}
                <div className="border border-[#D4C4B7] bg-white p-6 sm:p-8 rounded-md shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4C4B7]/40 pb-6 mb-6">
                    <div>
                      <h2 className="text-2xl font-serif text-[#2A2726]">
                        {currentInv.partner1} & {currentInv.partner2}
                      </h2>
                      <p className="text-sm font-mono text-[#7A7571] mt-1">
                        {currentInv.publicUrl}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => copyToClipboard(currentInv.publicUrl, "pub-url")}
                        className="text-xs bg-[#FBF9F6] border border-[#D4C4B7] px-4 py-2 rounded-full font-medium hover:bg-[#EBE7E0] transition-colors"
                      >
                        {copiedId === "pub-url" ? "Copied!" : "Copy Link"}
                      </button>
                      <a
                        href={currentInv.publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs bg-[#2A2726] text-white px-4 py-2 rounded-full font-medium hover:bg-black transition-colors"
                      >
                        Preview ↗
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-sans">
                    <div>
                      <span className="text-[#7A7571] block">Wedding Date</span>
                      <span className="font-semibold text-[#2A2726]">{currentInv.weddingDate}</span>
                    </div>
                    <div>
                      <span className="text-[#7A7571] block">Venue</span>
                      <span className="font-semibold text-[#2A2726]">{currentInv.venueName}</span>
                    </div>
                    <div>
                      <span className="text-[#7A7571] block">Payment Status</span>
                      <span className="font-semibold capitalize text-[#2A2726]">{currentInv.paymentStatus}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Guest Management & Secure Token Links */}
                <div className="border border-[#D4C4B7] bg-white p-6 sm:p-8 rounded-md shadow-sm">
                  <h3 className="text-xl font-serif text-[#2A2726] mb-2">
                    Guest Management & Private Links
                  </h3>
                  <p className="text-xs text-[#7A7571] mb-6">
                    Generate unique, tokenized invitation links for each guest to receive private RSVPs.
                  </p>

                  {/* Add Guest Form */}
                  <form onSubmit={handleAddGuest} className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-8 bg-[#FBF9F6] p-4 rounded-md border border-[#D4C4B7]/40">
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        required
                        placeholder="Guest Name (e.g. Lord & Lady Ashton)"
                        value={newGuestName}
                        onChange={(e) => setNewGuestName(e.target.value)}
                        className="w-full text-xs p-2.5 border border-[#D4C4B7] rounded focus:outline-none bg-white"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="email"
                        placeholder="Guest Email (Optional)"
                        value={newGuestEmail}
                        onChange={(e) => setNewGuestEmail(e.target.value)}
                        className="w-full text-xs p-2.5 border border-[#D4C4B7] rounded focus:outline-none bg-white"
                      />
                    </div>
                    <div className="sm:col-span-3 flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={addingGuest}
                        className="w-full bg-[#D4A574] text-white text-xs py-2.5 px-3 rounded font-medium hover:bg-[#C29260] transition-colors"
                      >
                        {addingGuest ? "Generating..." : "+ Add Guest"}
                      </button>
                    </div>
                  </form>

                  {/* Guest List Table */}
                  {guestLoading ? (
                    <p className="text-xs text-[#7A7571]">Loading guests...</p>
                  ) : guests.length === 0 ? (
                    <p className="text-xs text-[#7A7571] italic text-center py-4">
                      No guests added yet. Add your first guest above to generate their unique URL.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#D4C4B7]/60 text-[#7A7571] uppercase tracking-wider">
                            <th className="pb-3 font-semibold">Guest Name</th>
                            <th className="pb-3 font-semibold">RSVP Status</th>
                            <th className="pb-3 font-semibold">Secure Link</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D4C4B7]/30">
                          {guests.map((g) => (
                            <tr key={g.id} className="hover:bg-[#FBF9F6]/60">
                              <td className="py-3 font-medium text-[#2A2726]">{g.name}</td>
                              <td className="py-3">
                                {g.rsvp ? (
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold ${
                                      g.rsvp.attendance === "attending"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {g.rsvp.attendance}
                                  </span>
                                ) : (
                                  <span className="text-[#7A7571] italic">Pending</span>
                                )}
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <input
                                    readOnly
                                    value={g.guestUrl}
                                    className="w-48 text-[11px] font-mono bg-[#FBF9F6] border border-[#D4C4B7]/60 p-1.5 rounded truncate select-all"
                                  />
                                  <button
                                    onClick={() => copyToClipboard(g.guestUrl, g.id)}
                                    className="text-[11px] bg-[#2A2726] text-white px-2.5 py-1.5 rounded hover:bg-black transition-colors"
                                  >
                                    {copiedId === g.id ? "Copied" : "Copy"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
