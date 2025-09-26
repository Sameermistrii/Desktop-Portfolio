"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ProjectsWindow } from '@/components/windows/projects-window';

// Replace hardcoded className positions with numeric positions for drag control
const initialFolders = [
  {
    name: "Project 02",
    top: 220,
    right: 120,
    w: 135,
    h: 83,
    imageUrl: 'https://framerusercontent.com/images/stLcXmD5BBe1RLsQJ8fbc29YAQQ.png'
  },
  {
    name: "Project 01",
    top: 360,
    right: 165,
    w: 210,
    h: 150,
    imageUrl: 'https://framerusercontent.com/images/stLcXmD5BBe1RLsQJ8fbc29YAQQ.png'
  },
  {
    name: "Project 03",
    top: 500,
    right: 140,
    w: 129,
    h: 83,
    imageUrl: 'https://framerusercontent.com/images/stLcXmD5BBe1RLsQJ8fbc29YAQQ.png'
  },
  {
    name: "Project 04",
    top: 110,
    right: 180,
    w: 133,
    h: 83,
    imageUrl: 'https://framerusercontent.com/images/stLcXmD5BBe1RLsQJ8fbc29YAQQ.png'
  }
] as const;

const FolderItem = ({ name, imageUrl, onClick }: {name: string;imageUrl: string;onClick?: () => void;}) =>
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    className="relative flex flex-col items-center justify-start w-full h-full p-1 rounded-[4px] hover:bg-folder-blue/20 cursor-pointer group">

      <Image
        src={imageUrl}
        alt={`Folder icon for ${name}`}
        width={64}
        height={64}
        className="relative z-10 transition-transform duration-200 ease-in-out group-hover:scale-105 !w-[79px] !h-[69px] !max-w-[79px]" />

      <p className="desktop-label text-center text-text-primary mt-[5px]">
        {name}
      </p>
  </div>;

export default function ProjectFolders() {
  // fetched projects from API
  const [projects, setProjects] = useState<{ name: string; files: { name: string; url: string }[] }[]>([]);
  const [openProject, setOpenProject] = useState<{ name: string; files: { name: string; url: string }[] } | null>(null);
  const [positions, setPositions] = useState<Record<string, { top: number; right: number }>>(
    () => Object.fromEntries(initialFolders.map(f => [f.name, { top: f.top, right: f.right }]))
  );

  // Fetch projects from API (reflects public folder names/files)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) return;
        const data: { projects: { name: string; files: { name: string; url: string }[] }[] } = await res.json();
        if (active) setProjects(data.projects || []);
      } catch {}
    })();
    return () => { active = false; };
  }, []);

  // No persistence: positions reset to defaults on every refresh

  // Drag state
  const dragRef = useRef<{ name: string | null; startX: number; startY: number; startTop: number; startRight: number }>({
    name: null,
    startX: 0,
    startY: 0,
    startTop: 0,
    startRight: 0,
  });

  const onFolderMouseDown = (e: React.MouseEvent, name: string) => {
    e.preventDefault();
    const pos = positions[name] || { top: 200, right: 120 };
    const startX = e.clientX;
    const startY = e.clientY;
    const startTop = pos.top;
    const startRight = pos.right;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      setPositions(prev => ({
        ...prev,
        [name]: {
          top: Math.max(60, startTop + dy),
          right: Math.max(0, startRight - dx),
        },
      }));
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // Ensure folders are always within viewport (avoid hiding behind dock or off-screen)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const clampAll = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const maxTop = Math.max(60, viewportHeight - 180); // keep above dock area
      const maxRight = Math.max(0, viewportWidth - 120); // keep within right bound

      setPositions(prev => {
        const next: typeof prev = { ...prev };
        for (const key of Object.keys(next)) {
          const p = next[key];
          next[key] = {
            top: Math.min(Math.max(60, p.top), maxTop),
            right: Math.min(Math.max(0, p.right), maxRight),
          };
        }
        return next;
      });
    };

    clampAll();
    window.addEventListener('resize', clampAll);
    return () => window.removeEventListener('resize', clampAll);
  }, []);

  // Build rendered folder list using fetched projects; fall back to initial folder names if API empty
  const nameToBase = Object.fromEntries(initialFolders.map(f => [f.name.trim().toLowerCase(), f]));
  const defaultBase = { top: 220, right: 120, w: 135, h: 83, imageUrl: initialFolders[0].imageUrl } as const;

  const rendered = (projects.length
    ? projects.map((proj) => {
        const cleanName = proj.name.trim();
        const base = nameToBase[cleanName.toLowerCase()] || defaultBase;
        const key = cleanName;
        const pos = positions[key] || { top: base.top, right: base.right };
        return { key, displayName: cleanName, files: proj.files, w: base.w, h: base.h, imageUrl: base.imageUrl, pos };
      })
    : initialFolders.map(f => ({ key: f.name, displayName: f.name, files: [] as {name:string;url:string}[], w: f.w, h: f.h, imageUrl: f.imageUrl, pos: { top: f.top, right: f.right } }))
  );

  return (
    <>

      {rendered.map((folder) => (
        <div
          key={folder.key}
          className={`absolute`}
          style={{ top: folder.pos.top, right: folder.pos.right, width: folder.w, height: folder.h }}
          onMouseDown={(e) => onFolderMouseDown(e, folder.displayName)}
        >
          <FolderItem
            name={folder.displayName}
            imageUrl={folder.imageUrl}
            onClick={() => {
              setOpenProject({ name: folder.displayName, files: folder.files });
            }}
          />
        </div>
      ))}

      {openProject &&
        <ProjectsWindow
          open={!!openProject}
          onClose={() => setOpenProject(null)}
          project={openProject}
          allProjectNames={rendered.map(r => r.displayName)}
          allProjects={rendered.map(r => ({ name: r.displayName, files: r.files }))}
        />
      }
    </>
  );
}