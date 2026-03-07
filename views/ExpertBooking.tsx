
import React, { useState } from 'react';
import { AppScreen, Expert } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
  expert: Expert | null;
}

const ExpertBooking: React.FC<Props> = ({ navigate, expert }) => {
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);

  if (!expert) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-background-dark text-center px-8">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">error</span>
        <h2 className="text-xl font-bold mb-2">Expert not found</h2>
        <button onClick={() => navigate(AppScreen.EXPERT_DISCOVERY)} className="text-primary font-bold">Go back to Discovery</button>
      </div>
    );
  }

  const isDietitian = expert.title.toLowerCase().includes('dietitian') || expert.title.toLowerCase().includes('nutrition');
  const themePrimary = isDietitian ? 'text-urkio-green' : 'text-primary';
  const themeBgPrimary = isDietitian ? 'bg-urkio-green' : 'bg-primary';
  const themeBorderPrimary = isDietitian ? 'border-urkio-green' : 'border-primary';
  const themeGradient = isDietitian ? 'diet-gradient' : 'urkio-gradient';
  const themeShadow = isDietitian ? 'shadow-urkio-green/20' : 'shadow-primary/20';

  const days = [
    { day: 'Mon', date: '21' },
    { day: 'Tue', date: '22' },
    { day: 'Wed', date: '23' },
    { day: 'Thu', date: '24' },
    { day: 'Fri', date: '25' },
    { day: 'Sat', date: '26' },
  ];

  const timeSlots = [
    "09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"
  ];

  const handleBooking = () => {
    if (selectedTime) {
      setIsBooked(true);
      setTimeout(() => {
        navigate(AppScreen.USER_DASHBOARD);
      }, 2500);
    }
  };

  if (isBooked) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-background-dark animate-in fade-in duration-500">
        <div className="flex flex-col items-center text-center px-8">
          <div className="size-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 scale-up-center">
            <span className="material-symbols-outlined text-5xl text-emerald-500 fill-1">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Session Booked!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            You're scheduled for a consultation with <span className="font-bold text-slate-900 dark:text-white">{expert.name}</span> on Oct {days[selectedDate].date} at {selectedTime}.
          </p>
          <p className="text-xs text-slate-400 animate-pulse">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-background-dark max-w-md mx-auto shadow-2xl overflow-hidden">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(AppScreen.EXPERT_DISCOVERY)} className="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </button>
          <h2 className="text-lg font-bold">Book a Session</h2>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Expert Profile Card */}
        <section className="p-6">
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-800">
            <img src={expert.image} className="size-20 rounded-2xl object-cover shadow-sm" />
            <div className="flex-1">
              <h3 className="text-lg font-bold">{expert.name}</h3>
              <p className="text-sm text-slate-500">{expert.title}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5 text-yellow-500">
                  <span className="material-symbols-outlined text-sm fill-1">star</span>
                  <span className="text-xs font-bold">{expert.rating}</span>
                </div>
                <span className="text-slate-300">•</span>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${themePrimary}`}>Verified Expert</p>
              </div>
            </div>
          </div>
        </section>

        {/* Date Selection */}
        <section className="px-6 py-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Select Date</h3>
            <span className="text-sm font-medium text-slate-400">October 2024</span>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {days.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDate(idx)}
                className={`flex flex-col items-center justify-center min-w-[64px] h-20 rounded-2xl transition-all border-2 ${
                  selectedDate === idx
                    ? `${themeBorderPrimary} bg-opacity-5 text-primary scale-105`
                    : 'border-transparent bg-slate-50 dark:bg-slate-900 text-slate-400'
                }`}
                style={{ backgroundColor: selectedDate === idx ? (isDietitian ? 'rgba(16, 185, 129, 0.05)' : 'rgba(19, 91, 236, 0.05)') : undefined }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.day}</span>
                <span className="text-lg font-black">{item.date}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Time Slots */}
        <section className="px-6 py-6">
          <h3 className="font-bold mb-4">Available Time Slots</h3>
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`py-3.5 rounded-2xl text-sm font-bold transition-all border-2 ${
                  selectedTime === slot
                    ? `${themeBorderPrimary} ${themeBgPrimary} text-white shadow-lg ${themeShadow} scale-102`
                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </section>

        {/* Info */}
        <section className="px-6 py-4">
           <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 flex gap-3">
              <span className="material-symbols-outlined text-amber-500">info</span>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                Consultation sessions last 45 minutes and are conducted via secure end-to-end encrypted video calls within the Urkio app.
              </p>
           </div>
        </section>
      </main>

      {/* Footer CTA */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-50">
        <div className="flex items-center justify-between mb-4">
           <div>
              <p className="text-xs text-slate-400">Total Consultation Fee</p>
              <p className="text-xl font-black">$60.00</p>
           </div>
           <span className={`text-[10px] font-bold ${themePrimary} uppercase bg-opacity-10 px-3 py-1 rounded-full`} style={{ backgroundColor: isDietitian ? 'rgba(16, 185, 129, 0.1)' : 'rgba(19, 91, 236, 0.1)' }}>Insurance Accepted</span>
        </div>
        <button
          disabled={!selectedTime}
          onClick={handleBooking}
          className={`w-full h-14 ${themeGradient} rounded-2xl font-bold text-white shadow-xl ${themeShadow} disabled:opacity-30 disabled:grayscale transition-all active:scale-95`}
        >
          Confirm Booking
        </button>
      </footer>
    </div>
  );
};

export default ExpertBooking;
