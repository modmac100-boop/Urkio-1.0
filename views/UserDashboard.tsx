import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';
import { auth, db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { BottomNav } from '../components/Navigation';

interface Props {
  navigate: (screen: AppScreen) => void;
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const UserDashboard: React.FC<Props> = ({ navigate, language, setLanguage, isDarkMode, toggleDarkMode }) => {
  const [userName, setUserName] = useState<string>('Alex');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    if (user.displayName) setUserName(user.displayName.split(' ')[0]);

    const docRef = doc(db, 'profiles', user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.first_name) setUserName(data.first_name);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background font-display text-slate-800 pb-24 dark:bg-background-dark dark:text-slate-200 transition-colors duration-500 overflow-x-hidden max-w-xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-background-dark/70 backdrop-blur-xl border-b border-slate-100 dark:border-white/10">
        <div className="max-w-xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-new-primary/20">
              <span className="material-symbols-outlined text-white text-2xl">spa</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Urkio</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Your journey within</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleDarkMode}
              className="size-10 rounded-full bg-slate-50 dark:bg-surface-dark flex items-center justify-center text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-white/10 hover:text-new-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button 
              onClick={() => navigate(AppScreen.SEARCH_RESULTS)}
              className="size-10 rounded-full bg-slate-50 dark:bg-surface-dark flex items-center justify-center text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-white/10 hover:text-new-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
            <button 
              onClick={() => navigate(AppScreen.INBOX)}
              className="size-10 rounded-full bg-slate-50 dark:bg-surface-dark flex items-center justify-center text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-white/10 hover:text-new-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">chat_bubble</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto w-full px-4">
        {/* Stories / Status Bar */}
        <section className="py-6">
          <div className="flex overflow-x-auto no-scrollbar gap-5 pb-2">
            <button onClick={() => navigate(AppScreen.CREATE_POST)} className="flex flex-col items-center gap-2 shrink-0 group">
              <div className="relative">
                <div className="size-16 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 p-1 group-hover:border-new-primary transition-colors">
                  <div className="w-full h-full rounded-full bg-slate-100 dark:bg-surface-dark flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-new-primary transition-colors">add</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-500">My Status</span>
            </button>

            {/* Live Expert */}
            <button onClick={() => navigate(AppScreen.LIVE_AUDIO_ROOM)} className="flex flex-col items-center gap-2 shrink-0">
              <div className="relative">
                <div className="gradient-border">
                  <div className="size-[60px] rounded-full bg-cover bg-center border-2 border-white dark:border-background-dark" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBnCd6_9DnIfApAavXNMz_6kcBywzVJ4-OjnjaHJJ0hkyRYbsxwyrqEQD_Wifi9NduYZya4TEf5nHnNa8lt-ez4GqUEUKFJ9Yl276MUjyIlp4y5lFgQRgesnK7gr15TJ9884pC0dJpDR_eKD8YlwbcG3e8p7E2SYqTjsU4q0hE1mcSmYU42YrSbsRCO68aD4LbW7JgqzH_hljNWTkHPQ2PLsmNDdmZJHY10JqeghAXLx9ce3-e5JaYaUqL4aNh58JMAB0xthagyOf0')"}}></div>
                </div>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 text-[9px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-tighter border-2 border-white dark:border-background-dark shadow-sm">Live</span>
              </div>
              <span className="text-[11px] font-bold text-slate-900 dark:text-white">Dr. Sarah</span>
            </button>

            <button onClick={() => navigate(AppScreen.STORY_VIEWER)} className="flex flex-col items-center gap-2 shrink-0">
              <div className="relative">
                <div className="size-16 rounded-full border-2 border-slate-100 dark:border-white/10 p-1 shadow-sm">
                  <div className="w-full h-full rounded-full bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCWMITaZtuYbFmJkV2CLUX2Au3vGibMQPD1z_cONHS8dF06oyPjfnwAbkEFAA8RD1cKZGX7tmOWfogx0wGccNAWaczA_p8K876NNHgDIEwY7OdDmPJS3KEA1RPVv0u5zFKMWF5VjugBcfWG3RCAKmGTPWlP1lFmk5DbS-Uw1JMRX8GsIT4DO7GvTwlB2MBvcHqCqlsJy4CEH3GyyNm9BX6Mj3UMAWaA7_2sc6Pukcm5ngjBBiq5NM9KYtvxRcsBa_xykJ3UbrAGMQQ')"}}></div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-500">John M.</span>
            </button>

            <button onClick={() => navigate(AppScreen.LIVE_AUDIO_ROOM)} className="flex flex-col items-center gap-2 shrink-0">
              <div className="relative">
                <div className="gradient-border">
                  <div className="size-[60px] rounded-full bg-cover bg-center border-2 border-white dark:border-background-dark" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAEL42h1s5IQLx7Vx-IvQZ_ZGeciJnKRmpDlGTonihgeDIUlvkNdNVCbpUVMHyA7u-s9f_Xf0pjA-XXdXN5yebhIhYfpaigLXnbPzwTtu4n05ADGlV8tLN0gO_AdUaNsAt_7YoZhz0V2-Z_ESAi_jLMDeCsE3ovNYuX_rqrpG-dRxb36Xf-Pqfs-V-1rrBIVAs6bd_pmSeC6mdNADFrbxyH4TxNnZzrWeoSYK0px7o2rkG-ZC7xtprrZl3mmwtA9epvMxJZfTwEKnA')"}}></div>
                </div>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 text-[9px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-tighter border-2 border-white dark:border-background-dark shadow-sm">Live</span>
              </div>
              <span className="text-[11px] font-bold text-slate-900 dark:text-white">Yoga Flow</span>
            </button>

            <button onClick={() => navigate(AppScreen.STORY_VIEWER)} className="flex flex-col items-center gap-2 shrink-0">
              <div className="relative">
                <div className="size-16 rounded-full border-2 border-slate-100 dark:border-white/10 p-1 shadow-sm">
                  <div className="w-full h-full rounded-full bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDN9JrdxbmUcZ7VvcpmvY-kBO2DMKnUkzA0ciqgQgExmInZ7gjCweJ1YjotyevNIb8VREw65QludP2q6StD5Urb1zyFeqmD02vgGLEKh-TXDpzxpCjXJcCxclDyCW46xF5OIG3FX3BlaATbgZFhxegNSQQb3IDZKQTmoD4a0SXux8lg_A1Fy9109ru2jq96f9TtHYguRj7o94R92VH1TF9W8UpJVbh2QC6xGPCsZSmGUO6jZnUSMUnPlUqxoWjw42e1udCpkUq2euw')"}}></div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-500">Maria R.</span>
            </button>
          </div>
        </section>

        {/* Upcoming Section */}
        <section className="py-6">
          <div className="flex items-center justify-between mb-5 px-2">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Upcoming Sessions</h2>
            <button onClick={() => navigate(AppScreen.UPCOMING_EVENTS)} className="text-new-primary text-[11px] font-extrabold uppercase tracking-wider hover:underline">See All</button>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-6 pb-4">
            {/* Session Card 1 (Live Highlight) */}
            <div className="shrink-0 w-[300px] bg-white dark:bg-card-dark rounded-2xl p-4 shadow-premium border border-slate-50 dark:border-white/5 relative overflow-hidden group cursor-pointer" onClick={() => navigate(AppScreen.LIVE_AUDIO_ROOM)}>
              <div className="flex gap-4 items-start relative z-10">
                <div className="size-14 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-new-primary/20 shrink-0">
                  <span className="material-symbols-outlined text-white text-3xl">podcasts</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-red-50 dark:bg-red-500/10 text-red-500 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border border-red-100 dark:border-red-500/20 flex items-center gap-1">
                      <span className="size-1 rounded-full bg-red-500 animate-pulse"></span>
                      Live Session
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">Deep Sleep Science</h3>
                  <p className="text-[10px] text-slate-500 font-medium">HOSTED BY <span className="text-new-primary font-bold">DR. SARAH MILLER</span></p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between relative z-10">
                <div className="flex -space-x-2">
                  <div className="size-6 rounded-full border-2 border-white dark:border-card-dark bg-slate-200 bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCWMITaZtuYbFmJkV2CLUX2Au3vGibMQPD1z_cONHS8dF06oyPjfnwAbkEFAA8RD1cKZGX7tmOWfogx0wGccNAWaczA_p8K876NNHgDIEwY7OdDmPJS3KEA1RPVv0u5zFKMWF5VjugBcfWG3RCAKmGTPWlP1lFmk5DbS-Uw1JMRX8GsIT4DO7GvTwlB2MBvcHqCqlsJy4CEH3GyyNm9BX6Mj3UMAWaA7_2sc6Pukcm5ngjBBiq5NM9KYtvxRcsBa_xykJ3UbrAGMQQ')"}}></div>
                  <div className="size-6 rounded-full border-2 border-white dark:border-card-dark bg-slate-200 bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDN9JrdxbmUcZ7VvcpmvY-kBO2DMKnUkzA0ciqgQgExmInZ7gjCweJ1YjotyevNIb8VREw65QludP2q6StD5Urb1zyFeqmD02vgGLEKh-TXDpzxpCjXJcCxclDyCW46xF5OIG3FX3BlaATbgZFhxegNSQQb3IDZKQTmoD4a0SXux8lg_A1Fy9109ru2jq96f9TtHYguRj7o94R92VH1TF9W8UpJVbh2QC6xGPCsZSmGUO6jZnUSMUnPlUqxoWjw42e1udCpkUq2euw')"}}></div>
                  <div className="size-6 rounded-full border-2 border-white dark:border-card-dark bg-slate-100 dark:bg-surface-dark flex items-center justify-center text-[8px] font-bold text-slate-500">+1.2k</div>
                </div>
                <button className="gradient-bg text-white text-[11px] px-5 py-2 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-new-primary/20 hover:scale-105 transition-transform">
                  Join <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
              {/* Decorative element */}
              <div className="absolute -top-6 -right-6 size-24 bg-new-primary/5 rounded-full blur-2xl"></div>
            </div>

            {/* Session Card 2 */}
            <button onClick={() => navigate(AppScreen.SCHEDULE_AUDIO_ROOM)} className="shrink-0 w-[260px] bg-slate-50/50 dark:bg-surface-dark/50 rounded-2xl p-4 border border-slate-100 dark:border-white/5 text-left hover:border-slate-200 dark:hover:border-white/10 transition-colors">
              <div className="h-32 rounded-xl bg-cover bg-center mb-3 relative overflow-hidden" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCfViQH2zesR0Q7SOpA28sYsYhG4nrEQQvCj-OjP_nSSojy6vNjThcGy5U_UZuaxBLllFe5mkz3W6GROjcRzJOhBiIwQQcYzFohALiy90AGKPeNjoGKT7J8q2ou-UdfWgCLgGxCnAyZXbxjzZu_JTTYN39IothWI11MnnitW5OqX54vwNwEi4fbQJMKkgo06r3bhCPGkOkur-vsKEsZaGzY03srnQPMZdsmTKGuug4sfPc9XbqLvQvMfQuWKAQqYegkzomJRSSuRak')"}}>
                <div className="absolute top-2 right-2 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md text-slate-900 dark:text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase">45 Min</div>
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm mb-3">Overcoming Burnout</h3>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-new-primary uppercase tracking-tighter">Today</span>
                  <span className="text-[11px] font-bold text-slate-500">5:00 PM</span>
                </div>
                <span className="bg-white dark:bg-card-dark border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-[10px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest shadow-sm">Remind</span>
              </div>
            </button>
          </div>
        </section>

        {/* Activity Feed */}
        <section className="py-6 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Community Pulse</h2>
          </div>

          {/* Feed Card 1 */}
          <article className="bg-white dark:bg-card-dark rounded-2xl shadow-premium border border-slate-50 dark:border-white/5 overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-11 rounded-xl bg-slate-100 bg-cover bg-center border border-slate-100 dark:border-white/10 shadow-sm" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDaoIVzLOJhBHsMO-xngarklR1P_tLEDKDXT7vwB0ZP6eU6I9K7uc-kxOEnphb00PdWAJ4ov22ClwGC90xJ6483H3mZl4oOfVYQo7LVEu4_0fjIjWbK9wZZX2gIT3RCJnbj0gJ6-blglY9HoFmG6pMVftb2gma2l7hYSvoZ7n7uz6RTt-fLNH6rn-fMqxCeD9_6ZHU2Zac12LsquWOCcF1krAMz19Pne0J-uGzgtLXeJ-H9BLJCzbuP0UjgJqt7R6z_5LGY-3n_LJs')"}}></div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Anna Thompson</h4>
                  <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    Shared a reflection <span className="size-0.5 rounded-full bg-slate-300 dark:bg-slate-600"></span> 2h ago
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 mb-6 font-medium">
                Just finished my 7-day streak of mindful breathing. It's amazing how much clearer my thoughts are when I just take 10 minutes for myself. ✨
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-white/5">
                <div className="flex items-center gap-5">
                  <button className="flex items-center gap-1.5 text-slate-400 group">
                    <span className="material-symbols-outlined text-xl group-hover:text-red-500 transition-colors">favorite</span>
                    <span className="text-[11px] font-black">24</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-slate-400 group">
                    <span className="material-symbols-outlined text-xl group-hover:text-new-primary transition-colors">chat_bubble</span>
                    <span className="text-[11px] font-black">5</span>
                  </button>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <span className="material-symbols-outlined text-xl">share</span>
                </button>
              </div>
            </div>
          </article>

          {/* Stats Card */}
          <div className="bg-white dark:bg-card-dark rounded-[2rem] p-8 shadow-premium border border-slate-50 dark:border-white/5">
            <div className="grid grid-cols-2 gap-y-10">
              <div className="space-y-1 cursor-pointer" onClick={() => navigate(AppScreen.COMMUNITY_FEED)}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="size-2 rounded-full bg-red-500"></span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Live Now</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">1,242</div>
              </div>
              <div className="space-y-1 cursor-pointer" onClick={() => navigate(AppScreen.COMMUNITY_FEED)}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="size-2 rounded-full bg-blue-500"></span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">In Progress</span>
                </div>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">850+</div>
              </div>
              <div className="space-y-1 cursor-pointer" onClick={() => navigate(AppScreen.HALL_OF_FAME)}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="size-2 rounded-full bg-emerald-500"></span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Achieved</span>
                </div>
                <div className="text-2xl font-black text-emerald-500 tracking-tight">14,800</div>
              </div>
              <div className="space-y-1 cursor-pointer" onClick={() => navigate(AppScreen.CONNECTIONS)}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="size-2 rounded-full bg-purple-500"></span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Members</span>
                </div>
                <div className="text-2xl font-black text-purple-500 tracking-tight">52,104</div>
              </div>
            </div>
          </div>

          {/* Expert Insight Post */}
          <article className="bg-white dark:bg-card-dark rounded-2xl shadow-premium border border-slate-50 dark:border-white/5 overflow-hidden">
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(AppScreen.EXPERT_PUBLIC_PROFILE)}>
                <div className="size-11 rounded-xl bg-slate-100 bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDmPIBl3VOulE1UvZINVM9JKU2mxq3DO32cMIOPzsanGntY5oIlotMm0DHsg5VDArXMQgXWbacBUOw-fojPqJbFT34WjoWY9cErz2eIGQWTKo0AKUxK0uSL_mvg3iqAyepNJUrLjrRovsGbGeJ4q9WbjCjIbj21kpmlbnn04jLSElo_wr6G6U_Zvth5lTGLDl_-C30D7WKxiUtcQdn-slninM20-K-Hz8kXHuIknCbdXs8oPg3ZIjJnqpTRBGFd4c024J16zbIQh04')"}}></div>
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Dr. Elias Vance</h4>
                    <span className="material-symbols-outlined text-new-primary text-[14px] fill-1">verified</span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400">Expert Insight • 5h ago</p>
                </div>
              </div>
              <button className="size-8 rounded-full bg-slate-50 dark:bg-surface-dark flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
            <div className="h-56 mx-5 rounded-2xl bg-cover bg-center mb-5 cursor-pointer" onClick={() => navigate(AppScreen.COMMUNITY_FEED)} style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAErKJX5hqJCIEKRJQE78cyp_6s02Vluqsy7RJ9ITUuoagtVTUQphU6-7WESDmYbEAztS6xc49SvTzq_DMRAjm96tqy-Exg1YM1yDtdG_Jz10OBB9PPy-YBwvbRSIeYwrk6PBkwVxaLjWTIe-S1V8QioGA0A9PmYWndgsH1BRFtg0FbRz2snyfd4biMWgYo1OerikC9lyW0nkGx6wNfYTME2qSNGj0OdCE6arWfQzhpsWDOTKo2FpuBI4sETSSWqUaz24HrniEzS3M')"}}></div>
            <div className="px-5 pb-5">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-2 cursor-pointer hover:underline" onClick={() => navigate(AppScreen.COMMUNITY_FEED)}>The Science of Circadian Rhythm</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium line-clamp-2">Why viewing morning sunlight is the #1 tool for better sleep health. Read my latest breakdown...</p>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-slate-400 group">
                    <span className="material-symbols-outlined text-xl group-hover:text-red-500 transition-colors">favorite</span>
                    <span className="text-[11px] font-black">152</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-slate-400 group" onClick={() => navigate(AppScreen.COMMUNITY_FEED)}>
                    <span className="material-symbols-outlined text-xl group-hover:text-new-primary transition-colors">chat_bubble</span>
                    <span className="text-[11px] font-black">28</span>
                  </button>
                </div>
                <button className="text-new-primary">
                  <span className="material-symbols-outlined fill-1">bookmark</span>
                </button>
              </div>
            </div>
          </article>
        </section>
      </main>

      {/* Bottom Nav */}
      <BottomNav role="USER" currentScreen={AppScreen.USER_DASHBOARD} navigate={navigate} language={language} isDarkMode={isDarkMode} />
    </div>
  );
};

export default UserDashboard;
