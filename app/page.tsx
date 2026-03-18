'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

// ==========================================
// 1. PREMIUM INTERACTIVE COMPONENTS
// ==========================================

// Magnetic Hover Button (NYC/Brutalist Style)
const MagneticButton = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.2);
    y.set(middleY * 0.2);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: smoothX, y: smoothY }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
    </motion.button>
  );
};

// Cinematic Text Reveal
const FadeText = ({ text }: { text: string }) => {
  const words = text.split(" ");
  return (
    <span className="inline-block">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// Scroll-Revealed Architecture Node
const ArchNode = ({ title, desc, icon, index, scrollProgress, triggerPoint, side }: any) => {
  const isActive = useTransform(scrollProgress, (v: number) => v >= triggerPoint);
  const opacity = useTransform(scrollProgress, [triggerPoint - 0.1, triggerPoint], [0.2, 1]);
  const yOffset = useTransform(scrollProgress, [triggerPoint - 0.1, triggerPoint], [20, 0]);
  const glowOpacity = useTransform(scrollProgress, [triggerPoint - 0.05, triggerPoint], [0, 1]);

  return (
    <div className={`relative flex w-full items-center ${side === 'left' ? 'justify-start' : 'justify-end'} z-10 md:px-12`}>
      <motion.div 
        style={{ scaleX: isActive as any, transformOrigin: side === 'left' ? 'right' : 'left' }}
        className={`hidden md:block absolute top-1/2 w-[10%] h-[1px] bg-white/30 z-0 ${side === 'left' ? 'right-[50%]' : 'left-[50%]'}`}
      />
      <motion.div style={{ opacity, y: yOffset }} className={`relative flex flex-col md:flex-row items-center gap-6 w-full md:w-[45%] ${side === 'left' ? 'md:flex-row-reverse text-center md:text-right' : 'text-center md:text-left'}`}>
        <div className="relative">
          <motion.div style={{ opacity: glowOpacity }} className="absolute inset-0 rounded-2xl bg-white/10 blur-xl transition-all duration-500" />
          <div className="w-16 h-16 rounded-2xl border border-white/10 bg-[#050505] flex items-center justify-center relative z-20 shadow-2xl">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
              <path d={icon}></path>
            </svg>
          </div>
        </div>
        <div className="bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex-1 shadow-2xl hover:bg-white/[0.02] transition-colors">
          <div className="text-[9px] font-bold tracking-[0.3em] text-zinc-500 uppercase mb-2">Module 0{index}</div>
          <h4 className="text-lg font-bold tracking-tight text-white mb-2">{title}</h4>
          <p className="text-xs font-light text-zinc-400 leading-relaxed">{desc}</p>
        </div>
      </motion.div>
    </div>
  );
};

// ==========================================
// 2. MAIN PAGE COMPONENT
// ==========================================

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const workflowRef = useRef<HTMLDivElement>(null);
  
  // Advanced Global Scroll
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const smoothY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Hero Parallax & Blur
  const heroY = useTransform(smoothY, [0, 0.4], [0, 100]);
  const heroOpacity = useTransform(smoothY, [0, 0.3], [1, 0]);
  const heroScale = useTransform(smoothY, [0, 0.3], [1, 0.95]);
  const heroBlur = useTransform(smoothY, [0, 0.3], ["blur(0px)", "blur(10px)"]);

  // Pipeline Laser Scroll
  const { scrollYProgress: lineProgress } = useScroll({
    target: workflowRef,
    offset: ["start 60%", "end 95%"] 
  });
  const smoothLine = useSpring(lineProgress, { stiffness: 60, damping: 20 });

  // Final Energy Transfer
  const finalGlowOpacity = useTransform(smoothLine, [0.85, 1], [0, 1]);
  const finalTextOpacity = useTransform(smoothLine, [0.85, 1], [0.03, 1]);
  const finalScale = useTransform(smoothLine, [0.85, 1], [0.95, 1]);

  const premiumEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#000000] text-zinc-100 selection:bg-white selection:text-black font-sans overflow-x-hidden relative">
      
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex justify-center bg-black">
        <div className="absolute top-[-20%] w-[120vw] h-[70vh] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08)_0%,transparent_70%)] blur-[50px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-screen" />
      </div>

      {/* --- NAVBAR --- */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: premiumEase }}
        className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 pointer-events-none"
      >
        <div className="flex items-center gap-3 pointer-events-auto cursor-pointer">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-white translate-y-[1px]">
            <path d="M0 12 A 12 12 0 0 1 24 12 Z"/>
          </svg>
          <span className="font-black italic tracking-tighter uppercase text-lg drop-shadow-lg text-white mt-[2px]">EvalsHQ</span>
        </div>
        <div className="pointer-events-auto flex gap-6 items-center">
          <button className="text-[10px] font-bold tracking-widest uppercase bg-transparent text-white px-5 py-2.5 rounded-full hover:bg-white hover:text-black transition-all duration-300 border border-white/20 backdrop-blur-md">
            Developer Docs
          </button>
        </div>
      </motion.nav>

      <main className="relative z-10 flex flex-col items-center w-full max-w-7xl mx-auto pt-24">
        
        {/* --- 1. HERO SECTION --- */}
        <motion.div style={{ opacity: heroOpacity, y: heroY, scale: heroScale, filter: heroBlur }} className="flex flex-col items-center text-center px-4 w-full max-w-5xl min-h-[85vh] justify-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: premiumEase }} className="mb-8 inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
             <span className="flex h-1.5 w-1.5 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span></span>
             <span className="text-[9px] font-bold tracking-[0.3em] text-white uppercase">Simulation Engine V0.5</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20, filter: "blur(20px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1.4, delay: 0.1, ease: premiumEase }} className="text-6xl sm:text-7xl md:text-[8.5rem] font-medium tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-600 pb-2">
            Simulate the <br /> agentic era.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1.4, delay: 0.3, ease: premiumEase }} className="mt-8 max-w-2xl text-lg md:text-xl text-zinc-400 font-light leading-relaxed tracking-wide">
            The deterministic sandbox for enterprise AI. Run high-fidelity, multi-turn simulations inside your CI/CD pipeline to validate agent logic at scale.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: premiumEase }} className="mt-14 flex flex-col items-center gap-6">
            <MagneticButton className="px-12 py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-none group hover:scale-105 transition-transform duration-300">
               <span className="relative z-10 flex items-center gap-3">
                 Launching Soon
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
               </span>
               <div className="absolute inset-0 bg-zinc-200 scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-300 ease-in-out z-0" />
            </MagneticButton>
            <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500 uppercase tracking-widest opacity-60">
              <span className="animate-pulse">_</span><span>SYSTEM READY // AWAITING WEBHOOK TARGET</span>
            </div>
          </motion.div>
        </motion.div>

        {/* --- 2. SOCIAL PROOF (HYPE STRIP) --- */}
        <motion.div 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }}
          className="w-full border-y border-white/5 py-10 overflow-hidden flex flex-col items-center justify-center bg-white/[0.01]"
        >
          <p className="text-[9px] font-bold tracking-[0.4em] text-zinc-500 uppercase mb-6">Securing Autonomous Agents At</p>
          <div className="flex gap-12 md:gap-24 opacity-40 grayscale items-center justify-center flex-wrap px-4">
             <span className="text-xl font-black tracking-tighter">VERTEX</span>
             <span className="text-xl font-medium tracking-widest">NEXUS_</span>
             <span className="text-xl font-black italic">AEROSPACE</span>
             <span className="text-xl font-bold font-mono">FIN/TECH</span>
          </div>
        </motion.div>

        {/* --- 3. 3D DASHBOARD PREVIEW --- */}
        <div className="w-full px-4 mt-32 relative z-20" style={{ perspective: '1000px' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-zinc-500/10 blur-[100px] rounded-full pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, rotateX: 15, y: 100 }} whileInView={{ opacity: 1, rotateX: 0, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.2, ease: premiumEase }}
            className="w-full max-w-5xl mx-auto rounded-xl border border-white/10 bg-[#050505]/80 backdrop-blur-2xl shadow-[0_0_80px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col h-[500px]"
          >
             <div className="h-14 border-b border-white/5 bg-white/[0.02] flex items-center px-6 justify-between">
                <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-zinc-800" /><div className="w-3 h-3 rounded-full bg-zinc-800" /><div className="w-3 h-3 rounded-full bg-zinc-800" /></div>
             </div>
             <div className="flex flex-1 overflow-hidden">
                <div className="w-64 border-r border-white/5 p-6 hidden md:flex flex-col gap-6 bg-black">
                  <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mb-4">Simulation</p>
                  <p className="text-xs text-zinc-100 p-2 bg-white/5 rounded">❖ Live Trace</p>
                </div>
                <div className="flex-1 p-8 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.02)_0%,transparent_50%)]">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white">Live Heist Simulation</h3>
                    <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded">Target: Production_Bot</span>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-black p-6 font-mono text-xs text-zinc-500 space-y-3 h-64 overflow-hidden relative">
                    <p className="text-zinc-400">▲ evalshq run --target webhook</p>
                    <p>{`[00:00:01]`} Mapping conversational graph...</p>
                    <p className="text-emerald-400">{'[00:00:03]'} Vector 01: Prompt Injection [DEFLECTED]</p>
                    <p className="text-rose-400 font-bold">{'[00:00:04]'} Vector 02: Refund Logic Bypass [VULNERABILITY DETECTED]</p>
                    <p className="text-zinc-500 border-t border-white/5 pt-2 mt-2">⨯ Execution halted. Awaiting developer patch.</p>
                  </div>
                </div>
             </div>
          </motion.div>
        </div>

        {/* --- 4. ZERO-FRICTION WEBHOOK INGESTION --- */}
        <div className="w-full px-4 max-w-6xl mx-auto py-32 mt-20 border-b border-white/5">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="flex-1 space-y-6">
              <h3 className="text-4xl font-bold tracking-tighter text-white">
                <FadeText text="Zero-friction ingestion." />
              </h3>
              <p className="text-zinc-400 font-light leading-relaxed">No SDKs to install. No source code required. Just point our simulation engine to your agent's webhook URL, and we automatically map its psychological boundaries.</p>
              <ul className="space-y-4 mt-8 text-sm text-zinc-300 font-light">
                <li className="flex items-center gap-3"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Works universally across any API structure.</li>
                <li className="flex items-center gap-3"><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Instant stateful reconnaissance.</li>
              </ul>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
              <div className="relative p-8 bg-[#0a0a0a] rounded-xl border border-white/10 shadow-2xl">
                <p className="text-[10px] tracking-[0.2em] text-zinc-500 font-bold uppercase mb-4">New Simulation Target</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-mono text-zinc-400 mb-2 block">Agent Webhook URL</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 bg-black border border-white/10 rounded-sm px-4 py-3 font-mono text-xs text-zinc-300 flex items-center shadow-inner">
                        <span className="text-zinc-600 mr-3">POST</span> https://api.corp.com/v1/agent
                      </div>
                      <button className="bg-white text-black font-bold px-6 py-3 rounded-sm text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-colors shrink-0">
                        Map Logic
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/5 flex items-start gap-3">
                    <div className="w-2 h-2 mt-1 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                    <div>
                      <p className="text-xs text-white font-medium mb-1">Target Acquired</p>
                      <p className="text-[10px] text-zinc-500 font-mono">3 endpoints discovered. Ready for adversarial load.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* --- 5. NEW: BENCHMARK MATRIX (EVALSHQ VS REST) --- */}
        <div className="w-full px-4 max-w-6xl mx-auto py-32 border-b border-white/5">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">
              <FadeText text="Mathematical validation." />
            </h3>
            <p className="text-zinc-500 font-light text-lg">Stop relying on vibes. Upgrade to deterministic infrastructure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 rounded-2xl border border-white/5 bg-[#030303] opacity-60">
              <div className="text-rose-500 font-mono text-xs mb-6 uppercase tracking-widest">Legacy Testing</div>
              <ul className="space-y-6">
                <li className="flex flex-col gap-1"><span className="text-white font-medium">Single-Turn Pings</span><span className="text-zinc-500 text-sm font-light">Cannot remember past context or state.</span></li>
                <li className="flex flex-col gap-1"><span className="text-white font-medium">"LLM-as-a-Judge"</span><span className="text-zinc-500 text-sm font-light">Vibes-based grading. Subject to its own hallucinations.</span></li>
                <li className="flex flex-col gap-1"><span className="text-white font-medium">Manual Scripts</span><span className="text-zinc-500 text-sm font-light">Requires constant engineering upkeep.</span></li>
              </ul>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 rounded-2xl border border-white/20 bg-[#0a0a0a] shadow-[0_0_40px_rgba(255,255,255,0.05)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full pointer-events-none" />
              <div className="text-white font-mono text-xs mb-6 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> EvalsHQ Engine
              </div>
              <ul className="space-y-6 relative z-10">
                <li className="flex flex-col gap-1"><span className="text-white font-bold">Stateful Conversational Graphs</span><span className="text-zinc-400 text-sm font-light">Adopts personas and executes multi-turn memory heists.</span></li>
                <li className="flex flex-col gap-1"><span className="text-white font-bold">Hybrid Deterministic Logic</span><span className="text-zinc-400 text-sm font-light">Hardcoded Regex, Latency limits, and fast NLI verification.</span></li>
                <li className="flex flex-col gap-1"><span className="text-white font-bold">CI/CD Pipeline Enforcer</span><span className="text-zinc-400 text-sm font-light">Blocks bad deployments directly in GitHub Actions.</span></li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* --- 6. THE BENTO GRID FEATURES --- */}
        <div className="w-full px-4 max-w-6xl mx-auto py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-2 bg-[#050505] border border-white/10 rounded-2xl p-10 hover:border-white/20 transition-colors">
              <h4 className="text-xl font-bold text-white mb-3">Stateful Conversational Memory</h4>
              <p className="text-zinc-400 font-light text-sm max-w-md leading-relaxed">Unlike simple API pingers, our engine maintains context over hundreds of turns. We adopt dynamic personas to trick your agent's state memory.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-[#050505] border border-white/10 rounded-2xl p-10 hover:border-white/20 transition-colors">
              <h4 className="text-xl font-bold text-white mb-3">Regex Data Shields</h4>
              <p className="text-zinc-400 font-light text-sm leading-relaxed">Hardcoded verification to ensure PII and credit cards never leak.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-[#050505] border border-white/10 rounded-2xl p-10 hover:border-white/20 transition-colors">
              <h4 className="text-xl font-bold text-white mb-3">Latency Stress Mapping</h4>
              <p className="text-zinc-400 font-light text-sm leading-relaxed">Identify massive compute spikes before they balloon your cloud infrastructure bill.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="md:col-span-2 bg-[#050505] border border-white/10 rounded-2xl p-10 hover:border-white/20 transition-colors">
              <h4 className="text-xl font-bold text-white mb-3">CI/CD Pipeline Enforcer</h4>
              <p className="text-zinc-400 font-light text-sm max-w-md leading-relaxed">EvalsHQ runs directly inside your GitHub Actions. If a new prompt update causes your agent to fail the adversarial suite, the PR is automatically blocked.</p>
            </motion.div>
          </div>
        </div>

        {/* --- 7. SCROLL-DRAWN ARCHITECTURE PIPELINE (THE FINALE) --- */}
        <div className="w-full px-4 max-w-6xl mx-auto py-20 relative mt-10">
          
          <div className="text-center space-y-4 mb-32 relative z-10 pt-20">
            <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">
               <FadeText text="The deterministic pipeline." />
            </h3>
            <p className="text-zinc-500 font-light text-lg max-w-xl mx-auto">Follow the data flow from ingestion to strict validation.</p>
          </div>

          <div ref={workflowRef} className="relative w-full flex flex-col items-center gap-24 md:gap-32 py-10 pb-20">
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] border-l border-dashed border-white/10 -translate-x-1/2 z-0" />
            
            <motion.div 
              style={{ scaleY: smoothLine }}
              className="absolute left-1/2 top-0 bottom-0 w-[2px] rounded-full bg-gradient-to-b from-white/0 via-white to-white -translate-x-1/2 origin-top shadow-[0_0_15px_rgba(255,255,255,1)] z-0"
            />
            <motion.div 
              style={{ top: useTransform(smoothLine, [0, 1], ["0%", "100%"]) }}
              className="absolute left-1/2 -translate-x-1/2 w-2 h-10 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,1)] z-10 blur-[1px]"
            />

            <ArchNode index={1} side="left" title="Webhook Ingestion" desc="We connect directly to your agent's API endpoint. Map the system instructions and capabilities automatically." icon="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" scrollProgress={smoothLine} triggerPoint={0.1} />
            <ArchNode index={2} side="right" title="Stateful Simulation" desc="Execution of multi-turn conversational trees. We simulate complex user behaviors to test agent state logic over time." icon="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" scrollProgress={smoothLine} triggerPoint={0.35} />
            <ArchNode index={3} side="left" title="Logic Validation" desc="Deterministic evaluation. We run strict logic gates and fast NLI models to mathematically verify the execution paths." icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" scrollProgress={smoothLine} triggerPoint={0.6} />

            <motion.div style={{ opacity: useTransform(smoothLine, [0.75, 0.85], [0, 1]), y: useTransform(smoothLine, [0.75, 0.85], [50, 0]) }} className="w-full max-w-4xl mt-10 p-8 md:p-12 rounded-3xl border border-white/10 bg-[#050505] shadow-[0_0_50px_rgba(255,255,255,0.05)] relative z-20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.5)]"><div className="w-3 h-3 bg-white rounded-full animate-pulse" /></div>
              <h4 className="text-center text-[10px] font-bold tracking-[0.4em] text-white uppercase mb-8">Simulation Telemetry Active</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[{ label: "SCENARIOS", val: "14,092" }, { label: "AVG EXECUTION", val: "42ms" }, { label: "EDGE CASES", val: "84" }, { label: "RELIABILITY", val: "99.9%" }].map((stat, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl text-center hover:bg-white/10 transition-colors">
                    <p className="text-[9px] text-zinc-400 tracking-widest font-bold mb-2">{stat.label}</p>
                    <p className="text-xl font-medium text-white">{stat.val}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* --- 8. PRE-FOOTER CTA & FINAL ENERGY TRANSFER --- */}
            <div className="mt-40 w-full text-center relative flex flex-col items-center z-20 pt-10">
              
              {/* Massive Pre-Footer CTA */}
              <motion.div style={{ opacity: finalGlowOpacity }} className="mb-20 space-y-8 flex flex-col items-center">
                <h2 className="text-4xl md:text-6xl font-medium tracking-tighter text-white">Deploy with certainty.</h2>
                <MagneticButton className="px-12 py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-none group hover:scale-105 transition-transform duration-300">
                  <span className="relative z-10 flex items-center gap-3">
                    Get Early Access
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                  <div className="absolute inset-0 bg-zinc-200 scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-300 ease-in-out z-0" />
                </MagneticButton>
              </motion.div>

              <motion.div style={{ opacity: finalGlowOpacity }} className="absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vh] bg-white/10 blur-[150px] rounded-full pointer-events-none" />
              <motion.h1 style={{ opacity: finalTextOpacity, scale: finalScale }} className="text-[15vw] md:text-[18vw] font-black italic tracking-tighter leading-none select-none text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.8)] mt-10">
                EVALSHQ
              </motion.h1>
              <motion.div style={{ opacity: finalGlowOpacity }} className="flex gap-6 mt-10 text-[10px] tracking-widest text-zinc-400 uppercase font-bold">
                <span>© 2026 EvalsHQ.System</span>
                <span className="hover:text-white transition-colors cursor-pointer">Audit Ledger</span>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}