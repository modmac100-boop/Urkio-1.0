
import React, { useEffect, useState } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const TopSupporterBadge: React.FC<Props> = ({ navigate }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const supportStats = [
    { label: 'Celebrations Sent', value: '156', icon: 'volunteer_activism', color: 'text-urkio-magenta' },
    { label: 'Circle Advice', value: '42', icon: 'forum', color: 'text-primary' },
    { label: 'Supportive Likes', value: '382', icon: 'favorite', color: 'text-accent-cyan' },
    { label: 'Community Pulse', value: 'Top 5%', icon: 'insights', color: 'text-emerald-400' },
  ];

  // Confetti effect (consistent with other achievement screens)
  const confetti = Array.from({ length: 45 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    size: Math.random() * 12 + 4,
    color: i % 3 === 0 ? 'bg-urkio-magenta' : i % 3 === 1 ? 'bg-urkio-blue' : 'bg-emerald-400',
    rotation: Math.random() * 360,
  }));

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#050b1a] text-white max-w-md mx-auto shadow-2xl font-sans overflow-hidden">
      {/* Immersive Atmosphere Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-urkio-magenta/20 via-transparent to-transparent opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10"></div>
      </div>

      {/* Confetti Animation */}
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

      <main className="relative z-20 flex-1 px-8 flex flex-col items-center justify-center text-center py-12">
        {/* Animated Supporter Badge */}
        <div className={`relative mb-14 transition-all duration-1000 transform ${showContent ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-12 opacity-0'}`}>
           <div className="absolute inset-0 bg-urkio-magenta/30 blur-[100px] animate-pulse"></div>
           
           <div className="relative size-56 flex items-center justify-center">
              {/* Pulsing Aura Rings */}
              <div className="absolute inset-0 border-2 border-urkio-magenta/20 rounded-[4.5rem] animate-[ping_4s_linear_infinite]"></div>
              <div className="absolute inset-4 border-2 border-primary/20 rounded-[4rem] animate-[ping_6s_linear_infinite_reverse]"></div>
              
              <div className="size-48 urkio-gradient rounded-[4.5rem] p-1.5 shadow-[0_0_80px_rgba(217,70,239,0.5)] relative z-20 overflow-hidden">
                 <div className="size-full bg-[#0d1a12] rounded-[4.3rem] border-4 border-white/10 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                    {/* Inner shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
                    
                    <span className="material-symbols-outlined text-9xl text-urkio-magenta fill-1 mb-2 drop-shadow-[0_0_15px_rgba(217,70,239,0.6)]">volunteer_activism</span>
                    <div className="space-y-0.5 relative z-10">
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 leading-none mb-1">Status</p>
                       <p className="text-xl font-black uppercase tracking-tight text-white font-display">Top Supporter</p>
                    </div>
                 </div>
              </div>

              {/* Floaties */}
              <div className="absolute -top-6 -right-6 size-16 bg-urkio-magenta/20 backdrop-blur-xl rounded-[2rem] border border-urkio-magenta/30 flex items-center justify-center shadow-xl animate-bounce duration-[2500ms]">
                 <span className="material-symbols-outlined text-urkio-magenta fill-1 text-3xl">favorite</span>
              </div>
              <div className="absolute -bottom-4 -left-8 size-14 bg-primary/20 backdrop-blur-xl rounded-[1.8rem] border border-primary/30 flex items-center justify-center shadow-xl animate-bounce duration-[3500ms]">
                 <span className="material-symbols-outlined text-primary fill-1 text-2xl">celebration</span>
              </div>
           </div>
        </div>

        {/* Proclamation */}
        <div className={`space-y-6 transition-all duration-1000 delay-300 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="space-y-3">
            <h1 className="text-4xl font-black font-display tracking-tight leading-none text-white">
              The Heart <br/><span className="text-urkio-magenta italic">of the Circle</span>
            </h1>
            <p className="text-primary font-black uppercase tracking-[0.5em] text-[10px] mt-6">Community Excellence Award</p>
          </div>
          
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[300px] mx-auto bg-white/5 p-6 rounded-[2.5rem] border border-white/10 italic shadow-inner">
            "Alex, your dedication to uplifting others creates the ripple effect of healing this community was built for. Thank you for your light."
            <span className="block mt-4 text-[9px] font-black text-urkio-magenta uppercase tracking-widest">— Community Guide Team</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className={`w-full mt-12 grid grid-cols-2 gap-4 transition-all duration-1000 delay-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
           {supportStats.map((item) => (
             <div key={item.label} className="bg-white/5 border border-white/10 rounded-[2.2rem] p-5 flex flex-col items-center group hover:bg-white/10 transition-all border-dashed border-white/20">
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
            onClick={() => navigate(AppScreen.USER_PROFILE)}
            className="w-full h-18 urkio-gradient rounded-[1.8rem] text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            Add to Profile Card
            <span className="material-symbols-outlined">badge</span>
          </button>
          
          <button 
            onClick={() => navigate(AppScreen.COMMUNITY_FEED)}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-urkio-magenta transition-colors py-4 px-8"
          >
            Continue Supporting Peers
          </button>
        </div>
      </main>

      <footer className="p-10 text-center bg-[#0d1a12]/80 backdrop-blur-xl border-t border-white/5 relative z-30">
         <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Urkio Altruism Series • Nurture Your Light</p>
      </footer>

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

export default TopSupporterBadge;
