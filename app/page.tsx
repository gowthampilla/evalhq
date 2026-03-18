'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LandingPage() {
  const [stage, setStage] = useState<'logo' | 'brand'>('logo');

  useEffect(() => {
    // Fades from the logo to the brand name after 3 seconds
    const timer = setTimeout(() => setStage('brand'), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center select-none p-4 text-center font-sans overflow-hidden">
      
      {/* 1. CINEMATIC LOGO FADE */}
      {stage === 'logo' && (
        <div className="animate-in fade-in duration-[2000ms] ease-out exit-out fade-out">
          <Image 
            src="/logoeval.png" 
            alt="Logo" 
            width={160} 
            height={160} 
            unoptimized 
            priority 
          />
        </div>
      )}

      {/* 2. PURE BRAND REVEAL (Just the Name) */}
      {stage === 'brand' && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <h1 className="text-7xl md:text-9xl font-black text-white italic tracking-tighter">
            EVALS
          </h1>
          <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[1.4em] mt-8 opacity-80">
            THE FUTURE
          </p>
        </div>
      )}

    </div>
  );
}
