"use client";

import { X, Folder, FileText, Film, Image as ImageIcon, FileIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { WebViewWindow } from "@/components/windows/webview-window";

export type ProjectFile = {
  name: string;
  url: string;
};

type ProjectsWindowProps = {
  open: boolean;
  onClose: () => void;
  project: { name: string; files: ProjectFile[] };
  allProjectNames?: string[];
  allProjects?: { name: string; files: ProjectFile[] }[];
};

const windowStyles = "absolute z-[60] w-[780px] max-w-[90vw] rounded-xl bg-white shadow-xl border border-border";

export function ProjectsWindow({ open, onClose, project, allProjectNames, allProjects }: ProjectsWindowProps) {
  if (!open) return null;

  // enter animation
  const [enter, setEnter] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // current project (allows switching via sidebar)
  const [current, setCurrent] = useState(project);
  useEffect(() => {
    setCurrent(project);
  }, [project]);

  // in-app webview for special link files (e.g., .xyd)
  const [webView, setWebView] = useState<{ open: boolean; url: string; title: string }>({ open: false, url: "", title: "" });

  // draggable position (start roughly centered)
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    if (typeof window === "undefined") return { x: 200, y: 120 };
    return { x: Math.max(60, Math.floor(window.innerWidth / 2 - 390)), y: 120 };
  });

  // drag helpers
  const dragRef = useRef<{ offsetX: number; offsetY: number; dragging: boolean; w: number; h: number }>({
    offsetX: 0,
    offsetY: 0,
    dragging: false,
    w: 780,
    h: 520, // approx height; just for viewport constraints
  });

  const beginDrag = (e: React.PointerEvent) => {
    dragRef.current.dragging = true;
    dragRef.current.offsetX = e.clientX - pos.x;
    dragRef.current.offsetY = e.clientY - pos.y;

    const onMove = (ev: PointerEvent) => {
      if (!dragRef.current.dragging) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = Math.min(dragRef.current.w, vw);
      const h = Math.min(dragRef.current.h, vh);
      let x = ev.clientX - dragRef.current.offsetX;
      let y = ev.clientY - dragRef.current.offsetY;
      x = Math.max(0, Math.min(vw - w, x));
      y = Math.max(0, Math.min(vh - 80, y));
      setPos({ x, y });
    };
    const onUp = () => {
      dragRef.current.dragging = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const sidebarPrimary = ["Work", "About Me", "Resume", "Trash"];

  const pickIcon = (filename: string) => {
    const lower = filename.toLowerCase();
    if (lower.endsWith(".mov") || lower.endsWith(".mp4") || lower.endsWith(".webm")) return <Film className="h-10 w-10 text-[#6b7280]" />;
    if (lower.endsWith(".txt") || lower.endsWith(".md")) return <FileText className="h-10 w-10 text-[#6b7280]" />;
    if (lower.endsWith(".xyd")) return <Folder className="h-10 w-10 text-[var(--folder-blue)]" />;
    if (lower.endsWith(".fig") || lower.endsWith(".sketch")) return <Folder className="h-10 w-10 text-[#5DADE2]" />;
    if (lower.match(/\.(png|jpg|jpeg|gif|svg)$/)) return <ImageIcon className="h-10 w-10 text-[#6b7280]" />;
    return <FileIcon className="h-10 w-10 text-[#6b7280]" />;
  };

  const projectNames = allProjects ? allProjects.map((p) => p.name) : (allProjectNames || []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[55]">
      {/* Backdrop */}
      <div
        className={`pointer-events-auto absolute inset-0 transition-colors duration-200 ${enter ? "bg-black/20" : "bg-black/0"}`}
        onClick={onClose}
      />

      {/* Window */}
      <div
        className={`pointer-events-auto ${windowStyles} transform-gpu transition-[opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${enter ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"}`}
        style={{ left: pos.x, top: pos.y }}
        role="dialog"
        aria-modal="true"
      >
        {/* Titlebar */}
        <div
          className="flex items-center justify-between px-3 py-2 border-b border-border bg-white/80 rounded-t-xl cursor-move select-none"
          onPointerDown={beginDrag}
        >
          <div className="flex items-center gap-2">
            <button aria-label="Close" onClick={onClose} className="h-3 w-3 rounded-full bg-[var(--system-red)]" />
            <span className="h-3 w-3 rounded-full bg-[var(--system-yellow)]" />
            <span className="h-3 w-3 rounded-full bg-[var(--system-green)]" />
          </div>
          <p className="menu-bar-text text-sm text-text-primary">{current.name}</p>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted" aria-label="Close window">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-56 border-r border-border p-3">
            <p className="menu-bar-text text-[11px] uppercase tracking-wide text-muted-foreground mb-2">Section Header</p>
            <ul className="mb-4 space-y-1">
              {sidebarPrimary.map((item) => (
                <li key={item} className="menu-bar-text">
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 rounded px-2 py-1 text-left hover:bg-muted"
                    onClick={async () => {
                      if (item === "About Me") {
                        // Open About Me.txt inside in-app window (not a new browser tab)
                        setWebView({ open: true, url: "/Section%20Header/About%20Me.txt", title: "About Me" });
                        return;
                      }
                      if (item === "Resume") {
                        // Open local PDF from Section Header inside in-app window
                        setWebView({ open: true, url: "/Section%20Header/Resume.pdf", title: "Resume.pdf" });
                        return;
                      }
                      // Non-interactive for other labels for now
                    }}
                  >
                    <span className="h-1.5 w-1.5 rounded-sm border border-border" />
                    <span>{item}</span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="menu-bar-text text-[11px] uppercase tracking-wide text-muted-foreground mb-2">Section Header</p>
            <ul className="space-y-1">
              {projectNames.map((item) => {
                const active = current.name.toLowerCase() === item.toLowerCase();
                return (
                  <li key={item}>
                    <button
                      type="button"
                      className={`menu-bar-text w-full flex items-center gap-2 rounded px-2 py-1 text-left ${active ? "bg-black text-white" : "hover:bg-muted"}`}
                      onClick={() => {
                        if (!allProjects) return;
                        const next = allProjects.find((p) => p.name.toLowerCase() === item.toLowerCase());
                        if (next) setCurrent(next);
                      }}
                    >
                      <span className={`h-1.5 w-1.5 rounded-sm border ${active ? "border-white" : "border-border"}`} />
                      <span>{item}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Files Grid */}
          <section className="flex-1 p-6">
            <div className="grid grid-cols-3 gap-10">
              {current.files.length === 0 && (
                <div className="col-span-3 text-center text-sm text-muted-foreground">No files in this folder yet.</div>
              )}
              {current.files.map((f) => {
                const lower = f.name.toLowerCase();
                const isXyd = lower.endsWith(".xyd");
                const isJsonLink = lower.endsWith(".json");
                const label = lower.endsWith(".json") ? f.name.slice(0, -5) : (isXyd ? f.name.slice(0, -4) : f.name);

                if (isXyd || isJsonLink) {
                  return (
                    <button
                      key={f.url}
                      type="button"
                      className="flex flex-col items-center gap-2 select-none hover:opacity-90"
                      onClick={async () => {
                        try {
                          const res = await fetch(`${f.url}?v=${Date.now()}` as string, { cache: "no-store" });
                          const data = await res.json();
                          const url: string | undefined = data?.url;
                          const openExternal = data?.external === true || data?.open === "external";
                          if (url) {
                            if (openExternal) {
                              const isInIframe = window.self !== window.top;
                              if (isInIframe) {
                                window.parent?.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
                              } else {
                                window.open(url, "_blank", "noopener,noreferrer");
                              }
                            } else {
                              setWebView({ open: true, url, title: label });
                            }
                          }
                        } catch {
                          // ignore parse errors
                        }
                      }}
                    >
                      <div className="h-16 w-16 flex items-center justify-center">{pickIcon(f.name)}</div>
                      <span className="desktop-label text-center max-w-[160px] leading-snug">{label}</span>
                    </button>
                  );
                }

                return (
                  <a
                    key={f.url}
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center gap-2 select-none hover:opacity-90"
                  >
                    <div className="h-16 w-16 flex items-center justify-center">{pickIcon(f.name)}</div>
                    <span className="desktop-label text-center max-w-[160px] leading-snug">{label}</span>
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {webView.open && (
        <WebViewWindow
          open={webView.open}
          url={webView.url}
          title={webView.title}
          onClose={() => setWebView({ open: false, url: "", title: "" })}
        />
      )}
    </div>
  );
}