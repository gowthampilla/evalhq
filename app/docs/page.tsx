'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

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
    let atoms: any[] = [];
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
        this.x += this.vx; 
        this.y += this.vy;

        if (this.y > canvas!.height) {
          this.y = -10;
          this.x = Math.random() * canvas!.width;
        }
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fill();
      }
    }

    const initAtoms = () => {
      atoms = [];
      const numberOfAtoms = 60; 
      for (let i = 0; i < numberOfAtoms; i++) atoms.push(new Atom());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      for (let i = 0; i < atoms.length; i++) {
        atoms[i].update();
        atoms[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize(); animate();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" />;
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
  return (
    <div className="relative group rounded-xl border border-white/10 bg-[#050505] overflow-hidden my-8 shadow-2xl">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">{language}</span>
        <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-zinc-500 hover:text-white transition-colors">
          {copied ? "Copied" : "Copy"}
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
  return (
    <div className={`my-8 p-6 rounded-xl border ${colors[type]} flex gap-4 backdrop-blur-sm`}>
      <div>
        <h5 className="text-[11px] font-bold uppercase tracking-widest mb-1">{title}</h5>
        <div className="text-sm text-zinc-400 font-light leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

// ==========================================
// 3. NAVIGATION DATA
// ==========================================
const NAV_SECTIONS = [
  {
    title: "Core Infrastructure",
    links: [
      { id: "philosophy", label: "The Nerion Philosophy" },
      { id: "installation", label: "Installation & Setup" },
      { id: "protocol", label: "Architecture Flow" },
      { id: "api-reference", label: "API Reference" },
    ]
  }
];

// ==========================================
// 4. MAIN DOCS LAYOUT
// ==========================================
export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("philosophy");
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
             Menu
          </button>
          <a href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-5 h-5 rounded-sm border border-white/40 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all">
              <div className="w-2 h-2 bg-white group-hover:bg-black transition-all" />
            </div>
            <span className="font-bold tracking-tight text-lg text-white uppercase">evalshq <span className="text-zinc-600 font-normal ml-1">v1.0</span></span>
          </a>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold text-zinc-500">
           <span>Nerion Engine v1.04</span>
        </div>
      </header>

      {/* --- MAIN LAYOUT --- */}
      <div className="flex flex-1 max-w-[90rem] w-full mx-auto relative z-10">
        
        {/* --- LEFT SIDEBAR --- */}
        <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 border-r border-white/5 bg-[#030303] md:bg-transparent overflow-y-auto z-40 p-10`}>
          <nav className="space-y-12">
            {NAV_SECTIONS.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-[10px] font-bold tracking-[0.2em] text-zinc-600 uppercase mb-6">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map(link => (
                    <li key={link.id}>
                      <button 
                        onClick={() => { setActiveTab(link.id); setIsMobileMenuOpen(false); }}
                        className={`w-full text-left text-[12px] uppercase tracking-widest transition-all duration-300 relative ${
                          activeTab === link.id ? 'text-white' : 'text-zinc-600 hover:text-zinc-300'
                        }`}
                      >
                        {link.label}
                        {activeTab === link.id && <motion.div layoutId="active-nav" className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* --- RIGHT CONTENT CANVAS --- */}
        <main className="flex-1 min-w-0 p-6 md:p-16 lg:px-32 py-20">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }} className="max-w-3xl">
              
              {/* =========================================
                  SECTION: PHILOSOPHY
              ========================================= */}
              {activeTab === 'philosophy' && (
                <>
                  <div className="mb-14">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-8 uppercase">Digital Supreme Court</h1>
                    <p className="text-xl text-zinc-500 font-light leading-relaxed">
                      Evalshq operates the Nerion Engine—a platform designed to bring absolute clarity to complex autonomous decisions. 
                    </p>
                  </div>

                  <p className="text-zinc-400 font-light leading-relaxed mb-8">
                    As AI agents ship to production, they are granted access to file systems, databases, and critical APIs. But agents hallucinate. They make destructive choices. Evalshq acts as an interceptor, analyzing intent and detonating high-risk payloads in ephemeral cloud micro-VMs to mathematically prove the blast radius—all before the code touches your actual environment.
                  </p>

                  <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white mt-16 mb-8">Trust through Adversarial Verification</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden">
                    <div className="bg-black p-8 border-r border-white/10">
                       <h4 className="text-white font-bold text-[10px] uppercase tracking-widest mb-4">Intent Analysis</h4>
                       <p className="text-zinc-500 text-sm font-light">Before code runs, our LLM layer evaluates the semantic intent of the payload.</p>
                    </div>
                    <div className="bg-black p-8">
                       <h4 className="text-white font-bold text-[10px] uppercase tracking-widest mb-4">Impact Auditing</h4>
                       <p className="text-zinc-500 text-sm font-light">We inject "Ghost Files" into the sandbox to mirror production and verify mutations.</p>
                    </div>
                  </div>
                </>
              )}

              {/* =========================================
                  SECTION: INSTALLATION
              ========================================= */}
              {activeTab === 'installation' && (
                <>
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-8 uppercase">Installation</h1>
                  <p className="text-lg text-zinc-400 font-light leading-relaxed mb-12">
                    Integrate the Nerion Engine into your agent's execution loop. You require zero local infrastructure; everything runs on our distributed detonation cloud.
                  </p>

                  <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white mt-16 mb-4">Requirements</h2>
                  <ul className="space-y-4 text-zinc-500 font-light text-sm mb-12 border-l border-white/10 pl-6">
                    <li>Python 3.10+ or Node.js 18+</li>
                    <li>OpenAI API Key (For Adversarial Intent Analysis)</li>
                    <li>Nerion API Key (Obtained via Dashboard)</li>
                  </ul>

                  <CodeBlock language="bash" code={<span className="text-zinc-300">pip install requests  # No complex SDK required</span>} />
                  
                  <Callout title="BYOK Protocol" type="note">
                    Nerion uses a "Bring Your Own Key" architecture. We do not store your LLM credentials; they are used in-memory only for the detonation audit.
                  </Callout>
                </>
              )}

              {/* =========================================
                  SECTION: PROTOCOL
              ========================================= */}
              {activeTab === 'protocol' && (
                <>
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-8 uppercase">Execution Flow</h1>
                  <p className="text-lg text-zinc-500 font-light leading-relaxed mb-12">
                    When your agent proposes an action, the Nerion Engine executes a strict, 4-step protocol.
                  </p>
                  
                  

                  <div className="space-y-12 mt-16">
                    <div className="border-l-2 border-white/20 pl-8">
                       <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">1. The Intercept</h4>
                       <p className="text-zinc-500 font-light">Your gateway catches the proposed command (e.g., <code className="text-white">rm -rf /app/db</code>) and routes it to Nerion.</p>
                    </div>
                    <div className="border-l-2 border-white/20 pl-8">
                       <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">2. Cloud Detonation</h4>
                       <p className="text-zinc-500 font-light">Engine boots a secure micro-VM in &lt;1.2s and replicates your specified file paths.</p>
                    </div>
                    <div className="border-l-2 border-white/20 pl-8">
                       <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">3. The Verdict</h4>
                       <p className="text-zinc-500 font-light">If state integrity is violated, it returns a <span className="text-rose-500 font-bold">BLOCKED</span> verdict with a full forensic log.</p>
                    </div>
                  </div>
                </>
              )}

              {/* =========================================
                  SECTION: API REFERENCE
              ========================================= */}
              {activeTab === 'api-reference' && (
                <>
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-8 uppercase">API Reference</h1>
                  <p className="text-zinc-500 font-light mb-8 font-mono">POST https://nerionpro.onrender.com/api/v1/evaluate</p>

                  <CodeBlock 
                    language="python"
                    code={
                      <>
                        <span className="text-purple-400">import</span> <span className="text-zinc-300">requests</span><br/>
                        <span className="text-zinc-300">API_URL = </span><span className="text-emerald-300">"https://nerionpro.onrender.com/api/v1/evaluate"</span><br/>
                        <br/>
                        <span className="text-zinc-300">payload = </span><span className="text-blue-400">{"{"}</span><br/>
                        {"  "}<span className="text-emerald-300">"payload"</span><span className="text-zinc-300">: </span><span className="text-emerald-300">"rm -rf /app/db/prod.sql"</span><span className="text-zinc-300">,</span><br/>
                        {"  "}<span className="text-emerald-300">"context_files"</span><span className="text-zinc-300">: [</span><span className="text-emerald-300">"/app/db/prod.sql"</span><span className="text-zinc-300">],</span><br/>
                        {"  "}<span className="text-emerald-300">"user_api_key"</span><span className="text-zinc-300">: </span><span className="text-emerald-300">"sk-..."</span> <span className="text-zinc-600"># BYOK Auth</span><br/>
                        <span className="text-blue-400">{"}"}</span><br/>
                        <br/>
                        <span className="text-zinc-300">response = requests.post(API_URL, json=payload)</span><br/>
                        <span className="text-zinc-300">decision = response.json()</span><br/>
                        <br/>
                        <span className="text-purple-400">if</span><span className="text-zinc-300"> decision[</span><span className="text-emerald-300">"decision"</span><span className="text-zinc-300">] == </span><span className="text-emerald-300">"ALLOW"</span><span className="text-zinc-300">:</span><br/>
                        {"  "}<span className="text-purple-400">print</span><span className="text-zinc-300">(</span><span className="text-emerald-300">"✅ Nerion Approved"</span><span className="text-zinc-300">)</span><br/>
                        <span className="text-purple-400">else</span><span className="text-zinc-300">:</span><br/>
                        {"  "}<span className="text-purple-400">print</span><span className="text-zinc-300">(</span><span className="text-emerald-300">f"❌ Blocked: </span><span className="text-blue-400">{"{"}decision['reason']{"}"}</span><span className="text-emerald-300">"</span><span className="text-zinc-300">)</span>
                      </>
                    } 
                  />
                  
                  <Callout title="Forensic Log Extraction" type="success">
                    Access the <code className="text-white">simulation_result</code> object in the response for a detailed diff of every file path provided in the context.
                  </Callout>
                </>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
