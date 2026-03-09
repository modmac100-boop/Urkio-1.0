
import React, { useState, useMemo } from 'react';
import { AppScreen, UserRole } from '../types';
import { auth, db } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface Props {
  navigate: (screen: AppScreen) => void;
  onAuthSuccess: (roleOverride?: UserRole, isNewRegistration?: boolean) => void;
  userRole: UserRole;
  initialMode?: 'login' | 'signup';
}

const UrkioLogo = ({ className = "size-20", color = "url(#logoGradAuth)" }: { className?: string, color?: string }) => (
  <svg className={className} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradAuth" x1="0%" y1="0%" x2="100%" y2="100%">
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

const AuthView: React.FC<Props> = ({ navigate, onAuthSuccess, userRole, initialMode }) => {
  const [isLogin, setIsLogin] = useState(initialMode !== 'signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRegSuccess, setShowRegSuccess] = useState(false);

  const isExpertPath = userRole === 'EXPERT';

  const [regData, setRegData] = useState({
    firstName: '',
    familyName: '',
    age: '',
    location: '',
    phone: '',
    gender: '',
    occupation: userRole === 'EXPERT' ? 'Expert Practitioner' : '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const passwordsMatch = useMemo(() => {
    return regData.password && regData.confirmPassword && regData.password === regData.confirmPassword;
  }, [regData.password, regData.confirmPassword]);

  const isFormValid = useMemo(() => {
    if (isLogin) return regData.email && regData.password;
    return (
      regData.firstName &&
      regData.familyName &&
      regData.age &&
      regData.location &&
      regData.phone &&
      regData.gender &&
      regData.occupation &&
      regData.email &&
      passwordsMatch &&
      regData.password.length >= 8
    );
  }, [isLogin, regData, passwordsMatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Firebase Login
        const credential = await signInWithEmailAndPassword(auth, regData.email, regData.password);
        // Read role from Firestore to route user/expert correctly
        let detectedRole: UserRole | undefined;
        try {
          const profileSnap = await getDoc(doc(db, 'profiles', credential.user.uid));
          if (profileSnap.exists()) {
            detectedRole = profileSnap.data().role as UserRole;
          }
        } catch (_) { }
        onAuthSuccess(detectedRole, false);
      } else {
        // Firebase Registration
        const userCredential = await createUserWithEmailAndPassword(auth, regData.email, regData.password);

        if (userCredential.user) {
          // Insert metadata into 'profiles' collection
          await setDoc(doc(db, 'profiles', userCredential.user.uid), {
            id: userCredential.user.uid,
            first_name: regData.firstName,
            family_name: regData.familyName,
            age: regData.age,
            location: regData.location,
            phone: regData.phone,
            gender: regData.gender,
            occupation: regData.occupation,
            role: userRole // Pass the role the user selected during Landing
          });

          // Send email verification (Welcome Notification)
          try {
            const actionCodeSettings = {
              // URL to redirect back to. The domain must be whitelisted in the Firebase Console.
              url: window.location.origin,
              handleCodeInApp: true,
            };
            await sendEmailVerification(userCredential.user, actionCodeSettings);
            console.log("Verification email sent with redirect to:", window.location.origin);
          } catch (emailErr) {
            console.error("Error sending verification email:", emailErr);
            // Don't block registration if email fails
          }

          // Instead of switching to login mode, proceed directly to Onboarding
          // Explicitly pass the userRole to avoid race conditions with Firestore sync
          onAuthSuccess(userRole, true);
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during the session handshake.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto overflow-hidden font-sans transition-colors duration-500">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-purple-500/5 to-transparent"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[100%] h-[100%] bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-urkio-magenta/5 via-transparent to-transparent"></div>
      </div>

      <header className="relative z-10 p-8 flex items-center justify-between">
        <button
          onClick={() => navigate(AppScreen.LANDING)}
          className="size-12 flex items-center justify-center rounded-2xl bg-primary/20 dark:bg-white/5 backdrop-blur-md border border-primary/30 dark:border-white/10 text-primary dark:text-white shadow-sm active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
        </button>
        <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 ${isExpertPath ? 'bg-primary/10 border border-primary/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
          <span className={`material-symbols-outlined text-[14px] fill-1 ${isExpertPath ? 'text-primary' : 'text-emerald-500'}`}>
            {isExpertPath ? 'medical_services' : 'lock'}
          </span>
          <span className={`text-[9px] font-black uppercase tracking-widest ${isExpertPath ? 'text-primary' : 'text-emerald-600 dark:text-emerald-500'}`}>
            {isExpertPath ? 'Expert Portal' : 'Secure Member Access'}
          </span>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-8 pt-4 pb-12 flex flex-col no-scrollbar overflow-y-auto">
        <div className="flex flex-col items-center justify-center mb-8 shrink-0">
          <div className="relative flex items-center justify-center w-20 h-20 mb-6">
            <div className="absolute inset-0 blur-3xl urkio-gradient opacity-20 rounded-full animate-pulse"></div>
            <UrkioLogo className="size-16 drop-shadow-2xl" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight mb-2 font-display text-slate-900 dark:text-white">
              {isLogin ? (isExpertPath ? 'Expert Sign In' : 'Member Sign In') : (isExpertPath ? 'Join Expert Circle' : 'Join the Circle')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-xs leading-relaxed max-w-[240px] mx-auto">
              {isLogin
                ? 'Authorized access to clinical workspaces.'
                : 'Complete your professional profile to begin.'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-in shake duration-300">
            <span className="material-symbols-outlined text-red-500">error</span>
            <p className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest leading-relaxed">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {!isLogin && (
            <div className="space-y-5 animate-in slide-in-from-top-4 duration-500">
              {/* Names Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">First Name</label>
                  <input
                    required
                    type="text"
                    value={regData.firstName}
                    onChange={(e) => setRegData({ ...regData, firstName: e.target.value })}
                    placeholder="Alex"
                    className="w-full h-12 px-5 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-white/5 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/40 transition-all font-medium text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Family Name</label>
                  <input
                    required
                    type="text"
                    value={regData.familyName}
                    onChange={(e) => setRegData({ ...regData, familyName: e.target.value })}
                    placeholder="Johnson"
                    className="w-full h-12 px-5 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-white/5 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/40 transition-all font-medium text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Age & Location Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Age</label>
                  <input
                    required
                    type="number"
                    value={regData.age}
                    onChange={(e) => setRegData({ ...regData, age: e.target.value })}
                    placeholder="24"
                    className="w-full h-12 px-5 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-white/5 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/40 transition-all font-medium text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Location</label>
                  <input
                    required
                    type="text"
                    value={regData.location}
                    onChange={(e) => setRegData({ ...regData, location: e.target.value })}
                    placeholder="City, Country"
                    className="w-full h-12 px-5 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-white/5 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/40 transition-all font-medium text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Contact Phone</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">call</span>
                  <input
                    required
                    type="tel"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    placeholder="+00 000 0000"
                    className="w-full h-12 pl-12 pr-5 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-white/5 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/40 transition-all font-medium text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Gender & Occupation Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Gender Identity</label>
                  <select
                    required
                    value={regData.gender}
                    onChange={(e) => setRegData({ ...regData, gender: e.target.value })}
                    className="w-full h-12 px-5 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-white/5 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/40 transition-all font-medium text-xs text-slate-900 dark:text-white appearance-none"
                  >
                    <option value="" disabled>Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">N/A</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Daily Occupation</label>
                  <input
                    required
                    type="text"
                    value={regData.occupation}
                    onChange={(e) => setRegData({ ...regData, occupation: e.target.value })}
                    placeholder="e.g. Designer"
                    className="w-full h-12 px-5 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-white/5 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/40 transition-all font-medium text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5 group">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Identity Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] group-focus-within:text-primary transition-colors">alternate_email</span>
              <input
                required
                type="email"
                value={regData.email}
                onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                placeholder="identity@urkio.com"
                className="w-full h-12 pl-12 pr-5 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-white/5 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/40 transition-all font-medium text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5 group">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Vault Key (Password)</label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => navigate(AppScreen.PASSWORD_RECOVERY)}
                  className="text-[8px] font-black uppercase text-primary tracking-widest hover:underline"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] group-focus-within:text-primary transition-colors">lock</span>
              <input
                required
                type="password"
                value={regData.password}
                onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full h-12 pl-12 pr-5 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-white/5 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/40 transition-all font-medium text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5 group animate-in slide-in-from-top-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Confirm Vault Key</label>
              <div className="relative">
                <span className={`material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[18px] transition-colors ${passwordsMatch ? 'text-emerald-500' : 'text-slate-400 group-focus-within:text-primary'}`}>
                  {passwordsMatch ? 'verified' : 'lock_reset'}
                </span>
                <input
                  required
                  type="password"
                  value={regData.confirmPassword}
                  onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full h-12 pl-12 pr-5 bg-white dark:bg-slate-900/50 border rounded-xl shadow-sm focus:ring-2 transition-all font-medium text-xs text-slate-900 dark:text-white ${passwordsMatch ? 'border-emerald-500/30 focus:ring-emerald-500/40' : 'border-gray-100 dark:border-white/5 focus:ring-primary/40'}`}
                />
              </div>
            </div>
          )}

          {!isLogin && !isFormValid && (regData.email || regData.password) && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-2 animate-in fade-in slide-in-from-top-1">
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest leading-tight">
                Profile staging incomplete. Ensure all fields (names, age, location, phone, gender, occupation, and 8+ char password) are filled.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="mt-4 w-full h-16 urkio-gradient rounded-[1.8rem] text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
          >
            {loading ? (
              <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                {isLogin ? 'Initialize Session' : 'Commit Registration'}
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Developer Bypass */}
        <button
          onClick={() => onAuthSuccess()}
          className="mt-4 w-full h-10 border border-primary/20 bg-primary/5 rounded-xl text-[8px] font-black uppercase tracking-[0.3em] text-primary/60 hover:text-primary hover:bg-primary/10 transition-all"
        >
          Developer Auth Bypass
        </button>

        <footer className="text-center pb-4 mt-10">
          <p className="text-xs font-medium text-slate-500">
            {isLogin ? "New to the platform?" : "Already registered?"}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="ml-2 font-black text-primary hover:underline transition-all uppercase text-[10px] tracking-widest"
            >
              {isLogin ? 'Register Now' : 'Go to Sign In'}
            </button>
          </p>
        </footer>
      </main>

      {/* Registration Success Overlay */}
      {showRegSuccess && (
        <div className="absolute inset-0 z-[100] bg-background-dark/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-500">
          <div className="text-center p-10 animate-in zoom-in duration-300">
            <div className="size-24 rounded-[2.5rem] urkio-gradient flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/40 relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl animate-pulse"></div>
              <span className="material-symbols-outlined text-white text-5xl font-black">person_add</span>
            </div>
            <h3 className="text-2xl font-black mb-3 font-display text-white">Verification Link Sent</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
              {regData.firstName}, your identity has been staged. Please check your email to verify your account.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-in.shake {
          animation: shake 0.3s ease-in-out 3;
        }
      `}</style>
    </div>
  );
};

export default AuthView;
