
import React from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const TfaSetupMethod: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl font-sans overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[100%] h-[100%] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-purple-500/5 to-transparent"></div>
      
      <header className="relative z-10 px-6 pt-12 pb-6 flex items-center justify-between">
        <button onClick={() => navigate(AppScreen.SECURITY_PRIVACY)} className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 active:scale-90 transition-all shadow-sm">
          <span className="material-symbols-outlined text-slate-500">arrow_back_ios_new</span>
        </button>
        <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
           <span className="material-symbols-outlined text-primary text-[14px] fill-1">shield</span>
           <span className="text-[9px] font-black uppercase tracking-widest text-primary">Setup 2FA</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-8 pt-4 pb-12 flex flex-col">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="size-24 rounded-[2.5rem] urkio-gradient p-1 shadow-2xl mx-auto mb-8">
              <div className="size-full bg-slate-950 rounded-[2.3rem] flex items-center justify-center text-white">
                 <span className="material-symbols-outlined text-4xl fill-1">security</span>
              </div>
           </div>
           <h1 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
             Choose Your <br/><span className="text-primary italic">Shield Method</span>
           </h1>
           <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
             Add an extra layer of protection to your account and sensitive reflections.
           </p>
        </div>

        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
           <button 
             onClick={() => navigate(AppScreen.TFA_SETUP_VERIFY)}
             className="w-full p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-[2.5rem] shadow-sm flex items-center gap-5 group hover:border-primary/40 transition-all active:scale-[0.98]"
           >
              <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                 <span className="material-symbols-outlined text-3xl">smartphone</span>
              </div>
              <div className="text-left">
                 <h4 className="text-base font-black text-slate-900 dark:text-white mb-1">Authenticator App</h4>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recommended • More Secure</p>
              </div>
              <span className="material-symbols-outlined text-slate-300 ml-auto group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
           </button>

           <button 
             onClick={() => navigate(AppScreen.TFA_SETUP_VERIFY)}
             className="w-full p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-[2.5rem] shadow-sm flex items-center gap-5 group hover:border-urkio-magenta/40 transition-all active:scale-[0.98]"
           >
              <div className="size-14 rounded-2xl bg-urkio-magenta/10 text-urkio-magenta flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                 <span className="material-symbols-outlined text-3xl">sms</span>
              </div>
              <div className="text-left">
                 <h4 className="text-base font-black text-slate-900 dark:text-white mb-1">SMS Verification</h4>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Standard • Convenient</p>
              </div>
              <span className="material-symbols-outlined text-slate-300 ml-auto group-hover:text-urkio-magenta group-hover:translate-x-1 transition-all">chevron_right</span>
           </button>
        </div>

        <div className="mt-auto p-6 bg-slate-100 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 flex gap-4 animate-in fade-in duration-1000">
           <span className="material-symbols-outlined text-primary text-2xl">info</span>
           <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
             Using an Authenticator app (like Google or Authy) is safer as it works offline and isn't susceptible to SIM swapping.
           </p>
        </div>
      </main>

      <footer className="p-8 text-center bg-white dark:bg-background-dark border-t border-gray-100 dark:border-white/5">
         <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Urkio Secure Protocol 4.2</p>
      </footer>
    </div>
  );
};

export default TfaSetupMethod;
