
import React, { useState, useRef, useEffect } from 'react';
import { AppScreen, Circle, Resource, Expert, Post, Member } from '../types';
import { BottomNav } from '../components/Navigation';
import { Avatar } from '../components/Avatar';
import { auth, db } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot, doc, setDoc } from 'firebase/firestore';

interface Milestone {
   id: string;
   title: string;
   date: string;
   type: 'session' | 'reflection' | 'milestone';
   icon: string;
}

const JOURNEY_MILESTONES: (lang: string) => Milestone[] = (lang) => [
   { id: 'm1', title: lang === 'ar' ? 'استشارة مع د. آريس' : lang === 'fr' ? 'Consultation avec le Dr Aris' : 'Consultation with Dr. Aris', date: 'Oct 24, 2024', type: 'session', icon: 'videocam' },
   { id: 'm2', title: lang === 'ar' ? 'تحقيق تتابع 7 أيام' : lang === 'fr' ? 'Série de 7 jours atteinte' : 'Achieved 7-Day Streak', date: 'Oct 20, 2024', type: 'milestone', icon: 'auto_awesome' },
   { id: 'm3', title: lang === 'ar' ? 'تسجيل تأمل عميق' : lang === 'fr' ? 'Réflexion profonde vocalisée' : 'Vocalized Deep Reflection', date: 'Oct 18, 2024', type: 'reflection', icon: 'mic' },
];

const INITIAL_USER_POSTS: (lang: string) => Post[] = (lang) => [
   {
      id: 'up1',
      authorName: 'Alex Johnson',
      authorType: lang === 'ar' ? 'أسطورة قاعة المشاهير' : lang === 'fr' ? 'Légende du Temple de la renommée' : 'Hall of Fame Legend',
      authorImage: 'https://picsum.photos/seed/u4/100/100',
      content: lang === 'ar' ? "أفكر في كيفية تأثير التغييرات الصغيرة في صحة الأمعاء على تحسينات هائلة في الوضوح العقلي. كان هذا الأسبوع ملهماً جداً! 🌿" : lang === 'fr' ? "Je réfléchis à la façon dont de petits changements dans la santé intestinale peuvent entraîner des améliorations massives de la clarté mentale. Cette semaine a été une révélation ! 🌿" : "Reflecting on how small changes in gut health lead to massive improvements in mental clarity. This week has been an eye-opener! 🌿",
      time: lang === 'ar' ? 'منذ ساعتين' : lang === 'fr' ? 'il y a 2h' : '2h ago',
      likes: 124,
      comments: 18,
      reposts: 5,
      views: 1420,
      isHallOfFame: true,
      isEndorsed: true
   }
];

const STUDY_LEVELS = [
   'High School',
   'Associate Degree',
   'Bachelor’s Degree',
   'Master’s Degree',
   'Doctorate',
   'Self-Taught / Alternative'
];

const DEFAULT_MEMBER: Member = {
   id: 'u4',
   name: 'Alex Johnson',
   type: 'Hall of Fame Legend',
   image: 'https://picsum.photos/seed/u4/200/200',
   isHallOfFame: true,
   isTopSupporter: true,
   isEndorsed: true,
   following: 124,
   followers: '3.1k',
   likesReceived: '1.2k',
   bio: 'Finding balance and exploring the gut-brain connection. Passionate about holistic health and pediatric wellness.',
   coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80',
   phone: '+1 (555) 987-6543',
   studyLevel: 'Bachelor’s Degree',
   skills: ['Mindfulness', 'Breathwork', 'Yoga', 'Biohacking']
};

interface Props {
   navigate: (s: AppScreen, e?: Expert, q?: string, r?: Resource, c?: Circle, stories?: any[], index?: number, member?: Member) => void;
   goBack: () => void;
   handleLogout: () => void;
   member: Member | null;
   language: 'en' | 'ar' | 'fr';
   isDarkMode: boolean;
   toggleDarkMode: () => void;
}

