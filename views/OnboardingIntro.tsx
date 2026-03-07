
import React, { useState } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const ONBOARDING_SLIDES = [
  {
    title: "Supportive Community",
    description: "Find safety in a community that understands. Connect with seekers and experts on a shared path to holistic growth.",
    icon: "groups_3",
    color: "from-blue-500/20 to-primary/10",
    iconColor: "text-primary",
    theme: "light"
  },
  {
    title: "Homii",
    description: "Your private vault for vocal reflections. Choose to keep them for yourself or share them with your specialist for deeper insights.",
    icon: "mic",
    color: "from-red-950 to-[#050b1a]",
    iconColor: "text-urkio-magenta",
    theme: "dark"
  },
  {
    title: "Verified Experts",
    description: "Direct access to verified clinical psychologists, nutritionists, and holistic practitioners. Personalized care, simplified.",
    icon: "verified_user",
    color: "from-emerald-500/10 to-blue-500/10",
    iconColor: "text-emerald-500",
    theme: "light"
  }
];

const OnboardingIntro: React.FC<Props> = ({ navigate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const slide = ONBOARDING_SLIDES[currentStep];

  const handleNext = () => {
    if (currentStep < ONBOARDING_SLIDES.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate(AppScreen.ONBOARDING_1);
    }
  };

  return (
    <div className={`relative h-screen w-full flex flex-col transition-colors duration-700 max-w-md mx-auto overflow-hidden font-sans ${slide.theme === 'dark' ? 'bg-[#050b1a] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Dynamic Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.color} opacity-100 transition-all duration-700 blur-[120px]`}></div>

      <div className="relative z-10 flex flex-col h-full px-8 py-12">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className={`size-32 rounded-[3rem] ${slide.theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white shadow-2xl border border-gray-100'} flex items-center justify-center mb-12 animate-in zoom-in duration-500`}>
             <div className={`size-24 rounded-[2.5rem] urkio-gradient p-0.5 shadow-xl`}>
                <div className={`size-full rounded-[2.3rem] flex items-center justify-center ${slide.theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
                   <span className={`material-symbols-outlined text-5xl fill-1 ${slide.iconColor}`}>{slide.icon}</span>
                </div>
             </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-black font-display tracking-tight leading-tight animate-in slide-in-from-bottom-4 duration-500">
              {slide.title}
            </h1>
            <p className={`text-lg font-medium leading-relaxed max-w-xs mx-auto animate-in slide-in-from-bottom-6 duration-700 ${slide.theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {slide.description}
            </p>
          </div>
        </div>

        <div className="space-y-10">
          {/* Progress Indicators */}
          <div className="flex justify-center gap-3">
             {ONBOARDING_SLIDES.map((_, i) => (
               <div 
                 key={i} 
                 className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-10 bg-primary' : `w-2 ${slide.theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}`}
               ></div>
             ))}
          </div>

          {/* Action Hub */}
          <div className="flex flex-col gap-4">
            <button 
              onClick={handleNext}
              className="w-full h-18 urkio-gradient rounded-[2rem] text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {currentStep === ONBOARDING_SLIDES.length - 1 ? 'Start Personalizing' : 'Continue'}
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
            
            {currentStep < ONBOARDING_SLIDES.length - 1 && (
              <button 
                onClick={() => navigate(AppScreen.ONBOARDING_1)}
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors py-2 ${slide.theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}
              >
                Skip Introduction
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Branded Footer Minimal */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none opacity-20">
         <p className="text-[8px] font-black uppercase tracking-[0.5em]">Urkio Clinical Intelligence Protocol</p>
      </div>
    </div>
  );
};

export default OnboardingIntro;
