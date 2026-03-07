
import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';
import { summarizeExpertNotes } from '../services/geminiService';

interface Props {
  navigate: (screen: AppScreen) => void;
}

interface ActionItem {
  id: string;
  text: string;
  frequency: string;
}

const ExpertSessionRecap: React.FC<Props> = ({ navigate }) => {
  const [clinicalNotes, setClinicalNotes] = useState("Assigned nutritional tasks completed. Patient participated in the microbiome stabilization protocol. Energy baseline significantly improved.");
  const [aiSummary, setAiSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [returnToManager, setReturnToManager] = useState(true);
  const [takeaways, setTakeaways] = useState<string[]>([
    "Fermented food intake increased.",
    "Post-meal blood sugar stabilized."
  ]);
  const [actions, setActions] = useState<ActionItem[]>([
    { id: '1', text: "Log Microbiome Intake", frequency: "Daily" }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const runSummary = async () => {
      if (!clinicalNotes.trim()) return;
      setIsSummarizing(true);
      const summary = await summarizeExpertNotes(clinicalNotes);
      setAiSummary(summary);
      setIsSummarizing(false);
    };
    runSummary();
  }, [clinicalNotes]);

  // Forced green theme for Dietitians
  const isDietitianTheme = true; 
  const themeColor = isDietitianTheme ? 'text-urkio-green' : 'text-primary';
  const themeBg = isDietitianTheme ? 'bg-urkio-green' : 'bg-primary';
  const themeGradient = isDietitianTheme ? 'diet-gradient' : 'urkio-gradient';
  const themeShadow = isDietitianTheme ? 'shadow-urkio-green/30' : 'shadow-primary/30';
  const themeBorder = isDietitianTheme ? 'border-urkio-green/20' : 'border-primary/20';

  const addTakeaway = () => setTakeaways([...takeaways, ""]);
  const updateTakeaway = (index: number, val: string) => {
    const next = [...takeaways];
    next[index] = val;
    setTakeaways(next);
  };

  const addAction = () => setActions([...actions, { id: Date.now().toString(), text: "", frequency: "Select..." }]);
  
  const handleFinalize = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => navigate(AppScreen.EXPERT_DASHBOARD), 2500);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background-dark animate-in fade-in duration-500">
        <div className="text-center px-10">
          <div className="size-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
            <span className="material-symbols-outlined text-emerald-500 text-5xl fill-1 animate-bounce">restaurant</span>
          </div>
          <h3 className="text-3xl font-black mb-3 font-display text-white">Dietary Task Resolved</h3>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            {returnToManager ? 'Expert recap has been returned to the Case Manager for final verification and closure.' : 'Expert recap finalized and shared with the patient.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background-dark text-white max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`size-12 rounded-2xl overflow-hidden border-2 ${themeBorder} shrink-0`}>
             <img src="https://picsum.photos/seed/u4/100/100" className="size-full object-cover" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight leading-none mb-1">Expert Resolution</h2>
            <p className={`text-[10px] ${themeColor} font-black uppercase tracking-[0.2em]`}>Patient: Alex Johnson</p>
          </div>
        </div>
        <div className={`px-3 py-1 ${themeBg} bg-opacity-20 border ${themeBorder} rounded-full text-[9px] font-black uppercase tracking-widest ${themeColor}`}>
           Active Dietitian
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-10 pb-32">
        <section className="space-y-4">
           <div className="flex items-center justify-between ml-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Dietary Outcome</h3>
           </div>
           <textarea 
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className={`w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-5 text-xs font-medium focus:ring-2 focus:ring-${isDietitianTheme ? 'urkio-green' : 'primary'}/40 leading-relaxed`}
              placeholder="Document the resolution for Case Management review..."
           />
           {isSummarizing ? (
             <div className="p-4 bg-white/5 rounded-2xl animate-pulse flex items-center gap-3">
               <div className="size-4 border-2 border-urkio-green/30 border-t-urkio-green rounded-full animate-spin"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-urkio-green">Generating AI Summary...</span>
             </div>
           ) : aiSummary && (
             <div className="p-5 bg-urkio-green/10 border border-urkio-green/20 rounded-3xl">
                <div className="flex items-center gap-2 mb-2">
                   <span className="material-symbols-outlined text-urkio-green text-sm">auto_awesome</span>
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-urkio-green">AI Patient Summary</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">"{aiSummary}"</p>
             </div>
           )}
        </section>

        <section className="space-y-4">
           <div className="flex items-center justify-between ml-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Nutrition Plan Tasks</h3>
              <button onClick={addAction} className={`size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center ${themeColor} active:scale-90`}>
                 <span className="material-symbols-outlined text-sm">add</span>
              </button>
           </div>
           <div className="bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden divide-y divide-white/5">
              {actions.map((action, i) => (
                <div key={action.id} className="p-5 flex items-center justify-between gap-4">
                   <div className="flex-1 space-y-1">
                      <p className="text-xs font-black text-slate-200">{action.text || 'New Nutrient Goal'}</p>
                      <p className={`text-[10px] font-bold ${themeColor} uppercase tracking-widest`}>{action.frequency}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`size-12 rounded-2xl flex items-center justify-center ${returnToManager ? `${themeBg} text-white` : 'bg-slate-800 text-slate-500'}`}>
              <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
            </div>
            <div>
              <p className="text-sm font-black tracking-tight">Management Sync</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Return case for final review
              </p>
            </div>
          </div>
          <button 
            onClick={() => setReturnToManager(!returnToManager)}
            className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${returnToManager ? themeBg : 'bg-slate-700 justify-start'}`}
          >
            <div className="size-4 bg-white rounded-full shadow-lg"></div>
          </button>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-background-dark/80 backdrop-blur-3xl border-t border-white/10 z-50">
         <button 
           disabled={isSubmitting}
           onClick={handleFinalize}
           className={`w-full h-16 ${themeGradient} rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-2xl ${themeShadow} flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50`}
         >
            {isSubmitting ? (
              <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                {returnToManager ? 'Sync & Return to Manager' : 'Finalize & Shared with Patient'}
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </>
            )}
         </button>
      </footer>
    </div>
  );
};

export default ExpertSessionRecap;
