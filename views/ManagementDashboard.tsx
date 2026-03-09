
import React from 'react';
import { AppScreen, Expert, UserRole } from '../types';

const PENDING_EXPERTS: Expert[] = [
   {
      id: 'exp_alex',
      name: 'Alex Johnson',
      title: 'Functional Dietitian',
      experience: '12 yrs exp',
      rating: 0,
      reviews: 0,
      image: 'https://picsum.photos/seed/u4/200/200',
      expertise: ['Gut Health', 'Metabolism'],
      studyLevel: 'Master’s Degree',
      applicationLetter: 'I have been practicing functional nutrition for over a decade. My approach centers on the gut-brain axis, helping seekers find peace through physiology. I believe Urkio is the perfect platform to scale my impact.'
   },
   {
      id: 'exp_marcus',
      name: 'Marcus Chen',
      title: 'Clinical Psychologist',
      experience: '8 yrs exp',
      rating: 0,
      reviews: 0,
      image: 'https://picsum.photos/seed/marcus/200/200',
      expertise: ['CBT', 'Anxiety'],
      studyLevel: 'Doctorate',
      applicationLetter: 'Verification request for clinical practice. Specialized in trauma-informed care and cognitive behavioral therapies for high-stress professionals.'
   }
];

interface Props {
   navigate: (screen: AppScreen, expert?: Expert) => void;
   role: UserRole;
   handleLogout: () => void;
}

const ManagementDashboard: React.FC<Props> = ({ navigate, role, handleLogout }) => {
   const isBoard = role === 'BOARD';

   return (
      <div className="relative min-h-screen w-full flex flex-col bg-[#050b1a] text-white max-w-md mx-auto shadow-2xl font-sans overflow-x-hidden">
         <header className="sticky top-0 z-50 bg-[#050b1a]/90 backdrop-blur-xl p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className={`size-10 rounded-xl flex items-center justify-center border ${isBoard ? 'bg-amber-500/20 text-amber-500 border-amber-500/20' : 'bg-primary/20 text-primary border border-primary/20'
                  }`}>
                  <span className="material-symbols-outlined text-2xl">{isBoard ? 'stars' : 'admin_panel_settings'}</span>
               </div>
               <div>
                  <h1 className="text-lg font-black tracking-tight leading-none mb-1">
                     {isBoard ? 'The Board Core' : 'Case Management'}
                  </h1>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                     {isBoard ? 'Global Strategy & Integrity' : 'Clinical Triage Command'}
                  </p>
               </div>
            </div>
            <button
               onClick={handleLogout}
               className="size-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-90 transition-all"
            >
               <span className="material-symbols-outlined text-slate-400">logout</span>
            </button>
         </header>

         <main className="p-6 space-y-10">
            {isBoard ? (
               /* Board Strategic View */
               <>
                  <section className="space-y-6">
                     <div className="px-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-500 text-sm">insights</span>
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Global Health Intelligence</h3>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                              <span className="material-symbols-outlined text-4xl">groups</span>
                           </div>
                           <p className="text-[8px] font-black uppercase text-slate-500 mb-2">Total Seekers</p>
                           <h2 className="text-3xl font-black font-display">12.4k</h2>
                           <p className="text-[8px] text-emerald-500 font-bold mt-2">+12% Monthly</p>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                              <span className="material-symbols-outlined text-4xl">medical_services</span>
                           </div>
                           <p className="text-[8px] font-black uppercase text-slate-500 mb-2">Active Experts</p>
                           <h2 className="text-3xl font-black font-display">142</h2>
                           <p className="text-[8px] text-primary font-bold mt-2">v4.2 Certified</p>
                        </div>
                     </div>
                  </section>

                  {/* Advanced Admin Access for Board */}
                  <section className="animate-in fade-in zoom-in duration-700">
                     <div
                        onClick={() => navigate(AppScreen.BOARD_ADMIN_PANEL)}
                        className="relative overflow-hidden bg-slate-900 border border-primary rounded-[3rem] p-10 shadow-[0_0_40px_rgba(19,91,236,0.3)] cursor-pointer group active:scale-[0.98] transition-all"
                     >
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-1000">
                           <span className="material-symbols-outlined text-9xl text-primary">hub</span>
                        </div>
                        <div className="relative z-10 text-center space-y-6">
                           <div className="size-20 rounded-[2rem] urkio-gradient mx-auto flex items-center justify-center text-white shadow-2xl">
                              <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
                           </div>
                           <div>
                              <h4 className="text-2xl font-black font-display text-white mb-2">Advanced Control Hub</h4>
                              <p className="text-slate-400 text-xs font-medium leading-relaxed">Platform-wide activity discovery, clinical telemetry, and emergency oversight command.</p>
                           </div>
                           <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest group-hover:translate-x-2 transition-transform">
                              Launch Command Center <span className="material-symbols-outlined">arrow_forward</span>
                           </div>
                        </div>
                     </div>
                  </section>

                  <section className="bg-amber-500/10 border border-amber-500/20 rounded-[2.5rem] p-8 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                        <span className="material-symbols-outlined text-9xl">gavel</span>
                     </div>
                     <div className="relative z-10">
                        <h4 className="text-xl font-black mb-2 font-display text-amber-500">Board Policy Oversight</h4>
                        <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">
                           Review platform-wide compliance, clinical safety escalations, and global expert vetting protocols.
                        </p>
                        <button className="w-full h-12 bg-amber-500 text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-amber-500/20 active:scale-95 transition-all">
                           Generate Audit Report
                        </button>
                     </div>
                  </section>
               </>
            ) : (
               /* Case Manager View */
               <>
                  <section className="grid grid-cols-2 gap-4">
                     <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
                        <p className="text-[8px] font-black uppercase text-slate-500 mb-2">Pending Reviews</p>
                        <h2 className="text-3xl font-black font-display">{PENDING_EXPERTS.length}</h2>
                     </div>
                     <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6">
                        <p className="text-[8px] font-black uppercase text-emerald-500 mb-2">Verified Today</p>
                        <h2 className="text-3xl font-black font-display text-emerald-400">14</h2>
                     </div>
                  </section>

                  <section className="space-y-6">
                     <div className="flex items-center justify-between px-1">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Expert Applications</h3>
                        <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">New Requests</span>
                     </div>

                     <div className="space-y-4">
                        {PENDING_EXPERTS.map(expert => (
                           <div
                              key={expert.id}
                              onClick={() => navigate(AppScreen.MANAGEMENT_REVIEW_DETAIL, expert)}
                              className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 hover:bg-white/10 transition-all cursor-pointer group active:scale-[0.98]"
                           >
                              <div className="flex items-start gap-4 mb-4">
                                 <div className="size-16 rounded-2xl overflow-hidden border-2 border-white/10 shrink-0">
                                    <img src={expert.image} className="size-full object-cover" alt={expert.name} />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <h4 className="text-base font-black truncate">{expert.name}</h4>
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{expert.title}</p>
                                    <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-tighter">Submitted 2h ago</p>
                                 </div>
                                 <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined">description</span>
                                 </div>
                              </div>
                              <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                                 <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                                    <span className="text-primary font-black uppercase tracking-widest mr-2">Letter Preview:</span>
                                    {expert.applicationLetter}
                                 </p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </section>
               </>
            )}
         </main>

         <footer className="mt-auto p-12 text-center opacity-40">
            <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">
               {isBoard ? 'Board Integrity Signature: #9912-ELITE' : 'Management Protocol v4.2'}
            </p>
         </footer>
      </div>
   );
};

export default ManagementDashboard;
