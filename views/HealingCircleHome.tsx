
import React, { useState, useEffect } from 'react';
import { AppScreen, Post, Expert, Story, Resource, Circle, Member } from '../types';
import { db, auth } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, limit, where, Timestamp } from 'firebase/firestore';
import { BottomNav } from '../components/Navigation';
import { Avatar } from '../components/Avatar';

interface Props {
  navigate: (screen: AppScreen, expert?: Expert, query?: string, resource?: Resource, circle?: Circle, stories?: Story[], storyIndex?: number, member?: Member) => void;
  language: 'en' | 'ar' | 'fr';
  setLanguage: (lang: 'en' | 'ar' | 'fr') => void;
  currentUser?: any;
}

const HealingCircleHome = ({ navigate, language, setLanguage, currentUser }: Props) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [stats, setStats] = useState({ rooms: 0, members: 0, stories: 0, experts: 0 });
  const [activeTab, setActiveTab ] = useState<'Feed' | 'Rooms' | 'Stats'>('Feed');
  const [activeStories, setActiveStories] = useState<any[]>([]);

  useEffect(() => {
    // 1. Fetch real-time posts (Community Pulse)
    const postsQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), limit(15));
    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      const fetchedPosts: Post[] = [];
      snapshot.forEach((doc) => {
        fetchedPosts.push({ id: doc.id, ...doc.data() } as Post);
      });
      setPosts(fetchedPosts);
    });

    // 2. Fetch Online Users (Presence)
    const presenceQuery = query(collection(db, 'users'), where('status', '==', 'online'), limit(12));
    const unsubscribePresence = onSnapshot(presenceQuery, (snapshot) => {
      const users: any[] = [];
      snapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      setOnlineUsers(users);
    });

    // 3. Fetch Upcoming Sessions
    const sessionsQuery = query(collection(db, 'circles'), where('status', '==', 'active'), limit(8));
    const unsubscribeSessions = onSnapshot(sessionsQuery, (snapshot) => {
      const fetchedSessions: any[] = [];
      snapshot.forEach((doc) => {
        fetchedSessions.push({ id: doc.id, ...doc.data() });
      });
      setUpcomingSessions(fetchedSessions);
    });

    // 4. Fetch Quick Stats & Stories
    const statsQuery = query(collection(db, 'stats'), limit(1));
    const unsubscribeStats = onSnapshot(statsQuery, (snapshot) => {
      if (!snapshot.empty) {
        setStats(snapshot.docs[0].data() as any);
      }
    });

    // 5. Fetch Active Stories (Placeholder for now)
    const storiesQuery = query(collection(db, 'stories'), orderBy('timestamp', 'desc'), limit(10));
    const unsubscribeStories = onSnapshot(storiesQuery, (snapshot) => {
      const fetchedStories: any[] = [];
      snapshot.forEach((doc) => {
        fetchedStories.push({ id: doc.id, ...doc.data() });
      });
      setActiveStories(fetchedStories);
    });

    return () => {
      unsubscribePosts();
      unsubscribePresence();
      unsubscribeSessions();
      unsubscribeStats();
      unsubscribeStories();
    };
  }, [language]);

  const translations = {
    en: {
      welcome: 'Healing Circle',
      search: 'Search...',
      stories: 'Stories',
      you: 'Your Story',
      sessions: 'Upcoming Sessions',
      pulse: 'Community Pulse',
      stats: 'Stats',
      rooms: 'Live Rooms',
      experts: 'Experts',
      members: 'Members',
      join: 'Join Now',
      viewAll: 'View All',
      expertInsight: 'Expert Insight'
    },
    ar: {
      welcome: 'دائرة الشفاء',
      search: 'بحث...',
      stories: 'القصص',
      you: 'قصتك',
      sessions: 'الجلسات القادمة',
      pulse: 'نبض المجتمع',
      stats: 'إحصائيات',
      rooms: 'غرف مباشرة',
      experts: 'خبراء متصلون',
      members: 'الأعضاء',
      join: 'انضم الآن',
      viewAll: 'عرض الكل',
      expertInsight: 'رؤية الخبراء'
    },
    fr: {
      welcome: 'Cercle de Guérison',
      search: 'Rechercher...',
      stories: 'Histoires',
      you: 'Votre Histoire',
      sessions: 'Sessions à Venir',
      pulse: 'Pouls de la Communauté',
      stats: 'Statistiques',
      rooms: 'Salles en Direct',
      experts: 'Experts',
      members: 'Membres',
      join: 'Rejoindre Maintenant',
      viewAll: 'Voir Tout',
      expertInsight: 'Aperçu de l\'Expert'
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-300">
      {/* Premium Header */}
      <header className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="material-symbols-outlined text-white text-xl">healing</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">{t.welcome}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative text-slate-500">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950"></span>
          </button>
          <div 
            onClick={() => navigate(AppScreen.USER_PROFILE)}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-100 dark:border-slate-800 cursor-pointer hover:border-indigo-500 transition-all"
          >
            <img src={currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.uid || 'guest'}`} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="pb-8">
        {/* Stories & Presence Scroller */}
        <section className="py-5 border-b border-slate-100 dark:border-slate-900 overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
          <div className="flex gap-5 px-4 overflow-x-auto no-scrollbar">
            {/* Create Story */}
            <div 
              onClick={() => navigate(AppScreen.CREATE_POST)}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full p-1 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center group-hover:border-indigo-500 transition-all">
                <div className="w-full h-full rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-indigo-600">
                  <span className="material-symbols-outlined text-2xl">add</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{t.you}</span>
            </div>

            {/* Active Presence/Stories */}
            {onlineUsers.map((user, idx) => (
              <div key={user.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group animate-in fade-in slide-in-from-right-4" style={{animationDelay: `${idx * 100}ms`}}>
                <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full border-2 border-white dark:border-slate-950 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} className="w-full h-full object-cover" alt={user.name} />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tighter max-w-[64px] truncate">
                  {user.name?.split(' ')[0] || 'Member'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Home Content */}
        <div className="px-4 mt-6 space-y-8">
          {/* Upcoming Sessions Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{t.sessions}</h3>
              <button 
                onClick={() => navigate(AppScreen.SUPPORT_CIRCLES)}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{t.viewAll}</button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {upcomingSessions.length > 0 ? upcomingSessions.map((session, idx) => (
                <div key={session.id} className="w-72 shrink-0 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                      <span className="material-symbols-outlined">video_chat</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{session.title}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{session.expertName || 'Expert'}</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold uppercase tracking-widest transition-colors shadow-lg shadow-indigo-600/20">
                    {t.join}
                  </button>
                </div>
              )) : (
                <div className="w-full p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
                  <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-4xl mb-3">calendar_today</span>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No active circles</p>
                </div>
              )}
            </div>
          </section>

          {/* 2x2 Stats Grid Section */}
          <section className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.members || '1.2k'}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.members}</div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm group">
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-950 flex items-center justify-center text-fuchsia-600 mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">forum</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.rooms || '24'}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.rooms}</div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.experts || '85'}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.experts}</div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm group">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950 flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">auto_stories</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.stories || '420'}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.stories}</div>
            </div>
          </section>

          {/* Community Pulse Feed */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                {t.pulse}
              </h3>
              <button 
                onClick={() => navigate(AppScreen.COMMUNITY_FEED)}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{t.viewAll}</button>
            </div>

            <div className="space-y-6 pb-12">
              {posts.map((post, idx) => (
                <div key={post.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-6 shadow-sm animate-in fade-in slide-in-from-bottom-6" style={{animationDelay: `${idx * 150}ms`}}>
                  <div className="flex items-center gap-4 mb-5">
                    <Avatar src={post.authorImage} size="md" isExpert={post.isExpert} />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{post.authorName}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{post.authorType}</p>
                    </div>
                    <button className="w-10 h-10 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors">
                      <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                    {post.content}
                  </p>
                  {post.image && (
                    <div className="rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 mb-5">
                      <img src={post.image} className="w-full aspect-video object-cover" alt="Post content" />
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-5 border-t border-slate-50 dark:border-slate-800/50">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors">
                        <span className="material-symbols-outlined text-xl">favorite</span>
                        <span className="text-xs font-bold">{post.likes || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <span className="material-symbols-outlined text-xl">chat_bubble</span>
                        <span className="text-xs font-bold">{post.comments || 0}</span>
                      </button>
                    </div>
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                      <span className="material-symbols-outlined text-xl">share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <BottomNav role="USER" currentScreen={AppScreen.HEALING_CIRCLE_HOME} navigate={navigate} language={language} />
    </div>
  );
};

export default HealingCircleHome;
