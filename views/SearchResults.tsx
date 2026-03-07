
import React, { useState, useMemo } from 'react';
import { AppScreen, Expert, Circle } from '../types';
import { BottomNav } from '../components/Navigation';
import { Avatar } from '../components/Avatar';

interface Props {
  navigate: (screen: AppScreen, expert?: Expert, query?: string) => void;
  initialQuery?: string;
}

type SearchCategory = 'All' | 'Experts' | 'Circles' | 'Members';

const TRENDING_SEARCHES = [
  'Gut Health', 'Anxiety Relief', 'Sleep Hygiene', 'Postpartum Wellness', 'CBT Techniques'
];

const MOCK_EXPERTS: Expert[] = [
  { id: '1', name: 'Dr. Sarah Jenkins', title: 'Clinical Psychologist', experience: '12 yrs exp', rating: 4.8, reviews: 124, image: 'https://picsum.photos/seed/jenk/200/200', expertise: ['Anxiety', 'CBT'] },
  { id: '2', name: 'Mark Thompson', title: 'Functional Nutritionist', experience: '8 yrs exp', rating: 4.9, reviews: 89, image: 'https://picsum.photos/seed/mark/200/200', expertise: ['Gut Health', 'Sports Nutrition'] },
  { id: '3', name: 'Dr. Marcus Chen', title: 'Sleep Scientist', experience: '15 yrs exp', rating: 5.0, reviews: 210, image: 'https://picsum.photos/seed/marcus/200/200', expertise: ['Circadian', 'Insomnia'] }
];

const MOCK_CIRCLES: Partial<Circle>[] = [
  { id: 'c1', name: 'Child Anxiety Support', category: 'Mental Wellbeing', members: 1240, image: 'https://picsum.photos/seed/circle1/300/200' },
  { id: 'c2', name: 'Mindful Living', category: 'Holistic Health', members: 850, image: 'https://picsum.photos/seed/circle3/300/200' },
  { id: 'c3', name: 'Gut Health Hub', category: 'Nutrition', members: 2100, image: 'https://picsum.photos/seed/circle2/300/200' }
];

const MOCK_USERS = [
  { id: 'u1', name: 'Alex Johnson', type: 'Hall of Fame Legend', image: 'https://picsum.photos/seed/user1/100/100', followed: true, isTopSupporter: true, isHallOfFame: true, isEndorsed: true },
  { id: 'u2', name: 'Emma Watson', type: 'Health Enthusiast', image: 'https://picsum.photos/seed/user2/100/100', followed: false },
  { id: 'u3', name: 'Liam Payne', type: 'Wellness Seeker', image: 'https://picsum.photos/seed/liam/100/100', followed: false }
];

