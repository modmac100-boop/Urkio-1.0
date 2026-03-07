
import React, { useState, useMemo } from 'react';
import { AppScreen } from '../types';
import { BottomNav } from '../components/Navigation';

type ArchiveType = 'Audio' | 'Video' | 'Workshop' | 'Q&A';

interface Recording {
  id: string;
  title: string;
  type: ArchiveType;
  hostName: string;
  hostAvatar: string;
  date: string;
  duration: string;
  views: string;
  image: string;
  category: string;
  description: string;
}

const MOCK_RECORDINGS: Recording[] = [
  {
    id: 'rec1',
    title: 'Navigating Mid-Career Burnout',
    type: 'Audio',
    hostName: 'Dr. Sarah Jenkins',
    hostAvatar: 'https://picsum.photos/seed/sarah/80/80',
    date: '2 days ago',
    duration: '42:15',
    views: '2.4k',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600',
    category: 'Mental Wellbeing',
    description: 'A deep dive into identifying the silent signs of professional exhaustion and actionable recovery steps.'
  },
  {
    id: 'rec2',
    title: 'The Gut Microbiome Masterclass',
    type: 'Video',
    hostName: 'Mark Thompson',
    hostAvatar: 'https://picsum.photos/seed/mark/80/80',
    date: '1 week ago',
    duration: '1:12:00',
    views: '5.1k',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
    category: 'Nutrition',
    description: 'Learn the fundamental science of how your digestive health dictates your mood and energy levels.'
  },
  {
    id: 'rec3',
    title: 'CBT Techniques for Sleep Anxiety',
    type: 'Workshop',
    hostName: 'Dr. Marcus Chen',
    hostAvatar: 'https://picsum.photos/seed/marcus/80/80',
    date: 'Oct 15',
    duration: '55:00',
    views: '1.2k',
    image: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&q=80&w=600',
    category: 'Sleep Science',
    description: 'Practical exercises to quiet the mind before bed using Cognitive Behavioral Therapy frameworks.'
  },
  {
    id: 'rec4',
    title: 'Live Q&A: Stress & Cortisol',
    type: 'Q&A',
    hostName: 'Dr. Elena Rodriguez',
    hostAvatar: 'https://picsum.photos/seed/elena/80/80',
    date: 'Oct 10',
    duration: '38:20',
    views: '890',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
    category: 'Holistic Health',
    description: 'Answering community questions about hormone regulation and natural stress mitigation.'
  }
];

