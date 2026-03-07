
import React, { useState } from 'react';
import { AppScreen } from '../types';
import { BottomNav } from '../components/Navigation';

interface Appointment {
  id: string;
  clientName: string;
  clientImage: string;
  time: string;
  type: 'Video Consultation' | 'In-person' | 'Audio Check-in';
  status: 'confirmed' | 'pending' | 'completed';
}

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'a1', clientName: 'Liam Payne', clientImage: 'https://picsum.photos/seed/u10/100/100', time: '10:30 AM', type: 'Video Consultation', status: 'confirmed' },
  { id: 'a2', clientName: 'Sophia Loren', clientImage: 'https://picsum.photos/seed/u11/100/100', time: '01:00 PM', type: 'Audio Check-in', status: 'confirmed' },
  { id: 'a3', clientName: 'Alex Johnson', clientImage: 'https://picsum.photos/seed/u4/100/100', time: '03:30 PM', type: 'Video Consultation', status: 'pending' },
];

const ExpertSchedule: React.FC<{navigate: (s: AppScreen) => void}> = ({ navigate }) => {
  const [selectedDate, setSelectedDate] = useState(0);
  const [acceptingNew, setAcceptingNew] = useState(true);

  const days = [
    { day: 'Mon', date: '21', hasDots: true },
    { day: 'Tue', date: '22', hasDots: true },
    { day: 'Wed', date: '23', hasDots: false },
    { day: 'Thu', date: '24', hasDots: true },
    { day: 'Fri', date: '25', hasDots: false },
    { day: 'Sat', date: '26', hasDots: false },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark max-w-md mx-auto shadow-2xl pb-32 text-white font-sans overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(AppScreen.EXPERT_DASHBOARD)} className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10">
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </button>
          <h2 className="text-xl font-black font-display tracking-tight">Professional Schedule</h2>
        </div>
        <button className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10">
          <span className="material-symbols-outlined text-[20px]">calendar_add_on</span>
        </button>
      </header>

      <main className="p-6 space-y-10">
        {/* Date Selection Strip */}
        <section>
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">October 2024</h3>
            <button className="text-primary text-[10px] font-black uppercase tracking-widest">Full Calendar</button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {days.map((d, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDate(idx)}
                className={`flex flex-col items-center justify-center min-w-[64px] h-24 rounded-[2rem] transition-all border-2 relative ${
                  selectedDate === idx
                    ? 'urkio-gradient border-transparent text-white shadow-xl shadow-primary/20 scale-105'
                    : 'border-white/5 bg-white/5 text-slate-400'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{d.day}</span>
                <span className="text-xl font-black mt-1">{d.date}</span>
                {d.hasDots && (
                  <div className={`absolute bottom-3 flex gap-0.5 ${selectedDate === idx ? 'text-white' : 'text-primary'}`}>
                    <div className="size-1 rounded-full bg-current"></div>
                    <div className="size-1 rounded-full bg-current opacity-40"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Availability Toggle */}
        <section className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`size-12 rounded-2xl flex items-center justify-center ${acceptingNew ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
              <span className="material-symbols-outlined text-2xl">{acceptingNew ? 'event_available' : 'event_busy'}</span>
            </div>
            <div>
              <p className="text-sm font-black tracking-tight">Public Availability</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {acceptingNew ? 'Accepting new bookings' : 'Calendar paused'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setAcceptingNew(!acceptingNew)}
            className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${acceptingNew ? 'bg-primary justify-end' : 'bg-slate-700 justify-start'}`}
          >
            <div className="size-4 bg-white rounded-full shadow-lg"></div>
          </button>
        </section>

        {/* Daily Appointments */}
        <section>
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Today's Sessions</h3>
            <span className="text-[10px] font-black text-slate-400 bg-white/5 px-3 py-1 rounded-full">3 Total</span>
          </div>

          <div className="space-y-4">
            {MOCK_APPOINTMENTS.map((app) => (
              <div 
                key={app.id} 
                className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all group"
              >
                <div className="flex flex-col items-center justify-center min-w-[60px] pr-4 border-r border-white/5">
                   <p className="text-sm font-black leading-none mb-1">{app.time.split(' ')[0]}</p>
                   <p className="text-[9px] font-black uppercase text-slate-500">{app.time.split(' ')[1]}</p>
                </div>

                <div className="size-14 rounded-2xl overflow-hidden border-2 border-white/5 shrink-0">
                  <img src={app.clientImage} className="size-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-black truncate mb-1">{app.clientName}</h4>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-primary">videocam</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{app.type}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    app.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    app.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                    'bg-slate-500/10 text-slate-400 border-white/10'
                  }`}>
                    {app.status}
                  </span>
                  <button 
                    onClick={() => app.type.includes('Video') && navigate(AppScreen.CONSULTATION_ROOM)}
                    className="size-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary transition-all active:scale-90"
                  >
                    <span className="material-symbols-outlined text-[18px]">videocam</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sync Settings */}
        <section className="bg-primary/10 border border-primary/20 rounded-[2rem] p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-6xl">sync</span>
          </div>
          <div className="relative z-10">
            <h4 className="text-sm font-black mb-1">Calendar Sync Active</h4>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-[200px]">
              Your Urkio sessions are automatically synced with your Google Calendar.
            </p>
            <button className="mt-4 text-[10px] font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-0.5">
              Manage Sync Settings
            </button>
          </div>
        </section>
      </main>

      <BottomNav role="EXPERT" currentScreen={AppScreen.EXPERT_SCHEDULE} navigate={navigate} />
    </div>
  );
};

export default ExpertSchedule;
