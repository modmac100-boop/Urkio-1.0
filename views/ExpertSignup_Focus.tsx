
import React, { useState } from 'react';
import { AppScreen } from '../types';
import { db, auth } from '../services/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface Props {
  navigate: (screen: AppScreen) => void;
  language: 'en' | 'ar' | 'fr';
  expertDraft: any;
  setExpertDraft: (draft: any) => void;
}

const CLINICAL_FOCUS = [
  { id: '1', name: 'Clinical Psychology', icon: 'psychology' },
  { id: '2', name: 'Pediatric Nutrition', icon: 'child_care' },
  { id: '3', name: 'CBT Specialist', icon: 'brain' },
  { id: '4', name: 'Holistic Oncology', icon: 'vital_signs' },
  { id: '5', name: 'Functional Medicine', icon: 'medical_services' },
  { id: '6', name: 'Gut Health Coach', icon: 'spa' },
  { id: '7', name: 'Sleep Hygiene', icon: 'bedtime' },
  { id: '8', name: 'Trauma Therapy', icon: 'healing' }
];

const MANAGER_FOCUS = [
  { id: 'm1', name: 'Clinical Triage', icon: 'fact_check' },
  { id: 'm2', name: 'Journey Architecture', icon: 'architecture' },
  { id: 'm3', name: 'Crisis Stabilization', icon: 'emergency_home' },
  { id: 'm4', name: 'Expert Matching', icon: 'person_search' },
  { id: 'm5', name: 'Case Coordination', icon: 'sync_alt' },
  { id: 'm6', name: 'Resource Curation', icon: 'library_books' },
  { id: 'm7', name: 'Family Advocacy', icon: 'diversity_1' },
  { id: 'm8', name: 'Outpatient Sync', icon: 'cloud_sync' }
];

const ExpertSignup_Focus: React.FC<Props> = ({ navigate, language, expertDraft, setExpertDraft }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set(expertDraft.focusAreas || []));
  const isCaseManager = expertDraft.roleType === 'Case Manager';

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const currentFocusSet = isCaseManager ? MANAGER_FOCUS : CLINICAL_FOCUS;

  const t = language === 'ar' ? {
    title: 'تركيز الممارسة',
    desc: 'اختر مجالات تخصصك الأساسية حتى نتمكن من ربطك بالباحثين المناسبين في الدليل.',
    complete: 'إكمال الإعداد',
    step: 'خطوة الطلب 3 من 3'
  } : language === 'fr' ? {
    title: 'Domaine de pratique',
    desc: 'Sélectionnez vos spécialités principales afin que nous puissions vous connecter aux bons chercheurs dans l\'annuaire.',
    complete: 'Terminer la configuration',
    step: 'Étape 3 sur 3 de la demande'
  } : {
    title: 'Practice Focus',
    desc: 'Select your core niches so we can connect you with the right seekers in the directory.',
    complete: 'Complete Setup',
    step: 'Application Step 3 of 3'
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background-dark text-white max-w-md mx-auto shadow-2xl font-sans overflow-hidden">
      <div className="absolute bottom-0 right-0 w-full h-96 urkio-gradient opacity-10 blur-[120px] translate-y-1/2"></div>

      <header className="relative z-10 p-8 flex items-center justify-between">
        <button onClick={() => navigate(AppScreen.EXPERT_SIGNUP_VERIFICATION)} className="size-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-90 transition-transform">
          <span className={`material-symbols-outlined text-[22px] ${language === 'ar' ? 'rotate-180' : ''}`}>arrow_back_ios_new</span>
        </button>
        <div className="flex gap-2">
          <div className="w-8 h-1.5 rounded-full bg-primary/20"></div>
          <div className="w-8 h-1.5 rounded-full bg-primary/20"></div>
          <div className="w-8 h-1.5 rounded-full urkio-gradient shadow-[0_0_8px_rgba(217,70,239,0.5)]"></div>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-8 pt-6 pb-12 flex flex-col no-scrollbar overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight mb-3 font-display">{t.title}</h1>
          <p className="text-slate-400 font-medium leading-relaxed">{t.desc}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1">
          {currentFocusSet.map(area => {
            const isSelected = selected.has(area.id);
            return (
              <button
                key={area.id}
                onClick={() => toggle(area.id)}
                className={`flex flex-col items-center gap-4 p-6 rounded-[2.5rem] border-2 transition-all active:scale-[0.98] ${isSelected
                  ? 'border-primary bg-primary/10 text-primary shadow-2xl shadow-primary/20 scale-[1.05]'
                  : 'border-white/5 bg-white/5 text-slate-500'
                  }`}
              >
                <div className={`size-14 rounded-2xl flex items-center justify-center transition-colors ${isSelected ? 'bg-primary text-white shadow-xl' : 'bg-white/5'}`}>
                  <span className={`material-symbols-outlined text-3xl ${isSelected ? 'fill-1' : ''}`}>{area.icon}</span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-center leading-tight">{area.name}</span>
              </button>
            );
          })}
        </div>

        <footer className="mt-12">
          <button
            disabled={selected.size === 0}
            onClick={async () => {
              const finalAreas = Array.from(selected);
              const updatedDraft = { ...expertDraft, focusAreas: finalAreas };
              setExpertDraft(updatedDraft);

              try {
                // If user is logged in, tie application to their UID
                const userId = auth.currentUser?.uid || `pending_${Date.now()}`;

                // Remove File objects before saving to Firestore (they would need to go to Storage first)
                const { documents, ...draftWithoutFiles } = updatedDraft;

                await setDoc(doc(db, 'profiles', userId), {
                  ...draftWithoutFiles,
                  credentialUrl: 'https://example.com/placeholder-credential.pdf', // Placeholder for actual upload
                  role: 'SPECIALIST',
                  isVerified: false,
                  submittedAt: serverTimestamp(),
                }, { merge: true });
                console.log("Expert application submitted successfully!");
                navigate(AppScreen.EXPERT_REVIEW_STATUS);
              } catch (error) {
                console.error("Error submitting expert application:", error);
                // Still move forward for demo purposes if desired, or show error
                navigate(AppScreen.EXPERT_REVIEW_STATUS);
              }
            }}
            className="w-full h-16 urkio-gradient rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
          >
            {t.complete}
            <span className="material-symbols-outlined text-[18px]">done_all</span>
          </button>
          <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest mt-6">{t.step}</p>
        </footer>
      </main>
    </div>
  );
};

export default ExpertSignup_Focus;
