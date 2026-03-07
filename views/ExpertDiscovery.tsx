
import React, { useState, useMemo } from 'react';
import { AppScreen, Expert } from '../types';
import { BottomNav } from '../components/Navigation';

const MOCK_EXPERTS: Expert[] = [
  {
    id: '1',
    name: 'Dr. Sarah Jenkins',
    title: 'Clinical Psychologist',
    experience: '12 yrs exp',
    rating: 4.8,
    reviews: 124,
    image: 'https://picsum.photos/seed/jenk/200/200',
    expertise: ['Mental Health', 'Anxiety', 'Psychology']
  },
  {
    id: '2',
    name: 'Mark Thompson',
    title: 'Functional Dietitian',
    experience: '8 yrs exp',
    rating: 4.9,
    reviews: 89,
    image: 'https://picsum.photos/seed/mark/200/200',
    expertise: ['Gut Health', 'Metabolism', 'Nutrition']
  },
  {
    id: '3',
    name: 'Dr. Elena Rodriguez',
    title: 'Holistic Practitioner',
    experience: '15 yrs exp',
    rating: 5.0,
    reviews: 210,
    image: 'https://picsum.photos/seed/elena/200/200',
    expertise: ['Holistic Care', 'Medicine']
  }
];

interface Props {
  navigate: (screen: AppScreen, expert?: Expert, query?: string) => void;
  language: 'en' | 'ar';
}

const ExpertDiscovery: React.FC<Props> = ({ navigate, language }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const t = language === 'ar' ? {
    header: 'اكتشاف الخبراء',
    searchPlaceholder: 'ابحث عن خبير أو تخصص...',
    all: 'الكل',
    psychologists: 'علماء النفس',
    dietitians: 'أخصائيو تغذية',
    doctors: 'أطباء',
    noResults: 'لا توجد نتائج مطابقة',
    noResultsDesc: 'جرب كلمة بحث أخرى أو فئة مختلفة.',
    profile: 'الملف الشخصي',
    exp: 'خبرة'
  } : {
    header: 'Expert Discovery',
    searchPlaceholder: 'Search by name or specialty...',
    all: 'All Experts',
    psychologists: 'Psychologists',
    dietitians: 'Dietitians',
    doctors: 'Doctors',
    noResults: 'No matches found',
    noResultsDesc: 'Try a different keyword or category.',
    profile: 'Profile',
    exp: 'exp'
  };

  const categories = [
    { key: 'All', label: t.all },
    { key: 'Psychologists', label: t.psychologists },
    { key: 'Dietitians', label: t.dietitians },
    { key: 'Doctors', label: t.doctors }
  ];

  const filteredExperts = useMemo(() => {
    return MOCK_EXPERTS.filter(expert => {
      const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           expert.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || 
                             expert.title.toLowerCase().includes(activeCategory.toLowerCase().slice(0, -1));
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl pb-24 font-sans">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md px-6 pt-10 pb-4 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black font-display tracking-tight">{t.header}</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary leading-none no-mirror">Your Journey Within</p>
          </div>
          <button className="size-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            <span className="material-symbols-outlined text-2xl">tune</span>
          </button>
        </div>
        
        <div className="relative group mb-6">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-500"
            placeholder={t.searchPlaceholder}
          />
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {categories.map(cat => {
            const isDietCat = cat.key === 'Dietitians';
            return (
              <button 
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`shrink-0 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat.key 
                    ? (isDietCat ? 'bg-urkio-green text-white shadow-xl shadow-urkio-green/30 scale-105' : 'bg-primary text-white shadow-xl shadow-primary/20 scale-105') 
                    : 'bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 text-slate-500'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="p-6 space-y-6">
        {filteredExperts.map(expert => {
          const isDietitian = expert.title.toLowerCase().includes('dietitian') || expert.title.toLowerCase().includes('nutrition');
          const themeColor = isDietitian ? 'text-urkio-green' : 'text-primary';
          const themeBg = isDietitian ? 'bg-urkio-green/10' : 'bg-primary/10';
          const themeBorder = isDietitian ? 'border-urkio-green/40' : 'border-primary/20';

          return (
            <div 
              key={expert.id} 
              onClick={() => navigate(AppScreen.EXPERT_PUBLIC_PROFILE, expert)}
              className={`group relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl active:scale-[0.98] ${
                isDietitian ? 'border-urkio-green/30 ring-1 ring-urkio-green/5' : 'border-gray-100 dark:border-white/5'
              }`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${isDietitian ? 'bg-urkio-green/20' : 'bg-accent-cyan/10'} blur-[40px] translate-x-12 -translate-y-12`}></div>
              <div className="flex gap-6 relative z-10">
                <div className={`size-24 shrink-0 rounded-[2rem] overflow-hidden border-2 shadow-xl ${isDietitian ? 'border-urkio-green/50' : 'border-white dark:border-slate-800'}`}>
                  <img src={expert.image} className="size-full object-cover group-hover:scale-110 transition-transform duration-700" alt={expert.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`text-lg font-black tracking-tight font-display truncate group-hover:${themeColor} transition-colors`}>{expert.name}</h4>
                    <span className={`material-symbols-outlined ${isDietitian ? 'text-urkio-green' : 'text-accent-cyan'} text-[18px] fill-1`}>verified</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mb-3">{expert.title}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {expert.expertise.slice(0, 2).map(tag => (
                      <span key={tag} className={`px-2 py-0.5 ${themeBg} ${themeColor} text-[8px] font-black uppercase tracking-widest rounded-lg border ${themeBorder}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-yellow-500 text-sm fill-1">star</span>
                      <span className="text-xs font-black">{expert.rating}</span>
                      <span className="text-[10px] text-slate-400 font-medium ml-1">({expert.reviews})</span>
                    </div>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${themeColor} group-hover:translate-x-1 transition-transform`}>
                      {t.profile} {language === 'ar' ? '←' : '→'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      <BottomNav role="USER" currentScreen={AppScreen.EXPERT_DISCOVERY} navigate={navigate} language={language} />
    </div>
  );
};

export default ExpertDiscovery;
