
import React, { useState, useEffect } from 'react';
import { AppScreen, UserRole } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
  onAuthenticated: (role: UserRole) => void;
}

const SecurePortal: React.FC<Props> = ({ navigate, onAuthenticated }) => {
  const [portKey, setPortKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'GRANTED' | 'DENIED'>('IDLE');
  const [log, setLog] = useState<string[]>(['Clinical Port Alpha-7 initialized...']);

  useEffect(() => {
    const timer = setInterval(() => {
      const logs = [
        "Analyzing secure handshake...",
        "HIPAA clearance verified...",
        "Encryption layer: active",
        "Clinical bridge standby...",
      ];
      setLog(prev => [...prev.slice(-4), logs[Math.floor(Math.random() * logs.length)]]);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleEntry = (role: UserRole) => {
    // FOUNDER OVERRIDE - Exclusive master access
    if (portKey === 'FOUNDER-OMEGA-INFINITY') {
       setStatus('SCANNING');
       setIsValidating(true);
       setTimeout(() => {
          setIsValidating(false);
          setStatus('GRANTED');
          setTimeout(() => {
             onAuthenticated('FOUNDER');
          }, 1000);
       }, 1500);
       return;
    }

    // BOARD BYPASS
    if (portKey === 'URKIO-MASTER-2025') {
       setStatus('SCANNING');
       setIsValidating(true);
       setTimeout(() => {
          setIsValidating(false);
          setStatus('GRANTED');
          setTimeout(() => {
             onAuthenticated('BOARD');
          }, 1000);
       }, 2000);
       return;
    }

    if (portKey.length < 8) {
      setStatus('DENIED');
      setTimeout(() => setStatus('IDLE'), 2000);
      return;
    }

    setStatus('SCANNING');
    setIsValidating(true);
    
    setTimeout(() => {
      setIsValidating(false);
      setStatus('GRANTED');
      setTimeout(() => onAuthenticated(role), 1500);
    }, 2500);
  };

  return (
    <div className="relative h-screen w-full flex flex-col bg-[#050b1a] text-white max-w-md mx-auto overflow-hidden font-sans">
      {/* HUD Backdrop */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-40"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
      </div>

      <header className="relative z-10 p-8 flex flex-col items-center gap-2">
        <div className="size-16 rounded-2xl urkio-gradient p-0.5 shadow-2xl">
          <div className="size-full bg-slate-900 rounded-[14px] flex items-center justify-center">
             <span className="material-symbols-outlined text-white text-3xl animate-pulse">hub</span>
          </div>
        </div>
        <h1 className="text-xl font-black uppercase tracking-[0.4em] text-primary">Secure Port</h1>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Restricted Clinical Entrance</p>
      </header>

      <main className="relative z-10 flex-1 px-8 flex flex-col items-center justify-center">
        {/* Diagnostic Visual */}
        <div className="w-full h-24 mb-12 flex flex-col gap-1 overflow-hidden opacity-40">
           {log.map((line, i) => (
             <p key={i} className="text-[8px] font-mono text-accent-cyan uppercase tracking-widest animate-in slide-in-from-left-4">
               &gt; {line}
             </p>
           ))}
        </div>

        {/* Biometric / Key Input Area */}
        <div className={`w-full p-8 rounded-[3rem] border-2 transition-all duration-700 ${
          status === 'DENIED' ? 'border-red-500 bg-red-500/5' : 
          status === 'GRANTED' ? 'border-emerald-500 bg-emerald-500/5' : 
          'border-primary/30 bg-white/5 shadow-2xl shadow-primary/10'
        }`}>
           <div className="flex flex-col items-center text-center gap-6">
              <div className={`size-24 rounded-[2rem] border-2 flex items-center justify-center relative overflow-hidden transition-all duration-500 ${
                status === 'SCANNING' ? 'border-accent-cyan' : 'border-white/10'
              }`}>
                 {status === 'SCANNING' && (
                   <div className="absolute top-0 left-0 w-full h-1 bg-accent-cyan animate-[scan_2s_linear_infinite] shadow-[0_0_15px_#00f2ff]"></div>
                 )}
                 <span className={`material-symbols-outlined text-5xl ${
                   status === 'DENIED' ? 'text-red-500 animate-shake' : 
                   status === 'GRANTED' ? 'text-emerald-500' : 
                   status === 'SCANNING' ? 'text-accent-cyan' : 'text-slate-700'
                 }`}>
                   {status === 'GRANTED' ? 'verified' : status === 'DENIED' ? 'dangerous' : 'fingerprint'}
                 </span>
              </div>

              <div className="w-full space-y-4">
                 <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">Authorized Port Key</label>
                    <input 
                      type="password"
                      value={portKey}
                      onChange={e => setPortKey(e.target.value)}
                      className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl text-center font-mono text-xl tracking-[0.5em] focus:ring-2 focus:ring-primary/40 focus:border-primary"
                      placeholder="••••••••"
                      maxLength={24}
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleEntry('CASE_MANAGER')}
                      disabled={isValidating}
                      className="h-14 bg-primary text-white rounded-2xl font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                      Case Manager
                    </button>
                    <button 
                      onClick={() => handleEntry('BOARD')}
                      disabled={isValidating}
                      className="h-14 bg-slate-800 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all border border-white/5 disabled:opacity-50"
                    >
                      The Board
                    </button>
                 </div>

                 {/* Developer Bypass */}
                 <button 
                   onClick={() => {
                     setPortKey('FOUNDER-OMEGA-INFINITY');
                     setTimeout(() => handleEntry('FOUNDER'), 100);
                   }}
                   className="w-full h-10 border border-primary/20 bg-primary/5 rounded-xl text-[8px] font-black uppercase tracking-[0.3em] text-primary/60 hover:text-primary hover:bg-primary/10 transition-all"
                 >
                   Developer Master Bypass
                 </button>
              </div>
           </div>
        </div>

        <button 
          onClick={() => navigate(AppScreen.LANDING)}
          className="mt-12 text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 hover:text-white transition-colors"
        >
          Return to Perimeter
        </button>
      </main>

      <footer className="p-10 text-center bg-black/40 border-t border-white/5">
        <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em]">Urkio Clinical Infrastructure • Protocol 7.2</p>
      </footer>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(96px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SecurePortal;
