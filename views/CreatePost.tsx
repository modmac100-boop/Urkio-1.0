
import React, { useState, useRef, ChangeEvent } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
  language: 'en' | 'ar' | 'fr';
}

type VisibilityType = 'public' | 'followers' | 'private';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../services/firebase';

const CreatePost = ({ navigate, language }: Props) => {
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

  const handleAudioSelect = async (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const b64 = await blobToBase64(file);
      setPreviewUrl(b64);
    } catch (err) {
      console.error(err);
      setError("Failed to process file.");
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
      <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-6 pt-10 pb-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <button onClick={() => navigate(AppScreen.COMMUNITY_FEED)} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"><span className="material-symbols-outlined text-2xl">close</span></button>
        <h2 className="text-lg font-bold tracking-tight">{t.header}</h2>
        <button onClick={handlePost} disabled={(!content.trim() && !previewUrl && !audioB64) || isPosting} className="px-5 py-2 bg-primary rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-primary/30 disabled:opacity-30 transition-all active:scale-95">
          {isPosting ? t.posting : t.share}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {/* User Identity Header */}
        <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className={`size-12 rounded-full overflow-hidden border-2 transition-all ${isAnonymous ? 'bg-slate-300 dark:bg-slate-700 border-transparent' : 'border-primary'}`}>
              {isAnonymous ? (
                <div className="size-full flex items-center justify-center text-slate-500"><span className="material-symbols-outlined text-xl">visibility_off</span></div>
              ) : (
                <img src={auth.currentUser?.photoURL || "https://picsum.photos/seed/u4/100/100"} className="size-full object-cover" alt="You" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold leading-none mb-1">{isAnonymous ? t.anonymous : (auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'Member')}</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Publishing to Feed</p>
            </div>
          </div>
          <button onClick={() => setIsAnonymous(!isAnonymous)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isAnonymous ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border-slate-200'}`}>
            <span className="material-symbols-outlined text-sm">visibility_off</span>
            <span className="text-[9px] font-bold uppercase tracking-widest">{t.anonymous}</span>
          </button>
        </div>

        {/* Visibility Protocol Selector */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 px-1">{t.visibilityTitle}</h3>
          <div className="grid grid-cols-3 gap-2">
            {VISIBILITY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setVisibility(opt.id)}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-1.5 ${visibility === opt.id
                  ? 'bg-primary/5 border-primary shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/30 border-transparent opacity-60'
                  }`}
              >
                <div className={`size-9 rounded-lg flex items-center justify-center transition-colors ${visibility === opt.id ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                  <span className="material-symbols-outlined text-lg">{opt.icon}</span>
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase leading-none mb-0.5 ${visibility === opt.id ? 'text-primary' : 'text-slate-500'}`}>{opt.label}</p>
                  <p className="text-[8px] font-medium text-slate-400 uppercase tracking-tighter whitespace-nowrap">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Text Input Area */}
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-48 bg-transparent border-none p-0 text-lg font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-0 leading-relaxed resize-none text-slate-900 dark:text-white"
          placeholder={t.placeholder}
        />

        {/* Audio Preview */}
        {audioB64 && (
          <div className="relative w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">mic</span>
            <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-primary"></div>
            </div>
            <button onClick={() => setAudioB64(null)} className="text-slate-400 hover:text-rose-500"><span className="material-symbols-outlined">delete</span></button>
          </div>
        )}

        {/* Media Toolbar */}
        <section className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-4 flex justify-between items-center">
          <div className="flex gap-4">
            {MEDIA_ACTIONS.slice(0, 2).map(item => (
              <button key={item.id} onClick={item.action} className="text-slate-500 hover:text-primary transition-all flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="text-[8px] font-bold uppercase tracking-widest">{item.label.split(' ')[1] || item.label}</span>
              </button>
            ))}
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
          <div className="flex gap-4 flex-1 justify-around">
            {MEDIA_ACTIONS.slice(2).map(item => (
              <button key={item.id} onClick={item.action} className="text-slate-500 hover:text-primary transition-all flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="text-[8px] font-bold uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileSelect} />
        <input type="file" ref={audioInputRef} className="hidden" accept="audio/*" onChange={handleAudioSelect} />
      </main>

      <footer className="p-6 bg-slate-950 text-white relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-primary/10 blur-[100px] opacity-60"></div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="size-16 rounded-[2.2rem] flex items-center justify-center text-primary border border-primary/30 animate-pulse"><span className="material-symbols-outlined text-4xl fill-1">verified_user</span></div>
          <div className="flex-1 space-y-1">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">SAFE COMMUNITY</p>
            <p className="text-[11px] font-medium text-slate-400 leading-relaxed opacity-80">Insights are moderated by experts to ensure a supportive environment.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreatePost;
