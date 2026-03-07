
import React, { useEffect, useState } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const PasswordUpdatedSuccess: React.FC<Props> = ({ navigate }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto overflow-hidden font-sans">
      {/* Immersive Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-purple-500/10 to-transparent opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[100%] h-[100%] bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-urkio-magenta/10 via-transparent to-transparent"></div>
      </div>

      <main className="relative z-10 flex-1 px-8 flex flex-col items-center justify-center text-center">
        {/* Animated Security Shield Badge */}
        <div className={`relative mb-12 transition-all duration-1000 transform ${showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
           <div className="absolute inset-0 bg-primary/30 blur-[80px] animate-pulse"></div>
           <div className="size-48 urkio-gradient rounded-[3.5rem] p-1.5 relative shadow-[0_0_60px_rgba(217,70,239,0.3)]">
              <div className="size-full bg-slate-900 dark:bg-[#050b1a] rounded-[3.3rem] border-4 border-white dark:border-slate-800 flex flex-col items-center justify-center">
                 <div className="relative">
                    <span className="material-symbols-outlined text-7xl text-emerald-500 fill-1 animate-breathe">verified_user</span>
                    <div className="absolute -top-1 -right-1 size-6 bg-white dark:bg-background-dark rounded-full flex items-center justify-center">
                       <span className="material-symbols-outlined text-emerald-500 text-lg font-black">check</span>
                    </div>
                 </div>
              </div>
           </div>
           
           {/* Decorative Floaties */}
           <div className="absolute -top-4 -right-4 size-14 bg-emerald-500/10 backdrop-blur-md rounded-2xl border border-emerald-500/20 flex items-center justify-center animate-bounce duration-[2500ms]">
              <span className="material-symbols-outlined text-emerald-500 fill-1">lock</span>
           </div>
           <div className="absolute -bottom-2 -left-6 size-12 bg-primary/10 backdrop-blur-md rounded-2xl border border-primary/20 flex items-center justify-center animate-bounce duration-[3500ms]">
              <span className="material-symbols-outlined text-primary fill-1">verified</span>
           </div>
        </div>

        <div className={`space-y-6 transition-all duration-1000 delay-300 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Security Confirmed</p>
            <h1 className="text-4xl font-black font-display text-slate-900 dark:text-white leading-tight">
              Password <br/><span className="text-emerald-500 italic">Updated</span>
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed max-w-[280px] mx-auto">
            Your account is now secure. You can now use your new password to sign back into your journey.
          </p>
        </div>

        {/* Action Hub */}
        <div className={`w-full mt-16 space-y-6 transition-all duration-1000 delay-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button 
            onClick={() => navigate(AppScreen.AUTH)}
            className="w-full h-18 urkio-gradient rounded-[2rem] text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            Sign In Now
            <span className="material-symbols-outlined text-[20px]">login</span>
          </button>
          
          <div className="flex justify-center gap-6 opacity-40">
             <span className="text-[8px] font-black uppercase tracking-[0.3em] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[12px]">security</span>
                Hi-Fi Safety
             </span>
             <span className="text-[8px] font-black uppercase tracking-[0.3em] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[12px]">sync</span>
                Encrypted
             </span>
          </div>
        </div>
      </main>

      <footer className="text-center pb-12 mt-auto relative z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">
           Urkio Health Intelligence Network
        </p>
      </footer>
    </div>
  );
};

export default PasswordUpdatedSuccess;
