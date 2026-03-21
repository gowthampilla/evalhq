'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ==========================================
// 1. ELITE RESEARCH PRELOADER
// ==========================================
const DeepMindPreloader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] bg-[#000000] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      <div className="flex flex-col items-center gap-6 relative z-10">
        <motion.div 
          initial={{ width: 0 }} animate={{ width: 150 }} transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="h-[1px] bg-white/50 relative overflow-hidden"
        >
          <motion.div 
            animate={{ x: [-50, 150] }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="absolute top-0 left-0 h-full w-10 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          />
        </motion.div>
        <motion.span 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="font-mono text-[9px] tracking-[0.4em] text-zinc-500 uppercase"
        >
          EvalsHQ Starting
        </motion.span>
      </div>
    </motion.div>
  );
};

// ==========================================
// 2. DESCENDING ATOM MATRIX
// ==========================================
const DescendingAtoms = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let atoms: Atom[] = [];
    let mouse = { x: -1000, y: -1000, radius: 150 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initAtoms();
    };

    class Atom {
      x: number; y: number; vx: number; vy: number; baseRadius: number;
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.2; 
        this.vy = Math.random() * 0.6 + 0.1;   
        this.baseRadius = Math.random() * 1.2 + 0.3;
      }
      update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.vx -= (dx / distance) * force * 0.3;
          this.vy -= (dy / distance) * force * 0.3;
        }

        this.vx *= 0.96;
        if (this.vy < 0.1) this.vy += 0.02;
        if (this.vy > 1.0) this.vy *= 0.96;

        this.x += this.vx; 
        this.y += this.vy;

        if (this.y > canvas!.height) {
          this.y = -10;
          this.x = Math.random() * canvas!.width;
        }
        if (this.x > canvas!.width) this.x = 0;
        if (this.x < 0) this.x = canvas!.width;
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
      }
    }

    const initAtoms = () => {
      atoms = [];
      const area = canvas!.width * canvas!.height;
      const numberOfAtoms = Math.min(Math.floor(area / 18000), 100); 
      for (let i = 0; i < numberOfAtoms; i++) atoms.push(new Atom());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      
      for (let i = 0; i < atoms.length; i++) {
        atoms[i].update();
        atoms[i].draw();
        
        for (let j = i + 1; j < atoms.length; j++) {
          const dx = atoms[i].x - atoms[j].x;
          const dy = atoms[i].y - atoms[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 90) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - distance / 900})`;
            ctx.lineWidth = 0.4;
            ctx.moveTo(atoms[i].x, atoms[i].y);
            ctx.lineTo(atoms[j].x, atoms[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseout', () => { mouse.x = -1000; mouse.y = -1000; });

    resize(); animate();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" />;
};

// ==========================================
// 3. ULTRA-PREMIUM COMPONENTS
// ==========================================

const EliteTextReveal = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  return (
    <span className="inline-block overflow-hidden pb-2">
      <motion.span
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </span>
  );
};

const EliteCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`relative rounded-2xl bg-[#050505] overflow-hidden border border-white/[0.08] transition-colors duration-500 hover:border-white/[0.15] ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative z-10 p-10 md:p-14 h-full flex flex-col">{children}</div>
    </div>
  );
};

