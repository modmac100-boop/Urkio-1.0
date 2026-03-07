
import React, { useState } from 'react';
import { AppScreen, Expert } from '../types';

interface RecommendedMember {
  id: string;
  name: string;
  image: string;
  sharedInterest: string;
  isExpert: boolean;
  title?: string;
}

const EXPERT_PICKS: RecommendedMember[] = [
  { id: 'ex1', name: 'Dr. Sarah Miller', image: 'https://picsum.photos/seed/dr1/200/200', isExpert: true, title: 'Psychologist', sharedInterest: 'Anxiety Mastery' },
  { id: 'ex2', name: 'Mark Thompson', image: 'https://picsum.photos/seed/mark/200/200', isExpert: true, title: 'Nutritionist', sharedInterest: 'Gut Health' },
  { id: 'ex3', name: 'Dr. Marcus Chen', image: 'https://picsum.photos/seed/marcus/200/200', isExpert: true, title: 'Sleep Scientist', sharedInterest: 'Performance' },
];

const MEMBER_PICKS: RecommendedMember[] = [
  { id: 'm1', name: 'Sophia Loren', image: 'https://picsum.photos/seed/u11/100/100', isExpert: false, sharedInterest: 'Postpartum Wellness' },
  { id: 'm2', name: 'Liam Payne', image: 'https://picsum.photos/seed/liam/100/100', isExpert: false, sharedInterest: 'CBT Group' },
  { id: 'm3', name: 'Ava Maxwell', image: 'https://picsum.photos/seed/ava/100/100', isExpert: false, sharedInterest: 'Mindful Eating' },
  { id: 'm4', name: 'Noah G.', image: 'https://picsum.photos/seed/noah/100/100', isExpert: false, sharedInterest: 'Sleep Hygiene' },
];

const TRENDING_TOPICS = [
  { name: 'Microbiome', count: '2.4k', icon: 'vital_signs' },
  { name: 'Circadian Sync', count: '1.8k', icon: 'wb_sunny' },
  { name: 'Resilience', count: '3.1k', icon: 'bolt' },
];

