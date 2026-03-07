
import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';

interface PrescribedTask {
  id: string;
  title: string;
  category: 'Nutrition' | 'Mindset' | 'Physical';
  description: string;
  frequency: string;
  isCompleted: boolean;
  expertNote: string;
}

const INITIAL_TASKS: PrescribedTask[] = [
  { 
    id: 't1', 
    title: '15m Morning Sun', 
    category: 'Mindset', 
    description: 'Reset circadian rhythm with direct light before 9 AM.', 
    frequency: 'Daily',
    isCompleted: true,
    expertNote: "Alex, notice how your energy levels shifts when you hit this early. The light signal is your body's first command of the day."
  },
  { 
    id: 't2', 
    title: 'Box Breathing (4-4-4)', 
    category: 'Mindset', 
    description: 'Immediate cortisol regulation during stressful triggers.', 
    frequency: 'PRN',
    isCompleted: false,
    expertNote: "This is your tool for the Wedneday spikes we saw in your report. You have the power to regulate your nervous system in 60 seconds."
  },
  { 
    id: 't3', 
    title: 'Protein-First Meal', 
    category: 'Nutrition', 
    description: 'Stabilize blood sugar to reduce baseline anxiety.', 
    frequency: 'Daily',
    isCompleted: true,
    expertNote: "Glucose spikes can mimic anxiety symptoms. By leading with protein, we protect your baseline mood."
  },
  { 
    id: 't4', 
    title: 'Screen-Free Twilight', 
    category: 'Physical', 
    description: 'No blue light 60 minutes before scheduled rest.', 
    frequency: 'Daily',
    isCompleted: false,
    expertNote: "Blue light suppresses melatonin for up to 2 hours. Give your pineal gland the darkness it needs to recover."
  }
];

