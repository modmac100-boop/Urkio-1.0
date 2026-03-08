
import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';

interface ActivityAction {
  id: string;
  type: 'DELETE' | 'COMPLETE' | 'UPDATE' | 'SYNC' | 'POST';
  title: string;
  description: string;
  timeAgo: string;
  icon: string;
  status: 'PENDING' | 'RESTORING' | 'RESTORED';
}

const INITIAL_ACTIVITIES: ActivityAction[] = [
  { id: 'act1', type: 'DELETE', title: 'Reflection Deleted', description: 'Vocal entry "Morning Calm" removed from Homii vault.', timeAgo: '2m ago', icon: 'mic_off', status: 'PENDING' },
  { id: 'act2', type: 'COMPLETE', title: 'Goal Fulfilled', description: '15m Morning Sun marked as finished in Action Plan.', timeAgo: '12m ago', icon: 'task_alt', status: 'PENDING' },
  { id: 'act3', type: 'UPDATE', title: 'Profile Updated', description: 'Bio section changed to reflect current recovery goals.', timeAgo: '24m ago', icon: 'person_edit', status: 'PENDING' },
  { id: 'act4', type: 'SYNC', title: 'Clinical Report Shared', description: 'Weekly Journey Pulse transmitted to Dr. Aris.', timeAgo: '29m ago', icon: 'send_and_archive', status: 'PENDING' },
  { id: 'act5', type: 'POST', title: 'Discussion Published', description: 'New post "Sharing my progress" shared in Child Anxiety Circle.', timeAgo: '2h ago', icon: 'forum', status: 'PENDING' },
  { id: 'act6', type: 'UPDATE', title: 'Privacy Changed', description: 'Switched "Incognito Mode" to active for daily pulse.', timeAgo: '4h ago', icon: 'visibility_off', status: 'PENDING' },
  { id: 'act7', type: 'COMPLETE', title: 'Audio Workshop', description: 'Completed "Deep Sleep Science" live session.', timeAgo: '6h ago', icon: 'podcasts', status: 'PENDING' },
];

