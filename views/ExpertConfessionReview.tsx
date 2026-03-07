
import React, { useState } from 'react';
import { AppScreen } from '../types';
import { BottomNav } from '../components/Navigation';

interface Reflection {
  id: string;
  type: 'audio' | 'text';
  timestamp: string;
  sentiment: 'anxious' | 'stable' | 'positive' | 'distressed';
  content: string;
  duration?: string;
  clinicalNote?: string;
}

const MOCK_REFLECTIONS: Reflection[] = [
  {
    id: 'r1',
    type: 'audio',
    timestamp: 'Today, 11:45 PM',
    sentiment: 'anxious',
    content: '[Audio Recording]',
    duration: '2:14',
    clinicalNote: 'Patient sounds tired. Vocal cadence suggests low energy. Discuss sleep hygiene in next session.'
  },
  {
    id: 'r2',
    type: 'text',
    timestamp: 'Yesterday, 08:30 AM',
    sentiment: 'stable',
    content: "I'm feeling much better today after the breathing exercises we practiced. The morning peak was manageable and I felt more in control of my environment.",
    clinicalNote: 'Breathing exercises showing high efficacy. Reinforce continuation of the 4-7-8 technique.'
  },
  {
    id: 'r3',
    type: 'audio',
    timestamp: 'Oct 20, 10:15 PM',
    sentiment: 'distressed',
    content: '[Audio Recording]',
    duration: '4:05',
    clinicalNote: 'Immediate follow-up required. Significant emotional distress detected in recording. Cadence is rapid and breathing is shallow.'
  }
];

interface Props {
  navigate: (screen: AppScreen) => void;
}

