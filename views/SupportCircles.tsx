
import React, { useState } from 'react';
import { AppScreen, Expert, Circle, Resource } from '../types';
import { BottomNav } from '../components/Navigation';

const NUTRITION_HUB_CIRCLE: Circle = {
  id: 'c3',
  name: 'Functional Nutrition Hub',
  category: 'Nutrition',
  members: 2100,
  image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400',
  expertModerator: 'Mark Thompson',
  expertAvatar: 'https://picsum.photos/seed/mark/100/100',
  activeNow: 28,
  tags: ['Recipes', 'GutHealth'],
  isJoined: false,
  description: 'Explore the power of functional nutrition and gut health with our resident experts.'
};

interface Props {
  navigate: (screen: AppScreen, expert?: Expert, query?: string, resource?: Resource, circle?: Circle) => void;
  language: 'en' | 'ar' | 'fr';
}

const SupportCircles: React.FC<Props> = ({ navigate, language }) => {
  const t = language === 'ar' ? {
    header: 'دوائر الدعم',
    subheader: 'جد قبيلتك',
    search: 'ابحث في أكثر من 50 مجموعة متخصصة...',
    liveDiscussion: 'مناقشة مباشرة',
    peopleListening: 'شخص يستمعون',
    joinLive: 'انضم الآن',
    exploreAll: 'استكشف الكل',
    specializedCircles: 'دوائر متخصصة',
    expertModerated: 'بإشراف خبير',
    activeNow: 'نشط الآن',
    members: 'عضو',
    requestJoin: 'طلب انضمام',
    discoverByCategory: 'اكتشف حسب الفئة'
  } : language === 'fr' ? {
    header: 'Cercles de soutien',
    subheader: 'Trouvez votre tribu',
    search: 'Recherchez parmi plus de 50 groupes...',
    liveDiscussion: 'Discussion en direct',
    peopleListening: 'personnes à l\'écoute',
    joinLive: 'Rejoindre le direct',
    exploreAll: 'Tout explorer',
    specializedCircles: 'Cercles spécialisés',
    expertModerated: 'Modéré par des experts',
    activeNow: 'Actif maintenant',
    members: 'Membres',
    requestJoin: 'Demander à rejoindre',
    discoverByCategory: 'Découvrir par catégorie'
  } : {
    header: 'Support Circles',
    subheader: 'Find Your Tribe',
    search: 'Search 50+ specialized groups...',
    liveDiscussion: 'Live Discussion',
    peopleListening: 'people listening',
    joinLive: 'Join Live',
    exploreAll: 'Explore All',
    specializedCircles: 'Specialized Circles',
    expertModerated: 'Expert Moderated',
    activeNow: 'Active Now',
    members: 'Members',
    requestJoin: 'Request Join',
    discoverByCategory: 'Discover by Category'
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl pb-48 transition-colors duration-500">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/95 backdrop-blur-3xl px-8 pt-12 pb-8 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col">
            <h2 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">{t.header}</h2>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mt-2">{t.subheader}</p>
          </div>
          <button className="size-14 rounded-3xl crystal-glass text-primary flex items-center justify-center border border-primary/20 shadow-lg active:scale-95 hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl font-black">add</span>
          </button>
        </div>

        <div className="relative group" onClick={() => navigate(AppScreen.SEARCH_RESULTS)}>
          <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors">search</span>
          <div className="w-full pl-16 pr-6 h-16 crystal-glass rounded-3xl flex items-center text-slate-400 dark:text-slate-500 text-sm font-medium border border-white/20">
            {t.search}
          </div>
        </div>
      </header>

      <main className="p-8 space-y-14">
        {/* Featured Live Nutrition Circle - Deep Glass Surface */}
        <section>
          <div
            onClick={() => navigate(AppScreen.CIRCLE_DISCUSSION, undefined, undefined, undefined, NUTRITION_HUB_CIRCLE)}
            className="diet-gradient rounded-6xl p-10 text-white shadow-3xl shadow-urkio-green/30 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all border border-white/20"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 translate-x-6 -translate-y-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
              <span className="material-symbols-outlined text-[160px]">restaurant</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="px-5 py-2 bg-white/20 backdrop-blur-xl rounded-full text-[10px] font-black uppercase text-white tracking-[0.2em] border border-white/30 flex items-center gap-3">
                  <span className="size-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
                  {t.liveDiscussion}
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-100 opacity-60">Nutrition Core</span>
              </div>
              <h3 className="text-3xl font-black leading-tight mb-4 font-display">
                {language === 'ar' ? 'صحـة الأمعاء والمـزاج العـام' : 'Gut Health & Daily Mood Stability'}
              </h3>

              <div className="mt-12 flex items-center gap-6">
                <button className="h-14 px-10 bg-white text-urkio-green rounded-[1.8rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                  {t.joinLive}
                </button>
                <div className="text-[11px] font-black text-white/70 uppercase tracking-widest">{t.activeNow}: 84</div>
              </div>
            </div>
          </div>
        </section>

        {/* List of Groups - Floating Glass Surfaces */}
        <section className="space-y-10">
          <h3 className="text-xs font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500 px-1">{t.specializedCircles}</h3>

          <div className="space-y-6">
            <div
              onClick={() => navigate(AppScreen.CIRCLE_DISCUSSION, undefined, undefined, undefined, NUTRITION_HUB_CIRCLE)}
              className="crystal-glass p-8 rounded-6xl border border-white/20 shadow-2xl flex items-center gap-8 group cursor-pointer active:scale-[0.99] transition-all relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-urkio-green"></div>
              <div className="size-20 rounded-4xl overflow-hidden shadow-2xl border-4 border-white/30 dark:border-white/10 shrink-0 group-hover:scale-110 transition-transform duration-500">
                <img src={NUTRITION_HUB_CIRCLE.image} className="size-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-black mb-2 text-slate-900 dark:text-white group-hover:text-urkio-green transition-colors leading-tight">{NUTRITION_HUB_CIRCLE.name}</h4>
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-black uppercase bg-urkio-green/10 text-urkio-green px-3 py-1 rounded-lg border border-urkio-green/20">{t.expertModerated}</span>
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{NUTRITION_HUB_CIRCLE.members.toLocaleString()} {t.members}</span>
                </div>
              </div>
              <div className="size-12 rounded-full crystal-glass flex items-center justify-center text-slate-400 group-hover:text-urkio-green transition-all group-hover:translate-x-2">
                <span className="material-symbols-outlined">chevron_right</span>
              </div>
            </div>

            <div className="crystal-glass p-8 rounded-6xl border border-white/20 shadow-2xl flex items-center gap-8 group cursor-pointer active:scale-[0.99] transition-all relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-primary"></div>
              <div className="size-20 rounded-4xl overflow-hidden shadow-2xl border-4 border-white/30 dark:border-white/10 shrink-0 group-hover:scale-110 transition-transform duration-500">
                <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400" className="size-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-black mb-2 text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight">Mindful Parenting</h4>
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-3 py-1 rounded-lg border border-primary/20">Active Support</span>
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">1.4k {t.members}</span>
                </div>
              </div>
              <div className="size-12 rounded-full crystal-glass flex items-center justify-center text-slate-400 group-hover:text-primary transition-all group-hover:translate-x-2">
                <span className="material-symbols-outlined">chevron_right</span>
              </div>
            </div>
          </div>
        </section>

        {/* Suggestion Section - Glass Surface */}
        <section className="bg-[#050b1a] rounded-6xl p-10 text-white relative overflow-hidden shadow-3xl border border-white/10 group">
          <div className="absolute inset-0 urkio-gradient opacity-10 blur-3xl group-hover:opacity-20 transition-opacity"></div>
          <div className="relative z-10 text-center space-y-6">
            <div className="size-20 rounded-4xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-accent-cyan shadow-inner">
              <span className="material-symbols-outlined text-4xl fill-1 animate-float">explore</span>
            </div>
            <div>
              <h4 className="text-2xl font-black mb-2 font-display">{t.discoverByCategory}</h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed px-6">Explore the full directory of specialized support environments.</p>
            </div>
            <button className="w-full h-16 bg-white text-slate-950 rounded-4xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all">
              Browse Full Atlas
            </button>
          </div>
        </section>
      </main>

      <BottomNav role="USER" currentScreen={AppScreen.SUPPORT_CIRCLES} navigate={navigate} />
    </div>
  );
};

export default SupportCircles;