const ActivityRestore: React.FC<{ navigate: (s: AppScreen) => void, language: 'en' | 'ar' | 'fr' }> = ({ navigate, language }) => {
  const [activities, setActivities] = useState<ActivityAction[]>(INITIAL_ACTIVITIES);
  const [isBatchRestoring, setIsBatchRestoring] = useState(false);

  const t = language === 'ar' ? {
    header: 'مركز الاستعادة',
    subHeader: 'إرجاع الزمن',
    desc: 'لديك نافذة لاستعادة جميع الإجراءات التي تم اتخاذها اليوم في رحلتك.',
    restore: 'استعادة',
    restoreAll: 'استعادة الكل اليوم',
    restoring: 'جاري الاستعادة...',
    restored: 'تم بنجاح',
    timeWindow: 'سجل نشاط اليوم',
    protocol: 'بروتوكول الأمان الحيوي نشط'
  } : language === 'fr' ? {
    header: 'Centre de Restauration',
    subHeader: 'Inverser le Temps',
    desc: 'Vous avez une fenêtre pour restaurer toutes les actions effectuées aujourd\'hui dans votre parcours.',
    restore: 'Restaurer',
    restoreAll: 'Tout restaurer',
    restoring: 'Restauration...',
    restored: 'Restauré',
    timeWindow: 'Journal d\'activité du jour',
    protocol: 'Protocole Bio-Sync Actif'
  } : {
    header: 'Restore Hub',
    subHeader: 'Reversing Time',
    desc: 'You have a window to restore all actions taken today within your journey.',
    restore: 'Restore',
    restoreAll: 'Restore All Today',
    restoring: 'Restoring...',
    restored: 'Restored',
    timeWindow: 'Today\'s Activity Log',
    protocol: 'Bio-Sync Protocol Active'
  };

  const handleRestore = (id: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, status: 'RESTORING' } : a));

    setTimeout(() => {
      setActivities(prev => prev.map(a => a.id === id ? { ...a, status: 'RESTORED' } : a));
      setTimeout(() => {
        setActivities(prev => prev.filter(a => a.id !== id));
      }, 2000);
    }, 1200);
  };

  const handleRestoreAll = async () => {
    if (activities.length === 0) return;
    setIsBatchRestoring(true);

    // Process them sequentially for a nice visual effect
    const ids = activities.filter(a => a.status === 'PENDING').map(a => a.id);

    for (const id of ids) {
      setActivities(prev => prev.map(a => a.id === id ? { ...a, status: 'RESTORING' } : a));
      await new Promise(resolve => setTimeout(resolve, 600)); // Short delay per item
      setActivities(prev => prev.map(a => a.id === id ? { ...a, status: 'RESTORED' } : a));
    }

    setTimeout(() => {
      setActivities([]);
      setIsBatchRestoring(false);
    }, 2000);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#050b1a] text-white max-w-md mx-auto shadow-2xl font-sans overflow-x-hidden">
      {/* HUD Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-20%] w-[100%] h-[50%] bg-primary/15 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-[80%] h-[40%] bg-urkio-magenta/10 blur-[120px] rounded-full opacity-30"></div>
      </div>

      <header className="relative z-10 px-8 pt-16 pb-8 flex items-center justify-between border-b border-white/5 bg-background-dark/40 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate(AppScreen.USER_DASHBOARD)}
            className="size-12 rounded-2xl crystal-glass flex items-center justify-center text-slate-400 active:scale-90 transition-all crystal-btn"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div>
            <h1 className="text-2xl font-black font-display tracking-tight leading-none mb-1">{t.header}</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{t.subHeader}</p>
          </div>
        </div>
        <div className="size-14 rounded-[1.5rem] urkio-gradient p-0.5 shadow-2xl animate-float text-primary">
          <div className="size-full rounded-[1.3rem] bg-slate-900 flex items-center justify-center">
            <svg className="size-8" viewBox="0 0 100 120" fill="none">
              <path d="M24 15V80C24 95 36 105 50 105C64 105 76 95 76 80V15" stroke="currentColor" strokeWidth="30" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-y-auto no-scrollbar p-8 space-y-10 pb-40">
        <section className="space-y-6">
          <div className="p-7 bg-primary/5 border border-primary/20 rounded-[3rem] flex flex-col gap-6 animate-in fade-in duration-700 shadow-2xl">
            <div className="flex gap-5">
              <div className="size-16 rounded-[1.8rem] crystal-glass flex items-center justify-center text-primary shrink-0 shadow-lg relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse"></div>
                <span className="material-symbols-outlined text-4xl fill-1 relative z-10">restore_page</span>
              </div>
              <div>
                <h4 className="text-base font-black uppercase tracking-widest text-primary mb-1">{t.timeWindow}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{t.desc}</p>
              </div>
            </div>

            <button
              onClick={handleRestoreAll}
              disabled={isBatchRestoring || activities.length === 0}
              className="w-full h-16 urkio-gradient rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3 crystal-btn disabled:opacity-30"
            >
              {isBatchRestoring ? (
                <>
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t.restoring}
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">all_inclusive</span>
                  {t.restoreAll}
                </>
              )}
            </button>
          </div>
        </section>

        {/* Activity Timeline */}
        <section className="space-y-8 relative">
          <div className="absolute left-[31px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-primary/60 via-white/5 to-transparent"></div>

          <div className="space-y-6">
            {activities.length > 0 ? activities.map((act, i) => (
              <div
                key={act.id}
                className={`relative pl-16 group animate-in slide-in-from-left-4 duration-500`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Timeline Node */}
                <div className={`absolute left-0 top-0 size-16 rounded-[1.8rem] crystal-glass border-2 flex items-center justify-center z-10 transition-all duration-500 group-hover:scale-110 ${act.status === 'RESTORED' ? 'border-emerald-500 bg-emerald-500/10' :
                    act.status === 'RESTORING' ? 'border-primary bg-primary/10 animate-pulse' :
                      'border-white/10 group-hover:border-primary/40'
                  }`}>
                  <span className={`material-symbols-outlined text-2xl ${act.status === 'RESTORED' ? 'text-emerald-500' :
                      act.status === 'RESTORING' ? 'text-primary' : 'text-slate-500 icon-crystal'
                    }`}>
                    {act.status === 'RESTORED' ? 'check' : act.icon}
                  </span>
                </div>

                <div className={`p-7 rounded-[2.5rem] border transition-all duration-700 ${act.status === 'RESTORED' ? 'bg-emerald-500/5 border-emerald-500/20' :
                    act.status === 'RESTORING' ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/40' :
                      'bg-white/5 border-white/5 shadow-xl hover:bg-white/10'
                  }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="min-w-0 flex-1 pr-4">
                      <h4 className={`text-base font-black tracking-tight truncate ${act.status === 'RESTORED' ? 'text-emerald-500' : 'text-white'}`}>{act.title}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{act.timeAgo}</p>
                    </div>
                    {act.status === 'PENDING' && !isBatchRestoring && (
                      <button
                        onClick={() => handleRestore(act.id)}
                        className="h-10 px-5 rounded-xl crystal-glass border border-primary/20 text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all active:scale-90 crystal-btn shadow-lg shadow-primary/10 shrink-0"
                      >
                        {t.restore}
                      </button>
                    )}
                    {act.status === 'RESTORING' && (
                      <div className="size-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin shrink-0"></div>
                    )}
                    {act.status === 'RESTORED' && (
                      <span className="material-symbols-outlined text-emerald-500 fill-1 shrink-0">verified</span>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed font-medium ${act.status === 'RESTORED' ? 'text-emerald-400/60' : 'text-slate-400'}`}>
                    {act.description}
                  </p>
                </div>
              </div>
            )) : (
              <div className="py-24 text-center opacity-40">
                <div className="size-20 rounded-full crystal-glass mx-auto mb-6 flex items-center justify-center border-dashed">
                  <span className="material-symbols-outlined text-5xl">history</span>
                </div>
                <p className="text-sm font-black uppercase tracking-widest">No more restorable actions</p>
              </div>
            )}
          </div>
        </section>

        {/* Security / Health ID Banner */}
        <section className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] p-8 flex gap-6 animate-in slide-in-from-bottom-8 duration-1000">
          <div className="size-16 rounded-2xl crystal-glass flex items-center justify-center text-emerald-500 shrink-0 shadow-inner">
            <span className="material-symbols-outlined text-4xl fill-1">shield_person</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            Actions restored via the <span className="text-emerald-500 font-bold">Bio-Sync Protocol</span> are immediately re-validated across all clinical nodes and circle contribution boards.
          </p>
        </section>
      </main>

      {/* Transparent Bottom Space / Space Down */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-8 bg-transparent backdrop-blur-[60px] border-t border-white/5 z-50 rounded-t-[4rem] flex flex-col items-center">
        <div className="w-12 h-1.5 bg-white/20 rounded-full mb-6"></div>
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em]">{t.protocol}</p>
      </footer>
    </div>
  );
};

export default ActivityRestore;
