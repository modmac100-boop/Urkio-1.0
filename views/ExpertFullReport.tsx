
import React, { useState } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const ExpertFullReport: React.FC<Props> = ({ navigate }) => {
  const [activeClinicalNote, setActiveClinicalNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const client = {
    name: "Alex Johnson",
    image: "https://picsum.photos/seed/u4/200/200",
    riskScore: 88,
    status: "Clinical Triage Required"
  };

  const trendData = [
    { day: 'Mon', mood: 70, stress: 30, reflectionId: 'r1' },
    { day: 'Tue', mood: 65, stress: 45, reflectionId: 'r2' },
    { day: 'Wed', mood: 40, stress: 80, reflectionId: 'r3' }, // Critical point
    { day: 'Thu', mood: 50, stress: 60, reflectionId: null },
    { day: 'Fri', mood: 60, stress: 40, reflectionId: 'r4' },
    { day: 'Sat', mood: 80, stress: 20, reflectionId: null },
    { day: 'Sun', mood: 75, stress: 25, reflectionId: 'r5' },
  ];

  const reflections = [
    { id: 'r3', time: 'Wed, 11:45 PM', sentiment: 'Highly Distressed', type: 'Audio', duration: '2:14', summary: 'Patient describing work burnout and physical exhaustion.' },
    { id: 'r1', time: 'Mon, 08:30 AM', sentiment: 'Stable', type: 'Text', summary: 'Starting the week with optimism, focusing on breathing.' }
  ];

  const handleCommit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(AppScreen.ASSIGN_ACTION_PLAN);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background-dark text-white max-w-md mx-auto shadow-2xl font-sans overflow-x-hidden">
      {/* Cinematic Header */}
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(AppScreen.EXPERT_REPORT_RECEIVED)} 
            className="size-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </button>
          <div className="flex flex-col">
             <h2 className="text-lg font-black tracking-tight leading-none mb-1">Full Report Analysis</h2>
             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Decrypted Stream: #AZ-9912</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
           <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
           <span className="text-[8px] font-black text-emerald-500 uppercase">Live Sync</span>
        </div>
      </header>

      <main className="p-6 space-y-10 pb-40 no-scrollbar">
        {/* Client Identity Summary */}
        <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 flex items-center gap-5 shadow-2xl">
           <div className="relative">
              <div className="size-16 rounded-2xl overflow-hidden border-2 border-red-500 shadow-lg">
                 <img src={client.image} className="size-full object-cover" alt={client.name} />
              </div>
              <div className="absolute -bottom-1 -right-1 size-6 bg-red-500 rounded-lg border-2 border-background-dark flex items-center justify-center shadow-lg">
                 <span className="material-symbols-outlined text-white text-[12px] font-black">priority_high</span>
              </div>
           </div>
           <div className="flex-1 min-w-0">
              <h3 className="text-base font-black truncate">{client.name}</h3>
              <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest mb-2">{client.status}</p>
              <div className="flex items-center gap-2">
                 <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{width: `${client.riskScore}%`}}></div>
                 </div>
                 <span className="text-[10px] font-black text-red-500">{client.riskScore}</span>
              </div>
           </div>
        </section>

        {/* Detailed Trend Interaction */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary text-sm">monitoring</span>
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Journey Pulse Analytics</h3>
              </div>
              <div className="flex gap-2">
                 <span className="flex items-center gap-1.5 text-[8px] font-bold text-primary uppercase"><span className="size-1.5 rounded-full bg-primary"></span> Mood</span>
                 <span className="flex items-center gap-1.5 text-[8px] font-bold text-urkio-magenta uppercase"><span className="size-1.5 rounded-full bg-urkio-magenta"></span> Stress</span>
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 h-64 flex items-end justify-between relative group shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
              
              {trendData.map((d, i) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group/bar">
                   <div className="relative flex-1 w-full flex justify-center items-end gap-1">
                      <div 
                        className={`w-1.5 rounded-t-full transition-all duration-1000 ${d.reflectionId ? 'bg-primary shadow-[0_0_15px_rgba(19,91,236,0.5)]' : 'bg-white/10'}`} 
                        style={{ height: `${d.mood}%` }}
                      ></div>
                      <div 
                        className={`w-1.5 rounded-t-full transition-all duration-1000 bg-urkio-magenta opacity-40`} 
                        style={{ height: `${d.stress}%` }}
                      ></div>
                      {d.day === 'Wed' && (
                        <div className="absolute -top-10 flex flex-col items-center animate-bounce">
                           <div className="px-2 py-1 bg-red-500 rounded-lg text-[7px] font-black uppercase text-white shadow-lg">Anomaly</div>
                           <div className="w-[1px] h-4 bg-red-500"></div>
                        </div>
                      )}
                   </div>
                   <p className="text-[9px] font-black text-slate-600 uppercase mt-2 group-hover/bar:text-primary transition-colors">{d.day}</p>
                </div>
              ))}
           </div>
           <p className="text-center text-[9px] text-slate-600 uppercase tracking-widest italic font-medium">Tap bars to jump to linked Homii reflections</p>
        </section>

        {/* Linked Reflections Drill-down */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-urkio-magenta text-sm">mic</span>
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Linked Vocal Reflections</h3>
              </div>
           </div>

           <div className="space-y-4">
              {reflections.map((ref) => (
                <div key={ref.id} className={`p-6 rounded-[2rem] border transition-all ${ref.id === 'r3' ? 'bg-red-500/5 border-red-500/30 shadow-2xl' : 'bg-white/5 border-white/10'}`}>
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{ref.time}</p>
                         <h4 className="text-sm font-black flex items-center gap-2">
                            {ref.type} Entry
                            <span className={`text-[8px] px-2 py-0.5 rounded uppercase ${ref.id === 'r3' ? 'bg-red-500 text-white' : 'bg-primary/20 text-primary'}`}>{ref.sentiment}</span>
                         </h4>
                      </div>
                      <button className="size-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                         <span className="material-symbols-outlined fill-1">play_arrow</span>
                      </button>
                   </div>
                   <p className="text-xs text-slate-400 leading-relaxed italic mb-4">"{ref.summary}"</p>
                   <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest">Linked to Wed Spike</p>
                      <button className="text-[9px] font-black text-slate-500 uppercase hover:text-white">Full Transcript</button>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Real-time Clinical Observations */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 px-1">
              <span className="material-symbols-outlined text-accent-cyan text-sm">clinical_notes</span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Clinical Observations</h3>
           </div>
           <div className="relative group">
              <div className="absolute inset-0 bg-accent-cyan/5 rounded-[2.5rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <textarea 
                 value={activeClinicalNote}
                 onChange={(e) => setActiveClinicalNote(e.target.value)}
                 className="relative w-full min-h-[160px] bg-white/5 border border-white/10 rounded-[2.5rem] p-7 text-sm text-white focus:ring-2 focus:ring-accent-cyan/40 leading-relaxed font-medium placeholder:text-slate-700"
                 placeholder="Begin documenting real-time observations from the data stream..."
              />
           </div>
        </section>

        {/* Clinical Bridge Reassurance */}
        <section className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 flex gap-4">
           <div className="size-10 shrink-0 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <span className="material-symbols-outlined text-xl">verified_user</span>
           </div>
           <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              You are viewing a high-fidelity clinical stream. All interactions and documentation within this report are logged in the <span className="text-emerald-500 font-bold">Audit Vault™</span> for compliance.
           </p>
        </section>
      </main>

      {/* Decision & Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-background-dark/90 backdrop-blur-2xl border-t border-white/10 z-50 flex flex-col gap-4 shadow-[0_-10px_50px_rgba(0,0,0,0.5)]">
        <div className="flex gap-3">
          <button 
             onClick={() => navigate(AppScreen.AI_CASE_REPORT)}
             className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white active:scale-95 transition-all"
          >
             Case Details
          </button>
          <button 
             onClick={() => navigate(AppScreen.EXPERT_CHECKIN_CHAT)}
             className="flex-1 h-14 bg-primary/10 border border-primary/20 rounded-2xl text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white active:scale-95 transition-all"
          >
             Message Alex
          </button>
        </div>
        <button 
          onClick={handleCommit}
          disabled={isSubmitting}
          className="w-full h-16 urkio-gradient rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 active:scale-[0.98] transition-all"
        >
          {isSubmitting ? (
            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              Initialize Plan Presciption
              <span className="material-symbols-outlined text-xl">assignment_add</span>
            </>
          )}
        </button>
      </footer>
    </div>
  );
};

export default ExpertFullReport;
