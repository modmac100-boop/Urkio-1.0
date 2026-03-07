
import React, { useState, useMemo, useEffect } from 'react';
import { AppScreen } from '../types';

interface ManagedSpecialist {
  id: string;
  name: string;
  title: string;
  image: string;
  status: 'Online' | 'Busy' | 'Offline';
  load: number; // Percentage of clinical capacity
  specialties: string[];
  matchScore: number;
}

const MOCK_SPECIALISTS: ManagedSpecialist[] = [
  { id: 's1', name: 'Dr. Elena Rodriguez', title: 'Clinical Psychologist', image: 'https://picsum.photos/seed/elena/150/150', status: 'Online', load: 45, specialties: ['Anxiety', 'CBT', 'Burnout'], matchScore: 98 },
  { id: 's2', name: 'Dr. Marcus Chen', title: 'Functional Neurologist', image: 'https://picsum.photos/seed/marcus/150/150', status: 'Busy', load: 82, specialties: ['Sleep Science', 'Neuroplasticity'], matchScore: 85 },
  { id: 's3', name: 'Mark Thompson', title: 'Functional Dietitian', image: 'https://picsum.photos/seed/mark/150/150', status: 'Online', load: 20, specialties: ['Gut Health', 'Metabolism'], matchScore: 72 },
  { id: 's4', name: 'Dr. Sarah Miller', title: 'Holistic Practitioner', image: 'https://picsum.photos/seed/sarah/150/150', status: 'Offline', load: 0, specialties: ['Stress', 'Integrative Health'], matchScore: 64 },
];

