"use client";

import { X } from "lucide-react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import ProfileCard from "@/components/contact/ProfileCard";

// Reusable simple macOS-style chrome (duplicated locally to avoid cross-file coupling)
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
    <p className="text-xs text-black/70">Contacts</p>
    <button aria-label="Close window" onClick={onClose} className="p-1 rounded hover:bg-black/5">
      <X className="size-3.5 text-black/60" />
    </button>
  </div>
);

export type ContactInfo = {
  name: string;
  title: string;
  handle?: string;
  status?: string;
  contactText?: string;
  contactUrl?: string;
  avatarFile?: string; // file inside /public/contact-info
};

export const ContactWindow: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  if (!open) return null;

  // mount animation
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

  // dragging
  const [pos, setPos] = useState<{ x: number; y: number }>(() => ({ x: 160, y: 140 }));
  const beginDrag = (e: React.MouseEvent) => {
    const offsetX = e.clientX - pos.x;
    const offsetY = e.clientY - pos.y;
    const width = 420;
    const height = 520;
    const onMove = (ev: MouseEvent) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let x = ev.clientX - offsetX;
      let y = ev.clientY - offsetY;
      x = Math.max(0, Math.min(vw - width, x));
      y = Math.max(0, Math.min(vh - 80, y));
      setPos({ x, y });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Center window on open and on resize
  useEffect(() => {
    if (!open) return;
    const center = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const cardH = Math.min(540, Math.round(vh * 0.8));
      const cardW = Math.round(cardH * 0.718); // aspect ratio from ProfileCard
      const x = Math.max(0, Math.floor((vw - cardW) / 2));
      const y = Math.max(40, Math.floor((vh - cardH) / 2)); // keep a bit above dock
      setPos({ x, y });
    };
    center();
    window.addEventListener("resize", center);
    return () => window.removeEventListener("resize", center);
  }, [open]);

  // data
  const [info, setInfo] = useState<ContactInfo | null>(null);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/contact-info/contact.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load contact.json");
        const data: ContactInfo = await res.json();
        if (active) setInfo(data);
      } catch {
        if (active)
          setInfo({
            name: "Your Name",
            title: "Your Title",
            handle: "handle",
            status: "Online",
            contactText: "Contact Me",
            contactUrl: "mailto:hello@example.com",
            avatarFile: "/about-me/photo-1.png",
          });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const avatarSrc = info?.avatarFile
    ? (info.avatarFile.startsWith("/") ? info.avatarFile : `/contact-info/${info.avatarFile}`)
    : "/about-me/photo-1.png";

  const handleContactClick = useCallback(() => {
    if (!info?.contactUrl) return;

    const toGmailCompose = (mailtoUrl: string) => {
      try {
        const raw = mailtoUrl.replace(/^mailto:/i, "");
        const [addrPart, queryPart] = raw.split("?");
        const params = new URLSearchParams(queryPart || "");
        const gmailParams = new URLSearchParams();
        if (addrPart) gmailParams.set("to", addrPart);
        if (params.get("subject")) gmailParams.set("su", params.get("subject") || "");
        if (params.get("body")) gmailParams.set("body", params.get("body") || "");
        if (params.get("cc")) gmailParams.set("cc", params.get("cc") || "");
        if (params.get("bcc")) gmailParams.set("bcc", params.get("bcc") || "");
        gmailParams.set("view", "cm");
        gmailParams.set("fs", "1");
        return `https://mail.google.com/mail/?${gmailParams.toString()}`;
      } catch {
        return "https://mail.google.com";
      }
    };

    const href = info.contactUrl.startsWith("mailto:")
      ? toGmailCompose(info.contactUrl)
      : info.contactUrl;

    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [info]);

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* backdrop */}
      <div
        className={`absolute inset-0 transition-colors duration-200 ${enter ? "bg-black/10" : "bg-black/0"}`}
        aria-hidden="true"
        onClick={() => {
          const now = typeof performance !== "undefined" ? performance.now() : Date.now();
          if (now - openedAt.current < 300) return;
          onClose();
        }}
      />

      <div
        className={`pointer-events-auto absolute select-none transform transform-gpu origin-top-left transition-[opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)] will-change-transform ${enter ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.98] translate-y-1"}`}
        style={{ left: pos.x, top: pos.y }}
        onMouseDown={beginDrag}
      >
        {/* Animated Profile Card only - transparent container, no chrome */}
        {info && (
          <ProfileCard
            name={info.name}
            title={info.title}
            handle={info.handle}
            status={info.status}
            contactText={info.contactText}
            avatarUrl={avatarSrc}
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={false}
            onContactClick={handleContactClick}
          />
        )}
      </div>
    </div>
  );
};

export default ContactWindow;