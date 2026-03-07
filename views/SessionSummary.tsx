
import React, { useState, useEffect } from 'react';
import { AppScreen, Expert } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
  expert: Expert | null;
}

const SessionSummary: React.FC<Props> = ({ navigate, expert }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSummary(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      navigate(AppScreen.USER_DASHBOARD);
    }, 2000);
  };

  const expertInfo = expert || {
    name: "Mark Thompson",
    title: "Functional Dietitian",
    image: "https://picsum.photos/seed/mark/200/200"
  };

  const isDietitian = expertInfo.title.toLowerCase().includes('dietitian') || expertInfo.title.toLowerCase().includes('nutrition');
  const themeColor = isDietitian ? 'text-urkio-green' : 'text-primary';
  const themeBg = isDietitian ? 'bg-urkio-green/10' : 'bg-primary/10';
  const themeBorder = isDietitian ? 'border-urkio-green/20' : 'border-primary/20';
  const themeGradient = isDietitian ? 'diet-gradient' : 'urkio-gradient';
  const themeShadow = isDietitian ? 'shadow-urkio-green/30' : 'shadow-primary/30';
  const themeIcon = isDietitian ? 'restaurant' : 'psychology';

  const takeaways = isDietitian ? [
    "Increase fermented food intake by 2 servings daily for microbiome health.",
    "Limit processed sugar to stabilize afternoon mood peaks.",
    "Consistency with the morning hydration protocol is vital."
  ] : [
    "Prioritize 10 minutes of morning sunlight to reset circadian rhythms.",
    "Practice the 4-7-8 breathing technique during peak afternoon stress.",
    "Keep a consistent sleep schedule even on weekends."
  ];

  const actions = [
    { text: isDietitian ? "Log Nutritional Intake" : "Update Sleep Diary", done: false },
    { text: isDietitian ? "Review Meal Plan" : "Download Meditation Guide", done: true },
    { text: "Schedule Follow-up (2 weeks)", done: false }
  ];

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background-dark animate-in fade-in duration-500">
        <div className="text-center px-10">
          <div className="size-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
            <span className="material-symbols-outlined text-emerald-500 text-5xl fill-1 animate-bounce">volunteer_activism</span>
          </div>
          <h3 className="text-3xl font-black mb-3 font-display text-white">Gratitude Shared</h3>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Your feedback helps us maintain the highest quality of care. Continuing your journey now...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
      {/* Background Decor */}
      <div className={`absolute top-0 left-0 w-full h-96 ${themeGradient} opacity-10 blur-[100px] -translate-y-1/2`}></div>
      
      <main className={`flex-1 overflow-y-auto px-6 pt-16 pb-32 space-y-10 transition-all duration-1000 ${showSummary ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <header className="text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 ${themeBg} border ${themeBorder} rounded-full text-[9px] font-black uppercase tracking-widest ${themeColor} mb-4`}>
             <span className="material-symbols-outlined text-[14px]">done_all</span>
             Session Complete
          </div>
          <h1 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-tight">
            Nurture Your <br/><span className={`${themeColor} italic`}>Journey Within</span>
          </h1>
        </header>

        {/* Expert Card */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-white/5 shadow-xl flex items-center gap-5">
           <div className={`size-16 rounded-2xl overflow-hidden border-2 ${themeBorder} shadow-lg shrink-0`}>
              <img src={expertInfo.image} className="size-full object-cover" alt={expertInfo.name} />
           </div>
           <div className="flex-1 min-w-0">
              <h3 className="text-base font-black truncate">{expertInfo.name}</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{expertInfo.title}</p>
              <div className="mt-2 flex items-center gap-1.5">
                 <span className={`material-symbols-outlined ${themeColor} text-[14px] fill-1`}>verified</span>
                 <span className={`text-[9px] font-black ${themeColor} uppercase`}>Urkio Specialist</span>
              </div>
           </div>
        </section>

        {/* Takeaways Section */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 mb-2 ml-1">
              <span className={`material-symbols-outlined ${themeColor} text-sm fill-1`}>stars</span>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Key Takeaways</h4>
           </div>
           <div className="space-y-3">
              {takeaways.map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-100 dark:border-white/5 flex gap-4 animate-in slide-in-from-right duration-500" style={{animationDelay: `${i * 100}ms`}}>
                   <span className={`${themeColor} font-black opacity-40`}>0{i+1}</span>
                   <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">{item}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Action Items */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 mb-2 ml-1">
              <span className="material-symbols-outlined text-urkio-magenta text-sm">checklist</span>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Next Actions</h4>
           </div>
           <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden">
              {actions.map((action, i) => (
                <div key={i} className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-white/5 last:border-0">
                   <div className="flex items-center gap-3">
                      <div className={`size-6 rounded-lg flex items-center justify-center border transition-all ${action.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 dark:border-slate-700'}`}>
                         {action.done && <span className="material-symbols-outlined text-[14px] font-black">check</span>}
                      </div>
                      <span className={`text-xs font-bold ${action.done ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{action.text}</span>
                   </div>
                   {!action.done && <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>}
                </div>
              ))}
           </div>
        </section>

        {/* Rating Section */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-2xl space-y-6">
           <div className="text-center">
              <h4 className="text-sm font-black mb-1">Rate your experience</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Help us improve the circle</p>
           </div>
           
           <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  className={`size-12 rounded-2xl flex items-center justify-center transition-all ${rating >= star ? `${themeGradient} text-white shadow-lg ${themeShadow} scale-110` : 'bg-slate-50 dark:bg-background-dark text-slate-300'}`}
                >
                  <span className={`material-symbols-outlined text-2xl ${rating >= star ? 'fill-1' : ''}`}>star</span>
                </button>
              ))}
           </div>

           <textarea 
             value={comment}
             onChange={(e) => setComment(e.target.value)}
             className={`w-full h-24 bg-slate-50 dark:bg-background-dark border-none rounded-2xl p-4 text-xs font-medium focus:ring-2 focus:ring-${isDietitian ? 'urkio-green' : 'primary'}/40 placeholder:text-slate-400`}
             placeholder="Optional: How did the session help you today?"
           />
        </section>
      </main>

      {/* Footer Actions */}
      <footer className={`p-6 bg-white/80 dark:bg-background-dark/80 backdrop-blur-3xl border-t border-gray-100 dark:border-white/5 transition-all duration-1000 delay-500 ${showSummary ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
         <div className="flex gap-4">
            <button 
              onClick={() => navigate(AppScreen.USER_DASHBOARD)}
              className="flex-1 h-16 bg-slate-100 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-all active:scale-95"
            >
               Skip Feedback
            </button>
            <button 
              disabled={rating === 0}
              onClick={handleSubmit}
              className={`flex-[2] h-16 ${themeGradient} rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-2xl ${themeShadow} flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale`}
            >
               Share Gratitude
               <span className="material-symbols-outlined text-[16px]">favorite</span>
            </button>
         </div>
         <div className="mt-8 flex justify-center opacity-30">
            <svg className="size-8" viewBox="0 0 100 120" fill="none">
               <path d="M24 15V80C24 95 36 105 50 105C64 105 76 95 76 80V15" stroke="url(#footGrad)" strokeWidth="30" strokeLinecap="round" />
               <defs><linearGradient id="footGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#135bec" /></linearGradient></defs>
            </svg>
         </div>
         <p className="text-center text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mt-4">Secure • Private • Compassionate</p>
      </footer>
    </div>
  );
};

export default SessionSummary;
