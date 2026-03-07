import React, { useState } from 'react';
import { AppScreen } from '../types';
import { auth } from '../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const UrkioLogo = ({ className = "size-20", color = "url(#logoGradRecovery)" }: { className?: string, color?: string }) => (
  <svg className={className} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradRecovery" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d946ef" />
        <stop offset="100%" stopColor="#135bec" />
      </linearGradient>
    </defs>
    {/* Base Path */}
    <path
      d="M24 15V80C24 95 36 105 50 105C64 105 76 95 76 80V15"
      stroke={color}
      strokeWidth="30"
      strokeLinecap="round"
    />
    {/* Shadow Track */}
    <path
      d="M24 80C24 95 36 105 50 105"
      stroke="black"
      strokeOpacity="0.1"
      strokeWidth="30"
      strokeLinecap="round"
    />
    {/* Shining Edge */}
    <path
      d="M24 15V80C24 95 36 105 50 105C64 105 76 95 76 80V15"
      stroke="white"
      strokeWidth="32"
      strokeLinecap="round"
      strokeOpacity="0.6"
      className="animate-logo-shine"
    />
  </svg>
);

const PasswordRecovery: React.FC<Props> = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      let message = 'Failed to send recovery link. Please try again.';
      if (err.code === 'auth/user-not-found') {
        message = 'No account found with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      }
      setError(message);
    } finally {
      setIsLoading(true); // Keep loading state briefly for UX
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto overflow-hidden font-sans">
      {/* Cinematic Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-purple-500/5 to-transparent"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[100%] h-[100%] bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-urkio-magenta/5 via-transparent to-transparent"></div>
      </div>

      <header className="relative z-10 p-8 flex items-center justify-between">
        <button onClick={() => navigate(AppScreen.AUTH)} className="size-12 flex items-center justify-center rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-100 dark:border-white/10 shadow-sm active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
        </button>
        <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[14px] fill-1">verified_user</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-primary">Member Security</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-8 pt-4 pb-12 flex flex-col items-center">
        {/* Pulsing Branded Logo Hub */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="relative flex items-center justify-center w-24 h-24 mb-6">
            <div className="absolute inset-0 blur-3xl urkio-gradient opacity-20 rounded-full animate-breathe"></div>
            <UrkioLogo className="size-20 drop-shadow-2xl animate-breathe" />
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-4xl font-black tracking-tight font-display text-slate-900 dark:text-white leading-tight">
              Password <br /><span className="text-primary italic">Recovery</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed max-w-[260px] mx-auto">
              It happens to the best of us. Let’s get you back into your journey.
            </p>
          </div>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Account Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] group-focus-within:text-primary transition-colors">alternate_email</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="your@email.com"
                  className={`w-full h-16 pl-14 pr-5 bg-white dark:bg-slate-900/50 border ${error ? 'border-red-500' : 'border-gray-100 dark:border-white/5'} rounded-[1.5rem] shadow-sm focus:ring-2 focus:ring-primary/40 transition-all font-medium text-sm text-slate-900 dark:text-white`}
                />
              </div>
              {error && (
                <p className="text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full h-18 urkio-gradient rounded-[1.8rem] text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Send Recovery Link
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </>
              )}
            </button>

            <div className="p-6 bg-primary/5 dark:bg-white/5 border border-primary/10 rounded-[2rem] flex gap-4">
              <span className="material-symbols-outlined text-primary">info</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                We'll send a secure link to reset your password. For your security, this link will expire in <span className="text-primary font-bold">15 minutes</span>.
              </p>
            </div>
          </form>
        ) : (
          <div className="w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="size-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
              <span className="material-symbols-outlined text-5xl text-emerald-500 fill-1">mark_email_read</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Check Your Inbox</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[240px] mx-auto leading-relaxed">
                A secure recovery link has been sent to <br />
                <span className="text-primary font-bold">{email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate(AppScreen.PASSWORD_UPDATE_FORM)}
                className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline px-4 py-2 border border-primary/20 rounded-xl"
              >
                [ Simulating Email Link Click ]
              </button>
              <button
                onClick={() => setIsSent(false)}
                className="text-[10px] font-black uppercase text-slate-400 tracking-widest hover:underline block mx-auto"
              >
                Didn't get the email? Try again
              </button>
              <button
                onClick={() => navigate(AppScreen.AUTH)}
                className="w-full h-16 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 rounded-[1.5rem] text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest active:scale-95 transition-all shadow-sm flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Return to Sign In
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center pb-12 mt-auto">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-12">
          Need help? Reach out to <span className="text-primary cursor-pointer hover:underline">support@urkio.com</span>
        </p>
      </footer>
    </div>
  );
};

export default PasswordRecovery;