const RecordingArchive: React.FC<{ navigate: (s: AppScreen) => void }> = ({ navigate }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | ArchiveType>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecordings = useMemo(() => {
    return MOCK_RECORDINGS.filter(rec => {
      const matchesFilter = activeFilter === 'All' || rec.type === activeFilter;
      const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           rec.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const featured = MOCK_RECORDINGS[1]; // Editor's Choice

  const getIcon = (type: ArchiveType) => {
    switch (type) {
      case 'Audio': return 'podcasts';
      case 'Video': return 'play_circle';
      case 'Workshop': return 'school';
      case 'Q&A': return 'quiz';
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl pb-32 font-sans overflow-x-hidden">
      {/* Branded Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md px-6 pt-12 pb-6 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(AppScreen.USER_DASHBOARD)}
              className="size-11 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-slate-500">arrow_back_ios_new</span>
            </button>
            <div>
              <h2 className="text-2xl font-black font-display tracking-tight">Archive</h2>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Preserving Expert Wisdom</p>
            </div>
          </div>
          <button className="size-11 flex items-center justify-center rounded-2xl bg-primary/5 text-primary">
            <span className="material-symbols-outlined">history</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="space-y-4">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-500"
              placeholder="Search past sessions..."
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {(['All', 'Audio', 'Video', 'Workshop', 'Q&A'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`shrink-0 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${
                  activeFilter === tab 
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105' 
                    : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-white/10 text-slate-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-12">
        {/* Featured Replay Card */}
        {activeFilter === 'All' && !searchQuery && (
          <section className="animate-in fade-in slide-in-from-bottom duration-700">
             <div className="flex items-center justify-between px-1 mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Editor's Choice Replay</h3>
                <span className="material-symbols-outlined text-urkio-magenta animate-pulse">bookmark_star</span>
             </div>
             
             <div className="relative group overflow-hidden rounded-[3rem] bg-slate-950 text-white p-8 shadow-2xl active:scale-[0.98] transition-all border border-white/10 cursor-pointer">
                <div className="absolute inset-0 z-0">
                  <img src={featured.image} className="size-full object-cover opacity-40 group-hover:scale-110 duration-[3s] transition-transform" alt="Featured" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                </div>
                
                <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="px-4 py-1.5 backdrop-blur-md border border-white/20 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-primary">
                      <span className="material-symbols-outlined text-[14px]">play_circle</span>
                      {featured.type} Replay
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex flex-col items-center">
                       <span className="text-[10px] font-black">{featured.duration}</span>
                       <span className="text-[8px] font-bold text-white/60 uppercase">Length</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-3xl font-black font-display leading-tight mb-2 pr-10">{featured.title}</h3>
                    <p className="text-slate-300 text-xs font-medium leading-relaxed line-clamp-2 mb-4">{featured.description}</p>
                    <div className="flex items-center gap-3">
                       <img src={featured.hostAvatar} className="size-6 rounded-lg border border-white/20" alt="host" />
                       <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">with {featured.hostName}</p>
                    </div>
                  </div>
                  
                  <button className="w-full h-14 urkio-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined">play_arrow</span>
                    Resume Session
                  </button>
                </div>
             </div>
          </section>
        )}

        {/* Categories Feed */}
        <section className="space-y-8">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                {activeFilter === 'All' ? 'Past Insights' : `${activeFilter} Recordings`}
              </h3>
              <p className="text-[10px] font-black text-primary uppercase">{filteredRecordings.length} items</p>
           </div>
           
           <div className="space-y-6">
              {filteredRecordings.map((rec, i) => (
                <div 
                  key={rec.id}
                  className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group cursor-pointer overflow-hidden animate-in fade-in slide-in-from-bottom duration-500"
                  style={{animationDelay: `${i * 100}ms`}}
                >
                   <div className="flex gap-4 p-4">
                      <div className="size-24 shrink-0 relative rounded-3xl overflow-hidden shadow-inner">
                         <img src={rec.image} className="size-full object-cover group-hover:scale-110 transition-transform duration-700" alt={rec.title} />
                         <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="size-10 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white">
                               <span className="material-symbols-outlined text-xl fill-1">play_arrow</span>
                            </div>
                         </div>
                         <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded-lg text-[7px] font-black text-white uppercase">
                            {rec.duration}
                         </div>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                         <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-[14px] text-primary">{getIcon(rec.type)}</span>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{rec.category}</p>
                         </div>
                         <h4 className="text-sm font-black leading-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate mb-2">{rec.title}</h4>
                         <div className="flex items-center gap-2">
                            <img src={rec.hostAvatar} className="size-5 rounded-full border border-gray-100 dark:border-white/10" alt="p" />
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter truncate">by {rec.hostName}</p>
                         </div>
                         <div className="mt-2 flex items-center gap-3 text-[8px] font-black text-slate-400 uppercase">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">visibility</span> {rec.views}</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">schedule</span> {rec.date}</span>
                         </div>
                      </div>

                      <div className="flex flex-col justify-center">
                         <button className="size-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-xl">bookmark_add</span>
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </main>

      <footer className="p-12 text-center bg-white dark:bg-background-dark border-t border-gray-100 dark:border-white/5">
         <div className="size-12 bg-white dark:bg-slate-900 rounded-2xl mx-auto flex items-center justify-center shadow-lg border border-gray-100 dark:border-white/10 mb-6">
            <svg className="size-6" viewBox="0 0 100 120" fill="none">
               <path d="M24 15V80C24 95 36 105 50 105C64 105 76 95 76 80V15" stroke="url(#archGrad)" strokeWidth="30" strokeLinecap="round" />
               <defs><linearGradient id="archGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#d946ef" /><stop offset="100%" stopColor="#135bec" /></linearGradient></defs>
            </svg>
         </div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Urkio Knowledge Vault • Your Journey Preserved</p>
      </footer>

      <BottomNav role="USER" currentScreen={AppScreen.RECORDING_ARCHIVE} navigate={navigate} />
    </div>
  );
};

export default RecordingArchive;
