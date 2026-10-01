"use client";

import React from "react";
import Link from "next/link";

interface LimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToDesign: () => void;
}

export function LimitModal({ isOpen, onClose, onGoToDesign }: LimitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A2726]/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FBF9F6] border border-[#D4C4B7] p-8 sm:p-10 rounded-[2px] shadow-lg text-center font-sans">
        
        {/* Warning Icon */}
        <div className="w-12 h-12 rounded-full border border-[#D4C4B7] bg-[#F0EBE1]/40 flex items-center justify-center mx-auto mb-6 text-[#2A2726]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-serif font-normal text-[#2A2726] tracking-wide mb-4">
          One Invitation Limit
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#7A7571] leading-relaxed mb-8 max-w-xs mx-auto">
          LUXURY Invitation accounts are limited to one active wedding invitation card to ensure maximum dashboard security. You already have an active draft.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onGoToDesign}
            className="w-full bg-[#D4A574] text-[#FBF9F6] py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#C29260] transition-all cursor-pointer border-0"
          >
            Edit Existing Invitation
          </button>
          <button
            onClick={onClose}
            className="w-full border border-[#D4C4B7] text-[#7A7571] hover:text-[#2A2726] py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-transparent cursor-pointer transition-all"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

export default LimitModal;
