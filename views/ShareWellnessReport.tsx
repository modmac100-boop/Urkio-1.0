
import React, { useState } from 'react';
import { AppScreen, Expert } from '../types';

interface Props {
  navigate: (screen: AppScreen, expert?: Expert) => void;
}

const MOCK_EXPERTS: Expert[] = [
  { id: '1', name: 'Dr. Sarah Jenkins', title: 'Clinical Psychologist', experience: '12 yrs exp', rating: 4.8, reviews: 124, image: 'https://picsum.photos/seed/jenk/200/200', expertise: ['Anxiety', 'CBT'] },
  { id: '2', name: 'Mark Thompson', title: 'Functional Nutritionist', experience: '8 yrs exp', rating: 4.9, reviews: 89, image: 'https://picsum.photos/seed/mark/200/200', expertise: ['Gut Health', 'Sports Nutrition'] }
];

const ShareWellnessReport: React.FC<Props> = ({ navigate }) => {
  const [selectedExpertIds, setSelectedExpertIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [privacySettings, setPrivacySettings] = useState({
    includeTranscripts: false,
    includeBiometrics: true,
    includeGoals: true,
    includeMoodHeatmap: true
  });

  const toggleExpert = (id: string) => {
    setSelectedExpertIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePrivacy = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleShare = () => {
    if (selectedExpertIds.size === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      setTimeout(() => navigate(AppScreen.USER_PROFILE), 2500);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[100] bg-background-dark flex items-center justify-center animate-in fade-in duration-500">
        <div className="text-center px-10 animate-in zoom-in duration-300">
          <div className="size-24 rounded-[2.5rem] urkio-gradient flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/40">
            <span className="material-symbols-outlined text-white text-5xl font-black">send_and_archive</span>
          </div>
          <h3 className="text-3xl font-black mb-3 font-display text-white">Report Shared</h3>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
            Your clinical data has been securely encrypted and transmitted to your selected experts.
          </p>
          <div className="mt-10 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
             <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Receipt ID</p>
             <p className="text-xs font-mono text-primary uppercase">RP-URK-8291-SUCCESS</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl font-sans overflow-x-hidden">
      {/* Immersive Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/95 backdrop-blur-xl px-6 pt-12 pb-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(AppScreen.USER_PROFILE)} 
            className="size-11 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent dark:border-white/5 active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-slate-500">arrow_back_ios_new</span>
          </button>
          <div>
            <h2 className="text-xl font-black font-display tracking-tight">Wellness Report</h2>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary leading-none">Oct 17 – Oct 24, 2024</p>
          </div>
        </div>
        <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
           <span className="material-symbols-outlined fill-1">clinical_notes</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 pb-40">
        {/* Report Summary Card */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
              <div className="relative z-10 flex flex-col gap-6">
                 <div className="flex justify-between items-start">
                    <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-accent-cyan border border-white/20">Summary Data</div>
                    <span className="material-symbols-outlined text-white/20 text-3xl">analytics</span>
                 </div>
                 <div>
                    <h3 className="text-2xl font-black font-display leading-tight mb-2">Weekly Journey Pulse</h3>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">A comprehensive overview of your mood peaks, goal consistency, and sleep quality for professional clinical review.</p>
                 </div>
                 <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                       <p className="text-xl font-black text-emerald-400">88%</p>
                       <p className="text-[8px] font-black uppercase text-slate-500 mt-1">Goal Success</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                       <p className="text-xl font-black text-primary">Stable</p>
                       <p className="text-[8px] font-black uppercase text-slate-500 mt-1">Mood Baseline</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Expert Selection */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary text-sm">group</span>
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Recipient Selection</h3>
              </div>
              <span className="text-[8px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">Verified Only</span>
           </div>

           <div className="space-y-4">
              {MOCK_EXPERTS.map(expert => (
                <div 
                  key={expert.id}
                  onClick={() => toggleExpert(expert.id)}
                  className={`flex items-center gap-4 p-5 rounded-[2rem] border transition-all cursor-pointer active:scale-[0.98] ${
                    selectedExpertIds.has(expert.id) 
                      ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20 scale-[1.02]' 
                      : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-white/5'
                  }`}
                >
                   <div className="size-14 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm shrink-0">
                      <img src={expert.image} className="size-full object-cover" alt={expert.name} />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black truncate text-slate-900 dark:text-white leading-tight mb-0.5">{expert.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{expert.title}</p>
                   </div>
                   <div className={`size-8 rounded-xl flex items-center justify-center transition-all ${selectedExpertIds.has(expert.id) ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-300'}`}>
                      <span className="material-symbols-outlined text-xl">{selectedExpertIds.has(expert.id) ? 'check' : 'add'}</span>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Granular Privacy Toggles */}
        <section className="space-y-6">
           <div className="flex items-center gap-2 px-1">
              <span className="material-symbols-outlined text-urkio-magenta text-sm">visibility</span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Granular Privacy Controls</h3>
           </div>

           <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-[2.5rem] overflow-hidden divide-y divide-gray-50 dark:divide-white/5">
              {[
                { key: 'includeMoodHeatmap', label: 'Mood Sentiment Trends', icon: 'trending_up', desc: 'Visualization of emotional shifts' },
                { key: 'includeGoals', label: 'Habit & Goal Progress', icon: 'checklist', desc: 'Weekly completion rates' },
                { key: 'includeBiometrics', label: 'Biometric Data', icon: 'vital_signs', desc: 'Sleep and heart rate signals' },
                { key: 'includeTranscripts', label: 'Homii Transcripts', icon: 'mic', desc: 'Full text of private reflections', warning: true },
              ].map((item) => (
                <div key={item.key} className="p-6 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                   <div className="flex items-center gap-4">
                      <div className={`size-12 rounded-2xl flex items-center justify-center ${privacySettings[item.key as keyof typeof privacySettings] ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                         <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                      </div>
                      <div>
                         <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight mb-1">{item.label}</h4>
                         <p className={`text-[10px] font-bold uppercase tracking-widest ${item.warning && !privacySettings[item.key as keyof typeof privacySettings] ? 'text-red-400' : 'text-slate-400'}`}>
                           {item.desc}
                         </p>
                      </div>
                   </div>
                   <button 
                     onClick={() => togglePrivacy(item.key as keyof typeof privacySettings)}
                     className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${privacySettings[item.key as keyof typeof privacySettings] ? 'bg-primary justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                   >
                      <div className="size-4 bg-white rounded-full shadow-lg"></div>
                   </button>
                </div>
              ))}
           </div>
        </section>

        {/* Medical Encryption Reassurance */}
        <section className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 flex gap-4">
           <div className="size-12 shrink-0 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <span className="material-symbols-outlined text-2xl fill-1">lock</span>
           </div>
           <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-1">HIPAA-Grade Security</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                 Your data is hashed using individual private keys. Urkio does not have access to your raw reflections; only the selected experts can decrypt the report stream.
              </p>
           </div>
        </section>
      </main>

      {/* Persistent Sharing Hub */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-white/90 dark:bg-background-dark/95 backdrop-blur-3xl border-t border-gray-100 dark:border-white/5 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button 
          onClick={handleShare}
          disabled={selectedExpertIds.size === 0 || isProcessing}
          className="w-full h-18 urkio-gradient rounded-[1.8rem] text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
        >
          {isProcessing ? (
            <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              Confirm & Share Report
              <span className="material-symbols-outlined text-xl">send_and_archive</span>
            </>
          )}
        </button>
        <p className="text-center text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mt-6 italic">Secure Protocol: #WELL-TX-9912 • End-to-End Encrypted</p>
      </footer>
    </div>
  );
};

export default ShareWellnessReport;
