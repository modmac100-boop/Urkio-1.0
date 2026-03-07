
import React, { useState, useEffect, useRef } from 'react';
import { AppScreen, UserRole } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
  role: UserRole;
}

const ConsultationRoom: React.FC<Props> = ({ navigate, role }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    
    // Request camera for self-view
    if (cameraOn && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Camera access denied", err));
    }

    return () => {
      clearInterval(timer);
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [cameraOn]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const participantName = role === 'EXPERT' ? "Alex Johnson" : "Mark Thompson"; // Defaulting to a Dietitian for demo context
  // Enforcing green theme for Dietitians
  const isDietitianTheme = participantName.toLowerCase().includes('dietitian') || participantName.toLowerCase().includes('nutrition') || participantName === "Mark Thompson";
  
  const themeColor = isDietitianTheme ? 'text-urkio-green' : 'text-primary';
  const themeBg = isDietitianTheme ? 'bg-urkio-green' : 'bg-primary';
  const themeGradient = isDietitianTheme ? 'diet-gradient' : 'urkio-gradient';
  const themeShadow = isDietitianTheme ? 'shadow-urkio-green/30' : 'shadow-primary/30';
  const themeBorder = isDietitianTheme ? 'border-urkio-green/40' : 'border-primary/30';

  const participantImage = role === 'EXPERT' 
    ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1000" // Client
    : "https://picsum.photos/seed/mark/1000/1000"; // Mark Thompson (Dietitian)

  return (
    <div className="relative h-screen w-full flex flex-col bg-background-dark text-white max-w-md mx-auto overflow-hidden font-sans">
      {/* Remote Participant Video (Full Screen Simulation) */}
      <div className="absolute inset-0 z-0">
        <img 
          src={participantImage} 
          className="w-full h-full object-cover" 
          alt="Remote Participant"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-black/40"></div>
      </div>

      {/* Top Bar Overlay */}
      <header className="relative z-10 px-6 pt-12 pb-4 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className="size-2 bg-red-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-black tracking-widest uppercase">{formatTime(elapsedTime)}</p>
          </div>
          <div className={`px-3 py-1 ${isDietitianTheme ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-primary/20 border-primary/30'} backdrop-blur-md border rounded-full flex items-center gap-1.5`}>
             <span className={`material-symbols-outlined ${isDietitianTheme ? 'text-emerald-500' : 'text-primary'} text-[14px] fill-1`}>verified_user</span>
             <span className={`text-[9px] font-black uppercase ${isDietitianTheme ? 'text-emerald-500' : 'text-primary'} tracking-widest`}>Secure & Encrypted</span>
          </div>
        </div>

        <button 
          onClick={() => navigate(role === 'EXPERT' ? AppScreen.EXPERT_SESSION_RECAP : AppScreen.SESSION_SUMMARY)}
          className="size-12 rounded-2xl bg-red-500 flex items-center justify-center shadow-2xl shadow-red-500/30 active:scale-95 transition-transform pointer-events-auto"
        >
          <span className="material-symbols-outlined text-white font-black text-2xl">call_end</span>
        </button>
      </header>

      {/* Main UI Overlay */}
      <main className="relative z-10 flex-1 flex flex-col pointer-events-none">
        <div className="flex-1"></div>
        
        {/* Self View (Picture in Picture) */}
        <div className={`absolute top-32 right-6 size-40 rounded-3xl bg-slate-900 border-2 ${themeBorder} shadow-2xl overflow-hidden pointer-events-auto active:scale-95 transition-transform`}>
           {cameraOn ? (
             <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
           ) : (
             <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
               <span className="material-symbols-outlined text-4xl mb-2">videocam_off</span>
               <p className="text-[10px] font-black uppercase tracking-widest">Camera Off</p>
             </div>
           )}
           <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded text-[8px] font-black uppercase tracking-widest border border-white/10">
             You
           </div>
        </div>

        {/* Remote Info Card */}
        <div className="px-6 pb-10 flex flex-col gap-4 pointer-events-auto">
          <div className="flex flex-col">
            <h2 className="text-3xl font-black font-display tracking-tight drop-shadow-lg">{participantName}</h2>
            <p className="text-sm font-medium text-white/60 drop-shadow-md">
              {role === 'EXPERT' ? 'Current Patient • Wellness Focus' : 'Urkio Specialist • Functional Dietitian'}
            </p>
          </div>
        </div>
      </main>

      {/* Control Bar */}
      <footer className="relative z-20 px-6 pt-4 pb-12 bg-background-dark/40 backdrop-blur-2xl border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`size-14 rounded-2xl flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-white/10 text-white border border-white/10'}`}
          >
            <span className="material-symbols-outlined text-2xl fill-1">{isMuted ? 'mic_off' : 'mic'}</span>
          </button>
          <button 
            onClick={() => setCameraOn(!cameraOn)}
            className={`size-14 rounded-2xl flex items-center justify-center transition-all ${!cameraOn ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-white/10 text-white border border-white/10'}`}
          >
            <span className="material-symbols-outlined text-2xl fill-1">{cameraOn ? 'videocam' : 'videocam_off'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowChat(!showChat)}
            className={`size-14 rounded-2xl flex items-center justify-center transition-all ${showChat ? `${themeGradient} text-white shadow-lg ${themeShadow}` : 'bg-white/10 text-white border border-white/10'}`}
          >
            <span className="material-symbols-outlined text-2xl">chat_bubble</span>
          </button>
          
          {role === 'EXPERT' && (
            <button 
              onClick={() => setShowNotes(!showNotes)}
              className={`size-14 rounded-2xl flex items-center justify-center transition-all ${showNotes ? (isDietitianTheme ? 'bg-urkio-green text-slate-900 shadow-emerald-500/30' : 'bg-accent-cyan text-slate-900 shadow-accent-cyan/30') : 'bg-white/10 text-white border border-white/10'}`}
            >
              <span className="material-symbols-outlined text-2xl">clinical_notes</span>
            </button>
          )}
        </div>
      </footer>

      {/* Side Drawer: Clinical Notes (Expert Only) */}
      {showNotes && role === 'EXPERT' && (
        <div className="absolute inset-0 z-50 flex justify-end animate-in slide-in-from-right duration-300">
           <div className="w-[85%] h-full bg-background-dark border-l border-white/10 shadow-2xl flex flex-col">
              <header className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
                <div>
                   <h3 className={`text-sm font-black uppercase tracking-widest ${themeColor}`}>Dietary Notes</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Confidential Sync Record</p>
                </div>
                <button onClick={() => setShowNotes(false)} className="size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10">
                   <span className="material-symbols-outlined">close</span>
                </button>
              </header>
              <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Observations</label>
                    <textarea 
                       className={`w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-medium focus:ring-2 focus:ring-${isDietitianTheme ? 'urkio-green' : 'primary'}/40 leading-relaxed`}
                       placeholder="Enter real-time nutritional observations..."
                       defaultValue="Patient is reporting improved energy levels with protein-first breakfast protocol. Gut-brain axis stabilization in progress."
                    />
                 </div>
              </div>
              <footer className="p-6 border-t border-white/5">
                 <button className={`w-full h-14 ${themeGradient} rounded-xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl ${themeShadow}`}>Sync History</button>
              </footer>
           </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationRoom;
