
import React, { useState, useRef, useEffect } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const TfaSetupVerify: React.FC<Props> = ({ navigate }) => {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value !== '' && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const isComplete = pin.every(digit => digit !== '');

  const handleVerify = () => {
    if (!isComplete) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(AppScreen.TFA_SUCCESS);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl font-sans overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 blur-[120px] -translate-y-1/2"></div>
      
      <header className="relative z-10 px-6 pt-12 pb-6 flex items-center justify-between">
        <button onClick={() => navigate(AppScreen.TFA_SETUP_METHOD)} className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 active:scale-90 transition-all shadow-sm">
          <span className="material-symbols-outlined text-slate-500">arrow_back_ios_new</span>
        </button>
        <div className="flex flex-col items-center">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Verify Method</h2>
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-primary">Step 2 of 2</p>
        </div>
        <div className="w-11"></div>
      </header>

      <main className="relative z-10 flex-1 px-8 pt-4 pb-12 flex flex-col no-scrollbar overflow-y-auto">
        {/* QR Code Section */}
        <section className="flex flex-col items-center mb-12 animate-in zoom-in duration-500">
           <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
             Scan the QR code below using your <br/>authenticator app.
           </p>
           
           <div className="relative group">
              <div className="absolute -inset-4 urkio-gradient opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"></div>
              <div className="relative size-56 bg-white rounded-[2.5rem] p-6 shadow-2xl border border-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                 {/* Fake QR Code Placeholder */}
                 <svg className="size-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="20" height="20" />
                    <rect x="30" y="0" width="10" height="10" />
                    <rect x="50" y="0" width="20" height="20" />
                    <rect x="80" y="0" width="20" height="20" />
                    <rect x="0" y="30" width="10" height="10" />
                    <rect x="20" y="30" width="20" height="20" />
                    <rect x="60" y="30" width="10" height="10" />
                    <rect x="80" y="30" width="10" height="10" />
                    <rect x="0" y="50" width="20" height="20" />
                    <rect x="30" y="50" width="10" height="10" />
                    <rect x="50" y="50" width="20" height="20" />
                    <rect x="80" y="50" width="20" height="20" />
                    <rect x="0" y="80" width="20" height="20" />
                    <rect x="30" y="80" width="10" height="10" />
                    <rect x="50" y="80" width="20" height="20" />
                    <rect x="80" y="80" width="20" height="20" />
                 </svg>
                 <div className="absolute inset-0 border-4 border-slate-900/5 rounded-[2.5rem]"></div>
              </div>
           </div>

           <button className="mt-8 text-[9px] font-black uppercase tracking-[0.2em] text-primary hover:underline">
              Can't scan? Enter code manually
           </button>
        </section>

        {/* PIN Entry Section */}
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="text-center space-y-2">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Verification Code</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Enter the 6-digit code</p>
           </div>

           <div className="flex justify-between gap-2 px-2">
              {pin.map((digit, i) => (
                <input 
                  key={i}
                  // Fix: Wrapped assignment in braces to ensure the callback returns void and not the HTML element instance
                  ref={el => { inputs.current[i] = el; }}
                  type="number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="size-12 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 text-center font-black text-lg focus:ring-2 focus:ring-primary shadow-sm text-slate-900 dark:text-white"
                />
              ))}
           </div>

           <button 
             onClick={handleVerify}
             disabled={!isComplete || isLoading}
             className="w-full h-16 urkio-gradient rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
           >
              {isLoading ? (
                <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Finalize Setup
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </>
              )}
           </button>
        </section>
      </main>

      <footer className="p-8 text-center relative z-10 bg-white dark:bg-background-dark border-t border-gray-100 dark:border-white/5">
         <div className="flex items-center justify-center gap-3 opacity-40">
            <span className="material-symbols-outlined text-[12px]">lock</span>
            <p className="text-[8px] font-black uppercase tracking-[0.4em]">AES-256 Encrypted Connection</p>
         </div>
      </footer>
    </div>
  );
};

export default TfaSetupVerify;
