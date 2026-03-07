
import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';
import { suggestActionPlan } from '../services/geminiService';

interface CuratedAction {
  id: string;
  title: string;
  category: 'Nutrition' | 'Mindset' | 'Physical';
  description: string;
  frequency: string;
}

const AssignActionPlan: React.FC<{ navigate: (s: AppScreen) => void }> = ({ navigate }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [customTask, setCustomTask] = useState('');
  const [motivationalNote, setMotivationalNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState<CuratedAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const summary = "Alex Johnson is experiencing high cortisol, insomnia, and racing thoughts. Needs grounding and sleep hygiene.";
      const suggestions = await suggestActionPlan(summary);
      const formatted = suggestions.map((s: any, i: number) => ({
        id: `ai-${i}`,
        ...s
      }));
      setSuggestedActions(formatted);
      setLoading(false);
    };
    fetchSuggestions();
  }, []);

  const toggleAction = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handlePrescribe = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => navigate(AppScreen.EXPERT_DASHBOARD), 2500);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[100] bg-background-dark flex items-center justify-center animate-in fade-in duration-500">
        <div className="text-center px-10 animate-in zoom-in duration-300">
          <div className="size-24 rounded-[2.5rem] urkio-gradient flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/40">
            <span className="material-symbols-outlined text-white text-5xl font-black">task_alt</span>
          </div>
          <h3 className="text-3xl font-black mb-3 font-display text-white">Plan Prescribed</h3>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
            Alex Johnson has been notified of their updated Action Plan. Tasks are now active in their Journey Tracker.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background-dark text-white max-w-md mx-auto shadow-2xl font-sans overflow-x-hidden">
      {/* Clinical Header */}
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(AppScreen.EXPERT_FULL_REPORT)} 
            className="size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </button>
          <div className="flex-1">
             <h2 className="text-xl font-black font-display tracking-tight leading-none mb-1">Prescribe Action</h2>
             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Patient: Alex Johnson</p>
          </div>
        </div>
        <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
           <span className="material-symbols-outlined">assignment</span>
        </div>
      </header>

      <main className="p-6 space-y-10 pb-40 no-scrollbar overflow-y-auto">
        {/* Curated Library Section */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary text-sm">auto_stories</span>
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">AI Suggested Protocol</h3>
              </div>
              <span className="text-[8px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">Gemini Optimized</span>
           </div>

           <div className="space-y-3">
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-white/5 rounded-[2rem]"></div>
                  ))}
                </div>
              ) : (
                suggestedActions.map(action => (
                  <div 
                    key={action.id}
                    onClick={() => toggleAction(action.id)}
                    className={`flex items-start gap-4 p-5 rounded-[2rem] border transition-all cursor-pointer active:scale-[0.98] ${
                      selectedIds.has(action.id) 
                        ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20' 
                        : 'bg-white/5 border-white/5 opacity-70 grayscale-[0.5]'
                    }`}
                  >
                     <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        selectedIds.has(action.id) ? 'bg-primary text-white' : 'bg-white/5 text-slate-500'
                     }`}>
                        <span className="material-symbols-outlined text-2xl">
                           {action.category === 'Nutrition' ? 'restaurant' : action.category === 'Mindset' ? 'psychology' : 'fitness_center'}
                        </span>
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="text-sm font-black truncate">{action.title}</h4>
                           <span className="text-[7px] font-black uppercase tracking-widest text-slate-500">{action.frequency}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{action.description}</p>
                     </div>
                     <div className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        selectedIds.has(action.id) ? 'bg-primary border-primary text-white' : 'border-white/10'
                     }`}>
                        {selectedIds.has(action.id) && <span className="material-symbols-outlined text-sm font-black">check</span>}
                     </div>
                  </div>
                ))
              )}
           </div>
        </section>

        {/* Custom Prescription */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 px-1">
              <span className="material-symbols-outlined text-urkio-magenta text-sm">edit_note</span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Custom Clinical Prescription</h3>
           </div>
           <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 space-y-4">
              <textarea 
                 value={customTask}
                 onChange={(e) => setCustomTask(e.target.value)}
                 className="w-full h-24 bg-black/20 border border-white/5 rounded-2xl p-4 text-xs font-medium focus:ring-2 focus:ring-primary/40 leading-relaxed"
                 placeholder="Define a specific challenge or goal tailored for this patient..."
              />
              <div className="flex gap-2">
                 {['Daily', 'Weekly', 'Target Date'].map(tag => (
                   <button key={tag} className="px-3 py-1.5 bg-white/5 rounded-lg text-[8px] font-black uppercase text-slate-500 hover:text-primary transition-colors border border-white/5">{tag}</button>
                 ))}
              </div>
           </div>
        </section>

        {/* Motivational Note */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 px-1">
              <span className="material-symbols-outlined text-emerald-500 text-sm">favorite</span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Therapeutic Encouragement</h3>
           </div>
           <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6">
              <textarea 
                 value={motivationalNote}
                 onChange={(e) => setMotivationalNote(e.target.value)}
                 className="w-full h-32 bg-transparent border-none p-0 text-sm italic text-slate-300 leading-relaxed font-medium placeholder:text-slate-700 focus:ring-0"
                 placeholder="Alex, your resilience during Wednesday's peak was commendable. These tasks are designed to build your baseline stability..."
              />
           </div>
        </section>

        {/* Audit Reassurance */}
        <section className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 flex gap-4">
           <div className="size-10 shrink-0 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <span className="material-symbols-outlined text-xl">verified_user</span>
           </div>
           <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              Actions are transmitted via the <span className="text-emerald-500 font-bold">Clinical Bridge™</span> and recorded in the patient's therapeutic history for continuity of care.
           </p>
        </section>
      </main>

      {/* Execution Footer */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-background-dark/90 backdrop-blur-2xl border-t border-white/10 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <button 
          onClick={handlePrescribe}
          disabled={selectedIds.size === 0 && !customTask.trim()}
          className="w-full h-18 urkio-gradient rounded-[1.8rem] text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
        >
          {isSubmitting ? (
            <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              Prescribe Action Plan
              <span className="material-symbols-outlined text-xl">send_and_archive</span>
            </>
          )}
        </button>
        <p className="text-center text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mt-6 italic">Secure Transmission Protocol: v4.2.1-SIG</p>
      </footer>
    </div>
  );
};

export default AssignActionPlan;
