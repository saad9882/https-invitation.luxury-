"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar, Footer } from "@/components";

interface Review {
  _id?: string;
  fullName: string;
  email: string;
  rating: number;
  title: string;
  experience: string;
  subscribed?: boolean;
  createdAt?: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = () => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) {
          setReviews(data.reviews);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          rating,
          title,
          experience,
          subscribed,
        }),
      });

      const resData = await response.json();
      if (response.ok) {
        setSuccess(true);
        // Refresh reviews list
        fetchReviews();
        // Clear form
        setFullName("");
        setEmail("");
        setRating(5);
        setTitle("");
        setExperience("");
        setSubscribed(false);
        // Auto hide success message after 4 seconds
        setTimeout(() => setSuccess(false), 4000);
      } else {
        setError(resData.error || "Failed to submit review");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#EBE7E0] min-h-screen flex flex-col justify-between font-sans selection:bg-[#F0EBE1]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 sm:px-8 md:px-12">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-16">
            <Link
              href="/"
              className="inline-block text-xs uppercase tracking-widest text-[#5C2C35]/60 hover:text-[#5C2C35] transition-colors font-bold mb-4"
            >
              &larr; Back to Home
            </Link>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl sm:text-5xl text-[#5C2C35] font-normal tracking-wide"
            >
              Stories & Shared Memories
            </h1>
            <p className="text-sm text-[#5C2C35]/70 max-w-lg mx-auto font-sans mt-3 leading-relaxed">
              Read how couples around the world crafted their bespoke digital wedding cards, or leave your own review below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Form Column */}
            <div className="lg:col-span-5 bg-white/70 backdrop-blur-sm border border-[#D4C4B7]/70 rounded-[2.5rem] p-8 sm:p-10 shadow-sm">
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="text-2xl font-serif text-[#5C2C35] mb-2 font-normal"
              >
                Share Your Experience
              </h2>
              <p className="text-xs text-[#5C2C35]/65 mb-8 leading-relaxed">
                Your feedback helps us perfect our bespoke templates. Let us know how your invitation was received by your guests!
              </p>

              {success && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-800 text-xs border border-green-200">
                  ✦ Thank you! Your review has been published successfully.
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-800 text-xs border border-red-200">
                  ✕ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-[#7A7571] font-bold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Charlotte & Alexander"
                    className="border-b border-[#D4C4B7] bg-transparent pb-2 focus:border-[#5C2C35] focus:outline-none text-sm transition-colors placeholder:text-[#7A7571]/40"
                  />
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-[#7A7571] font-bold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="border-b border-[#D4C4B7] bg-transparent pb-2 focus:border-[#5C2C35] focus:outline-none text-sm transition-colors placeholder:text-[#7A7571]/40"
                  />
                </div>

                {/* Stars Rating Selector */}
                <div className="flex flex-col gap-2 pt-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#7A7571] font-bold">
                    Overall Rating
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled =
                        hoverRating !== null ? star <= hoverRating : star <= rating;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="text-[#C9A56B] bg-transparent border-0 cursor-pointer p-0 focus:outline-none transition-transform hover:scale-110"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={isFilled ? "currentColor" : "none"}
                            stroke={isFilled ? "none" : "currentColor"}
                            strokeWidth={isFilled ? undefined : 1.5}
                            className="w-7 h-7"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Review Title */}
                <div className="flex flex-col gap-1.5 pt-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#7A7571] font-bold">
                    Review Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience..."
                    className="border-b border-[#D4C4B7] bg-transparent pb-2 focus:border-[#5C2C35] focus:outline-none text-sm transition-colors placeholder:text-[#7A7571]/40"
                  />
                </div>

                {/* Review Body */}
                <div className="flex flex-col gap-1.5 pt-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#7A7571] font-bold">
                    Your Review
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="Tell us what you liked the most, and how your guests responded..."
                    className="border-b border-[#D4C4B7] bg-transparent pb-2 focus:border-[#5C2C35] focus:outline-none text-sm transition-colors placeholder:text-[#7A7571]/40 resize-none w-full"
                  />
                </div>

                {/* Newsletter Subscription (News Settlers) */}
                <div className="flex items-center gap-3 pt-4 select-none">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={subscribed}
                    onChange={(e) => setSubscribed(e.target.checked)}
                    className="w-4 h-4 rounded text-[#5C2C35] focus:ring-[#5C2C35] accent-[#5C2C35] cursor-pointer"
                  />
                  <label htmlFor="newsletter" className="text-xs text-[#5C2C35]/80 cursor-pointer font-medium leading-tight">
                    Subscribe to our newsletter for exclusive luxury wedding content & inspirations.
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#5C2C35] hover:bg-[#4A2229] text-white py-4 rounded-full font-bold text-xs tracking-widest uppercase transition-colors border-0 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {submitting ? "Submitting Review..." : "Publish Review"}
                  </button>
                </div>
              </form>
            </div>

            {/* Reviews Listing Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-xl font-serif text-[#5C2C35] font-normal"
                >
                  Verified Client Reviews ({reviews.length})
                </h3>
              </div>

              {loading ? (
                <div className="text-center py-20 text-sm text-[#5C2C35]/60 font-sans">
                  Fetching client reviews...
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-20 text-sm text-[#5C2C35]/60 font-sans border border-dashed border-[#D4C4B7] rounded-[2rem]">
                  No reviews published yet. Be the first to share your experience!
                </div>
              ) : (
                <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                  {reviews.map((rev, index) => (
                    <motion.div
                      key={rev._id || index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
                      className="bg-white/80 border border-[#D4C4B7]/40 rounded-[2rem] p-6 shadow-sm flex flex-col gap-3 transition-all hover:shadow-md"
                    >
                      {/* Stars */}
                      <div className="flex gap-1 text-[#C9A56B] select-none">
                        {[...Array(5)].map((_, i) => {
                          const isFilled = i < (rev.rating || 5);
                          return (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill={isFilled ? "currentColor" : "none"}
                              stroke={isFilled ? "none" : "currentColor"}
                              strokeWidth={isFilled ? undefined : 1.5}
                              className="w-4 h-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                              />
                            </svg>
                          );
                        })}
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-semibold text-[#5C2C35]">
                        {rev.title}
                      </h4>

                      {/* Body */}
                      <p className="text-xs text-[#5C2C35]/80 leading-relaxed">
                        {rev.experience}
                      </p>

                      {/* Metadata */}
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#D4C4B7]/20 text-[10px] tracking-widest uppercase text-[#5C2C35]/60 font-medium">
                        <span>— {rev.fullName}</span>
                        {rev.createdAt && (
                          <span>
                            {new Date(rev.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4c4b7;
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b7a081;
        }
      `}</style>
    </div>
  );
}
