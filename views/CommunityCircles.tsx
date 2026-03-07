
import React, { useState } from 'react';
import { AppScreen, Expert, Circle, Resource } from '../types';
import { BottomNav } from '../components/Navigation';

const ALL_CIRCLES: Circle[] = [
  {
    id: 'c1',
    name: 'Child Anxiety Support',
    category: 'Mental Wellbeing',
    members: 1240,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
    expertModerator: 'Dr. Sarah Miller',
    expertAvatar: 'https://picsum.photos/seed/sarah/100/100',
    activeNow: 12,
    tags: ['Parenting', 'Anxiety'],
    isJoined: true,
    description: 'A dedicated space for parents navigating childhood anxiety through clinical and peer support.'
  },
  {
    id: 'c2',
    name: 'Postpartum Wellness',
    category: 'Physical Health',
    members: 850,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
    expertModerator: 'Dr. Elena Rodriguez',
    expertAvatar: 'https://picsum.photos/seed/elena/100/100',
    activeNow: 5,
    tags: ['Recovery', 'Self-Care'],
    isJoined: true,
    description: 'Supporting mothers in their recovery journey with expert guidance on physical and mental health.'
  },
  {
    id: 'c3',
    name: 'Holistic Nutrition Hub',
    category: 'Nutrition',
    members: 2100,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
    expertModerator: 'Mark Thompson',
    expertAvatar: 'https://picsum.photos/seed/mark/100/100',
    activeNow: 28,
    tags: ['Recipes', 'GutHealth'],
    isJoined: false,
    description: 'Explore the power of functional nutrition and gut health with our resident experts.'
  },
  {
    id: 'c4',
    name: 'Burnout Recovery',
    category: 'Workplace Health',
    members: 340,
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600',
    expertModerator: 'Dr. Marcus Chen',
    expertAvatar: 'https://picsum.photos/seed/marcus/100/100',
    activeNow: 3,
    tags: ['Stress', 'Career'],
    isJoined: false,
    description: 'Science-based strategies to recover from occupational burnout and reclaim your energy.'
  }
];

interface Props {
  navigate: (screen: AppScreen, expert?: Expert, query?: string, resource?: Resource, circle?: Circle) => void;
}

const CommunityCircles: React.FC<Props> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'Discover' | 'My Circles'>('Discover');
  const [searchQuery, setSearchQuery] = useState('');

  const joinedCircles = ALL_CIRCLES.filter(c => c.isJoined);
  const currentCircles = activeTab === 'Discover' ? ALL_CIRCLES : joinedCircles;
  const filteredCircles = currentCircles.filter(c => 
     c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl pb-32 font-sans overflow-x-hidden">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md px-6 pt-10 pb-4 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black font-display tracking-tight text-slate-900 dark:text-white">Community Circles</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary leading-none">Find Your Tribe</p>
          </div>
          <div className="flex gap-2">
            <button className="size-11 rounded-2xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10 transition-transform active:scale-95 shadow-sm">
                <span className="material-symbols-outlined text-2xl">add</span>
            </button>
            <button onClick={() => navigate(AppScreen.USER_DASHBOARD)} className="size-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative group mb-6">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-500"
            placeholder="Search circles by name or topic..."
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-2xl">
           {['Discover', 'My Circles'].map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                 activeTab === tab ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-500'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </header>

      <main className="p-6 space-y-10">
        {/* Section Title */}
        <div className="flex items-center justify-between px-1">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
             {activeTab === 'Discover' ? 'Featured Support Groups' : 'Active Memberships'}
           </h3>
           <button 
             onClick={() => navigate(AppScreen.CONNECTIONS)}
             className="text-[10px] font-black text-primary uppercase underline underline-offset-4 decoration-primary/30 active:scale-95 transition-all"
           >
             {filteredCircles.length} Groups
           </button>
        </div>

        {/* Circles Grid */}
        <div className="space-y-6">
          {filteredCircles.map(circle => (
            <div 
              key={circle.id} 
              onClick={() => navigate(AppScreen.CIRCLE_DISCUSSION, undefined, undefined, undefined, circle)}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group active:scale-[0.99] cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                 <img src={circle.image} className="w-full h-full object-cover group-hover:scale-105 duration-700 transition-transform" alt={circle.name} />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                 
                 {/* Live Status */}
                 <div className="absolute top-4 left-5">
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(AppScreen.LIVE_QA); }}
                      className="flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur-md px-3 py-1 rounded-full text-white text-[9px] font-black uppercase tracking-tighter shadow-lg border border-white/20 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[14px] animate-pulse">sensors</span>
                      <span className="underline decoration-white/30">{circle.activeNow} Active Now</span>
                    </button>
                 </div>

                 {/* Category Badge */}
                 <div className="absolute bottom-4 left-5">
                    <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white text-[9px] font-black uppercase tracking-widest">
                       {circle.category}
                    </div>
                 </div>
              </div>

              <div className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <h4 className="text-xl font-black leading-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors">{circle.name}</h4>
                       <button 
                         onClick={(e) => { e.stopPropagation(); navigate(AppScreen.CONNECTIONS); }}
                         className="flex items-center gap-2 mt-1 active:scale-95 transition-all group/stat"
                       >
                          <span className="material-symbols-outlined text-slate-400 text-sm group-hover/stat:text-primary">group</span>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover/stat:text-primary underline decoration-slate-300 decoration-1 underline-offset-4">{circle.members.toLocaleString()} Members</p>
                       </button>
                    </div>
                    {circle.isJoined && (
                        <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                           <span className="material-symbols-outlined fill-1">check_circle</span>
                        </div>
                    )}
                 </div>

                 {/* Moderator Info */}
                 <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 mb-6">
                    <div className="relative">
                       <img src={circle.expertAvatar} className="size-10 rounded-xl object-cover ring-2 ring-primary/20" alt={circle.expertModerator} />
                       <div className="absolute -bottom-1 -right-1 size-4 bg-emerald-500 rounded-full border-2 border-slate-50 dark:border-background-dark flex items-center justify-center">
                          <span className="material-symbols-outlined text-[8px] text-white font-black">verified</span>
                       </div>
                    </div>
                    <div>
                       <p className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5">Expert Moderator</p>
                       <p className="text-xs font-black text-slate-900 dark:text-white leading-none">{circle.expertModerator}</p>
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5">
                    <div className="flex gap-1.5">
                       {circle.tags.map(tag => (
                         <span key={tag} className="text-[8px] font-black uppercase text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md">#{tag}</span>
                       ))}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(AppScreen.CIRCLE_DISCUSSION, undefined, undefined, undefined, circle);
                      }}
                      className={`h-11 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                       circle.isJoined 
                       ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' 
                       : 'urkio-gradient text-white shadow-xl shadow-primary/20'
                    }`}>
                       {circle.isJoined ? 'Enter Room' : 'Join Circle'}
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav role="USER" currentScreen={AppScreen.COMMUNITY_CIRCLES} navigate={navigate} />
    </div>
  );
};

export default CommunityCircles;
