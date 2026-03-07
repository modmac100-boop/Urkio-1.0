
import React, { useState, useRef, useEffect } from 'react';
import { AppScreen, Expert } from '../types';

interface Message {
  id: string;
  sender: 'expert' | 'me';
  text: string;
  time: string;
  isMedia?: boolean;
  mediaType?: 'image' | 'file' | 'audio' | 'video';
  mediaName?: string;
}

interface Props {
  navigate: (screen: AppScreen, expert?: Expert) => void;
  expert: Expert | null;
}

const PrivateChat: React.FC<Props> = ({ navigate, expert }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'expert', text: "Hello Alex, I've reviewed your latest reflection. How are you feeling today?", time: '09:30 AM' },
    { id: '2', sender: 'me', text: "A bit better, though the mornings are still challenging. I tried the breathing exercise you suggested.", time: '09:32 AM' },
    { id: '3', sender: 'expert', text: "That's good to hear. Consistency is key with the 4-7-8 method. I've attached a guide for you to reference.", time: '09:35 AM' },
    { id: '4', sender: 'expert', text: "Check this out.", time: '09:35 AM', isMedia: true, mediaType: 'file', mediaName: 'Breathing_Techniques_V2.pdf' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const simulateExpertReply = (userMessage: string) => {
    setIsTyping(true);
    // Real-time simulation delay
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "That's a very insightful observation. How does that affect your daily routine?",
        "I've noted this in your clinical record. Let's explore this further in our next session.",
        "Remember to stay consistent with your grounding exercises. You're making great progress.",
        "Thank you for sharing that with me. It helps me tailor your journey better."
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      
      const newMsg: Message = {
        id: Date.now().toString(),
        sender: 'expert',
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMsg]);
    }, 2500);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    simulateExpertReply(newMsg.text);
  };

  const handleMediaSend = (type: 'image' | 'file' | 'audio' | 'video', name: string) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: '',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMedia: true,
      mediaType: type,
      mediaName: name
    };
    setMessages(prev => [...prev, newMsg]);
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'expert',
        text: `I've received your ${type}. I will review this thoroughly before our next appointment.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  const expertInfo = expert || {
    name: "Dr. Sarah Miller",
    title: "Clinical Psychologist",
    image: "https://picsum.photos/seed/sarah/100/100"
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
      <header className="relative z-10 px-6 pt-12 pb-6 bg-white/90 dark:bg-background-dark/95 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(AppScreen.INBOX)} 
            className="size-10 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/5 active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </button>
          <div className="flex items-center gap-3">
             <div className="relative">
                <div className="size-11 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg">
                    <img src={expertInfo.image} className="size-full object-cover" alt={expertInfo.name} />
                </div>
                <div className="absolute -bottom-1 -right-1 size-3.5 bg-emerald-500 border-2 border-white dark:border-background-dark rounded-full"></div>
             </div>
             <div>
                <h2 className="text-sm font-black tracking-tight leading-none mb-1">{expertInfo.name}</h2>
                <div className="flex items-center gap-1.5">
                   <span className="text-[9px] text-primary font-black uppercase tracking-widest">Specialist</span>
                </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={() => navigate(AppScreen.CONSULTATION_ROOM)}
             className="size-12 flex items-center justify-center rounded-2xl urkio-gradient text-white shadow-lg shadow-primary/30 active:scale-90 transition-all"
           >
              <span className="material-symbols-outlined text-[24px] fill-1">videocam</span>
           </button>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar bg-slate-50 dark:bg-background-dark scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-${msg.sender === 'me' ? 'right' : 'left'}-4 duration-300`}>
            <div className={`max-w-[85%] rounded-[1.8rem] px-5 py-4 shadow-xl ${
              msg.sender === 'me' 
                ? 'urkio-gradient text-white rounded-br-none shadow-primary/20' 
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-bl-none border border-gray-100 dark:border-white/5'
            }`}>
              {msg.isMedia ? (
                <div className="flex items-center gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5 cursor-pointer group hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                   <div className="size-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg">
                      <span className="material-symbols-outlined text-2xl">
                        {msg.mediaType === 'file' ? 'description' : 
                         msg.mediaType === 'audio' ? 'mic' : 
                         msg.mediaType === 'video' ? 'play_circle' : 'image'}
                      </span>
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-xs font-black truncate">{msg.mediaName}</p>
                      <p className="text-[9px] font-bold uppercase opacity-60">
                        {msg.mediaType === 'audio' ? 'Voice Note' : 
                         msg.mediaType === 'video' ? 'Video Message' : 
                         msg.mediaType === 'image' ? 'Photo' : 'Document'}
                      </p>
                   </div>
                   <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">download</span>
                </div>
              ) : (
                <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
              )}
              <div className="flex justify-between items-center mt-2 opacity-50">
                <p className="text-[9px] font-bold uppercase">{msg.time}</p>
                {msg.sender === 'me' && <span className="material-symbols-outlined text-[14px]">done_all</span>}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-in fade-in duration-300">
             <div className="bg-white dark:bg-slate-900 rounded-3xl px-6 py-4 border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex gap-1">
                   <div className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                   <div className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                   <div className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
             </div>
          </div>
        )}
      </main>

      <footer className="p-6 bg-white/95 dark:bg-background-dark/95 backdrop-blur-3xl border-t border-gray-100 dark:border-white/5 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-4">
           {/* Media Controls Strip */}
           <div className="flex gap-4 px-2 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => navigate(AppScreen.VIDEO_RECORDER)}
                className="flex flex-col items-center gap-1 group active:scale-90 transition-transform shrink-0"
              >
                 <div className="size-11 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all shadow-lg shadow-red-500/10">
                    <span className="material-symbols-outlined text-xl fill-1">video_call</span>
                 </div>
                 <span className="text-[7px] font-black uppercase text-red-500/60">Record</span>
              </button>
              <button 
                onClick={() => handleMediaSend('audio', 'Voice_Reflection_1024.pcm')}
                className="flex flex-col items-center gap-1 group active:scale-90 transition-transform shrink-0"
              >
                 <div className="size-11 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-xl">mic</span>
                 </div>
                 <span className="text-[7px] font-black uppercase text-slate-400">Audio</span>
              </button>
              <button 
                onClick={() => handleMediaSend('video', 'CheckIn_Video_Update.mp4')}
                className="flex flex-col items-center gap-1 group active:scale-90 transition-transform shrink-0"
              >
                 <div className="size-11 rounded-2xl bg-urkio-magenta/5 text-urkio-magenta flex items-center justify-center group-hover:bg-urkio-magenta group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-xl">movie</span>
                 </div>
                 <span className="text-[7px] font-black uppercase text-slate-400">Upload</span>
              </button>
              <button 
                onClick={() => handleMediaSend('file', 'Journal_Entry_Week4.pdf')}
                className="flex flex-col items-center gap-1 group active:scale-90 transition-transform shrink-0"
              >
                 <div className="size-11 rounded-2xl bg-accent-cyan/5 text-accent-cyan flex items-center justify-center group-hover:bg-accent-cyan group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-xl">attach_file</span>
                 </div>
                 <span className="text-[7px] font-black uppercase text-slate-400">File</span>
              </button>
              <button 
                onClick={() => handleMediaSend('image', 'Snapshot_HabitTracker.jpg')}
                className="flex flex-col items-center gap-1 group active:scale-90 transition-transform shrink-0"
              >
                 <div className="size-11 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-xl">image</span>
                 </div>
                 <span className="text-[7px] font-black uppercase text-slate-400">Photo</span>
              </button>
           </div>

           <div className="flex gap-3">
             <div className="flex-1 relative group">
                <input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/10 rounded-2xl pl-5 pr-12 h-14 text-sm focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700 font-medium text-slate-900 dark:text-white"
                  placeholder="Your message..."
                />
             </div>
             <button 
               onClick={handleSend}
               disabled={!inputValue.trim()}
               className="size-14 urkio-gradient rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/30 disabled:opacity-30 disabled:grayscale active:scale-95 transition-all"
             >
               <span className="material-symbols-outlined text-2xl">send</span>
             </button>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivateChat;
