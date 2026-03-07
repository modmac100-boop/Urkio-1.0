
import React, { useState, useEffect } from 'react';
import { AppScreen, Post, Expert, Story, Resource, Circle, Member } from '../types';
import { db, auth } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { BottomNav } from '../components/Navigation';
import { LiveEventBanner } from '../components/LiveEventBanner';
import { Avatar } from '../components/Avatar';

interface Props {
  navigate: (screen: AppScreen, expert?: Expert, query?: string, resource?: Resource, circle?: Circle, stories?: Story[], storyIndex?: number, member?: Member) => void;
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
}

const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    authorName: 'Dr. Sarah Miller',
    authorType: 'Clinical Psychologist',
    authorImage: 'https://picsum.photos/seed/dr1/100/100',
    content: "Just finished a wonderful live session on Sleep Science. Remember, the 'Light Window' protocol is essential for your circadian health. Check out the recording if you missed it! ✨",
    time: '2h ago',
    isExpert: true,
    likes: 842,
    comments: 42,
    reposts: 18,
    views: 5200,
    tags: ['SleepScience', 'Wellness'],
    image: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p2',
    authorName: 'Mark Thompson',
    authorType: 'Functional Dietitian',
    authorImage: 'https://picsum.photos/seed/mark/100/100',
    content: "Protein-first meals are the secret to mood stability. Watch how I prep my breakfast to avoid the mid-morning cortisol spike. 🥑🍳",
    time: '4h ago',
    isExpert: true,
    likes: 562,
    comments: 29,
    reposts: 12,
    views: 3100,
    tags: ['Nutrition', 'Energy'],
  },
  {
    id: 'p3',
    authorName: 'Alex Johnson',
    authorType: 'Hall of Fame Legend',
    authorImage: 'https://picsum.photos/seed/u4/100/100',
    content: "Reached day 30 of my consistency journey! Honestly, the support from this circle has been the biggest factor in my growth. 💪",
    time: '6h ago',
    likes: 1204,
    comments: 84,
    reposts: 24,
    views: 8900,
    isHallOfFame: true,
    tags: ['Milestone', 'Motivation']
  }
];

