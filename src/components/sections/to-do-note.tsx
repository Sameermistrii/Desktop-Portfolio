"use client";

import React, { useEffect, useState } from 'react';

const ToDoNote = () => {
  // Defaults (used until public/to-do/note.json loads or if it fails)
  const fallbackTitle = 'To do:';
  const fallbackItems = [
    { text: 'Land my dream UX job', done: false },
    { text: 'Drink water', done: false },
    { text: 'Move to the US', done: true },
    { text: 'Finish grad school without losing my mind', done: false },
    { text: 'Build that banger spotify playlist', done: false },
    { text: 'World domination', done: false },
    { text: 'Get really good at making pasta ', done: true },
    { text: 'Travel somewhere new every year', done: false },
  ];

  const [title, setTitle] = useState<string>(fallbackTitle);
  const [items, setItems] = useState<{ text: string; done: boolean }[]>(fallbackItems);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/to-do/note.json', { cache: 'no-store' });
        if (!res.ok) return;
        const data: { title?: string; items?: { text: string; done: boolean }[] } = await res.json();
        if (!active) return;
        if (Array.isArray(data.items) && data.items.length) setItems(data.items);
        if (typeof data.title === 'string' && data.title.trim()) setTitle(data.title.trim());
      } catch {}
    })();
    return () => { active = false; };
  }, []);

  return (
    <div
      className="bg-post-it-yellow shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-[260px] h-[220px] md:w-[280px] md:h-[220px] p-4 -rotate-2 select-none
                 transition-transform duration-300 ease-out hover:-translate-y-1 hover:translate-x-1 hover:rotate-1 hover:scale-[1.02] will-change-transform"
    >
      <div className="flex flex-col gap-2">
        <div>
          <p className="to-do-text font-bold">{title}</p>
        </div>
        <div>
          {items.map((item, index) => (
            <p
              key={index}
              className={`to-do-text ${item.done ? 'line-through' : ''}`}
            >
              {item.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToDoNote;