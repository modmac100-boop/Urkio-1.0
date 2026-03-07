
import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';
import { BottomNav } from '../components/Navigation';
import { analyzeUserSituation } from '../services/geminiService';

const AiCaseReport: React.FC<{ navigate: (s: AppScreen) => void }> = ({ navigate }) => {
  const [decision, setDecision] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);

  const client = {
    name: "Alex Johnson",
    age: 28,
    status: "AI Handoff Required",
    image: "https://picsum.photos/seed/u4/200/200",
  };

  useEffect(() => {
    const runAnalysis = async () => {
      const mockData = {
        name: client.name,
        recentActivity: "High cortisol terminology detected in 3 consecutive reflections. User reporting insomnia and racing thoughts.",
        moodHistory: [8, 7, 9, 8, 9] // 1-10 scale
      };
      const result = await analyzeUserSituation(mockData);
      setAnalysis(result);
      setLoading(false);
    };
    runAnalysis();
  }, []);

  const sentimentMetrics = analysis?.sentimentMetrics || [
    { label: "Anxiety", value: 92 },
    { label: "Stability", value: 14 },
    { label: "Engagement", value: 65 },
    { label: "Urgency", value: 85 }
  ];

  const handleDecision = (type: string) => {
    if (type === 'Transfer') {
      navigate(AppScreen.REFERRAL_HANDOFF);
      return;
    }
    if (type === 'Note') {
      navigate(AppScreen.SPECIALIST_SELECTOR);
      return;
    }
    setDecision(type);
    setTimeout(() => navigate(AppScreen.EXPERT_DASHBOARD), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background-dark text-white">
        <div className="text-center space-y-4">
          <div className="size-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-black uppercase tracking-widest animate-pulse">Neural Triage in Progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark max-w-md mx-auto shadow-2xl pb-40 text-white font-sans overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl p-6 border-b border-white/5">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(AppScreen.EXPERT_DASHBOARD)} 
            className="size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </button>
          <div className="flex-1">
             <h2 className="text-xl font-black font-display tracking-tight leading-none mb-1">Triage Protocol</h2>
             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Case Management Unit</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-3xl p-4">
           <div className="size-16 rounded-2xl overflow-hidden border-2 border-primary shadow-lg shrink-0">
              <img src={client.image} className="size-full object-cover" alt={client.name} />
           </div>
           <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                 <h3 className="text-base font-black truncate">{client.name}</h3>
                 <span className="px-2 py-0.5 bg-primary text-[8px] font-black uppercase rounded shadow-lg shadow-primary/20">Active Handoff</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{width: `${analysis?.readinessScore || 88}%`}}></div>
                 </div>
                 <span className="text-[10px] font-black text-red-500">{analysis?.readinessScore || 88}</span>
              </div>
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-1">Management Priority Score</p>
           </div>
        </div>
      </header>

      <main className="p-6 space-y-10">
        <section className="space-y-4">
           <div className="flex items-center gap-2 px-1">
              <span className="material-symbols-outlined text-primary text-sm">psychology</span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">AI Source Narrative</h3>
           </div>
           <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 text-sm text-slate-300 leading-relaxed font-medium italic">
              "{analysis?.summary || "Analyzing client data..."}"
           </div>
        </section>

        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Clinical Sentiment Heatmap</h3>
           </div>
           <div className="grid grid-cols-2 gap-4">
              {sentimentMetrics.map((m) => (
                <div key={m.label} className="bg-white/5 border border-white/10 rounded-[1.8rem] p-5 flex flex-col items-center text-center">
                   <div className="relative size-16 mb-4 flex items-center justify-center">
                      <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                         <path className="stroke-white/5" strokeDasharray="100, 100" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                         <path className="stroke-primary" strokeDasharray={`${m.value}, 100`} strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute text-[10px] font-black">{m.value}%</span>
                   </div>
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{m.label}</h4>
                </div>
              ))}
           </div>
        </section>

        <section className="bg-primary/10 border border-primary/20 rounded-3xl p-6 flex gap-4">
           <div className="size-10 shrink-0 rounded-xl bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">hub</span>
           </div>
           <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-1">Case Manager Action</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                 Your role is to verify the AI's triage and establish a connection with the appropriate clinical expert. Choose "Transfer" to browse specialists.
              </p>
           </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-background-dark/90 backdrop-blur-2xl border-t border-white/10 z-50 flex flex-col gap-4">
        {decision ? (
          <div className="h-16 flex items-center justify-center animate-in zoom-in duration-300">
             <div className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-widest text-xs">
                <span className="material-symbols-outlined fill-1">check_circle</span>
                Decision Committed: {decision}
             </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <button 
              onClick={() => handleDecision('Note')}
              className="flex-1 h-16 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white active:scale-95 transition-all"
            >
              Send Note to Expert
            </button>
            <button 
              onClick={() => handleDecision('Transfer')}
              className="flex-[2] h-16 urkio-gradient rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              Transfer to Specialist
              <span className="material-symbols-outlined text-[18px]">sync_alt</span>
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};

export default AiCaseReport;
