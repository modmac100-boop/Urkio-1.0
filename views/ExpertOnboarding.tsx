
import React, { useState } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const ExpertOnboarding: React.FC<Props> = ({ navigate }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to the Pro Circle",
      description: "Urkio connects you with a global community seeking holistic guidance. Your expertise is the core of our platform.",
      icon: "verified_user",
      color: "bg-urkio-blue",
    },
    {
      title: "AI-Powered Triage",
      description: "Our Triage Queue uses advanced AI to detect urgent cases and policy violations, helping you prioritize where your attention is needed most.",
      icon: "monitoring",
      color: "bg-red-500",
    },
    {
      title: "Managed Journeys",
      description: "Track client progress seamlessly. From wellness goals to psychological check-ins, keep all your patient data in one secure workspace.",
      icon: "patient_list",
      color: "bg-urkio-magenta",
    },
    {
      title: "Growth & Analytics",
      description: "Monitor your impact and earnings in real-time. Our Profit Tracker helps you manage your professional growth with transparent metrics.",
      icon: "trending_up",
      color: "bg-emerald-500",
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate(AppScreen.AUTH); // Leads to Auth, then onto the new Expert Signup Info flow
    }
  };

  const current = steps[step];

  return (
    <div className="relative h-screen w-full flex flex-col bg-background-dark text-white max-w-md mx-auto overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-20">
        <div className={`absolute top-0 left-0 w-full h-full ${current.color} blur-[120px] transition-colors duration-700`}></div>
      </div>

      <div className="relative z-10 flex flex-col h-full px-8 pt-20 pb-12">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className={`size-28 rounded-3xl ${current.color} flex items-center justify-center shadow-2xl mb-12 transition-colors duration-500 animate-in fade-in zoom-in duration-300`}>
            <span className="material-symbols-outlined text-5xl text-white fill-1">{current.icon}</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-6 tracking-tight font-display animate-in slide-in-from-bottom-4 duration-500">
            {current.title}
          </h1>
          
          <p className="text-slate-400 text-lg leading-relaxed max-w-xs animate-in slide-in-from-bottom-6 duration-700">
            {current.description}
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex justify-center gap-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? `w-8 ${current.color}` : 'w-2 bg-white/20'}`}
              ></div>
            ))}
          </div>

          <div className="flex gap-4">
            {step > 0 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="flex-1 h-16 rounded-2xl bg-white/5 border border-white/10 font-bold text-slate-300 hover:bg-white/10 transition-colors"
              >
                Back
              </button>
            )}
            <button 
              onClick={handleNext}
              className={`flex-[2] h-16 rounded-2xl ${current.color} font-bold text-white shadow-xl transition-all hover:brightness-110 active:scale-95`}
            >
              {step === steps.length - 1 ? "Start Application" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertOnboarding;
