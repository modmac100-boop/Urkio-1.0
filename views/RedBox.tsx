
import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const RedBox: React.FC<Props> = ({ navigate }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  const handleAction = (type: string) => {
    setShowFeedback(type);
    setIsRecording(false);
    setTimeout(() => {
      setShowFeedback(null);
      navigate(AppScreen.USER_DASHBOARD);
    }, 3000);
  };

  return (
    <div className="relative h-screen w-full flex flex-col bg-[#050b1a] text-white max-w-md mx-auto overflow-hidden">
      <header className="p-4 flex items-center justify-between border-b border-white/5 bg-background-dark/50 backdrop-blur-md">
        <button onClick={() => navigate(AppScreen.USER_DASHBOARD)} className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5">
          <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
        </button>
        <div className="text-center">
          <p className="text-[10px] font-black tracking-[0.2em] text-urkio-magenta uppercase">Urkio</p>
          <h2 className="text-sm font-bold tracking-tight">The Red Box</h2>
        </div>
        <button className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5">
          <span className="material-symbols-outlined text-[20px] text-accent-cyan">verified_user</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col px-6 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black mb-3 font-display">Your Safe Space</h1>
          <p className="text-slate-400 text-sm font-medium">Talk to yourself, reflect, or vent.</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-12 relative">
          {/* Branded Glow Effect */}
          <div className={`absolute w-72 h-72 bg-urkio-magenta/20 blur-[100px] rounded-full transition-all duration-1000 ${isRecording ? 'scale-150 opacity-100' : 'scale-100 opacity-40'}`}></div>
          <div className={`absolute w-56 h-56 bg-urkio-blue/10 blur-[80px] rounded-full transition-all duration-1000 -translate-x-12 ${isRecording ? 'scale-125' : 'scale-100'}`}></div>
          
          <div className="relative z-10 text-urkio-magenta font-mono text-4xl font-black tracking-[0.2em]">
            {formatTime(timer)}
          </div>

          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`relative z-10 size-36 rounded-full flex items-center justify-center transition-all duration-500 p-2 ${isRecording ? 'bg-urkio-magenta shadow-[0_0_60px_rgba(217,70,239,0.5)]' : 'bg-urkio-magenta/10 border-4 border-urkio-magenta shadow-xl'}`}
          >
            <div className={`size-full rounded-full flex items-center justify-center border-4 border-white/20 ${isRecording ? 'animate-pulse' : ''}`}>
               <span className={`material-symbols-outlined text-6xl fill-1 ${isRecording ? 'text-white' : 'text-urkio-magenta'}`}>
                 {isRecording ? 'pause' : 'fiber_manual_record'}
               </span>
            </div>
          </button>

          <div className="flex gap-12 text-slate-500 relative z-10">
             <button className="flex flex-col items-center gap-2 hover:text-white transition-colors group">
                <div className="size-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary transition-all">
                  <span className="material-symbols-outlined text-2xl">mic</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Audio</span>
             </button>
             <button className="flex flex-col items-center gap-2 hover:text-white transition-colors group">
                <div className="size-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary transition-all">
                  <span className="material-symbols-outlined text-2xl">keyboard</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Type</span>
             </button>
          </div>
        </div>

        <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/5 mb-12 shadow-2xl">
           <div className="flex items-center gap-2 mb-6">
             <span className="material-symbols-outlined text-accent-cyan text-[20px]">security</span>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Reflection Action</span>
           </div>
           <div className="flex gap-3">
             <button 
                onClick={() => handleAction('PRIVATE')}
                className="flex-1 py-4 bg-transparent border-2 border-urkio-magenta rounded-2xl text-[10px] font-black text-urkio-magenta flex items-center justify-center gap-2 hover:bg-urkio-magenta/10 transition-all active:scale-95"
             >
                <span className="material-symbols-outlined text-sm fill-1">shield</span>
                KEEP PRIVATE
             </button>
             <button 
                onClick={() => handleAction('EXPERT')}
                className="flex-1 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-slate-400 flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all active:scale-95"
             >
                <span className="material-symbols-outlined text-sm">medical_services</span>
                SEND TO EXPERT
             </button>
           </div>
        </div>
      </main>

      {showFeedback && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#050b1a]/95 animate-in fade-in duration-300 backdrop-blur-md">
          <div className="text-center px-10">
            <div className="size-24 rounded-full bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
              <span className="material-symbols-outlined text-emerald-500 text-5xl fill-1">check_circle</span>
            </div>
            <h3 className="text-3xl font-black mb-3 font-display">
              {showFeedback === 'PRIVATE' ? 'Saved Securely' : 'Sent to Specialist'}
            </h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              {showFeedback === 'PRIVATE' 
                ? 'Your reflection has been encrypted and stored in your vault.' 
                : 'Your reflection has been forwarded to Dr. Jenkins for review.'}
            </p>
          </div>
        </div>
      )}

      <div className="p-6 pb-12">
        <button 
          onClick={() => isRecording ? handleAction('PRIVATE') : navigate(AppScreen.USER_DASHBOARD)}
          className="w-full h-16 urkio-gradient rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white shadow-2xl shadow-primary/30 active:scale-95 transition-all"
        >
          {isRecording ? 'Stop and Save' : 'Back to Dashboard'}
        </button>
      </div>
    </div>
  );
};

export default RedBox;
