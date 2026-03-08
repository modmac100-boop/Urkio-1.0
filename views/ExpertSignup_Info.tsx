
import React, { useState } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
  language: 'en' | 'ar' | 'fr';
}

const ExpertSignup_Info: React.FC<Props> = ({ navigate, language }) => {
  const [roleType, setRoleType] = useState<'CLINICAL' | 'CASE_MANAGER' | 'DIETITIAN'>('CLINICAL');
  const [title, setTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');

  const t = language === 'ar' ? {
    header: 'المعلومات المهنية',
    sub: 'أخبرنا المزيد عن مسارك المهني وخلفيتك الاحترافية.',
    roleLabel: 'نوع الدور المهني',
    clinical: 'أخصائي سريري',
    clinicalDesc: 'طبيب، أخصائي نفس',
    manager: 'مدير حالة',
    managerDesc: 'فرز، تنسيق، إدارة رحلة',
    dietitian: 'أخصائي تغذية',
    dietitianDesc: 'تغذية وظيفية، صحة الأمعاء',
    titleLabel: 'المسمى المهني',
    expLabel: 'سنوات الخبرة',
    bioLabel: 'سيرة ذاتية قصيرة',
    bioPlaceholder: 'أخبر الباحثين عن أسلوبك وشغفك بالعافية...',
    continue: 'استمرار',
    step: 'خطوة الطلب 1 من 3'
  } : language === 'fr' ? {
    header: 'Infos professionnelles',
    sub: 'Dites-nous en plus sur votre carrière et vos antécédents professionnels.',
    roleLabel: 'Type de rôle professionnel',
    clinical: 'Spécialiste clinique',
    clinicalDesc: 'Médecin, Psychologue',
    manager: 'Gestionnaire de cas',
    managerDesc: 'Triage, Coordination',
    dietitian: 'Diététicien',
    dietitianDesc: 'Nutrition fonctionnelle, Santé intestinale',
    titleLabel: 'Titre professionnel',
    expLabel: 'Années d\'expérience',
    bioLabel: 'Courte biographie',
    bioPlaceholder: 'Parlez aux chercheurs de votre approche...',
    continue: 'Continuer',
    step: 'Étape 1 sur 3'
  } : {
    header: 'Professional Info',
    sub: 'Let us know more about your career and professional background.',
    roleLabel: 'Professional Role Type',
    clinical: 'Clinical Specialist',
    clinicalDesc: 'Doctor, Psychologist',
    manager: 'Case Manager',
    managerDesc: 'Triage, Coordination, Journey Management',
    dietitian: 'Dietitian',
    dietitianDesc: 'Functional Nutrition, Gut Health',
    titleLabel: 'Professional Title',
    expLabel: 'Years of Experience',
    bioLabel: 'Short Bio',
    bioPlaceholder: 'Tell seekers about your approach and passion for wellness...',
    continue: 'Continue',
    step: 'Application Step 1 of 3'
  };

  const handleRoleChange = (type: 'CLINICAL' | 'CASE_MANAGER' | 'DIETITIAN') => {
    setRoleType(type);
    if (type === 'CASE_MANAGER') setTitle('Journey Case Manager');
    else if (type === 'DIETITIAN') setTitle('Functional Dietitian');
    else setTitle('');
  };

  const isDietMode = roleType === 'DIETITIAN';
  const themeColor = isDietMode ? 'text-urkio-green' : 'text-primary';
  const themeBorder = isDietMode ? 'border-urkio-green' : 'border-primary';
  const themeBg = isDietMode ? 'bg-urkio-green/10' : 'bg-primary/10';

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background-dark text-white max-w-md mx-auto shadow-2xl font-sans overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-96 urkio-gradient opacity-10 blur-[100px] -translate-y-1/2 transition-colors duration-700 ${isDietMode ? 'hue-rotate-[140deg]' : ''}`}></div>

      <header className="relative z-10 p-8 flex items-center justify-between">
        <button onClick={() => navigate(AppScreen.EXPERT_ONBOARDING)} className="size-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-90 transition-transform">
          <span className={`material-symbols-outlined text-[22px] ${language === 'ar' ? 'rotate-180' : ''}`}>arrow_back_ios_new</span>
        </button>
        <div className="flex gap-2">
          <div className={`w-8 h-1.5 rounded-full shadow-lg transition-all duration-700 ${isDietMode ? 'bg-urkio-green shadow-urkio-green/30' : 'urkio-gradient shadow-primary/30'}`}></div>
          <div className="w-8 h-1.5 rounded-full bg-white/10"></div>
          <div className="w-8 h-1.5 rounded-full bg-white/10"></div>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-8 pt-6 pb-12 flex flex-col no-scrollbar overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight mb-3 font-display">{t.header}</h1>
          <p className="text-slate-400 font-medium leading-relaxed">{t.sub}</p>
        </div>

        <div className="space-y-10 flex-1">
          {/* Role Selection */}
          <div className="space-y-4">
            <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${themeColor}`}>{t.roleLabel}</label>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleRoleChange('CLINICAL')}
                className={`p-5 rounded-[2rem] border-2 text-left flex items-center gap-4 transition-all ${roleType === 'CLINICAL' ? 'bg-primary/10 border-primary shadow-lg' : 'bg-white/5 border-white/5 opacity-60'}`}
              >
                <div className={`size-12 rounded-xl flex items-center justify-center ${roleType === 'CLINICAL' ? 'bg-primary text-white' : 'bg-white/5 text-slate-500'}`}>
                  <span className="material-symbols-outlined">medical_services</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black">{t.clinical}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.clinicalDesc}</p>
                </div>
              </button>

              <button
                onClick={() => handleRoleChange('DIETITIAN')}
                className={`p-5 rounded-[2rem] border-2 text-left flex items-center gap-4 transition-all ${roleType === 'DIETITIAN' ? 'bg-urkio-green/10 border-urkio-green shadow-lg' : 'bg-white/5 border-white/5 opacity-60'}`}
              >
                <div className={`size-12 rounded-xl flex items-center justify-center ${roleType === 'DIETITIAN' ? 'bg-urkio-green text-white' : 'bg-white/5 text-slate-500'}`}>
                  <span className="material-symbols-outlined">restaurant</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black">{t.dietitian}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.dietitianDesc}</p>
                </div>
              </button>

              <button
                onClick={() => handleRoleChange('CASE_MANAGER')}
                className={`p-5 rounded-[2rem] border-2 text-left flex items-center gap-4 transition-all ${roleType === 'CASE_MANAGER' ? 'bg-urkio-magenta/10 border-urkio-magenta shadow-lg' : 'bg-white/5 border-white/5 opacity-60'}`}
              >
                <div className={`size-12 rounded-xl flex items-center justify-center ${roleType === 'CASE_MANAGER' ? 'bg-urkio-magenta text-white' : 'bg-white/5 text-slate-500'}`}>
                  <span className="material-symbols-outlined">hub</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black">{t.manager}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.managerDesc}</p>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-2 group">
            <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${themeColor}`}>{t.titleLabel}</label>
            <div className="relative">
              <span className={`material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[20px] transition-colors ${themeColor}`}>badge</span>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={`w-full h-16 pl-14 pr-5 bg-white/5 border border-white/10 rounded-[1.25rem] focus:ring-2 transition-all font-medium text-sm text-white ${isDietMode ? 'focus:ring-urkio-green/40' : 'focus:ring-primary/40'}`}
                placeholder="e.g. Senior Psychologist"
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-1 transition-colors ${themeColor}`}>{t.expLabel}</label>
            <div className="relative">
              <span className={`material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[20px] transition-colors ${themeColor}`}>history</span>
              <input
                type="number"
                value={experience}
                onChange={e => setExperience(e.target.value)}
                className={`w-full h-16 pl-14 pr-5 bg-white/5 border border-white/10 rounded-[1.25rem] focus:ring-2 transition-all font-medium text-sm text-white ${isDietMode ? 'focus:ring-urkio-green/40' : 'focus:ring-primary/40'}`}
                placeholder="e.g. 12"
              />
            </div>
          </div>
        </div>

        <footer className="mt-12">
          <button
            disabled={!title || !experience}
            onClick={() => navigate(AppScreen.EXPERT_SIGNUP_VERIFICATION)}
            className={`w-full h-16 rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale ${isDietMode ? 'bg-urkio-green shadow-urkio-green/20' : 'urkio-gradient shadow-primary/30'
              }`}
          >
            {t.continue}
            <span className={`material-symbols-outlined text-[18px] ${language === 'ar' ? 'rotate-180' : ''}`}>arrow_forward</span>
          </button>
          <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest mt-6">{t.step}</p>
        </footer>
      </main>
    </div>
  );
};

export default ExpertSignup_Info;
