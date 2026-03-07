
import React from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const ExpertWellnessReportReceived: React.FC<Props> = ({ navigate }) => {
  const reportDetails = {
    clientName: "Alex Johnson",
    clientImage: "https://picsum.photos/seed/u4/200/200",
    receivedTime: "2 minutes ago",
    dataPackage: [
      { label: "Mood Sentiment Trends", icon: "trending_up", status: "Ready" },
      { label: "Habit & Goal Progress", icon: "checklist", status: "Ready" },
      { label: "Biometric Data Stream", icon: "vital_signs", status: "Ready" },
      { label: "Homii Clinical Transcripts", icon: "mic", status: "Encrypted", locked: true }
    ],
    aiFlags: [
      { type: "Critical", label: "Cortisol Spike Pattern", icon: "priority_high" },
      { type: "Warning", label: "Reduced Sleep Latency", icon: "bedtime" }
    ]
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background-dark text-white max-w-md mx-auto shadow-2xl font-sans overflow-hidden">
      {/* Immersive Tactical Backdrop */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-primary/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 size-64 bg-urkio-magenta/5 blur-[100px]"></div>
      </div>

      <header className="relative z-10 px-6 pt-12 pb-6 border-b border-white/5 bg-background-dark/40 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(AppScreen.EXPERT_DASHBOARD)} 
            className="size-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-slate-400">arrow_back_ios_new</span>
          </button>
          <div>
            <h2 className="text-xl font-black font-display tracking-tight leading-none mb-1">Incoming Signal</h2>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Wellness Data Transfer</p>
          </div>
        </div>
        <div className="size-11 rounded-2xl bg-primary/20 text-primary flex items-center justify-center border border-primary/20 animate-pulse">
           <span className="material-symbols-outlined fill-1">download_done</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-y-auto no-scrollbar p-6 space-y-10">
        {/* Notification Alert Header */}
        <section className="text-center py-4 animate-in fade-in zoom-in duration-500">
           <div className="size-20 rounded-[2rem] urkio-gradient p-1 mx-auto mb-6 shadow-2xl">
              <div className="size-full rounded-[1.8rem] border-4 border-background-dark overflow-hidden">
                 <img src={reportDetails.clientImage} className="size-full object-cover" alt={reportDetails.clientName} />
              </div>
           </div>
           <h3 className="text-2xl font-black mb-1 font-display">{reportDetails.clientName}</h3>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Shared a Weekly Wellness Report</p>
           <p className="text-[9px] font-bold text-primary mt-2 uppercase tracking-widest">{reportDetails.receivedTime}</p>
        </section>

        {/* AI Flag Quickview */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 px-1">
              <span className="material-symbols-outlined text-red-500 text-sm">emergency</span>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">AI Priority Flags</h4>
           </div>
           <div className="grid grid-cols-1 gap-3">
              {reportDetails.aiFlags.map((flag, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 bg-red-500/5 border border-red-500/20 rounded-3xl animate-in slide-in-from-right duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                   <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
                         <span className="material-symbols-outlined">{flag.icon}</span>
                      </div>
                      <div>
                         <h5 className="text-sm font-black">{flag.label}</h5>
                         <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest">{flag.type} Concern</p>
                      </div>
                   </div>
                   <span className="material-symbols-outlined text-red-300 text-xl">priority_high</span>
                </div>
              ))}
           </div>
        </section>

        {/* Data Package Summary */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 px-1">
              <span className="material-symbols-outlined text-primary text-sm">clinical_notes</span>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Report Payload</h4>
           </div>
           <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden divide-y divide-white/5">
              {reportDetails.dataPackage.map((item, idx) => (
                <div key={idx} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-all">
                   <div className="flex items-center gap-4">
                      <div className={`size-12 rounded-2xl flex items-center justify-center ${item.locked ? 'bg-slate-800 text-slate-500' : 'bg-primary/10 text-primary'}`}>
                         <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                      </div>
                      <div>
                         <h5 className="text-sm font-black">{item.label}</h5>
                         <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[8px] font-black uppercase tracking-widest ${item.locked ? 'text-slate-500' : 'text-emerald-500'}`}>{item.status}</span>
                            {item.locked && <span className="material-symbols-outlined text-[12px] text-slate-500">lock</span>}
                         </div>
                      </div>
                   </div>
                   {!item.locked && <span className="material-symbols-outlined text-slate-700">check_circle</span>}
                </div>
              ))}
           </div>
        </section>

        {/* Security Reassurance */}
        <section className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 flex gap-4">
           <div className="size-10 shrink-0 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <span className="material-symbols-outlined text-xl fill-1">verified_user</span>
           </div>
           <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              Report decrypted using <span className="text-emerald-500 font-bold">Clinical Bridge™</span> Protocol. Patient identity verified via biometric signature.
           </p>
        </section>
      </main>

      <footer className="p-6 bg-background-dark/90 backdrop-blur-2xl border-t border-white/10 z-50">
         <button 
           onClick={() => navigate(AppScreen.EXPERT_FULL_REPORT)}
           className="w-full h-18 urkio-gradient rounded-[1.8rem] text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 active:scale-[0.98] transition-all"
         >
           Analyze Full Report
           <span className="material-symbols-outlined text-xl">analytics</span>
         </button>
         <button 
           onClick={() => navigate(AppScreen.EXPERT_DASHBOARD)}
           className="w-full h-12 mt-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors"
         >
           Ignore for Now
         </button>
      </footer>
    </div>
  );
};

export default ExpertWellnessReportReceived;