const SpecialistSelector: React.FC<{ navigate: (s: AppScreen) => void }> = ({ navigate }) => {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'Note' | 'Order' | 'Transfer'>('Note');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredSpecialists = useMemo(() => {
    return MOCK_SPECIALISTS.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.specialties.some(sp => sp.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

  const handleAction = () => {
    if (!selectedId) return;
    setIsProcessing(true);
    
    // Simulate clinical processing steps
    const steps = actionType === 'Transfer' 
      ? ['Analyzing Case History...', 'Packaging Biometrics...', 'Establishing Care Bridge...', 'Finalizing Hand-off...']
      : actionType === 'Order'
      ? ['Verifying Protocol...', 'Generating Clinical Directive...', 'Syncing Pharmacy...', 'Transmitting Order...']
      : ['Encrypting Note Content...', 'Securing PII Data...', 'Routing to Expert...', 'Message Dispatched...'];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProcessStep(steps[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setShowSuccess(true);
        setTimeout(() => navigate(AppScreen.EXPERT_DASHBOARD), 3000);
      }
    }, 800);
  };

  const selectedSpecialist = MOCK_SPECIALISTS.find(s => s.id === selectedId);

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#020617] flex items-center justify-center animate-in fade-in duration-500">
        <div className="text-center px-10 animate-in zoom-in duration-300">
          <div className={`size-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl ${
            actionType === 'Transfer' ? 'bg-emerald-500 shadow-emerald-500/40' : 
            actionType === 'Order' ? 'bg-amber-500 shadow-amber-500/40' : 
            'bg-primary shadow-primary/40'
          }`}>
             <span className="material-symbols-outlined text-white text-5xl font-black">
                {actionType === 'Transfer' ? 'sync_alt' : actionType === 'Order' ? 'clinical_notes' : 'mark_chat_read'}
             </span>
          </div>
          <h3 className="text-3xl font-black mb-3 font-display text-white">
            {actionType === 'Transfer' ? 'Case Transferred' : actionType === 'Order' ? 'Order Dispatched' : 'Note Relayed'}
          </h3>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
            {actionType === 'Transfer' 
              ? `Full clinical oversight for Alex Johnson has been migrated to ${selectedSpecialist?.name}.` 
              : actionType === 'Order'
              ? `A formal clinical order has been added to ${selectedSpecialist?.name}'s queue for Alex Johnson.`
              : `Your clinical observation has been securely transmitted to ${selectedSpecialist?.name}.`}
          </p>
          <div className="mt-10 pt-10 border-t border-white/5 opacity-40">
             <p className="text-[8px] font-black uppercase tracking-[0.5em]">Protocol Reference: #AZ-9912-CM-SYNC</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-white max-w-md mx-auto shadow-2xl font-sans overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl p-6 border-b border-white/5">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(AppScreen.AI_CASE_REPORT)} className="size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 active:scale-90 transition-all">
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </button>
          <div className="flex-1">
             <h2 className="text-xl font-black font-display tracking-tight leading-none mb-1">Expert Triage</h2>
             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Connection & Dispatch Mode</p>
          </div>
        </div>

        <div className="relative">
           <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
           <input 
             value={search}
             onChange={e => setSearch(e.target.value)}
             className="w-full h-14 pl-12 pr-4 bg-white/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/40"
             placeholder="Search clinical specialists..."
           />
        </div>
      </header>

      <main className="p-6 space-y-8 pb-48 no-scrollbar overflow-y-auto">
        {/* Selection Area */}
        <section className="space-y-4">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Clinical Directory</h3>
              <span className="text-[9px] font-black text-primary uppercase">Specialist Recommendations</span>
           </div>

           <div className="space-y-4">
              {filteredSpecialists.map(s => (
                <div 
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`relative p-5 rounded-[2.5rem] border transition-all cursor-pointer group active:scale-[0.98] ${
                    selectedId === s.id ? 'bg-primary/10 border-primary shadow-2xl' : 'bg-white/5 border-white/5 opacity-80'
                  }`}
                >
                   {selectedId === s.id && (
                     <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary text-white rounded-bl-2xl text-[8px] font-black uppercase tracking-widest animate-in fade-in duration-300">
                        Primary Target
                     </div>
                   )}
                   <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        <img src={s.image} className="size-16 rounded-2xl object-cover border-2 border-white/10" alt={s.name} />
                        <div className={`absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-background-dark ${
                          s.status === 'Online' ? 'bg-emerald-500' : s.status === 'Busy' ? 'bg-amber-500' : 'bg-slate-500'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="text-base font-black truncate">{s.name}</h4>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-2">{s.title}</p>
                         <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                               <span className="text-[7px] font-black text-slate-600 uppercase">Load</span>
                               <span className={`text-[10px] font-black ${s.load > 80 ? 'text-red-500' : 'text-emerald-500'}`}>{s.load}%</span>
                            </div>
                            <div className="flex flex-col">
                               <span className="text-[7px] font-black text-slate-600 uppercase">Match</span>
                               <span className="text-[10px] font-black text-primary">{s.matchScore}%</span>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="flex flex-wrap gap-1.5">
                      {s.specialties.map(sp => (
                        <span key={sp} className="px-2 py-0.5 bg-black/40 rounded text-[7px] font-black uppercase text-slate-400">#{sp}</span>
                      ))}
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Action Configuration */}
        {selectedId && (
          <section className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <div className="px-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Clinical Protocol Selection</h3>
             </div>
             
             <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-7 space-y-8 shadow-inner">
                <div className="space-y-3">
                   <label className="text-[9px] font-black uppercase tracking-widest text-primary">Action Type</label>
                   <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
                      {(['Note', 'Order', 'Transfer'] as const).map(t => (
                        <button 
                          key={t}
                          onClick={() => setActionType(t)}
                          className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase transition-all flex items-center justify-center gap-2 ${
                            actionType === t ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                             {t === 'Note' ? 'sticky_note_2' : t === 'Order' ? 'clinical_notes' : 'sync_alt'}
                          </span>
                          {t}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[9px] font-black uppercase tracking-widest text-primary">Clinical Instructions</label>
                   <textarea 
                     value={message}
                     onChange={e => setMessage(e.target.value)}
                     className="w-full h-40 bg-black/20 border border-white/5 rounded-2xl p-5 text-sm font-medium focus:ring-2 focus:ring-primary/40 leading-relaxed font-sans"
                     placeholder={
                       actionType === 'Note' ? 'Document your observations for the expert review...' : 
                       actionType === 'Order' ? 'Specify the exact clinical task required for this case...' :
                       'Detail the clinical justification for transferring Alex Johnson to this specialist...'
                     }
                   />
                </div>
             </div>

             {/* Triage Safety Banner */}
             <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl flex gap-4">
                <div className="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                   <span className="material-symbols-outlined text-xl">shield_lock</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                   This action will be logged in the <span className="text-emerald-500 font-bold">Clinical Audit Trail</span>. Both practitioners will have access to the coordination history.
                </p>
             </div>
          </section>
        )}
      </main>

      {/* Persistent Execution Hub */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-background-dark/95 backdrop-blur-3xl border-t border-white/10 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <button 
          onClick={handleAction}
          disabled={!selectedId || !message.trim() || isProcessing}
          className={`w-full h-18 rounded-3xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 active:scale-[0.98] transition-all disabled:opacity-30 ${
            actionType === 'Transfer' ? 'bg-emerald-600 shadow-emerald-500/20' : 'urkio-gradient shadow-primary/20'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center gap-3">
               <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
               <span className="animate-pulse">{processStep}</span>
            </div>
          ) : (
            <>
              {actionType === 'Note' ? 'Dispatch Note' : actionType === 'Order' ? 'Issue Order' : 'Execute Transfer'}
              <span className="material-symbols-outlined text-xl">
                 {actionType === 'Note' ? 'send' : actionType === 'Order' ? 'playlist_add_check' : 'sync_alt'}
              </span>
            </>
          )}
        </button>
        <p className="text-center text-[7px] font-black text-slate-600 uppercase tracking-[0.3em] mt-6">Clinical Connection Core • Node CM-8291</p>
      </footer>
    </div>
  );
};

export default SpecialistSelector;
