'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Zap, 
  FileSearch, 
  Ghost, 
  ExternalLink,
  Code2,
  Globe,
  CheckCircle2,
  Server,
  Activity,
  Layers,
  Cpu,
  ShieldAlert,
  Database,
  Terminal,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

// --- BACKGROUND: DESCENDING ATOM MATRIX ---
const AtomBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let atoms: any[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; init(); };
    class Atom {
      x=Math.random()*canvas!.width; y=Math.random()*canvas!.height;
      vy=Math.random()*0.4+0.1; radius=Math.random()*1.1+0.2;
      update() { this.y += this.vy; if (this.y > canvas!.height) this.y = -5; }
      draw() { ctx!.beginPath(); ctx!.arc(this.x, this.y, this.radius, 0, Math.PI*2); ctx!.fillStyle='rgba(255,255,255,0.07)'; ctx!.fill(); }
    }
    const init = () => { atoms = []; for(let i=0; i<80; i++) atoms.push(new Atom()); };
    const animate = () => { ctx.clearRect(0,0,canvas!.width,canvas!.height); atoms.forEach(a=>{a.update(); a.draw();}); requestAnimationFrame(animate); };
    window.addEventListener('resize', resize); resize(); animate();
    return () => window.removeEventListener('resize', resize);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />;
};

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

