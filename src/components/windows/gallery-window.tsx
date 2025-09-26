"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import DomeGallery, { type DomeImage } from "@/components/gallery/DomeGallery";

export const GalleryWindow: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  if (!open) return null;

  const [enter, setEnter] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const openedAt = useRef<number>(0);
  useEffect(() => {
    openedAt.current = typeof performance !== "undefined" ? performance.now() : Date.now();
  }, []);

  const [images, setImages] = useState<DomeImage[]>([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/gallery/images.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load images.json");
        const data: DomeImage[] = await res.json();
        if (active) setImages(data);
      } catch {
        if (active) {
          // Fallback to some existing public assets so UI still works
          setImages([
            "/about-me/photo-1.png",
            "/about-me/photo-2.png",
            "/about-me/photo-3.png",
            "/about-me/photo-4.png",
          ]);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // App-sized area with no window chrome
  return (
    <div className="fixed inset-0 z-[40]">
      {/* backdrop: click desktop to close */}
      <div
        className="absolute inset-0 bg-transparent pointer-events-auto"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none transform-gpu transition-opacity duration-300 ${enter ? "opacity-100" : "opacity-0"}`}
      >
        <div className="pointer-events-auto w-[90vw] max-w-[1100px] h-[70vh] md:w-[1000px] md:h-[640px] overflow-hidden relative">
          {/* Content area fills container */}
          <div className="absolute inset-0">
            <DomeGallery
              images={images}
              segments={14}
              fit={0.72}
              padFactor={0.12}
              imageBorderRadius="34px"
              openedImageBorderRadius="34px"
              grayscale={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryWindow;