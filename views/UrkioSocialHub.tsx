
import React, { useState, useEffect } from 'react';
import { AppScreen, Member, Post, Expert, Resource, Circle } from '../types';
import { auth, db } from '../services/firebase';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    getDocs,
    where
} from 'firebase/firestore';
import { Avatar } from '../components/Avatar';
import { BottomNav } from '../components/Navigation';

interface Props {
    navigate: (s: AppScreen, e?: Expert, q?: string, r?: Resource, c?: Circle, stories?: any[], index?: number, member?: Member) => void;
    language: 'en' | 'ar' | 'fr';
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    goBack: () => void;
}

const UrkioSocialHub: React.FC<Props> = ({ navigate, language, isDarkMode, toggleDarkMode, goBack }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [memberProfile, setMemberProfile] = useState<Member | null>(null);

    // Fetch User Profile
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, 'profiles', user.uid);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setMemberProfile({
                    id: user.uid,
                    name: data.first_name ? `${data.first_name} ${data.family_name || ''}` : 'Alex Rivera',
                    image: data.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgRCODccG-HXwoDK4TD1wgf2tGwwpd6hWvGCACeIOlQokBfm51i1zLFuQWvcZrLOMKgIyKCvbI3r3D2Cbnks3unW8JzGb_1ijLHyzNr90fPnfSjtjpYv4JBGVLdWzCM8UY_pw2mYjsGtEY30h5zQNUKtspydIwaRIeIDp2GqvEJchWTRKqZhuYyFiSqD7yZCpG1A45LRsG2DVhcXIpeEk7PH4Y_xmk2ozCZM5YORcGiFXsD27seQob8Oe22FokCSPJBGs6cTlLE6U',
                    type: data.occupation || 'Digital Product Designer | Mental Health Advocate',
                    coverImage: data.coverImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80',
                    followers: data.followers || '14.5k',
                    following: data.following || 892,
                    likesReceived: data.likesReceived || '3.4k',
                    isHallOfFame: data.isHallOfFame,
                    isEndorsed: data.isEndorsed,
                });
            }
        });
        return () => unsubscribe();
    }, []);

    // Fetch Global Activity Feed
    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts: Post[] = [];
            snapshot.forEach((doc) => {
                fetchedPosts.push({ id: doc.id, ...doc.data() } as Post);
            });
            setPosts(fetchedPosts);
        });
        return () => unsubscribe();
    }, []);

    const handleCreatePost = async () => {
        if (!newPostContent.trim() || !auth.currentUser || !memberProfile) return;
        setIsPosting(true);
        try {
            await addDoc(collection(db, 'posts'), {
                authorId: auth.currentUser.uid,
                authorName: memberProfile.name,
                authorImage: memberProfile.image,
                authorType: memberProfile.type,
                content: newPostContent,
                timestamp: serverTimestamp(),
                likes: 0,
                comments: 0,
                views: 0,
                isHallOfFame: memberProfile.isHallOfFame || false,
                isEndorsed: memberProfile.isEndorsed || false
            });
            setNewPostContent('');
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen pb-24 w-full max-w-2xl mx-auto shadow-2xl transition-colors duration-500 overflow-x-hidden">
            {/* Header Navigation */}
            <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={goBack} className="flex items-center justify-center p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold tracking-tight">Profile</h1>
                    <button onClick={() => navigate(AppScreen.SECURITY_PRIVACY)} className="flex items-center justify-center p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">settings</span>
                    </button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto">
                {/* Profile Header Section */}
                <section className="p-4 flex flex-col items-center text-center">
                    <div className="relative mb-4">
                        <div className="size-32 rounded-full border-4 border-primary p-1 shadow-2xl">
                            <div
                                className="w-full h-full rounded-full bg-cover bg-center"
                                style={{ backgroundImage: `url('${memberProfile?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgRCODccG-HXwoDK4TD1wgf2tGwwpd6hWvGCACeIOlQokBfm51i1zLFuQWvcZrLOMKgIyKCvbI3r3D2Cbnks3unW8JzGb_1ijLHyzNr90fPnfSjtjpYv4JBGVLdWzCM8UY_pw2mYjsGtEY30h5zQNUKtspydIwaRIeIDp2GqvEJchWTRKqZhuYyFiSqD7yZCpG1A45LRsG2DVhcXIpeEk7PH4Y_xmk2ozCZM5YORcGiFXsD27seQob8Oe22FokCSPJBGs6cTlLE6U'}')` }}
                            ></div>
                        </div>
                        {(memberProfile?.isHallOfFame || memberProfile?.isEndorsed) && (
                            <div className="absolute bottom-1 right-1 bg-primary text-white p-1.5 rounded-full border-2 border-background-dark dark:border-background-dark shadow-lg">
                                <span className="material-symbols-outlined text-sm block fill-1">verified</span>
                            </div>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold">{memberProfile?.name || 'Loading...'}</h2>
                    <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">{memberProfile?.type}</p>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-500 text-sm mt-1">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span>San Francisco, CA</span>
                    </div>

                    {/* Social Links Grid */}
                    <div className="grid grid-cols-4 gap-4 mt-6 w-full max-w-sm">
                        {[
                            { icon: 'public', label: 'Website' },
                            { icon: 'link', label: 'LinkedIn' },
                            { icon: 'alternate_email', label: 'Twitter' },
                            { icon: 'camera', label: 'Instagram' }
                        ].map((link, idx) => (
                            <a key={idx} className="flex flex-col items-center gap-1 group" href="#">
                                <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all shadow-sm">
                                    <span className="material-symbols-outlined">{link.icon}</span>
                                </div>
                                <span className="text-xs font-medium">{link.label}</span>
                            </a>
                        ))}
                    </div>
                </section>

                {/* Stats Row */}
                <section className="flex border-y border-slate-200 dark:border-slate-800 py-4 px-2">
                    <div className="flex-1 text-center">
                        <p className="text-lg font-bold">{posts.length}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Posts</p>
                    </div>
                    <div className="flex-1 text-center border-x border-slate-200 dark:border-slate-800">
                        <p className="text-lg font-bold">14.5k</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Followers</p>
                    </div>
                    <div className="flex-1 text-center">
                        <p className="text-lg font-bold">892</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Following</p>
                    </div>
                </section>

                {/* Privacy & Info Blocks */}
                <section className="p-4 space-y-3">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">Privacy & Transparency</h3>
                    <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">visibility</span>
                            <div>
                                <p className="font-semibold text-sm">Profile Visibility</p>
                                <p className="text-xs text-slate-500">Public (Followers & Circle)</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">shield_person</span>
                            <div>
                                <p className="font-semibold text-sm">Account Status</p>
                                <p className="text-xs text-slate-500">Active & Secured</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                    </div>
                </section>

                {/* Create Post Card */}
                <section className="px-4 mt-4">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex gap-3 items-center mb-4">
                            <div
                                className="size-10 rounded-full bg-cover bg-center shrink-0 shadow-sm"
                                style={{ backgroundImage: `url('${memberProfile?.image}')` }}
                            ></div>
                            <div className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder={`What's on your mind, ${memberProfile?.name.split(' ')[0]}?`}
                                    className="flex-1 bg-slate-100 dark:bg-slate-900 px-4 py-2.5 rounded-full text-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 border-none"
                                />
                                <button
                                    onClick={handleCreatePost}
                                    disabled={isPosting || !newPostContent.trim()}
                                    className={`size-10 rounded-full flex items-center justify-center transition-all ${newPostContent.trim() ? 'bg-primary text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}
                                >
                                    <span className="material-symbols-outlined text-lg">{isPosting ? 'sync' : 'send'}</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-around pt-3 border-t border-slate-100 dark:border-slate-700">
                            <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-emerald-500">image</span> Photo
                            </button>
                            <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-red-500">videocam</span> Video
                            </button>
                            <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-blue-500">link</span> Link
                            </button>
                        </div>
                    </div>
                </section>

                {/* Feed Section */}
                <section className="mt-6 space-y-4 px-4 pb-32">
                    {posts.map((post) => (
                        <article key={post.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="p-4 flex justify-between items-start">
                                <div className="flex gap-3">
                                    <div className="relative size-10">
                                        <img
                                            src={post.authorImage}
                                            className="w-full h-full rounded-full bg-cover bg-center shadow-sm"
                                            alt={post.authorName}
                                        />
                                        {(post.isHallOfFame || post.isEndorsed) && (
                                            <div className="absolute -bottom-0.5 -right-0.5 size-4 bg-primary text-white rounded-full border border-white dark:border-slate-800 flex items-center justify-center shadow-lg">
                                                <span className="material-symbols-outlined text-[10px] fill-1">verified</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{post.authorName}</p>
                                        <p className="text-xs text-slate-500">
                                            {post.timestamp ? '2 hours ago' : 'Just now'} • <span className="material-symbols-outlined text-[10px] align-middle">public</span>
                                        </p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">more_horiz</span></button>
                            </div>
                            <div className="px-4 pb-3">
                                <p className="text-sm leading-relaxed">{post.content}</p>
                            </div>
                            {/* Example Image for Feed - Could be dynamic if post.image exists */}
                            <div className="w-full aspect-video overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80"
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                    alt="Post Content"
                                />
                            </div>
                            <div className="p-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 mt-2">
                                <div className="flex gap-4">
                                    <button className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors group">
                                        <span className="material-symbols-outlined text-[20px] group-active:scale-125 transition-transform">favorite</span>
                                        <span className="text-xs font-semibold">{post.likes || 124}</span>
                                    </button>
                                    <button className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors group">
                                        <span className="material-symbols-outlined text-[20px] group-active:scale-125 transition-transform">chat_bubble</span>
                                        <span className="text-xs font-semibold">{post.comments || 18}</span>
                                    </button>
                                    <button className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors group">
                                        <span className="material-symbols-outlined text-[20px] group-active:scale-125 transition-transform">share</span>
                                        <span className="text-xs font-semibold">5</span>
                                    </button>
                                </div>
                                <button className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">bookmark</span>
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            </main>

            {/* Healing Journey FAB */}
            <div className="fixed bottom-24 right-4 z-40">
                <button
                    onClick={() => navigate(AppScreen.HEALING_JOURNEY)}
                    className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-full shadow-lg shadow-primary/30 font-bold hover:scale-105 active:scale-95 transition-all"
                >
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span>Enter Healing Journey</span>
                </button>
            </div>

            {/* Bottom Navigation */}
            <BottomNav navigate={navigate} currentScreen={AppScreen.URKIO_SOCIAL_HUB} role="USER" language={language === 'ar' ? 'ar' : 'en'} />
        </div>
    );
};

export default UrkioSocialHub;

