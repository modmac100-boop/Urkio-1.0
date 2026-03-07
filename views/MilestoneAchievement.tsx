
import React, { useEffect, useState } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const MilestoneAchievement: React.FC<Props> = ({ navigate }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const activities = [
    { label: 'Reflections Logged', value: '30', icon: 'mic', color: 'text-urkio-magenta' },
    { label: 'Expert Consultations', value: '4', icon: 'videocam', color: 'text-primary' },
    { label: 'Circle Contributions', value: '12', icon: 'forum', color: 'text-accent-cyan' },
    { label: 'Goal Completion', value: '92%', icon: 'task_alt', color: 'text-emerald-400' },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#020617] text-white max-w-md mx-auto shadow-2xl font-sans overflow-hidden">
      {/* Prestigious Atmosphere Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent opacity-80"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-40"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
      </div>

      <main className="relative z-10 flex-1 px-8 flex flex-col items-center justify-center text-center py-12">
        {/* Milestone Badge Wrapper */}
        <div className={`relative mb-14 transition-all duration-1000 transform ${showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
           {/* Outer Halo */}
           <div className="absolute inset-0 bg-primary/20 blur-[100px] animate-pulse"></div>
           
           <div className="relative size-56 flex items-center justify-center">
              {/* Spinning Ring */}
              <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-[4rem] animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute inset-4 border-b-4 border-primary rounded-[3.5rem] animate-[spin_15s_linear_infinite_reverse]"></div>
              
              <div className="size-48 urkio-gradient rounded-[4rem] p-1.5 shadow-[0_0_80px_rgba(19,91,236,0.5)] relative z-20">
                 <div className="size-full bg-[#050b1a] rounded-[3.8rem] border-4 border-white/10 flex flex-col items-center justify-center p-6">
                    <span className="material-symbols-outlined text-8xl text-emerald-400 fill-1 mb-2 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">workspace_premium</span>
                    <div className="space-y-0.5">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Milestone</p>
                       <p className="text-2xl font-black uppercase tracking-tight text-white font-display">30 Days</p>
                    </div>
                 </div>
              </div>

              {/* Decorative Floaties */}
              <div className="absolute -top-6 -right-6 size-16 bg-emerald-500/20 backdrop-blur-xl rounded-[1.8rem] border border-emerald-500/30 flex items-center justify-center shadow-xl animate-bounce duration-[2500ms]">
                 <span className="material-symbols-outlined text-emerald-400 fill-1 text-3xl">verified</span>
              </div>
              <div className="absolute -bottom-4 -left-8 size-14 bg-primary/20 backdrop-blur-xl rounded-[1.5rem] border border-primary/30 flex items-center justify-center shadow-xl animate-bounce duration-[3500ms]">
                 <span className="material-symbols-outlined text-primary fill-1 text-2xl">bolt</span>
              </div>
           </div>
        </div>

        {/* Title & Proclamation */}
        <div className={`space-y-6 transition-all duration-1000 delay-300 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="space-y-3">
            <h1 className="text-4xl font-black font-display tracking-tight leading-none text-white">
              Consistent <br/><span className="text-emerald-500 italic">Explorer</span>
            </h1>
            <p className="text-primary font-black uppercase tracking-[0.5em] text-[10px] mt-6">Achievement Unlocked</p>
          </div>
          
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[300px] mx-auto bg-white/5 p-6 rounded-[2.5rem] border border-white/10 italic">
            "Alex, thirty days of dedication is where neuroplasticity truly takes root. You've transitioned from 'seeking' to 'embodying' your wellness path."
            <span className="block mt-4 text-[9px] font-black text-primary uppercase tracking-widest">— Clinical Intelligence Team</span>
          </p>
        </div>

        {/* Activity Summary Grid */}
        <div className={`w-full mt-12 grid grid-cols-2 gap-4 transition-all duration-1000 delay-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
           {activities.map((item) => (
             <div key={item.label} className="bg-white/5 border border-white/10 rounded-[2rem] p-5 flex flex-col items-center group hover:bg-white/10 transition-all">
                <div className={`size-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${item.color}`}>
                   <span className="material-symbols-outlined text-2xl fill-1">{item.icon}</span>
                </div>
                <p className="text-xl font-black font-display mb-0.5">{item.value}</p>
                <p className="text-[8px] font-black uppercase text-slate-500 tracking-tighter leading-tight">{item.label}</p>
             </div>
           ))}
        </div>

        {/* Action Hub */}
        <div className={`w-full mt-14 space-y-4 transition-all duration-1000 delay-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button 
            onClick={() => navigate(AppScreen.USER_DASHBOARD)}
            className="w-full h-18 urkio-gradient rounded-[1.8rem] text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            Continue Journey
            <span className="material-symbols-outlined">rocket_launch</span>
          </button>
          
          <button 
            onClick={() => navigate(AppScreen.USER_PROFILE)}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-emerald-500 transition-colors py-4 px-8"
          >
            View My Achievements
          </button>
        </div>
      </main>

      <footer className="p-10 text-center bg-[#050b1a]/80 backdrop-blur-xl border-t border-white/5 relative z-30">
         <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Urkio Prestige Series • Master Your Path</p>
      </footer>
    </div>
  );
};

export default MilestoneAchievement;
