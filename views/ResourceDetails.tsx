
import React, { useState } from 'react';
import { AppScreen, Resource, Expert } from '../types';

interface Props {
  navigate: (screen: AppScreen, expert?: Expert, query?: string, resource?: Resource) => void;
  resource: Resource | null;
}

const ResourceDetails: React.FC<Props> = ({ navigate, resource }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState('');

  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background-dark text-center px-8">
        <span className="material-symbols-outlined text-6xl text-slate-700 mb-4">error</span>
        <h2 className="text-xl font-black mb-2">Resource Not Found</h2>
        <button onClick={() => navigate(AppScreen.RESOURCE_LIBRARY)} className="text-primary font-black uppercase tracking-widest text-xs mt-4">Back to Library</button>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return 'menu_book';
      case 'video': return 'play_circle';
      case 'podcast': return 'mic';
      default: return 'description';
    }
  };

  const handleSendComment = () => {
    if (!comment.trim()) return;
    // Simulated comment submission
    setComment('');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
      {/* Immersive Media Header (The Video Element) */}
      <header className="relative h-[440px] w-full shrink-0 group">
        {resource.type === 'video' ? (
          <div className="size-full bg-slate-900">
            <video 
              src="https://assets.mixkit.co/videos/preview/mixkit-woman-practicing-yoga-in-the-mountains-43031-large.mp4" 
              className="size-full object-cover opacity-60"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        ) : (
          <img 
            src={resource.image} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            alt={resource.title}
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-background-dark via-transparent to-black/30"></div>
        
        {/* Navigation Actions */}
        <div className="absolute top-8 left-6 right-6 flex items-center justify-between z-10">
          <button 
            onClick={() => navigate(AppScreen.RESOURCE_LIBRARY)}
            className="size-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-lg active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className={`size-12 rounded-2xl backdrop-blur-xl border flex items-center justify-center shadow-lg active:scale-90 transition-all ${isSaved ? 'bg-primary border-primary text-white' : 'bg-white/10 border-white/20 text-white'}`}
            >
              <span className={`material-symbols-outlined ${isSaved ? 'fill-1' : ''}`}>bookmark</span>
            </button>
            <button className="size-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-lg active:scale-90 transition-all">
              <span className="material-symbols-outlined">ios_share</span>
            </button>
          </div>
        </div>

        {/* Comment Input Field - Integrated into Video Element */}
        <div className="absolute bottom-24 left-6 right-6 z-30 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="crystal-glass rounded-2xl p-1.5 flex items-center gap-3 border-white/20 shadow-2xl backdrop-blur-3xl group/input focus-within:border-primary/50 transition-all">
              <input 
                 value={comment}
                 onChange={(e) => setComment(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                 placeholder="Write a comment on this session..."
                 className="flex-1 bg-transparent border-none text-xs text-white placeholder:text-white/40 focus:ring-0 px-4 font-medium"
              />
              <button 
                onClick={handleSendComment}
                className="size-10 rounded-xl urkio-gradient text-white flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-primary/20"
              >
                 <span className="material-symbols-outlined text-xl">send</span>
              </button>
           </div>
        </div>

        <div className="absolute bottom-8 left-6 right-6 flex items-center justify-between">
           <div className="px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">{getTypeIcon(resource.type)}</span>
              {resource.category}
           </div>
           <div className="px-3 py-1.5 bg-black/30 backdrop-blur-md rounded-xl text-[9px] font-black text-white/80 border border-white/10 uppercase tracking-widest">
              {resource.duration}
           </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto px-6 py-10 space-y-10 no-scrollbar pb-32">
        {/* Title & Stats */}
        <section className="space-y-4">
          <h1 className="text-3xl font-black font-display tracking-tight leading-tight text-slate-900 dark:text-white">
            {resource.title}
          </h1>
          <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
             <button 
               onClick={() => navigate(AppScreen.USER_PROFILE)}
               className="flex items-center gap-1.5 hover:text-primary transition-all active:scale-95"
             >
               <span className="material-symbols-outlined text-[16px]">visibility</span>
               <span className="underline decoration-current/30 underline-offset-4">{resource.reads || '2.4k'} Reads</span>
             </button>
             <span className="flex items-center gap-1.5">
               <span className="material-symbols-outlined text-[16px]">event</span>
               Oct 24, 2024
             </span>
          </div>
        </section>

        {/* Expert Mini Profile */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl flex items-center gap-5 group cursor-pointer hover:shadow-2xl transition-all">
           <div className="size-16 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-lg shrink-0 transition-transform group-hover:scale-105">
              <img src={resource.expertAvatar} className="size-full object-cover" alt={resource.expertName} />
           </div>
           <div className="flex-1 min-w-0">
              <h3 className="text-base font-black truncate">{resource.expertName}</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verified Expert Specialist</p>
              <div className="mt-2 flex items-center gap-1.5">
                 <span className="material-symbols-outlined text-primary text-[14px] fill-1">verified</span>
                 <span className="text-[9px] font-black text-primary uppercase">Specialist Insight</span>
              </div>
           </div>
           <button className="size-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary transition-all">
              <span className="material-symbols-outlined">chevron_right</span>
           </button>
        </section>

        <section className="space-y-6">
           <p className="text-sm leading-[1.8] font-medium text-slate-600 dark:text-slate-300 first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-primary leading-relaxed">
             {resource.content || "Maintaining a balanced lifestyle starts with understanding the intricate signals your body sends daily. From the quality of your sleep to the fuel you provide your body, every choice is a step in your unique journey within. Exploring these biological rhythms allows for a more profound connection to the self and the community surrounding us."}
           </p>
        </section>

        {/* Tags */}
        <section className="flex flex-wrap gap-2 pt-4">
           {resource.tags.map(tag => (
             <span key={tag} className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-xl text-[10px] font-black uppercase text-slate-400 tracking-widest border border-transparent hover:border-primary/20 transition-all">
                #{tag}
             </span>
           ))}
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-white/90 dark:bg-background-dark/95 backdrop-blur-3xl border-t border-gray-100 dark:border-white/5 z-50 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center gap-2 group transition-all active:scale-95"
            >
               <span className={`material-symbols-outlined text-2xl ${isLiked ? 'text-urkio-magenta fill-1' : 'text-slate-400 group-hover:text-primary'}`}>volunteer_activism</span>
               <span className="text-[10px] font-black text-slate-500 uppercase underline underline-offset-4 decoration-slate-300">1.2k</span>
            </button>
            <button className="flex items-center gap-2 group transition-all active:scale-95">
               <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-primary">chat_bubble</span>
               <span className="text-[10px] font-black text-slate-500 uppercase underline underline-offset-4 decoration-slate-300">124</span>
            </button>
         </div>
         
         <div className="flex gap-2">
            <button 
               onClick={() => setIsSaved(!isSaved)}
               className={`h-14 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${isSaved ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-100 dark:bg-white/5 text-slate-500 border border-transparent'}`}
            >
               <span className={`material-symbols-outlined text-xl ${isSaved ? 'fill-1' : ''}`}>bookmark</span>
               {isSaved ? 'Saved' : 'Save'}
            </button>
         </div>
      </footer>
    </div>
  );
};

export default ResourceDetails;
