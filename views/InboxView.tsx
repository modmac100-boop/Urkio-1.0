
import React, { useState } from 'react';
import { AppScreen, Expert } from '../types';
import { BottomNav } from '../components/Navigation';

interface ChatPreview {
  id: string;
  name: string;
  image: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  isExpert: boolean;
}

const InboxView: React.FC<{ navigate: (s: AppScreen, e?: Expert) => void, language: 'en' | 'ar' | 'fr' }> = ({ navigate, language }) => {
  const t = language === 'ar' ? {
    header: 'البريد الوارد',
    search: 'ابحث في المحادثات...',
    specialist: 'متخصص',
    member: 'عضو',
    voiceNote: 'رسالة صوتية'
  } : language === 'fr' ? {
    header: 'Boîte de réception',
    search: 'Rechercher des conversations...',
    specialist: 'Spécialiste',
    member: 'Membre',
    voiceNote: 'Note vocale'
  } : {
    header: 'Inbox',
    search: 'Search conversations...',
    specialist: 'Specialist',
    member: 'Member',
    voiceNote: 'Voice Note'
  };

  const MOCK_CHATS: ChatPreview[] = [
    { id: '1', name: 'Dr. Sarah Miller', image: 'https://picsum.photos/seed/dr1/100/100', lastMessage: language === 'ar' ? 'يبدو هذا تقرير تقدم رائع!' : 'That looks like a great progress report!', time: '10m', unreadCount: 2, isOnline: true, isExpert: true },
    { id: '2', name: 'Mark Thompson', image: 'https://picsum.photos/seed/mark/100/100', lastMessage: language === 'ar' ? 'تحقق من دليل التغذية الجديد.' : 'Check the new nutrition guide.', time: '2h', unreadCount: 0, isOnline: false, isExpert: true },
    { id: '3', name: 'Emma Watson', image: 'https://picsum.photos/seed/u2/100/100', lastMessage: language === 'ar' ? 'هل جربت تمرين التنفس؟' : 'Did you try the breathing exercise?', time: 'Yesterday', unreadCount: 0, isOnline: true, isExpert: false },
    { id: '4', name: 'Sophia Loren', image: 'https://picsum.photos/seed/u11/100/100', lastMessage: `${t.voiceNote} (0:45)`, time: '2d', unreadCount: 0, isOnline: false, isExpert: false },
  ];

  const [search, setSearch] = useState('');
  const filteredChats = MOCK_CHATS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl pb-32 font-sans overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md px-6 pt-12 pb-6 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black font-display tracking-tight">{t.header}</h2>
          <button className="size-11 flex items-center justify-center rounded-2xl bg-primary/5 text-primary">
            <span className="material-symbols-outlined">edit_square</span>
          </button>
        </div>

        <div className="relative">
          <span className={`material-symbols-outlined absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`}>search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} h-14 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-500 shadow-inner`}
            placeholder={t.search}
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
        {filteredChats.map(chat => (
          <button
            key={chat.id}
            onClick={() => {
              const mockExpert: Expert = {
                id: chat.id,
                name: chat.name,
                title: chat.isExpert ? t.specialist : t.member,
                experience: 'Verified',
                rating: 5,
                reviews: 1,
                image: chat.image,
                expertise: []
              };
              navigate(AppScreen.PRIVATE_CHAT, mockExpert);
            }}
            className="w-full flex items-center gap-4 p-4 hover:bg-white dark:hover:bg-slate-900 rounded-[1.8rem] transition-all group active:scale-[0.98]"
          >
            <div className="relative">
              <div className={`size-14 rounded-2xl p-0.5 ${chat.isExpert ? 'urkio-gradient' : 'bg-slate-200'}`}>
                <img src={chat.image} className="size-full object-cover rounded-[14px] border-2 border-white dark:border-background-dark" alt={chat.name} />
              </div>
              {chat.isOnline && (
                <div className={`absolute -bottom-1 ${language === 'ar' ? '-left-1' : '-right-1'} size-4 bg-emerald-500 border-2 border-slate-50 dark:border-background-dark rounded-full`}></div>
              )}
            </div>

            <div className="flex-1 text-start min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <h4 className="text-sm font-black truncate text-slate-900 dark:text-white">{chat.name}</h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{chat.time}</span>
              </div>
              <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'font-black text-slate-900 dark:text-white' : 'font-medium text-slate-500'}`}>
                {chat.lastMessage}
              </p>
            </div>

            {chat.unreadCount > 0 && (
              <div className="size-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-primary/30">
                {chat.unreadCount}
              </div>
            )}
          </button>
        ))}
      </main>

      <BottomNav role="USER" currentScreen={AppScreen.INBOX} navigate={navigate} language={language} />
    </div>
  );
};

export default InboxView;
