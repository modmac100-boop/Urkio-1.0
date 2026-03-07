
import React, { useEffect, useState } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const HallOfFameCelebration: React.FC<Props> = ({ navigate }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const unlockedRewards = [
    { title: 'Exclusive Profile Aura', desc: 'Vibrant gold glowing border for your avatar', icon: 'auto_awesome' },
    { title: 'Hall of Fame Badge', icon: 'military_tech', desc: 'A permanent badge of honor on your profile' },
    { title: 'Priority Feedback', icon: 'bolt', desc: 'Direct priority in expert clinical triages' },
    { title: 'Circle VIP', icon: 'stars', desc: 'Special moderator rights in community circles' },
  ];

  // Simulated golden confetti
  const confetti = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2.5,
    size: Math.random() * 10 + 6,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#020617] text-white max-w-md mx-auto shadow-2xl font-sans overflow-hidden">
      {/* Cinematic Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
      </div>

      {/* Confetti Animation Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {confetti.map((c) => (
          <div
            key={c.id}
            className="absolute rounded-sm animate-confetti-fall bg-yellow-400"
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
        {/* Animated Trophy Visual */}
        <div className={`relative mb-14 transition-all duration-[1500ms] cubic-bezier(0.16, 1, 0.3, 1) transform ${showContent ? 'scale-100 rotate-0 opacity-100 translate-y-0' : 'scale-50 rotate-12 opacity-0 translate-y-20'}`}>
           {/* Golden Halo */}
           <div className="absolute inset-0 bg-yellow-500/40 blur-[120px] animate-pulse"></div>
           
           <div className="relative size-64 flex items-center justify-center">
              {/* Pulsing Aura Rings */}
              <div className="absolute inset-0 border-[3px] border-yellow-500/30 rounded-[5rem] animate-[ping_4s_linear_infinite]"></div>
              <div className="absolute inset-6 border-[3px] border-yellow-500/20 rounded-[4.5rem] animate-[ping_5s_linear_infinite_reverse]"></div>
              
              <div className="size-56 bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-400 rounded-[5rem] p-1.5 shadow-[0_0_100px_rgba(234,179,8,0.4)] relative z-20 overflow-hidden">
                 <div className="size-full bg-[#070b14] rounded-[4.8rem] border-4 border-white/5 flex flex-col items-center justify-center p-6 relative">
                    {/* Golden shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
                    
                    <span className="material-symbols-outlined text-[120px] text-yellow-500 fill-1 mb-2 drop-shadow-[0_0_30px_rgba(234,179,8,0.7)] animate-bounce duration-[3000ms]">emoji_events</span>
                    
                    <div className="space-y-0.5 relative z-10">
                       <p className="text-[11px] font-black uppercase tracking-[0.5em] text-yellow-500/60 leading-none mb-1">The Elite</p>
                       <p className="text-xl font-black uppercase tracking-tight text-white font-display">Hall of Fame</p>
                    </div>
                 </div>
              </div>

              {/* Reward Icons Orbiting */}
              <div className="absolute -top-4 -right-4 size-16 bg-yellow-500/20 backdrop-blur-xl rounded-[2rem] border border-yellow-500/30 flex items-center justify-center shadow-xl animate-pulse">
                 <span className="material-symbols-outlined text-yellow-400 fill-1 text-3xl">military_tech</span>
              </div>
              <div className="absolute -bottom-2 -left-6 size-14 bg-primary/20 backdrop-blur-xl rounded-[1.8rem] border border-primary/30 flex items-center justify-center shadow-xl animate-bounce duration-[4000ms]">
                 <span className="material-symbols-outlined text-primary fill-1 text-2xl">verified</span>
              </div>
           </div>
        </div>

        {/* Proclamation */}
        <div className={`space-y-6 transition-all duration-1000 delay-300 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="space-y-3">
            <h1 className="text-4xl font-black font-display tracking-tight leading-none text-white uppercase italic">
              Elite Community <br/><span className="text-yellow-500">Legend Status</span>
            </h1>
            <p className="text-primary font-black uppercase tracking-[0.5em] text-[11px] mt-6 bg-primary/10 py-2 rounded-full border border-primary/20">Official Induction Ceremony</p>
          </div>
          
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[320px] mx-auto bg-white/5 p-6 rounded-[2.5rem] border border-white/10 italic shadow-inner">
            "Alex, your extraordinary contributions have set a new standard for our circle. Today, we enshrine your journey in the Urkio Hall of Fame."
            <span className="block mt-4 text-[9px] font-black text-yellow-500 uppercase tracking-widest">— Clinical Director Team</span>
          </p>
        </div>

        {/* Unlocked Rewards List */}
        <div className={`w-full mt-12 space-y-4 transition-all duration-1000 delay-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
           <div className="flex items-center gap-2 px-1 mb-4 justify-center">
              <span className="h-[1px] w-8 bg-yellow-500/30"></span>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500">Your New Privileges</h3>
              <span className="h-[1px] w-8 bg-yellow-500/30"></span>
           </div>
           
           <div className="grid grid-cols-1 gap-3">
              {unlockedRewards.map((reward, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-5 p-5 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all border-dashed group"
                >
                   <div className="size-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform shadow-inner">
                      <span className="material-symbols-outlined text-2xl">{reward.icon}</span>
                   </div>
                   <div className="text-left">
                      <h4 className="text-sm font-black text-white">{reward.title}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight mt-0.5">{reward.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Claim Hub */}
        <div className={`w-full mt-14 space-y-4 transition-all duration-1000 delay-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button 
            onClick={() => navigate(AppScreen.USER_DASHBOARD)}
            className="w-full h-18 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-[1.8rem] text-slate-950 font-black text-sm uppercase tracking-widest shadow-[0_20px_50px_rgba(234,179,8,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            Claim Hall of Fame Status
            <span className="material-symbols-outlined font-black">military_tech</span>
          </button>
          
          <button 
            onClick={() => navigate(AppScreen.COMMUNITY_FEED)}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-yellow-500 transition-colors py-4 px-8"
          >
            Continue Community Service
          </button>
        </div>
      </main>

      <footer className="p-10 text-center bg-[#070b14]/90 backdrop-blur-xl border-t border-white/5 relative z-30">
         <div className="flex items-center justify-center gap-6 opacity-40 grayscale mb-4">
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">HIPAA Compliant</span>
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">•</span>
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Elite Verified</span>
         </div>
         <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">Urkio Platinum Tier • Legacy Secured</p>
      </footer>

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti-fall {
          animation: confetti-fall 3.5s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default HallOfFameCelebration;
