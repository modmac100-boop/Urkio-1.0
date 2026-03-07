
import React, { useState } from 'react';
import { AppScreen } from '../types';

interface Specialist {
  id: string;
  name: string;
  title: string;
  image: string;
  matchScore: number;
  expertise: string[];
}

const SUGGESTED_SPECIALISTS: Specialist[] = [
  {
    id: 's1',
    name: 'Dr. Elena Rodriguez',
    title: 'Holistic Psychiatrist',
    image: 'https://picsum.photos/seed/elena/150/150',
    matchScore: 98,
    expertise: ['Acute Burnout', 'CBT']
  },
  {
    id: 's2',
    name: 'Marcus Chen',
    title: 'Functional Neurologist',
    image: 'https://picsum.photos/seed/marcus/150/150',
    matchScore: 85,
    expertise: ['Circadian Biology', 'Performance']
  },
  {
    id: 's3',
    name: 'Dr. Aris Varma',
    title: 'Clinical Psychologist',
    image: 'https://picsum.photos/seed/expert/150/150',
    matchScore: 72,
    expertise: ['Anxiety', 'Grounding']
  }
];

const STABILIZATION_STEPS = [
  "Initial AI Risk Assessment Verified",
  "Crisis Intervention Protocol Initiated",
  "Immediate Grounding Techniques Assigned",
  "Safety Plan Established & Encrypted"
];

