'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LandingPage() {
  const [stage, setStage] = useState('logo-only'); // stages: logo-only, text-only

  useEffect(() => {
    // Show logo for 3 seconds, then switch to the final text branding
    const timer = setTimeout(() => {
      setStage('text-only');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center select-none overflow-hidden p-4 relative text-center">
      
      {/* STAGE 1: LOGO WITH FADE-IN ANIMATION */}
      {stage === 'logo-only' && (
        <div className="animate-in fade-in duration-[2000ms] ease-out">
          <Image 
            src="/logoeval.png" 
            alt="E Logo"
            width={160} 
            height={160} 
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      )}

      {/* STAGE 2: THE REVEAL (EVALS + THE FUTURE in Gray) */}
      {stage === 'text-only' && (
        <div className="flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter italic leading-none">
            EVALS
          </h1>
          
          <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[1.4em] mt-8 ml-6 transition-all opacity-80">
            THE FUTURE
          </p>
        </div>
      )}

    </div>
  );
}