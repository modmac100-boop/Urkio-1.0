
import React from 'react';
import { AppScreen } from '../types';

interface Hotline {
  name: string;
  number: string;
  sms?: string;
  description: string;
  category: string;
}

const HOTLINES: Hotline[] = [
  {
    category: 'Crisis & Suicide',
    name: '988 Suicide & Crisis Lifeline',
    number: '988',
    sms: '988',
    description: 'Free, confidential 24/7 support for people in distress.'
  },
  {
    category: 'Crisis & Suicide',
    name: 'Crisis Text Line',
    number: '741741',
    sms: 'HOME',
    description: 'Text HOME to 741741 to connect with a Crisis Counselor.'
  },
  {
    category: 'Domestic Violence',
    name: 'National Domestic Violence Hotline',
    number: '1-800-799-7233',
    sms: 'START to 88788',
    description: 'Highly trained expert advocates are available 24/7.'
  },
  {
    category: 'Substance Abuse',
    name: 'SAMHSA’s National Helpline',
    number: '1-800-662-4357',
    description: 'Information service for individuals and family members facing mental and/or substance use disorders.'
  },
  {
    category: 'LGBTQ+ Support',
    name: 'The Trevor Project',
    number: '1-866-488-7386',
    sms: 'START to 678-678',
    description: '24/7 crisis support services for LGBTQ young people.'
  }
];

const EmergencySupport: React.FC<{navigate: (s: AppScreen) => void}> = ({ navigate }) => {
  const callNumber = (num: string) => {
    window.location.href = `tel:${num}`;
  };

  const textNumber = (num: string, body?: string) => {
    window.location.href = `sms:${num}${body ? `?body=${encodeURIComponent(body)}` : ''}`;
  };

  const groupedHotlines = HOTLINES.reduce((acc, current) => {
    if (!acc[current.category]) acc[current.category] = [];
    acc[current.category].push(current);
    return acc;
  }, {} as Record<string, Hotline[]>);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-white max-w-md mx-auto shadow-2xl font-sans overflow-x-hidden">
      {/* High-Alert Header */}
      <header className="sticky top-0 z-50 bg-red-600/90 backdrop-blur-xl px-6 pt-10 pb-6 shadow-2xl flex items-center justify-between border-b border-white/20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(AppScreen.USER_DASHBOARD)} 
            className="size-10 flex items-center justify-center rounded-2xl bg-white/20 border border-white/30 active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-white">close</span>
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none mb-1">Emergency Support</h1>
            <p className="text-[10px] font-black uppercase text-white/80 tracking-widest">Immediate Assistance Required</p>
          </div>
        </div>
        <div className="size-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center animate-pulse">
          <span className="material-symbols-outlined text-white fill-1">emergency</span>
        </div>
      </header>

      <main className="p-6 space-y-10 pb-32">
        {/* Immediate 911 Action */}
        <section className="space-y-6">
           <div className="p-8 rounded-[2.5rem] bg-white text-slate-900 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-4 -translate-y-4">
                 <span className="material-symbols-outlined text-9xl">local_police</span>
              </div>
              <div className="relative z-10 text-center">
                 <h2 className="text-2xl font-black font-display mb-2">Life-Threatening Emergency?</h2>
                 <p className="text-slate-500 text-sm font-medium mb-8">If you are in immediate danger, please contact local emergency services right away.</p>
                 <button 
                   onClick={() => callNumber('911')}
                   className="w-full h-20 bg-red-600 rounded-[1.8rem] text-white font-black text-xl uppercase tracking-[0.2em] shadow-2xl shadow-red-600/40 flex items-center justify-center gap-4 hover:bg-red-700 active:scale-[0.98] transition-all"
                 >
                    <span className="material-symbols-outlined text-3xl fill-1">call</span>
                    Call 911
                 </button>
              </div>
           </div>
        </section>

        {/* Hotlines Directory */}
        <section className="space-y-8">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Verified Crisis Hotlines</h3>
           </div>

           {Object.entries(groupedHotlines).map(([category, items]) => (
             <div key={category} className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">{category}</h4>
                <div className="space-y-4">
                   {items.map((item) => (
                     <div key={item.name} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4 group hover:bg-white/10 transition-all">
                        <div>
                           <h5 className="text-base font-black mb-1">{item.name}</h5>
                           <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.description}</p>
                        </div>
                        <div className="flex gap-3 pt-2">
                           <button 
                             onClick={() => callNumber(item.number)}
                             className="flex-1 h-14 bg-white/10 hover:bg-primary rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all"
                           >
                              <span className="material-symbols-outlined text-[20px]">call</span>
                              Call
                           </button>
                           {item.sms && (
                             <button 
                               onClick={() => textNumber(item.number, item.sms === 'HOME' || item.sms === 'START' ? item.sms : undefined)}
                               className="flex-1 h-14 bg-white/10 hover:bg-urkio-magenta rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all"
                             >
                                <span className="material-symbols-outlined text-[20px]">sms</span>
                                Text
                             </button>
                           )}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           ))}
        </section>

        {/* Privacy Note */}
        <section className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 flex gap-4">
           <div className="size-12 shrink-0 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <span className="material-symbols-outlined text-2xl fill-1">verified_user</span>
           </div>
           <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-1">Your Privacy Matters</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                 Calls and texts to these services are confidential. Urkio does not log the content of these interactions. Your safety is our primary concern.
              </p>
           </div>
        </section>
      </main>

      {/* Footer Branded Reassurance */}
      <footer className="mt-auto p-8 text-center bg-background-dark border-t border-white/5">
         <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Urkio Safety Network • You Are Not Alone</p>
      </footer>
    </div>
  );
};

export default EmergencySupport;
