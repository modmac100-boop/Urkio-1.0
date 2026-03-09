import React, { useState } from 'react';
import { AppScreen } from '../types';
import { db, auth } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const Homii: React.FC<Props> = ({ navigate }) => {
  const [reflectionText, setReflectionText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  const handleAction = async (type: 'PRIVATE' | 'SHARED') => {
    if (!reflectionText.trim()) {
      setShowFeedback('NO_TEXT');
      setTimeout(() => setShowFeedback(null), 2000);
      return;
    }

    setIsSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to save reflections.");
        setIsSaving(false);
        return;
      }

      await addDoc(collection(db, `users/${user.uid}/reflections`), {
        text: reflectionText,
        timestamp: serverTimestamp(),
        status: type === 'PRIVATE' ? 'private' : 'shared',
      });

      setShowFeedback(type);
      setReflectionText('');
      setTimeout(() => {
        setShowFeedback(null);
        navigate(AppScreen.USER_DASHBOARD);
      }, 3000);
    } catch (err) {
      console.error("Failed to save reflection:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col bg-[#050b1a] text-white max-w-md mx-auto overflow-hidden">
      <header className="p-4 flex items-center justify-between border-b border-white/5 bg-background-dark/50 backdrop-blur-md">
        <button onClick={() => navigate(AppScreen.USER_DASHBOARD)} className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5">
          <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
        </button>
        <div className="text-center">
          <p className="text-[10px] font-black tracking-[0.2em] text-urkio-magenta uppercase">Urkio</p>
          <h2 className="text-sm font-bold tracking-tight">Homii</h2>
        </div>
        <button className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5">
          <span className="material-symbols-outlined text-[20px] text-accent-cyan">verified_user</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col px-6 pt-8 overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-3 font-display">Your Safe Space</h1>
          <p className="text-slate-400 text-sm font-medium">Talk to yourself, reflect, or vent.</p>
        </div>

        <div className="flex-1 relative mb-8 rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 group focus-within:border-urkio-magenta/50 transition-colors">
          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="I am feeling..."
            className="w-full h-full p-8 bg-transparent text-white placeholder-slate-500 font-medium leading-relaxed resize-none focus:outline-none"
            style={{ minHeight: '300px' }}
          />
        </div>

        <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/5 mb-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-accent-cyan text-[20px]">security</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Reflection Action</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleAction('PRIVATE')}
              disabled={isSaving}
              className="flex-1 py-4 bg-transparent border-2 border-urkio-magenta rounded-2xl text-[10px] font-black text-urkio-magenta flex items-center justify-center gap-2 hover:bg-urkio-magenta/10 transition-all active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm fill-1">shield</span>
              Keep
            </button>
            <button
              onClick={() => handleAction('SHARED')}
              disabled={isSaving}
              className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">medical_services</span>
              Send to Specialist
            </button>
          </div>
        </div>
      </main>

      {showFeedback && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#050b1a]/95 animate-in fade-in duration-300 backdrop-blur-md">
          <div className="text-center px-10">
            <div className="size-24 rounded-full bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
              <span className="material-symbols-outlined text-emerald-500 text-5xl fill-1">
                {showFeedback === 'NO_TEXT' ? 'error' : 'check_circle'}
              </span>
            </div>
            <h3 className="text-3xl font-black mb-3 font-display">
              {showFeedback === 'PRIVATE' ? 'Saved Securely' :
                showFeedback === 'SHARED' ? 'Sent to Specialist' : 'Empty Reflection'}
            </h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              {showFeedback === 'PRIVATE'
                ? 'Your reflection has been safely stored in your private vault.'
                : showFeedback === 'SHARED'
                  ? 'Your reflection has been prepared for your specialist to review.'
                  : 'Please write your thoughts before saving.'}
            </p>
          </div>
        </div>
      )}

      {isSaving && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#050b1a]/90 backdrop-blur-md">
          <div className="size-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

    </div>
  );
};

export default Homii;
