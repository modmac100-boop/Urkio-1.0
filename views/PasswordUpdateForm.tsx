
import React, { useState } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const PasswordUpdateForm: React.FC<Props> = ({ navigate }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(AppScreen.PASSWORD_UPDATED_SUCCESS);
    }, 1500);
  };

  const isMatch = password && confirmPassword && password === confirmPassword;

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-purple-500/5 to-transparent"></div>
      </div>
      
      <header className="relative z-10 p-8 flex items-center justify-between">
        <button onClick={() => navigate(AppScreen.AUTH)} className="size-12 flex items-center justify-center rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-100 dark:border-white/10 shadow-sm active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
        </button>
        <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
           <span className="material-symbols-outlined text-primary text-[14px] fill-1">verified_user</span>
           <span className="text-[9px] font-black uppercase tracking-widest text-primary">Secure Update</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-8 pt-4 pb-12 flex flex-col">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tight mb-3 font-display text-slate-900 dark:text-white leading-tight">
            Create New <br/><span className="text-primary italic">Password</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed max-w-[260px] mx-auto">
            Choose a strong password to protect your wellness journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">New Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] group-focus-within:text-primary transition-colors">lock</span>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-16 pl-14 pr-5 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-white/5 rounded-[1.5rem] shadow-sm focus:ring-2 focus:ring-primary/40 transition-all font-medium text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Confirm New Password</label>
            <div className="relative">
              <span className={`material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[20px] transition-colors ${isMatch ? 'text-emerald-500' : 'text-slate-400 group-focus-within:text-primary'}`}>verified</span>
              <input 
                required
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-16 pl-14 pr-5 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-white/5 rounded-[1.5rem] shadow-sm focus:ring-2 focus:ring-primary/40 transition-all font-medium text-sm text-slate-900 dark:text-white"
              />
            </div>
            {confirmPassword && !isMatch && (
              <p className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1 animate-pulse">Passwords do not match</p>
            )}
          </div>

          <div className="p-6 bg-slate-100 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5">
             <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Security Checklist</h4>
             <ul className="space-y-2">
                {[
                  { text: 'At least 8 characters', check: password.length >= 8 },
                  { text: 'Includes a symbol or number', check: /[0-9!@#$%^&*]/.test(password) },
                  { text: 'Matches confirm field', check: isMatch }
                ].map((item, i) => (
                  <li key={i} className={`flex items-center gap-2 text-[10px] font-bold ${item.check ? 'text-emerald-500' : 'text-slate-400'}`}>
                    <span className="material-symbols-outlined text-[14px]">{item.check ? 'check_circle' : 'circle'}</span>
                    {item.text}
                  </li>
                ))}
             </ul>
          </div>

          <button 
            type="submit"
            disabled={isLoading || !isMatch || password.length < 8}
            className="w-full h-18 urkio-gradient rounded-[1.8rem] text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {isLoading ? (
              <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Update Password
                <span className="material-symbols-outlined text-[20px]">security</span>
              </>
            )}
          </button>
        </form>
      </main>

      <footer className="text-center pb-12 mt-auto">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Encrypted Security protocol Active</p>
      </footer>
    </div>
  );
};

export default PasswordUpdateForm;