// ==========================================
// 3. NAVIGATION: "HOW IT WORKS" AT TOP
// ==========================================
const NAV_SECTIONS = [
  {
    title: "Core Protocol",
    links: [
      { id: "how-it-works", label: "How it Works" },
      { id: "philosophy", label: "Philosophy" },
    ]
  },
  {
    title: "Technical Specification",
    links: [
      { id: "installation", label: "Installation & Setup" },
      { id: "api-reference", label: "API Specification" },
    ]
  }
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("how-it-works");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="bg-black min-h-screen" />;

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 font-sans flex flex-col selection:bg-white/20 selection:text-white relative">
      <PremiumCursor />
      <AtomBackground />
      
      {/* 1. HEADER */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 md:px-12 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-5 h-5 rounded-sm border border-white/40 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all">
              <div className="w-2 h-2 bg-white group-hover:bg-black transition-all" />
            </div>
            <span className="font-bold tracking-tight text-lg text-white uppercase tracking-widest">evalshq <span className="text-zinc-600 font-normal ml-1">docs</span></span>
          </a>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold text-zinc-500">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Nerion Engine v1.0.4 Live</span>
           </div>
        </div>
      </header>

      {/* 2. MAIN LAYOUT */}
      <div className="flex flex-1 max-w-[90rem] w-full mx-auto relative z-10">
        
        {/* SIDEBAR */}
        <aside className="hidden md:block sticky top-16 h-[calc(100vh-4rem)] w-72 border-r border-white/5 p-10 overflow-y-auto">
          <nav className="space-y-12">
            {NAV_SECTIONS.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-[10px] font-bold tracking-[0.2em] text-zinc-600 uppercase mb-6">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map(link => (
                    <li key={link.id}>
                      <button 
                        onClick={() => setActiveTab(link.id)}
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

        {/* CONTENT */}
        <main className="flex-1 min-w-0 p-6 md:p-16 lg:px-32 py-20">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }} className="max-w-4xl">
              
              {/* HOW IT WORKS (RE-POSITIONED TO TOP) */}
              {activeTab === 'how-it-works' && (
                <div className="space-y-16 text-left">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-zinc-500 uppercase tracking-widest text-[10px] font-bold">
                      <Activity size={14} /> Mechanical Lifecycle // Protocol
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white uppercase leading-[0.9]">
                      How it <br/>Works.
                    </h1>
                    <p className="text-xl text-zinc-500 font-light leading-relaxed max-w-2xl">
                      The Nerion Engine executes a deterministic 5-stage pipeline to mathematically prove the safety of every agentic tool-call.
                    </p>
                  </div>

                  {/* STEP BY STEP TIMELINE */}
                  <div className="space-y-12 relative">
                    <div className="absolute left-[3px] top-4 bottom-4 w-px bg-white/10" />
                    {[
                      { t: "01. The Intercept", d: "Your gateway catches the tool-call (Shell/SQL) at the API level and suspends execution. No production state mutation has occurred." },
                      { t: "02. Environment Forking", d: "Nerion creates an ephemeral fork of production-mirrored paths inside a sterile Linux Micro-VM in <26ms." },
                      { t: "03. Detonation", d: "The untrusted payload executes inside the sandbox. We utilize your BYOK credentials to perform semantic intent auditing in real-time." },
                      { t: "04. Recursive Forensic Diff", d: "Cryptographic checksums compare the environment state before and after execution to detect unauthorized mutations or data exfiltration." },
                      { t: "05. Deterministic Verdict", d: "The engine issues an ALLOW signal to commit to the kernel, or a BLOCK signal with a comprehensive forensic impact report." }
                    ].map((step, i) => (
                      <div key={i} className="relative pl-8 group">
                        <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-zinc-800 border border-white/20 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all" />
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2 leading-none">{step.t}</h4>
                        <p className="text-zinc-500 font-light text-sm leading-relaxed">{step.d}</p>
                      </div>
                    ))}
                  </div>

                  {/* PRIMITIVE CALLOUTS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 border-t border-white/5">
                    <div className="space-y-3">
                       <div className="text-white font-bold uppercase tracking-widest text-[9px] flex items-center gap-2"><Lock size={12}/> BYOK Sovereignty</div>
                       <p className="text-zinc-600 text-xs font-light">Keys are utilized in-memory for context detonation and purged instantly upon verdict.</p>
                    </div>
                    <div className="space-y-3">
                       <div className="text-white font-bold uppercase tracking-widest text-[9px] flex items-center gap-2"><Ghost size={12}/> Ghost Mocking</div>
                       <p className="text-zinc-600 text-xs font-light">Injecting mirrored production paths into isolation to verify exfiltration risk without data exposure.</p>
                    </div>
                    <div className="space-y-3">
                       <div className="text-white font-bold uppercase tracking-widest text-[9px] flex items-center gap-2"><FileSearch size={12}/> Recursive Diffs</div>
                       <p className="text-zinc-600 text-xs font-light">Recursive file-tree checksums catch logic bombs missed by traditional logging mechanisms.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PHILOSOPHY */}
              {activeTab === 'philosophy' && (
                <div className="space-y-12 text-left">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-zinc-500 uppercase tracking-widest text-[10px] font-bold">
                      <BookOpen size={14} /> Philosophy // Standard
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white uppercase leading-[0.9]">
                      Adversarial <br/>Verification.
                    </h1>
                    <p className="text-xl text-zinc-500 font-light leading-relaxed max-w-2xl">
                      Nerion is built on the premise that agentic reasoning cannot be trusted. Evalshq acts as a <strong>Digital Supreme Court</strong> for infrastructure.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                    <div className="p-8 border border-white/10 bg-white/[0.01] rounded-xl space-y-4">
                       <h4 className="text-white font-bold text-[10px] uppercase tracking-widest">The Hallucination Vector</h4>
                       <p className="text-zinc-500 text-sm font-light leading-relaxed">As agents move from chat to action, hallucinations become infrastructure mutations. Evalshq mathematically proves the blast radius before commit.</p>
                    </div>
                    <div className="p-8 border border-white/10 bg-white/[0.01] rounded-xl space-y-4">
                       <h4 className="text-white font-bold text-[10px] uppercase tracking-widest">Sovereign Safety</h4>
                       <p className="text-zinc-500 text-sm font-light leading-relaxed">We provide proactive prevention through automated detonation sandboxing, ensuring production state integrity.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* INSTALLATION */}
              {activeTab === 'installation' && (
                <div className="space-y-12 text-left">
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-8 uppercase leading-none">Setup</h1>
                  <p className="text-lg text-zinc-500 font-light leading-relaxed">
                    Nerion is zero-infrastructure on the client side. Integrate the engine by exposing a POST gateway in your agent loop.
                  </p>

                  <div className="space-y-12">
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white mb-4">1. Environment Verification</h2>
                      <ul className="space-y-4 text-zinc-500 font-light text-sm border-l border-white/10 pl-6">
                        <li>Python 3.10+ / Node.js 18+</li>
                        <li>OpenAI / Anthropic API Key (For Intent Auditing)</li>
                        <li>Standard <code className="text-zinc-300">requests</code> or <code className="text-zinc-300">axios</code></li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white mb-4">2. Provisioning</h2>
                      <p className="text-sm text-zinc-500 leading-relaxed max-w-xl">Obtain your <code className="text-zinc-300">NERION_KEY</code> via the dashboard. This key authenticates your gateway with our global detonation cloud.</p>
                    </div>
                  </div>

                  <div className="mt-12 p-8 border border-emerald-500/20 bg-emerald-500/[0.02] rounded-xl flex gap-4">
                     <CheckCircle2 className="text-emerald-500" size={20} />
                     <div>
                        <h4 className="text-white font-bold text-[10px] uppercase tracking-widest mb-1">Open Source Sovereignty</h4>
                        <p className="text-zinc-500 text-sm font-light">The Nerion Engine is licensed under Apache 2.0. Self-host the pipeline on your own private VPC for absolute data control.</p>
                     </div>
                  </div>
                </div>
              )}

              {/* API REFERENCE */}
              {activeTab === 'api-reference' && (
                <div className="space-y-12 text-left">
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-8 uppercase leading-none">API Spec</h1>
                  <div className="flex items-center gap-3 text-zinc-500 font-mono text-sm border-b border-white/5 pb-4">
                    <Globe size={16} /> POST https://nerionpro.onrender.com/api/v1/evaluate
                  </div>

                  <CodeBlock 
                    language="python"
                    code={
                      <>
                        <span className="text-purple-400">import</span> <span className="text-zinc-300">requests</span><br/>
                        <span className="text-zinc-300">API_URL = </span><span className="text-emerald-300">"https://nerionpro.onrender.com/api/v1/evaluate"</span><br/>
                        <br/>
                        <span className="text-zinc-300">payload = </span><span className="text-zinc-400">{"{"}</span><br/>
                        {"  "}<span className="text-emerald-300">"payload"</span><span className="text-zinc-300">: </span><span className="text-emerald-300">"rm -rf /app/db/prod.sql"</span><span className="text-zinc-300">,</span><br/>
                        {"  "}<span className="text-emerald-300">"isolation"</span><span className="text-zinc-300">: </span><span className="text-emerald-300">True</span><span className="text-zinc-300">,</span><br/>
                        {"  "}<span className="text-emerald-300">"context_files"</span><span className="text-zinc-300">: [</span><span className="text-emerald-300">"/app/db/prod.sql"</span><span className="text-zinc-300">],</span><br/>
                        {"  "}<span className="text-emerald-300">"user_api_key"</span><span className="text-zinc-300">: </span><span className="text-emerald-300">"sk-..."</span> <span className="text-zinc-600"># BYOK Auth</span><br/>
                        <span className="text-zinc-400">{"}"}</span><br/>
                        <br/>
                        <span className="text-zinc-300">response = requests.post(API_URL, json=payload)</span><br/>
                        <span className="text-zinc-300">decision = response.json()</span><br/>
                        <br/>
                        <span className="text-purple-400">if</span><span className="text-zinc-300"> decision[</span><span className="text-emerald-300">"verdict"</span><span className="text-zinc-300">] == </span><span className="text-emerald-300">"BLOCK"</span><span className="text-zinc-300">:</span><br/>
                        {"  "}<span className="text-rose-500">agent.halt(decision["reason"])</span>
                      </>
                    } 
                  />
                  
                  <div className="bg-[#050505] p-10 border border-white/5 rounded-xl space-y-6">
                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-zinc-700 font-bold border-b border-white/5 pb-4">
                      <Database size={12} /> Response Schema
                    </div>
                    <pre className="text-[12px] font-mono text-zinc-400 leading-relaxed uppercase">
{`{
  "verdict": "BLOCK",
  "reason": "STATE_CORRUPTION_DETECTED",
  "audit_id": "nerion_0x772",
  "forensics": {
    "impact": "destructive_deletion",
    "risk_index": 0.94
  }
}`}
                    </pre>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
