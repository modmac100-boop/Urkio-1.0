
import React, { useState, useMemo } from 'react';
import { AppScreen } from '../types';
import { BottomNav } from '../components/Navigation';

type EventType = 'Audio Room' | 'Workshop' | 'Q&A' | 'Masterclass';

interface UrkioEvent {
  id: string;
  title: string;
  type: EventType;
  hostName: string;
  hostAvatar: string;
  date: string;
  time: string;
  attendees: number;
  image: string;
  isFeatured?: boolean;
  category: string;
}

const MOCK_EVENTS: UrkioEvent[] = [
  {
    id: 'e0',
    title: 'The Neuroscience of Morning Rhythms',
    type: 'Masterclass',
    hostName: 'Dr. Marcus Chen',
    hostAvatar: 'https://picsum.photos/seed/marcus/100/100',
    date: 'Tomorrow',
    time: '09:00 AM',
    attendees: 420,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    category: 'Sleep Science'
  },
  {
    id: 'e1',
    title: 'Deep Work & Mental Clarity Workshop',
    type: 'Workshop',
    hostName: 'Dr. Sarah Jenkins',
    hostAvatar: 'https://picsum.photos/seed/jenk/100/100',
    date: 'Oct 26',
    time: '2:00 PM',
    attendees: 156,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
    category: 'Performance'
  },
  {
    id: 'e2',
    title: 'Anxiety Support: Intimate Circle',
    type: 'Audio Room',
    hostName: 'Emma Watson',
    hostAvatar: 'https://picsum.photos/seed/u2/100/100',
    date: 'Oct 27',
    time: '4:30 PM',
    attendees: 89,
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600',
    category: 'Mental Wellbeing'
  },
  {
    id: 'e3',
    title: 'Live Q&A: Biohacking Your Gut',
    type: 'Q&A',
    hostName: 'Mark Thompson',
    hostAvatar: 'https://picsum.photos/seed/mark/100/100',
    date: 'Oct 28',
    time: '11:00 AM',
    attendees: 210,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
    category: 'Nutrition'
  }
];

interface Props {
  navigate: (screen: AppScreen) => void;
}

