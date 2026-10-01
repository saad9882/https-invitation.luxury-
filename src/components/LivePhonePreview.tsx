"use client";

import React, { useState, useEffect, useRef } from "react";

interface LivePhonePreviewProps {
  demoUrl: string | null;
  fallbackImage: string;
  alt: string;
}

export function LivePhonePreview({ demoUrl, fallbackImage, alt }: LivePhonePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(280);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      setWidth(el.clientWidth);
    };

    updateWidth();

    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  const scaleFactor = width / 375;

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden rounded-[2.5rem]">
      {isInView && demoUrl ? (
        <div
          className="absolute inset-0 overflow-hidden bg-white"
          style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        >
          <iframe
            src={`${demoUrl}?preview=1`}
            style={{
              width: "375px",
              height: "812px",
              transform: `scale(${scaleFactor})`,
              transformOrigin: "top left",
              border: "none",
              pointerEvents: "none",
            }}
            loading="lazy"
            title={alt}
          />
        </div>
      ) : (
        <img
          src={fallbackImage}
          alt={alt}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}

export default LivePhonePreview;
