"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Plus, Minus, Star } from "lucide-react";

export type MessageItem = {
  q: string;
  a: string;
  icon?: "star" | null;
};

export default function MessagesWindow({ open, onClose }: { open: boolean; onClose: () => void }) {
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

  const [items, setItems] = useState<MessageItem[]>([]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/messages/faq.json", { cache: "no-store" });
        if (!res.ok) throw new Error("load fail");
        const data: MessageItem[] = await res.json();
        if (active) setItems(data);
      } catch {
        if (active)
          setItems([
            { q: "What kind of designer are you?", a: "One who balances precision with playfulness. I love clean, intuitive interfaces with unexpected, delightful details.", icon: "star" },
            { q: "What inspires your design style?", a: "Bold visual storytelling, functional simplicity, color theory experiments, and user-centric accessibility.", icon: null },
            { q: "Favorite kind of project to work on?", a: "Interactive product design, creative websites, and systems that blend aesthetics with performance.", icon: null },
          ]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const toggle = (idx: number) => setExpanded((m) => ({ ...m, [idx]: !m[idx] }));

  // simple draggable container
  const [pos, setPos] = useState({ x: 120, y: 90 });
  const dragStart = (e: React.MouseEvent) => {
    const startX = e.clientX - pos.x;
    const startY = e.clientY - pos.y;
    const onMove = (ev: MouseEvent) => setPos({ x: ev.clientX - startX, y: ev.clientY - startY });
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const headerTitle = useMemo(() => " FAQ's", []);

  return (
    <div className="fixed inset-0 z-[9999]">
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
        className={`absolute pointer-events-auto select-none transition-[opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${enter ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"}`}
        style={{ left: pos.x, top: pos.y }}
      >
        {/* Card */}
        <div className="w-[460px] sm:w-[540px] rounded-[26px] shadow-xl overflow-hidden border bg-white/90 backdrop-blur">
          {/* Title bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b cursor-move" onMouseDown={dragStart}>
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[var(--system-red)]" />
              <span className="size-3 rounded-full bg-[var(--system-yellow)]" />
              <span className="size-3 rounded-full bg-[var(--system-green)]" />
            </div>
            <p className="text-xs text-black/70">Messages</p>
            <button aria-label="Close" onClick={onClose} className="p-1 rounded hover:bg-black/5">
              <X className="size-3.5 text-black/60" />
            </button>
          </div>

          {/* Conversation area */}
          <div className="p-3 sm:p-4 bg-[url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\'><rect width=\'1\' height=\'1\' fill=\'%23e5e5e5\' /></svg>')] bg-[length:20px_20px]">
            <div className="mb-3 text-[11px] text-black/60">{headerTitle}</div>

            <div className="flex flex-col gap-2.5">
              {items.map((m, idx) => {
                const isOpen = !!expanded[idx];
                return (
                  <div key={idx} className="flex flex-col gap-1">
                    {/* Question bubble */}
                    <div className="self-start max-w-[85%]">
                      <div
                        onClick={() => toggle(idx)}
                        className={`relative inline-flex items-center gap-2 rounded-[22px] bg-black text-white px-3.5 py-2.5 shadow-sm cursor-pointer select-none transition-colors duration-200`}
                      >
                        {m.icon === "star" && <Star className="size-4 text-yellow-400" />}
                        <span className="text-[13px] leading-snug">{m.q}</span>
                        <span
                          aria-hidden
                          className={`ml-1 grid place-items-center rounded-full bg-white/10 size-5 pointer-events-none transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        >
                          {isOpen ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
                        </span>
                      </div>
                    </div>

                    {/* Answer bubble (collapsible) */}
                    <div
                      className={`self-end max-w-[85%] grid overflow-hidden will-change-[grid-template-rows] transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div
                          className={`origin-top transform-gpu will-change-[transform,opacity] transition-[transform,opacity] duration-200 ease-out ${isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"} rounded-[22px] bg-[#0a84ff] text-white px-3.5 py-2.5 shadow-sm`}
                        >
                          <p className="text-[13px] leading-snug">{m.a}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}