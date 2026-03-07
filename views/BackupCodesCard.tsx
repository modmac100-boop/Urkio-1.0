
import React, { useState } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const BackupCodesCard: React.FC<Props> = ({ navigate }) => {
  const [isExporting, setIsExporting] = useState(false);
  const backupCodes = ["8291-CYC", "4412-URK", "9901-HFI", "2381-SAFE", "5102-SHLD", "7712-CORE", "3391-JRN", "6620-WLS"];

  const handleExport = (type: string) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Simulate download
      const content = `Urkio Security Recovery Card\n\nGenerated for: Alex Johnson\nDate: Oct 24, 2024\n\nRecovery Codes:\n${backupCodes.join('\n')}\n\nKeep this document safe and offline.`;
      console.log(`Exported as ${type}:`, content);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-100 dark:bg-background-dark max-w-md mx-auto shadow-2xl font-sans overflow-x-hidden">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
      
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/95 backdrop-blur-xl px-6 pt-12 pb-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(AppScreen.SECURITY_PRIVACY)} 
            className="size-11 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent dark:border-white/5 active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-slate-500">arrow_back_ios_new</span>
          </button>
          <div>
            <h2 className="text-xl font-black font-display tracking-tight leading-none mb-1">Security Vault</h2>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Recovery Documentation</p>
          </div>
        </div>
        <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
           <span className="material-symbols-outlined fill-1">history_edu</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 pb-32">
        {/* The Formal Document Card */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border-t-[8px] border-primary relative overflow-hidden">
              {/* Security Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] rotate-[-15deg] pointer-events-none select-none">
                 <span className="material-symbols-outlined text-[300px]">verified_user</span>
              </div>

              <div className="relative z-10 flex flex-col gap-8">
                 {/* Document Header */}
                 <div className="flex justify-between items-start border-b border-slate-50 dark:border-white/5 pb-6">
                    <div>
                       <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-primary text-xl">shield</span>
                          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Recovery Card</h3>
                       </div>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Confidential Security Payload</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-primary">Oct 24, 2024</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase">Issue Date</p>
                    </div>
                 </div>

                 {/* Instructions */}
                 <div className="bg-slate-50 dark:bg-background-dark rounded-2xl p-5 border border-slate-100 dark:border-white/5">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                      "Each code below grants single-use access to your Urkio journey if your secondary device is lost. Keep this card in a safe, offline location."
                    </p>
                 </div>

                 {/* The Codes Grid */}
                 <div className="grid grid-cols-2 gap-4">
                    {backupCodes.map((code, i) => (
                      <div key={i} className="flex flex-col gap-1">
                         <div className="h-14 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center relative group">
                            <span className="font-mono text-sm font-black tracking-widest text-slate-800 dark:text-slate-200">{code}</span>
                            <div className="absolute inset-0 border-2 border-primary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         </div>
                         <div className="flex justify-between px-1">
                            <span className="text-[7px] font-black text-slate-400 uppercase">Slot 0{i+1}</span>
                            <span className="text-[7px] font-black text-emerald-500 uppercase">Unused</span>
                         </div>
                      </div>
                    ))}
                 </div>

                 {/* Security Meta */}
                 <div className="pt-8 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="size-12 bg-slate-50 dark:bg-background-dark rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/10">
                          <svg className="size-8" viewBox="0 0 100 100">
                             <rect x="10" y="10" width="20" height="20" fill="currentColor" className="text-slate-900 dark:text-white" />
                             <rect x="40" y="10" width="10" height="10" fill="currentColor" className="text-slate-900 dark:text-white" />
                             <rect x="10" y="40" width="10" height="10" fill="currentColor" className="text-slate-900 dark:text-white" />
                             <rect x="70" y="10" width="20" height="20" fill="currentColor" className="text-slate-900 dark:text-white" />
                             <rect x="10" y="70" width="20" height="20" fill="currentColor" className="text-slate-900 dark:text-white" />
                             <rect x="40" y="40" width="20" height="20" fill="currentColor" className="text-slate-900 dark:text-white" />
                             <rect x="70" y="70" width="20" height="20" fill="currentColor" className="text-slate-900 dark:text-white" />
                          </svg>
                       </div>
                       <div>
                          <p className="text-[10px] font-black">#8291-CYC-9912</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase">Encrypted Signature</p>
                       </div>
                    </div>
                    <div className="size-12 rounded-full border-4 border-emerald-500/20 flex items-center justify-center">
                       <span className="material-symbols-outlined text-emerald-500 fill-1 text-2xl">verified</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Action Options */}
        <section className="space-y-6">
           <div className="px-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">ios_share</span>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Export Options</h4>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleExport('PDF')}
                disabled={isExporting}
                className="p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl flex flex-col items-center gap-3 group active:scale-95 transition-all shadow-sm"
              >
                 <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Download PDF</span>
              </button>

              <button 
                onClick={() => handleExport('PRINT')}
                disabled={isExporting}
                className="p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl flex flex-col items-center gap-3 group active:scale-95 transition-all shadow-sm"
              >
                 <div className="size-12 rounded-2xl bg-urkio-magenta/10 text-urkio-magenta flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">print</span>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Print Card</span>
              </button>
           </div>
        </section>

        {/* Security Reassurance */}
        <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 urkio-gradient opacity-10 blur-3xl pointer-events-none"></div>
           <div className="relative z-10 flex gap-6 items-center">
              <div className="size-16 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                 <span className="material-symbols-outlined text-3xl text-accent-cyan fill-1 animate-pulse">lock</span>
              </div>
              <div>
                 <h4 className="text-sm font-black mb-1 font-display uppercase tracking-wider">Hi-Fi Data Security</h4>
                 <p className="text-slate-400 text-[11px] font-medium leading-relaxed">
                    Urkio never stores these codes in plain text. They are hashed using specialized clinical encryption.
                 </p>
              </div>
           </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-white/90 dark:bg-background-dark/95 backdrop-blur-3xl border-t border-gray-100 dark:border-white/5 z-50">
         <button 
           onClick={() => navigate(AppScreen.USER_DASHBOARD)}
           className="w-full h-16 urkio-gradient rounded-[1.8rem] text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 active:scale-95 transition-all"
         >
           I've Saved My Codes
           <span className="material-symbols-outlined">check</span>
         </button>
      </footer>

      {isExporting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background-dark/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl flex flex-col items-center text-center gap-6 border border-white/10 mx-6">
              <div className="size-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div>
                 <h3 className="text-xl font-black mb-2">Preparing Document</h3>
                 <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Encrypting PDF stream...</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default BackupCodesCard;
