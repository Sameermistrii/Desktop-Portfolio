"use client";

import React, { useEffect, useRef, useState } from "react";

interface DraggableNoteProps {
  children: React.ReactNode;
}

// Draggable wrapper that resets to its initial top/left on refresh
export const DraggableNote: React.FC<DraggableNoteProps> = ({ children }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 }); // pointer start
  const originRef = useRef({ x: 0, y: 0 }); // position at drag start

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;
      const point = "touches" in e ? e.touches[0] : (e as MouseEvent);
      const dx = point.clientX - startRef.current.x;
      const dy = point.clientY - startRef.current.y;

      // Optional soft bounds within viewport (keeps note roughly in view)
      const nextX = originRef.current.x + dx;
      const nextY = originRef.current.y + dy;
      setPos({ x: nextX, y: nextY });
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
    const point = "touches" in e ? e.touches[0] : (e as React.MouseEvent);
    draggingRef.current = true;
    startRef.current = { x: point.clientX, y: point.clientY };
    originRef.current = { x: pos.x, y: pos.y };
  };

  return (
    <div
      className="absolute top-[80px] left-[60px] z-20 cursor-grab active:cursor-grabbing touch-none"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      onMouseDown={handleDown}
      onTouchStart={handleDown}
    >
      {children}
    </div>
  );
};

export default DraggableNote;