
import React, { useState } from 'react';
import { AppScreen, Expert } from '../types';
import { BottomNav } from '../components/Navigation';

interface UrkioNotification {
  id: string;
  type: 'EXPERT_NOTE' | 'MESSAGE' | 'SYSTEM' | 'ACHIEVEMENT';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  expertAvatar?: string;
  actionLabel?: string;
}

const MOCK_NOTIFS: UrkioNotification[] = [
  {
    id: 'n1',
    type: 'EXPERT_NOTE',
    title: 'Note from Dr. Aris',
    description: "I've updated your Morning Sun protocol based on your Wed reflection.",
    time: '2m ago',
    isRead: false,
    expertAvatar: 'https://picsum.photos/seed/expert/100/100',
    actionLabel: 'View Action Plan'
  },
  {
    id: 'n2',
    type: 'MESSAGE',
    title: 'New Message',
    description: 'Mark Thompson sent you a dietary guide file.',
    time: '14m ago',
    isRead: false,
    expertAvatar: 'https://picsum.photos/seed/mark/100/100',
    actionLabel: 'Open Inbox'
  },
  {
    id: 'n3',
    type: 'ACHIEVEMENT',
    title: 'Elite Status Check',
    description: "You're only 2 reflections away from a Hall of Fame nomination!",
    time: '2h ago',
    isRead: true,
    actionLabel: 'Check Progress'
  },
  {
    id: 'n4',
    type: 'SYSTEM',
    title: 'Security Sync',
    description: 'A new device signed into your Secure Port. Was this you?',
    time: 'Yesterday',
    isRead: true,
    actionLabel: 'Verify Session'
  }
];

const NotificationsView: React.FC<{ navigate: (s: AppScreen, e?: Expert) => void, language: 'en' | 'ar' }> = ({ navigate, language }) => {
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);

  const t = language === 'ar' ? {
    header: 'التنبيهات',
    sub: 'نبض رحلتك',
    markAll: 'تحديد الكل كمقروء',
    empty: 'لا توجد تنبيهات جديدة'
  } : {
    header: 'Notifications',
    sub: 'Your Journey Pulse',
    markAll: 'Mark all as read',
    empty: 'No new notifications'
  };

  const markRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleAction = (notif: UrkioNotification) => {
    markRead(notif.id);
    if (notif.type === 'EXPERT_NOTE') navigate(AppScreen.ACTION_PLAN_TRACKER);
    else if (notif.type === 'MESSAGE') navigate(AppScreen.INBOX);
    else if (notif.type === 'ACHIEVEMENT') navigate(AppScreen.USER_PROFILE);
    else if (notif.type === 'SYSTEM') navigate(AppScreen.SECURITY_PRIVACY);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl pb-32 font-sans overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md px-6 pt-12 pb-6 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => navigate(AppScreen.USER_DASHBOARD)}
               className="size-11 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 active:scale-95 transition-all"
             >
               <span className="material-symbols-outlined text-slate-500">arrow_back_ios_new</span>
             </button>
             <div>
                <h2 className="text-xl font-black font-display tracking-tight">{t.header}</h2>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{t.sub}</p>
             </div>
          </div>
          <button 
            onClick={() => setNotifs(notifs.map(n => ({...n, isRead: true})))}
            className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline"
          >
            {t.markAll}
          </button>
        </div>
      </header>

      <main className="p-4 space-y-3">
        {notifs.map((n) => (
          <div 
            key={n.id}
            onClick={() => handleAction(n)}
            className={`relative p-5 rounded-[2rem] border transition-all cursor-pointer group active:scale-[0.98] ${
              n.isRead ? 'bg-white/40 dark:bg-white/5 border-transparent opacity-80' : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-primary/20 shadow-lg'
            }`}
          >
             {!n.isRead && (
                <div className="absolute top-5 right-5 size-2 bg-primary rounded-full shadow-[0_0_10px_rgba(19,91,236,0.5)]"></div>
             )}

             <div className="flex gap-4">
                <div className={`size-12 rounded-[1.2rem] shrink-0 flex items-center justify-center border transition-all ${
                  n.type === 'EXPERT_NOTE' ? 'bg-primary/10 text-primary border-primary/20' :
                  n.type === 'MESSAGE' ? 'bg-urkio-magenta/10 text-urkio-magenta border-urkio-magenta/20' :
                  n.type === 'ACHIEVEMENT' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                  'bg-slate-500/10 text-slate-500 border-slate-500/20'
                }`}>
                   {n.expertAvatar ? (
                      <img src={n.expertAvatar} className="size-full rounded-[inherit] object-cover" />
                   ) : (
                      <span className="material-symbols-outlined">
                        {n.type === 'EXPERT_NOTE' ? 'clinical_notes' :
                         n.type === 'MESSAGE' ? 'chat' :
                         n.type === 'ACHIEVEMENT' ? 'workspace_premium' : 'lock'}
                      </span>
                   )}
                </div>

                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white truncate pr-4">{n.title}</h4>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{n.time}</span>
                   </div>
                   <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">
                      {n.description}
                   </p>
                   {n.actionLabel && (
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-primary tracking-widest">
                         {n.actionLabel}
                         <span className="material-symbols-outlined text-[12px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                      </div>
                   )}
                </div>
             </div>
          </div>
        ))}

        {notifs.length === 0 && (
          <div className="py-24 text-center opacity-30">
             <span className="material-symbols-outlined text-6xl mb-4">notifications_off</span>
             <p className="text-sm font-black uppercase tracking-widest">{t.empty}</p>
          </div>
        )}
      </main>

      <BottomNav role="USER" currentScreen={AppScreen.NOTIFICATIONS} navigate={navigate} language={language} />
    </div>
  );
};

export default NotificationsView;
