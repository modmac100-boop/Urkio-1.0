
import React, { useState } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const CATEGORIES = ['Mental Health', 'Nutrition', 'Sleep Science', 'Zen & Yoga', 'Performance'];

const ScheduleAudioRoom: React.FC<Props> = ({ navigate }) => {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState('2024-10-25');
  const [time, setTime] = useState('14:00');
  const [isRecording, setIsRecording] = useState(true);
  const [allowParticipation, setAllowParticipation] = useState(true);
  const [coHosts, setCoHosts] = useState<{ id: string; name: string; avatar: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const mockExperts = [
    { id: 'e1', name: 'Dr. Sarah Miller', avatar: 'https://picsum.photos/seed/sarah/80/80' },
    { id: 'e2', name: 'Mark Thompson', avatar: 'https://picsum.photos/seed/mark/80/80' },
    { id: 'e3', name: 'Dr. Elena Rodriguez', avatar: 'https://picsum.photos/seed/elena/80/80' }
  ];

  const toggleCoHost = (expert: { id: string; name: string; avatar: string }) => {
    if (coHosts.find(c => c.id === expert.id)) {
      setCoHosts(coHosts.filter(c => c.id !== expert.id));
    } else if (coHosts.length < 3) {
      setCoHosts([...coHosts, expert]);
    }
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => navigate(AppScreen.EXPERT_DASHBOARD), 2500);
    }, 1500);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-white max-w-md mx-auto shadow-2xl font-sans overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[50%] bg-primary/10 blur-[150px] rounded-full opacity-40"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[40%] bg-urkio-magenta/5 blur-[120px] rounded-full opacity-30"></div>
      </div>

      <header className="relative z-10 px-6 pt-12 pb-6 flex items-center justify-between bg-background-dark/80 backdrop-blur-xl sticky top-0 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(AppScreen.EXPERT_DASHBOARD)} className="size-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-90 transition-all">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <div>
            <h2 className="text-xl font-black font-display tracking-tight leading-none mb-1">Schedule Room</h2>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Audio Discussion</p>
          </div>
        </div>
        <button className="size-11 flex items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
          <span className="material-symbols-outlined text-xl">info</span>
        </button>
      </header>

      <main className="relative z-10 flex-1 overflow-y-auto px-6 py-8 pb-40 no-scrollbar space-y-10">
        <form onSubmit={handleSchedule} className="space-y-10">
          
          {/* Core Info Card */}
          <section className="space-y-6">
            <div className="px-1 mb-2">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Session Narrative</h3>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-7 space-y-8 shadow-xl">
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-widest text-primary ml-1">Room Topic</label>
                <input 
                  required
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full bg-background-dark/50 border-none rounded-2xl px-5 h-16 text-base font-bold focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-700"
                  placeholder="e.g. Navigating Corporate Burnout"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-widest text-primary ml-1">Context & Details</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-background-dark/50 border-none rounded-2xl px-5 py-5 text-sm min-h-[140px] focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-700 leading-relaxed font-medium"
                  placeholder="What should seekers expect to learn or experience during this session?"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-widest text-primary ml-1">Category</label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`shrink-0 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        category === cat 
                          ? 'bg-primary border-primary text-white shadow-lg' 
                          : 'bg-white/5 border-white/10 text-slate-500'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Temporal Data Card */}
          <section className="space-y-6">
            <div className="px-1 mb-2">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Timeline</h3>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-7 grid grid-cols-2 gap-6 shadow-xl">
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-widest text-primary ml-1">Session Date</label>
                <div className="relative">
                  <input 
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-background-dark/50 border-none rounded-2xl px-5 h-14 text-sm font-bold focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-widest text-primary ml-1">Start Time</label>
                <input 
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full bg-background-dark/50 border-none rounded-2xl px-5 h-14 text-sm font-bold focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Collaborative Hierarchy */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Expert Co-hosts ({coHosts.length}/3)</h3>
              <span className="text-[8px] text-primary font-black uppercase bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Verified Only</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-7 shadow-xl">
              <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
                {mockExperts.map(expert => {
                  const isSelected = coHosts.find(c => c.id === expert.id);
                  return (
                    <button 
                      key={expert.id}
                      type="button"
                      onClick={() => toggleCoHost(expert)}
                      className="shrink-0 flex flex-col items-center gap-3 group"
                    >
                      <div className={`relative size-16 rounded-[1.8rem] p-0.5 transition-all duration-500 ${isSelected ? 'urkio-gradient scale-110 shadow-lg shadow-primary/20' : 'bg-white/5 opacity-50 grayscale'}`}>
                        <div className="size-full rounded-[1.6rem] border-2 border-slate-900 overflow-hidden">
                          <img src={expert.avatar} className="size-full object-cover" alt={expert.name} />
                        </div>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 size-5 bg-emerald-500 rounded-lg border-2 border-slate-950 flex items-center justify-center animate-in zoom-in duration-300">
                             <span className="material-symbols-outlined text-white text-[10px] font-black">check</span>
                          </div>
                        )}
                      </div>
                      <p className={`text-[9px] font-black text-center w-16 truncate transition-colors ${isSelected ? 'text-primary' : 'text-slate-500'}`}>{expert.name.split(' ')[1]}</p>
                    </button>
                  );
                })}
                <button 
                  type="button"
                  className="shrink-0 size-16 rounded-[1.8rem] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center text-slate-600 hover:text-primary hover:bg-white/10 hover:border-primary/30 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined">person_add</span>
                </button>
              </div>
              <p className="mt-6 text-[8px] font-medium text-slate-500 italic leading-relaxed text-center">Invited co-hosts will receive a notification to confirm their participation.</p>
            </div>
          </section>

          {/* Feature Matrix */}
          <section className="space-y-6">
            <div className="px-1 mb-2">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Interactive Controls</h3>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-xl divide-y divide-white/5">
              <div className="p-7 flex items-center justify-between group hover:bg-white/5 transition-colors">
                <div className="flex gap-5">
                  <div className={`size-12 rounded-2xl flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-slate-600'}`}>
                    <span className={`material-symbols-outlined text-2xl ${isRecording ? 'fill-1' : ''}`}>radio_button_checked</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-black tracking-tight">Cloud Recording</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">On-demand replay for seekers</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`w-14 h-7 rounded-full p-1 transition-all flex items-center ${isRecording ? 'bg-primary justify-end' : 'bg-slate-800 justify-start'}`}
                >
                  <div className="size-5 bg-white rounded-full shadow-xl"></div>
                </button>
              </div>

              <div className="p-7 flex items-center justify-between group hover:bg-white/5 transition-colors">
                <div className="flex gap-5">
                  <div className={`size-12 rounded-2xl flex items-center justify-center transition-all ${allowParticipation ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-slate-600'}`}>
                    <span className="material-symbols-outlined text-2xl">back_hand</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-black tracking-tight">Active Engagement</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Allow audience speaking turns</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setAllowParticipation(!allowParticipation)}
                  className={`w-14 h-7 rounded-full p-1 transition-all flex items-center ${allowParticipation ? 'bg-primary justify-end' : 'bg-slate-800 justify-start'}`}
                >
                  <div className="size-5 bg-white rounded-full shadow-xl"></div>
                </button>
              </div>
            </div>
          </section>
        </form>
      </main>

      {/* Persistent Action Hub */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-8 bg-background-dark/80 backdrop-blur-2xl border-t border-white/5 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <button 
          onClick={handleSchedule}
          disabled={isSubmitting || !topic.trim()}
          className="w-full h-16 urkio-gradient rounded-3xl font-black text-xs uppercase tracking-[0.2em] text-white shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
        >
          {isSubmitting ? (
            <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="material-symbols-outlined text-2xl">calendar_month</span>
              Launch Future Insight
            </>
          )}
        </button>
      </footer >

      {/* Cinematic Success Feedback */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-700">
          <div className="text-center px-10 animate-in zoom-in duration-500">
            <div className="relative mb-10 inline-block">
               <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] animate-pulse"></div>
               <div className="size-28 rounded-[2.5rem] bg-emerald-500 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40 relative z-10 border-4 border-white/10">
                 <span className="material-symbols-outlined text-white text-6xl fill-1">verified</span>
               </div>
            </div>
            <h3 className="text-3xl font-black mb-3 font-display text-white tracking-tight">Room Established</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
              Your session "<span className="text-white font-bold">{topic}</span>" has been added to the community calendar. Your followers have been alerted.
            </p>
            <div className="mt-12 flex flex-col items-center gap-2">
               <div className="size-1 w-1 bg-primary rounded-full animate-bounce"></div>
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Finalizing Secure Sync</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleAudioRoom;
