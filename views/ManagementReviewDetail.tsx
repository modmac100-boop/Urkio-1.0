
import React, { useState } from 'react';
import { AppScreen, Expert } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
  expert: Expert | null;
}

const ManagementReviewDetail: React.FC<Props> = ({ navigate, expert }) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!expert) return null;

  const handleApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      setIsSuccess(true);
      setTimeout(() => navigate(AppScreen.MANAGEMENT_DASHBOARD), 2500);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#050b1a] flex items-center justify-center animate-in fade-in duration-500">
        <div className="text-center px-10 animate-in zoom-in duration-300">
          <div className="size-24 rounded-[2.5rem] urkio-gradient flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/40 relative">
             <div className="absolute inset-0 bg-emerald-500/20 blur-3xl animate-pulse"></div>
             <span className="material-symbols-outlined text-white text-5xl font-black relative z-10">verified</span>
          </div>
          <h3 className="text-3xl font-black mb-3 font-display text-white">Expert Verified</h3>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
            {expert.name}'s credentials have been approved. They now have full access to the Expert Dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#050b1a] text-white max-w-md mx-auto shadow-2xl font-sans overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-[#050b1a]/90 backdrop-blur-xl p-6 border-b border-white/5 flex items-center justify-between">
        <button 
          onClick={() => navigate(AppScreen.MANAGEMENT_DASHBOARD)} 
          className="size-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined text-slate-400">arrow_back_ios_new</span>
        </button>
        <div className="text-center">
           <h2 className="text-sm font-black uppercase tracking-widest text-white">Verify Credentials</h2>
           <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-primary">Case: #PRO-{expert.id.slice(-4)}</p>
        </div>
        <div className="w-11"></div>
      </header>

      <main className="p-6 space-y-10 pb-40 no-scrollbar overflow-y-auto">
        {/* Applicant Profile Card */}
        <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center text-center">
           <div className="size-24 rounded-[2rem] overflow-hidden border-2 border-white/10 mb-6 shadow-2xl">
              <img src={expert.image} className="size-full object-cover" alt={expert.name} />
           </div>
           <h3 className="text-2xl font-black mb-1 font-display">{expert.name}</h3>
           <p className="text-primary font-black text-sm uppercase tracking-widest mb-4">{expert.title}</p>
           <div className="flex gap-3">
              <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase text-slate-500 tracking-tighter">{expert.studyLevel}</span>
              <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase text-slate-500 tracking-tighter">{expert.experience}</span>
           </div>
        </section>

        {/* Application Letter */}
        <section className="space-y-4">
           <div className="px-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">history_edu</span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Letter to Management</h3>
           </div>
           <div className="bg-white/5 border border-white/10 rounded-[2rem] p-7 text-sm text-slate-300 leading-relaxed font-medium italic shadow-inner">
              "{expert.applicationLetter}"
              <p className="text-[8px] font-black text-slate-600 uppercase mt-6 tracking-widest">Character Count: {expert.applicationLetter?.length || 0} / 700</p>
           </div>
        </section>

        {/* Document Verification Section */}
        <section className="space-y-4">
           <div className="px-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-accent-cyan text-sm">inventory</span>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Uploaded Documents</h3>
           </div>
           
           <div className="space-y-3">
              <div className="p-5 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                 <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                       <span className="material-symbols-outlined">workspace_premium</span>
                    </div>
                    <div>
                       <h4 className="text-sm font-black uppercase tracking-widest">Specialist License</h4>
                       <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">verified_certificate_01.pdf</p>
                    </div>
                 </div>
                 <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">open_in_new</span>
              </div>

              <div className="p-5 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                 <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-accent-cyan/10 text-accent-cyan flex items-center justify-center">
                       <span className="material-symbols-outlined">description</span>
                    </div>
                    <div>
                       <h4 className="text-sm font-black uppercase tracking-widest">Full CV / Resume</h4>
                       <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">alex_j_clinical_resume.pdf</p>
                    </div>
                 </div>
                 <span className="material-symbols-outlined text-accent-cyan group-hover:scale-110 transition-transform">open_in_new</span>
              </div>
           </div>
        </section>

        {/* Compliance Footer */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 flex gap-4">
           <div className="size-10 shrink-0 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <span className="material-symbols-outlined text-xl">shield_person</span>
           </div>
           <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              Identity confirmed via Global Health ID sync. Application meets all Urkio Clinical Standards for specialist onboarding.
           </p>
        </div>
      </main>

      {/* Verification Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-[#050b1a]/95 backdrop-blur-2xl border-t border-white/10 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
         <div className="flex gap-3">
            <button 
              onClick={() => navigate(AppScreen.MANAGEMENT_DASHBOARD)}
              className="flex-1 h-16 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 active:scale-95 transition-all"
            >
               Reject Application
            </button>
            <button 
              onClick={handleApprove}
              disabled={isApproving}
              className="flex-[2] h-16 urkio-gradient rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 flex items-center justify-center gap-4 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isApproving ? (
                <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Approve Credentials
                  <span className="material-symbols-outlined text-xl">verified</span>
                </>
              )}
            </button>
         </div>
         <p className="text-center text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mt-6 italic">Urkio Management Authorization Required</p>
      </footer>
    </div>
  );
};

export default ManagementReviewDetail;
