
import React, { useState, useEffect, useRef } from 'react';
import { AppScreen, Story, Expert } from '../types';

interface Props {
  navigate: (screen: AppScreen, expert?: Expert) => void;
  stories: Story[];
  initialIndex: number;
}

const StoryViewer: React.FC<Props> = ({ navigate, stories, initialIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [msg, setMsg] = useState('');
  
  const currentStory = stories[currentIndex];
  const STORY_DURATION = 5000; // 5 seconds per story

  useEffect(() => {
    if (isPaused) return;

    const interval = 50; // Update every 50ms
    const step = (interval / STORY_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      navigate(AppScreen.COMMUNITY_FEED);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    } else {
      navigate(AppScreen.COMMUNITY_FEED);
    }
  };

  const handleTap = (e: React.MouseEvent) => {
    const x = e.clientX;
    const width = window.innerWidth;
    if (x < width / 3) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  const handleCta = () => {
    if (currentStory.ctaText?.includes('Book')) {
      const mockExpert: Expert = {
        id: 'expert-from-story',
        name: currentStory.userName,
        title: 'Clinical Specialist',
        experience: '10 yrs',
        rating: 4.9,
        reviews: 42,
        image: currentStory.userImage,
        expertise: ['Therapy', 'Resilience']
      };
      navigate(AppScreen.EXPERT_BOOKING, mockExpert);
    } else {
      navigate(AppScreen.RESOURCE_LIBRARY);
    }
  };

  return (
    <div className="relative h-screen w-full bg-black max-w-md mx-auto overflow-hidden font-sans select-none">
      {/* Background Image / Video */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-300"
        style={{ backgroundImage: `url("${currentStory.mediaUrl}")` }}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onClick={handleTap}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
      </div>

      {/* Top Header Layer */}
      <div className="relative z-10 p-4 pt-8">
        {/* Progress Bars */}
        <div className="flex gap-1.5 mb-6 px-1">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-75"
                style={{ 
                  width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%' 
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* User Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className={`size-11 rounded-full p-[2px] ${currentStory.isExpert ? 'urkio-gradient' : 'bg-white/20'}`}>
                <img src={currentStory.userImage} className="size-full rounded-full border-2 border-black object-cover" alt="user" />
             </div>
             <div>
                <div className="flex items-center gap-1.5">
                   <h4 className="text-sm font-black text-white leading-none">{currentStory.userName}</h4>
                   {currentStory.isExpert && <span className="material-symbols-outlined text-[14px] text-primary fill-1">verified</span>}
                </div>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">{currentStory.timestamp}</p>
             </div>
          </div>
          <button 
            onClick={() => navigate(AppScreen.COMMUNITY_FEED)}
            className="size-10 flex items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md border border-white/10"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      {/* Interaction Layer */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 flex flex-col gap-6">
        
        {/* CTA Bar (Special for Experts) */}
        {currentStory.ctaText && (
          <button 
            onClick={handleCta}
            className="w-full h-14 bg-white rounded-2xl flex items-center justify-between px-6 shadow-2xl animate-bounce-slow"
          >
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{currentStory.ctaText}</span>
             <div className="flex items-center gap-2 text-primary">
                <span className="text-[10px] font-black uppercase tracking-widest">Take Action</span>
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
             </div>
          </button>
        )}

        {/* Messaging Bar */}
        <div className="flex gap-3">
           <div className="flex-1 relative">
              <input 
                type="text"
                value={msg}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                onChange={(e) => setMsg(e.target.value)}
                className="w-full h-14 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full px-6 text-sm text-white focus:ring-2 focus:ring-primary/50 placeholder:text-white/40 font-medium"
                placeholder="Send a supportive message..."
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60">
                 <span className="material-symbols-outlined">mood</span>
              </button>
           </div>
           <button className="size-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all">
              <span className="material-symbols-outlined text-2xl">favorite</span>
           </button>
           <button className="size-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all">
              <span className="material-symbols-outlined text-2xl">ios_share</span>
           </button>
        </div>
        <p className="text-center text-[8px] font-black text-white/30 uppercase tracking-[0.3em] pb-6">Private Community Reflection</p>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default StoryViewer;
