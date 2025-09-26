"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";

export type WebViewWindowProps = {
  open: boolean;
  url: string;
  title?: string;
  onClose: () => void;
};

const WindowChrome = ({
  title,
  onClose,
  onDragStart,
  onMinimize,
  onToggleMaximize,
  isMaximized,
}: {
  title: string;
  onClose: () => void;
  onDragStart?: (e: React.MouseEvent) => void;
  onMinimize?: () => void;
  onToggleMaximize?: () => void;
  isMaximized?: boolean;
}) => (
  <div
    className="flex items-center justify-between px-3 py-2 border-b bg-white/90 rounded-t-lg cursor-move select-none"
    onMouseDown={onDragStart}
  >
    <div className="flex items-center gap-2">
      <button aria-label="Close" onClick={onClose} className="size-3 rounded-full bg-[var(--system-red)]" />
      <button aria-label="Minimize" onClick={onMinimize} className="size-3 rounded-full bg-[var(--system-yellow)]" />
      <button aria-label="Maximize" onClick={onToggleMaximize} className="size-3 rounded-full bg-[var(--system-green)]" />
    </div>
    <p className="text-xs text-black/70 truncate max-w-[60%]">{title}</p>
    <div className="flex items-center gap-1">
      <button aria-label="Minimize window" onClick={onMinimize} className="p-1 rounded hover:bg-black/5">
        <Minus className="size-3.5 text-black/60" />
      </button>
      <button aria-label={isMaximized ? "Restore window" : "Maximize window"} onClick={onToggleMaximize} className="p-1 rounded hover:bg-black/5">
        {isMaximized ? <Minimize2 className="size-3.5 text-black/60" /> : <Maximize2 className="size-3.5 text-black/60" />}
      </button>
      <button aria-label="Close window" onClick={onClose} className="p-1 rounded hover:bg-black/5">
        <X className="size-3.5 text-black/60" />
      </button>
    </div>
  </div>
);

export const WebViewWindow: React.FC<WebViewWindowProps> = ({ open, url, title = "Web Page", onClose }) => {
  const [enter, setEnter] = useState(false);
  const openedAt = useRef<number>(0);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 160, y: 120 });
  const size = { width: 900, height: 560 };
  const [isMin, setIsMin] = useState(false);
  const [isMax, setIsMax] = useState(false);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => setEnter(true));
    openedAt.current = typeof performance !== "undefined" ? performance.now() : Date.now();
    return () => cancelAnimationFrame(id);
  }, [open]);

  const beginDrag = (e: React.MouseEvent) => {
    if (isMax) return; // disable drag while maximized
    const startX = e.clientX - pos.x;
    const startY = e.clientY - pos.y;

    const onMove = (ev: MouseEvent) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let x = ev.clientX - startX;
      let y = ev.clientY - startY;
      x = Math.max(0, Math.min(vw - size.width, x));
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

  if (!open) return null;

  // When minimized, show a small restore chip and no backdrop/window chrome
  if (isMin) {
    return (
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        <button
          className="pointer-events-auto fixed bottom-4 left-4 px-3 py-2 rounded-md shadow bg-white border text-sm text-black/70 hover:bg-muted"
          onClick={() => setIsMin(false)}
        >
          {title} — Restore
        </button>
      </div>
    );
  }

  const isPdf = /\.pdf(\?|$)/i.test(url);

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-colors duration-200 ${enter ? "bg-black/10" : "bg-transparent"}`}
        onClick={() => {
          const now = typeof performance !== "undefined" ? performance.now() : Date.now();
          if (now - openedAt.current < 300) return;
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Window */}
      <div
        className={`pointer-events-auto absolute rounded-lg shadow-xl bg-white border select-none overflow-hidden transform-gpu transition-[opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${enter ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.98] translate-y-1"}`}
        style={
          isMax
            ? { left: 20, top: 20, width: "calc(100vw - 40px)", height: "calc(100vh - 60px)" }
            : { left: pos.x, top: pos.y, width: size.width, height: size.height }
        }
        onMouseDown={(e) => e.stopPropagation()}
      >
        <WindowChrome
          title={title}
          onClose={onClose}
          onDragStart={beginDrag}
          onMinimize={() => setIsMin(true)}
          onToggleMaximize={() => setIsMax((v) => !v)}
          isMaximized={isMax}
        />
        <div className="w-full h-[calc(100%-38px)] bg-white">
          {isPdf ? (
            // Use object/embed for PDF to avoid Chrome sandbox restrictions
            <object data={url} type="application/pdf" className="w-full h-full">
              <iframe
                src={url}
                title={title}
                className="w-full h-full"
              />
            </object>
          ) : (
            // sandboxed iframe for regular web content
            <iframe
              src={url}
              title={title}
              className="w-full h-full"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-downloads"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WebViewWindow;