
import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';

interface Participant {
  id: string;
  name: string;
  image: string;
  isExpert?: boolean;
  isSpeaking?: boolean;
  isHandRaised?: boolean;
}

interface Props {
  navigate: (screen: AppScreen) => void;
}

const LiveAudioRoom: React.FC<Props> = ({ navigate }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [reactions, setReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(1440); // 24 minutes

  useEffect(() => {
    const timer = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours > 0 ? hours + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const speakers: Participant[] = [
    { id: 's1', name: 'Dr. Sarah Miller', image: 'https://picsum.photos/seed/sarah/200/200', isExpert: true, isSpeaking: true },
    { id: 's2', name: 'Marcus Chen', image: 'https://picsum.photos/seed/marcus/200/200', isSpeaking: false },
    { id: 's3', name: 'Maya D.', image: 'https://picsum.photos/seed/maya/200/200', isSpeaking: false },
  ];

  const listeners: Participant[] = [
    { id: 'l1', name: 'Alex Johnson', image: 'https://picsum.photos/seed/alex/100/100' },
    { id: 'l2', name: 'Emma W.', image: 'https://picsum.photos/seed/emma/100/100' },
    { id: 'l3', name: 'Liam P.', image: 'https://picsum.photos/seed/liam/100/100' },
    { id: 'l4', name: 'Sophia R.', image: 'https://picsum.photos/seed/sophia/100/100', isHandRaised: true },
    { id: 'l5', name: 'Noah G.', image: 'https://picsum.photos/seed/noah/100/100' },
    { id: 'l6', name: 'Ava M.', image: 'https://picsum.photos/seed/ava/100/100' },
    { id: 'l7', name: 'Oliver B.', image: 'https://picsum.photos/seed/oliver/100/100' },
    { id: 'l8', name: 'Isabella K.', image: 'https://picsum.photos/seed/isabella/100/100' },
    { id: 'l9', name: 'Ethan H.', image: 'https://picsum.photos/seed/ethan/100/100' },
    { id: 'l10', name: 'Zoe T.', image: 'https://picsum.photos/seed/zoe/100/100' },
  ];

  const addReaction = (emoji: string) => {
    const id = Date.now();
    const x = Math.random() * 60 - 30; // Random horizontal drift
    setReactions(prev => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-[#020617] text-white max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
      {/* Immersive Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-primary/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[100%] h-[100%] bg-urkio-magenta/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10"></div>
      </div>

      {/* Cinematic Header */}
      <header className="relative z-10 px-6 pt-12 pb-6 flex items-center justify-between border-b border-white/5 bg-gradient-to-b from-black/40 to-transparent backdrop-blur-md">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
             <div className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Live</span>
             </div>
             <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{formatTime(elapsedSeconds)}</span>
          </div>
          <h2 className="text-xl font-black font-display tracking-tight mt-1">Deep Sleep Science</h2>
        </div>
        <button 
          onClick={() => navigate(AppScreen.SUPPORT_CIRCLES)}
          className="h-11 px-6 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all flex items-center gap-2"
        >
          Leave
          <span className="material-symbols-outlined text-sm">logout</span>
        </button>
      </header>

      {/* Content Area - Hierarchy of Discussion */}
      <main className="relative z-10 flex-1 overflow-y-auto no-scrollbar pt-8 pb-32">
        {/* Active Stage (Speakers) */}
        <section className="px-6 mb-12">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary fill-1">podcasts</span>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">The Stage</h3>
             </div>
             <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">3 Speakers</span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {speakers.map((speaker) => (
              <div key={speaker.id} className={`p-5 rounded-[2.5rem] bg-white/5 border border-white/10 transition-all flex flex-col items-center text-center relative overflow-hidden group ${speaker.isSpeaking ? 'ring-2 ring-primary ring-offset-4 ring-offset-[#020617]' : ''}`}>
                {speaker.isSpeaking && (
                   <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                )}
                
                <div className={`relative size-24 rounded-[3rem] p-1 transition-transform group-hover:scale-105 mb-4 ${speaker.isSpeaking ? 'urkio-gradient shadow-2xl shadow-primary/30' : 'bg-white/10 border border-white/5'}`}>
                  <div className="size-full rounded-[2.8rem] bg-slate-950 border-2 border-[#020617] overflow-hidden">
                    <img src={speaker.image} className="size-full object-cover" alt={speaker.name} />
                  </div>
                  {speaker.isExpert && (
                    <div className="absolute -bottom-1 -right-1 size-8 bg-emerald-500 rounded-2xl border-4 border-[#020617] flex items-center justify-center shadow-lg">
                      <span className="material-symbols-outlined text-white text-[16px] font-black fill-1">verified</span>
                    </div>
                  )}
                  {speaker.isSpeaking && (
                    <div className="absolute -top-1 -right-1 size-7 bg-primary rounded-xl border-4 border-[#020617] flex items-center justify-center shadow-lg">
                       <div className="flex gap-0.5 items-end h-3">
                          <div className="w-1 bg-white animate-[speaker_0.6s_ease-in-out_infinite]"></div>
                          <div className="w-1 bg-white animate-[speaker_0.8s_ease-in-out_infinite_0.1s]"></div>
                          <div className="w-1 bg-white animate-[speaker_0.5s_ease-in-out_infinite_0.2s]"></div>
                       </div>
                    </div>
                  )}
                </div>
                
                <h4 className="text-sm font-black truncate w-full mb-1">{speaker.name}</h4>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{speaker.isExpert ? 'Verified Expert' : 'Member'}</p>
              </div>
            ))}
            
            {/* Stage Placeholder for Interaction */}
            <div className="p-5 rounded-[2.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 hover:bg-white/5 transition-all cursor-pointer">
               <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-3xl">add</span>
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest">Invite to Stage</p>
            </div>
          </div>
        </section>

        {/* Audience Section */}
        <section className="px-6 space-y-6">
          <div className="flex items-center justify-between border-t border-white/5 pt-10">
             <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500">group</span>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Listening Circle</h3>
             </div>
             <p className="text-[10px] font-bold text-slate-500">{listeners.length + 124} people</p>
          </div>

          <div className="grid grid-cols-4 gap-y-8 gap-x-4">
            {/* User Avatar */}
            <div className="flex flex-col items-center">
                <div className="relative size-16 rounded-2xl overflow-hidden border-2 border-primary bg-primary/20 flex items-center justify-center transition-all group active:scale-95 cursor-pointer">
                  <span className="material-symbols-outlined text-primary text-3xl">person</span>
                  {isHandRaised && (
                    <div className="absolute -top-2 -right-2 size-7 bg-urkio-magenta rounded-xl border-4 border-[#020617] flex items-center justify-center animate-bounce shadow-xl shadow-urkio-magenta/30">
                      <span className="material-symbols-outlined text-white text-[12px] font-black fill-1">back_hand</span>
                    </div>
                  )}
                </div>
                <p className="text-[9px] font-black mt-3 text-primary uppercase tracking-tighter">You</p>
            </div>

            {listeners.map((listener) => (
              <div key={listener.id} className="flex flex-col items-center group">
                <div className="relative size-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all cursor-pointer">
                  <img src={listener.image} className="size-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" alt={listener.name} />
                  {listener.isHandRaised && (
                    <div className="absolute -top-2 -right-2 size-6 bg-slate-700 rounded-lg border-2 border-[#020617] flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[10px] fill-1">back_hand</span>
                    </div>
                  )}
                </div>
                <p className="text-[9px] font-bold mt-3 text-slate-500 truncate w-full text-center group-hover:text-slate-300 transition-colors">{listener.name.split(' ')[0]}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Reactions Overlay */}
      <div className="absolute bottom-40 left-1/2 -translate-x-1/2 pointer-events-none w-24 h-64 overflow-hidden z-30">
        {reactions.map(r => (
          <div 
            key={r.id} 
            className="absolute bottom-0 text-4xl animate-reaction-float opacity-0 select-none"
            style={{ left: `calc(50% + ${r.x}px)` }}
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Safety & Encryption Banner */}
      <div className="absolute bottom-28 left-0 right-0 z-20 flex justify-center pointer-events-none">
         <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
            <span className="material-symbols-outlined text-emerald-500 text-[14px] fill-1">verified_user</span>
            <p className="text-[8px] font-black uppercase tracking-[0.1em] text-emerald-500">Secure Audio Session • End-to-End Encrypted</p>
         </div>
      </div>

      {/* Interactive Control Hub */}
      <footer className="relative z-40 px-6 pt-6 pb-12 bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between gap-5">
          {/* Main Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`size-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 active:scale-90 ${isMuted ? 'bg-white/5 text-slate-400 border border-white/10' : 'urkio-gradient text-white shadow-2xl shadow-primary/40'}`}
            >
              <span className="material-symbols-outlined text-2xl fill-1">{isMuted ? 'mic_off' : 'mic'}</span>
            </button>
            <button 
              onClick={() => setIsHandRaised(!isHandRaised)}
              className={`size-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 active:scale-90 ${isHandRaised ? 'bg-urkio-magenta text-white shadow-2xl shadow-urkio-magenta/40 animate-pulse' : 'bg-white/5 text-slate-400 border border-white/10'}`}
            >
              <span className="material-symbols-outlined text-2xl fill-1">back_hand</span>
            </button>
          </div>

          {/* Reaction Bar */}
          <div className="flex-1 flex items-center justify-around bg-white/5 rounded-[1.5rem] px-4 h-16 border border-white/5 backdrop-blur-xl">
            {['❤️', '👏', '🔥', '🙏'].map(emoji => (
              <button 
                key={emoji}
                onClick={() => addReaction(emoji)}
                className="text-2xl hover:scale-150 transition-transform active:scale-95 drop-shadow-lg"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* More Action */}
          <button className="size-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all">
             <span className="material-symbols-outlined text-2xl">more_vert</span>
          </button>
        </div>
      </footer>

      <style>{`
        @keyframes speaker {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
        @keyframes reaction-float {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-300px) scale(1.8); opacity: 0; }
        }
        .animate-reaction-float {
          animation: reaction-float 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
};

export default LiveAudioRoom;
