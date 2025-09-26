"use client";

import Image from "next/image";
import { X } from "lucide-react";
import React from "react";

export type PhotosWindowProps = {
  open: boolean;
  onClose: () => void;
};

// Simple macOS-style window chrome
const WindowChrome = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <div className="flex items-center justify-between px-3 py-2 border-b bg-white/90 rounded-t-lg">
    <div className="flex items-center gap-2">
      <button aria-label="Close" onClick={onClose} className="size-3 rounded-full bg-[var(--system-red)]" />
      <span className="size-3 rounded-full bg-[var(--system-yellow)]" />
      <span className="size-3 rounded-full bg-[var(--system-green)]" />
    </div>
    <p className="text-xs text-black/70">Photos</p>
    <button aria-label="Close window" onClick={onClose} className="p-1 rounded hover:bg-black/5">
      <X className="size-3.5 text-black/60" />
    </button>
  </div>
);

// Easily editable photos array — swap URLs and labels as needed
const photos = [
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/IMG_1041.jpg",
    alt: "Portrait 1",
    label: "IMG1041.jpg",
  },
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/IMG_0641.jpg",
    alt: "Portrait 2",
    label: "IMG0641.jpg",
  },
  // Add more images here
];

export const PhotosWindow: React.FC<PhotosWindowProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* backdrop to catch clicks outside */}
      <div className="absolute inset-0 pointer-events-auto" onClick={onClose} />

      <div className="pointer-events-auto absolute top-[160px] left-[200px] w-[760px] rounded-lg shadow-xl bg-white border select-none">
        <WindowChrome title="Photos" onClose={onClose} />

        <div className="p-4">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((p) => (
              <figure key={p.src} className="flex flex-col items-center gap-2">
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={260}
                  height={180}
                  className="w-full h-[140px] object-cover rounded"
                />
                <figcaption className="desktop-label text-center">{p.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotosWindow;