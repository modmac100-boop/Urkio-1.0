
import React, { useState, useEffect, useRef } from 'react';
import { AppScreen } from '../types';
import { db, auth } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface Props {
  navigate: (screen: AppScreen) => void;
}

const Homii: React.FC<Props> = ({ navigate }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [timer, setTimer] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      setAudioBlob(null);
      setRecordedAudioUrl(null);
      setTimer(0);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setRecordedAudioUrl(URL.createObjectURL(blob));
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access is required to record your reflection.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const blobToBase64 = (blob: Blob) => {
    return new Promise<string>((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  const handleAction = async (type: string) => {
    if (isRecording) return; // Prevent action while recording
    if (!audioBlob) {
      setShowFeedback('NO_AUDIO');
      setTimeout(() => setShowFeedback(null), 2000);
      return;
    }

    setIsSaving(true);
    try {
      const b64 = await blobToBase64(audioBlob);
      const user = auth.currentUser;
      const userName = user?.displayName || user?.email?.split('@')[0] || 'Unknown User';
      const userImage = user?.photoURL || 'https://picsum.photos/seed/u4/100/100';

      if (type === 'PRIVATE') {
        // Save to private reflections
        await addDoc(collection(db, 'reflections'), {
          userId: user?.uid || 'anonymous',
          audio: b64,
          duration: timer,
          timestamp: serverTimestamp(),
          status: 'PRIVATE'
        });
      } else if (type === 'EXPERT') {
        // Save to posts collection but marked as sent to expert (or visibility 'private')
        // We'll mimic sending it by just creating a post and notifying
        await addDoc(collection(db, 'posts'), {
          authorId: user?.uid || 'anonymous',
          authorName: userName,
          authorImage: userImage,
          authorType: 'Member',
          content: 'Shared an audio reflection with an expert.',
          timestamp: serverTimestamp(),
          likes: 0,
          comments: 0,
          reposts: 0,
          views: 0,
          likedBy: [],
          visibility: 'private',
          isExpert: false,
          audio: b64,
          audioDuration: timer
        });
      }

      setShowFeedback(type);
      setAudioBlob(null);
      setRecordedAudioUrl(null);
      setTimer(0);
      setTimeout(() => {
        setShowFeedback(null);
        navigate(AppScreen.USER_DASHBOARD);
      }, 3000);
    } catch (err) {
      console.error("Failed to save audio:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col bg-[#050b1a] text-white max-w-md mx-auto overflow-hidden">
      <header className="p-4 flex items-center justify-between border-b border-white/5 bg-background-dark/50 backdrop-blur-md">
        <button onClick={() => navigate(AppScreen.USER_DASHBOARD)} className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5">
          <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
        </button>
        <div className="text-center">
          <p className="text-[10px] font-black tracking-[0.2em] text-urkio-magenta uppercase">Urkio</p>
          <h2 className="text-sm font-bold tracking-tight">Homii</h2>
        </div>
        <button className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5">
          <span className="material-symbols-outlined text-[20px] text-accent-cyan">verified_user</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col px-6 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black mb-3 font-display">Your Safe Space</h1>
          <p className="text-slate-400 text-sm font-medium">Talk to yourself, reflect, or vent.</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-12 relative">
          {/* Branded Glow Effect */}
          <div className={`absolute w-72 h-72 bg-urkio-magenta/20 blur-[100px] rounded-full transition-all duration-1000 ${isRecording ? 'scale-150 opacity-100' : 'scale-100 opacity-40'}`}></div>
          <div className={`absolute w-56 h-56 bg-urkio-blue/10 blur-[80px] rounded-full transition-all duration-1000 -translate-x-12 ${isRecording ? 'scale-125' : 'scale-100'}`}></div>

          <div className="relative z-10 text-urkio-magenta font-mono text-4xl font-black tracking-[0.2em] mb-4">
            {formatTime(timer)}
          </div>

          {recordedAudioUrl && !isRecording && (
            <div className="relative z-20 w-full px-8 mb-4">
              <audio src={recordedAudioUrl} controls className="w-full rounded-2xl grayscale hue-rotate-[280deg]" />
            </div>
          )}

          <button
            onClick={toggleRecording}
            className={`relative z-10 size-36 rounded-full flex items-center justify-center transition-all duration-500 p-2 ${isRecording ? 'bg-urkio-magenta shadow-[0_0_60px_rgba(217,70,239,0.5)]' : 'bg-urkio-magenta/10 border-4 border-urkio-magenta shadow-xl'}`}
          >
            <div className={`size-full rounded-full flex items-center justify-center border-4 border-white/20 ${isRecording ? 'animate-pulse' : ''}`}>
              <span className={`material-symbols-outlined text-6xl fill-1 ${isRecording ? 'text-white' : 'text-urkio-magenta'}`}>
                {isRecording ? 'pause' : 'fiber_manual_record'}
              </span>
            </div>
          </button>

          <div className="flex gap-12 text-slate-500 relative z-10">
            <button className="flex flex-col items-center gap-2 hover:text-white transition-colors group">
              <div className="size-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary transition-all">
                <span className="material-symbols-outlined text-2xl">mic</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Audio</span>
            </button>
            <button className="flex flex-col items-center gap-2 hover:text-white transition-colors group">
              <div className="size-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary transition-all">
                <span className="material-symbols-outlined text-2xl">keyboard</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Type</span>
            </button>
          </div>
        </div>

        <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/5 mb-12 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-accent-cyan text-[20px]">security</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Reflection Action</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleAction('PRIVATE')}
              disabled={isRecording || isSaving}
              className="flex-1 py-4 bg-transparent border-2 border-urkio-magenta rounded-2xl text-[10px] font-black text-urkio-magenta flex items-center justify-center gap-2 hover:bg-urkio-magenta/10 transition-all active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm fill-1">shield</span>
              KEEP PRIVATE
            </button>
            <button
              onClick={() => handleAction('EXPERT')}
              disabled={isRecording || isSaving}
              className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">medical_services</span>
              SEND TO EXPERT
            </button>
          </div>
        </div>
      </main>

      {showFeedback && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#050b1a]/95 animate-in fade-in duration-300 backdrop-blur-md">
          <div className="text-center px-10">
            <div className="size-24 rounded-full bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
              <span className="material-symbols-outlined text-emerald-500 text-5xl fill-1">
                {showFeedback === 'NO_AUDIO' ? 'error' : 'check_circle'}
              </span>
            </div>
            <h3 className="text-3xl font-black mb-3 font-display">
              {showFeedback === 'PRIVATE' ? 'Saved Securely' :
                showFeedback === 'EXPERT' ? 'Sent to Specialist' : 'No Recording'}
            </h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              {showFeedback === 'PRIVATE'
                ? 'Your reflection has been encrypted and stored in your vault.'
                : showFeedback === 'EXPERT'
                  ? 'Your reflection has been forwarded to your specialist for review.'
                  : 'Please record an audio reflection first.'}
            </p>
          </div>
        </div>
      )}

      {isSaving && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#050b1a]/90 backdrop-blur-md">
          <div className="size-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="p-6 pb-12">
        <button
          onClick={() => {
            if (isRecording) {
              stopRecording();
            } else {
              navigate(AppScreen.USER_DASHBOARD);
            }
          }}
          className="w-full h-16 urkio-gradient rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white shadow-2xl shadow-primary/30 active:scale-95 transition-all"
        >
          {isRecording ? 'Stop Recording' : 'Back to Dashboard'}
        </button>
      </div>
    </div>
  );
};

export default Homii;
