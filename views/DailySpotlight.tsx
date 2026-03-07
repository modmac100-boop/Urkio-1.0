
import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const DailySpotlight: React.FC<Props> = ({ navigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const expertInsights = [
    {
      expert: 'Dr. Marcus Chen',
      role: 'Circadian Biologist',
      insight: 'The 10-minute "Light Window" isn\'t just about wakefulness—it\'s about timing your peak cognitive performance for the afternoon.',
      avatar: 'https://picsum.photos/seed/marcus/150/150',
      tag: 'Biohacking'
    },
    {
      expert: 'Dr. Sarah Miller',
      role: 'Neuro-Psychologist',
      insight: 'Anxiety often lives in the gap between our biological clock and our social schedule. Alignment is the first step to peace.',
      avatar: 'https://picsum.photos/seed/sarah/150/150',
      tag: 'Mental Health'
    }
  ];

  const videoSpotlights = [
    {
      id: 'v1',
      title: 'Pineal Gland: The Internal Sun',
      views: '45.2k',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400',
      duration: '4:20',
      type: 'Scientific'
    },
    {
      id: 'v2',
      title: 'Designing Sleep Sanctuaries',
      views: '89.1k',
      image: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&q=80&w=400',
      duration: '3:45',
      type: 'Lifestyle'
    }
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl pb-32 font-sans overflow-x-hidden">
      {/* Floating Branded Header (Visible on Scroll) */}
      <header className={`fixed top-0 left-0 right-0 z-50 max-w-md mx-auto px-6 py-4 flex items-center justify-between transition-all duration-500 ${scrolled ? 'bg-white/90 dark:bg-background-dark/95 backdrop-blur-md translate-y-0' : '-translate-y-full opacity-0'}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(AppScreen.TRENDING_TOPICS)} className="size-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5">
            <span className="material-symbols-outlined text-sm">arrow_back_ios_new</span>
          </button>
          <h2 className="text-sm font-black font-display uppercase tracking-widest text-primary">Daily Spotlight</h2>
        </div>
        <button className="size-9 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
          <span className="material-symbols-outlined text-lg">ios_share</span>
        </button>
      </header>

      {/* Immersive Cinematic Hero Section */}
      <div className="relative h-[55vh] w-full overflow-hidden shrink-0 group">
        <img 
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000" 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" 
          alt="Sunset Meditation"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-background-dark via-transparent to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark/40 to-transparent"></div>
        
        {/* Static Header Over Hero */}
        <div className="absolute top-8 left-6 right-6 flex items-center justify-between z-20">
          <button 
            onClick={() => navigate(AppScreen.TRENDING_TOPICS)}
            className="size-12 rounded-[1.2rem] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-lg active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-primary backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/30 flex items-center gap-2">
               <span className="material-symbols-outlined text-[14px] animate-pulse">bolt</span>
               Trending Now
            </div>
          </div>
        </div>

        {/* Hero Title & Floating Stats */}
        <div className="absolute bottom-12 left-8 right-8 z-20">
          <div className="flex items-center gap-3 mb-4">
             <span className="text-[10px] font-black uppercase text-white/70 tracking-[0.4em] mb-1">Vol. 42 • Health Pulse</span>
          </div>
          <h1 className="text-4xl font-black text-white font-display leading-[1.1] mb-6 drop-shadow-2xl">
            Biological <span className="text-primary italic">Rhythms</span> <br/>& Human Performance
          </h1>
          
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                   {[1,2,3].map(i => <img key={i} src={`https://picsum.photos/seed/u${i+5}/80/80`} className="size-7 rounded-full border-2 border-white/20 object-cover" />)}
                </div>
                <span className="text-[9px] font-black text-white uppercase tracking-widest">12.4k Exploring</span>
             </div>
             <div className="size-1 w-1 bg-white/30 rounded-full"></div>
             <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-white text-[14px]">schedule</span>
                <span className="text-[9px] font-black text-white uppercase tracking-widest">12m Read</span>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 px-8 py-12 space-y-16 relative z-30 -mt-8 rounded-t-[3rem] bg-slate-50 dark:bg-background-dark">
        
        {/* Intro Digest */}
        <section className="space-y-6">
           <div className="flex items-center gap-3 mb-2">
              <div className="size-1 h-8 urkio-gradient rounded-full"></div>
              <h3 className="text-xl font-black font-display tracking-tight">The Circadian Core</h3>
           </div>
           <p className="text-base leading-[1.8] font-medium text-slate-600 dark:text-slate-300">
             Your internal clock is a sophisticated biological mechanism that dictates everything from your <span className="text-primary font-black">metabolic rate</span> to your emotional resilience. When we drift out of sync, we experience the modern malaise: chronic fatigue, brain fog, and baseline anxiety.
           </p>
        </section>

        {/* Expert Insight Cards */}
        <section className="space-y-8">
           <div className="flex items-center justify-between px-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Expert Masterclass</h4>
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
           </div>
           <div className="space-y-6">
              {expertInsights.map((item, i) => (
                <div key={i} className="group bg-white dark:bg-slate-900/50 p-7 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-primary/30 transition-all duration-500 animate-in slide-in-from-bottom duration-700" style={{animationDelay: `${i * 150}ms`}}>
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                         <div className="size-14 rounded-2xl urkio-gradient p-0.5 shadow-lg group-hover:rotate-3 transition-transform">
                            <img src={item.avatar} className="size-full rounded-[14px] object-cover border-2 border-white dark:border-slate-800" alt={item.expert} />
                         </div>
                         <div>
                            <h5 className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1.5">{item.expert}</h5>
                            <p className="text-[9px] font-bold text-primary uppercase tracking-widest">{item.role}</p>
                         </div>
                      </div>
                      <span className="text-[8px] font-black bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg uppercase text-slate-500 tracking-tighter">{item.tag}</span>
                   </div>
                   <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 italic font-medium">
                     "{item.insight}"
                   </p>
                   <div className="mt-6 pt-6 border-t border-gray-50 dark:border-white/5 flex justify-end">
                      <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary hover:translate-x-1 transition-transform">
                         Full Interview <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Immersive Video Vault */}
        <section className="space-y-8">
           <div className="flex items-center justify-between px-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Visual Core</h4>
              <button className="text-[10px] font-bold text-primary uppercase underline underline-offset-4">Browse Archive</button>
           </div>
           
           <div className="flex gap-6 overflow-x-auto no-scrollbar -mx-8 px-8 pb-4">
              {videoSpotlights.map((video, i) => (
                <div key={video.id} className="shrink-0 w-64 group cursor-pointer">
                   <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-5 shadow-2xl group-hover:shadow-primary/20 transition-all duration-700">
                      <img src={video.image} className="size-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={video.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                         <div className="size-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform">
                            <span className="material-symbols-outlined text-3xl fill-1">play_arrow</span>
                         </div>
                      </div>

                      <div className="absolute bottom-5 left-6 right-6 flex justify-between items-center">
                         <div className="flex items-center gap-2">
                            <span className="size-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]"></span>
                            <span className="text-[9px] font-black uppercase text-white tracking-widest">{video.views} Active</span>
                         </div>
                         <span className="text-[9px] font-black text-white/60 uppercase">{video.duration}</span>
                      </div>
                   </div>
                   <div className="px-1">
                      <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-1">{video.type}</p>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{video.title}</h4>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Community Echo Section */}
        <section className="space-y-8">
           <div className="flex items-center justify-between px-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Member Echoes</h4>
              <span className="material-symbols-outlined text-urkio-magenta opacity-40">forum</span>
           </div>
           
           <div className="grid grid-cols-1 gap-6">
              {[
                { user: 'Ava Maxwell', text: 'Resetting my biological clock was the single most impactful change in my postpartum recovery. Highly recommend the 10-min sunlight rule.', avatar: 'https://picsum.photos/seed/ava/100/100', likes: 124 },
                { user: 'Liam G.', text: 'Does anyone have tips for late-shift workers? Struggling to sync with the experts advice today.', avatar: 'https://picsum.photos/seed/liam/100/100', likes: 89 }
              ].map((post, i) => (
                <div key={i} className="p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer">
                   <div className="flex items-center gap-4 mb-4">
                      <img src={post.avatar} className="size-10 rounded-xl object-cover ring-2 ring-slate-50 dark:ring-slate-800" alt={post.user} />
                      <div className="flex-1 min-w-0">
                         <h5 className="text-xs font-black truncate">{post.user}</h5>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Journey Seeker</p>
                      </div>
                      <div className="flex items-center gap-1 text-urkio-magenta">
                         <span className="material-symbols-outlined text-[16px] fill-1">volunteer_activism</span>
                         <span className="text-[10px] font-black">{post.likes}</span>
                      </div>
                   </div>
                   <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-3">"{post.text}"</p>
                </div>
              ))}
           </div>
        </section>

        {/* Impact Action Banner */}
        <section className="pb-12">
           <div className="relative rounded-[3rem] bg-slate-950 p-10 text-white overflow-hidden shadow-2xl border border-white/10 group">
              <div className="absolute top-0 right-0 p-8 opacity-10 translate-x-4 -translate-y-4 group-hover:rotate-12 transition-transform duration-1000">
                 <span className="material-symbols-outlined text-9xl">psychology</span>
              </div>
              <div className="relative z-10 space-y-8">
                 <div className="space-y-3">
                    <h3 className="text-3xl font-black font-display leading-tight">Apply the <span className="text-primary italic">Wisdom</span></h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[240px]">Download the personalized "Circadian Checklist" curated by Dr. Marcus Chen for our premium seekers.</p>
                 </div>
                 
                 <div className="flex flex-col gap-3">
                    <button className="h-16 w-full urkio-gradient rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all">
                       <span className="material-symbols-outlined">download</span>
                       Get Expert Guide
                    </button>
                    <button 
                      onClick={() => navigate(AppScreen.EXPERT_DISCOVERY)}
                      className="h-16 w-full bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                    >
                       Book a Sync Session
                    </button>
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* Branded Footer Disclaimer */}
      <footer className="p-12 text-center bg-slate-50 dark:bg-background-dark border-t border-gray-100 dark:border-white/5">
         <div className="size-12 bg-white dark:bg-slate-900 rounded-2xl mx-auto flex items-center justify-center shadow-lg border border-gray-100 dark:border-white/10 mb-6">
            <svg className="size-8" viewBox="0 0 100 120" fill="none">
               <path d="M24 15V80C24 95 36 105 50 105C64 105 76 95 76 80V15" stroke="url(#footGrad)" strokeWidth="30" strokeLinecap="round" />
               <defs><linearGradient id="footGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#d946ef" /><stop offset="100%" stopColor="#135bec" /></linearGradient></defs>
            </svg>
         </div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Urkio Health Intelligence • Vol. 42</p>
         <p className="text-[8px] font-medium text-slate-400 mt-4 leading-relaxed px-10">Verification ID: #SPOT-8291-CYC. <br/>Verified by Urkio Clinical Integrity Team.</p>
      </footer>
    </div>
  );
};

export default DailySpotlight;
