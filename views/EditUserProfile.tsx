
import React, { useState, useRef } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
  language: 'en' | 'ar' | 'fr';
  setLanguage: (lang: 'en' | 'ar' | 'fr') => void;
}

const STUDY_LEVELS = [
  'High School',
  'Associate Degree',
  'Bachelor’s Degree',
  'Master’s Degree',
  'Doctorate',
  'Self-Taught / Alternative'
];

interface UserCertification {
  id: string;
  name: string;
  year: string;
}

const EditUserProfile: React.FC<Props> = ({ navigate, language, setLanguage }) => {
  const [formData, setFormData] = useState({
    name: 'Alex Johnson',
    email: 'alex.j@urkio.com',
    phone: '+1 (555) 987-6543',
    bio: 'Finding balance and exploring the gut-brain connection. Passionate about holistic health and pediatric wellness.',
    studyLevel: 'Bachelor’s Degree'
  });

  const [skills, setSkills] = useState<string[]>(['Mindfulness', 'Breathwork', 'Yoga', 'Biohacking']);
  const [newSkill, setNewSkill] = useState('');

  const [certs, setCerts] = useState<UserCertification[]>([
    { id: '1', name: 'Verified Mindful Breathing', year: '2023' },
    { id: '2', name: '7-Day Reflection Mastery', year: '2024' }
  ]);

  const [newCertName, setNewCertName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSwitchingLang, setIsSwitchingLang] = useState(false);

  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const [profileImg, setProfileImg] = useState('https://picsum.photos/seed/u4/200/200');
  const [coverImg, setCoverImg] = useState('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate(AppScreen.USER_PROFILE);
      }, 2000);
    }, 1500);
  };

  const handleLanguageSwitch = (lang: 'en' | 'ar' | 'fr') => {
    if (lang === language) return;
    setIsSwitchingLang(true);
    setTimeout(() => {
      setLanguage(lang);
      setIsSwitchingLang(false);
    }, 1200);
  };

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || skills.includes(newSkill.trim())) return;
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) setter(URL.createObjectURL(file));
  };

  const t = language === 'ar' ? {
    header: 'تعديل الهوية',
    basicInfo: 'معلومات الحساب',
    langTitle: 'اللغة والترجمة',
    langDesc: 'اختر لغة واجهة التطبيق المفضلة لديك.',
    en: 'الإنجليزية',
    ar: 'العربية',
    fr: 'الفرنسية',
    save: 'حفظ التغييرات',
    bio: 'الفلسفة والسيرة الذاتية',
    name: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    study: 'المستوى الدراسي'
  } : language === 'fr' ? {
    header: 'Modifier l\'identité',
    basicInfo: 'Profil Membre',
    langTitle: 'Langue et localisation',
    langDesc: 'Sélectionnez la langue de l\'interface de votre application préférée.',
    en: 'Anglais',
    ar: 'Arabe',
    fr: 'Français',
    save: 'Enregistrer les modifications',
    bio: 'Philosophie et Biographie',
    name: 'Nom complet',
    phone: 'Téléphone de contact',
    study: 'Niveau d\'étude'
  } : {
    header: 'Edit Identity',
    basicInfo: 'Member Profile',
    langTitle: 'Language & Localization',
    langDesc: 'Select your preferred application interface language.',
    en: 'English',
    ar: 'Arabic',
    fr: 'French',
    save: 'Commit Identity Updates',
    bio: 'Philosophy & Bio',
    name: 'Full Display Name',
    phone: 'Contact Phone',
    study: 'Highest Study Level'
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-white dark:bg-background-dark max-w-md mx-auto shadow-2xl font-sans overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-96 urkio-gradient opacity-5 blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

      <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <button onClick={() => navigate(AppScreen.USER_PROFILE)} className="size-11 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 active:scale-95 transition-all">
          <span className={`material-symbols-outlined text-slate-500 ${language === 'ar' ? 'rotate-180' : ''}`}>
            arrow_back_ios_new
          </span>
        </button>
        <h2 className="text-lg font-black font-display tracking-tight">{t.header}</h2>
        <button
          onClick={() => navigate(AppScreen.SECURITY_PRIVACY)}
          className="size-11 flex items-center justify-center rounded-2xl bg-primary/10 text-primary active:scale-90"
        >
          <span className="material-symbols-outlined">shield</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 pb-40">
        {/* Language Section */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">language</span>
            {t.langTitle}
          </h3>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {t.langDesc}
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleLanguageSwitch('en')}
                className={`h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${language === 'en' ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-white/5 text-slate-400'}`}
              >
                {t.en}
              </button>
              <button
                onClick={() => handleLanguageSwitch('ar')}
                className={`h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${language === 'ar' ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-white/5 text-slate-400'}`}
              >
                {t.ar}
              </button>
              <button
                onClick={() => handleLanguageSwitch('fr')}
                className={`h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${language === 'fr' ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-white/5 text-slate-400'}`}
              >
                {t.fr}
              </button>
            </div>
          </div>
        </section>

        {/* Visual Identity Section */}
        <section className="space-y-8">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div
                onClick={() => profileImageInputRef.current?.click()}
                className="size-32 rounded-[3rem] urkio-gradient p-1 shadow-2xl transition-transform group-hover:scale-95 cursor-pointer"
              >
                <div className="size-full rounded-[2.8rem] bg-slate-900 border-4 border-white dark:border-background-dark flex items-center justify-center overflow-hidden">
                  <img src={profileImg} className="size-full object-cover" alt="Profile" />
                </div>
                <div className="absolute -bottom-1 -right-1 size-10 urkio-gradient rounded-2xl border-4 border-white dark:border-background-dark flex items-center justify-center shadow-xl">
                  <span className="material-symbols-outlined text-white text-lg fill-1">photo_camera</span>
                </div>
              </div>
              <input type="file" ref={profileImageInputRef} className="hidden" accept="image/*" onChange={e => handleFileChange(e, setProfileImg)} />
            </div>
          </div>
        </section>

        {/* Personal Details */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">person</span>
            {t.basicInfo}
          </h3>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mx-1">{t.name}</label>
            <input
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-14 px-6 bg-slate-50 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-primary/40 transition-all font-medium text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mx-1">{t.bio}</label>
            <textarea
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full h-32 p-6 bg-slate-50 dark:bg-white/5 border-none rounded-[2rem] focus:ring-2 focus:ring-primary/40 transition-all font-medium text-sm text-slate-900 dark:text-white shadow-inner leading-relaxed"
            />
          </div>
        </section>

        {/* Study Levels */}
        <section className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mx-1">{t.study}</label>
          <div className="grid grid-cols-2 gap-3">
            {STUDY_LEVELS.map(level => (
              <button
                key={level}
                onClick={() => setFormData({ ...formData, studyLevel: level })}
                className={`px-4 py-3 rounded-2xl text-[9px] font-black uppercase text-start border transition-all active:scale-95 ${formData.studyLevel === level
                  ? 'bg-primary/10 border-primary text-primary shadow-sm'
                  : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 text-slate-400'
                  }`}
              >
                {level}
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-white/90 dark:bg-background-dark/95 backdrop-blur-3xl border-t border-gray-100 dark:border-white/5 z-50">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full h-16 urkio-gradient rounded-[1.8rem] text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          {isSaving ? (
            <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="material-symbols-outlined">save</span>
              {t.save}
            </>
          )}
        </button>
      </footer>

      {isSwitchingLang && (
        <div className="fixed inset-0 z-[200] bg-background-dark flex items-center justify-center animate-in fade-in duration-300">
          <div className="text-center px-10 animate-in zoom-in duration-300">
            <div className="size-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-black mb-2 text-white">
              {language === 'ar' ? 'تغيير لغة النظام' : language === 'fr' ? 'Changement de langue' : 'Switching Region'}
            </h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
              {language === 'ar' ? 'يتم الآن تفعيل النسخة العربية...' : language === 'fr' ? 'Initialisation de l\'édition française...' : 'Initializing English Edition...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUserProfile;
