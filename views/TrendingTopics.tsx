
import React, { useState } from 'react';
import { AppScreen } from '../types';
import { BottomNav } from '../components/Navigation';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const TrendingTopics: React.FC<Props> = ({ navigate }) => {
  const [activeTagCategory, setActiveTagCategory] = useState('Global');

  const categories = ['Global', 'Mindset', 'Physical', 'Nutrition'];

  const trendingHashtags = {
    'Global': [
      { tag: '#GutHealth', volume: '12.4k', trend: 'up' },
      { tag: '#UrkioReflections', volume: '15.9k', trend: 'up' },
      { tag: '#HolisticHabits', volume: '3.3k', trend: 'stable' }
    ],
    'Mindset': [
      { tag: '#MindfulParenting', volume: '8.2k', trend: 'up' },
      { tag: '#CBTDaily', volume: '4.1k', trend: 'up' },
      { tag: '#MeditationPro', volume: '2.5k', trend: 'down' }
    ],
    'Physical': [
      { tag: '#PostpartumJoy', volume: '5.1k', trend: 'up' },
      { tag: '#MobilityFlow', volume: '2.8k', trend: 'stable' }
    ],
    'Nutrition': [
      { tag: '#MicrobiomeMagic', volume: '6.7k', trend: 'up' },
      { tag: '#CleanFats', volume: '1.2k', trend: 'up' }
    ]
  };

  const popularPosts = [
    {
      id: 'p1',
      title: 'The science behind morning gratitude and dopamine regulation',
      author: 'Dr. Sarah Miller',
      stats: '4.2k supports • 892 comments',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400',
      category: 'Psychology'
    },
    {
      id: 'p2',
      title: '5 adaptogenic herbs for natural cortisol management',
      author: 'Mark Thompson',
      stats: '2.8k supports • 451 comments',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400',
      category: 'Nutrition'
    }
  ];

  const risingCircles = [
    { id: 'c1', name: 'Intermittent Fasting Experts', growth: '+45% this week', members: '12.4k', icon: 'nutrition', color: 'bg-amber-500' },
    { id: 'c2', name: 'Sleep Hygiene Support', growth: '+22% this week', members: '8.2k', icon: 'bedtime', color: 'bg-indigo-500' },
    { id: 'c3', name: 'Child Behavioral Health', growth: '+18% this week', members: '3.1k', icon: 'child_care', color: 'bg-emerald-500' },
    { id: 'c4', name: 'Menopause Wellness', growth: '+12% this week', members: '5.6k', icon: 'woman', color: 'bg-urkio-magenta' }
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl pb-32 font-sans overflow-x-hidden">
      {/* Dynamic Hub Header */}
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
                <h2 className="text-2xl font-black font-display tracking-tight">Discovery Hub</h2>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Explore Trending Insights</p>
             </div>
          </div>
          <button 
            onClick={() => navigate(AppScreen.SEARCH_RESULTS)}
            className="size-11 flex items-center justify-center rounded-2xl bg-primary/5 text-primary"
          >
             <span className="material-symbols-outlined">search</span>
          </button>
        </div>

        {/* Pulse Indicator Bar */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in fade-in duration-700">
           <div className="flex items-center gap-3">
              <div className="relative">
                 <span className="absolute inset-0 bg-primary/40 blur-md rounded-full animate-ping"></span>
                 <div className="relative size-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-sm fill-1">insights</span>
                 </div>
              </div>
              <div>
                 <p className="text-xs font-black text-slate-900 dark:text-white">Urkio Pulse is High</p>
                 <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">4.2k members active now</p>
              </div>
           </div>
           <div className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-gray-100 dark:border-white/5 shadow-sm">
              <span className="text-[10px] font-black text-primary">Trending</span>
              <span className="material-symbols-outlined text-primary text-[14px]">arrow_upward</span>
           </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar space-y-10 p-6 pt-8">
        {/* Featured Daily Spotlight */}
        <section>
          <div 
            onClick={() => navigate(AppScreen.DAILY_SPOTLIGHT)}
            className="relative group overflow-hidden rounded-[2.5rem] bg-slate-950 text-white p-8 shadow-2xl active:scale-[0.98] transition-all border border-white/10 cursor-pointer"
          >
            <div className="absolute inset-0 z-0">
               <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800" className="size-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-50 transition-all duration-1000" alt="Spotlight" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            </div>
            
            <div className="relative z-10 space-y-8">
               <div className="flex justify-between items-start">
                  <div className="px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    Daily Deep Dive
                  </div>
                  <span className="material-symbols-outlined text-white/20 text-4xl">psychology</span>
               </div>
               
               <div>
                  <h3 className="text-3xl font-black font-display leading-tight mb-3">Circadian Biology <br/><span className="text-primary italic">& Mental Focus</span></h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[220px]">How light resets your brain for peak cognitive performance.</p>
               </div>
               
               <div className="flex items-center justify-between">
                  <div className="flex -space-x-3">
                     {[1,2,3].map(i => <img key={i} src={`https://picsum.photos/seed/face${i}/80/80`} className="size-8 rounded-full border-2 border-slate-900 object-cover" />)}
                     <div className="size-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[8px] font-black">+24</div>
                  </div>
                  <button className="h-12 px-8 urkio-gradient text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl group-hover:scale-105 transition-transform">Explore Now</button>
               </div>
            </div>
          </div>
        </section>

        {/* Categorized Trending Hashtags */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Trending Hashtags</h4>
              <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[200px]">
                 {categories.map(cat => (
                   <button 
                     key={cat}
                     onClick={() => setActiveTagCategory(cat)}
                     className={`shrink-0 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all ${activeTagCategory === cat ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
           </div>
           
           <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
              {(trendingHashtags[activeTagCategory as keyof typeof trendingHashtags] || []).map((h, i) => (
                <div 
                  key={h.tag} 
                  className="shrink-0 flex flex-col items-start gap-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 min-w-[160px] shadow-sm hover:shadow-lg transition-all animate-in slide-in-from-right duration-500"
                  style={{animationDelay: `${i * 100}ms`}}
                >
                   <div className="size-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-xl">tag</span>
                   </div>
                   <div>
                      <h5 className="text-sm font-black text-slate-900 dark:text-white mb-1">{h.tag}</h5>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">{h.volume} posts</span>
                         <span className={`material-symbols-outlined text-sm ${h.trend === 'up' ? 'text-emerald-500' : h.trend === 'down' ? 'text-red-500' : 'text-slate-400'}`}>
                           {h.trend === 'up' ? 'trending_up' : h.trend === 'down' ? 'trending_down' : 'remove'}
                         </span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Viral Conversations / Most Discussed */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Viral Conversations</h4>
              <button onClick={() => navigate(AppScreen.COMMUNITY_FEED)} className="text-[10px] font-bold text-primary uppercase">View Feed</button>
           </div>
           
           <div className="space-y-6">
              {popularPosts.map(post => (
                <div key={post.id} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer">
                   <div className="flex flex-col">
                      <div className="h-44 w-full relative overflow-hidden">
                         <img src={post.image} className="size-full object-cover group-hover:scale-105 duration-1000 transition-transform" alt={post.title} />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                         <div className="absolute bottom-4 left-6 flex items-center gap-2">
                            <span className="bg-urkio-magenta text-white text-[8px] font-black uppercase px-2.5 py-1 rounded-lg tracking-widest shadow-lg">Viral Now</span>
                            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[8px] font-black uppercase px-2.5 py-1 rounded-lg tracking-widest">{post.category}</span>
                         </div>
                      </div>
                      <div className="p-6">
                         <h4 className="text-lg font-black leading-tight mb-3 group-hover:text-primary transition-colors">{post.title}</h4>
                         <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shared by <span className="text-primary font-black">{post.author}</span></p>
                            <div className="flex items-center gap-1.5 text-slate-400">
                               <span className="material-symbols-outlined text-sm">chat_bubble</span>
                               <span className="text-[9px] font-black">892</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Rapidly Growing Circles */}
        <section className="space-y-6 pb-8">
           <div className="flex items-center justify-between px-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rising Communities</h4>
              <button onClick={() => navigate(AppScreen.SUPPORT_CIRCLES)} className="text-[10px] font-bold text-primary uppercase">Explore All</button>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              {risingCircles.map((circle) => (
                <div key={circle.id} className="relative bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 shadow-sm group hover:shadow-md hover:border-primary/20 transition-all active:scale-[0.98] cursor-pointer overflow-hidden">
                   {/* Growth Sparkline Indicator */}
                   <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-2 -translate-y-2 group-hover:opacity-10 transition-opacity">
                      <span className="material-symbols-outlined text-6xl">show_chart</span>
                   </div>
                   
                   <div className={`size-12 rounded-2xl ${circle.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <span className="material-symbols-outlined">{circle.icon}</span>
                   </div>
                   
                   <h5 className="text-sm font-black leading-tight mb-2 group-hover:text-primary transition-colors">{circle.name}</h5>
                   
                   <div className="space-y-3">
                      <div>
                         <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">trending_up</span>
                            {circle.growth}
                         </p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{circle.members} members</p>
                      </div>
                      
                      <button className="w-full h-9 bg-slate-50 dark:bg-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-primary hover:text-white transition-all shadow-sm">
                        Join Circle
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Suggest Topic CTA */}
        <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 translate-x-4 -translate-y-4">
              <span className="material-symbols-outlined text-8xl">bolt</span>
           </div>
           <div className="relative z-10 text-center">
              <h4 className="text-xl font-black mb-2 font-display">Ignite a Conversation</h4>
              <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed px-4">Don't see a topic you're passionate about? Start a post or suggest a new community circle today.</p>
              <button 
                onClick={() => navigate(AppScreen.CREATE_POST)}
                className="w-full h-14 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Create Trending Post
              </button>
           </div>
        </section>
      </main>

      <footer className="p-8 text-center bg-white dark:bg-background-dark border-t border-gray-100 dark:border-white/5">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Grow Together • Heal Together</p>
      </footer>

      <BottomNav role="USER" currentScreen={AppScreen.TRENDING_TOPICS} navigate={navigate} />
    </div>
  );
};

export default TrendingTopics;