const CommunityFeed: React.FC<Props> = ({ navigate, language, setLanguage }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [supportedPosts, setSupportedPosts] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts: Post[] = [];
      const userLiked = new Set<string>();
      const currentUserId = auth.currentUser?.uid;

      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedPosts.push({
          id: doc.id,
          ...data,
          time: data.timestamp ? new Date(data.timestamp.toDate()).toLocaleTimeString() : 'Just now',
        } as Post);

        if (currentUserId && data.likedBy && data.likedBy.includes(currentUserId)) {
          userLiked.add(doc.id);
        }
      });

      setPosts(fetchedPosts.length > 0 ? fetchedPosts : MOCK_POSTS); // Fallback to mock if empty initially
      setLikedPosts(userLiked);
    }, (error) => {
      console.error("Error fetching posts:", error);
    });

    return () => unsubscribe();
  }, []);

  const t = language === 'ar' ? {
    header: 'المجتمع',
    placeholder: 'ابدأ رؤية جديدة...',
    categories: ['الكل', 'نفسي', 'تغذية', 'نوم', 'عافية'],
    categoryKeys: ['All', 'Psychology', 'Nutrition', 'Sleep', 'Wellness'],
    support: 'دعم',
    send: 'إرسال',
    share: 'مشاركة'
  } : {
    header: 'Community',
    placeholder: 'Start a new insight...',
    categories: ['All', 'Psychology', 'Nutrition', 'Sleep', 'Wellness'],
    categoryKeys: ['All', 'Psychology', 'Nutrition', 'Sleep', 'Wellness'],
    support: 'Support',
    send: 'Send',
    share: 'Share'
  };

  const MOCK_STORIES: Story[] = [
    { id: 's1', userName: 'Dr. Sarah', userImage: 'https://picsum.photos/seed/dr1/100/100', isExpert: true, mediaUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1080', mediaType: 'image', timestamp: '2h ago' },
    { id: 's2', userName: 'Alex J.', userImage: 'https://picsum.photos/seed/u4/100/100', isExpert: false, mediaUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1080', mediaType: 'image', timestamp: '4h ago' },
  ];

  const handleLike = async (id: string) => {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) return; // Must be logged in

    const postRef = doc(db, 'posts', id);
    const isLiked = likedPosts.has(id);

    try {
      if (isLiked) {
        await updateDoc(postRef, {
          likes: posts.find(p => p.id === id)!.likes - 1,
          likedBy: arrayRemove(currentUserId)
        });
        // optimistic local update happens via onSnapshot anyway, but can update state manually if delay is high
      } else {
        await updateDoc(postRef, {
          likes: posts.find(p => p.id === id)!.likes + 1,
          likedBy: arrayUnion(currentUserId)
        });
      }
    } catch (err) {
      console.error("Error updating like", err);
    }
  };

  const handleSupport = (id: string) => {
    setSupportedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl pb-32 font-sans overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center px-4 pt-6 pb-2 justify-between">
          <h1 className="text-2xl font-black bg-gradient-to-r from-urkio-magenta to-urkio-blue bg-clip-text text-transparent font-display tracking-tight leading-none">{t.header}</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
              {language === 'en' ? 'AR' : 'EN'}
            </button>
            <button onClick={() => navigate(AppScreen.SEARCH_RESULTS)} className="size-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><span className="material-symbols-outlined text-slate-500">search</span></button>
          </div>
        </div>

        {/* Stories Bar */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 py-6 border-b border-slate-50 dark:border-white/5">
          <div onClick={() => navigate(AppScreen.CREATE_POST)} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group">
            <div className="size-[64px] rounded-full border-2 border-dashed border-primary flex items-center justify-center active:scale-95 transition-transform">
              <div className="size-12 rounded-full urkio-gradient flex items-center justify-center text-white shadow-lg"><span className="material-symbols-outlined">add</span></div>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase">Insight</span>
          </div>
          {MOCK_STORIES.map((story, idx) => (
            <button key={story.id} onClick={() => navigate(AppScreen.STORY_VIEWER, undefined, undefined, undefined, undefined, MOCK_STORIES, idx)} className="flex flex-col items-center gap-2 shrink-0 active:scale-95 transition-transform">
              <Avatar src={story.userImage} size="md" isExpert={story.isExpert} />
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase truncate w-14 text-center">{story.userName}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-4">
          {t.categories.map((cat, idx) => (
            <button key={cat} onClick={() => setActiveCategory(t.categoryKeys[idx])} className={`shrink-0 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all border ${activeCategory === t.categoryKeys[idx] ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="flex flex-col gap-6 p-4">
        {/* Write Post Trigger Card */}
        <section onClick={() => navigate(AppScreen.CREATE_POST)} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-white/5 flex items-center gap-5 cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] group">
          <Avatar src={auth.currentUser?.photoURL || "https://picsum.photos/seed/u4/100/100"} size="sm" isHallOfFame={true} />
          <div className="flex-1 bg-slate-50 dark:bg-white/5 h-14 rounded-2xl px-6 flex items-center text-slate-400 font-medium text-sm border border-transparent group-hover:border-primary/20 transition-all">
            {t.placeholder}
          </div>
          <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
            <span className="material-symbols-outlined">add_circle</span>
          </div>
        </section>

        {posts.map((post, i) => (
          <div key={post.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar src={post.authorImage} size="md" isExpert={post.isExpert} isHallOfFame={post.isHallOfFame} />
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white leading-none">{post.authorName}</h4>
                    {post.isExpert && <span className="material-symbols-outlined text-primary text-[14px] fill-1">verified</span>}
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{post.authorType} • {post.time}</p>
                </div>
              </div>
              <button className="size-10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-center text-slate-400"><span className="material-symbols-outlined">more_horiz</span></button>
            </div>

            <div className="px-6 pb-4"><p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">{post.content}</p></div>

            {post.image && <div className="px-4 pb-4"><div className="aspect-[16/10] w-full rounded-[1.8rem] overflow-hidden border border-slate-100 dark:border-white/10 shadow-inner"><img src={post.image} className="size-full object-cover" alt="Post" /></div></div>}

            {post.audio && (
              <div className="px-6 pb-4">
                <audio src={post.audio} controls className="w-full h-12 rounded-full grayscale hue-rotate-[280deg]" />
              </div>
            )}

            {/* Enhanced interaction bar with smaller clickable stats */}
            <div className="px-6 py-4 flex items-center justify-around border-t border-slate-50 dark:border-white/5">
              <button onClick={() => handleLike(post.id)} className={`flex flex-col items-center gap-1 transition-all active:scale-90 group ${likedPosts.has(post.id) ? 'text-urkio-magenta' : 'text-slate-400'}`}>
                <span className={`material-symbols-outlined text-xl ${likedPosts.has(post.id) ? 'fill-1 glow-magenta' : 'group-hover:text-urkio-magenta'}`}>volunteer_activism</span>
                <span className="text-[10px] font-black uppercase tracking-tighter underline underline-offset-4 decoration-current/30 decoration-1">{post.likes}</span>
              </button>

              <button onClick={() => handleSupport(post.id)} className={`flex flex-col items-center gap-1 transition-all active:scale-90 group ${supportedPosts.has(post.id) ? 'text-emerald-500' : 'text-slate-400'}`}>
                <span className={`material-symbols-outlined text-xl ${supportedPosts.has(post.id) ? 'fill-1' : 'group-hover:text-emerald-500'}`}>handshake</span>
                <span className="text-[10px] font-black uppercase tracking-tighter underline underline-offset-4 decoration-current/30 decoration-1">{t.support}</span>
              </button>

              <button onClick={() => navigate(AppScreen.USER_PROFILE)} className="flex flex-col items-center gap-1 text-slate-400 group hover:text-primary transition-all active:scale-95">
                <span className="material-symbols-outlined text-xl group-hover:scale-110">visibility</span>
                <span className="text-[10px] font-black uppercase tracking-tighter underline underline-offset-4 decoration-current/30 decoration-1">{(post.views / 1000).toFixed(1)}k</span>
              </button>

              <button onClick={() => navigate(AppScreen.INBOX)} className="flex flex-col items-center gap-1 text-slate-400 group hover:text-urkio-magenta transition-all active:scale-95">
                <span className="material-symbols-outlined text-xl group-hover:rotate-12">send</span>
                <span className="text-[10px] font-black uppercase tracking-tighter underline underline-offset-4 decoration-current/30 decoration-1">{t.send}</span>
              </button>

              <button onClick={() => navigate(AppScreen.USER_PROFILE)} className="flex flex-col items-center gap-1 text-slate-400 group hover:text-primary transition-all active:scale-95">
                <span className="material-symbols-outlined text-xl group-hover:scale-110">chat_bubble</span>
                <span className="text-[10px] font-black uppercase tracking-tighter underline underline-offset-4 decoration-current/30 decoration-1">{post.comments}</span>
              </button>
            </div>
          </div>
        ))}
      </main>

      <BottomNav role="USER" currentScreen={AppScreen.COMMUNITY_FEED} navigate={navigate} language={language} />
    </div>
  );
};

export default CommunityFeed;