const UserProfile: React.FC<Props> = ({ navigate, goBack, handleLogout, member, language, isDarkMode, toggleDarkMode }) => {
   const [activeTab, setActiveTab] = useState<'Journey' | 'Board' | 'Vault' | 'Settings'>('Journey');
   const [isEditMode, setIsEditMode] = useState(false);
   const [saveError, setSaveError] = useState('');
   const [showLikeCelebration, setShowLikeCelebration] = useState(false);
   const [showLogoutModal, setShowLogoutModal] = useState(false);
   const [showToast, setShowToast] = useState(false);
   const scrollContainerRef = useRef<HTMLDivElement>(null);

   const [reflections, setReflections] = useState<any[]>([]);

   useEffect(() => {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(
         collection(db, 'reflections'),
         where('userId', '==', user.uid),
         orderBy('timestamp', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
         const fetched: any[] = [];
         snapshot.forEach(doc => {
            fetched.push({ id: doc.id, ...doc.data() });
         });
         setReflections(fetched);
      });
      return () => unsubscribe();
   }, []);

   // Form State for consolidated settings
   const [formData, setFormData] = useState({
      name: '',
      phone: '',
      bio: '',
      studyLevel: 'Bachelor’s Degree',
      skills: [] as string[],
      age: '',
      location: '',
      gender: '',
      occupation: '',
      specialties: [] as string[],
      verificationStatus: 'unverified' as 'unverified' | 'pending' | 'verified',
      credentials: '',
   });

   const [newSkill, setNewSkill] = useState('');
   const [isSaving, setIsSaving] = useState(false);

   // Fetch full profile data
   useEffect(() => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, 'profiles', user.uid);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
         if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
               name: data.first_name ? `${data.first_name} ${data.family_name || ''}` : (member?.name || ''),
               phone: data.phone || '',
               bio: data.bio || '',
               studyLevel: data.studyLevel || 'Bachelor’s Degree',
               skills: data.skills || [],
               age: data.age || '',
               location: data.location || '',
               gender: data.gender || '',
               occupation: data.occupation || '',
               specialties: data.specialties || [],
               verificationStatus: (data.verificationStatus as 'unverified' | 'pending' | 'verified') || 'unverified',
               credentials: data.credentials || '',
            });
         }
      });

      return () => unsubscribe();
   }, [member]);

   const t = language === 'ar' ? {
      edit: 'الإعدادات',
      logout: 'خروج',
      logoutConfirm: 'هل أنت متأكد من تسجيل الخروج؟',
      logoutDesc: 'سيتم إنهاء جلستك الحالية وحماية بياناتك.',
      cancel: 'إلغاء',
      following: 'يتابع',
      followers: 'متابعون',
      likes: 'إعجابات',
      inspiring: '❤️ ملهم حقاً',
      bio: 'الفلسفة والسيرة الذاتية',
      edu: 'التعليم',
      contact: 'الاتصال',
      skills: 'المهارات والتركيز',
      securityTitle: 'مركز سلامة الملف الشخصي',
      securityDesc: 'إدارة القياسات الحيوية، 2FA، وإعدادات رؤية البيانات السريرية.',
      securityStatus: 'الأمان: المستوى 4 نشط',
      manageSec: 'إدارة خيارات الأمان',
      tabJourney: 'الخط الزمني',
      tabBoard: 'المساهمات',
      tabVault: 'الخزنة',
      tabSettings: 'الإعدادات',
      identityTitle: 'الهوية العالمية للحساب',
      identitySub: 'مرتبط بنجاح التسجيل',
      passTitle: 'بطاقة رحلة Urkio',
      passDesc: 'تربط هذه الهوية الآمنة مساهماتك ومراجعات الخبراء ومشاركاتك الدائرية.',
      qr: 'باركود الهوية',
      download: 'تحميل البطاقة',
      protocol: 'البروتوكول نشط • مؤمن بواسطة Clinical Bridge™',
      endorsed: 'عضو معتمد',
      hallOfFame: 'قاعة المشاهير',
      topSupporter: 'داعم متميز',
      saveChanges: 'حفظ التغييرات',
      personalInfo: 'المعلومات الشخصية',
      addSkill: 'إضافة مهارة',
      themeTitle: 'بروتوكول السمة',
      themeDesc: 'اختر بين الوضع الفاتح أو المظلم الهادئ.'
   } : language === 'fr' ? {
      edit: 'Paramètres',
      logout: 'Déconnexion',
      logoutConfirm: 'Terminer la session ?',
      logoutDesc: 'Cela mettra fin à votre session en toute sécurité et verrouillera vos données de coffre-fort.',
      cancel: 'Annuler',
      following: 'Abonnements',
      followers: 'Abonnés',
      likes: 'J\'aimes',
      inspiring: '❤️ Vraiment inspirant',
      bio: 'Philosophie & Bio',
      edu: 'Éducation',
      contact: 'Contact',
      skills: 'Compétences & Focus',
      securityTitle: 'Centre d\'intégrité du profil',
      securityDesc: 'Gérez la biométrie, la 2FA et les paramètres de visibilité des données cliniques.',
      securityStatus: 'Sécurité : Niveau 4 actif',
      manageSec: 'Gérer les options de sécurité',
      tabJourney: 'Parcours',
      tabBoard: 'Tableau',
      tabVault: 'Coffre-fort',
      tabSettings: 'Paramètres',
      identityTitle: 'Identité globale du compte',
      identitySub: 'lié lors de l\'inscription',
      passTitle: 'Urkio Journey Pass',
      passDesc: 'Cet identifiant sécurisé relie vos contributions, avis d\'experts et engagements.',
      qr: 'QR d\'identité',
      download: 'Télécharger le Pass',
      protocol: 'Protocole actif • Sécurisé par Clinical Bridge™',
      endorsed: 'Membre Endossé',
      hallOfFame: 'Temple de la Renommée',
      topSupporter: 'Meilleur Supporter',
      saveChanges: 'Enregistrer',
      personalInfo: 'Informations personnelles',
      addSkill: 'Ajouter',
      themeTitle: 'Protocole de thème',
      themeDesc: 'Basculez entre le mode clair et le mode sombre serein.'
   } : {
      edit: 'Settings',
      logout: 'Logout',
      logoutConfirm: 'Terminate Session?',
      logoutDesc: 'This will securely end your current session and lock your vault data.',
      cancel: 'Cancel',
      following: 'Following',
      followers: 'Followers',
      likes: 'Likes Rec.',
      inspiring: '❤️ Truly Inspiring',
      bio: 'Philosophy & Bio',
      edu: 'Education',
      contact: 'Contact',
      skills: 'Skills & Focus',
      securityTitle: 'Profile Integrity Hub',
      securityDesc: 'Manage biometrics, 2FA, and clinical data visibility settings.',
      securityStatus: 'Security: Tier 4 Active',
      manageSec: 'Manage Security Options',
      tabJourney: 'Timeline',
      tabBoard: 'Board',
      tabVault: 'Vault',
      tabSettings: 'Settings',
      identityTitle: 'Account Global Identity',
      identitySub: 'linked upon registration success',
      passTitle: 'Urkio Journey Pass',
      passDesc: 'This secure ID links your contributions, expert reviews, and circular engagement.',
      qr: 'Identity QR',
      download: 'Download Pass',
      protocol: 'Protocol Active • Secured by Clinical Bridge™',
      endorsed: 'Endorsed Member',
      hallOfFame: 'Hall of Fame',
      topSupporter: 'Top Supporter',
      saveChanges: 'Save Changes',
      personalInfo: 'Personal Information',
      addSkill: 'Add Skill',
      themeTitle: 'Theme Protocol',
      themeDesc: 'Switch between Light and serene Dark moods.'
   };

   const currentUser = member || DEFAULT_MEMBER;
   const isOwnProfile = !member || member.id === 'u4';
   const milestones = JOURNEY_MILESTONES(language);
   const userPosts = INITIAL_USER_POSTS(language);

   const handleLikeStatsClick = () => {
      setShowLikeCelebration(true);
      setActiveTab('Board');
      setTimeout(() => setShowLikeCelebration(false), 2000);
   };

   const onLogoutConfirm = async () => {
      setShowLogoutModal(false);
      handleLogout();
   };

   const handleSaveSettings = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setIsSaving(true);
      setSaveError('');
      try {
         const nameParts = formData.name.trim().split(' ');
         const firstName = nameParts[0] || '';
         const familyName = nameParts.slice(1).join(' ') || '';

         await setDoc(doc(db, 'profiles', user.uid), {
            first_name: firstName,
            family_name: familyName,
            phone: formData.phone,
            bio: formData.bio,
            studyLevel: formData.studyLevel,
            skills: formData.skills,
            age: formData.age,
            location: formData.location,
            gender: formData.gender,
            occupation: formData.occupation,
            specialties: formData.specialties,
            credentials: formData.credentials,
            ...(formData.verificationStatus === 'unverified' && formData.credentials
               ? { verificationStatus: 'pending' }
               : {}),
            updatedAt: new Date().toISOString(),
         }, { merge: true });

         setIsEditMode(false);
         setShowToast(true);
         setTimeout(() => setShowToast(false), 3000);
         window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err: any) {
         console.error('Error saving profile:', err);
         setSaveError(err?.message || 'Failed to save. Please try again.');
      } finally {
         setIsSaving(false);
      }
   };

   const addSpecialty = (val: string) => {
      const trimmed = val.trim();
      if (trimmed && !formData.specialties.includes(trimmed)) {
         setFormData(prev => ({ ...prev, specialties: [...prev.specialties, trimmed] }));
      }
   };

   const removeSpecialty = (s: string) => {
      setFormData(prev => ({ ...prev, specialties: prev.specialties.filter(x => x !== s) }));
   };

   const totalLikes = isOwnProfile ? userPosts.reduce((acc, p) => acc + (p.likes || 0), 0) : currentUser.likesReceived;

   return (
      <div className="relative flex h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl font-sans overflow-hidden transition-colors duration-500">
         <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar pb-32">
            {/* Profile Backdrop & Header */}
            <header className="relative min-h-[520px] overflow-hidden shrink-0">
               <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-24 -left-20 size-96 bg-primary/20 blur-[100px] animate-aurora rounded-full"></div>
                  <div className="absolute top-1/2 -right-20 size-80 bg-urkio-magenta/15 blur-[100px] animate-aurora rounded-full" style={{ animationDelay: '-5s' }}></div>
                  <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 size-64 bg-emerald-500/10 blur-[80px] animate-aurora rounded-full" style={{ animationDelay: '-10s' }}></div>
               </div>

               <img src={currentUser.coverImage || "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80"} className="absolute inset-0 size-full object-cover opacity-40 grayscale-[0.5]" alt="Cover" />
               <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-slate-50 dark:to-background-dark"></div>

               <div className="absolute top-8 left-6 right-6 flex items-center justify-between z-10">
                  <button
                     onClick={() => navigate(AppScreen.USER_DASHBOARD)}
                     className="size-11 flex items-center justify-center rounded-2xl crystal-glass border border-white/20 text-slate-900 dark:text-white active:scale-90 transition-all shadow-lg hover:bg-white/40 dark:hover:bg-white/10"
                  >
                     <span className={`material-symbols-outlined ${language === 'ar' ? 'rotate-180' : ''}`}>arrow_back_ios_new</span>
                  </button>
                  <div className="flex gap-2">
                     {isOwnProfile && (
                        <button
                           onClick={() => setShowLogoutModal(true)}
                           className="size-11 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center active:scale-90 transition-all shadow-lg hover:bg-red-500/20"
                        >
                           <span className="material-symbols-outlined">power_settings_new</span>
                        </button>
                     )}
                  </div>
               </div>

               <div className="absolute bottom-0 left-0 right-0 px-8 pb-10 flex flex-col items-center">
                  <div className="relative group mb-8">
                     <Avatar
                        src={currentUser.image}
                        size="xl"
                        isHallOfFame={currentUser.isHallOfFame}
                        isTopSupporter={currentUser.isTopSupporter}
                        isEndorsed={currentUser.isEndorsed}
                     />
                     {isOwnProfile && isEditMode && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer group-hover:opacity-100 opacity-0 transition-opacity">
                           <span className="material-symbols-outlined text-white">photo_camera</span>
                        </div>
                     )}
                  </div>

                  <div className="flex flex-col items-center gap-3 mb-10 text-center">
                     <div className="flex items-center gap-4">
                        {isEditMode ? (
                           <input
                              value={formData.name}
                              onChange={e => setFormData({ ...formData, name: e.target.value })}
                              className="text-4xl font-black font-display tracking-tight text-center bg-white/10 border-b-2 border-primary/50 text-slate-900 dark:text-white outline-none w-full max-w-[280px]"
                              placeholder="Your Name"
                           />
                        ) : (
                           <h2 className="text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white">{formData.name || currentUser.name}</h2>
                        )}
                        <div className="flex gap-2">
                           {currentUser.isTopSupporter && (
                              <div className="size-10 urkio-gradient rounded-2xl flex items-center justify-center shadow-lg border border-white/20" title={t.topSupporter}>
                                 <span className="material-symbols-outlined text-white text-xl fill-1">favorite</span>
                              </div>
                           )}
                           {currentUser.isHallOfFame && (
                              <div className="size-10 gold-gradient rounded-2xl flex items-center justify-center shadow-lg border border-white/20" title={t.hallOfFame}>
                                 <span className="material-symbols-outlined text-slate-900 text-xl fill-1">workspace_premium</span>
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="flex items-center gap-2">
                        {isEditMode ? (
                           <input
                              value={formData.occupation}
                              onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                              className="text-[10px] font-black uppercase tracking-[0.3em] text-center bg-primary/10 border-b border-primary/30 text-primary outline-none px-4 py-1.5 rounded-full"
                              placeholder="Your Occupation"
                           />
                        ) : (
                           (formData.occupation || currentUser.isEndorsed) && (
                              <div className="px-5 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">
                                 {formData.occupation || t.endorsed}
                              </div>
                           )
                        )}
                     </div>
                  </div>

                  <div className="w-full flex items-center justify-center gap-10 py-8 crystal-glass rounded-6xl border border-white/20 shadow-3xl">
                     <button
                        onClick={() => navigate(AppScreen.CONNECTIONS)}
                        className="flex flex-col items-center group active:scale-95 transition-all"
                     >
                        <p className="text-xl font-black text-slate-900 dark:text-white leading-none group-hover:text-primary transition-colors">{currentUser.following}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-3">{t.following}</p>
                     </button>
                     <div className="w-[1px] h-10 bg-slate-300 dark:bg-white/10"></div>
                     <button
                        onClick={() => navigate(AppScreen.CONNECTIONS)}
                        className="flex flex-col items-center group active:scale-95 transition-all"
                     >
                        <p className="text-xl font-black text-slate-900 dark:text-white leading-none group-hover:text-primary transition-colors">{currentUser.followers}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-3">{t.followers}</p>
                     </button>
                     <div className="w-[1px] h-10 bg-slate-300 dark:bg-white/10"></div>
                     <button
                        onClick={handleLikeStatsClick}
                        className="flex flex-col items-center group active:scale-95 transition-all relative"
                     >
                        <p className="text-xl font-black text-primary leading-none">
                           {totalLikes.toLocaleString()}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-3">{t.likes}</p>

                        {showLikeCelebration && (
                           <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-2xl animate-bounce whitespace-nowrap z-50">
                              {t.inspiring}
                           </div>
                        )}
                     </button>
                  </div>
               </div>
            </header>

            <main className="flex-1 p-8 space-y-12">
               {/* Tab System - Glass Surface */}
               <section className="space-y-10">
                  <div className="flex p-2 crystal-glass rounded-4xl shadow-lg border border-white/20 overflow-x-auto no-scrollbar">
                     {(isOwnProfile ? ['Journey', 'Board', 'Vault', 'Settings'] : ['Journey', 'Board']).map((tab) => (
                        <button
                           key={tab}
                           onClick={() => setActiveTab(tab as any)}
                           className={`flex-1 min-w-[80px] py-4 text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg' : 'text-slate-500 dark:text-slate-400'
                              }`}
                        >
                           {tab === 'Journey' ? t.tabJourney : tab === 'Board' ? t.tabBoard : tab === 'Vault' ? t.tabVault : t.tabSettings}
                        </button>
                     ))}
                  </div>

                  {activeTab === 'Journey' ? (
                     <>
                        {/* Verification Status Badge */}
                        <div className="flex items-center gap-3 px-2">
                           {formData.verificationStatus === 'verified' && (
                              <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                                 <span className="material-symbols-outlined text-emerald-500 text-base">verified</span>
                                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Verified Member</span>
                              </div>
                           )}
                           {formData.verificationStatus === 'pending' && (
                              <div className="flex items-center gap-2 px-5 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
                                 <span className="material-symbols-outlined text-amber-500 text-base">pending</span>
                                 <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Verification Pending</span>
                              </div>
                           )}
                           {formData.verificationStatus === 'unverified' && (
                              <div className="flex items-center gap-2 px-5 py-2 bg-slate-200/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full">
                                 <span className="material-symbols-outlined text-slate-400 text-base">shield</span>
                                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Not Yet Verified</span>
                              </div>
                           )}
                        </div>

                        <section className="crystal-glass p-10 rounded-6xl border border-white/20 shadow-2xl space-y-10 group/card">
                           {/* Visual Progress Stats */}
                           <div className="grid grid-cols-2 gap-8 mb-4">
                              <div className="space-y-4">
                                 <div className="flex justify-between items-center px-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Self-Discovery</span>
                                    <span className="text-[10px] font-black text-primary">82%</span>
                                 </div>
                                 <div className="h-2.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-black/5 dark:border-white/10">
                                    <div className="h-full w-[82%] bg-gradient-to-r from-primary to-urkio-magenta rounded-full animate-in slide-in-from-left duration-1000"></div>
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <div className="flex justify-between items-center px-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Community Impact</span>
                                    <span className="text-[10px] font-black text-emerald-500">65%</span>
                                 </div>
                                 <div className="h-2.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-black/5 dark:border-white/10">
                                    <div className="h-full w-[65%] bg-gradient-to-r from-emerald-400 to-primary rounded-full animate-in slide-in-from-left duration-1000 delay-300"></div>
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-5">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{t.bio}</h3>
                                 </div>
                                 {isOwnProfile && isEditMode && (
                                    <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest animate-pulse">Editing Click-to-Save...</span>
                                 )}
                              </div>
                              {isEditMode ? (
                                 <textarea
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    rows={3}
                                    className="w-full px-8 py-5 bg-slate-100 dark:bg-white/5 border border-primary/30 rounded-4xl focus:ring-4 focus:ring-primary/20 transition-all text-base font-medium dark:text-white resize-none"
                                    placeholder="Your philosophy and personal mission..."
                                 />
                              ) : (
                                 <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                    {formData.bio || (language === 'ar' ? "أبحث عن التوازن وأستكشف أعماق العافية الشمولية." : language === 'fr' ? "Trouver mon rythme et explorer les profondeurs du bien-être holistique." : "Finding my rhythm and exploring the depths of holistic wellness.")}
                                 </p>
                              )}
                           </div>
                           <div className="grid grid-cols-2 gap-10 border-t border-black/5 dark:border-white/10 pt-10">
                              <div className="space-y-3">
                                 <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg">school</span>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.edu}</h4>
                                 </div>
                                 {isEditMode ? (
                                    <select
                                       value={formData.studyLevel}
                                       onChange={e => setFormData({ ...formData, studyLevel: e.target.value })}
                                       className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-2xl text-sm font-black dark:text-white appearance-none py-2 px-4"
                                    >
                                       {STUDY_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                 ) : (
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{formData.studyLevel || "Not Specified"}</p>
                                 )}
                              </div>
                              <div className="space-y-3">
                                 <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg">call</span>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.contact}</h4>
                                 </div>
                                 {isEditMode ? (
                                    <input
                                       value={formData.phone}
                                       onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                       className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-2xl text-sm font-black dark:text-white py-2 px-4"
                                       placeholder="+1..."
                                    />
                                 ) : (
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{formData.phone || "Private"}</p>
                                 )}
                              </div>
                              <div className="space-y-3">
                                 <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Location</h4>
                                 </div>
                                 {isEditMode ? (
                                    <input
                                       value={formData.location}
                                       onChange={e => setFormData({ ...formData, location: e.target.value })}
                                       className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-2xl text-sm font-black dark:text-white py-2 px-4"
                                       placeholder="City, Country"
                                    />
                                 ) : (
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{formData.location || "Earth"}</p>
                                 )}
                              </div>
                              <div className="space-y-3">
                                 <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg">work</span>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Focus Area</h4>
                                 </div>
                                 <p className="text-sm font-black text-slate-900 dark:text-white">{formData.specialties[0] || "Global Citizen"}</p>
                              </div>
                           </div>
                        </section>

                        <div className={`space-y-14 mt-12 ${language === 'ar' ? 'pr-6' : 'pl-6'} relative ${language === 'ar' ? 'before:right-10' : 'before:left-10'} before:absolute before:top-6 before:bottom-6 before:w-[3px] before:bg-gradient-to-b before:from-primary before:via-slate-200 dark:before:via-white/10 before:to-primary/20 before:rounded-full`}>
                           {milestones.map((m) => (
                              <div key={m.id} className={`relative ${language === 'ar' ? 'pr-16' : 'pl-16'} group animate-in slide-in-from-bottom-2 duration-500`}>
                                 <div className={`absolute ${language === 'ar' ? 'right-0' : 'left-0'} top-0 size-12 rounded-2xl bg-white dark:bg-surface-dark border-4 border-slate-100 dark:border-background-dark shadow-2xl flex items-center justify-center z-10 transition-all group-hover:scale-125 group-hover:border-primary/40 ${m.type === 'session' ? 'text-primary' : m.type === 'reflection' ? 'text-urkio-magenta' : 'text-emerald-500'
                                    }`}>
                                    <span className="material-symbols-outlined text-2xl fill-1">{m.icon}</span>
                                 </div>
                                 <div className="flex flex-col gap-2 pt-1">
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{m.title}</h4>
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">{m.date}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </>
                  ) : activeTab === 'Board' ? (
                     <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-8">
                           {(isOwnProfile ? userPosts : []).map(post => (
                              <div key={post.id} className="crystal-glass rounded-6xl border border-white/20 overflow-hidden shadow-2xl transition-all hover:scale-[1.01]">
                                 <div className="p-8 flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                       <Avatar src={post.authorImage} size="md" isHallOfFame={post.isHallOfFame} isTopSupporter={true} isEndorsed={post.isEndorsed} />
                                       <div>
                                          <h4 className="text-lg font-black text-slate-900 dark:text-white leading-none">{post.authorName}</h4>
                                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-2">{post.time}</p>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="px-10 pb-10">
                                    <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 font-medium">{post.content}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  ) : activeTab === 'Vault' ? (
                     <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <section className="crystal-glass p-8 rounded-6xl border border-white/20 shadow-2xl space-y-6">
                           <div className="flex items-center gap-4 border-b border-black/5 dark:border-white/10 pb-6">
                              <span className="material-symbols-outlined text-urkio-magenta text-2xl">lock</span>
                              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">My Private Reflections</h3>
                           </div>

                           {reflections.length === 0 ? (
                              <div className="text-center py-10 opacity-60">
                                 <span className="material-symbols-outlined text-4xl mb-4">mic_none</span>
                                 <p className="text-sm font-medium">No private reflections yet.</p>
                                 <button onClick={() => navigate(AppScreen.HOMII)} className="mt-4 text-xs font-black text-urkio-magenta uppercase tracking-widest">Open Homii</button>
                              </div>
                           ) : (
                              <div className="space-y-6">
                                 {reflections.map(ref => (
                                    <div key={ref.id} className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-slate-100 dark:border-white/10 flex flex-col gap-4">
                                       <div className="flex justify-between items-center">
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                             {ref.timestamp ? new Date(ref.timestamp.toDate()).toLocaleDateString() : 'Just now'}
                                          </p>
                                          <span className="text-[10px] font-black text-urkio-magenta uppercase tracking-widest px-3 py-1 bg-urkio-magenta/10 rounded-full">Private</span>
                                       </div>
                                       {ref.audio && (
                                          <audio src={ref.audio} controls className="w-full h-12 rounded-full grayscale hue-rotate-[280deg]" />
                                       )}
                                    </div>
                                 ))}
                              </div>
                           )}
                        </section>
                     </div>
                  ) : (
                     <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">

                        {/* Edit Mode Toggle Banner */}
                        <div className={`flex items-center justify-between p-6 rounded-4xl border transition-all ${isEditMode ? 'bg-primary/10 border-primary/30' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10'}`}>
                           <div>
                              <p className="text-sm font-black text-slate-900 dark:text-white">{isEditMode ? '✏️ Editing Profile' : '👁 View Mode'}</p>
                              <p className="text-[10px] text-slate-500 mt-1">{isEditMode ? 'Changes save to Firebase on submit' : 'Toggle to edit your profile'}</p>
                           </div>
                           <button
                              onClick={() => setIsEditMode(e => !e)}
                              className={`h-10 px-6 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-90 ${isEditMode ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white dark:bg-white/10 text-slate-700 dark:text-white border border-slate-200 dark:border-white/10'}`}
                           >
                              {isEditMode ? 'Cancel' : 'Edit'}
                           </button>
                        </div>

                        {/* Theme Selection - Surface Glass */}
                        <section className="crystal-glass p-10 rounded-6xl border border-white/20 shadow-2xl space-y-10">
                           <div className="flex items-center gap-4 border-b border-black/5 dark:border-white/10 pb-6">
                              <span className="material-symbols-outlined text-primary text-2xl">{isDarkMode ? 'dark_mode' : 'light_mode'}</span>
                              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">{t.themeTitle}</h3>
                           </div>

                           <div className="flex items-center justify-between p-6 bg-slate-100 dark:bg-white/5 rounded-4xl border border-transparent hover:border-primary/30 transition-all cursor-pointer" onClick={toggleDarkMode}>
                              <div className="flex-1">
                                 <p className="text-lg font-black text-slate-900 dark:text-white mb-2">Dark Mood</p>
                                 <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{t.themeDesc}</p>
                              </div>
                              <div
                                 className={`w-16 h-8 rounded-full p-1.5 transition-all flex items-center ${isDarkMode ? 'bg-primary justify-end' : 'bg-slate-300 dark:bg-slate-800 justify-start'}`}
                              >
                                 <div className="size-5 bg-white rounded-full shadow-2xl"></div>
                              </div>
                           </div>
                        </section>

                        {/* Personal Info Group */}
                        <section className={`crystal-glass p-10 rounded-6xl border shadow-2xl space-y-10 transition-all ${isEditMode ? 'border-primary/30' : 'border-white/20'}`}>
                           <div className="flex items-center gap-4 border-b border-black/5 dark:border-white/10 pb-6">
                              <span className="material-symbols-outlined text-primary text-2xl">person</span>
                              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">{t.personalInfo}</h3>
                           </div>

                           <div className="space-y-8">
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 ml-2">Full Name</label>
                                 <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    disabled={!isEditMode}
                                    className="w-full h-16 px-8 bg-slate-100 dark:bg-white/5 border-none rounded-3xl focus:ring-4 focus:ring-primary/20 transition-all text-base font-black dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                                 />
                              </div>

                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 ml-2">Bio / Philosophy</label>
                                 <textarea
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    disabled={!isEditMode}
                                    rows={3}
                                    className="w-full px-8 py-5 bg-slate-100 dark:bg-white/5 border-none rounded-3xl focus:ring-4 focus:ring-primary/20 transition-all text-base font-medium dark:text-white resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                                    placeholder="Your philosophy and personal mission..."
                                 />
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 ml-2">Age</label>
                                    <input
                                       type="number"
                                       value={formData.age}
                                       onChange={e => setFormData({ ...formData, age: e.target.value })}
                                       disabled={!isEditMode}
                                       className="w-full h-16 px-8 bg-slate-100 dark:bg-white/5 border-none rounded-3xl focus:ring-4 focus:ring-primary/20 transition-all text-base font-black dark:text-white disabled:opacity-60"
                                    />
                                 </div>
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 ml-2">Gender</label>
                                    <select
                                       value={formData.gender}
                                       onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                       disabled={!isEditMode}
                                       className="w-full h-16 px-8 bg-slate-100 dark:bg-white/5 border-none rounded-3xl focus:ring-4 focus:ring-primary/20 transition-all text-base font-black dark:text-white appearance-none disabled:opacity-60"
                                    >
                                       <option value="Male">Male</option>
                                       <option value="Female">Female</option>
                                       <option value="Non-binary">Non-binary</option>
                                       <option value="Other">Other</option>
                                       <option value="N/A">N/A</option>
                                    </select>
                                 </div>
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 ml-2">Location</label>
                                 <input
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    disabled={!isEditMode}
                                    className="w-full h-16 px-8 bg-slate-100 dark:bg-white/5 border-none rounded-3xl focus:ring-4 focus:ring-primary/20 transition-all text-base font-black dark:text-white disabled:opacity-60"
                                 />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 ml-2">Daily Occupation</label>
                                 <input
                                    value={formData.occupation}
                                    onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                                    disabled={!isEditMode}
                                    className="w-full h-16 px-8 bg-slate-100 dark:bg-white/5 border-none rounded-3xl focus:ring-4 focus:ring-primary/20 transition-all text-base font-black dark:text-white disabled:opacity-60"
                                 />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 ml-2">Contact Phone</label>
                                 <input
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={!isEditMode}
                                    className="w-full h-16 px-8 bg-slate-100 dark:bg-white/5 border-none rounded-3xl focus:ring-4 focus:ring-primary/20 transition-all text-base font-black dark:text-white disabled:opacity-60"
                                    placeholder="+1..."
                                 />
                              </div>
                           </div>
                        </section>

                        {/* Specialties Section */}
                        <section className={`crystal-glass p-10 rounded-6xl border shadow-2xl space-y-8 transition-all ${isEditMode ? 'border-primary/30' : 'border-white/20'}`}>
                           <div className="flex items-center gap-4 border-b border-black/5 dark:border-white/10 pb-6">
                              <span className="material-symbols-outlined text-primary text-2xl">stars</span>
                              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Specialties</h3>
                           </div>
                           <div className="flex flex-wrap gap-3 min-h-[40px]">
                              {formData.specialties.map(s => (
                                 <div key={s} className="flex items-center gap-2 px-5 py-2 bg-primary/10 border border-primary/20 rounded-full">
                                    <span className="text-[11px] font-black text-primary">{s}</span>
                                    {isEditMode && (
                                       <button onClick={() => removeSpecialty(s)} className="text-primary/60 hover:text-red-500 transition-colors ml-1">
                                          <span className="material-symbols-outlined text-sm">close</span>
                                       </button>
                                    )}
                                 </div>
                              ))}
                              {formData.specialties.length === 0 && !isEditMode && (
                                 <p className="text-xs text-slate-400 italic">No specialties added yet.</p>
                              )}
                           </div>
                           {isEditMode && (
                              <div className="flex gap-3">
                                 <input
                                    id="specialty-input"
                                    placeholder="e.g. Mindfulness, Breathwork..."
                                    className="flex-1 h-14 px-6 bg-slate-100 dark:bg-white/5 border-none rounded-3xl focus:ring-4 focus:ring-primary/20 text-sm font-medium dark:text-white"
                                    onKeyDown={e => {
                                       if (e.key === 'Enter') {
                                          addSpecialty((e.target as HTMLInputElement).value);
                                          (e.target as HTMLInputElement).value = '';
                                       }
                                    }}
                                 />
                                 <button
                                    onClick={() => {
                                       const input = document.getElementById('specialty-input') as HTMLInputElement;
                                       addSpecialty(input.value);
                                       input.value = '';
                                    }}
                                    className="h-14 px-6 bg-primary text-white rounded-3xl font-black text-[10px] uppercase tracking-widest active:scale-90 transition-all"
                                 >Add</button>
                              </div>
                           )}
                        </section>

                        {/* Credentials & Verification Section */}
                        <section className={`crystal-glass p-10 rounded-6xl border shadow-2xl space-y-8 transition-all ${isEditMode ? 'border-primary/30' : 'border-white/20'}`}>
                           <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-6">
                              <div className="flex items-center gap-4">
                                 <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
                                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Verification Status</h3>
                              </div>
                              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${formData.verificationStatus === 'verified'
                                 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                                 : formData.verificationStatus === 'pending'
                                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                                    : 'bg-slate-200 dark:bg-white/10 text-slate-500 border border-slate-300 dark:border-white/10'
                                 }`}>
                                 {formData.verificationStatus === 'verified' ? '✓ Verified' : formData.verificationStatus === 'pending' ? '⏳ Pending Review' : 'Not Verified'}
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 ml-2">Professional Credentials</label>
                              <textarea
                                 value={formData.credentials}
                                 onChange={e => setFormData({ ...formData, credentials: e.target.value })}
                                 disabled={!isEditMode || formData.verificationStatus === 'verified'}
                                 rows={3}
                                 placeholder="e.g. Certified Life Coach (ICF), MSc Psychology..."
                                 className="w-full px-8 py-5 bg-slate-100 dark:bg-white/5 border-none rounded-3xl focus:ring-4 focus:ring-primary/20 transition-all text-sm font-medium dark:text-white resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                              />
                              {isEditMode && formData.verificationStatus === 'unverified' && (
                                 <p className="text-[10px] text-slate-400 ml-2">💡 Submitting credentials will trigger a verification review by Urkio.</p>
                              )}
                              {formData.verificationStatus === 'verified' && (
                                 <p className="text-[10px] text-emerald-500 ml-2">✓ Your credentials have been verified by Urkio.</p>
                              )}
                           </div>
                        </section>

                        {/* Save Button — only visible in edit mode */}
                        {isEditMode && (
                           <div className="pt-6 space-y-4">
                              {saveError && (
                                 <div className="flex items-center gap-3 p-5 bg-red-500/10 border border-red-500/20 rounded-3xl">
                                    <span className="material-symbols-outlined text-red-500">error</span>
                                    <p className="text-xs font-medium text-red-500">{saveError}</p>
                                 </div>
                              )}
                              <button
                                 onClick={handleSaveSettings}
                                 disabled={isSaving}
                                 className="w-full h-20 urkio-gradient rounded-6xl text-white font-black text-sm uppercase tracking-widest shadow-3xl shadow-primary/40 flex items-center justify-center gap-4 active:scale-[0.95] transition-all crystal-btn disabled:opacity-60"
                              >
                                 {isSaving ? (
                                    <>
                                       <div className="size-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                       <span>Saving to Firebase...</span>
                                    </>
                                 ) : (
                                    <>
                                       {t.saveChanges}
                                       <span className="material-symbols-outlined text-2xl">cloud_sync</span>
                                    </>
                                 )}
                              </button>
                           </div>
                        )}
                     </div>
                  )}
               </section>
            </main>
         </div>

         {/* Floating Action Button (FAB) */}
         {isOwnProfile && (
            <div className="fixed bottom-10 right-10 z-50 animate-in slide-in-from-right-10 duration-700">
               <button
                  onClick={isEditMode ? handleSaveSettings : () => {
                     setActiveTab('Settings');
                     setIsEditMode(true);
                     window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className={`group relative flex items-center justify-center size-20 rounded-[2.5rem] shadow-3xl transition-all duration-500 hover:scale-110 active:scale-90 ${isEditMode ? 'bg-emerald-500 glow-emerald shadow-emerald-500/40' : 'urkio-gradient glow-primary shadow-primary/40'
                     }`}
               >
                  <div className="absolute inset-0 bg-white/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="material-symbols-outlined text-white text-3xl font-bold fill-1 transition-transform group-hover:rotate-12">
                     {isSaving ? 'sync' : (isEditMode ? 'check' : 'edit_square')}
                  </span>
                  {isSaving && (
                     <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}

                  {/* Tooltip */}
                  <div className="absolute right-full mr-6 py-3 px-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl translate-x-4 group-hover:translate-x-0 whitespace-nowrap">
                     {isEditMode ? 'Confirm Ritual' : 'Modify Essence'}
                  </div>
               </button>
            </div>
         )}

         {/* Logout Confirmation Modal */}
         {showLogoutModal && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
               <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={() => setShowLogoutModal(false)}></div>
               <div className="relative w-full max-w-xs crystal-glass rounded-[3rem] p-10 border border-white/20 shadow-[0_40px_100px_rgba(0,0,0,0.5)] animate-in zoom-in duration-300">
                  <div className="flex flex-col items-center text-center">
                     <div className="size-20 rounded-4xl bg-red-500/10 flex items-center justify-center text-red-500 mb-8 shadow-inner border border-red-500/20 animate-breathe">
                        <span className="material-symbols-outlined text-5xl">power_settings_new</span>
                     </div>
                     <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white mb-4 leading-tight">{t.logoutConfirm}</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">{t.logoutDesc}</p>

                     <div className="w-full flex flex-col gap-3">
                        <button
                           onClick={onLogoutConfirm}
                           className="w-full h-16 bg-red-500 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-red-500/30 active:scale-95 transition-all"
                        >
                           {t.logout}
                        </button>
                        <button
                           onClick={() => setShowLogoutModal(false)}
                           className="w-full h-14 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-3xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                        >
                           {t.cancel}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Success Toast */}
         {showToast && (
            <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[1100] animate-in slide-in-from-bottom-4 duration-500">
               <div className="bg-emerald-500 text-white px-8 py-4 rounded-3xl shadow-2xl shadow-emerald-500/30 flex items-center gap-3 border border-white/20 backdrop-blur-md">
                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">Protocol Updated Successfully</p>
               </div>
            </div>
         )}

         <BottomNav role="USER" currentScreen={AppScreen.USER_PROFILE} navigate={navigate} language={language} />
      </div>
   );
};

export default UserProfile;
