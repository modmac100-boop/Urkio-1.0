
import React, { useState, useMemo } from 'react';
import { AppScreen, Resource, ResourceType, Expert } from '../types';
import { BottomNav } from '../components/Navigation';

const RESOURCES: Resource[] = [
  {
    id: 'r1',
    title: 'The Gut-Brain Connection: A Deep Dive',
    type: 'article',
    expertName: 'Mark Thompson',
    expertAvatar: 'https://picsum.photos/seed/mark/100/100',
    category: 'Nutrition',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
    duration: '8 min read',
    reads: '12.4k',
    tags: ['Microbiome', 'Mental Health'],
    content: "The gut-brain connection is a bidirectional communication network that links the enteric and central systems. This network is not just about hunger or satiety; it plays a critical role in mental health and cognitive function. Research shows that the composition of your microbiome can influence your brain's production of serotonin, a neurotransmitter that regulates mood, appetite, and sleep. In this article, we explore how fermented foods, prebiotic fibers, and stress management can foster a healthier gut and, in turn, a more resilient mind."
  },
  {
    id: 'r2',
    title: 'Mastering Mindful Breathing Techniques',
    type: 'video',
    expertName: 'Dr. Sarah Jenkins',
    expertAvatar: 'https://picsum.photos/seed/jenk/100/100',
    category: 'Mental Wellbeing',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
    duration: '15:20',
    tags: ['Meditation', 'Stress']
  },
  {
    id: 'r3',
    title: 'Sleep Science: Why You Wake Up Tired',
    type: 'podcast',
    expertName: 'Dr. Marcus Chen',
    expertAvatar: 'https://picsum.photos/seed/marcus/100/100',
    category: 'Sleep',
    image: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&q=80&w=600',
    duration: '42 min',
    tags: ['Circadian', 'Performance']
  },
  {
    id: 'r4',
    title: 'CBT Strategies for Social Anxiety',
    type: 'article',
    expertName: 'Dr. Elena Rodriguez',
    expertAvatar: 'https://picsum.photos/seed/elena/100/100',
    category: 'Psychology',
    image: 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee1?auto=format&fit=crop&q=80&w=600',
    duration: '12 min read',
    reads: '5.2k',
    tags: ['CBT', 'Anxiety'],
    content: "Cognitive Behavioral Therapy (CBT) is a gold standard for treating social anxiety. By identifying and challenging 'automatic negative thoughts,' seekers can begin to decouple their fear response from social situations. This article outlines key behavioral experiments you can perform to gradually expand your comfort zone."
  },
];

const TOPICS = ['All Topics', 'Mental Wellbeing', 'Nutrition', 'Sleep', 'Psychology', 'Physical Health'];

interface Props {
  navigate: (screen: AppScreen, expert?: Expert, query?: string, resource?: Resource) => void;
}

const ResourceLibrary: React.FC<Props> = ({ navigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | ResourceType>('All');
  const [activeTopic, setActiveTopic] = useState('All Topics');

  const filteredResources = useMemo(() => {
    return RESOURCES.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           r.expertName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'All' || r.type === activeTab;
      const matchesTopic = activeTopic === 'All Topics' || r.category === activeTopic;
      return matchesSearch && matchesTab && matchesTopic;
    });
  }, [searchQuery, activeTab, activeTopic]);

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'article': return 'menu_book';
      case 'video': return 'play_circle';
      case 'podcast': return 'mic';
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl pb-32 font-sans overflow-x-hidden">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md px-6 pt-10 pb-4 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black font-display tracking-tight">Resource Library</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary leading-none">Journey Wisdom</p>
          </div>
          <button onClick={() => navigate(AppScreen.USER_DASHBOARD)} className="size-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative group mb-6">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-500"
            placeholder="Search articles, videos, podcasts..."
          />
        </div>

        {/* Content Type Tabs */}
        <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-2xl mb-2">
           {['All', 'article', 'video', 'podcast'].map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                 activeTab === tab ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-500'
               }`}
             >
               {tab}s
             </button>
           ))}
        </div>
      </header>

      <main className="p-6 space-y-10">
        {/* Topics Filter */}
        <section>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Health Topics</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
            {TOPICS.map(topic => (
              <button 
                key={topic}
                onClick={() => setActiveTopic(topic)}
                className={`shrink-0 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                  activeTopic === topic 
                    ? (topic === 'Nutrition' ? 'bg-urkio-green border-urkio-green text-white shadow-xl shadow-urkio-green/20 scale-105' : 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105')
                    : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-white/5 text-slate-500'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </section>

        {/* Resources Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Verified Resources</h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredResources.map(resource => {
              const isNutrition = resource.category === 'Nutrition';
              const themeColor = isNutrition ? 'text-urkio-green' : 'text-primary';
              const themeBorder = isNutrition ? 'border-urkio-green/30' : 'border-gray-100 dark:border-white/5';
              const themeIconBg = isNutrition ? 'bg-urkio-green/10' : 'bg-primary/10';

              return (
                <div 
                  key={resource.id} 
                  onClick={() => navigate(AppScreen.RESOURCE_DETAILS, undefined, undefined, resource)}
                  className={`bg-white dark:bg-slate-900/50 rounded-[2rem] overflow-hidden border transition-all group active:scale-[0.99] cursor-pointer shadow-sm hover:shadow-xl ${themeBorder}`}
                >
                  <div className="relative h-44 overflow-hidden">
                     <img src={resource.image} className="w-full h-full object-cover group-hover:scale-105 duration-700 transition-transform" alt={resource.title} />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                     
                     <div className={`absolute top-4 right-4 backdrop-blur-md px-3 py-1 rounded-full border flex items-center gap-1.5 ${isNutrition ? 'bg-urkio-green/80 border-urkio-green/30' : 'bg-black/40 border-white/20'}`}>
                        <span className="material-symbols-outlined text-white text-[14px]">{getTypeIcon(resource.type)}</span>
                        <span className="text-white text-[9px] font-black uppercase tracking-widest">{resource.type}</span>
                     </div>
                  </div>

                  <div className="p-6">
                     <h4 className={`text-lg font-black leading-tight group-hover:${themeColor} transition-colors pr-4 mb-4`}>{resource.title}</h4>
                     
                     <div className="flex items-center gap-3 mb-6">
                        <img src={resource.expertAvatar} className={`size-8 rounded-xl object-cover ring-2 ${isNutrition ? 'ring-urkio-green/30' : 'ring-primary/10'}`} alt={resource.expertName} />
                        <div>
                           <p className="text-[11px] font-black text-slate-900 dark:text-white leading-none mb-1">{resource.expertName}</p>
                           <p className={`text-[8px] font-black uppercase tracking-widest ${themeColor}`}>Verified {isNutrition ? 'Dietitian' : 'Expert'}</p>
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5">
                        <div className="flex gap-2">
                           {resource.tags.map(tag => (
                             <span key={tag} className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${isNutrition ? 'bg-urkio-green/5 text-urkio-green/60' : 'bg-slate-50 dark:bg-white/5 text-slate-400'}`}>#{tag}</span>
                           ))}
                        </div>
                        <span className="flex items-center gap-1 text-slate-400">
                           <span className="material-symbols-outlined text-xs">visibility</span>
                           <span className="text-[9px] font-black uppercase">{resource.reads}</span>
                        </span>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <BottomNav role="USER" currentScreen={AppScreen.RESOURCE_LIBRARY} navigate={navigate} />
    </div>
  );
};

export default ResourceLibrary;