const ReferralHandoff: React.FC<{ navigate: (s: AppScreen) => void }> = ({ navigate }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [coordinationPlan, setCoordinationPlan] = useState('');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([0]));
  const [priority, setPriority] = useState<'Standard' | 'Urgent'>('Standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleExecuteReferral = () => {
    if (!selectedId) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      setTimeout(() => navigate(AppScreen.EXPERT_DASHBOARD), 2500);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[100] bg-background-dark flex items-center justify-center animate-in fade-in duration-500">
        <div className="text-center px-10 animate-in zoom-in duration-300">
          <div className="size-24 rounded-[2.5rem] urkio-gradient flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/40">
            <span className="material-symbols-outlined text-white text-5xl font-black">sync_alt</span>
          </div>
          <h3 className="text-3xl font-black mb-3 font-display text-white">Coordination Active</h3>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
            The Clinical Coordination Bridge has been established. Alex Johnson's care path is now managed by the selected specialist with full context.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark max-w-md mx-auto shadow-2xl pb-40 text-white font-sans overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(AppScreen.AI_CASE_REPORT)} 
            className="size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </button>
          <div className="flex-1">
             <h2 className="text-xl font-black font-display tracking-tight leading-none mb-1">Clinical Coordination</h2>
             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Hand-off Protocol</p>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-10">
        {/* Client Context Banner */}
        <section className="bg-white/5 border border-white/10 rounded-[2rem] p-5 flex items-center gap-4">
           <img src="https://picsum.photos/seed/u4/100/100" className="size-12 rounded-xl object-cover border border-white/10" alt="Client" />
           <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">Active Journey</p>
              <h4 className="text-sm font-black">Alex Johnson</h4>
           </div>
           <div className="ml-auto flex flex-col items-end">
              <span className="text-red-500 text-[10px] font-black uppercase">Clinical Triage</span>
              <span className="text-[8px] text-slate-600 uppercase">Risk Score: 88</span>
           </div>
        </section>

        {/* Initial Stabilization Steps */}
        <section className="space-y-6">
           <div className="px-1">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Stabilization Actions Taken</h3>
           </div>
           <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 space-y-3">
              {STABILIZATION_STEPS.map((step, i) => (
                <button 
                  key={i}
                  onClick={() => toggleStep(i)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    completedSteps.has(i) 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                    : 'bg-black/20 border-white/5 text-slate-500'
                  }`}
                >
                  <span className={`material-symbols-outlined text-xl ${completedSteps.has(i) ? 'fill-1' : ''}`}>
                    {completedSteps.has(i) ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span className="text-xs font-bold text-left leading-tight">{step}</span>
                </button>
              ))}
           </div>
        </section>

        {/* AI Specialist Matching */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary text-sm">psychology</span>
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Specialist Assignment</h3>
              </div>
              <span className="text-[8px] font-black text-primary uppercase">Best Matching Care</span>
           </div>

           <div className="space-y-4">
              {SUGGESTED_SPECIALISTS.map(s => (
                <div 
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`relative overflow-hidden group p-5 rounded-[2rem] border transition-all cursor-pointer active:scale-[0.98] ${
                    selectedId === s.id 
                      ? 'bg-primary/10 border-primary shadow-2xl shadow-primary/20 scale-[1.02]' 
                      : 'bg-white/5 border-white/10 opacity-70 grayscale-[0.5]'
                  }`}
                >
                   {selectedId === s.id && (
                     <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary text-white rounded-bl-2xl text-[8px] font-black uppercase tracking-widest animate-in fade-in duration-300">
                        Target Specialist
                     </div>
                   )}
                   
                   <div className="flex items-center gap-4 mb-4">
                      <div className="size-14 rounded-2xl overflow-hidden border-2 border-white/10">
                         <img src={s.image} className="size-full object-cover" alt={s.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <h5 className="text-sm font-black truncate">{s.name}</h5>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.title}</p>
                      </div>
                      <div className="text-right">
                         <p className={`text-lg font-black font-display leading-none ${s.matchScore > 90 ? 'text-emerald-500' : 'text-primary'}`}>{s.matchScore}%</p>
                         <p className="text-[7px] font-black uppercase text-slate-600 mt-1">Match</p>
                      </div>
                   </div>
                   
                   <div className="flex flex-wrap gap-2">
                      {s.expertise.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-black/40 rounded text-[8px] font-bold text-slate-400 uppercase">#{tag}</span>
                      ))}
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Clinical Coordination Plan Input */}
        <section className="space-y-6">
           <div className="px-1">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Clinical Coordination Plan</h3>
           </div>
           <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 space-y-6">
              <div className="space-y-3">
                 <label className="text-[9px] font-black uppercase tracking-widest text-primary ml-1">Hand-off Urgency</label>
                 <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
                    {['Standard', 'Urgent'].map(p => (
                      <button 
                        key={p}
                        onClick={() => setPriority(p as any)}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${
                          priority === p ? 'bg-primary text-white shadow-lg' : 'text-slate-500'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[9px] font-black uppercase tracking-widest text-primary ml-1">Coordination Strategy & Continuity Notes</label>
                 <textarea 
                   value={coordinationPlan}
                   onChange={(e) => setCoordinationPlan(e.target.value)}
                   className="w-full bg-black/20 border border-white/5 rounded-2xl p-5 text-xs font-medium focus:ring-2 focus:ring-primary/40 leading-relaxed min-h-[160px]"
                   placeholder="Outline the recommended therapeutic transition plan, including previous triggers identified and specific clinical focus areas for the receiving specialist..."
                 />
              </div>
           </div>
        </section>

        {/* Clinical Bridge Protocol */}
        <section className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 flex gap-4">
           <div className="size-10 shrink-0 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <span className="material-symbols-outlined text-xl">account_tree</span>
           </div>
           <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              Activating <span className="text-emerald-500 font-bold">Urkio Clinical Bridge™</span>. This protocol ensures that all Red Box reflections, sentiment heatmaps, and previous stabilization records are securely migrated to the receiving specialist's workspace.
           </p>
        </section>
      </main>

      {/* Execution Hub */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-background-dark/90 backdrop-blur-2xl border-t border-white/10 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <button 
          onClick={handleExecuteReferral}
          disabled={!selectedId || isProcessing}
          className="w-full h-16 urkio-gradient rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
        >
          {isProcessing ? (
            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              Initialize care Hand-off
              <span className="material-symbols-outlined text-xl">sync_alt</span>
            </>
          )}
        </button>
        <p className="text-center text-[7px] font-black text-slate-600 uppercase tracking-[0.3em] mt-6">Secure Protocol: #COORD-TX-88122 • Confidential Care Hand-off</p>
      </footer>
    </div>
  );
};

export default ReferralHandoff;
