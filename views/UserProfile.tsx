
import React, { useState, useRef, useEffect } from 'react';
import { AppScreen, Circle, Resource, Expert, Post, Member } from '../types';
import { BottomNav } from '../components/Navigation';
import { Avatar } from '../components/Avatar';
import { auth, db } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';

interface Milestone {
   id: string;
   title: string;
   date: string;
   type: 'session' | 'reflection' | 'milestone';
   icon: string;
}

const JOURNEY_MILESTONES: (lang: string) => Milestone[] = (lang) => [
   { id: 'm1', title: lang === 'ar' ? 'استشارة مع د. آريس' : 'Consultation with Dr. Aris', date: 'Oct 24, 2024', type: 'session', icon: 'videocam' },
   { id: 'm2', title: lang === 'ar' ? 'تحقيق تتابع 7 أيام' : 'Achieved 7-Day Streak', date: 'Oct 20, 2024', type: 'milestone', icon: 'auto_awesome' },
   { id: 'm3', title: lang === 'ar' ? 'تسجيل تأمل عميق' : 'Vocalized Deep Reflection', date: 'Oct 18, 2024', type: 'reflection', icon: 'mic' },
];

const INITIAL_USER_POSTS: (lang: string) => Post[] = (lang) => [
   {
      id: 'up1',
      authorName: 'Alex Johnson',
      authorType: lang === 'ar' ? 'أسطورة قاعة المشاهير' : 'Hall of Fame Legend',
      authorImage: 'https://picsum.photos/seed/u4/100/100',
      content: lang === 'ar' ? "أفكر في كيفية تأثير التغييرات الصغيرة في صحة الأمعاء على تحسينات هائلة في الوضوح العقلي. كان هذا الأسبوع ملهماً جداً! 🌿" : "Reflecting on how small changes in gut health lead to massive improvements in mental clarity. This week has been an eye-opener! 🌿",
      time: lang === 'ar' ? 'منذ ساعتين' : '2h ago',
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
   member: Member | null;
   language: 'en' | 'ar';
   isDarkMode: boolean;
   toggleDarkMode: () => void;
}

const UserProfile: React.FC<Props> = ({ navigate, member, language, isDarkMode, toggleDarkMode }) => {
   const [activeTab, setActiveTab] = useState<'Journey' | 'Board' | 'Vault' | 'Settings'>('Journey');
   const [showLikeCelebration, setShowLikeCelebration] = useState(false);
   const [showLogoutModal, setShowLogoutModal] = useState(false);
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
      occupation: ''
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
               occupation: data.occupation || ''
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

   const handleLogout = async () => {
      try {
         await signOut(auth);
         setShowLogoutModal(false);
         navigate(AppScreen.LANDING);
      } catch (error) {
         console.error("Logout error:", error);
      }
   };

   const handleSaveSettings = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setIsSaving(true);
      try {
         // Split name back into first and family if possible
         const nameParts = formData.name.split(' ');
         const firstName = nameParts[0] || '';
         const familyName = nameParts.slice(1).join(' ') || '';

         await updateDoc(doc(db, 'profiles', user.uid), {
            first_name: firstName,
            family_name: familyName,
            phone: formData.phone,
            bio: formData.bio,
            studyLevel: formData.studyLevel,
            skills: formData.skills,
            age: formData.age,
            location: formData.location,
            gender: formData.gender,
            occupation: formData.occupation
         });

         setActiveTab('Journey');
         window.scrollTo(0, 0);
      } catch (err) {
         console.error("Error saving profile settings:", err);
      } finally {
         setIsSaving(false);
      }
   };

   const totalLikes = isOwnProfile ? userPosts.reduce((acc, p) => acc + (p.likes || 0), 0) : currentUser.likesReceived;

   return (
      <div className="relative flex h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl font-sans overflow-hidden transition-colors duration-500">
         <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar pb-32">
            {/* Profile Backdrop & Header */}
            <header className="relative min-h-[520px] overflow-hidden shrink-0">
               <div className="absolute inset-0 gold-gradient opacity-20 blur-3xl -translate-y-1/2 scale-150"></div>
               <img src={currentUser.coverImage || "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80"} className="absolute inset-0 size-full object-cover opacity-60" alt="Cover" />
               <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-slate-50 dark:to-background-dark"></div>

               <div className="absolute top-8 left-6 right-6 flex items-center justify-between z-10">
                  <button
                     onClick={() => navigate(AppScreen.USER_DASHBOARD)}
                     className="size-11 flex items-center justify-center rounded-2xl crystal-glass border border-white/20 text-slate-900 dark:text-white active:scale-90 transition-all shadow-lg"
                  >
                     <span className={`material-symbols-outlined ${language === 'ar' ? 'rotate-180' : ''}`}>arrow_back_ios_new</span>
                  </button>
                  <div className="flex gap-2">
                     {isOwnProfile && (
                        <>
                           <button
                              onClick={() => setActiveTab('Settings')}
                              className={`h-11 px-5 rounded-2xl border border-white/20 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest active:scale-90 transition-all shadow-lg ${activeTab === 'Settings' ? 'bg-primary text-white' : 'crystal-glass dark:bg-black/40 text-slate-900 dark:text-white'}`}
                           >
                              <span className="material-symbols-outlined text-sm">settings</span>
                              {t.edit}
                           </button>
                           <button
                              onClick={() => setShowLogoutModal(true)}
                              className="size-11 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center active:scale-90 transition-all shadow-lg"
                           >
                              <span className="material-symbols-outlined">power_settings_new</span>
                           </button>
                        </>
                     )}
                  </div>
               </div>

               <div className="absolute bottom-4 left-0 right-0 px-8 pb-4 flex flex-col items-center">
                  <Avatar
                     src={currentUser.image}
                     size="xl"
                     isHallOfFame={currentUser.isHallOfFame}
                     isTopSupporter={currentUser.isTopSupporter}
                     isEndorsed={currentUser.isEndorsed}
                     className="mb-8"
                  />

                  <div className="flex flex-col items-center gap-3 mb-8 text-center">
                     <div className="flex items-center gap-4">
                        <h2 className="text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white">{currentUser.name}</h2>
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
                        {currentUser.isEndorsed && (
                           <div className="px-5 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">
                              {t.endorsed}
                           </div>
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
                        <section className="crystal-glass p-10 rounded-6xl border border-white/20 shadow-2xl space-y-10">
                           <div className="space-y-5">
                              <div className="flex items-center gap-4">
                                 <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
                                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{t.bio}</h3>
                              </div>
                              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                 {formData.bio || (language === 'ar' ? "أبحث عن التوازن وأستكشف أعماق العافية الشمولية." : "Finding my rhythm and exploring the depths of holistic wellness.")}
                              </p>
                           </div>
                           <div className="grid grid-cols-2 gap-10 border-t border-black/5 dark:border-white/10 pt-10">
                              <div className="space-y-3">
                                 <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg">school</span>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.edu}</h4>
                                 </div>
                                 <p className="text-sm font-black text-slate-900 dark:text-white">{formData.studyLevel || "Not Specified"}</p>
                              </div>
                              <div className="space-y-3">
                                 <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg">call</span>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.contact}</h4>
                                 </div>
                                 <p className="text-sm font-black text-slate-900 dark:text-white">{formData.phone || "Private"}</p>
                              </div>
                              <div className="space-y-3">
                                 <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Location</h4>
                                 </div>
                                 <p className="text-sm font-black text-slate-900 dark:text-white">{formData.location || "Earth"}</p>
                              </div>
                              <div className="space-y-3">
                                 <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg">work</span>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Expert Role</h4>
                                 </div>
                                 <p className="text-sm font-black text-slate-900 dark:text-white">{formData.occupation || "Member"}</p>
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
                        <section className="crystal-glass p-10 rounded-6xl border border-white/20 shadow-2xl space-y-10">
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
                                    className="w-full h-16 px-8 bg-slate-100 dark:bg-white/5 border-none rounded-3xl focus:ring-4 focus:ring-primary/20 transition-all text-base font-black dark:text-white"
                                 />
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 ml-2">Age</label>
                                    <input
                                       type="number"
                                       value={formData.age}
                                       onChange={e => setFormData({ ...formData, age: e.target.value })}
                                       className="w-full h-16 px-8 bg-slate-100 dark:bg-white/5 border-none rounded-3xl focus:ring-4 focus:ring-primary/20 transition-all text-base font-black dark:text-white"
                                    />
                                 </div>
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 ml-2">Gender</label>
                                    <select
                                       value={formData.gender}
                                       onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                       className="w-full h-16 px-8 bg-slate-100 dark:bg-white/5 border-none rounded-3xl focus:ring-4 focus:ring-primary/20 transition-all text-base font-black dark:text-white appearance-none"
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
                                    className="w-full h-16 px-8 bg-slate-100 dark:bg-white/5 border-none rounded-3xl focus:ring-4 focus:ring-primary/20 transition-all text-base font-black dark:text-white"
                                 />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 ml-2">Daily Occupation</label>
                                 <input
                                    value={formData.occupation}
                                    onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                                    className="w-full h-16 px-8 bg-slate-100 dark:bg-white/5 border-none rounded-3xl focus:ring-4 focus:ring-primary/20 transition-all text-base font-black dark:text-white"
                                 />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 ml-2">Contact Phone</label>
                                 <input
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full h-16 px-8 bg-slate-100 dark:bg-white/5 border-none rounded-3xl focus:ring-4 focus:ring-primary/20 transition-all text-base font-black dark:text-white"
                                    placeholder="+1..."
                                 />
                              </div>
                           </div>
                        </section>

                        {/* Save Button */}
                        <div className="pt-6">
                           <button
                              onClick={handleSaveSettings}
                              disabled={isSaving}
                              className="w-full h-20 urkio-gradient rounded-6xl text-white font-black text-sm uppercase tracking-widest shadow-3xl shadow-primary/40 flex items-center justify-center gap-4 active:scale-[0.95] transition-all crystal-btn"
                           >
                              {isSaving ? (
                                 <div className="size-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                              ) : (
                                 <>
                                    {t.saveChanges}
                                    <span className="material-symbols-outlined text-2xl">cloud_sync</span>
                                 </>
                              )}
                           </button>
                        </div>
                     </div>
                  )}
               </section>
            </main>
         </div>

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
                           onClick={handleLogout}
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

         <BottomNav role="USER" currentScreen={AppScreen.USER_PROFILE} navigate={navigate} language={language} />
      </div>
   );
};

export default UserProfile;
