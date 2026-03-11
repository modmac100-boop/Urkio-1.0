import React, { useState, useEffect } from 'react';
import { AppScreen, Expert, Resource, Circle, Member } from '../types';
import { BottomNav } from '../components/Navigation';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Props {
    navigate: (s: AppScreen, e?: Expert, q?: string, r?: Resource, c?: Circle, stories?: any[], index?: number, member?: Member) => void;
    language: 'en' | 'ar' | 'fr';
    isDarkMode: boolean;
}

const HealingJourney: React.FC<Props> = ({ navigate, language, isDarkMode }) => {
    const [code, setCode] = useState(['', '', '', '']);
    const [isActivating, setIsActivating] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [error, setError] = useState('');

    const handleCodeChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text.slice(-1);
        setCode(newCode);
        if (text && index < 3) {
            // Auto-focus next input would be nice but requires refs
        }
    };

    const handleActivate = async () => {
        const fullCode = code.join('');
        if (fullCode.length < 4) return;

        setIsActivating(true);
        setError('');
        try {
            const q = query(collection(db, 'activeCodes'), where('code', '==', fullCode), where('status', '==', 'active'));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setIsUnlocked(true);
                // In a real app, you might update the user's profile to mark the journey as unlocked
            } else {
                setError('Invalid or expired activation code.');
            }
        } catch (err) {
            console.error("Activation error:", err);
            setError('System error. Please try again.');
        } finally {
            setIsActivating(false);
        }
    };

    const courses = [
        {
            id: 1,
            title: 'Mindful Breath',
            instructor: 'Dr. Wilson',
            duration: '15 min',
            progress: 0.65,
            status: 'In Progress',
            image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 2,
            title: 'Emotional Balance',
            instructor: 'Marcus Chen',
            duration: '25 min',
            progress: 0.3,
            status: 'Starting Soon',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 3,
            title: 'Core Stability',
            instructor: 'Sarah J.',
            duration: '20 min',
            progress: 0,
            status: 'Locked',
            image: 'https://images.unsplash.com/photo-1518611012118-29617b0ccdfe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        },
        {
            id: 4,
            title: 'Sleep Hygiene',
            instructor: 'Dr. Aris',
            duration: '30 min',
            progress: 0.1,
            status: 'Paused',
            image: 'https://images.unsplash.com/photo-1511295742364-917e7043394b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        }
    ];

    return (
        <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 max-w-2xl mx-auto shadow-2xl font-sans overflow-hidden transition-colors duration-500">
            <div className="flex-1 flex flex-col soft-gradient-bg overflow-x-hidden">
                <style>{`
                    .soft-gradient-bg {
                        background: radial-gradient(circle at 50% 0%, rgba(19, 109, 236, 0.15) 0%, rgba(16, 24, 34, 1) 70%);
                    }
                `}</style>
                <header className="flex items-center p-4 justify-between border-b border-white/5 bg-background-dark/50 backdrop-blur-md">
                    <div className="flex size-12 shrink-0 items-center justify-start">
                        <span onClick={() => navigate(AppScreen.URKIO_SOCIAL_HUB)} className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-white transition-colors">arrow_back</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight">Healing Journey</h2>
                        <div className="flex items-center gap-1.5 opacity-60">
                            <span className="material-symbols-outlined text-[14px]">lock</span>
                            <span className="text-[11px] uppercase tracking-widest font-medium">Private Mode</span>
                        </div>
                    </div>
                    <div className="flex w-12 items-center justify-end">
                        <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-primary/10 text-primary hover:bg-primary/20 transition-all">
                            <span className="material-symbols-outlined">security</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 flex flex-col items-center px-6 pt-10 pb-32 overflow-y-auto no-scrollbar">
                    <div className="mb-8 text-center">
                        <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20">
                            <span className="material-symbols-outlined text-primary text-3xl">key_visualizer</span>
                        </div>
                        <h1 className="text-slate-100 text-3xl font-bold leading-tight mb-3">Enter Hidden Code</h1>
                        <p className="text-slate-400 text-base max-w-xs mx-auto">Enter your code to convert your journey and access healing courses.</p>
                    </div>

                    <div className="w-full flex flex-col items-center mb-12">
                        <div className="flex gap-3 sm:gap-4 mb-6">
                            {code.map((val, i) => (
                                <input
                                    key={i}
                                    className="flex h-16 w-12 sm:w-14 text-center rounded-xl bg-slate-800/50 border-2 border-slate-700 focus:border-primary focus:ring-0 text-2xl font-bold text-white transition-all outline-none"
                                    maxLength={1}
                                    placeholder="•"
                                    type="text"
                                    value={val}
                                    onChange={(e) => handleCodeChange(e.target.value, i)}
                                />
                            ))}
                        </div>
                        {error && <p className="text-rose-500 text-xs font-bold mb-4 animate-pulse">{error}</p>}
                        <button
                            onClick={handleActivate}
                            disabled={isActivating || code.join('').length < 4}
                            className={`w-full max-w-xs h-14 rounded-full font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${code.join('').length === 4 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                        >
                            {isActivating ? 'Verifying...' : 'Activate Now'}
                        </button>
                    </div>

                    <div className="w-full space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-slate-200 font-semibold text-lg">Available Healing Courses</h3>
                            <span className="text-primary text-sm font-medium cursor-pointer">View all</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            {courses.map((course) => (
                                <div key={course.id} className="group relative overflow-hidden rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-primary/50 transition-colors cursor-pointer shadow-sm">
                                    <div className="h-32 w-full bg-slate-800 flex items-center justify-center relative overflow-hidden">
                                        <img src={course.image} className="absolute inset-0 size-full object-cover opacity-30 group-hover:opacity-60 transition-opacity duration-500" alt="" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-primary/10"></div>
                                        <span className="material-symbols-outlined text-4xl text-primary/60 group-hover:scale-110 transition-transform">{course.id % 2 === 0 ? 'eco' : 'self_improvement'}</span>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-100">{course.title}</h4>
                                            <span className="material-symbols-outlined text-sm text-slate-500">{course.id > 2 ? 'lock' : 'lock_open'}</span>
                                        </div>
                                        <p className="text-xs text-slate-400">{course.id % 2 === 0 ? '8 Modules • Intermediate' : '12 Modules • Foundation'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                <BottomNav navigate={navigate} currentScreen={AppScreen.HEALING_JOURNEY} role="USER" language={language === 'ar' ? 'ar' : 'en'} />
            </div>
        </div>
    );
};

export default HealingJourney;
