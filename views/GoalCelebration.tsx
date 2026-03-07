
import React, { useEffect, useState } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const GoalCelebration: React.FC<Props> = ({ navigate }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Simulated confetti pieces
  const confetti = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    size: Math.random() * 10 + 5,
    color: i % 3 === 0 ? 'bg-urkio-magenta' : i % 3 === 1 ? 'bg-urkio-blue' : 'bg-accent-cyan',
    rotation: Math.random() * 360,
  }));

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background-dark text-white max-w-md mx-auto shadow-2xl font-sans overflow-hidden">
      {/* Immersive Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[100%] h-[100%] bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-urkio-magenta/20 via-transparent to-transparent opacity-40"></div>
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
              top: '-20px',
              transform: `rotate(${c.rotation}deg)`,
            }}
          ></div>
        ))}
      </div>

      <main className="relative z-20 flex-1 px-8 flex flex-col items-center justify-center text-center">
        {/* Animated Achievement Badge */}
        <div className={`relative mb-10 transition-all duration-1000 transform ${showContent ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-12 opacity-0'}`}>
           <div className="absolute inset-0 bg-primary/40 blur-[80px] animate-pulse"></div>
           <div className="size-48 urkio-gradient rounded-[3.5rem] p-1.5 relative shadow-[0_0_80px_rgba(217,70,239,0.5)]">
              <div className="size-full bg-slate-900 rounded-[3.3rem] border-4 border-white/20 flex flex-col items-center justify-center p-4">
                 <span className="material-symbols-outlined text-7xl text-emerald-400 fill-1 mb-2 animate-bounce">task_alt</span>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Daily Status</p>
                 <p className="text-xl font-black uppercase tracking-tight text-white">Fullfilled</p>
              </div>
           </div>
           
           {/* Floaties */}
           <div className="absolute -top-4 -right-4 size-14 bg-accent-cyan/20 backdrop-blur-md rounded-2xl border border-accent-cyan/30 flex items-center justify-center animate-bounce duration-[2000ms]">
              <span className="material-symbols-outlined text-accent-cyan fill-1 text-2xl">workspace_premium</span>
           </div>
           <div className="absolute -bottom-2 -left-6 size-12 bg-urkio-magenta/20 backdrop-blur-md rounded-2xl border border-urkio-magenta/30 flex items-center justify-center animate-bounce duration-[3000ms]">
              <span className="material-symbols-outlined text-urkio-magenta fill-1 text-2xl">favorite</span>
           </div>
        </div>

        <div className={`space-y-6 transition-all duration-1000 delay-300 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="space-y-2">
            <h1 className="text-5xl font-black font-display tracking-tight leading-none text-white">
              Absolute <br/><span className="text-primary italic">Momentum</span>
            </h1>
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mt-4">100% Commitment Achieved</p>
          </div>
          
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[280px] mx-auto bg-white/5 p-6 rounded-[2rem] border border-white/10 italic">
            "Alex, your consistency today is a profound victory for your future self. Every completed task builds the neuroplasticity required for lasting change."
            <span className="block mt-4 text-[9px] font-black text-primary uppercase tracking-widest">— Dr. Aris Varma</span>
          </p>
        </div>

        {/* Updated Streak Counter */}
        <div className={`mt-12 transition-all duration-1000 delay-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
           <div className="inline-flex items-center gap-4 bg-slate-900/50 backdrop-blur-md px-8 py-5 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <div className="size-14 rounded-2xl bg-urkio-magenta flex items-center justify-center text-white shadow-lg shadow-urkio-magenta/40 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                 <span className="material-symbols-outlined text-3xl fill-1 animate-pulse">local_fire_department</span>
              </div>
              <div className="text-left">
                 <p className="text-4xl font-black font-display text-white tracking-tighter leading-none">5 <span className="text-slate-500 text-xl">Days</span></p>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-urkio-magenta mt-1">Journey Streak</p>
              </div>
           </div>
        </div>

        {/* Action Hub */}
        <div className={`w-full mt-16 space-y-4 transition-all duration-1000 delay-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button 
            onClick={() => navigate(AppScreen.USER_DASHBOARD)}
            className="w-full h-18 urkio-gradient rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            Back to Journey Core
            <span className="material-symbols-outlined">rocket_launch</span>
          </button>
          
          <button 
            onClick={() => navigate(AppScreen.HOMII)}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-primary transition-colors py-4 px-8"
          >
            Reflect on this feeling
          </button>
        </div>
      </main>

      <footer className="p-8 text-center bg-background-dark/80 backdrop-blur-xl border-t border-white/5 relative z-30">
         <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Urkio Rewards System • Empowering Growth</p>
      </footer>

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti-fall {
          animation: confetti-fall 3.5s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default GoalCelebration;
