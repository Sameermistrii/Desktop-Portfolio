"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { AboutMeWindow } from '@/components/windows/about-me-window';
import { Link as LinkIcon, Folder as FolderIcon, FileText as FileTextIcon } from 'lucide-react';
import { WebViewWindow } from '@/components/windows/webview-window';

type DesktopItemProps = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  className: string;
  onClick?: () => void;
};

const DesktopItem = ({ icon, label, href, className, onClick }: DesktopItemProps) => {
  const content = (
    <div className="flex flex-col items-center gap-1.5 w-[76px] text-center group">
      <div className="w-16 h-16 flex items-center justify-center transition-transform duration-200 ease-in-out group-hover:scale-105 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        {icon}
      </div>
      <p className="desktop-label text-text-primary leading-tight break-words">
        {label}
      </p>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href === '#' ? '_self' : '_blank'}
        rel="noopener noreferrer"
        className={`absolute z-30 cursor-pointer ${className}`}
      >
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`absolute z-30 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black/10 rounded ${className}`}
      >
        {content}
      </button>
    );
  }

  return <div className={`absolute z-30 cursor-pointer ${className}`}>{content}</div>;
};

export default function DesktopFiles() {
  const [showAbout, setShowAbout] = useState(false);
  // shortcuts from /api/shortcuts
  const [shortcuts, setShortcuts] = useState<{ label: string; url: string; embedded?: boolean; icon?: string }[]>([]);
  const [webView, setWebView] = useState<{ open: boolean; url: string; title: string }>({ open: false, url: '', title: '' });
  
  // State for "Don't Look" playful flow
  const [dontClicks, setDontClicks] = useState(0);
  const [cloud, setCloud] = useState<{ show: boolean; text: string }>({ show: false, text: "" });

  // Draggable position for the Don't Look dustbin (resets on refresh)
  const [binPos, setBinPos] = useState<{ top: number; right: number }>({ top: 592, right: 100 });
  const dragRef = useRef<{ startX: number; startY: number; startTop: number; startRight: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/shortcuts');
        if (!res.ok) return;
        const data: { shortcuts: { label: string; url: string; embedded?: boolean; icon?: string }[] } = await res.json();
        if (active) setShortcuts(data.shortcuts || []);
      } catch {
        // ignore
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const onBinMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startTop = binPos.top;
    const startRight = binPos.right;
    dragRef.current = {
      startX,
      startY,
      startTop,
      startRight,
      moved: false,
    };

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragRef.current.moved = true;
        suppressClick.current = true;
      }
      setBinPos({
        top: Math.max(60, startTop + dy),
        right: Math.max(0, startRight - dx),
      });
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      dragRef.current = null;
      // allow normal clicks again on next tick
      setTimeout(() => { suppressClick.current = false; }, 0);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleDontLookClick = () => {
    const next = dontClicks + 1;
    setDontClicks(next);

    if (next === 1) {
      setCloud({ show: true, text: "i said dont 😜☁️" });
      setTimeout(() => setCloud({ show: false, text: "" }), 2000);
      return;
    }
    if (next === 2) {
      setCloud({ show: true, text: "i told you dont look 🙈☁️" });
      setTimeout(() => setCloud({ show: false, text: "" }), 2000);
      return;
    }

    // 3rd click and beyond: open an empty window with message
    const html = `<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><title>Don\'t Look</title><style>html,body{height:100%;margin:0}body{display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#111}.bubble{max-width:640px;background:#fff;border:1px solid #e5e5e5;border-radius:18px;padding:20px 22px;box-shadow:0 6px 24px rgba(0,0,0,.08);text-align:center}.title{font-size:18px;font-weight:600;margin-bottom:6px}.msg{font-size:16px;opacity:.85}</style></head><body><div class=\"bubble\"><div class=\"title\">Nothing to see here 👀</div><div class=\"msg\">I told You Dont Look 😤🙈</div></div></body></html>`;
    const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
    setWebView({ open: true, url: dataUrl, title: "Don't Look" });
  };

  return (
    <>
      <DesktopItem
        className="top-[318px] left-[60px]"
        onClick={() => setWebView({ open: true, url: "/Section%20Header/Resume.pdf", title: "Resume.pdf" })}
        icon={
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7c0c911a-1ae7-40dd-8466-7ca3af5221e9-inikasdesktop-framer-website/assets/icons/RHAvQg2vnbtBKRG0ph3erPEvgb0-24.png"
            alt="Resume document icon"
            width={64}
            height={64}
            className="object-contain"
          />
        }
        label="Resume.pdf"
      />

      <DesktopItem
        className="top-[525px] left-[200px]"
        onClick={() => setShowAbout(v => !v)}
        icon={
          <Image
            src="https://framerusercontent.com/images/stLcXmD5BBe1RLsQJ8fbc29YAQQ.png"
            alt="About Me folder icon"
            width={64}
            height={64}
            className="object-contain"
          />
        }
        label="About Me"
      />

      {/* Don't Look dustbin (draggable, resets on refresh) */}
      <div
        className="absolute z-30"
        style={{ top: binPos.top, right: binPos.right }}
        onMouseDown={onBinMouseDown}
        onClickCapture={(e) => { if (suppressClick.current) e.stopPropagation(); }}
      >
        <DesktopItem
          className="" // position handled by wrapper
          onClick={handleDontLookClick}
          icon={
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/7c0c911a-1ae7-40dd-8466-7ca3af5221e9-inikasdesktop-framer-website/assets/icons/AbIAp0qW5rYTqOKWfx9xlOy8Pio-25.png"
              alt="Folder with a preview image titled Don't Look"
              width={64}
              height={64}
              className="object-contain"
            />
          }
          label="Don’t Look"
        />
      </div>

      {/* Playful cloud near the dustbin (follows dustbin) */}
      {cloud.show && (
        <div
          className="absolute z-[60] animate-in fade-in zoom-in-95 duration-200"
          style={{ top: binPos.top - 44, right: binPos.right - 40 }}
        >
          <div className="relative bg-white border shadow-xl rounded-2xl px-3.5 py-2.5 text-sm text-black/80 max-w-[220px]">
            <span className="block">{cloud.text}</span>
            {/* tail */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border border-t-0 border-l-0 rotate-45 shadow -z-10" />
          </div>
        </div>
      )}

      {/* Render up to two shortcut link files dynamically */}
      {shortcuts.slice(0, 2).map((s, i) => {
        const shortcutPositions = [
          "top-[420px] left-[60px]",
          "top-[420px] left-[150px]",
          "top-[510px] left-[60px]",
          "top-[510px] left-[150px]",
          "top-[600px] left-[60px]",
          "top-[600px] left-[150px]",
          "top-[690px] left-[60px]",
          "top-[690px] left-[150px]",
          // ... add more if needed
        ];
        const commonProps = {
          key: `${s.label}-${i}`,
          className: shortcutPositions[i] || "top-[420px] left-[60px]",
          label: s.label,
        } as const;

        if (s.embedded) {
          const isTxt = s.url.toLowerCase().endsWith('.txt');
          const iconNode = s.icon ? (
            <Image src={s.icon} alt={`${s.label} icon`} width={64} height={64} className="object-contain" />
          ) : isTxt ? (
            <FileTextIcon className="h-10 w-10 text-[#6b7280]" />
          ) : (
            <FolderIcon className="h-10 w-10 text-[var(--folder-blue)]" />
          );

          return (
            <DesktopItem
              {...commonProps}
              onClick={() => setWebView({ open: true, url: s.url, title: s.label })}
              icon={iconNode}
            />
          );
        }

        return (
          <DesktopItem
            {...commonProps}
            href={s.url}
            icon={<LinkIcon className="h-10 w-10 text-[#6b7280]" />}
          />
        );
      })}

      {showAbout && (
        <AboutMeWindow open={showAbout} onClose={() => setShowAbout(false)} />
      )}

      {webView.open && (
        <WebViewWindow
          open={webView.open}
          url={webView.url}
          title={webView.title}
          onClose={() => setWebView({ open: false, url: '', title: '' })}
        />
      )}
    </>
  );
}