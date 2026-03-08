
import React, { useState } from 'react';
import { UserRole, AppScreen } from '../types';

interface Props {
  onJoin: (role: UserRole) => void;
  navigate: (screen: AppScreen) => void;
  language: 'en' | 'ar' | 'fr';
  setLanguage: (lang: 'en' | 'ar' | 'fr') => void;
}

const UrkioLogo = ({ className = "size-20", color = "url(#logoGradLanding)" }: { className?: string, color?: string }) => (
  <svg className={className} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradLanding" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d946ef" />
        <stop offset="100%" stopColor="#135bec" />
      </linearGradient>
    </defs>
    {/* Base Path */}
    <path
      d="M24 15V80C24 95 36 105 50 105C64 105 76 95 76 80V15"
      stroke={color}
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

const LandingView: React.FC<Props> = ({ onJoin, navigate, language, setLanguage }) => {
  const [activeVariant, setActiveVariant] = useState<'calm' | 'luxe'>('calm');
  const isLuxe = activeVariant === 'luxe';

  const t = language === 'ar' ? {
    welcome: 'مرحباً بكم في',
    memberLabel: 'انضم كعضو',
    expertLabel: 'انضم كخبير',
    alreadyMember: 'هل أنت عضو بالفعل؟',
    signIn: 'تسجيل الدخول',
    calm: 'هادئ',
    luxe: 'فاخر'
  } : language === 'fr' ? {
    welcome: 'Bienvenue sur',
    memberLabel: 'Rejoindre en tant que membre',
    expertLabel: 'Rejoindre en tant qu\'expert',
    alreadyMember: 'Déjà membre ?',
    signIn: 'Se connecter',
    calm: 'Calme',
    luxe: 'Luxe'
  } : {
    welcome: 'Welcome to',
    memberLabel: 'Join as Member',
    expertLabel: 'Join as Expert',
    alreadyMember: 'Already a member?',
    signIn: 'Sign In',
    calm: 'Calm',
    luxe: 'Luxe'
  };

  return (
    <div className={`relative flex h-screen w-full flex-col overflow-hidden max-w-md mx-auto font-sans transition-all duration-1000 ${isLuxe ? 'bg-[#0a0a24]' : 'bg-[#f8f9ff]'}`}>

      {/* Immersive Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute top-[-20%] left-[-10%] w-[120%] h-[120%] transition-opacity duration-1000 ${isLuxe ? 'opacity-30' : 'opacity-100'}`}>
          <div className="absolute top-1/4 left-1/4 size-[500px] bg-urkio-magenta/10 blur-[120px] rounded-full animate-aurora"></div>
          <div className="absolute bottom-1/4 right-1/4 size-[600px] bg-urkio-blue/10 blur-[150px] rounded-full animate-aurora" style={{ animationDelay: '-5s' }}></div>
        </div>
        <div className="absolute inset-0 backdrop-blur-[60px] smooth-aura"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full px-8 py-4">
        {/* Navigation & Variant Toggle */}
        <div className="flex items-center justify-between py-4 z-50">
          <button
            onClick={() => navigate(AppScreen.SECURE_PORTAL)}
            className={`size-10 crystal-glass rounded-xl flex items-center justify-center transition-all group hover:scale-110 active:scale-90 ${isLuxe ? 'text-white/40' : 'text-slate-900/40'}`}
          >
            <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform duration-500">hub</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : language === 'fr' ? 'ar' : 'en')}
              className={`px-3 py-1.5 rounded-xl crystal-glass text-[9px] font-black uppercase tracking-widest transition-all active:scale-90 crystal-btn ${isLuxe ? 'text-white hover:text-primary' : 'text-slate-900 hover:text-primary'}`}
            >
              {language === 'en' ? 'FR' : language === 'fr' ? 'AR' : 'EN'}
            </button>
            <div className={`flex crystal-glass rounded-xl p-1 shadow-lg border ${isLuxe ? 'border-white/10' : 'border-slate-200'}`}>
              <button onClick={() => setActiveVariant('calm')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${!isLuxe ? 'bg-white text-slate-900 shadow-sm' : 'text-white/40'}`}>{t.calm}</button>
              <button onClick={() => setActiveVariant('luxe')} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isLuxe ? 'bg-white/10 text-white shadow-sm' : 'text-slate-900/40'}`}>{t.luxe}</button>
            </div>
          </div>
        </div>

        {/* Hero Branding */}
        <div className="flex flex-col items-center justify-center pt-24 flex-1 w-full">
          <div className="mb-8 relative flex items-center justify-center w-32 h-32 animate-in fade-in zoom-in duration-1000 animate-float text-center">
            <UrkioLogo className="size-24 drop-shadow-2xl mx-auto" />
          </div>
          <div className="flex flex-col items-center text-center w-full">
            <h1 className={`text-[48px] font-black leading-[0.95] text-center tracking-tighter mb-4 font-display transition-colors duration-1000 no-mirror ${isLuxe ? 'text-white' : 'text-slate-900'}`}>
              {t.welcome} <br /><span className="font-bold text-urkio-magenta">Urkio</span>
            </h1>
            <p className={`text-[11px] font-black tracking-[0.6em] uppercase text-center transition-all duration-1000 no-mirror ${isLuxe ? 'text-primary' : 'text-slate-400 opacity-80'}`}>
              Your Journey Within
            </p>
          </div>
        </div>

        {/* Action Hub - Positioned Bottom */}
        <div className="flex flex-col gap-8 mb-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <div className="flex items-center gap-2 p-2 rounded-[2.5rem] crystal-glass border border-white/10 shadow-2xl">
            <button
              onClick={() => onJoin('USER')}
              className="flex-1 h-16 rounded-[2rem] urkio-gradient text-white flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              <span className="material-symbols-outlined text-xl fill-1">person</span>
              {t.memberLabel}
            </button>
            <button
              onClick={() => onJoin('EXPERT')}
              className={`flex-1 h-16 rounded-[2rem] flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all border ${isLuxe ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-900 border-slate-800 text-white shadow-lg'}`}
            >
              <span className="material-symbols-outlined text-xl fill-1">medical_services</span>
              {t.expertLabel}
            </button>
          </div>

          <footer className="text-center">
            <p className={`text-xs font-bold ${isLuxe ? 'text-white/40' : 'text-slate-400'}`}>
              {t.alreadyMember} <span onClick={() => navigate(AppScreen.AUTH)} className="text-primary hover:underline cursor-pointer ml-1 font-black transition-all hover:scale-110 inline-block active:scale-95">{t.signIn}</span>
            </p>
          </footer>
        </div>

      </div>
    </div>
  );
};

export default LandingView;
