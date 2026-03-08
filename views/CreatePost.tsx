
import React, { useState, useRef } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
  language: 'en' | 'ar' | 'fr';
}

type VisibilityType = 'public' | 'followers' | 'private';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../services/firebase';

const CreatePost: React.FC<Props> = ({ navigate, language }) => {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [visibility, setVisibility] = useState<VisibilityType>('public');
  const [isPosting, setIsPosting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [audioB64, setAudioB64] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const blobToBase64 = (blob: Blob) => {
    return new Promise<string>((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  const handleAudioSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const b64 = await blobToBase64(file);
      setAudioB64(b64);
    } catch (err) {
      console.error(err);
      setError("Failed to process audio file.");
    }
  };

  const t = language === 'ar' ? {
    header: 'إنشاء منشور',
    share: 'مشاركة',
    posting: 'جاري النشر...',
    anonymous: 'مجهول',
    placeholder: 'شارك رؤية، اطرح سؤالاً، أو عبر عن يومك...',
    visibilityTitle: 'بروتوكول الرؤية',
    public: 'عام',
    publicDesc: 'مرئي للجميع',
    followers: 'المتابعون',
    followersDesc: 'دائرتك فقط',
    private: 'خاص',
    privateDesc: 'خزنة Homii',
    media: ['رفع صورة', 'رفع فيديو', 'تسجيل فيديو', 'ستوري', 'صوت']
  } : language === 'fr' ? {
    header: 'Créer un post',
    share: 'Partager',
    posting: 'Publication...',
    anonymous: 'Anonyme',
    placeholder: 'Partagez une idée, posez une question ou racontez votre journée...',
    visibilityTitle: 'Protocole de visibilité',
    public: 'Public',
    publicDesc: 'Visible par tous',
    followers: 'Abonnés',
    followersDesc: 'Votre cercle',
    private: 'Privé',
    privateDesc: 'Mon coffre-fort',
    media: ['Photo', 'Vidéo', 'Enregistrer', 'Story', 'Audio']
  } : {
    header: 'Create Post',
    share: 'Share',
    posting: 'Posting...',
    anonymous: 'Anonymous',
    placeholder: "Share an insight, ask a question, or reflect on your day...",
    visibilityTitle: 'Visibility Protocol',
    public: 'Public',
    publicDesc: 'Visible to all',
    followers: 'Followers',
    followersDesc: 'Your circle only',
    private: 'Private',
    privateDesc: 'My Vault only',
    media: ['Upload Photo', 'Upload Video', 'Record Video', 'Add Story', 'Audio Clip']
  };

  const handlePost = async () => {
    if (!content.trim() && !previewUrl && !audioB64) return;
    setIsPosting(true);
    setError(null);
    try {
      const user = auth.currentUser;
      const userName = user?.displayName || user?.email?.split('@')[0] || 'Unknown User';
      const userImage = user?.photoURL || 'https://picsum.photos/seed/u4/100/100';

      const postData = {
        authorId: user?.uid || 'anonymous',
        authorName: isAnonymous ? t.anonymous : userName,
        authorImage: isAnonymous ? '' : userImage, // Empty for anonymous
        authorType: isAnonymous ? 'Secret' : 'Member', // Ideally fetch from profile
        content: content.trim(),
        timestamp: serverTimestamp(),
        likes: 0,
        comments: 0,
        reposts: 0,
        views: 0,
        likedBy: [],
        visibility: visibility,
        isExpert: false, // Defaulting for now
        image: previewUrl || null,
        audio: audioB64 || null
      };

      await addDoc(collection(db, 'posts'), postData);

      setIsPosting(false);
      navigate(AppScreen.COMMUNITY_FEED);
    } catch (err: any) {
      console.error("Error adding document: ", err);
      setError("Failed to create post. Please try again.");
      setIsPosting(false);
    }
  };

  const VISIBILITY_OPTIONS = [
    { id: 'public' as VisibilityType, label: t.public, desc: t.publicDesc, icon: 'public', color: 'text-accent-cyan' },
    { id: 'followers' as VisibilityType, label: t.followers, desc: t.followersDesc, icon: 'group', color: 'text-primary' },
    { id: 'private' as VisibilityType, label: t.private, desc: t.privateDesc, icon: 'lock', color: 'text-urkio-magenta' },
  ];

  const MEDIA_ACTIONS = [
    { id: 'image', icon: 'image', label: t.media[0], action: () => fileInputRef.current?.click() },
    { id: 'video_up', icon: 'movie', label: t.media[1], action: () => fileInputRef.current?.click() },
    { id: 'record', icon: 'video_call', label: t.media[2], action: () => navigate(AppScreen.VIDEO_RECORDER), isSpecial: true },
    { id: 'story', icon: 'auto_awesome', label: t.media[3], action: () => fileInputRef.current?.click() },
    { id: 'audio', icon: 'mic', label: t.media[4], action: () => audioInputRef.current?.click() },
  ];

  return (
    <div className="relative flex h-screen w-full flex-col bg-white dark:bg-background-dark text-slate-900 dark:text-white max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/95 backdrop-blur-3xl px-8 pt-12 pb-8 flex items-center justify-between border-b border-white/10">
        <button onClick={() => navigate(AppScreen.COMMUNITY_FEED)} className="size-12 flex items-center justify-center rounded-2xl crystal-glass active:scale-90 transition-all crystal-btn"><span className="material-symbols-outlined text-2xl">close</span></button>
        <h2 className="text-xl font-black font-display tracking-tight">{t.header}</h2>
        <div className="flex flex-col items-end">
          <button onClick={handlePost} disabled={(!content.trim() && !previewUrl && !audioB64) || isPosting} className="px-8 py-3 urkio-gradient rounded-2xl text-[11px] font-black uppercase tracking-widest text-white shadow-2xl shadow-primary/30 disabled:opacity-30 transition-all active:scale-95 crystal-btn">
            {isPosting ? t.posting : t.share}
          </button>
          {error && <span className="text-red-500 text-xs mt-1 absolute top-20 right-8">{error}</span>}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
        {/* User Identity Header */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center gap-5">
            <div className={`size-14 rounded-2xl overflow-hidden border-2 transition-all duration-500 ${isAnonymous ? 'bg-slate-200 dark:bg-slate-800 border-transparent grayscale' : 'border-primary shadow-lg shadow-primary/20'}`}>
              {isAnonymous ? (
                <div className="size-full flex items-center justify-center text-slate-400"><span className="material-symbols-outlined text-3xl">visibility_off</span></div>
              ) : (
                <img src="https://picsum.photos/seed/u4/100/100" className="size-full object-cover" alt="You" />
              )}
            </div>
            <div>
              <h3 className="text-base font-black leading-none mb-1.5">{isAnonymous ? t.anonymous : (auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'Unknown')}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Publishing to Feed</p>
            </div>
          </div>
          <button onClick={() => setIsAnonymous(!isAnonymous)} className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all ${isAnonymous ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border-slate-200'}`}>
            <span className={`material-symbols-outlined text-[18px] ${isAnonymous ? 'fill-1' : ''}`}>visibility_off</span>
            <span className="text-[9px] font-black uppercase tracking-widest">{t.anonymous}</span>
          </button>
        </div>

        {/* Visibility Protocol Selector */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="material-symbols-outlined text-primary text-sm">security</span>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t.visibilityTitle}</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {VISIBILITY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setVisibility(opt.id)}
                className={`p-4 rounded-[1.8rem] border-2 transition-all flex flex-col items-center text-center gap-2 active:scale-95 ${visibility === opt.id
                  ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10'
                  : 'bg-slate-50 dark:bg-white/5 border-transparent opacity-60'
                  }`}
              >
                <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${visibility === opt.id ? 'bg-primary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  <span className={`material-symbols-outlined text-xl ${visibility === opt.id ? 'fill-1' : ''}`}>{opt.icon}</span>
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase leading-none mb-0.5 ${visibility === opt.id ? 'text-primary' : 'text-slate-500'}`}>{opt.label}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Text Input Area */}
        <textarea autoFocus value={content} onChange={(e) => setContent(e.target.value)} className="w-full h-40 bg-transparent border-none p-0 text-xl font-medium placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-0 leading-relaxed text-start resize-none text-slate-900 dark:text-white" placeholder={t.placeholder} />

        {/* Audio Preview Area */}
        {audioB64 && (
          <div className="relative z-20 w-full mb-4">
            <audio src={audioB64} controls className="w-full rounded-2xl grayscale hue-rotate-[280deg]" />
            <button onClick={() => setAudioB64(null)} className="absolute -top-3 -right-3 size-8 bg-red-500 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all z-30">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* Enhanced Media Selector Section */}
        <section className="crystal-glass rounded-[3.5rem] p-8 border border-white/20 shadow-2xl space-y-8">
          <div className="grid grid-cols-5 gap-4">
            {MEDIA_ACTIONS.map(item => (
              <button key={item.id} onClick={item.action} className={`flex flex-col items-center gap-3 transition-all hover:scale-105 group active:scale-90 ${item.isSpecial ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
                <div className={`size-14 rounded-2xl crystal-glass flex items-center justify-center shadow-lg shrink-0 ${item.isSpecial ? 'border-primary/40 bg-primary/5 text-primary' : 'text-slate-500'}`}>
                  <span className={`material-symbols-outlined text-2xl group-hover:icon-crystal ${item.isSpecial ? 'fill-1' : ''}`}>{item.icon}</span>
                </div>
                <span className={`text-[7px] font-black uppercase tracking-widest text-center leading-tight ${item.isSpecial ? 'text-primary' : 'text-slate-500'}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" />
        <input type="file" ref={audioInputRef} className="hidden" accept="audio/*" onChange={handleAudioSelect} />
      </main>

      <footer className="p-10 bg-slate-950 text-white relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-primary/10 blur-[100px] opacity-60"></div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="size-16 rounded-[2.2rem] crystal-glass flex items-center justify-center text-accent-cyan border border-accent-cyan/30 animate-pulse"><span className="material-symbols-outlined text-4xl fill-1">verified_user</span></div>
          <div className="flex-1 space-y-1">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-accent-cyan">SAFE COMMUNITY</p>
            <p className="text-[11px] font-medium text-slate-400 leading-relaxed opacity-80">Insights are moderated by experts to ensure a supportive environment.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreatePost;
