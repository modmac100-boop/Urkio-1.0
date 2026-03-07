
import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
  eventName: string;
  hostName: string;
}

export const LiveEventBanner: React.FC<Props> = ({ navigate, eventName, hostName }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Delay appearance to grab attention after the main content loads
    const timer = setTimeout(() => setIsVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isDismissed || !isVisible) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-[100] px-5 animate-in slide-in-from-top-full duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] max-w-md mx-auto">
      {/* Glow Backdrop */}
      <div className="absolute inset-x-8 -inset-y-4 bg-primary/20 blur-3xl rounded-full opacity-50 animate-pulse"></div>
      
      <div className="relative group">
        {/* Animated Gradient Border Layer */}
        <div className="absolute -inset-[1px] urkio-gradient rounded-[1.5rem] opacity-30 group-hover:opacity-100 transition-opacity blur-[1px]"></div>
        
        <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[1.5rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 dark:border-white/5 overflow-hidden">
          
          {/* Internal Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer pointer-events-none"></div>

          <div className="flex items-center gap-4 relative z-10">
            {/* Live Indicator Icon */}
            <div className="relative shrink-0">
               <div className="size-14 rounded-2xl urkio-gradient flex items-center justify-center text-white shadow-xl shadow-primary/20 relative z-10">
                  <span className="material-symbols-outlined text-2xl fill-1">podcasts</span>
               </div>
               {/* Pulsing Rings */}
               <span className="absolute inset-0 rounded-2xl bg-primary/40 animate-ping"></span>
               <span className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping [animation-delay:400ms]"></span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-md">
                   <div className="size-1.5 bg-red-500 rounded-full animate-pulse"></div>
                   <span className="text-[8px] font-black uppercase tracking-widest text-red-500">Live Session</span>
                </div>
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <img key={i} src={`https://picsum.photos/seed/u${i+50}/40/40`} className="size-4 rounded-full border border-white dark:border-slate-800 object-cover" />
                   ))}
                   <div className="size-4 rounded-full bg-slate-100 dark:bg-slate-800 border border-white dark:border-slate-800 flex items-center justify-center text-[5px] font-black text-slate-500">+1.2k</div>
                </div>
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white truncate leading-tight group-hover:text-primary transition-colors">{eventName}</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">Hosted by <span className="text-primary">{hostName}</span></p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate(AppScreen.LIVE_AUDIO_ROOM)}
                className="h-11 px-6 urkio-gradient text-white rounded-xl text-[10px] font-black uppercase tracking-[0.1em] shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                Join
                <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
              </button>
              <button 
                onClick={() => setIsDismissed(true)}
                className="size-11 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
