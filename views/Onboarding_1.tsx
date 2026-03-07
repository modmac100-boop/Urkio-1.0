import React, { useState } from 'react';
import { AppScreen, UserRole } from '../types';
import { db, auth } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface Props {
  navigate: (screen: AppScreen) => void;
  userRole: UserRole;
}

const INTERESTS = [
  { id: '1', name: 'Mental Health', icon: 'psychology' },
  { id: '2', name: 'Nutrition', icon: 'restaurant' },
  { id: '3', name: 'Yoga & Zen', icon: 'spa' },
  { id: '4', name: 'Fitness', icon: 'fitness_center' },
  { id: '5', name: 'Meditation', icon: 'self_improvement' },
  { id: '6', name: 'Holistic Care', icon: 'medical_services' },
  { id: '7', name: 'Sleep Science', icon: 'bedtime' },
  { id: '8', name: 'Gut Health', icon: 'vital_signs' }
];

const Onboarding_1: React.FC<Props> = ({ navigate }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleNext = async () => {
    const user = auth.currentUser;
    if (!user) {
      navigate(AppScreen.ONBOARDING_2);
      return;
    }

    setSaving(true);
    try {
      const selectedNames = INTERESTS
        .filter(item => selected.has(item.id))
        .map(item => item.name);

      await updateDoc(doc(db, 'profiles', user.uid), {
        hobbies: selectedNames,
        interests: selectedNames,
        onboardingStep: 1
      });
      navigate(AppScreen.ONBOARDING_2);
    } catch (err) {
      console.error("Error saving interests:", err);
      // Fallback to navigate anyway if it fails, but ideally show error
      navigate(AppScreen.ONBOARDING_2);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-white dark:bg-background-dark max-w-md mx-auto shadow-2xl font-sans overflow-hidden">
      <div className="absolute bottom-0 right-0 w-full h-96 urkio-gradient opacity-5 blur-[120px] translate-y-1/2"></div>

      <header className="relative z-10 p-8 flex items-center justify-between">
        <button onClick={() => navigate(AppScreen.ONBOARDING_INTRO)} className="size-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
        </button>
        <div className="flex gap-1.5">
          <div className="w-8 h-1.5 rounded-full bg-primary/20"></div>
          <div className="w-8 h-1.5 rounded-full urkio-gradient"></div>
          <div className="w-8 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800"></div>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-8 pt-6 pb-12">
        <h1 className="text-4xl font-black tracking-tight mb-4 font-display">Personalize your feed</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">Select at least 3 topics that interest you to help us tailor your experience.</p>

        <div className="grid grid-cols-2 gap-4">
          {INTERESTS.map(item => {
            const isSelected = selected.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggle(item.id)}
                className={`flex flex-col items-center gap-4 p-6 rounded-[2.5rem] border-2 transition-all active:scale-[0.98] ${isSelected
                  ? 'border-primary bg-primary/5 text-primary shadow-2xl shadow-primary/10 scale-[1.05]'
                  : 'border-slate-50 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50 text-slate-500'
                  }`}
              >
                <div className={`size-14 rounded-2xl flex items-center justify-center transition-colors ${isSelected ? 'bg-primary text-white shadow-xl' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <span className={`material-symbols-outlined text-3xl ${isSelected ? 'fill-1' : ''}`}>{item.icon}</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.name}</span>
              </button>
            );
          })}
        </div>
      </main>

      <footer className="relative z-10 p-8 pt-0 bg-gradient-to-t from-white dark:from-background-dark via-white/80 dark:via-background-dark/80 to-transparent">
        <button
          onClick={handleNext}
          disabled={selected.size < 3 || saving}
          className="w-full h-16 urkio-gradient rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
        >
          {saving ? (
            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              {selected.size < 3 ? `Select ${3 - selected.size} More` : 'Next Step'}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </>
          )}
        </button>
        <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6">Step 2 of 3</p>
      </footer>
    </div>
  );
};

export default Onboarding_1;
