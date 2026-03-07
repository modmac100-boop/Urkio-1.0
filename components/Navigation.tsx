
import React from 'react';
import { AppScreen } from '../types';

interface NavProps {
  currentScreen: AppScreen;
  navigate: (screen: AppScreen) => void;
  role: 'USER' | 'EXPERT' | 'MANAGEMENT';
  language?: 'en' | 'ar';
}

export const BottomNav: React.FC<NavProps> = ({ currentScreen, navigate, role, language = 'en' }) => {
  const t = language === 'ar' ? {
    home: 'الرئيسية',
    feed: 'المنشورات',
    guide: 'المرشد',
    inbox: 'الرسائل',
    circles: 'الدوائر',
    profile: 'الملف الشخصي',
    dashboard: 'اللوحة',
    schedule: 'المواعيد',
    clients: 'العملاء',
    record: 'سجل'
  } : {
    home: 'Home',
    feed: 'Feed',
    guide: 'Guide',
    inbox: 'Inbox',
    circles: 'Circles',
    profile: 'Profile',
    dashboard: 'Dashboard',
    schedule: 'Schedule',
    clients: 'Clients',
    record: 'Record'
  };

  const RecordButton = () => (
    <div className="relative -top-5 px-1 group">
      <div className="absolute inset-0 bg-urkio-magenta/15 blur-[15px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
      <button 
        onClick={() => navigate(AppScreen.VIDEO_RECORDER)}
        className="size-14 rounded-full urkio-gradient text-white flex items-center justify-center border-[3px] border-white/20 backdrop-blur-3xl shadow-[0_8px_25px_rgba(217,70,239,0.3)] crystal-btn active:scale-90 transition-all hover:-translate-y-1 z-10 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none"></div>
        <span className="material-symbols-outlined text-lg fill-1">videocam</span>
      </button>
    </div>
  );

  const NavItem = ({ screen, icon, label, isActive }: { screen: AppScreen, icon: string, label: string, isActive: boolean }) => (
    <button 
      onClick={() => navigate(screen)} 
      className={`flex flex-col items-center gap-1 transition-all flex-1 py-3 group ${isActive ? 'text-primary' : 'text-slate-400'}`}
    >
      <div className={`relative flex items-center justify-center transition-all duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        {isActive && (
          <div className="absolute inset-x-[-4px] inset-y-[-4px] bg-primary/10 blur-xl rounded-full"></div>
        )}
        <span className={`material-symbols-outlined text-[20px] ${isActive ? 'fill-1 icon-crystal' : 'opacity-30 group-hover:opacity-100 group-hover:icon-crystal'}`}>
          {icon}
        </span>
      </div>
      <span className={`text-[7px] font-black uppercase tracking-[0.1em] transition-all duration-500 ${isActive ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-1 group-hover:opacity-30'}`}>
        {label}
      </span>
    </button>
  );

  const navClasses = "fixed bottom-0 left-0 right-0 bg-white/5 dark:bg-black/5 backdrop-blur-[50px] border-t border-white/5 px-2 flex justify-around items-center z-50 max-w-md mx-auto h-18 rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.1)]";

  if (role === 'USER') {
    return (
      <nav className={navClasses}>
        <NavItem screen={AppScreen.USER_DASHBOARD} icon="home" label={t.home} isActive={currentScreen === AppScreen.USER_DASHBOARD} />
        <NavItem screen={AppScreen.COMMUNITY_FEED} icon="forum" label={t.feed} isActive={currentScreen === AppScreen.COMMUNITY_FEED} />
        <NavItem screen={AppScreen.AI_GUIDE} icon="smart_toy" label={t.guide} isActive={currentScreen === AppScreen.AI_GUIDE} />

        <RecordButton />

        <NavItem screen={AppScreen.INBOX} icon="inbox" label={t.inbox} isActive={currentScreen === AppScreen.INBOX} />
        <NavItem screen={AppScreen.COMMUNITY_CIRCLES} icon="group_work" label={t.circles} isActive={currentScreen === AppScreen.COMMUNITY_CIRCLES} />
        <NavItem screen={AppScreen.USER_PROFILE} icon="person" label={t.profile} isActive={currentScreen === AppScreen.USER_PROFILE} />
      </nav>
    );
  }

  return (
    <nav className={navClasses}>
      <NavItem screen={AppScreen.EXPERT_DASHBOARD} icon="grid_view" label={t.dashboard} isActive={currentScreen === AppScreen.EXPERT_DASHBOARD} />
      <NavItem screen={AppScreen.EXPERT_SCHEDULE} icon="event_repeat" label={t.schedule} isActive={currentScreen === AppScreen.EXPERT_SCHEDULE} />

      <RecordButton />

      <button className="flex flex-col items-center gap-1 flex-1 text-slate-500 opacity-20 cursor-not-allowed">
        <span className="material-symbols-outlined text-[20px]">group</span>
        <span className="text-[7px] font-black uppercase tracking-widest">{t.clients}</span>
      </button>
      <NavItem screen={AppScreen.EXPERT_PUBLIC_PROFILE} icon="settings_account_box" label={t.profile} isActive={currentScreen === AppScreen.EXPERT_PUBLIC_PROFILE} />
    </nav>
  );
};
