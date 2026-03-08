
import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
  language: 'en' | 'ar' | 'fr';
}

const UrkioLogoSmall = () => (
  <svg className="size-10" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradPerm" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d946ef" />
        <stop offset="100%" stopColor="#135bec" />
      </linearGradient>
    </defs>
    <path
      d="M24 15V80C24 95 36 105 50 105C64 105 76 95 76 80V15"
      stroke="url(#logoGradPerm)"
      strokeWidth="30"
      strokeLinecap="round"
    />
    <path
      d="M24 80C24 95 36 105 50 105"
      stroke="black"
      strokeOpacity="0.1"
      strokeWidth="30"
      strokeLinecap="round"
    />
    <path
      d="M24 15V80C24 95 36 105 50 105C64 105 76 95 76 80V15"
      stroke="white"
      strokeWidth="32"
      strokeLinecap="round"
      strokeOpacity="0.6"
      className="animate-logo-shine"
    />
  </svg>
);

const PermissionRequest: React.FC<Props> = ({ onComplete, language }) => {
  const [permissions, setPermissions] = useState({
    camera: false,
    photos: false,
    location: false
  });

  const t = language === 'ar' ? {
    title: 'تنشيط بروتوكولات الوصول',
    subtitle: 'مطلوب لبناء رحلة مخصصة لك',
    desc: 'تستخدم Urkio هذه الميزات لتمكين تأملات Homii والتواصل مع الخبراء المحليين.',
    camera: 'الكاميرا والميكروفون',
    cameraDesc: 'لتسجيل تأملات الفيديو والصوت',
    photos: 'معرض الصور',
    photosDesc: 'لرفع صور التقدم والمستندات',
    location: 'تتبع الموقع',
    locationDesc: 'لربطك بأفضل الخبراء في منطقتك',
    allow: 'سماح',
    allowed: 'تم التفعيل',
    continue: 'تزامن الصلاحيات',
    secure: 'بياناتك مشفرة دائمًا'
  } : language === 'fr' ? {
    title: 'Activer l\'accès',
    subtitle: 'Requis pour votre parcours',
    desc: 'Urkio utilise ces fonctionnalités pour activer les réflexions Homii et vous connecter avec des experts.',
    camera: 'Caméra & Microphone',
    cameraDesc: 'Pour enregistrer des réflexions vidéo et audio',
    photos: 'Galerie de photos',
    photosDesc: 'Pour télécharger des visuels de progression',
    location: 'Suivi de localisation',
    locationDesc: 'Pour vous connecter avec les meilleurs experts',
    allow: 'Autoriser',
    allowed: 'Activé',
    continue: 'Synchroniser',
    secure: 'Vos données sont sécurisées'
  } : {
    title: 'Activate Access Protocols',
    subtitle: 'Required for your personalized journey',
    desc: 'Urkio utilizes these features to enable Homii reflections and connect you with local clinical experts.',
    camera: 'Camera & Microphone',
    cameraDesc: 'For recording video and audio reflections',
    photos: 'Photo Gallery',
    photosDesc: 'To upload progress visuals and documents',
    location: 'Location Tracking',
    locationDesc: 'To sync you with the best experts in your region',
    allow: 'Allow',
    allowed: 'Enabled',
    continue: 'Synchronize Permissions',
    secure: 'Your data is always encrypted'
  };

  const requestCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setPermissions(prev => ({ ...prev, camera: true }));
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => setPermissions(prev => ({ ...prev, location: true })),
      (err) => console.error("Location access denied", err)
    );
  };

  const togglePhotos = () => {
    setPermissions(prev => ({ ...prev, photos: !prev.photos }));
  };

  const allAcknowledged = permissions.camera || permissions.location || permissions.photos;

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#050b1a] text-white max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
      {/* Background Aura */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 size-[400px] bg-urkio-magenta/10 blur-[100px] rounded-full animate-aurora"></div>
        <div className="absolute bottom-1/4 right-1/4 size-[500px] bg-primary/10 blur-[120px] rounded-full animate-aurora" style={{ animationDelay: '-5s' }}></div>
      </div>

      <main className="relative z-10 flex-1 px-8 pt-20 pb-12 flex flex-col no-scrollbar overflow-y-auto">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-12 animate-in fade-in zoom-in duration-700">
          <div className="size-20 rounded-[2rem] crystal-glass flex items-center justify-center border border-white/20 shadow-2xl mb-6 hover:scale-110 transition-transform cursor-pointer">
            <UrkioLogoSmall />
          </div>
          <h1 className="text-3xl font-black font-display tracking-tight leading-tight mb-2 uppercase">{t.title}</h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[280px] mx-auto opacity-80">{t.subtitle}</p>
        </div>

        {/* Permission Cards */}
        <div className="space-y-4 flex-1">
          {/* Camera */}
          <div className={`p-6 rounded-[2.5rem] crystal-glass border transition-all duration-500 flex items-center gap-5 group ${permissions.camera ? 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-white/10 hover:border-primary/30'}`}>
            <div className={`size-14 rounded-2xl flex items-center justify-center transition-all ${permissions.camera ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400 group-hover:text-primary group-hover:bg-primary/10'}`}>
              <span className="material-symbols-outlined text-3xl">{permissions.camera ? 'videocam' : 'photo_camera'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-black uppercase tracking-widest">{t.camera}</h4>
              <p className="text-[10px] font-medium text-slate-500 mt-0.5 line-clamp-1">{t.cameraDesc}</p>
            </div>
            <button
              onClick={requestCamera}
              className={`h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${permissions.camera ? 'text-emerald-500' : 'bg-primary text-white shadow-lg active:scale-95'}`}
            >
              {permissions.camera ? t.allowed : t.allow}
            </button>
          </div>

          {/* Photos */}
          <div className={`p-6 rounded-[2.5rem] crystal-glass border transition-all duration-500 flex items-center gap-5 group ${permissions.photos ? 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-white/10 hover:border-primary/30'}`}>
            <div className={`size-14 rounded-2xl flex items-center justify-center transition-all ${permissions.photos ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400 group-hover:text-primary group-hover:bg-primary/10'}`}>
              <span className="material-symbols-outlined text-3xl">gallery_thumbnail</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-black uppercase tracking-widest">{t.photos}</h4>
              <p className="text-[10px] font-medium text-slate-500 mt-0.5 line-clamp-1">{t.photosDesc}</p>
            </div>
            <button
              onClick={togglePhotos}
              className={`h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${permissions.photos ? 'text-emerald-500' : 'bg-primary text-white shadow-lg active:scale-95'}`}
            >
              {permissions.photos ? t.allowed : t.allow}
            </button>
          </div>

          {/* Location */}
          <div className={`p-6 rounded-[2.5rem] crystal-glass border transition-all duration-500 flex items-center gap-5 group ${permissions.location ? 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-white/10 hover:border-primary/30'}`}>
            <div className={`size-14 rounded-2xl flex items-center justify-center transition-all ${permissions.location ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400 group-hover:text-primary group-hover:bg-primary/10'}`}>
              <span className="material-symbols-outlined text-3xl">location_on</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-black uppercase tracking-widest">{t.location}</h4>
              <p className="text-[10px] font-medium text-slate-500 mt-0.5 line-clamp-1">{t.locationDesc}</p>
            </div>
            <button
              onClick={requestLocation}
              className={`h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${permissions.location ? 'text-emerald-500' : 'bg-primary text-white shadow-lg active:scale-95'}`}
            >
              {permissions.location ? t.allowed : t.allow}
            </button>
          </div>
        </div>

        {/* Clinical Note Banner */}
        <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-[2.5rem] flex gap-4 animate-pulse">
          <div className="size-10 shrink-0 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
            <span className="material-symbols-outlined text-xl fill-1">verified_user</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
            {t.desc} <span className="text-primary font-bold">{t.secure}</span>.
          </p>
        </div>
      </main>

      {/* Footer Hub */}
      <footer className="relative z-20 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
        <button
          onClick={onComplete}
          disabled={!allAcknowledged}
          className="w-full h-18 urkio-gradient rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale group"
        >
          {t.continue}
          <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
        <p className="text-center text-[8px] font-black text-slate-600 uppercase tracking-[0.5em] mt-8">Urkio Clinical Intelligence Protocol v4.2</p>
      </footer>
    </div>
  );
};

export default PermissionRequest;
