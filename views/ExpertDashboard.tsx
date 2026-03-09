
import React, { useState } from 'react';
import { AppScreen } from '../types';
import { BottomNav } from '../components/Navigation';

interface Case {
   id: string;
   clientName: string;
   clientImage: string;
   aiRiskScore: number;
   aiAssessment: string;
   status: 'Critical' | 'Elevated' | 'Stable';
   lastActivity: string;
   unreadCount: number;
   type?: 'AI_HANDOFF' | 'DIRECT';
}

const AI_FLAGGED_CASES: Case[] = [
   {
      id: 'c1',
      clientName: 'Alex Johnson',
      clientImage: 'https://picsum.photos/seed/u4/100/100',
      aiRiskScore: 88,
      aiAssessment: 'Vocal cadence indicates high acute stress. Redirected from AI Guide.',
      status: 'Critical',
      lastActivity: '2m ago',
      unreadCount: 3,
      type: 'AI_HANDOFF'
   },
   {
      id: 'c2',
      clientName: 'Liam Payne',
      clientImage: 'https://picsum.photos/seed/u10/100/100',
      aiRiskScore: 64,
      aiAssessment: 'Sentiment shift detected in morning reflection. Potential burnout.',
      status: 'Elevated',
      lastActivity: '1h ago',
      unreadCount: 1,
      type: 'AI_HANDOFF'
   }
];

interface Props {
   navigate: (s: AppScreen) => void;
   handleLogout: () => void;
   expertTitle?: string;
   language: 'en' | 'ar' | 'fr';
   setLanguage: (lang: 'en' | 'ar' | 'fr') => void;
   isDarkMode: boolean;
   toggleDarkMode: () => void;
}