const ExpertConfessionReview: React.FC<Props> = ({ navigate }) => {
  const [reflections, setReflections] = useState<Reflection[]>(MOCK_REFLECTIONS);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [noteValue, setNoteValue] = useState('');

  const handleSaveNote = (id: string) => {
    setReflections(prev => prev.map(r => 
      r.id === id ? { ...r, clinicalNote: noteValue } : r
    ));
    setActiveNoteId(null);
    setNoteValue('');
  };

  const startEditingNote = (reflection: Reflection) => {
    setActiveNoteId(reflection.id);
    setNoteValue(reflection.clinicalNote || '');
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'anxious': return { icon: 'psychiatry', color: 'text-amber-500', label: 'Anxious' };
      case 'distressed': return { icon: 'priority_high', color: 'text-red-500', label: 'Distressed' };
      case 'stable': return { icon: 'check_circle', color: 'text-emerald-500', label: 'Stable' };
      case 'positive': return { icon: 'auto_awesome', color: 'text-primary', label: 'Positive' };
      default: return { icon: 'chat', color: 'text-slate-400', label: 'Neutral' };
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-white max-w-md mx-auto shadow-2xl pb-24 font-sans overflow-x-hidden">
      {/* Premium Clinical Header */}
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(AppScreen.EXPERT_DASHBOARD)} className="size-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors active:scale-95">
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </button>
          <div>
            <h2 className="text-lg font-black tracking-tight font-display">Review Timeline</h2>
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Client: Alex Johnson</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="size-11 flex items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
             <span className="material-symbols-outlined text-xl">ios_share</span>
           </button>
        </div>
      </header>

      <main className="p-6 space-y-10">
        {/* Professional Sentiment Analysis Card */}
        <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-7 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <span className="material-symbols-outlined text-9xl">analytics</span>
          </div>
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Emotional Trend (7D)</h3>
            <span className="text-[9px] font-black text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 animate-pulse">Distress Alert</span>
          </div>
          <div className="flex items-end gap-2 h-24 mb-6 relative z-10">
             <div className="flex-1 bg-red-500/30 h-[40%] rounded-t-xl border-t border-red-500/50"></div>
             <div className="flex-1 bg-amber-500/30 h-[70%] rounded-t-xl border-t border-amber-500/50"></div>
             <div className="flex-1 bg-primary/30 h-[50%] rounded-t-xl border-t border-primary/50"></div>
             <div className="flex-1 bg-emerald-500 h-[90%] rounded-t-xl border-t-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
             <div className="flex-1 bg-primary/30 h-[60%] rounded-t-xl border-t border-primary/50"></div>
             <div className="flex-1 bg-amber-500/30 h-[80%] rounded-t-xl border-t border-amber-500/50"></div>
             <div className="flex-1 bg-red-500 h-[30%] rounded-t-xl border-t-2 border-red-400"></div>
          </div>
          <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500 border-t border-white/5 pt-4">
             <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-red-500"></span> Critical</span>
             <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-500"></span> Optimal</span>
          </div>
        </section>

        {/* Interconnected Timeline */}
        <div className="relative space-y-12 before:absolute before:left-[21px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-primary/40 before:via-white/5 before:to-primary/20">
          {reflections.map((r) => {
            const { icon, color, label } = getSentimentIcon(r.sentiment);
            return (
              <div key={r.id} className="relative pl-14 group">
                {/* Timeline Node Icon */}
                <div className={`absolute left-0 top-0 size-11 rounded-2xl bg-slate-900 border-2 border-background-dark shadow-2xl flex items-center justify-center z-10 ${color} group-hover:scale-110 transition-transform duration-300`}>
                  <span className="material-symbols-outlined text-2xl fill-1">{icon}</span>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 hover:bg-white/10 transition-all shadow-sm">
                  <div className="flex justify-between items-start mb-5">
                    <div className="space-y-1">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{r.timestamp}</span>
                       <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-white/5 ${color} border border-current opacity-80`}>{label}</span>
                          <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5">{r.type}</span>
                       </div>
                    </div>
                    <button 
                      onClick={() => navigate(AppScreen.EXPERT_CHECKIN_CHAT)}
                      className="size-11 flex items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/30 active:scale-90 transition-transform"
                    >
                      <span className="material-symbols-outlined text-xl">chat_bubble</span>
                    </button>
                  </div>

                  {r.type === 'audio' ? (
                    <div className="flex items-center gap-4 bg-background-dark/60 rounded-[1.8rem] p-5 border border-white/5 mb-6 relative overflow-hidden group/audio">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/audio:opacity-100 transition-opacity"></div>
                      <button className="size-14 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl active:scale-95 transition-transform z-10">
                        <span className="material-symbols-outlined text-3xl fill-1">play_arrow</span>
                      </button>
                      <div className="flex-1 space-y-2 z-10">
                        <div className="flex items-end gap-1 h-8">
                           {[30, 70, 50, 90, 40, 100, 60, 80, 50, 70, 40, 60, 80].map((h, i) => (
                             <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${i < 5 ? 'bg-primary' : 'bg-primary/20'}`} style={{ height: `${h}%` }}></div>
                           ))}
                        </div>
                        <div className="flex justify-between items-center">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{r.duration} • 48kHz Secure Stream</p>
                           <span className="text-[9px] font-bold text-primary">0:42 / {r.duration}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-background-dark/40 p-6 rounded-[1.8rem] border border-white/5 mb-6 text-slate-300 text-sm leading-relaxed font-medium">
                       "{r.content}"
                    </div>
                  )}

                  {/* Clinical Observation Module */}
                  <div className="mt-4 pt-6 border-t border-white/5">
                    {activeNoteId === r.id ? (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <textarea 
                          autoFocus
                          value={noteValue}
                          onChange={(e) => setNoteValue(e.target.value)}
                          className="w-full bg-background-dark/90 border-2 border-primary/40 rounded-2xl p-5 text-sm text-white focus:ring-0 min-h-[120px] leading-relaxed font-medium"
                          placeholder="Record clinical insights or therapeutic adjustments..."
                        />
                        <div className="flex justify-end gap-3">
                           <button onClick={() => setActiveNoteId(null)} className="px-5 py-2 text-[10px] font-black uppercase text-slate-500">Cancel</button>
                           <button onClick={() => handleSaveNote(r.id)} className="px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase shadow-2xl shadow-primary/30">Commit Observation</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-5">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                             <span className="material-symbols-outlined text-primary text-[18px]">clinical_notes</span>
                             <p className="text-[10px] font-black uppercase tracking-widest text-primary">Therapeutic Insight</p>
                          </div>
                          {r.clinicalNote ? (
                            <p className="text-xs text-slate-400 leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/5 shadow-inner">
                              {r.clinicalNote}
                            </p>
                          ) : (
                            <div className="flex flex-col items-center py-4 px-1 rounded-2xl border border-dashed border-white/10 opacity-60">
                               <p className="text-[10px] text-slate-500 italic">No clinical observations recorded yet.</p>
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => startEditingNote(r)}
                          className="size-11 shrink-0 flex items-center justify-center rounded-2xl bg-white/5 text-slate-500 hover:text-primary transition-all hover:bg-white/10 active:scale-90"
                        >
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <div className="p-6 sticky bottom-0 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent z-40">
         <button 
           onClick={() => navigate(AppScreen.EXPERT_DASHBOARD)}
           className="w-full h-16 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white flex items-center justify-center gap-3 active:scale-95 transition-all shadow-2xl"
         >
           <span className="material-symbols-outlined">dashboard</span>
           Return to Dashboard
         </button>
      </div>

      <BottomNav role="EXPERT" currentScreen={AppScreen.EXPERT_CONFESSION_REVIEW} navigate={navigate} />
    </div>
  );
};

export default ExpertConfessionReview;