const ActionPlanTracker: React.FC<{ navigate: (s: AppScreen) => void }> = ({ navigate }) => {
  const [tasks, setTasks] = useState<PrescribedTask[]>(INITIAL_TASKS);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t);
    setTasks(updatedTasks);
    
    // Check if all are completed now
    if (updatedTasks.every(t => t.isCompleted)) {
      setTimeout(() => navigate(AppScreen.GOAL_CELEBRATION), 600);
    }
  };

  const completedCount = tasks.filter(t => t.isCompleted).length;
  const progressPercent = (completedCount / tasks.length) * 100;

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl font-sans overflow-x-hidden">
      {/* Header with Progress Visualization */}
      <header className="relative bg-white dark:bg-background-dark pt-12 pb-10 px-6 border-b border-gray-100 dark:border-white/5 z-10">
        <div className="flex items-center justify-between mb-10">
           <button 
             onClick={() => navigate(AppScreen.USER_DASHBOARD)} 
             className="size-11 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 active:scale-90 transition-all shadow-sm"
           >
             <span className="material-symbols-outlined text-slate-500">arrow_back_ios_new</span>
           </button>
           <div className="text-center">
              <h1 className="text-xl font-black font-display tracking-tight leading-none mb-1">Your Action Plan</h1>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Specialist prescribed</p>
           </div>
           <button className="size-11 flex items-center justify-center rounded-2xl bg-primary/5 text-primary">
              <span className="material-symbols-outlined">analytics</span>
           </button>
        </div>

        {/* Progress Ring Hero */}
        <div className="flex items-center gap-8 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2.5rem] shadow-inner">
           <div className="relative size-24 shrink-0 flex items-center justify-center">
              <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                 <path 
                   className="stroke-slate-200 dark:stroke-white/5" 
                   strokeDasharray="100, 100" 
                   strokeWidth="3" 
                   fill="none" 
                   d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                 />
                 <path 
                   className="stroke-primary transition-all duration-1000 ease-out" 
                   strokeDasharray={`${progressPercent}, 100`} 
                   strokeWidth="3" 
                   strokeLinecap="round" 
                   fill="none" 
                   d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                 />
              </svg>
              <div className="absolute flex flex-col items-center">
                 <span className="text-2xl font-black font-display">{completedCount}/{tasks.length}</span>
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Done</span>
              </div>
           </div>
           <div className="flex-1 space-y-3">
              <div>
                 <h4 className="text-sm font-black">Daily Momentum</h4>
                 <p className="text-[10px] text-slate-500 font-medium">Keep going Alex, you're almost there.</p>
              </div>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1 text-urkio-magenta">
                    <span className="material-symbols-outlined text-sm fill-1">local_fire_department</span>
                    <span className="text-xs font-black">4 Day Streak</span>
                 </div>
                 <div className="size-1 bg-slate-300 rounded-full"></div>
                 <p className="text-[9px] font-bold text-primary uppercase">Active Goal</p>
              </div>
           </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-10 pb-40 no-scrollbar overflow-y-auto">
        {/* Task List */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Prescribed Tasks</h3>
              <span className="text-[8px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">Protocol: Clinical v4</span>
           </div>

           <div className="space-y-4">
              {tasks.map(task => (
                <div 
                  key={task.id}
                  className={`bg-white dark:bg-slate-900 border rounded-[2rem] transition-all shadow-sm overflow-hidden ${
                    task.isCompleted ? 'border-emerald-500/20 grayscale-[0.5] opacity-80' : 'border-gray-100 dark:border-white/5'
                  } ${expandedId === task.id ? 'ring-2 ring-primary shadow-xl' : ''}`}
                >
                   <div 
                     className="p-5 flex items-center gap-4 cursor-pointer"
                     onClick={() => setExpandedId(expandedId === task.id ? null : task.id)}
                   >
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                        className={`size-12 rounded-2xl flex items-center justify-center transition-all ${
                          task.isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 dark:bg-background-dark text-slate-400'
                        }`}
                      >
                         <span className="material-symbols-outlined text-2xl font-black">{task.isCompleted ? 'check' : 'circle'}</span>
                      </button>
                      
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-center mb-0.5">
                            <h4 className={`text-sm font-black truncate ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>{task.title}</h4>
                            <span className="text-[8px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-md">{task.category}</span>
                         </div>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">{task.frequency}</p>
                      </div>

                      <span className={`material-symbols-outlined text-slate-300 transition-transform ${expandedId === task.id ? 'rotate-180' : ''}`}>expand_more</span>
                   </div>

                   {/* Expanded Detail Panel */}
                   {expandedId === task.id && (
                     <div className="px-5 pb-6 pt-2 space-y-5 animate-in slide-in-from-top-4 duration-300">
                        <div className="p-4 bg-slate-50 dark:bg-background-dark rounded-2xl">
                           <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                              {task.description}
                           </p>
                        </div>

                        {/* Specialist Insight Section */}
                        <div className="relative">
                           <div className="absolute -left-1 top-0 bottom-0 w-1 urkio-gradient rounded-full opacity-40"></div>
                           <div className="pl-5 space-y-3">
                              <div className="flex items-center gap-2">
                                 <img src="https://picsum.photos/seed/expert/40/40" className="size-6 rounded-lg object-cover" alt="Dr Aris" />
                                 <p className="text-[9px] font-black uppercase tracking-widest text-primary">Specialist Motivational Note</p>
                              </div>
                              <p className="text-sm text-slate-900 dark:text-slate-200 italic font-medium leading-relaxed">
                                 "{task.expertNote}"
                              </p>
                           </div>
                        </div>

                        <div className="pt-2 flex gap-3">
                           <button className="flex-1 h-11 bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-primary transition-all">Details</button>
                           <button 
                             onClick={() => toggleTask(task.id)}
                             className={`flex-[2] h-11 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg ${
                               task.isCompleted ? 'bg-slate-100 dark:bg-slate-700 text-slate-400' : 'urkio-gradient text-white'
                             }`}
                           >
                              {task.isCompleted ? 'Undo Completion' : 'Mark as Complete'}
                           </button>
                        </div>
                     </div>
                   )}
                </div>
              ))}
           </div>
        </section>

        {/* Clinical Sync Banner */}
        <section className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 flex gap-4">
           <div className="size-10 shrink-0 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <span className="material-symbols-outlined text-xl fill-1">verified_user</span>
           </div>
           <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Your task completion data is securely synced with your <span className="text-emerald-500 font-bold">Wellness Report</span> to help your specialist adjust your clinical care path based on your Homii reflections.
           </p>
        </section>

        {/* Streak Reassurance */}
        <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden text-center group">
           <div className="absolute top-0 right-0 p-4 opacity-10 translate-x-4 -translate-y-4 group-hover:rotate-12 transition-transform duration-700">
              <span className="material-symbols-outlined text-9xl text-urkio-magenta">local_fire_department</span>
           </div>
           <div className="relative z-10">
              <h4 className="text-2xl font-black font-display mb-1">Consistency is Key</h4>
              <p className="text-slate-400 text-xs font-medium mb-6 px-4">Maintain your streak to build long-term neuroplasticity and sustainable health habits.</p>
              <div className="flex justify-center gap-1.5">
                 {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                   <div key={i} className="flex flex-col items-center gap-2">
                      <div className={`size-8 rounded-full flex items-center justify-center border-2 transition-all ${i < 4 ? 'bg-urkio-magenta border-urkio-magenta text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-600'}`}>
                         <span className="material-symbols-outlined text-xs">{i < 4 ? 'check' : 'circle'}</span>
                      </div>
                      <span className={`text-[8px] font-black ${i < 4 ? 'text-urkio-magenta' : 'text-slate-600'}`}>{day}</span>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-white/90 dark:bg-background-dark/95 backdrop-blur-3xl border-t border-gray-100 dark:border-white/5 z-50 flex items-center justify-center">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Protocol Active • Secured by Clinical Bridge™</p>
      </footer>
    </div>
  );
};

export default ActionPlanTracker;
