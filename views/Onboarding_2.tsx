import React, { useState, useRef } from 'react';
import { AppScreen, UserRole } from '../types';
import { db, auth } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface Props {
  navigate: (screen: AppScreen) => void;
  userRole: UserRole;
}

const Onboarding_2: React.FC<Props> = ({ navigate, userRole }) => {
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [coverImg, setCoverImg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showExpert: true,
    allowCircles: true
  });

  const toggle = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app we'd upload to Firebase Storage
      // For now we'll use object URL for preview and log it
      setter(URL.createObjectURL(file));
    }
  };

  const handleInitialize = async () => {
    const user = auth.currentUser;
    if (!user) {
      navigate(AppScreen.USER_DASHBOARD);
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, 'profiles', user.uid), {
        profileImage: profileImg, // In production, these would be Storage URLs
        coverImage: coverImg,
        privacySettings: privacy,
        onboardingStep: 2,
        isSetupComplete: true
      });

      if (userRole === 'EXPERT') {
        navigate(AppScreen.EXPERT_SIGNUP_INFO);
      } else {
        navigate(AppScreen.USER_DASHBOARD);
      }
    } catch (err) {
      console.error("Error finalizing profile:", err);
      if (userRole === 'EXPERT') {
        navigate(AppScreen.EXPERT_SIGNUP_INFO);
      } else {
        navigate(AppScreen.USER_DASHBOARD);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-white dark:bg-background-dark max-w-md mx-auto shadow-2xl font-sans overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-96 urkio-gradient opacity-5 blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

      <header className="relative z-10 p-8 flex items-center justify-between">
        <button onClick={() => navigate(AppScreen.ONBOARDING_1)} className="size-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
        </button>
        <div className="flex gap-1.5">
          <div className="w-8 h-1.5 rounded-full bg-primary/20"></div>
          <div className="w-8 h-1.5 rounded-full bg-primary/20"></div>
          <div className="w-8 h-1.5 rounded-full urkio-gradient"></div>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-8 pt-6 pb-12 flex flex-col no-scrollbar overflow-y-auto">
        <h1 className="text-4xl font-black tracking-tight mb-4 font-display text-slate-900 dark:text-white">Profile Identity</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">Establish your visual presence. This profile will be linked to your global health ID.</p>

        {/* Visual Identity Section */}
        <div className="space-y-10 mb-12">
          {/* Cover Photo Upload */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Profile Cover Page</label>
            <div
              onClick={() => coverInputRef.current?.click()}
              className="relative w-full h-32 rounded-3xl bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-white/10 overflow-hidden cursor-pointer group active:scale-[0.99] transition-all"
            >
              {coverImg ? (
                <img src={coverImg} className="size-full object-cover" alt="Cover" />
              ) : (
                <div className="size-full flex flex-col items-center justify-center text-slate-400 gap-1">
                  <span className="material-symbols-outlined">add_photo_alternate</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">Upload Cover Page</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="material-symbols-outlined text-white">edit</span>
              </div>
            </div>
            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, setCoverImg)} />
          </div>

          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div
                onClick={() => profileInputRef.current?.click()}
                className="size-32 rounded-[3rem] urkio-gradient p-1 shadow-2xl transition-transform active:scale-95 cursor-pointer"
              >
                <div className="size-full rounded-[2.8rem] bg-slate-900 border-4 border-white dark:border-background-dark flex items-center justify-center overflow-hidden bg-cover bg-center" style={{ backgroundImage: profileImg ? `url(${profileImg})` : 'none' }}>
                  {!profileImg && <span className="material-symbols-outlined text-white/40 text-5xl">person</span>}
                </div>
                <div className="absolute -bottom-1 -right-1 size-10 urkio-gradient rounded-2xl border-4 border-white dark:border-background-dark flex items-center justify-center shadow-xl">
                  <span className="material-symbols-outlined text-white text-lg fill-1">photo_camera</span>
                </div>
              </div>
              <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, setProfileImg)} />
            </div>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary">Upload Profile Photo</p>
          </div>
        </div>

        <section className="space-y-4 mb-10">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 px-1">Global Data Protocol</h3>

          <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">public</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-widest leading-none mb-1 text-slate-900 dark:text-white">Link Discovery</p>
                <p className="text-[10px] font-medium text-slate-500">Visible to community circles</p>
              </div>
            </div>
            <button
              onClick={() => toggle('publicProfile')}
              className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${privacy.publicProfile ? 'bg-primary justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
            >
              <div className="size-4 bg-white rounded-full shadow-lg"></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-urkio-magenta/10 text-urkio-magenta flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">security</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-widest leading-none mb-1 text-slate-900 dark:text-white">Expert Sync</p>
                <p className="text-[10px] font-medium text-slate-500">Secure link with practitioners</p>
              </div>
            </div>
            <button
              onClick={() => toggle('showExpert')}
              className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${privacy.showExpert ? 'bg-primary justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
            >
              <div className="size-4 bg-white rounded-full shadow-lg"></div>
            </button>
          </div>
        </section>
      </main>

      <footer className="relative z-10 p-8 pt-0 bg-gradient-to-t from-white dark:from-background-dark via-white/80 dark:via-background-dark/80 to-transparent">
        <button
          onClick={handleInitialize}
          disabled={saving}
          className="w-full h-18 urkio-gradient rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? (
            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              Initialize & Link Account
              <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
            </>
          )}
        </button>
        <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6">Protocol Active • Final Step of 3</p>
      </footer>
    </div>
  );
};

export default Onboarding_2;