const UpcomingEvents: React.FC<Props> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'All' | EventType>('All');
  const [rsvpedIds, setRsvpedIds] = useState<Set<string>>(new Set());
  const [showSyncToast, setShowSyncToast] = useState(false);

  const filteredEvents = useMemo(() => {
    const list = activeTab === 'All' ? MOCK_EVENTS : MOCK_EVENTS.filter(e => e.type === activeTab);
    return list.filter(e => !e.isFeatured);
  }, [activeTab]);

  const featuredEvent = MOCK_EVENTS.find(e => e.isFeatured);

  const toggleRsvp = (id: string) => {
    setRsvpedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        setShowSyncToast(true);
        setTimeout(() => setShowSyncToast(false), 3000);
      }
      return next;
    });
  };

  const getTypeColor = (type: EventType) => {
    switch (type) {
      case 'Audio Room': return 'text-urkio-magenta bg-urkio-magenta/10 border-urkio-magenta/20';
      case 'Workshop': return 'text-primary bg-primary/10 border-primary/20';
      case 'Q&A': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Masterclass': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl pb-32 font-sans overflow-x-hidden">
      {/* Immersive Branded Header */}
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
              <h2 className="text-2xl font-black font-display tracking-tight">Events Hub</h2>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Discover your path</p>
            </div>
          </div>
          <button className="size-11 flex items-center justify-center rounded-2xl bg-primary/5 text-primary">
            <span className="material-symbols-outlined">calendar_today</span>
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {(['All', 'Masterclass', 'Workshop', 'Audio Room', 'Q&A'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${
                activeTab === tab 
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105' 
                  : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-white/10 text-slate-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-12">
        {/* Featured Hero Discovery */}
        {activeTab === 'All' && featuredEvent && (
          <section className="animate-in fade-in slide-in-from-bottom duration-700">
             <div className="flex items-center justify-between px-1 mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Personalized Pick</h3>
                <span className="material-symbols-outlined text-primary animate-pulse">auto_awesome</span>
             </div>
             
             <div 
               onClick={() => navigate(AppScreen.DAILY_SPOTLIGHT)}
               className="relative group overflow-hidden rounded-[3rem] bg-slate-950 text-white p-8 shadow-2xl active:scale-[0.98] transition-all border border-white/10 cursor-pointer"
             >
                <div className="absolute inset-0 z-0">
                  <img src={featuredEvent.image} className="size-full object-cover opacity-40 group-hover:scale-110 duration-[3s] transition-transform" alt="Featured" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                </div>
                
                <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-start">
                    <div className={`px-4 py-1.5 backdrop-blur-md border rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${getTypeColor(featuredEvent.type)}`}>
                      <span className="material-symbols-outlined text-[14px]">bolt</span>
                      {featuredEvent.type}
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex flex-col items-center">
                       <span className="text-[10px] font-black">{featuredEvent.date}</span>
                       <span className="text-[8px] font-bold text-white/60 uppercase">Starts</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-3xl font-black font-display leading-tight mb-2 pr-10">{featuredEvent.title}</h3>
                    <div className="flex items-center gap-3">
                       <img src={featuredEvent.hostAvatar} className="size-6 rounded-lg border border-white/20" alt="host" />
                       <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">with {featuredEvent.hostName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                       <div className="flex -space-x-2">
                          {[1,2,3].map(i => <img key={i} src={`https://picsum.photos/seed/u${i+20}/40/40`} className="size-6 rounded-full border-2 border-slate-900 object-cover" alt="p" />)}
                       </div>
                       <span className="text-[9px] font-black text-white/50 uppercase">+{featuredEvent.attendees} going</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleRsvp(featuredEvent.id); }}
                      className={`h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                        rsvpedIds.has(featuredEvent.id) 
                          ? 'bg-emerald-500 text-white' 
                          : 'urkio-gradient text-white'
                      }`}
                    >
                      {rsvpedIds.has(featuredEvent.id) ? 'Journey Synced' : 'RSVP Now'}
                    </button>
                  </div>
                </div>
             </div>
          </section>
        )}

        {/* Categorized Feed */}
        <section className="space-y-8">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                {activeTab === 'All' ? 'Upcoming Sessions' : `${activeTab}s`}
              </h3>
              <button className="text-[10px] font-black text-primary uppercase">Sort by Date</button>
           </div>
           
           <div className="space-y-6">
              {filteredEvents.length > 0 ? filteredEvents.map((event, i) => (
                <div 
                  key={event.id}
                  onClick={() => event.type === 'Audio Room' ? navigate(AppScreen.LIVE_AUDIO_ROOM) : navigate(AppScreen.DAILY_SPOTLIGHT)}
                  className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group cursor-pointer overflow-hidden animate-in fade-in slide-in-from-bottom duration-500"
                  style={{animationDelay: `${i * 100}ms`}}
                >
                   <div className="flex flex-col">
                      <div className="h-44 relative overflow-hidden">
                         <img src={event.image} className="size-full object-cover group-hover:scale-105 transition-transform duration-[2s]" alt={event.title} />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                         
                         <div className="absolute top-4 left-6">
                            <div className={`px-3 py-1.5 backdrop-blur-md border rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg ${getTypeColor(event.type)}`}>
                               <span className="material-symbols-outlined text-[14px]">
                                 {event.type === 'Audio Room' ? 'campaign' : event.type === 'Workshop' ? 'school' : 'quiz'}
                               </span>
                               {event.type}
                            </div>
                         </div>

                         <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                            <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white">
                               <p className="text-[10px] font-black uppercase leading-none mb-1">{event.date}</p>
                               <p className="text-[8px] font-bold text-white/60 uppercase">{event.time}</p>
                            </div>
                            <div className="size-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                               <span className="material-symbols-outlined fill-1">play_arrow</span>
                            </div>
                         </div>
                      </div>

                      <div className="p-6">
                         <div className="flex justify-between items-start gap-4 mb-6">
                            <div className="flex-1">
                               <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-1">{event.category}</p>
                               <h4 className="text-lg font-black leading-tight group-hover:text-primary transition-colors">{event.title}</h4>
                            </div>
                         </div>

                         <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5">
                            <div className="flex items-center gap-3">
                               <img src={event.hostAvatar} className="size-10 rounded-xl object-cover ring-2 ring-primary/5" alt="host" />
                               <div>
                                  <p className="text-xs font-black text-slate-900 dark:text-white leading-none mb-1">{event.hostName}</p>
                                  <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Urkio Specialist</p>
                               </div>
                            </div>
                            <button 
                               onClick={(e) => { e.stopPropagation(); toggleRsvp(event.id); }}
                               className={`h-11 px-6 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                 rsvpedIds.has(event.id) 
                                   ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                                   : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-primary hover:text-white'
                               }`}
                            >
                               <div className="flex items-center gap-2">
                                  <span className="material-symbols-outlined text-[16px]">
                                    {rsvpedIds.has(event.id) ? 'check_circle' : 'add_circle'}
                                  </span>
                                  {rsvpedIds.has(event.id) ? 'Synced' : 'RSVP'}
                               </div>
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              )) : (
                <div className="py-24 text-center">
                   <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center mx-auto mb-6 text-slate-300">
                      <span className="material-symbols-outlined text-5xl">event_busy</span>
                   </div>
                   <h3 className="text-xl font-black mb-2">No {activeTab}s Scheduled</h3>
                   <p className="text-sm text-slate-500 px-10 leading-relaxed">Check back later or explore other event types for your journey.</p>
                </div>
              )}
           </div>
        </section>
      </main>

      {/* Sync Feedback Toast */}
      {showSyncToast && (
        <div className="fixed bottom-28 left-6 right-6 z-[100] animate-toast-in max-w-md mx-auto">
           <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-400">
              <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center">
                 <span className="material-symbols-outlined font-black">sync</span>
              </div>
              <div className="flex-1">
                 <p className="text-xs font-black uppercase tracking-widest">Journey Synced</p>
                 <p className="text-[10px] font-medium opacity-90">Added to your calendar and reflections.</p>
              </div>
              <button onClick={() => setShowSyncToast(false)} className="text-white/60">
                 <span className="material-symbols-outlined text-sm">close</span>
              </button>
           </div>
        </div>
      )}

      <footer className="p-12 text-center bg-white dark:bg-background-dark border-t border-gray-100 dark:border-white/5">
         <div className="size-12 bg-white dark:bg-slate-900 rounded-2xl mx-auto flex items-center justify-center shadow-lg border border-gray-100 dark:border-white/10 mb-6">
            <svg className="size-6" viewBox="0 0 100 120" fill="none">
               <path d="M24 15V80C24 95 36 105 50 105C64 105 76 95 76 80V15" stroke="url(#footGrad)" strokeWidth="30" strokeLinecap="round" />
               <defs><linearGradient id="footGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#d946ef" /><stop offset="100%" stopColor="#135bec" /></linearGradient></defs>
            </svg>
         </div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Urkio Live Programming • Empowering Your Growth</p>
      </footer>

      <BottomNav role="USER" currentScreen={AppScreen.UPCOMING_EVENTS} navigate={navigate} />
    </div>
  );
};

export default UpcomingEvents;
