"use client";

import React from "react";

export const ResumeLink: React.FC = () => {
  const handleClick = async () => {
    try {
      const res = await fetch("/Section%20Header/Resume.url.json", { cache: "no-store" });
      const data = await res.json();
      const url: string | undefined = data?.url;
      const target = url || "https://drive.google.com/file/d/1vX47lRo0Cgpu4I-8LjZaOn2SIUgCq9fI/view?usp=sharing";
      window.open(target, "_blank", "noopener,noreferrer");
    } catch {
      window.open("https://drive.google.com/file/d/1vX47lRo0Cgpu4I-8LjZaOn2SIUgCq9fI/view?usp=sharing", "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button type="button" onClick={handleClick} className="hover:underline">
      Resume
    </button>
  );
};