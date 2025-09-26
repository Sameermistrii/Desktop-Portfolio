import React from 'react';
import GlitchText from '@/components/effects/glitch-text';

const MainContentArea = () => {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"
        aria-hidden="true"
      />
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div className="text-center">
          <GlitchText
            speed={1}
            enableShadows={true}
            enableOnHover={true}
            className="font-black tracking-tight"
          >
            welcome to my portfolio
          </GlitchText>
        </div>
      </div>
    </main>
  );
};

export default MainContentArea;