const DiscoverConnections: React.FC<{ navigate: (s: AppScreen, e?: Expert) => void }> = ({ navigate }) => {
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  const toggleFollow = (id: string) => {
    setFollowedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
      {/* Immersive Header */}
      <header className="relative shrink-0 pt-12 pb-6 px-6 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-white/5 z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => navigate(AppScreen.CONNECTIONS)}
               className="size-11 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 active:scale-95 transition-all"
             >
               <span className="material-symbols-outlined">arrow_back_ios_new</span>
             </button>
             <div>
                <h2 className="text-xl font-black font-display tracking-tight">Discover Hub</h2>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Personalized for you</p>
             </div>
          </div>
          <button className="size-11 flex items-center justify-center rounded-2xl bg-primary/5 text-primary">
             <span className="material-symbols-outlined">auto_awesome</span>
          </button>
        </div>

        {/* Search / Filter Section */}
        <div className="relative">
           <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">explore</span>
           <div className="w-full pl-12 pr-4 h-14 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl text-sm font-medium flex items-center text-slate-500">
             Find experts by niche...
           </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar space-y-10 pb-12">
        {/* Personalized Welcome */}
        <section className="px-6 pt-6">
           <h3 className="text-2xl font-black font-display mb-2">Finding your circle, Alex</h3>
           <p className="text-sm text-slate-500 font-medium">Based on your interest in <span className="text-primary font-black">Mental Health</span> and <span className="text-urkio-magenta font-black">Sleep Science</span>.</p>
        </section>

        {/* Expert Picks - Horizontal Carousel */}
        <section className="space-y-4">
           <div className="px-6 flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Expert Recommendations</h4>
              <button className="text-[10px] font-bold text-primary uppercase">View All</button>
           </div>
           <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-2">
              {EXPERT_PICKS.map((expert) => (
                <div 
                  key={expert.id} 
                  className="shrink-0 w-44 bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm group hover:shadow-xl transition-all"
                >
                   <div className="relative mb-4">
                      <div className="size-20 rounded-[1.8rem] urkio-gradient p-0.5 shadow-lg mx-auto">
                         <img src={expert.image} className="size-full rounded-[1.6rem] object-cover border-2 border-white dark:border-slate-900" alt={expert.name} />
                      </div>
                      <div className="absolute -bottom-1 -right-1 size-6 bg-emerald-500 rounded-lg border-2 border-white dark:border-slate-900 flex items-center justify-center">
                         <span className="material-symbols-outlined text-white text-[12px] font-black">verified</span>
                      </div>
                   </div>
                   <div className="text-center mb-4">
                      <h5 className="text-sm font-black truncate">{expert.name.split(' ')[1]}</h5>
                      <p className="text-[8px] font-bold text-primary uppercase tracking-widest mt-0.5">{expert.title}</p>
                   </div>
                   <button 
                     onClick={() => toggleFollow(expert.id)}
                     className={`w-full py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                       followedIds.has(expert.id) ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'urkio-gradient text-white shadow-lg'
                     }`}
                   >
                     {followedIds.has(expert.id) ? 'Added' : 'Connect'}
                   </button>
                </div>
              ))}
           </div>
        </section>

        {/* Trending Topic Exploration */}
        <section className="px-6 space-y-4">
           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Trending in your circle</h4>
           <div className="grid grid-cols-1 gap-3">
              {TRENDING_TOPICS.map((topic) => (
                <div key={topic.name} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl group hover:border-primary/30 transition-all cursor-pointer">
                   <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                         <span className="material-symbols-outlined">{topic.icon}</span>
                      </div>
                      <div>
                         <h5 className="text-sm font-black">#{topic.name}</h5>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{topic.count} members exploring</p>
                      </div>
                   </div>
                   <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-all">chevron_right</span>
                </div>
              ))}
           </div>
        </section>

        {/* Seeker Recommendations - Vertical List */}
        <section className="px-6 space-y-4">
           <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Seekers with Shared Interests</h4>
              <button className="text-[10px] font-bold text-primary uppercase">Shuffle</button>
           </div>
           <div className="space-y-4">
              {MEMBER_PICKS.map((member) => (
                <div key={member.id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-sm hover:shadow-md transition-all">
                   <img src={member.image} className="size-14 rounded-2xl object-cover shadow-inner" alt={member.name} />
                   <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-black truncate">{member.name}</h5>
                      <div className="flex items-center gap-1.5 mt-0.5">
                         <span className="size-1.5 rounded-full bg-urkio-magenta animate-pulse"></span>
                         <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">Similar journey: {member.sharedInterest}</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => toggleFollow(member.id)}
                     className={`size-10 flex items-center justify-center rounded-xl transition-all ${
                       followedIds.has(member.id) ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                     }`}
                   >
                      <span className="material-symbols-outlined">{followedIds.has(member.id) ? 'check' : 'person_add'}</span>
                   </button>
                </div>
              ))}
           </div>
        </section>

        {/* Smart Circle Recommendations */}
        <section className="px-6 pb-6">
           <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-7 shadow-2xl border border-white/5 group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
              <div className="relative z-10 space-y-6">
                 <div className="flex justify-between items-start">
                    <div className="px-4 py-1.5 bg-urkio-magenta/20 border border-urkio-magenta/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-urkio-magenta">AI Recommendation</div>
                    <span className="material-symbols-outlined text-white/20 text-4xl">groups_3</span>
                 </div>
                 <div>
                    <h3 className="text-xl font-black font-display leading-tight mb-2">New: Circadian Biology Support</h3>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">Based on your recent interest in sleep science. 4 experts and 12 of your connections are already here.</p>
                 </div>
                 <button 
                    onClick={() => navigate(AppScreen.SUPPORT_CIRCLES)}
                    className="w-full h-14 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl group-hover:scale-[1.02] transition-all"
                 >
                   Explore Circle
                 </button>
              </div>
           </div>
        </section>
      </main>

      <footer className="p-8 text-center bg-white dark:bg-background-dark border-t border-gray-100 dark:border-white/5">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Curated connections for holistic health</p>
      </footer>
    </div>
  );
};

export default DiscoverConnections;
