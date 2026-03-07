import React, { useState, useMemo } from 'react';
import { AppScreen, Circle, Post, Expert, Resource } from '../types';

interface Props {
  navigate: (screen: AppScreen, expert?: Expert, query?: string, resource?: Resource, circle?: Circle) => void;
  circle: Circle | null;
}

const CircleDiscussion: React.FC<Props> = ({ navigate, circle }) => {
  const [activeFilter, setActiveFilter] = useState<'Recent' | 'Experts' | 'My Posts'>('Recent');
  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Convert MOCK_POSTS to state for editing
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'p1',
      authorName: circle?.expertModerator || "Expert Moderator",
      authorType: 'Expert Moderator',
      authorImage: circle?.expertAvatar || "",
      content: "Welcome to the circle! Remember that morning light exposure for at least 15 minutes can significantly improve your baseline anxiety levels. I've pinned a detailed guide at the top for everyone to review.",
      time: '1h ago',
      isExpert: true,
      isPinned: true,
      likes: 245,
      comments: 12,
      reposts: 15,
      views: 1240
    },
    {
      id: 'p2',
      authorName: 'Alex Johnson',
      authorType: 'Hall of Fame Legend',
      authorImage: 'https://picsum.photos/seed/u4/100/100',
      content: "I started using the 4-7-8 breathing technique before school drop-off and it's been a game changer. The kids even started doing it with me!",
      time: '2h ago',
      likes: 89,
      comments: 8,
      reposts: 7,
      views: 789
    },
    {
      id: 'p3',
      authorName: 'Anonymous Member',
      authorType: 'Community Member',
      authorImage: '',
      content: "Does anyone else find it particularly hard to implement these routines when the kids are also having a rough morning? I feel like my self-care is always the first thing to go.",
      time: '3h ago',
      isAnonymous: true,
      likes: 56,
      comments: 24,
      reposts: 2,
      views: 456
    }
  ]);

  // Inline Editing state
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!circle) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background-dark text-center px-8">
        <span className="material-symbols-outlined text-6xl text-slate-700 mb-4">error</span>
        <h2 className="text-xl font-black mb-2">Circle Not Found</h2>
        <button onClick={() => navigate(AppScreen.COMMUNITY_CIRCLES)} className="text-primary font-black uppercase tracking-widest text-xs mt-4">Back to Circles</button>
      </div>
    );
  }

  const filteredPosts = useMemo(() => {
    let list = posts;
    if (activeFilter === 'Experts') list = posts.filter(p => p.isExpert);
    if (activeFilter === 'My Posts') list = posts.filter(p => p.authorName === 'Alex Johnson');
    return list;
  }, [activeFilter, posts]);

  const handlePostSubmit = () => {
    if (!postContent.trim()) return;
    const newPost: Post = {
        id: Date.now().toString(),
        authorName: isAnonymous ? 'Anonymous Member' : 'Alex Johnson',
        authorType: isAnonymous ? 'Community Member' : 'Hall of Fame Legend',
        authorImage: isAnonymous ? '' : 'https://picsum.photos/seed/u4/100/100',
        content: postContent,
        time: 'Just now',
        likes: 0,
        comments: 0,
        reposts: 0,
        views: 0,
        isAnonymous
    };
    setPosts([newPost, ...posts]);
    setIsPosting(false);
    setPostContent('');
    setIsAnonymous(false);
  };

  const startEdit = (post: Post) => {
    setEditingPostId(post.id);
    setEditBuffer(post.content);
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditBuffer('');
  };

  const saveEdit = (id: string) => {
    if (!editBuffer.trim()) return;
    setIsSaving(true);
    setTimeout(() => {
        setPosts(prev => prev.map(p => p.id === id ? { ...p, content: editBuffer } : p));
        setEditingPostId(null);
        setEditBuffer('');
        setIsSaving(false);
    }, 600);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Remove this discussion post?")) {
        setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl pb-32 font-sans overflow-x-hidden">
      {/* Immersive Circle Header */}
      <header className="relative h-64 shrink-0 overflow-hidden">
        <img src={circle.image} className="w-full h-full object-cover grayscale opacity-40" alt={circle.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-background-dark via-background-dark/20 to-transparent"></div>
        
        <div className="absolute top-8 left-6 right-6 flex items-center justify-between z-10">
          <button 
            onClick={() => navigate(AppScreen.COMMUNITY_CIRCLES)}
            className="size-11 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <button className="size-11 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
           <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-[8px] font-black uppercase text-primary tracking-widest">
                {circle.category}
              </span>
              <div className="flex items-center gap-1.5 text-white/60 text-[10px] font-bold">
                 <span className="material-symbols-outlined text-[14px]">group</span>
                 {circle.members.toLocaleString()} Members
              </div>
           </div>
           <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white leading-tight">{circle.name}</h1>
        </div>
      </header>

      {/* Discussion Controls */}
      <div className="px-6 py-6 sticky top-0 z-40 bg-slate-50/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
        <div className="flex gap-2 p-1.5 bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm">
           {['Recent', 'Experts', 'My Posts'].map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveFilter(tab as any)}
               className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
                 activeFilter === tab ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-400'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
        {/* Circle Moderator Insight */}
        <section className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] p-5 flex gap-4">
           <div className="size-12 shrink-0 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-lg">
              <img src={circle.expertAvatar} className="size-full object-cover" alt={circle.expertModerator} />
           </div>
           <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                 <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-500">Moderator Insight</h4>
                 <span className="material-symbols-outlined text-[14px] text-emerald-500 animate-pulse">sensors</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                "{circle.expertModerator} is currently active in this thread."
              </p>
           </div>
        </section>

        {/* Post Feed */}
        <div className="space-y-6">
          {filteredPosts.map(post => {
            const isOwnPost = post.authorName === 'Alex Johnson';
            const isEditing = editingPostId === post.id;
            
            return (
              <div 
                key={post.id} 
                className={`relative bg-white dark:bg-slate-900 rounded-[2.5rem] border overflow-hidden shadow-sm transition-all group ${
                  post.isExpert ? 'border-primary/20 dark:border-primary/20' : 'border-gray-100 dark:border-white/5'
                }`}
              >
                {post.isPinned && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary/10 border-b border-l border-primary/20 rounded-bl-2xl flex items-center gap-1.5">
                     <span className="material-symbols-outlined text-primary text-[14px] fill-1">push_pin</span>
                     <span className="text-[8px] font-black text-primary uppercase tracking-widest">Pinned Advice</span>
                  </div>
                )}

                <div className="p-6">
                   {/* Author Info */}
                   <div className="flex items-center gap-4 mb-5">
                      <div className={`size-12 rounded-2xl flex items-center justify-center overflow-hidden border-2 ${
                        post.isExpert ? 'border-primary shadow-lg shadow-primary/20' : 
                        post.isAnonymous ? 'bg-slate-100 dark:bg-slate-800 border-transparent' : 'border-white dark:border-slate-800'
                      }`}>
                         {post.isAnonymous ? (
                           <span className="material-symbols-outlined text-slate-400">account_circle</span>
                         ) : (
                           <img src={post.authorImage} className="size-full object-cover" alt={post.authorName} />
                         )}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 mb-0.5">
                            <h4 className={`text-sm font-black truncate ${post.isExpert ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{post.authorName}</h4>
                            {post.isExpert && <span className="material-symbols-outlined text-primary text-[16px] fill-1">verified</span>}
                         </div>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{post.authorType} • {post.time}</p>
                      </div>
                      
                      {isOwnPost && !isEditing && (
                        <button 
                           onClick={() => startEdit(post)}
                           className="size-8 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90"
                        >
                           <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      )}
                   </div>

                   {/* Content Area */}
                   <div className="mb-6">
                      {isEditing ? (
                         <div className="space-y-4 animate-in slide-in-from-top-1 duration-300">
                            <textarea 
                               autoFocus
                               value={editBuffer}
                               onChange={(e) => setEditBuffer(e.target.value)}
                               className="w-full h-32 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-4 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/40 no-scrollbar"
                            />
                            <div className="flex justify-between items-center">
                               <button onClick={() => handleDelete(post.id)} className="text-red-500 text-[10px] font-black uppercase flex items-center gap-1">
                                  <span className="material-symbols-outlined text-sm">delete</span> Delete
                               </button>
                               <div className="flex gap-2">
                                  <button onClick={cancelEdit} className="px-4 py-2 text-[10px] font-black uppercase text-slate-500">Cancel</button>
                                  <button 
                                     onClick={() => saveEdit(post.id)} 
                                     disabled={isSaving}
                                     className="px-6 py-2.5 urkio-gradient text-white rounded-xl text-[10px] font-black uppercase shadow-lg flex items-center gap-2"
                                  >
                                     {isSaving && <span className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                                     {isSaving ? 'Saving...' : 'Sync'}
                                  </button>
                               </div>
                            </div>
                         </div>
                      ) : (
                         <p className={`text-sm leading-relaxed font-medium ${
                           post.isExpert ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'
                         }`}>
                           {post.content}
                         </p>
                      )}
                   </div>

                   {/* Footer Actions */}
                   <div className="flex items-center justify-between pt-5 border-t border-gray-50 dark:border-white/5">
                      <div className="flex gap-4">
                         <button className="flex items-center gap-2 group transition-all">
                            <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-primary">volunteer_activism</span>
                            <span className="text-xs font-black text-slate-500">{post.likes}</span>
                         </button>
                         <button className="flex items-center gap-2 group transition-all">
                            <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-urkio-magenta">chat_bubble</span>
                            <span className="text-xs font-black text-slate-500">{post.comments}</span>
                         </button>
                      </div>
                      <button className="size-10 flex items-center justify-center text-slate-300 hover:text-primary transition-colors">
                         <span className="material-symbols-outlined">ios_share</span>
                      </button>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-28 left-0 right-0 max-w-md mx-auto px-6 z-50">
         <button 
           onClick={() => setIsPosting(true)}
           className="w-full h-16 urkio-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
         >
            <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined">edit_note</span>
            </div>
            Start Discussion
         </button>
      </div>

      {/* Posting Modal */}
      {isPosting && (
        <div className="fixed inset-0 z-[100] bg-background-dark/95 backdrop-blur-2xl animate-in fade-in duration-300 flex flex-col items-center justify-end">
           <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[3rem] p-8 shadow-2xl flex flex-col gap-8 animate-in slide-in-from-bottom-full duration-500">
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white">Post to {circle.name}</h2>
                 <button onClick={() => setIsPosting(false)} className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>

              <textarea 
                autoFocus
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="w-full min-h-[160px] bg-slate-50 dark:bg-background-dark border-none rounded-[2rem] p-6 text-sm font-medium focus:ring-2 focus:ring-primary/40 placeholder:text-slate-400 leading-relaxed text-slate-700 dark:text-slate-200"
                placeholder="Share your thoughts, questions, or a moment of reflection..."
              />

              <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-background-dark rounded-[2rem] border border-gray-100 dark:border-white/5">
                 <div className="flex items-center gap-4">
                    <div className={`size-12 rounded-2xl flex items-center justify-center transition-all ${isAnonymous ? 'bg-slate-800 text-white shadow-lg' : 'bg-primary/10 text-primary'}`}>
                       <span className="material-symbols-outlined text-2xl">{isAnonymous ? 'visibility_off' : 'visibility'}</span>
                    </div>
                    <div>
                       <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">Post Anonymously</p>
                       <p className="text-[10px] font-medium text-slate-500">Protect your privacy in this circle</p>
                    </div>
                 </div>
                 <button 
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${isAnonymous ? 'bg-primary justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                 >
                    <div className="size-4 bg-white rounded-full shadow-lg"></div>
                 </button>
              </div>

              <button 
                onClick={handlePostSubmit}
                disabled={!postContent.trim()}
                className="w-full h-16 urkio-gradient rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
              >
                 Post Insight
                 <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
              <p className="text-center text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Guided by Specialist Moderation</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default CircleDiscussion;