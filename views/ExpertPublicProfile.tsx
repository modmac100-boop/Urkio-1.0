
import React, { useState } from 'react';
import { AppScreen, Expert, Service, Post } from '../types';
import { Avatar } from '../components/Avatar';

interface Props {
  navigate: (screen: AppScreen, expert?: Expert) => void;
  handleLogout: () => void;
  expert: Expert | null;
  language: 'en' | 'ar' | 'fr';
  isOwnProfile?: boolean;
}

const MOCK_CLINICAL_SERVICES: Service[] = [
  { id: 'sv1', name: 'Clinical Consultation', description: 'One-on-one session focusing on your specific mental wellness goals.', price: '$60', duration: '45 mins' },
  { id: 'sv2', name: 'Continuous Monitoring', description: 'Weekly review of your Homii reflections and biometrics with personal feedback.', price: '$150/mo', duration: 'Ongoing' },
  { id: 'sv3', name: 'Crisis Intervention', description: 'Immediate support and safety planning during high-stress periods.', price: '$80', duration: '30 mins' },
];

const MOCK_MANAGER_SERVICES: Service[] = [
  { id: 'ms1', name: 'Comprehensive Triage', description: 'Detailed analysis of your health history to match you with the perfect specialist.', price: '$45', duration: '30 mins' },
  { id: 'ms2', name: 'Journey Architecture', description: 'Setting up your personalized action plan and clinical coordination bridge.', price: '$120', duration: 'Setup' },
  { id: 'ms3', name: 'Crisis Stabilization', description: 'Immediate clinical triage and emergency resource coordination.', price: '$0', duration: 'Priority' },
];

const MOCK_DIETITIAN_SERVICES: Service[] = [
  { id: 'ds1', name: 'Metabolic Assessment', description: 'Deep dive into your nutritional history to optimize energy and focus.', price: '$75', duration: '60 mins' },
  { id: 'ds2', name: 'Gut-Brain Protocol', description: 'Tailored nutritional plan designed to reduce baseline anxiety via microbiome health.', price: '$200/mo', duration: 'Ongoing' },
  { id: 'ds3', name: 'Grocery Sync Session', description: 'Virtual walk-through to curate your environment for nutritional success.', price: '$50', duration: '30 mins' },
];

const EXPERT_POSTS: Post[] = [
  {
    id: 'ep1',
    authorName: 'Dr. Aris Varma',
    authorType: 'Specialist',
    authorImage: 'https://picsum.photos/seed/expert/200/200',
    content: "The intersection of biological markers and psychological state is where true healing begins. This week, focus on the 'Light Window' protocol I shared in the library.",
    time: '4h ago',
    likes: 852,
    comments: 42,
    reposts: 12,
    views: 8900,
    isExpert: true
  }
];

