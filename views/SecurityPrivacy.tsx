
import React, { useState } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
  language: 'en' | 'ar';
}

const SecurityPrivacy: React.FC<Props> = ({ navigate, language }) => {
  const [security, setSecurity] = useState({
    twoFactor: false,
    biometrics: true,
    locationPrivacy: false,
    publicProfile: true,
    homiiExpertAccess: true,
    anonymousActivity: false
  });

  const t = language === 'ar' ? {
    header: 'الأمن والخصوصية',
    subHeader: 'حماية رحلتك',
    accountSec: 'أمان الحساب',
    visibility: 'الظهور والبيانات',
    critical: 'إجراءات حرجة',
    tfa: 'المصادقة الثنائية',
    tfaActive: 'نشط',
    tfaInactive: 'غير مفعل',
    biometrics: 'الدخول الحيوي',
    biometricsDesc: 'بصمة الوجه / الإصبع',
    public: 'الملف العام',
    publicDesc: 'مرئي للأعضاء',
    homii: 'مشاركة Homii',
    homiiDesc: 'وصول مراجعة الخبراء',
    incognito: 'وضع التخفي',
    incognitoDesc: 'تفاعلات مجهولة',
    export: 'تصدير بياناتي',
    exportDesc: 'الحصول على سجل JSON الطبي',
    purge: 'حذف الحساب',
    purgeDesc: 'حذف نهائي',
    grade: 'خصوصية من الدرجة الطبية',
    gradeDesc: 'تستخدم Urkio معايير تشفير متوافقة مع HIPAA. تأملاتك الصوتية في Homii مخصصة لعينيك (وعين متخصصك) فقط.'
  } : {
    header: 'Security & Privacy',
    subHeader: 'Safeguard Your Journey',
    accountSec: 'Account Security',
    visibility: 'Visibility & Data',
    critical: 'Critical Actions',
    tfa: 'Two-Factor Auth',
    tfaActive: 'Active',
    tfaInactive: 'Not protected',
    biometrics: 'Biometric Login',
    biometricsDesc: 'FaceID / Fingerprint',
    public: 'Public Profile',
    publicDesc: 'Visible to members',
    homii: 'Homii Sharing',
    homiiDesc: 'Expert review access',
    incognito: 'Incognito Mode',
    incognitoDesc: 'Anonymous interactions',
    export: 'Export My Data',
    exportDesc: 'Get clinical JSON history',
    purge: 'Purge Account',
    purgeDesc: 'Permanent deletion',
    grade: 'Medical-Grade Privacy',
    gradeDesc: 'Urkio utilizes HIPAA-compliant encryption standards. Your Homii vocal reflections and clinical data are for your eyes (and your specialist\'s) only.'
  };

  const toggle = (key: keyof typeof security) => {
    if (key === 'twoFactor' && !security.twoFactor) {
      navigate(AppScreen.TFA_SETUP_METHOD);
      return;
    }
    setSecurity(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl font-sans overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/95 backdrop-blur-md px-6 pt-12 pb-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(AppScreen.USER_PROFILE)} 
            className="size-11 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent dark:border-white/5 active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-slate-500">arrow_back_ios_new</span>
          </button>
          <div>
            <h2 className="text-xl font-black font-display tracking-tight">{t.header}</h2>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{t.subHeader}</p>
          </div>
        </div>
        <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
           <span className="material-symbols-outlined fill-1">verified_user</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 pb-32">
        <section className="space-y-6">
           <div className="flex items-center gap-2 px-1">
              <span className="material-symbols-outlined text-primary text-sm">lock</span>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{t.accountSec}</h3>
           </div>
           
           <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                       <span className="material-symbols-outlined text-2xl">password</span>
                    </div>
                    <div>
                       <h4 className="text-sm font-black">{t.tfa}</h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{security.twoFactor ? t.tfaActive : t.tfaInactive}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => toggle('twoFactor')}
                   className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${security.twoFactor ? 'bg-primary justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                 >
                    <div className="size-4 bg-white rounded-full shadow-lg"></div>
                 </button>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                       <span className="material-symbols-outlined text-2xl">fingerprint</span>
                    </div>
                    <div>
                       <h4 className="text-sm font-black">{t.biometrics}</h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.biometricsDesc}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => toggle('biometrics')}
                   className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${security.biometrics ? 'bg-primary justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                 >
                    <div className="size-4 bg-white rounded-full shadow-lg"></div>
                 </button>
              </div>
           </div>
        </section>

        <section className="space-y-6">
           <div className="flex items-center gap-2 px-1">
              <span className="material-symbols-outlined text-urkio-magenta text-sm">visibility</span>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{t.visibility}</h3>
           </div>

           <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-urkio-magenta/10 text-urkio-magenta flex items-center justify-center">
                       <span className="material-symbols-outlined text-2xl">public</span>
                    </div>
                    <div>
                       <h4 className="text-sm font-black">{t.public}</h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.publicDesc}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => toggle('publicProfile')}
                   className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${security.publicProfile ? 'bg-urkio-magenta justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                 >
                    <div className="size-4 bg-white rounded-full shadow-lg"></div>
                 </button>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-urkio-magenta/10 text-urkio-magenta flex items-center justify-center">
                       <span className="material-symbols-outlined text-2xl">mic</span>
                    </div>
                    <div>
                       <h4 className="text-sm font-black">{t.homii}</h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.homiiDesc}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => toggle('homiiExpertAccess')}
                   className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${security.homiiExpertAccess ? 'bg-urkio-magenta justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                 >
                    <div className="size-4 bg-white rounded-full shadow-lg"></div>
                 </button>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-urkio-magenta/10 text-urkio-magenta flex items-center justify-center">
                       <span className="material-symbols-outlined text-2xl">person_off</span>
                    </div>
                    <div>
                       <h4 className="text-sm font-black">{t.incognito}</h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.incognitoDesc}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => toggle('anonymousActivity')}
                   className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${security.anonymousActivity ? 'bg-urkio-magenta justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                 >
                    <div className="size-4 bg-white rounded-full shadow-lg"></div>
                 </button>
              </div>
           </div>
        </section>

        <section className="space-y-6">
           <div className="flex items-center gap-2 px-1">
              <span className="material-symbols-outlined text-red-500 text-sm">dangerous</span>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{t.critical}</h3>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              <button className="w-full p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl flex items-center justify-between group active:scale-[0.98] transition-all">
                 <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 flex items-center justify-center group-hover:text-primary transition-colors">
                       <span className="material-symbols-outlined text-2xl">download</span>
                    </div>
                    <div className="text-left">
                       <h4 className="text-sm font-black">{t.export}</h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.exportDesc}</p>
                    </div>
                 </div>
                 <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>

              <button className="w-full p-6 bg-red-500/5 border border-red-500/10 rounded-3xl flex items-center justify-between group active:scale-[0.98] transition-all">
                 <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                       <span className="material-symbols-outlined text-2xl">delete_forever</span>
                    </div>
                    <div className="text-left">
                       <h4 className="text-sm font-black text-red-500">{t.purge}</h4>
                       <p className="text-[10px] font-bold text-red-400/60 uppercase tracking-widest">{t.purgeDesc}</p>
                    </div>
                 </div>
                 <span className="material-symbols-outlined text-red-200">chevron_right</span>
              </button>
           </div>
        </section>

        <section className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 urkio-gradient opacity-10 blur-3xl pointer-events-none"></div>
           <div className="relative z-10 text-center">
              <div className="size-20 rounded-[1.8rem] bg-white/10 backdrop-blur-md mx-auto mb-6 flex items-center justify-center border border-white/20">
                 <span className="material-symbols-outlined text-4xl text-accent-cyan fill-1 animate-breathe">security</span>
              </div>
              <h4 className="text-xl font-black mb-2 font-display">{t.grade}</h4>
              <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed px-4">{t.gradeDesc}</p>
              <div className="flex justify-center gap-6 opacity-40 grayscale">
                 <img src="https://www.svgrepo.com/show/442931/apple-logo.svg" className="size-6 invert" alt="Secure" />
                 <img src="https://www.svgrepo.com/show/303233/google-cloud-logo.svg" className="size-6 invert" alt="Encrypted" />
                 <img src="https://www.svgrepo.com/show/448234/linkedin.svg" className="size-6 invert" alt="Compliant" />
              </div>
           </div>
        </section>
      </main>

      <footer className="p-8 text-center bg-white dark:bg-background-dark border-t border-gray-100 dark:border-white/5">
         <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] no-mirror">Protocol v4.2 • Secured by Urkio Intelligence</p>
      </footer>
    </div>
  );
};

export default SecurityPrivacy;
