
import React, { useState, useRef, useEffect } from 'react';
import { AppScreen } from '../types';

interface Props {
  navigate: (screen: AppScreen) => void;
}

type Quality = '720p' | '1080p';
type FacingMode = 'user' | 'environment';

const VideoRecorder: React.FC<Props> = ({ navigate }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  
  const [quality, setQuality] = useState<Quality>('720p');
  const [facingMode, setFacingMode] = useState<FacingMode>('user');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);

  // Resolution Map
  const resolutions = {
    '720p': { width: 1280, height: 720 },
    '1080p': { width: 1920, height: 1080 }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [quality, facingMode]);

  // The processing loop that draws video to canvas
  useEffect(() => {
    const processFrame = () => {
      if (videoRef.current && canvasRef.current && !recordedVideo) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
          // Match canvas size to requested quality
          const res = resolutions[quality];
          if (canvas.width !== res.width || canvas.height !== res.height) {
            canvas.width = res.width;
            canvas.height = res.height;
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Mirror if front camera
          if (facingMode === 'user') {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
            ctx.restore();
          } else {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          }
        }
      }
      requestRef.current = requestAnimationFrame(processFrame);
    };

    requestRef.current = requestAnimationFrame(processFrame);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [quality, facingMode, recordedVideo]);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const res = resolutions[quality];
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode,
          width: { ideal: res.width },
          height: { ideal: res.height }
        }, 
        audio: true 
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setPermissionError("Camera and microphone access is required to record reflections.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const flipCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const startRecording = () => {
    if (!canvasRef.current) return;
    
    setIsRecording(true);
    chunksRef.current = [];
    
    // We capture the stream from the CANVAS, not the video element directly.
    // Cast to any because captureStream is not in standard HTMLCanvasElement TS types.
    const canvasStream = (canvasRef.current as any).captureStream(30);
    
    // Also need to add audio from original stream
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => canvasStream.addTrack(track));
    }

    const recorder = new MediaRecorder(canvasStream, {
      mimeType: 'video/webm;codecs=vp8,opus' 
    });
    
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
      setRecordedVideo(URL.createObjectURL(blob));
    };
    
    recorder.start();
    mediaRecorderRef.current = recorder;
    
    setTimer(0);
    timerRef.current = window.setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setRecordedVideo(null);
    setTimer(0);
    startCamera();
  };

  const handlePublish = () => {
    navigate(AppScreen.COMMUNITY_FEED);
  };

  if (permissionError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background-dark text-white p-10 text-center">
        <span className="material-symbols-outlined text-6xl text-red-500 mb-6">videocam_off</span>
        <h2 className="text-xl font-black mb-4">Access Denied</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">{permissionError}</p>
        <button onClick={() => navigate(AppScreen.COMMUNITY_FEED)} className="px-8 py-4 urkio-gradient rounded-2xl font-black uppercase text-[10px] tracking-widest">Return to Feed</button>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full flex flex-col bg-black text-white max-w-md mx-auto overflow-hidden font-sans">
      {/* HUD Backdrop for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top HUD */}
      <header className="absolute top-0 inset-x-0 z-50 p-6 flex items-center justify-between pointer-events-none">
        <button 
          onClick={() => navigate(AppScreen.COMMUNITY_FEED)} 
          className="size-11 flex items-center justify-center rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-white pointer-events-auto active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <div className="flex gap-2 pointer-events-auto">
          {/* Quality Selector */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-1 flex gap-1">
            <button 
              onClick={() => setQuality('720p')}
              className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase transition-all ${quality === '720p' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
            >
              720p
            </button>
            <button 
              onClick={() => setQuality('1080p')}
              className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase transition-all ${quality === '1080p' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
            >
              1080p
            </button>
          </div>

          {isRecording && (
            <div className="px-4 py-2 bg-red-600 rounded-full flex items-center gap-2 shadow-2xl animate-pulse">
              <div className="size-2 bg-white rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">{formatTime(timer)}</span>
            </div>
          )}
        </div>

        {!isRecording && !recordedVideo && (
           <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">
             Live View
           </div>
        )}
      </header>

      {/* Viewfinder / Preview */}
      <main className="flex-1 relative bg-slate-900">
        {recordedVideo ? (
          <video src={recordedVideo} className="size-full object-cover" autoPlay loop playsInline />
        ) : (
          <video ref={videoRef} autoPlay muted playsInline className="size-full object-cover opacity-0 pointer-events-none" />
        )}
        
        {/* We use a visible canvas for the viewfinder to ensure mirroring/quality settings are visible as they are in output */}
        {!recordedVideo && (
          <div className="absolute inset-0">
             <canvas 
               className="size-full object-cover" 
               ref={(el) => {
                 if (el && canvasRef.current) {
                   const ctx = el.getContext('2d');
                   const render = () => {
                     if (ctx && canvasRef.current) {
                       el.width = canvasRef.current.width;
                       el.height = canvasRef.current.height;
                       ctx.drawImage(canvasRef.current, 0, 0);
                     }
                     requestAnimationFrame(render);
                   };
                   render();
                 }
               }} 
             />
          </div>
        )}
        
        {/* Optical HUD Overlays */}
        {!recordedVideo && (
          <>
            <div className="absolute top-1/2 left-6 -translate-y-1/2 flex flex-col gap-8 opacity-40">
               <div className="w-[2px] h-12 bg-white/30 rounded-full relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full bg-accent-cyan animate-[pulse_1s_infinite]" style={{ height: '40%' }}></div>
               </div>
               <span className="text-[8px] font-black uppercase vertical-text tracking-[0.2em]">Audio LVL</span>
            </div>
            {/* Focal Corners */}
            <div className="absolute top-24 left-10 size-8 border-t-2 border-l-2 border-white/20"></div>
            <div className="absolute top-24 right-10 size-8 border-t-2 border-r-2 border-white/20"></div>
            <div className="absolute bottom-40 left-10 size-8 border-b-2 border-l-2 border-white/20"></div>
            <div className="absolute bottom-40 right-10 size-8 border-b-2 border-r-2 border-white/20"></div>
          </>
        )}
      </main>

      {/* Control Hub */}
      <footer className="absolute bottom-0 inset-x-0 z-50 p-10 flex flex-col items-center gap-8 bg-gradient-to-t from-black via-black/80 to-transparent">
        {recordedVideo ? (
          <div className="w-full space-y-4 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex gap-4">
                <button 
                  onClick={reset}
                  className="flex-1 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-[1.8rem] text-white font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                >
                  Discard
                </button>
                <button 
                  onClick={handlePublish}
                  className="flex-[2] h-16 urkio-gradient rounded-[1.8rem] text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  Publish Update
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
             </div>
             <p className="text-center text-[8px] font-black text-white/30 uppercase tracking-[0.4em]">Review reflection before syncing</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8">
            <div className="flex gap-12 items-center text-white/40">
               <button 
                 onClick={flipCamera}
                 className="flex flex-col items-center gap-2 hover:text-white transition-colors group active:scale-90"
               >
                  <span className={`material-symbols-outlined text-2xl ${facingMode === 'environment' ? 'text-primary rotate-180' : ''}`}>flip_camera_ios</span>
                  <span className="text-[8px] font-black uppercase tracking-widest">Flip</span>
               </button>
               
               <button 
                 onClick={isRecording ? stopRecording : startRecording}
                 className={`size-24 rounded-full p-2 border-4 transition-all duration-500 active:scale-90 ${isRecording ? 'border-red-500/50 scale-110' : 'border-white/50'}`}
               >
                  <div className={`size-full rounded-full transition-all duration-300 flex items-center justify-center ${isRecording ? 'bg-red-500 animate-pulse rounded-2xl' : 'bg-white'}`}>
                     {isRecording ? (
                        <span className="material-symbols-outlined text-white text-4xl fill-1">stop</span>
                     ) : (
                        <div className="size-6 bg-red-500 rounded-full"></div>
                     )}
                  </div>
               </button>

               <button className="flex flex-col items-center gap-2 hover:text-white transition-colors group">
                  <span className="material-symbols-outlined text-2xl">flash_on</span>
                  <span className="text-[8px] font-black uppercase tracking-widest">Auto</span>
               </button>
            </div>
            
            <div className="flex gap-8 text-white/40 text-[9px] font-black uppercase tracking-widest border-b border-white/10 pb-2">
               <span className="text-white border-b-2 border-white pb-2 px-1 transition-colors">Reflection</span>
               <span className="px-1 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">Support</span>
               <span className="px-1 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">Q&A</span>
            </div>
          </div>
        )}
      </footer>

      <style>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
};

export default VideoRecorder;
