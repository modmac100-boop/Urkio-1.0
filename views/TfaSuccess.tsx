
import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const TfaSuccess: React.FC<Props> = ({ navigate }) => {
  const [showContent, setShowContent] = useState(false);
  const backupCodes = ["8291-CYC", "4412-URK", "9901-HFI", "2381-SAFE", "5102-SHLD", "7712-CORE"];

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl font-sans overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-60"></div>
      
      <main className="relative z-10 flex-1 px-8 flex flex-col items-center justify-center text-center">
        {/* Animated Badge */}
        <div className={`relative mb-12 transition-all duration-1000 transform ${showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
           <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] animate-pulse"></div>
           <div className="size-48 urkio-gradient rounded-[3.5rem] p-1.5 shadow-[0_0_60px_rgba(16,185,129,0.3)]">
              <div className="size-full bg-slate-900 rounded-[3.3rem] border-4 border-white flex flex-col items-center justify-center">
                 <div className="relative">
                    <span className="material-symbols-outlined text-7xl text-emerald-500 fill-1 animate-breathe">verified_user</span>
                    <div className="absolute -top-1 -right-1 size-7 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900">
                       <span className="material-symbols-outlined text-emerald-500 text-sm font-black">check</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className={`space-y-6 transition-all duration-1000 delay-300 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
           <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Protection Active</p>
              <h1 className="text-4xl font-black font-display text-slate-900 dark:text-white leading-tight">
                2FA Successfully <br/><span className="text-emerald-500 italic">Enabled</span>
              </h1>
           </div>
           <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
             Your account is now twice as secure. Please secure your recovery documentation.
           </p>
        </div>

        <div className={`w-full mt-16 space-y-4 transition-all duration-1000 delay-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
           <button 
             onClick={() => navigate(AppScreen.BACKUP_CODES_CARD)}
             className="w-full h-18 urkio-gradient rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
           >
              Generate Recovery Card
              <span className="material-symbols-outlined">description</span>
           </button>
           
           <button 
             onClick={() => navigate(AppScreen.SECURITY_PRIVACY)}
             className="w-full h-16 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 active:scale-95 transition-all shadow-sm"
           >
              Finish Later
           </button>
        </div>
      </main>

      <footer className="p-8 text-center">
         <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Urkio Health Intelligence Network</p>
      </footer>
    </div>
  );
};

export default TfaSuccess;
