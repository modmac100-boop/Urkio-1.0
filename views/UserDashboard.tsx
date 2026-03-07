
import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';
import { db, auth } from '../services/firebase';
import { doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';
import { BottomNav } from '../components/Navigation';
import { LiveEventBanner } from '../components/LiveEventBanner';
import { Avatar } from '../components/Avatar';

interface Props {
  navigate: (screen: AppScreen) => void;
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const UrkioLogoSmall = () => (
  <svg className="size-6" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradSmall" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d946ef" />
        <stop offset="100%" stopColor="#135bec" />
      </linearGradient>
    </defs>
    {/* Shadow Track */}
    <path
      d="M24 15V80C24 95 36 105 50 105C64 105 76 95 76 80V15"
      stroke="url(#logoGradSmall)"
      strokeWidth="30"
      strokeLinecap="round"
    />
    <path
      d="M24 80C24 95 36 105 50 105"
      stroke="black"
      strokeOpacity="0.1"
      strokeWidth="30"
      strokeLinecap="round"
    />
    {/* Shining Movement Edge */}
    <path
      d="M24 15V80C24 95 36 105 50 105C64 105 76 95 76 80V15"
      stroke="white"
      strokeWidth="32"
      strokeLinecap="round"
      strokeOpacity="0.6"
      className="animate-logo-shine"
    />
  </svg>
);

const UserDashboard: React.FC<Props> = ({ navigate, language, setLanguage, isDarkMode, toggleDarkMode }) => {
  const [eatingGoal, setEatingGoal] = useState(3);
  const [userName, setUserName] = useState<string>('Alex');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Fallback to auth name
    if (user.displayName) setUserName(user.displayName.split(' ')[0]);

    const docRef = doc(db, 'profiles', user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.first_name) setUserName(data.first_name);
        if (data.eatingGoal !== undefined) setEatingGoal(data.eatingGoal);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEatingGoalUpdate = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const nextGoal = eatingGoal < 5 ? eatingGoal + 1 : 0;

    // optimistic update
    setEatingGoal(nextGoal);

    try {
      const docRef = doc(db, 'profiles', user.uid);
      await updateDoc(docRef, { eatingGoal: nextGoal });
    } catch (err: any) {
      // if profiles document doesn't exist, create it
      if (err.code === 'not-found') {
        await setDoc(doc(db, 'profiles', user.uid), { eatingGoal: nextGoal }, { merge: true });
      } else {
        console.error("Error updating eating goal:", err);
        // Revert optimistic update on failure
        setEatingGoal(eatingGoal);
      }
    }
  };

  const t = language === 'ar' ? {
    welcome: `أهلاً يا ${userName}،`,
    legendDesc: 'يتم الاحتفال برحلتك الأسطورية.',
    hallOfFame: 'قاعة المشاهير',
    hallOfFameStatus: 'حالة الأسطورة مفعلة',
    milestone: 'تم تحقيق إنجاز كبير',
    milestoneDesc: 'لقد وصلت إلى اليوم الثلاثين!',
    actionPlan: 'خطة العمل النشطة',
    actionPlanDesc: 'لديك 4 مهام من د. آريس اليوم',
    homiiTitle: 'هومي',
    homiiDesc: 'سجل تأملاً ذاتياً جديداً.',
    interactiveFeature: 'ميزة تفاعلية',
    mindfulEating: 'الأكل الواعي',
    target: 'الهدف: 5 أيام/أسبوع',
    pulseTitle: 'نبض المجتمع',
    stats: {
      live: 'نشط الآن',
      progress: 'حالات جارية',
      achieved: 'أهداف محققة',
      members: 'إجمالي الأعضاء'
    }
  } : {
    welcome: `Hi ${userName},`,
    legendDesc: 'Your legend journey is being celebrated.',
    hallOfFame: 'Hall of Fame',
    hallOfFameStatus: 'Elite Legend Status Active',
    milestone: 'Major Milestone Reached',
    milestoneDesc: "You've reached day 30!",
    actionPlan: 'Active Action Plan',
    actionPlanDesc: 'You have 4 tasks from Dr. Aris today',
    homiiTitle: 'Homii',
    homiiDesc: 'Record a new self-reflection.',
    interactiveFeature: 'Interactive Feature',
    mindfulEating: 'Mindful Eating',
    target: 'Target: 5 days/week',
    pulseTitle: 'Community Pulse',
    stats: {
      live: 'Live Now',
      progress: 'In Progress',
      achieved: 'Achieved',
      members: 'Members'
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl pb-48 font-sans overflow-x-hidden transition-colors duration-500">
      <LiveEventBanner
        navigate={navigate}
        eventName={language === 'ar' ? 'علم النوم العميق' : "Deep Sleep Science"}
        hostName={language === 'ar' ? 'د. سارة ميلر' : "Dr. Sarah Miller"}
      />

      <header className="flex items-center p-8 justify-between sticky top-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-3xl z-40 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-4">
          <div className="size-14 crystal-glass rounded-[20px] flex items-center justify-center border border-white/20 shadow-xl group cursor-pointer hover:scale-110 transition-transform">
            <UrkioLogoSmall />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-urkio-blue font-display no-mirror leading-none mb-1">Urkio</h1>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 no-mirror">Your Journey Within</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Mood Toggle */}
          <button
            onClick={toggleDarkMode}
            className="size-10 rounded-2xl crystal-glass flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary transition-all active:scale-90 crystal-btn group"
          >
            <span className="material-symbols-outlined text-[20px]">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>

          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="px-3 py-2 rounded-2xl crystal-glass text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-primary transition-all active:scale-90 crystal-btn"
          >
            {language === 'en' ? 'AR' : 'EN'}
          </button>
          <button onClick={() => navigate(AppScreen.USER_PROFILE)} className="active:scale-90 transition-all hover:scale-110">
            <Avatar src={auth.currentUser?.photoURL || "https://picsum.photos/seed/u4/100/100"} size="sm" isHallOfFame={true} />
          </button>
        </div>
      </header>

      <main className="p-8 space-y-12">
        <section>
          <h2 className="text-4xl font-black tracking-tighter font-display mb-2 text-slate-900 dark:text-white">{t.welcome}</h2>
          <button onClick={() => navigate(AppScreen.HALL_OF_FAME)} className="text-slate-500 dark:text-slate-400 text-sm font-black uppercase tracking-widest opacity-80 flex items-center gap-2 hover:text-primary transition-colors">
            <span className="text-primary underline decoration-primary/30">4 Day Streak</span>
            <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
            <span>Elite Status</span>
          </button>
        </section>

        {/* Pulse Bar - Glass Surface */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 opacity-60">{t.pulseTitle}</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 p-8 rounded-6xl crystal-glass shadow-2xl border border-white/20">
            <button onClick={() => navigate(AppScreen.UPCOMING_EVENTS)} className="group flex flex-col items-start text-left p-4 rounded-3xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="size-1.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-[7px] font-black uppercase tracking-widest text-slate-500 group-hover:text-red-500">{t.stats.live}</span>
              </div>
              <h4 className="text-xl font-black font-display tracking-tight text-slate-900 dark:text-white">1,242</h4>
            </button>

            <button onClick={() => navigate(AppScreen.TRENDING_TOPICS)} className="group flex flex-col items-start text-left p-4 rounded-3xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="size-1.5 rounded-full bg-urkio-blue"></span>
                <span className="text-[7px] font-black uppercase tracking-widest text-slate-500 group-hover:text-urkio-blue">{t.stats.progress}</span>
              </div>
              <h4 className="text-xl font-black font-display tracking-tight text-urkio-blue">850+</h4>
            </button>

            <button onClick={() => navigate(AppScreen.HALL_OF_FAME)} className="group flex flex-col items-start text-left p-4 rounded-3xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="size-1.5 rounded-full bg-urkio-green"></span>
                <span className="text-[7px] font-black uppercase tracking-widest text-slate-500 group-hover:text-urkio-green">{t.stats.achieved}</span>
              </div>
              <h4 className="text-xl font-black font-display tracking-tight text-urkio-green">14,800</h4>
            </button>

            <button onClick={() => navigate(AppScreen.DISCOVER_CONNECTIONS)} className="group flex flex-col items-start text-left p-4 rounded-3xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="size-1.5 rounded-full bg-urkio-magenta"></span>
                <span className="text-[7px] font-black uppercase tracking-widest text-slate-500 group-hover:text-urkio-magenta">{t.stats.members}</span>
              </div>
              <h4 className="text-xl font-black font-display tracking-tight text-urkio-magenta">52,104</h4>
            </button>
          </div>
        </section>

        {/* Action Plan - Glass Surface */}
        <section>
          <div
            onClick={() => navigate(AppScreen.ACTION_PLAN_TRACKER)}
            className="relative overflow-hidden crystal-glass rounded-6xl p-10 cursor-pointer active:scale-[0.98] transition-all group shadow-2xl hover:border-primary/40"
          >
            <div className={`absolute top-0 ${language === 'ar' ? 'left-0' : 'right-0'} p-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000`}>
              <span className="material-symbols-outlined text-[120px] fill-1 text-primary">checklist</span>
            </div>
            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl crystal-glass flex items-center justify-center text-primary shadow-lg">
                    <span className="material-symbols-outlined font-black">bolt</span>
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">{t.actionPlan}</span>
                </div>
                <span className="text-2xl font-black font-display text-primary">50%</span>
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">{t.actionPlanDesc}</h4>
              </div>
              <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-4 overflow-hidden shadow-inner border border-white/5 p-1">
                <div className="urkio-gradient h-full rounded-full w-1/2 shadow-[0_0_20px_rgba(19,91,236,0.5)] transition-all duration-1000"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Homii Feature - Interactive Dark Surface */}
        <section>
          <button
            onClick={() => navigate(AppScreen.HOMII)}
            className="w-full group relative overflow-hidden p-10 rounded-6xl bg-[#050b1a] border border-white/10 shadow-3xl text-start active:scale-[0.98] transition-all crystal-btn"
          >
            <div className="absolute top-0 right-0 w-80 h-80 urkio-gradient opacity-10 blur-3xl -translate-y-24 translate-x-24"></div>
            <div className="relative z-10 flex items-center gap-10">
              <div className="size-20 shrink-0 rounded-4xl urkio-gradient flex items-center justify-center text-white shadow-2xl shadow-urkio-magenta/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <span className="material-symbols-outlined text-4xl fill-1">mic</span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-urkio-magenta mb-3">{t.interactiveFeature}</p>
                <h3 className="text-2xl font-black text-white font-display no-mirror leading-none">Homii</h3>
                <p className="text-slate-400 text-sm mt-3 opacity-70 leading-relaxed">{t.homiiDesc}</p>
              </div>
              <div className="size-14 rounded-full crystal-glass flex items-center justify-center opacity-40 group-hover:opacity-100 group-hover:translate-x-3 transition-all">
                <span className={`material-symbols-outlined text-white ${language === 'ar' ? 'rotate-180' : ''}`}>chevron_right</span>
              </div>
            </div>
          </button>
        </section>

        {/* Mindful Eating - Glass Surface */}
        <section className="space-y-6">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 opacity-60">{t.mindfulEating}</h3>
          </div>

          <div
            onClick={handleEatingGoalUpdate}
            className="p-10 rounded-6xl crystal-glass border border-white/20 shadow-2xl active:scale-99 transition-all group cursor-pointer"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-8">
                <div className="size-20 rounded-4xl crystal-glass flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/30">
                  <span className="material-symbols-outlined text-4xl text-primary fill-1">restaurant</span>
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{t.mindfulEating}</h4>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">{t.target}</p>
                </div>
              </div>
              <div className="text-end">
                <p className="text-3xl font-black text-primary leading-none font-display">{eatingGoal}/5</p>
              </div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-5 overflow-hidden shadow-inner border border-white/5 p-1">
              <div
                className="urkio-gradient h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_25px_rgba(19,91,236,0.4)]"
                style={{ width: `${(eatingGoal / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </section>
      </main>

      <BottomNav role="USER" currentScreen={AppScreen.USER_DASHBOARD} navigate={navigate} language={language} />
    </div>
  );
};

export default UserDashboard;