const ExpertPublicProfile: React.FC<Props> = ({ navigate, handleLogout, expert, language, isOwnProfile = false }) => {
  const [activeTab, setActiveTab] = useState<'About' | 'Services' | 'Insights'>('About');
  const [isFollowing, setIsFollowing] = useState(false);

  if (!expert) return null;

  const isCaseManager = expert.title.toLowerCase().includes('manager') || expert.title.toLowerCase().includes('triage');
  const isDietitian = expert.title.toLowerCase().includes('dietitian') || expert.title.toLowerCase().includes('nutrition');

  const themeGradient = isDietitian ? 'diet-gradient' : 'urkio-gradient';
  const themePrimaryText = isDietitian ? 'text-urkio-green' : 'text-primary';
  const themeBgPrimary = isDietitian ? 'bg-urkio-green' : 'bg-primary';
  // Fix: Added missing themePrimaryBorder definition required for professional certifications display
  const themePrimaryBorder = isDietitian ? 'border-urkio-green' : 'border-primary';
  const themeShadow = isDietitian ? 'shadow-urkio-green/40' : 'shadow-primary/40';

  const expertServices = expert.services || (
    isCaseManager ? MOCK_MANAGER_SERVICES :
      isDietitian ? MOCK_DIETITIAN_SERVICES :
        MOCK_CLINICAL_SERVICES
  );

  const t = language === 'ar' ? {
    about: 'عن الأخصائي',
    services: 'الخدمات',
    insights: 'الرؤى المهنية',
    following: 'متابعة',
    follow: 'متابعة الأخصائي',
    stats: { following: 'يتابع', followers: 'متابعون', likes: 'إعجابات', seekers: 'العملاء', rating: 'التقييم' },
    focus: 'تركيز المتخصص',
    expAreas: 'مجالات الخبرة',
    certs: 'الشهادات المهنية',
    verified: 'أخصائي معتمد من Urkio',
    book: 'حجز موعد',
    bookSession: 'حجز جلسة الآن',
    editProfile: 'تعديل الملف المهني',
    passTitle: 'بطاقة خبير Urkio',
    passDesc: 'هذه هي هويتك المهنية المعتمدة. استخدمها للتحقق من بياناتك في المؤتمرات واللقاءات السريرية.',
    qr: 'كود التحقق',
    download: 'تحميل البطاقة',
    identityTitle: 'هوية المتخصص العالمية',
    createInsight: 'نشر رؤية جديدة',
    socials: 'الروابط المهنية',
    viewCert: 'عرض الشهادة'
  } : language === 'fr' ? {
    about: 'À propos',
    services: 'Services',
    insights: 'Conseil pro',
    following: 'Abonné(e)',
    follow: 'Suivre l\'expert',
    stats: { following: 'Abonnements', followers: 'Abonnés', likes: 'J\'aime reçus', seekers: 'Chercheurs', rating: 'Note moy.' },
    focus: 'Spécialité',
    expAreas: 'Domaines d\'expertise',
    certs: 'Certifications professionnelles',
    verified: 'Professionnel vérifié Urkio',
    book: 'Prendre rendez-vous',
    bookSession: 'Réserver une séance',
    editProfile: 'Modifier le profil',
    passTitle: 'Pass Spécialiste Urkio',
    passDesc: 'Ceci est votre identité professionnelle vérifiée. Utilisez-la pour vous identifier lors de conférences.',
    qr: 'QR de vérification',
    download: 'Télécharger le Pass',
    identityTitle: 'Identité mondiale du spécialiste',
    createInsight: 'Publier une perspective',
    socials: 'Liens professionnels',
    viewCert: 'Voir le certificat'
  } : {
    about: 'About',
    services: 'Services',
    insights: 'Professional Board',
    following: 'Following',
    follow: 'Follow Expert',
    stats: { following: 'Following', followers: 'Followers', likes: 'Likes Rec.', seekers: 'Total Seekers', rating: 'Avg Rating' },
    focus: 'Specialist Focus',
    expAreas: 'Expertise Areas',
    certs: 'Professional Certifications',
    verified: 'Urkio Verified Professional',
    book: 'Book Appointment',
    bookSession: 'Book Session Now',
    editProfile: 'Edit Pro Profile',
    passTitle: 'Urkio Specialist Pass',
    passDesc: 'This is your verified professional identity. Use this for credentialing at conferences or clinical sync-ups.',
    qr: 'Verification QR',
    download: 'Download Pass',
    identityTitle: 'Global Specialist Identity',
    createInsight: 'Publish New Insight',
    socials: 'Professional Links',
    viewCert: 'View Certificate'
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl overflow-x-hidden pb-40 font-sans transition-colors duration-300">
      {/* Dynamic Header */}
      <div className="relative h-80 overflow-hidden">
        <div className={`absolute inset-0 ${themeGradient} opacity-10 blur-3xl -translate-y-1/2 scale-150`}></div>
        <div className="absolute top-12 left-6 right-6 z-20 flex justify-between items-center">
          <button
            onClick={() => navigate(isOwnProfile ? AppScreen.EXPERT_DASHBOARD : AppScreen.EXPERT_DISCOVERY)}
            className="size-11 flex items-center justify-center rounded-2xl glass-icon-container text-slate-900 dark:text-white active:scale-95 transition-all shadow-lg"
          >
            <span className={`material-symbols-outlined ${language === 'ar' ? 'rotate-180' : ''}`}>arrow_back_ios_new</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="size-10 flex items-center justify-center rounded-2xl bg-white/30 backdrop-blur-xl border border-white/20 text-slate-900 dark:text-white">
              <svg className="size-6" viewBox="0 0 100 120" fill="none">
                <path d="M24 15V80C24 95 36 105 50 105C64 105 76 95 76 80V15" stroke="currentColor" strokeWidth="30" strokeLinecap="round" />
              </svg>
            </div>
            {isOwnProfile ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(AppScreen.EXPERT_PROFILE)}
                  className={`h-11 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl ${themeBgPrimary} text-white ${themeShadow}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">edit</span>
                    {t.editProfile}
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="size-11 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 text-red-500 active:scale-95 transition-all shadow-lg"
                >
                  <span className="material-symbols-outlined">logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`h-11 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl ${isFollowing ? 'bg-emerald-500 text-white' : `${themeGradient} text-white ${themeShadow}`
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-sm ${isFollowing ? 'fill-1' : ''}`}>{isFollowing ? 'check' : 'person_add'}</span>
                  {isFollowing ? t.following : t.follow}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-8 -mt-44 relative z-10 flex flex-col items-center">
        <div className={`size-44 rounded-[3.5rem] ${themeGradient} p-1 shadow-2xl mb-8 group overflow-hidden`}>
          <div
            className="size-full rounded-[3.3rem] bg-center bg-no-repeat bg-cover border-4 border-white dark:border-background-dark transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url("${expert.image}")` }}
          ></div>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">{expert.name}</h1>
          <div className="flex items-center justify-center size-8 bg-emerald-500 rounded-2xl border-4 border-white dark:border-background-dark shadow-xl">
            <span className="material-symbols-outlined text-white text-[16px] font-black fill-1">verified</span>
          </div>
        </div>

        <p className={`${themePrimaryText} font-black text-sm mb-6 uppercase tracking-[0.3em]`}>{expert.title}</p>

        {/* Pro Stats Row */}
        <div className="w-full flex items-center justify-center gap-8 py-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl mb-8">
          <div className="flex flex-col items-center">
            <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{isOwnProfile ? '142' : '42'}</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-1">{isOwnProfile ? t.stats.seekers : t.stats.following}</p>
          </div>
          <div className="w-[1px] h-8 bg-slate-100 dark:bg-white/10"></div>
          <div className="flex flex-col items-center">
            <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{(expert.reviews * 10).toLocaleString()}</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-1">{t.stats.followers}</p>
          </div>
          <div className="w-[1px] h-8 bg-slate-100 dark:bg-white/10"></div>
          <div className="flex flex-col items-center">
            <p className={`text-lg font-black ${themePrimaryText} leading-none`}>{isOwnProfile ? '4.9' : (expert.rating * 100).toLocaleString()}</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-1">{isOwnProfile ? t.stats.rating : t.stats.likes}</p>
          </div>
        </div>
      </div>

      <div className="px-8 mb-12">
        <div className="flex p-1.5 bg-white dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-white/10 shadow-inner">
          {(['About', 'Services', 'Insights'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all ${activeTab === tab ? `${themeGradient} text-white shadow-xl ${themeShadow}` : 'text-slate-400'}`}
            >
              {tab === 'About' ? t.about : tab === 'Services' ? t.services : t.insights}
            </button>
          ))}
        </div>
      </div>

      <main className="px-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === 'About' && (
          <>
            <section className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 ml-1">{t.focus}</h3>
              <div className="bg-white dark:bg-slate-900/50 p-7 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {isCaseManager
                    ? `"As a Journey Architect, I bridge the gap between AI triage and clinical specialists. My goal is to ensure every seeker receives the most aligned care path possible."`
                    : isDietitian
                      ? `"I believe true wellness starts on your plate. By optimizing your metabolic health and gut microbiome, we unlock your brain's full potential for peace and focus."`
                      : `"My mission is to help you rediscover your natural balance. By combining clinical expertise with holistic health principles, we create a sustainable path to wellness."`}
                </p>
                {!isOwnProfile && (
                  <button
                    onClick={() => navigate(AppScreen.EXPERT_BOOKING, expert)}
                    className={`w-full h-14 ${themeBgPrimary} text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl ${themeShadow} flex items-center justify-center gap-3 active:scale-95 transition-all`}
                  >
                    <span className="material-symbols-outlined text-lg">calendar_month</span>
                    {t.bookSession}
                  </button>
                )}
              </div>
            </section>

            {/* Professional Certifications List */}
            {expert.certifications && expert.certifications.length > 0 && (
              <section className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 ml-1">{t.certs}</h3>
                <div className="space-y-3">
                  {expert.certifications.map((cert) => (
                    <div key={cert.id} className="bg-white dark:bg-slate-900/50 p-5 rounded-[1.8rem] border border-gray-100 dark:border-white/5 flex items-center justify-between shadow-sm group">
                      <div className="flex items-center gap-4">
                        <div className={`size-10 rounded-xl ${themeBgPrimary} bg-opacity-10 ${themePrimaryText} flex items-center justify-center shrink-0`}>
                          <span className="material-symbols-outlined">workspace_premium</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white leading-none">{cert.name}</h4>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Board Verified</p>
                        </div>
                      </div>
                      {cert.link && (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noreferrer"
                          className={`h-9 px-4 rounded-xl border ${themePrimaryBorder} ${themePrimaryText} text-[9px] font-black uppercase flex items-center gap-2 hover:${themeBgPrimary} hover:text-white transition-all`}
                        >
                          {t.viewCert}
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Social Presence Section */}
            <section className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 ml-1">{t.socials}</h3>
              <div className="flex flex-wrap gap-3">
                {expert.linkedin && (
                  <button className="h-12 px-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 flex items-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-95">
                    <span className="material-symbols-outlined text-primary text-sm">link</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">LinkedIn</span>
                  </button>
                )}
                {expert.twitter && (
                  <button className="h-12 px-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 flex items-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-95">
                    <span className="material-symbols-outlined text-primary text-sm">alternate_email</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">Twitter</span>
                  </button>
                )}
                {expert.instagram && (
                  <button className="h-12 px-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 flex items-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-95">
                    <span className="material-symbols-outlined text-primary text-sm">photo_camera</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">Instagram</span>
                  </button>
                )}
                {expert.website && (
                  <button className="h-12 px-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 flex items-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-95">
                    <span className="material-symbols-outlined text-primary text-sm">language</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">Website</span>
                  </button>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 ml-1">{t.expAreas}</h3>
              <div className="flex flex-wrap gap-2">
                {expert.expertise.map(tag => (
                  <span key={tag} className={`px-6 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl text-[10px] font-black ${themePrimaryText} uppercase tracking-widest shadow-sm`}>
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Specialist ID Pass Section (For Self-View) */}
            {isOwnProfile && (
              <section className="pt-12 pb-12 border-t border-gray-100 dark:border-white/5 space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-black font-display uppercase tracking-wider text-slate-900 dark:text-white">{t.identityTitle}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Board Verified Credential</p>
                </div>

                <div className={`p-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border-t-8 ${isDietitian ? 'border-urkio-green' : 'border-primary'} relative overflow-hidden group`}>
                  <div className={`absolute -right-12 -top-12 size-48 ${isDietitian ? 'bg-urkio-green/5' : 'bg-primary/5'} rounded-full blur-[80px] group-hover:scale-110 transition-transform`}></div>
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className={`size-20 rounded-[2rem] ${isDietitian ? 'bg-urkio-green/10' : 'bg-primary/10'} flex items-center justify-center ${themePrimaryText} mb-6 shadow-inner`}>
                      <span className="material-symbols-outlined text-4xl">{isDietitian ? 'restaurant' : 'medical_services'}</span>
                    </div>
                    <h4 className="text-xl font-black mb-4 font-display text-slate-900 dark:text-white">{t.passTitle}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-8 px-4 font-medium">
                      {t.passDesc}
                    </p>
                    <div className="w-full flex gap-3">
                      <button className="flex-1 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all group/btn shadow-sm">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{t.qr}</span>
                        <span className={`${themePrimaryText} material-symbols-outlined group-hover/btn:scale-110 transition-transform`}>qr_code_2</span>
                      </button>
                      <button className={`flex-1 h-14 ${themeBgPrimary} text-white rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all group/btn shadow-lg ${themeShadow}`}>
                        <span className="text-[9px] font-black uppercase tracking-widest">{t.download}</span>
                        <span className="material-symbols-outlined text-white group-hover/btn:translate-y-0.5 transition-transform">download</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {activeTab === 'Services' && (
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 ml-1">{t.services}</h3>
            <div className="space-y-4">
              {expertServices.map(service => (
                <div key={service.id} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 p-7 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white leading-none mb-1">{service.name}</h4>
                      <p className={`text-[9px] font-bold ${themePrimaryText} uppercase tracking-widest`}>{service.duration}</p>
                    </div>
                    <p className="text-lg font-black text-emerald-500">{service.price}</p>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6">
                    {service.description}
                  </p>
                  {!isOwnProfile && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(AppScreen.PRIVATE_CHAT, expert)}
                        className={`flex-1 h-12 bg-slate-100 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 hover:${themePrimaryText} transition-all active:scale-95`}
                      >
                        Inquire
                      </button>
                      <button
                        onClick={() => navigate(AppScreen.EXPERT_BOOKING, expert)}
                        className={`flex-[2] h-12 ${themeBgPrimary} text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg ${themeShadow} active:scale-95 transition-all`}
                      >
                        Book This Service
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'Insights' && (
          <section className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t.insights}</h3>
              {isOwnProfile && (
                <button
                  onClick={() => navigate(AppScreen.CREATE_POST)}
                  className={`flex items-center gap-2 text-[9px] font-black ${themePrimaryText} uppercase tracking-widest`}
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  {t.createInsight}
                </button>
              )}
            </div>

            <div className="space-y-6">
              {EXPERT_POSTS.map(post => (
                <div key={post.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`size-12 rounded-2xl p-0.5 ${themeGradient} shadow-md`}>
                        <img src={post.authorImage} className="size-full rounded-[14px] object-cover border-2 border-white dark:border-slate-800" alt={post.authorName} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">{post.authorName}</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{post.time}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-6">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <span className="material-symbols-outlined text-xl">favorite</span>
                          <span className="text-xs font-black">{post.likes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <span className="material-symbols-outlined text-xl">chat_bubble</span>
                          <span className="text-xs font-black">{post.comments}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span className="material-symbols-outlined text-xl">visibility</span>
                        <span className="text-[10px] font-black uppercase">{post.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {isOwnProfile && (
              <button
                onClick={() => navigate(AppScreen.CREATE_POST)}
                className="w-full h-20 bg-white dark:bg-slate-900 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] flex items-center justify-center gap-3 text-slate-400 hover:text-primary hover:border-primary transition-all group"
              >
                <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">post_add</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Share Professional Perspective</span>
              </button>
            )}
          </section>
        )}
      </main>

      {/* Sticky Action Footer */}
      {!isOwnProfile && (
        <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-white/80 dark:bg-background-dark/95 backdrop-blur-3xl border-t border-gray-100 dark:border-white/5 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(AppScreen.PRIVATE_CHAT, expert)}
              className={`size-16 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[1.8rem] flex items-center justify-center text-slate-500 dark:text-slate-400 hover:${themePrimaryText} transition-all active:scale-95`}
            >
              <span className="material-symbols-outlined text-2xl">chat_bubble</span>
            </button>
            <button
              onClick={() => navigate(AppScreen.EXPERT_BOOKING, expert)}
              className={`flex-1 h-16 ${themeGradient} rounded-[1.8rem] text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl ${themeShadow} hover:scale-[1.02] active:scale-95 transition-all`}
            >
              {t.book} • $60
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default ExpertPublicProfile;
