"use client";

import Image from "next/image";
import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// Simple macOS-style window chrome
const WindowChrome = ({
  title,
  onClose,
  onDragStart,
}: {
  title: string;
  onClose: () => void;
  onDragStart?: (e: React.MouseEvent) => void;
}) => (
  <div
    className="flex items-center justify-between px-3 py-2 border-b bg-white/90 rounded-t-lg cursor-move select-none"
    onMouseDown={onDragStart}
  >
    <div className="flex items-center gap-2">
      <button aria-label="Close" onClick={onClose} className="size-3 rounded-full bg-[var(--system-red)]" />
      <span className="size-3 rounded-full bg-[var(--system-yellow)]" />
      <span className="size-3 rounded-full bg-[var(--system-green)]" />
    </div>
    <p className="text-xs text-black/70">{title}</p>
    <button aria-label="Close window" onClick={onClose} className="p-1 rounded hover:bg-black/5">
      <X className="size-3.5 text-black/60" />
    </button>
  </div>
);

export const AboutMeWindow: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  if (!open) return null;

  // smooth mount animation
  const [enter, setEnter] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // guard to prevent immediate close from initial click-through
  const openedAt = useRef<number>(0);
  useEffect(() => {
    openedAt.current = typeof performance !== "undefined" ? performance.now() : Date.now();
  }, []);

  const [aboutText, setAboutText] = useState("");
  const [photoSrc1, setPhotoSrc1] = useState("/about-me/photo-1.png");
  const [photoSrc2, setPhotoSrc2] = useState("/about-me/photo-2.png");

  // Positions for the three windows
  const [pos1, setPos1] = useState<{ x: number; y: number }>({ x: 120, y: 90 });
  const initialPos2 = typeof window !== "undefined"
    ? { x: Math.max(0, window.innerWidth - 300 - 360), y: 100 }
    : { x: 20, y: 100 };
  const [pos2, setPos2] = useState<{ x: number; y: number }>(initialPos2);
  const [pos3, setPos3] = useState<{ x: number; y: number }>({ x: 360, y: 300 });

  // Active/focused window for z-index
  const [active, setActive] = useState<"w1" | "w2" | "w3">("w3");

  // Dragging state
  const dragRef = useRef<{
    id: "w1" | "w2" | "w3" | null;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
  }>({ id: null, offsetX: 0, offsetY: 0, width: 0, height: 0 });

  const beginDrag = (
    id: "w1" | "w2" | "w3",
    e: React.MouseEvent,
    size: { width: number; height: number }
  ) => {
    setActive(id);
    const currentPos = id === "w1" ? pos1 : id === "w2" ? (pos2 ?? { x: 0, y: 100 }) : pos3;
    dragRef.current = {
      id,
      offsetX: e.clientX - currentPos.x,
      offsetY: e.clientY - currentPos.y,
      width: size.width,
      height: size.height,
    };

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current.id) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = dragRef.current.width;
      const h = dragRef.current.height;
      let x = ev.clientX - dragRef.current.offsetX;
      let y = ev.clientY - dragRef.current.offsetY;
      // Constrain within viewport
      x = Math.max(0, Math.min(vw - w, x));
      y = Math.max(0, Math.min(vh - 80, y));
      if (dragRef.current.id === "w1") setPos1({ x, y });
      else if (dragRef.current.id === "w2") setPos2({ x, y });
      else setPos3({ x, y });
    };
    const onUp = () => {
      dragRef.current.id = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        const res = await fetch("/about-me/aboutme.txt", { cache: "no-store" });
        const text = await res.text();
        setAboutText(text);
      } catch (e) {
        setAboutText("");
      }
    };
    // delay to avoid state churn during opening animation
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const resolve = async () => {
      try {
        const r1 = await fetch("/about-me/photo-1.png", { method: "HEAD", cache: "no-store" });
        setPhotoSrc1(r1.ok ? "/about-me/photo-1.png" : "/about-me/photo-1.svg");
      } catch {
        setPhotoSrc1("/about-me/photo-1.svg");
      }
      try {
        const r2 = await fetch("/about-me/photo-2.png", { method: "HEAD", cache: "no-store" });
        setPhotoSrc2(r2.ok ? "/about-me/photo-2.png" : "/about-me/photo-2.svg");
      } catch {
        setPhotoSrc2("/about-me/photo-2.svg");
      }
    };
    // delay to avoid jank during opening animation
    const t = setTimeout(resolve, 300);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* backdrop to catch clicks outside */}
      <div
        className={`absolute inset-0 transition-colors duration-200 ${enter ? "bg-black/10" : "bg-black/0"}`}
        aria-hidden="true"
        onClick={(e) => {
          const now = typeof performance !== "undefined" ? performance.now() : Date.now();
          if (now - openedAt.current < 300) return; // ignore immediate click after open
          onClose();
        }}
      />

      {/* Left photo window */}
      <div
        className={`pointer-events-auto absolute w-[360px] rounded-lg shadow-xl bg-white border select-none overflow-hidden transform transform-gpu origin-top-left transition-[opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)] will-change-transform motion-reduce:transition-none motion-reduce:transform-none ${enter ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.98] translate-y-1"}`}
        style={{ left: pos1.x, top: pos1.y, zIndex: active === "w1" ? 30 : 20 }}
        onMouseDown={() => setActive("w1")}
      >
        <WindowChrome
          title="IMG1041.heic"
          onClose={onClose}
          onDragStart={(e) => beginDrag("w1", e, { width: 360, height: 306 })}
        />
        <div className="p-2">
          <Image
            src={photoSrc1}
            alt="About me photo 1"
            width={640}
            height={480}
            className="w-full h-[260px] object-cover rounded"
            priority
          />
        </div>
      </div>

      {/* Right photo window */}
      <div
        className={`pointer-events-auto absolute w-[360px] rounded-lg shadow-xl bg-white border select-none overflow-hidden transform transform-gpu origin-top-left transition-[opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)] delay-100 will-change-transform motion-reduce:transition-none motion-reduce:transform-none ${enter ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.98] translate-y-1"}`}
        style={{ left: (pos2?.x ?? 0), top: (pos2?.y ?? 100), zIndex: active === "w2" ? 30 : 20 }}
        onMouseDown={() => setActive("w2")}
      >
        <WindowChrome
          title="IMG0641.heic"
          onClose={onClose}
          onDragStart={(e) => beginDrag("w2", e, { width: 360, height: 266 })}
        />
        <div className="p-2">
          <Image
            src={photoSrc2}
            alt="About me photo 2"
            width={640}
            height={480}
            className="w-full h-[220px] object-cover rounded"
            priority
          />
        </div>
      </div>

      {/* Text window */}
      <div
        className={`pointer-events-auto absolute w-[440px] rounded-lg shadow-xl bg-white border select-none overflow-hidden transform transform-gpu origin-top-left transition-[opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)] delay-200 will-change-transform motion-reduce:transition-none motion-reduce:transform-none ${enter ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.98] translate-y-1"}`}
        style={{ left: pos3.x, top: pos3.y, zIndex: active === "w3" ? 30 : 20 }}
        onMouseDown={() => setActive("w3")}
      >
        <WindowChrome
          title="aboutme.txt"
          onClose={onClose}
          onDragStart={(e) => beginDrag("w3", e, { width: 352, height: 385 })}
        />
        <div className="p-4 text-[13px] leading-6 text-black/90 whitespace-pre-wrap h-[300px] overflow-auto">
          {aboutText || ""}
        </div>
      </div>
    </div>
  );
};

export default AboutMeWindow;