const ExpertDashboard: React.FC<Props> = ({ navigate, handleLogout, expertTitle = "Functional Dietitian", language, setLanguage, isDarkMode, toggleDarkMode }) => {
   const isDietitian = expertTitle.toLowerCase().includes('dietitian') || expertTitle.toLowerCase().includes('nutrition');
   const [profileComplete, setProfileComplete] = useState(false);
   const [showLogoutModal, setShowLogoutModal] = useState(false);

   const themeGradient = isDietitian ? 'diet-gradient' : 'urkio-gradient';
   const themePrimaryColor = isDietitian ? 'text-urkio-green' : 'text-primary';
   const themeBgColor = isDietitian ? 'bg-urkio-green' : 'bg-primary';
   const themeBorderColor = isDietitian ? 'border-urkio-green/20' : 'border-primary/20';
   const themeShadow = isDietitian ? 'shadow-urkio-green/30' : 'shadow-primary/30';
   const themeIcon = isDietitian ? 'restaurant' : 'hub';

   return (
      <div className="relative flex min-h-screen w-full flex-col bg-background-dark max-w-md mx-auto shadow-2xl pb-40 text-white font-sans overflow-x-hidden transition-colors duration-500">
         <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl p-6 border-b border-white/5">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                  <button
                     onClick={() => navigate(AppScreen.SECURE_PORTAL)}
                     className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95"
                  >
                     <span className="material-symbols-outlined text-2xl">arrow_back</span>
                  </button>
                  <div className={`size-10 rounded-xl bg-white/5 flex items-center justify-center ${themePrimaryColor} border ${themeBorderColor}`}>
                     <span className="material-symbols-outlined text-2xl">{themeIcon}</span>
                  </div>
                  <div>
                     <h1 className="text-lg font-black tracking-tight leading-none mb-1 no-mirror">
                        Urkio {isDietitian ? 'Dietitian' : 'Case Manager'}
                     </h1>
                     <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 no-mirror">Your Journey Within</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button
                     onClick={toggleDarkMode}
                     className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-95 group"
                  >
                     <span className="material-symbols-outlined text-[18px]">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                  </button>
                  <button
                     onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                     className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all active:scale-95"
                  >
                     {language === 'en' ? 'AR' : 'EN'}
                  </button>
                  <button
                     onClick={() => navigate(AppScreen.PROFIT_OVERVIEW)}
                     className={`size-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 ${isDietitian ? 'text-urkio-green' : 'text-emerald-400'}`}
                  >
                     <span className="material-symbols-outlined">payments</span>
                  </button>
                  <button
                     onClick={() => setShowLogoutModal(true)}
                     className="size-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-red-400 hover:bg-red-500/10 transition-all active:scale-95"
                  >
                     <span className="material-symbols-outlined">logout</span>
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
               <button onClick={() => navigate(AppScreen.EXPERT_SCHEDULE)} className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center group hover:bg-white/10 active:scale-95 transition-all">
                  <p className={`text-[8px] font-black uppercase text-slate-500 mb-1 group-hover:${themePrimaryColor}`}>Queue</p>
                  <p className={`text-lg font-black font-display group-hover:${themePrimaryColor}`}>08</p>
               </button>
               <button onClick={() => navigate(AppScreen.EXPERT_DASHBOARD)} className="bg-red-500/5 rounded-2xl p-4 border border-red-500/10 text-center group hover:bg-red-500/10 active:scale-95 transition-all">
                  <p className="text-[8px] font-black uppercase text-red-500 mb-1 group-hover:animate-pulse">AI Flagged</p>
                  <p className="text-lg font-black font-display text-red-500 group-hover:scale-110 transition-transform">02</p>
               </button>
               <button onClick={() => navigate(AppScreen.SPECIALIST_SELECTOR)} className={`bg-white/5 rounded-2xl p-4 border border-white/5 text-center group hover:bg-white/10 active:scale-95 transition-all`}>
                  <p className={`text-[8px] font-black uppercase text-slate-500 mb-1 group-hover:${themePrimaryColor}`}>{isDietitian ? 'Sync' : 'Transfers'}</p>
                  <p className={`text-lg font-black font-display ${themePrimaryColor} group-hover:opacity-80`}>05</p>
               </button>
            </div>
         </header>

         <main className="p-6 space-y-10">
            {/* Profile Onboarding CTA */}
            {!profileComplete && (
               <section className="animate-in fade-in slide-in-from-top-4 duration-700">
                  <div
                     onClick={() => navigate(AppScreen.EXPERT_PROFILE)}
                     className={`relative overflow-hidden bg-slate-900 border-2 rounded-[2.5rem] p-8 shadow-2xl group cursor-pointer active:scale-[0.98] transition-all ${isDietitian ? 'border-urkio-green/40' : 'border-primary/30'
                        }`}
                  >
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                        <span className={`material-symbols-outlined text-8xl ${isDietitian ? 'text-urkio-green' : 'text-primary'}`}>badge</span>
                     </div>
                     <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                           <div className={`size-10 rounded-xl flex items-center justify-center text-white shadow-lg ${themeBgColor}`}>
                              <span className="material-symbols-outlined text-xl">auto_awesome</span>
                           </div>
                           <div>
                              <h3 className="text-base font-black">Build Your {isDietitian ? 'Dietary' : 'Clinical'} Page</h3>
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Visibility: Inactive</p>
                           </div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                           Create your professional identity card. Add your bio, expertise tags, and services to start receiving seeker hand-offs.
                        </p>
                        <div className="flex items-center gap-2">
                           <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full ${themeBgColor} w-[30%]`}></div>
                           </div>
                           <span className={`text-[10px] font-black ${themePrimaryColor}`}>30% Set</span>
                        </div>
                        <button className={`w-full h-12 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl group-hover:scale-[1.02] transition-transform ${isDietitian ? 'bg-urkio-green text-slate-900' : 'bg-white text-slate-900'
                           }`}>
                           Complete Professional Identity
                        </button>
                     </div>
                  </div>
               </section>
            )}

            {/* AI Inquiries */}
            <section className="space-y-6">
               <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                     <span className={`material-symbols-outlined ${themePrimaryColor} fill-1`}>bolt</span>
                     <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">AI Inquiries Queue</h3>
                  </div>
               </div>

               <div className="space-y-4">
                  {AI_FLAGGED_CASES.map(item => (
                     <div
                        key={item.id}
                        onClick={() => navigate(AppScreen.AI_CASE_REPORT)}
                        className={`relative group bg-[#111122] rounded-[2.5rem] p-6 border ${themeBorderColor} shadow-2xl active:scale-[0.98] transition-all cursor-pointer overflow-hidden`}
                     >
                        <div className="relative z-10 flex items-start gap-4 mb-5">
                           <div className={`size-14 rounded-2xl overflow-hidden border-2 shrink-0 ${themeBorderColor}`}>
                              <img src={item.clientImage} className="size-full object-cover" alt={item.clientName} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <h4 className="text-base font-black truncate mb-1">{item.clientName}</h4>
                              <div className="flex items-center gap-2">
                                 <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500" style={{ width: `${item.aiRiskScore}%` }}></div>
                                 </div>
                              </div>
                              <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-1">Risk Intensity: {item.aiRiskScore}</p>
                           </div>
                        </div>
                        <button className={`w-full h-11 ${themeBgColor} text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl`}>
                           Process Handoff
                        </button>
                     </div>
                  ))}
               </div>
            </section>
         </main>

         <BottomNav role="EXPERT" currentScreen={AppScreen.EXPERT_DASHBOARD} navigate={navigate} language={language} />

         {/* Logout Confirmation Modal */}
         {showLogoutModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
               <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowLogoutModal(false)}></div>
               <div className="relative w-full bg-[#111122] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                  <div className="flex flex-col items-center text-center space-y-4">
                     <div className="size-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500">
                        <span className="material-symbols-outlined text-4xl">logout</span>
                     </div>
                     <h3 className="text-xl font-black">Clinical Exit</h3>
                     <p className="text-xs text-slate-400 leading-relaxed px-4">
                        Are you sure you want to terminate your current session? You will need to re-verify your identity to access clinical data.
                     </p>
                  </div>
                  <div className="flex flex-col gap-3">
                     <button
                        onClick={handleLogout}
                        className="w-full h-14 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-all"
                     >
                        Confirm Terminate Session
                     </button>
                     <button
                        onClick={() => setShowLogoutModal(false)}
                        className="w-full h-14 bg-white/5 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-all"
                     >
                        Stay Logged In
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default ExpertDashboard;