const SearchResults: React.FC<Props> = ({ navigate, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('All');

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return { experts: [], circles: [], users: [] };
    
    const experts = MOCK_EXPERTS.filter(e => e.name.toLowerCase().includes(q) || e.title.toLowerCase().includes(q) || e.expertise.some(ex => ex.toLowerCase().includes(q)));
    const circles = MOCK_CIRCLES.filter(c => c.name?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q));
    const users = MOCK_USERS.filter(u => u.name.toLowerCase().includes(q));

    return { experts, circles, users };
  }, [query]);

  const totalResults = results.experts.length + results.circles.length + results.users.length;
  const isQueryEmpty = query.trim() === '';

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl pb-24 font-sans">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md px-6 pt-12 pb-4 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(AppScreen.USER_DASHBOARD)} 
            className="size-11 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-slate-500">arrow_back_ios_new</span>
          </button>
          <div className="flex-1 relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
            <input 
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-500 text-slate-900 dark:text-white"
              placeholder="Search experts, circles, topics..."
            />
            {query && (
              <button 
                onClick={() => setQuery('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 size-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {!isQueryEmpty && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {(['All', 'Experts', 'Circles', 'Members'] as SearchCategory[]).map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${
                  activeCategory === cat 
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105' 
                    : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-white/10 text-slate-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar">
        {isQueryEmpty ? (
          <div className="space-y-10 animate-in fade-in duration-500">
             <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                   <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Trending Searches</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                   {TRENDING_SEARCHES.map(item => (
                     <button 
                       key={item}
                       onClick={() => setQuery(item)}
                       className="px-5 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:border-primary transition-all active:scale-95"
                     >
                       {item}
                     </button>
                   ))}
                </div>
             </section>

             <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-1">Recent Circles</h3>
                <div className="grid grid-cols-2 gap-4">
                   {MOCK_CIRCLES.slice(0, 2).map(circle => (
                     <div 
                        key={circle.id} 
                        className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm active:scale-95 transition-all group"
                     >
                        <img src={circle.image} className="h-24 w-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt={circle.name} />
                        <div className="p-4">
                           <h4 className="text-xs font-black truncate">{circle.name}</h4>
                           <p className="text-[9px] font-bold text-primary uppercase mt-1">{circle.category}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </section>
          </div>
        ) : totalResults === 0 ? (
          <div className="py-24 text-center animate-in zoom-in-95 duration-300">
            <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-8 text-slate-300">
              <span className="material-symbols-outlined text-6xl">search_off</span>
            </div>
            <h3 className="text-2xl font-black mb-3 font-display">No results for "{query}"</h3>
            <p className="text-sm text-slate-500 px-10 leading-relaxed font-medium">Try checking your spelling or searching for a more general term like "nutrition" or "anxiety".</p>
          </div>
        ) : (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
            {/* Experts Section */}
            {(activeCategory === 'All' || activeCategory === 'Experts') && results.experts.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verified Experts</h3>
                  <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">{results.experts.length} Specialists</span>
                </div>
                <div className="space-y-4">
                  {results.experts.map(expert => (
                    <div 
                      key={expert.id}
                      onClick={() => navigate(AppScreen.EXPERT_PUBLIC_PROFILE, expert)}
                      className="bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group active:scale-[0.98] cursor-pointer"
                    >
                      <div className="flex gap-5">
                         <Avatar src={expert.image} isExpert={true} size="md" />
                         <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                               <h4 className="text-base font-black truncate group-hover:text-primary transition-colors">{expert.name}</h4>
                               <span className="material-symbols-outlined text-emerald-500 text-[16px] fill-1">verified</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">{expert.title}</p>
                            <div className="flex items-center gap-3">
                               <div className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-yellow-500 text-xs fill-1">star</span>
                                  <span className="text-[10px] font-black">{expert.rating}</span>
                               </div>
                               <span className="text-slate-300 dark:text-slate-700">•</span>
                               <p className="text-[9px] font-black uppercase tracking-tighter text-slate-400">{expert.experience}</p>
                            </div>
                         </div>
                         <button className="size-11 rounded-2xl bg-primary/5 text-primary flex items-center justify-center self-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                            <span className="material-symbols-outlined">event_available</span>
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Circles Section */}
            {(activeCategory === 'All' || activeCategory === 'Circles') && results.circles.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Community Circles</h3>
                  <span className="text-[9px] font-black text-urkio-magenta bg-urkio-magenta/10 px-2 py-0.5 rounded-full">{results.circles.length} Groups</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {results.circles.map(circle => (
                    <div 
                      key={circle.id}
                      className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-5 flex items-center gap-5 shadow-sm active:scale-[0.98] transition-all cursor-pointer group"
                    >
                      <img src={circle.image} className="size-20 rounded-[1.8rem] object-cover shadow-inner group-hover:scale-105 transition-transform" />
                      <div className="flex-1">
                         <h4 className="text-sm font-black mb-1 group-hover:text-urkio-magenta transition-colors">{circle.name}</h4>
                         <p className="text-[9px] font-bold text-primary uppercase tracking-widest">{circle.category}</p>
                         <div className="mt-3 flex items-center gap-1.5 text-slate-400">
                            <span className="material-symbols-outlined text-[14px]">group</span>
                            <span className="text-[10px] font-bold">{circle.members?.toLocaleString()} Seekers</span>
                         </div>
                      </div>
                      <span className="material-symbols-outlined text-slate-300 group-hover:text-urkio-magenta group-hover:translate-x-1 transition-all">arrow_forward_ios</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Users Section */}
            {(activeCategory === 'All' || activeCategory === 'Members') && results.users.length > 0 && (
              <section className="space-y-6 pb-8">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Community Members</h3>
                  <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{results.users.length} People</span>
                </div>
                <div className="space-y-4">
                  {results.users.map(user => (
                    <div key={user.id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-[1.8rem] active:scale-[0.98] transition-all cursor-pointer hover:shadow-md">
                      <Avatar src={user.image} isTopSupporter={(user as any).isTopSupporter} isHallOfFame={(user as any).isHallOfFame} isEndorsed={(user as any).isEndorsed} size="md" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black truncate">{user.name}</h4>
                        <p className={`text-[10px] font-bold uppercase tracking-widest truncate ${(user as any).isHallOfFame ? 'text-yellow-600' : 'text-slate-500'}`}>
                          {(user as any).isEndorsed ? 'Professional Endorsed' : user.type}
                        </p>
                      </div>
                      <button className={`h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        user.followed 
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' 
                          : 'urkio-gradient text-white shadow-lg'
                      }`}>
                        {user.followed ? 'Following' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <footer className="p-8 text-center bg-white dark:bg-background-dark border-t border-gray-100 dark:border-white/5">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Search with intention • Grow with purpose</p>
      </footer>

      <BottomNav role="USER" currentScreen={AppScreen.SEARCH_RESULTS} navigate={navigate} />
    </div>
  );
};

export default SearchResults;
