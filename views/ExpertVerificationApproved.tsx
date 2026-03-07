
import React, { useEffect, useState } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const ExpertVerificationApproved: React.FC<Props> = ({ navigate }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Simulated confetti pieces
  const confetti = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    size: Math.random() * 10 + 5,
    color: i % 2 === 0 ? 'bg-urkio-magenta' : 'bg-urkio-blue',
    rotation: Math.random() * 360,
  }));

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background-dark text-white max-w-md mx-auto shadow-2xl font-sans overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50"></div>
      </div>

      {/* Confetti Animation Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {confetti.map((c) => (
          <div
            key={c.id}
            className={`absolute rounded-sm animate-confetti-fall ${c.color}`}
            style={{
              left: `${c.left}%`,
              width: `${c.size}px`,
              height: `${c.size / 2}px`,
              animationDelay: `${c.delay}s`,
              top: '-10px',
              transform: `rotate(${c.rotation}deg)`,
            }}
          ></div>
        ))}
      </div>

      <main className="relative z-20 flex-1 px-8 pt-20 pb-12 flex flex-col items-center">
        {/* Animated Badge */}
        <div className={`relative mb-12 transition-all duration-1000 transform ${showContent ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-12 opacity-0'}`}>
           <div className="absolute inset-0 bg-primary/40 blur-[80px] animate-pulse"></div>
           <div className="size-48 urkio-gradient rounded-full p-2 relative shadow-[0_0_60px_rgba(217,70,239,0.4)]">
              <div className="size-full bg-slate-900 rounded-full border-4 border-white flex flex-col items-center justify-center text-center p-4">
                 <span className="material-symbols-outlined text-7xl text-emerald-500 fill-1 mb-2 animate-bounce">verified</span>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Verified</p>
                 <p className="text-[14px] font-black uppercase tracking-tight text-primary">Specialist</p>
              </div>
           </div>
           
           {/* Floaties */}
           <div className="absolute -top-4 -right-4 size-14 bg-accent-cyan/10 backdrop-blur-md rounded-2xl border border-accent-cyan/20 flex items-center justify-center animate-bounce duration-[2000ms]">
              <span className="material-symbols-outlined text-accent-cyan fill-1">star</span>
           </div>
           <div className="absolute -bottom-2 -left-6 size-12 bg-urkio-magenta/10 backdrop-blur-md rounded-2xl border border-urkio-magenta/20 flex items-center justify-center animate-bounce duration-[3000ms]">
              <span className="material-symbols-outlined text-urkio-magenta fill-1">favorite</span>
           </div>
        </div>

        <div className={`text-center space-y-4 transition-all duration-1000 delay-300 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl font-black tracking-tight font-display bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent leading-tight">
            Welcome to the <br/>Inner Circle
          </h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
            Your credentials have been successfully verified. You are now a recognized Urkio Specialist.
          </p>
        </div>

        {/* Milestone Steps */}
        <div className={`w-full mt-12 space-y-4 transition-all duration-1000 delay-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 ml-1">Next Milestones</h3>
          
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex items-center gap-4 hover:bg-white/10 transition-colors">
            <div className="size-11 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
               <span className="material-symbols-outlined text-xl">event_repeat</span>
            </div>
            <div className="flex-1">
               <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">Set Availability</p>
               <p className="text-[10px] text-slate-500 font-medium">Define your clinical hours & break times.</p>
            </div>
            <span className="material-symbols-outlined text-slate-700">chevron_right</span>
          </div>

          <div 
            onClick={() => navigate(AppScreen.EXPERT_PUBLIC_PROFILE)}
            className="bg-white/5 border border-white/10 rounded-3xl p-5 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group"
          >
            <div className="size-11 rounded-xl bg-urkio-magenta/20 text-urkio-magenta flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
               <span className="material-symbols-outlined text-xl">account_box</span>
            </div>
            <div className="flex-1">
               <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">View Pro Profile</p>
               <p className="text-[10px] text-slate-500 font-medium">Preview how seekers see your practice.</p>
            </div>
            <span className="material-symbols-outlined text-slate-700">chevron_right</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex items-center gap-4 hover:bg-white/10 transition-colors">
            <div className="size-11 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
               <span className="material-symbols-outlined text-xl">campaign</span>
            </div>
            <div className="flex-1">
               <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">Introduction</p>
               <p className="text-[10px] text-slate-500 font-medium">Post your first insight to the community.</p>
            </div>
            <span className="material-symbols-outlined text-slate-700">chevron_right</span>
          </div>
        </div>

        <div className={`mt-auto w-full pt-10 space-y-4 transition-all duration-1000 delay-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button 
            onClick={() => navigate(AppScreen.EXPERT_DASHBOARD)}
            className="w-full h-16 urkio-gradient rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            Enter Specialist Dashboard
            <span className="material-symbols-outlined">dashboard</span>
          </button>
        </div>
      </main>

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti-fall {
          animation: confetti-fall 3.5s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default ExpertVerificationApproved;
