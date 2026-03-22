'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

// ==========================================
// 1. DESCENDING ATOM MATRIX (BACKGROUND)
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
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
      }
    }

    const initAtoms = () => {
      atoms = [];
      const area = canvas!.width * canvas!.height;
      const numberOfAtoms = Math.min(Math.floor(area / 18000), 80); 
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
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 - distance / 1125})`;
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

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-30 mix-blend-screen" />;
};

// ==========================================
// 2. ELITE UI COMPONENTS
// ==========================================
const PremiumCursor = () => {
  const cursorX = useMotionValue(-100); const cursorY = useMotionValue(-100);
  const smoothX = useSpring(cursorX, { damping: 25, stiffness: 300, mass: 0.5 });
  const smoothY = useSpring(cursorY, { damping: 25, stiffness: 300, mass: 0.5 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => { cursorX.set(e.clientX - 16); cursorY.set(e.clientY - 16); };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <motion.div style={{ x: smoothX, y: smoothY }} className="fixed top-0 left-0 w-8 h-8 border border-white/30 rounded-full pointer-events-none z-[9999] hidden md:flex items-center justify-center mix-blend-difference">
      <div className="w-1 h-1 bg-white rounded-full" />
    </motion.div>
  );
};

const CodeBlock = ({ code, language = "python" }: { code: React.ReactNode, language?: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="relative group rounded-xl border border-white/10 bg-[#050505] overflow-hidden my-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{language}</span>
        <button onClick={handleCopy} className="text-zinc-500 hover:text-white transition-colors">
          {copied ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>}
        </button>
      </div>
      <div className="p-6 overflow-x-auto text-[13px] font-mono leading-loose whitespace-pre text-zinc-300">
        {code}
      </div>
    </div>
  );
};

const Callout = ({ title, children, type = "note" }: { title: string, children: React.ReactNode, type?: "note" | "warning" | "success" }) => {
  const colors = {
    note: "border-blue-500/20 bg-blue-500/[0.03] text-blue-400",
    warning: "border-rose-500/20 bg-rose-500/[0.03] text-rose-400",
    success: "border-emerald-500/20 bg-emerald-500/[0.03] text-emerald-400"
  };
  const current = colors[type];

  return (
    <div className={`my-8 p-6 rounded-xl border ${current} flex gap-4 backdrop-blur-sm`}>
      <div className="mt-0.5">
        {type === "warning" && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>}
        {type === "note" && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>}
        {type === "success" && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
      </div>
      <div>
        <h5 className="text-sm font-medium mb-1 tracking-wide">{title}</h5>
        <div className="text-sm text-zinc-400 font-light leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

// ==========================================
// 3. NAVIGATION DATA (HONEST SCOPE)
// ==========================================
const NAV_SECTIONS = [
  {
    title: "Getting Started",
    links: [
      { id: "installation", label: "Installation" },
      { id: "quickstart", label: "Quickstart & Usage" },
    ]
  }
];

// ==========================================
// 4. MAIN DOCS LAYOUT
// ==========================================
export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("installation");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 font-sans flex flex-col selection:bg-white/20 selection:text-white relative">
      <PremiumCursor />
      <DescendingAtoms />
      <div className="fixed inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      {/* --- TOP NAVBAR --- */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 md:px-12 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-zinc-400 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          
          <a href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-5 h-5 rounded-sm border border-white/40 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all">
              <div className="w-2 h-2 bg-white group-hover:bg-black transition-all" />
            </div>
            <span className="font-medium tracking-tight text-lg text-white mt-[2px]">evalshq <span className="text-zinc-600 font-normal ml-1">Docs</span></span>
          </a>
        </div>

        <div className="flex items-center gap-6">
          <a href="/" className="text-[11px] font-mono tracking-widest uppercase text-zinc-400 hover:text-white transition-colors hidden md:block">Back to Home</a>
        </div>
      </header>

      {/* --- MAIN LAYOUT --- */}
      <div className="flex flex-1 max-w-[90rem] w-full mx-auto relative z-10">
        
        {/* --- LEFT SIDEBAR --- */}
        <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 border-r border-white/5 bg-[#030303] md:bg-transparent overflow-y-auto z-40 p-8`}>
          <nav className="space-y-10">
            {NAV_SECTIONS.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-[10px] font-bold tracking-[0.2em] text-zinc-600 uppercase mb-4 pl-3">{section.title}</h4>
                <ul className="space-y-1.5">
                  {section.links.map(link => (
                    <li key={link.id}>
                      <button 
                        onClick={() => { setActiveTab(link.id); setIsMobileMenuOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-all duration-300 relative ${
                          activeTab === link.id 
                            ? 'bg-white/10 text-white font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
                            : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]'
                        }`}
                      >
                        {activeTab === link.id && <motion.div layoutId="active-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-r-full" />}
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* --- RIGHT CONTENT CANVAS --- */}
        <main className="flex-1 min-w-0 p-6 md:p-16 lg:px-32 py-16">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="max-w-3xl">
              
              {/* =========================================
                  SECTION: INSTALLATION
              ========================================= */}
              {activeTab === 'installation' && (
                <>
                  <div className="mb-14">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">Installation</h1>
                    <p className="text-lg text-zinc-400 font-light leading-relaxed">
                      EvalsHQ is a Python package designed to run adversarial simulations against your AI agents.
                    </p>
                  </div>

                  <h2 className="text-2xl font-medium text-white mb-4 mt-16">Requirements</h2>
                  <ul className="list-disc pl-6 space-y-3 text-zinc-400 font-light leading-relaxed mb-8">
                    <li>Python 3.9 or higher</li>
                    <li>An active OpenAI API key (required to power the Attacker AI and the Supreme Auditor)</li>
                  </ul>

                  <h2 className="text-2xl font-medium text-white mb-4 mt-16">Install via pip</h2>
                  <p className="text-zinc-400 font-light leading-relaxed mb-4">You can install EvalsHQ directly from PyPI:</p>
                  <CodeBlock language="bash" code={<span className="text-zinc-300">pip install evalshq-v01 </span>} />

                  <h2 className="text-2xl font-medium text-white mb-4 mt-16">Environment Setup</h2>
                  <p className="text-zinc-400 font-light leading-relaxed mb-4">
                    Set your OpenAI API key in your environment variables. EvalsHQ uses this to generate the dynamic adversarial prompts during the simulation.
                  </p>
                  <CodeBlock 
                    language="bash" 
                    code={
                      <>
                        <span className="text-zinc-300">export OPENAI_API_KEY=</span><span className="text-emerald-300">"sk-your-key-here"</span>
                      </>
                    } 
                  />

                  <div className="mt-12 flex justify-end">
                    <button onClick={() => setActiveTab('quickstart')} className="px-6 py-3 rounded-full bg-white text-black font-medium text-sm flex items-center gap-2 hover:bg-zinc-200 transition-colors">
                      Next: Quickstart & Usage →
                    </button>
                  </div>
                </>
              )}

              {/* =========================================
                  SECTION: QUICKSTART & USAGE
              ========================================= */}
              {activeTab === 'quickstart' && (
                <>
                  <div className="mb-14">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">Quickstart & Usage</h1>
                    <p className="text-lg text-zinc-400 font-light leading-relaxed">
                      Learn how to point the simulation engine at your agent's webhook and run your first adversarial trace.
                    </p>
                  </div>

                  <h2 className="text-2xl font-medium text-white mb-4 mt-16">1. Prepare your Agent Webhook</h2>
                  <p className="text-zinc-400 font-light leading-relaxed mb-4">
                    EvalsHQ tests your agent in a "black box" manner. You do not need to modify your agent's internal code. You simply need to expose a standard POST endpoint that accepts a JSON string and returns a JSON string.
                  </p>
                  <Callout title="Local Testing Supported" type="note">
                    You can securely point EvalsHQ to your local development server (e.g., <code className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-white">http://localhost:5000/chat</code>).
                  </Callout>

                  <h2 className="text-2xl font-medium text-white mb-4 mt-16">2. Run the Simulation</h2>
                  <p className="text-zinc-400 font-light leading-relaxed mb-4">
                    Create a new Python file and run the `evalshq.run()` method. Pass your agent's URL, define the context (the scenario), and set your desired chaos factor.
                  </p>

                  <CodeBlock 
                    language="python"
                    code={
                      <>
                        <span className="text-purple-400">import</span> <span className="text-zinc-300">evalshq</span><br/>
                        <br/>
                        <span className="text-zinc-600"># Start the adversarial loop against your bot</span><br/>
                        <span className="text-blue-400">report</span> <span className="text-zinc-400">=</span> <span className="text-zinc-300">evalshq.run(</span><br/>
                        {"    "}<span className="text-zinc-400">agent_url=</span><span className="text-emerald-300">"http://localhost:5000/webhook"</span><span className="text-zinc-400">,</span><br/>
                        {"    "}<span className="text-zinc-400">context=</span><span className="text-emerald-300">"High-Stakes Corporate Bank"</span><span className="text-zinc-400">,</span><br/>
                        {"    "}<span className="text-zinc-400">chaos_factor=</span><span className="text-rose-300">1.0</span> <span className="text-zinc-600"># Max difficulty</span><br/>
                        <span className="text-zinc-300">)</span><br/>
                        <br/>
                        <span className="text-zinc-600"># View the Supreme Auditor's final verdict</span><br/>
                        <span className="text-purple-400">print</span><span className="text-zinc-300">(</span><span className="text-emerald-300">f"Final Grade: </span><span className="text-blue-400">{"{"}report['grade']{"}"}</span><span className="text-emerald-300">"</span><span className="text-zinc-300">)</span><br/>
                        <span className="text-purple-400">print</span><span className="text-zinc-300">(</span><span className="text-emerald-300">f"Rationale: </span><span className="text-blue-400">{"{"}report['rationale']{"}"}</span><span className="text-emerald-300">"</span><span className="text-zinc-300">)</span>
                      </>
                    } 
                  />

                  <h2 className="text-2xl font-medium text-white mb-4 mt-16">3. Understanding the Output</h2>
                  <p className="text-zinc-400 font-light leading-relaxed mb-4">
                    The engine will output a real-time trace in your terminal showing the Attacker AI's prompts, your Agent's responses, and the shifting Social Physics scores. Once complete, it returns a dictionary containing the final evaluation grade.
                  </p>

                  <div className="mt-12 flex justify-start">
                    <button onClick={() => setActiveTab('installation')} className="px-6 py-3 rounded-full border border-white/20 text-white font-medium text-sm flex items-center gap-2 hover:bg-white/10 transition-colors">
                      ← Back to Installation
                    </button>
                  </div>
                </>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}