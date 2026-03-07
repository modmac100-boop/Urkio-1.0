
import React, { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

const UrkioLogoSplash = ({ isAnimating }: { isAnimating: boolean }) => (
  <svg
    className={`size-32 drop-shadow-2xl transition-all duration-[2000ms] cubic-bezier(0.16, 1, 0.3, 1) ${isAnimating ? 'translate-y-[-20px] scale-110' : 'translate-y-0 scale-100'
      }`}
    viewBox="0 0 100 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logoGradSplash" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d946ef" />
        <stop offset="100%" stopColor="#135bec" />
      </linearGradient>
    </defs>
    {/* Base Path */}
    <path
      d="M24 15V80C24 95 36 105 50 105C64 105 76 95 76 80V15"
      stroke="url(#logoGradSplash)"
      strokeWidth="30"
      strokeLinecap="round"
    />
    {/* Shadow Track */}
    <path
      d="M24 80C24 95 36 105 50 105"
      stroke="black"
      strokeOpacity="0.1"
      strokeWidth="30"
      strokeLinecap="round"
    />
    {/* Shining Edge */}
    <path
      d="M24 15V80C24 95 36 105 50 105C64 105 76 95 76 80V15"
      stroke="white"
      strokeWidth="32"
      strokeLinecap="round"
      strokeOpacity="0.6"
      className="animate-logo-shine"
    />
  </svg>
);

const SplashView: React.FC<Props> = ({ onComplete }) => {
  const [stage, setStage] = useState<'IDLE' | 'LOGO_MOVE' | 'TEXT_REVEAL' | 'FINISHING'>('IDLE');

  useEffect(() => {
    // Start animation sequence
    const t1 = setTimeout(() => setStage('LOGO_MOVE'), 300);
    const t2 = setTimeout(() => setStage('TEXT_REVEAL'), 1200);
    const t3 = setTimeout(() => setStage('FINISHING'), 2800);
    const t4 = setTimeout(() => onComplete(), 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#050b1a] overflow-hidden">
      {/* Background Aura */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${stage !== 'IDLE' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/10 blur-[150px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] bg-urkio-magenta/10 blur-[120px] rounded-full animate-aurora"></div>
      </div>

      <div className="relative flex flex-col items-center w-full">
        {/* Logo Animation */}
        <div className="flex justify-center w-full">
          <UrkioLogoSplash isAnimating={stage === 'LOGO_MOVE' || stage === 'TEXT_REVEAL' || stage === 'FINISHING'} />
        </div>

        {/* Text Appearance */}
        <div className={`mt-8 flex flex-col items-center transition-all duration-1000 transform ${stage === 'TEXT_REVEAL' || stage === 'FINISHING'
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-10 opacity-0 scale-95'
          }`}>
          <h1 className="text-6xl font-black font-display tracking-tighter text-white drop-shadow-2xl text-center">
            Urkio
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-primary mt-2 text-center opacity-80">
            Your Journey Within
          </p>
        </div>
      </div>

      {/* Progress Sync Pulse */}
      <div className={`absolute bottom-20 transition-opacity duration-500 ${stage === 'FINISHING' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <div className="size-1 bg-primary rounded-full animate-bounce [animation-delay:0ms]"></div>
            <div className="size-1 bg-primary rounded-full animate-bounce [animation-delay:200ms]"></div>
            <div className="size-1 bg-primary rounded-full animate-bounce [animation-delay:400ms]"></div>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Initializing Secure Port...</p>
        </div>
      </div>

      {/* Wipe effect on finish */}
      <div className={`absolute inset-0 bg-white transition-transform duration-700 ease-in-out z-[1100] ${stage === 'FINISHING' ? 'translate-y-0' : 'translate-y-full'
        }`}></div>
    </div>
  );
};

export default SplashView;
