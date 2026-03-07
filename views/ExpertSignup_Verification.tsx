
import React, { useState, useRef } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const ExpertSignup_Verification: React.FC<Props> = ({ navigate }) => {
  const [formData, setFormData] = useState({
    fullName: 'Dr. Aris Varma',
    email: 'aris.varma@clinical.com',
    phone: '+1 (555) 012-3456',
    professionalId: 'MED-99281-X',
  });

  const [isUploadingCert, setIsUploadingCert] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [letter, setLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const certInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const MAX_CHARS = 700;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cert' | 'cv') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'cert') {
      setIsUploadingCert(true);
      setTimeout(() => {
        setCertFile(file);
        setIsUploadingCert(false);
      }, 1500);
    } else {
      setIsUploadingCv(true);
      setTimeout(() => {
        setCvFile(file);
        setIsUploadingCv(false);
      }, 1500);
    }
  };

  const handleSubmit = () => {
    if (!certFile || !cvFile || !letter.trim() || letter.length > MAX_CHARS) return;
    
    setIsSubmitting(true);
    // Simulate transmission to Urkio Management
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(AppScreen.EXPERT_SIGNUP_FOCUS);
    }, 2500);
  };

  const isFormValid = certFile && cvFile && letter.trim().length > 0 && letter.length <= MAX_CHARS;

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background-dark text-white max-w-md mx-auto shadow-2xl font-sans overflow-hidden">
      {/* Immersive Background Decor */}
      <div className="absolute top-0 right-0 w-full h-96 urkio-gradient opacity-10 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      
      <header className="relative z-10 p-8 flex items-center justify-between bg-background-dark/40 backdrop-blur-md border-b border-white/5 sticky top-0">
        <button onClick={() => navigate(AppScreen.EXPERT_SIGNUP_INFO)} className="size-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
        </button>
        <div className="text-center">
          <h2 className="text-sm font-black uppercase tracking-widest text-white">Apply Now</h2>
          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-primary">Management Submission</p>
        </div>
        <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-xl fill-1">verified</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-8 pt-8 pb-12 flex flex-col no-scrollbar overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight mb-3 font-display">Credential Review</h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">Fill in your full details and upload required documentation for our clinical board.</p>
        </div>

        <div className="space-y-8 flex-1">
          {/* Identity Details */}
          <section className="space-y-4">
             <div className="px-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">person</span>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Applicant Identity</h3>
             </div>
             <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Legal Name</label>
                   <input 
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm font-medium focus:ring-2 focus:ring-primary/40"
                      placeholder="As it appears on your license"
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Work Email</label>
                      <input 
                         value={formData.email}
                         className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm font-medium opacity-60 cursor-not-allowed"
                         readOnly
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone Number</label>
                      <input 
                         value={formData.phone}
                         onChange={e => setFormData({...formData, phone: e.target.value})}
                         className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm font-medium focus:ring-2 focus:ring-primary/40"
                         placeholder="+1..."
                      />
                   </div>
                </div>
             </div>
          </section>

          {/* Document Uploads */}
          <section className="space-y-4">
             <div className="px-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">inventory</span>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Professional Documents</h3>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                {/* Certificate */}
                <input 
                  type="file" 
                  ref={certInputRef} 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'cert')} 
                />
                <div 
                  onClick={() => !isUploadingCert && certInputRef.current?.click()}
                  className={`h-40 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center p-4 text-center gap-2 transition-all relative overflow-hidden group cursor-pointer ${
                    certFile ? 'bg-emerald-500/10 border-emerald-500' : 'bg-white/5 border-white/10 hover:border-primary/50'
                  }`}
                >
                   {isUploadingCert ? (
                     <div className="flex flex-col items-center gap-2">
                       <div className="size-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                       <span className="text-[8px] font-black uppercase tracking-widest text-primary">Uploading...</span>
                     </div>
                   ) : certFile ? (
                     <>
                       <div className="size-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                          <span className="material-symbols-outlined fill-1">check_circle</span>
                       </div>
                       <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest truncate w-full px-2">{certFile.name}</span>
                     </>
                   ) : (
                     <>
                       <span className="material-symbols-outlined text-white/40 text-3xl group-hover:scale-110 transition-transform">workspace_premium</span>
                       <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Upload License</span>
                     </>
                   )}
                </div>

                {/* CV */}
                <input 
                  type="file" 
                  ref={cvInputRef} 
                  className="hidden" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'cv')} 
                />
                <div 
                  onClick={() => !isUploadingCv && cvInputRef.current?.click()}
                  className={`h-40 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center p-4 text-center gap-2 transition-all relative overflow-hidden group cursor-pointer ${
                    cvFile ? 'bg-emerald-500/10 border-emerald-500' : 'bg-white/5 border-white/10 hover:border-primary/50'
                  }`}
                >
                   {isUploadingCv ? (
                     <div className="flex flex-col items-center gap-2">
                       <div className="size-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                       <span className="text-[8px] font-black uppercase tracking-widest text-primary">Uploading...</span>
                     </div>
                   ) : cvFile ? (
                     <>
                       <div className="size-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                          <span className="material-symbols-outlined fill-1">description</span>
                       </div>
                       <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest truncate w-full px-2">{cvFile.name}</span>
                     </>
                   ) : (
                     <>
                       <span className="material-symbols-outlined text-white/40 text-3xl group-hover:scale-110 transition-transform">article</span>
                       <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Upload CV</span>
                     </>
                   )}
                </div>
             </div>
          </section>

          {/* Letter to Management */}
          <section className="space-y-4">
             <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2">
                   <span className="material-symbols-outlined text-primary text-sm">history_edu</span>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Letter to Management</h3>
                </div>
                <span className={`text-[9px] font-black tracking-[0.2em] uppercase ${letter.length > MAX_CHARS ? 'text-red-500' : 'text-slate-500'}`}>
                  {letter.length} / {MAX_CHARS}
                </span>
             </div>
             <div className="relative group">
                <div className="absolute inset-0 bg-primary/5 rounded-[2rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <textarea 
                   value={letter}
                   onChange={(e) => setLetter(e.target.value)}
                   className="relative w-full h-56 bg-white/5 border border-white/10 rounded-[2rem] p-6 text-sm text-white focus:ring-2 focus:ring-primary/40 leading-relaxed font-medium placeholder:text-slate-700 resize-none no-scrollbar"
                   placeholder="Introduce your philosophy and specialized expertise to our board..."
                />
             </div>
             <p className="text-[8px] text-slate-600 italic px-2">This letter is the primary document reviewed by our clinical directors during the verification phase.</p>
          </section>
        </div>

        {/* Security / Compliance Banner */}
        <div className="mt-12 p-6 bg-accent-cyan/10 border border-accent-cyan/20 rounded-[2.5rem] flex gap-4 animate-pulse">
           <div className="size-12 shrink-0 rounded-2xl bg-accent-cyan/20 flex items-center justify-center text-accent-cyan shadow-inner">
              <span className="material-symbols-outlined text-2xl">shield_lock</span>
           </div>
           <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              Application integrity secured. All clinical documents are encrypted using <span className="text-accent-cyan font-bold">AES-256 Protocol</span> before reaching Urkio Management.
           </p>
        </div>
      </main>

      <footer className="p-8 bg-background-dark/80 backdrop-blur-3xl border-t border-white/10 z-20 flex flex-col gap-4">
        <button 
          disabled={!isFormValid || isSubmitting}
          onClick={handleSubmit}
          className="w-full h-18 urkio-gradient rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
        >
          {isSubmitting ? (
            <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              Submit Application
              <span className="material-symbols-outlined text-[20px]">send</span>
            </>
          )}
        </button>
        <p className="text-center text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">Official Clinical Onboarding Reference: #TX-99-APPLY</p>
      </footer>

      {isSubmitting && (
        <div className="fixed inset-0 z-[100] bg-background-dark/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-700">
           <div className="text-center px-10">
              <div className="relative mb-8">
                 <div className="absolute inset-0 bg-primary/20 blur-[60px] animate-pulse"></div>
                 <div className="size-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto relative z-10"></div>
              </div>
              <h3 className="text-2xl font-black mb-3 font-display">Syncing Vaults</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Transmitting to Urkio Management HQ</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default ExpertSignup_Verification;