const CodeWindow = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto rounded-xl border border-white/10 bg-[#050505] shadow-2xl overflow-hidden"
    >
      <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-white/[0.01]">
        <div className="flex gap-2"><div className="w-2.5 h-2.5 rounded-full bg-white/20" /><div className="w-2.5 h-2.5 rounded-full bg-white/20" /><div className="w-2.5 h-2.5 rounded-full bg-white/20" /></div>
        <div className="text-[9px] font-mono text-zinc-500 tracking-widest uppercase">test_agent.py</div>
        <div className="w-10"></div>
      </div>
      <div className="p-8 font-mono text-[13px] leading-loose overflow-x-auto text-left">
        <p><span className="text-purple-400">import</span> <span className="text-zinc-300">evalshq</span></p>
        <p><span className="text-purple-400">from</span> <span className="text-zinc-300">evalshq.environments</span> <span className="text-purple-400">import</span> <span className="text-amber-200">HIGH_STAKES_BANK</span></p>
        <br />
        <p className="text-zinc-600"># 1. Point the engine to your local agent webhook</p>
        <p><span className="text-blue-400">report</span> <span className="text-zinc-400">=</span> <span className="text-zinc-300">evalshq.run(</span></p>
        <p className="pl-8"><span className="text-zinc-400">target=</span><span className="text-emerald-300">"http://localhost:5000/webhook"</span><span className="text-zinc-400">,</span></p>
        <p className="pl-8"><span className="text-zinc-400">environment=</span><span className="text-amber-200">HIGH_STAKES_BANK</span><span className="text-zinc-400">,</span></p>
        <p className="pl-8"><span className="text-zinc-400">chaos_factor=</span><span className="text-rose-300">1.0</span> <span className="text-zinc-600"># Maximum adversarial stress</span></p>
        <p><span className="text-zinc-300">)</span></p>
        <br />
        <p className="text-zinc-600"># 2. Block the PR if the agent breaks the law</p>
        <p><span className="text-purple-400">if</span> <span className="text-blue-400">report</span><span className="text-zinc-300">.legal_risk</span> <span className="text-zinc-400">&gt;</span> <span className="text-rose-300">80</span><span className="text-zinc-300">:</span></p>
        <p className="pl-8"><span className="text-purple-400">raise</span> <span className="text-amber-200">SystemExit</span><span className="text-zinc-300">(</span><span className="text-emerald-300">"Agent failed compliance simulation."</span><span className="text-zinc-300">)</span></p>
      </div>
    </motion.div>
  );
};

const TypingTerminal = () => {
  const lines = [
    { text: "▲ evalshq.run(context='High-Stakes Bank', chaos=1.0)", color: "text-zinc-500", delay: 0 },
    { text: "--- ⏱️ ACT 09 ---", color: "text-zinc-300", delay: 1 },
    { text: "🌍 World Engine: The terminated employee has leaked data to the press.", color: "text-zinc-400", delay: 2 },
    { text: "🤖 Target Agent: [ACTION: IGNORE] 'Do not engage with rumors.'", color: "text-zinc-400", delay: 3.5 },
    { text: "📊 Social Physics -> Morale: 25 | Risk: 85", color: "text-rose-400 font-medium", delay: 5 },
    { text: "--- ⏱️ ACT 10 ---", color: "text-zinc-300", delay: 6 },
    { text: "💀 FATAL SYSTEM COLLAPSE. AGENT BROKEN.", color: "text-rose-500 font-medium", delay: 7.5 },
    { text: "🧐 Generating Supreme Audit Post-Mortem...", color: "text-zinc-500", delay: 9 },
    { text: "█ Grade: F. Rationale: Agent failed to mitigate severe legal liability.", color: "text-black bg-zinc-200 px-2 py-0.5 mt-1 inline-block font-medium", delay: 10.5 }
  ];

  return (
    <div className="font-mono text-[11px] leading-loose text-zinc-400 space-y-2 relative text-left">
      {lines.map((line, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 5 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ delay: line.delay * 0.4, duration: 0.3 }} className={line.color}>
          {line.text}
        </motion.div>
      ))}
      <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-3 bg-zinc-400 mt-2 inline-block" />
    </div>
  );
};

const ArchitectureNode = ({ title, desc, num, scrollProgress, triggerPoint, side }: any) => {
  const isActive = useTransform(scrollProgress, (v: number) => v >= triggerPoint);
  const opacity = useTransform(scrollProgress, [triggerPoint - 0.15, triggerPoint], [0.2, 1]);
  const yOffset = useTransform(scrollProgress, [triggerPoint - 0.15, triggerPoint], [40, 0]);

  return (
    <div className={`relative flex w-full items-center ${side === 'left' ? 'justify-start' : 'justify-end'} z-10 md:px-12`}>
      <motion.div style={{ scaleX: isActive as any, transformOrigin: side === 'left' ? 'right' : 'left' }} className={`hidden md:block absolute top-1/2 w-[15%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0 ${side === 'left' ? 'right-[50%]' : 'left-[50%]'}`} />
      
      <motion.div style={{ opacity, y: yOffset }} className={`relative flex flex-col md:flex-row items-center gap-10 w-full md:w-[40%] ${side === 'left' ? 'md:flex-row-reverse text-center md:text-right' : 'text-center md:text-left'}`}>
        <div className="text-[5rem] md:text-[6rem] font-light leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent select-none">
          0{num}
        </div>
        <div className="flex-1">
          <h4 className="text-xl md:text-2xl font-medium tracking-tight text-white mb-2">{title}</h4>
          <p className="text-sm font-light text-zinc-500 leading-relaxed">{desc}</p>
        </div>
      </motion.div>
    </div>
  );
};

