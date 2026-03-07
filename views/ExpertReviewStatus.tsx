
import React from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const ExpertReviewStatus: React.FC<Props> = ({ navigate }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background-dark text-white max-w-md mx-auto shadow-2xl font-sans overflow-hidden">
      {/* Immersive Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full urkio-gradient opacity-5 blur-[120px]"></div>
      
      <main className="relative z-10 flex-1 px-8 pt-20 pb-12 flex flex-col items-center text-center">
        <div className="relative mb-10">
           <div className="absolute inset-0 bg-primary/30 blur-[80px] animate-pulse"></div>
           <div className="size-28 rounded-[2.5rem] urkio-gradient flex items-center justify-center shadow-2xl relative z-10 border-4 border-white/10">
             <span className="material-symbols-outlined text-6xl text-white fill-1">clinical_notes</span>
           </div>
        </div>

        <h1 className="text-4xl font-black tracking-tight mb-4 font-display leading-tight">Reviewing Your <br/><span className="text-primary italic">Clinical Path</span></h1>
        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto mb-14">
          Urkio Management has received your credentials. Our specialized review board is currently verifying your professional licenses.
        </p>

        {/* Verification Timeline - More Administrative Style */}
        <div className="w-full space-y-10 mb-12">
          <div className="flex gap-6 items-start text-left">
            <div className="relative">
               <div className="size-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                 <span className="material-symbols-outlined text-emerald-500 text-xl font-black">check</span>
               </div>
               <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1px] h-6 bg-emerald-500/20"></div>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500">Submission Received</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">Full profile & letter captured</p>
            </div>
          </div>

          <div className="flex gap-6 items-start text-left">
            <div className="relative">
               <div className="size-10 rounded-2xl bg-primary/20 border-2 border-primary flex items-center justify-center shrink-0 animate-pulse shadow-lg shadow-primary/20">
                 <span className="material-symbols-outlined text-primary text-xl">admin_panel_settings</span>
               </div>
               <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1px] h-6 bg-white/5"></div>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary">Management Triage</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">Clinical Scrutiny in progress</p>
            </div>
          </div>

          <div className="flex gap-6 items-start text-left opacity-30 grayscale">
            <div className="size-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-slate-500 text-xl">verified</span>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Verified Specialist</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">Unlock Practice Dashboard</p>
            </div>
          </div>
        </div>

        {/* Administrative Notice */}
        <div className="w-full p-6 bg-white/5 border border-white/10 rounded-[2rem] mb-10 text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:rotate-0 transition-transform">
             <span className="material-symbols-outlined text-6xl">gavel</span>
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-4">
               <span className="material-symbols-outlined text-primary">policy</span>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Board Policy</p>
             </div>
             <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
               During this clinical review phase, your profile remains in <span className="text-white font-bold">Staging Mode</span>. Once management approves your credentials, you will receive a global notification and full practice access.
             </p>
          </div>
        </div>

        {/* DEMO BUTTON: Simulator for Approval */}
        <div className="w-full space-y-4 mt-auto">
          <button 
            onClick={() => navigate(AppScreen.EXPERT_VERIFICATION_APPROVED)}
            className="w-full p-4 rounded-2xl border border-dashed border-primary/30 text-primary/60 text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all active:scale-95"
          >
            [ Simulation: Approve by Management ]
          </button>

          <button 
            onClick={() => navigate(AppScreen.COMMUNITY_FEED)}
            className="w-full h-16 urkio-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            Browse Community Feed
            <span className="material-symbols-outlined">forum</span>
          </button>
        </div>
      </main>
      
      <footer className="p-10 text-center relative z-10 bg-background-dark/80 backdrop-blur-xl border-t border-white/5">
        <div className="flex items-center justify-center gap-6 opacity-40 grayscale">
           <span className="text-[8px] font-black uppercase tracking-[0.4em]">Official Review Board</span>
           <span className="text-[8px] font-black uppercase tracking-[0.4em]">•</span>
           <span className="text-[8px] font-black uppercase tracking-[0.4em]">ID: #82910-URK</span>
        </div>
      </footer>
    </div>
  );
};

export default ExpertReviewStatus;
