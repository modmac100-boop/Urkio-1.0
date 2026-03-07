
import React, { useState } from 'react';
import { AppScreen } from '../types';

interface Connection {
  id: string;
  name: string;
  title: string;
  image: string;
  isExpert: boolean;
  isFollowing: boolean;
  isFriend?: boolean;
  isPendingFriend?: boolean;
}

const MOCK_CONNECTIONS: Connection[] = [
  { id: '1', name: 'Dr. Sarah Miller', title: 'Clinical Psychologist', image: 'https://picsum.photos/seed/dr1/100/100', isExpert: true, isFollowing: true, isFriend: true },
  { id: '2', name: 'Mark Thompson', title: 'Functional Nutritionist', image: 'https://picsum.photos/seed/mark/100/100', isExpert: true, isFollowing: true },
  { id: '3', name: 'Emma Watson', title: 'Community Seeker', image: 'https://picsum.photos/seed/u2/100/100', isExpert: false, isFollowing: true, isFriend: true },
  { id: '4', name: 'Liam Payne', title: 'Wellness Enthusiast', image: 'https://picsum.photos/seed/liam/100/100', isExpert: false, isFollowing: false, isPendingFriend: true },
  { id: '5', name: 'Dr. Marcus Chen', title: 'Sleep Scientist', image: 'https://picsum.photos/seed/marcus/100/100', isExpert: true, isFollowing: false },
];

const Connections: React.FC<{ navigate: (s: AppScreen) => void }> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'Following' | 'Followers'>('Following');
  const [searchQuery, setSearchQuery] = useState('');
  const [connections, setConnections] = useState(MOCK_CONNECTIONS);

  const filteredConnections = connections.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (activeTab === 'Following' ? c.isFollowing : true)
  );

  const toggleFollow = (id: string) => {
    setConnections(prev => prev.map(c => 
      c.id === id ? { ...c, isFollowing: !c.isFollowing } : c
    ));
  };

  const handleFriendRequest = (id: string) => {
    setConnections(prev => prev.map(c => 
      c.id === id ? { ...c, isPendingFriend: !c.isPendingFriend, isFriend: false } : c
    ));
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md px-6 pt-12 pb-4 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => navigate(AppScreen.USER_PROFILE)}
               className="size-11 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 active:scale-95 transition-all"
             >
               <span className="material-symbols-outlined">arrow_back_ios_new</span>
             </button>
             <h2 className="text-xl font-black font-display tracking-tight">Connections</h2>
          </div>
          <button 
            onClick={() => navigate(AppScreen.DISCOVER_CONNECTIONS)}
            className="size-11 flex items-center justify-center rounded-2xl bg-primary/10 text-primary animate-pulse"
            title="Discover New"
          >
             <span className="material-symbols-outlined">person_add</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
           <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
           <input 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full pl-12 pr-4 h-14 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-500 shadow-inner"
             placeholder="Find people in the circle..."
           />
        </div>

        {/* Tab System */}
        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl">
           {(['Following', 'Followers'] as const).map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-500'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
         {/* Discover Shortcut */}
         <div 
           onClick={() => navigate(AppScreen.DISCOVER_CONNECTIONS)}
           className="bg-primary/5 border border-primary/20 p-5 rounded-[2rem] flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all mb-4"
         >
            <div className="flex items-center gap-4">
               <div className="size-12 rounded-2xl urkio-gradient flex items-center justify-center text-white shadow-lg">
                  <span className="material-symbols-outlined">explore</span>
               </div>
               <div>
                  <h4 className="text-sm font-black text-primary">Discover New Members</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Connect with similar journeys</p>
               </div>
            </div>
            <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
         </div>

         {filteredConnections.length > 0 ? filteredConnections.map(person => (
           <div key={person.id} className="flex flex-col p-5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-sm group hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className={`size-14 rounded-2xl overflow-hidden border-2 p-0.5 ${person.isExpert ? 'urkio-gradient shadow-lg' : 'border-slate-100 dark:border-white/5'}`}>
                    <img src={person.image} className="size-full object-cover rounded-[14px]" alt={person.name} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <h4 className="text-sm font-black truncate">{person.name}</h4>
                        {person.isExpert && (
                        <span className="material-symbols-outlined text-primary text-[14px] fill-1">verified</span>
                        )}
                        {person.isFriend && (
                           <div className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[7px] font-black text-emerald-500 uppercase">Friend</div>
                        )}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{person.title}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                    onClick={() => toggleFollow(person.id)}
                    className={`flex-1 h-11 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    person.isFollowing 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' 
                        : 'urkio-gradient text-white shadow-xl'
                    }`}
                >
                    {person.isFollowing ? 'Following' : 'Follow'}
                </button>
                <button 
                    onClick={() => handleFriendRequest(person.id)}
                    disabled={person.isFriend}
                    className={`flex-1 h-11 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                       person.isFriend ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 opacity-60' :
                       person.isPendingFriend ? 'bg-amber-500/10 border-amber-500 text-amber-500' :
                       'bg-white dark:bg-slate-900 border-gray-100 dark:border-white/10 text-slate-900 dark:text-white hover:border-primary'
                    }`}
                >
                    {person.isFriend ? 'Connected' : person.isPendingFriend ? 'Request Sent' : 'Add Friend'}
                </button>
              </div>
           </div>
         )) : (
           <div className="py-24 text-center">
              <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-6 text-slate-300">
                 <span className="material-symbols-outlined text-5xl">group_off</span>
              </div>
              <h3 className="text-xl font-black mb-2">No Connections</h3>
              <p className="text-sm text-slate-500 px-10 leading-relaxed">Search for experts or seekers to grow your support network.</p>
           </div>
         )}
      </main>

      <footer className="p-8 text-center bg-white dark:bg-background-dark border-t border-gray-100 dark:border-white/5">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Build your circle • Empower each other</p>
      </footer>
    </div>
  );
};

export default Connections;