// ==========================================
// 4. MAIN CONTENT WRAPPER
// ==========================================
const MainContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const workflowRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const smoothY = useSpring(scrollYProgress, { stiffness: 70, damping: 25, restDelta: 0.001 });
  
  const heroY = useTransform(smoothY, [0, 0.4], [0, 150]);
  const heroOpacity = useTransform(smoothY, [0, 0.3], [1, 0]);
  
  const { scrollYProgress: lineProgress } = useScroll({ target: workflowRef, offset: ["start 60%", "end 95%"] });
  const smoothLine = useSpring(lineProgress, { stiffness: 50, damping: 20 });

  const premiumEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 selection:bg-zinc-800 selection:text-white font-sans overflow-x-hidden relative">
      
      <DescendingAtoms />
      <div className="fixed inset-0 z-[1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none" />
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-white/[0.015] rounded-full blur-[150px] pointer-events-none z-0" />

      {/* --- NAV --- */}
      <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, ease: premiumEase }} className="fixed top-0 w-full z-50 flex justify-between items-center px-8 md:px-12 py-8 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto cursor-pointer" onClick={scrollToTop}>
          <div className="w-5 h-5 rounded-sm border border-white/40 flex items-center justify-center">
            <div className="w-2 h-2 bg-white" />
          </div>
          <span className="font-medium tracking-tight text-lg text-white mt-[2px]">evalshq</span>
        </div>
        <Link href="/docs" className="pointer-events-auto text-[10px] font-medium tracking-widest text-white px-5 py-2.5 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors duration-300 bg-black/50 backdrop-blur-md uppercase text-center block">
          Developer Docs
        </Link>
      </motion.nav>

      <main ref={containerRef} className="relative z-10 flex flex-col items-center w-full max-w-[85rem] mx-auto pt-48 md:pt-56">
        
        {/* --- HERO --- */}
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="flex flex-col items-center text-center px-4 w-full min-h-[70vh] relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1, ease: premiumEase }} className="mb-10 inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md">
             <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">Open Source Simulation Engine</span>
          </motion.div>

          <h1 className="text-[4rem] sm:text-[6rem] md:text-[8.5rem] font-medium tracking-tighter leading-[0.9] text-white pb-6 z-10 flex flex-col items-center drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <EliteTextReveal text="Simulate the" delay={0.2} />
            <EliteTextReveal text="agentic era." delay={0.3} />
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.5, ease: premiumEase }} className="mt-8 max-w-2xl text-lg md:text-xl text-zinc-500 font-light leading-relaxed tracking-wide z-10">
            The deterministic world-builder for enterprise AI. Validate your agent's ethics, morale impact, and corporate risk before production.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.7, ease: premiumEase }} className="mt-16 z-20">
            <button className="px-8 py-4 bg-white text-black font-medium text-sm rounded-full hover:bg-zinc-200 transition-colors duration-300 flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              pip install evalshq
            </button>
          </motion.div>
        </motion.div>

        {/* --- PROBLEM STATEMENT --- */}
        <div className="w-full px-4 max-w-5xl mx-auto py-24 md:py-40 relative z-20 text-center">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: premiumEase }} className="text-3xl md:text-5xl font-medium tracking-tight text-white leading-tight">
            Static benchmarks measure intelligence.<br/>
            <span className="text-zinc-500">EvalsHQ measures consequences.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2, ease: premiumEase }} className="mt-8 text-zinc-400 font-light text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Real-world AI doesn't fail on math equations. It fails when it ignores a crisis, misinterprets compliance, or destroys team morale. Stop relying on JSONL files. Start simulating realities.
          </motion.p>
        </div>

        {/* --- DASHBOARD SHOWCASE --- */}
        <div className="w-full px-4 relative z-20 text-left">
          <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.5, ease: premiumEase }} className="w-full max-w-5xl mx-auto rounded-xl border border-white/10 bg-[#050505] shadow-2xl flex flex-col h-[550px] overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
             <div className="h-14 border-b border-white/5 flex items-center px-6 justify-between relative z-10">
                <div className="flex gap-2"><div className="w-2.5 h-2.5 rounded-full bg-white/10" /><div className="w-2.5 h-2.5 rounded-full bg-white/10" /><div className="w-2.5 h-2.5 rounded-full bg-white/10" /></div>
                <div className="text-[9px] font-mono text-zinc-600 tracking-widest uppercase">evalshq // trace</div>
             </div>
             <div className="flex flex-1 relative z-10">
                <div className="w-72 border-r border-white/5 p-8 hidden md:flex flex-col bg-black/20">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 font-bold mb-8">Simulation Config</p>
                  <div className="space-y-5 font-mono text-[10px] text-zinc-400">
                    <div className="flex justify-between border-b border-white/5 pb-2"><span>Target</span><span className="text-zinc-200">localhost:5000</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-2"><span>Context</span><span className="text-zinc-200">Corporate Bank</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-2"><span>Chaos</span><span className="text-zinc-200">1.0</span></div>
                    <div className="pt-8">
                      <div className="flex justify-between items-center mb-2"><span className="text-zinc-500">Legal Risk Tracker</span><span className="text-white">85%</span></div>
                      <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full w-[85%] bg-white/80" /></div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-8 md:p-10 relative">
                  <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                    <h3 className="text-base font-medium text-zinc-200">Live Execution Trace</h3>
                    <span className="text-[9px] font-mono text-zinc-400 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" /> RUNNING</span>
                  </div>
                  <TypingTerminal />
                </div>
             </div>
          </motion.div>
        </div>

        {/* --- ZERO-FRICTION INTEGRATION --- */}
        <div className="w-full px-4 max-w-5xl mx-auto py-32 md:py-48 relative z-20">
          <div className="mb-16 text-center">
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6">Zero-friction red teaming.</h3>
            <p className="text-zinc-500 font-light text-lg md:text-xl max-w-2xl mx-auto">No SDKs to embed in your production logic. Just point the engine at your agent's webhook URL and let the simulation run.</p>
          </div>
          <CodeWindow />
        </div>

        {/* --- BENTO GRID --- */}
        <div className="w-full px-4 max-w-5xl mx-auto pb-32 md:pb-48 relative z-20 text-left">
          <div className="mb-20 text-center">
            <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6">Architecture of consequence.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <EliteCard className="md:col-span-2">
              <h4 className="text-xl md:text-2xl font-medium text-white mb-4">15-Act Deep Simulation</h4>
              <p className="text-zinc-500 font-light text-base md:text-lg max-w-2xl leading-relaxed">Our engine maintains context over 15 continuous acts. The simulated world dynamically reacts to your agent's decisions, forcing it to live with the consequences of its past mistakes.</p>
            </EliteCard>
            <EliteCard>
              <h4 className="text-xl md:text-2xl font-medium text-white mb-4">Social Physics</h4>
              <p className="text-zinc-500 font-light text-base md:text-lg leading-relaxed">Mathematical tracking of Morale and Legal Risk. Quantify the exact moment an agent crosses the line.</p>
            </EliteCard>
            <EliteCard>
              <h4 className="text-xl md:text-2xl font-medium text-white mb-4">Infinite Contexts</h4>
              <p className="text-zinc-500 font-light text-base md:text-lg leading-relaxed">Pass <span className="font-mono text-xs bg-white/10 px-1 rounded">context="ICU"</span> and the engine instantly generates a high-stakes medical reality.</p>
            </EliteCard>
          </div>
        </div>

        {/* --- ENTERPRISE SECURITY --- */}
        <div className="w-full px-4 max-w-5xl mx-auto pb-32 relative z-20 border-t border-white/5 pt-32 text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white mb-6"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
              <h4 className="text-lg font-medium text-white">Local-First Execution</h4>
              <p className="text-sm font-light text-zinc-500 leading-relaxed">Run the entire simulation suite on your own infrastructure. No proprietary data ever leaves your VPC.</p>
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white mb-6"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg></div>
              <h4 className="text-lg font-medium text-white">Regex Shields</h4>
              <p className="text-sm font-light text-zinc-500 leading-relaxed">Hardcoded deterministic boundaries ensure PII, API keys, and sensitive database IDs are never leaked to the auditor.</p>
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white mb-6"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg></div>
              <h4 className="text-lg font-medium text-white">CI/CD Pipeline Blocking</h4>
              <p className="text-sm font-light text-zinc-500 leading-relaxed">Integrates directly into GitHub Actions. Automatically block PRs if a new prompt update causes legal risk to spike.</p>
            </div>
          </div>
        </div>

        {/* --- PIPELINE --- */}
        <div className="w-full px-4 max-w-4xl mx-auto py-10 relative z-20">
          <div ref={workflowRef} className="relative w-full flex flex-col items-center gap-24 md:gap-32 py-10 pb-20">
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/5 -translate-x-1/2 z-0" />
            <motion.div style={{ scaleY: smoothLine }} className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/50 -translate-x-1/2 origin-top shadow-[0_0_10px_rgba(255,255,255,0.5)] z-0" />

            <ArchitectureNode num="1" side="left" title="Target Initialization" desc="Connect to your local agent via Webhook. The system boots up the Context." scrollProgress={smoothLine} triggerPoint={0.1} />
            <ArchitectureNode num="2" side="right" title="World Generation" desc="The World Engine generates a dynamic scenario. The Physics Engine updates Morale." scrollProgress={smoothLine} triggerPoint={0.4} />
            <ArchitectureNode num="3" side="left" title="Post-Mortem Audit" desc="The Supreme Auditor grades the full trace and exports a behavioral report." scrollProgress={smoothLine} triggerPoint={0.7} />
          </div>
        </div>

        {/* --- MASSIVE BRANDING FOOTER --- */}
        <div className="mt-20 w-full relative flex flex-col items-center z-20 pt-32 pb-12 overflow-hidden bg-[#000000] border-t border-white/5">
          <h2 className="text-4xl md:text-6xl font-medium tracking-tighter text-white mb-10 relative z-20 text-center"><EliteTextReveal text="Deploy with certainty." delay={0} /></h2>
          
          <Link href="/docs" className="px-10 py-4 bg-white text-black font-medium text-sm rounded-full transition-colors hover:bg-zinc-200 shadow-[0_0_30px_rgba(255,255,255,0.1)] relative z-20 flex items-center gap-3">
            Developer Docs
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </Link>
          
          <div className="w-full relative mt-32 flex flex-col items-center justify-center">
            <h1 
              onClick={scrollToTop}
              className="text-[16vw] md:text-[19vw] font-black italic tracking-tighter leading-[0.8] select-none text-transparent bg-clip-text bg-gradient-to-b from-white/[0.15] to-transparent cursor-pointer hover:from-white/[0.25] transition-all duration-500 z-10"
              title="Back to Top"
            >
              EVALSHQ
            </h1>
            
            <div className="absolute bottom-0 md:bottom-6 flex justify-between w-full px-8 md:px-12 text-zinc-600 text-[10px] font-mono tracking-widest uppercase z-30">
              <span>© 2026 EvalsHQ</span>
              <span onClick={scrollToTop} className="hover:text-white transition-colors cursor-pointer">Back to Top ↑</span>
            </div>
          </div>
        </div>

      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        ::selection { background: rgba(255,255,255,0.2); color: white; }
      `}} />
    </div>
  );
};

export default function LandingPage() {
  const [booted, setBooted] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!booted && <DeepMindPreloader onComplete={() => setBooted(true)} />}
      </AnimatePresence>
      {booted && <MainContent />}
    </>
  );
}