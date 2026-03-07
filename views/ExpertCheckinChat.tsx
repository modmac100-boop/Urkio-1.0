
import React, { useState, useRef, useEffect } from 'react';
import { AppScreen } from '../types';

interface Message {
  id: string;
  sender: 'therapist' | 'client';
  text: string;
  time: string;
}

interface Props {
  navigate: (screen: AppScreen) => void;
}

const ExpertCheckinChat: React.FC<Props> = ({ navigate }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'client', text: "I've been feeling a bit overwhelmed with the new routine. The morning sessions are hard.", time: 'Yesterday' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const empathyTemplates = [
    { text: "I hear you, Alex.", icon: "self_improvement" },
    { text: "Thank you for sharing this.", icon: "favorite" },
    { text: "How did that make you feel?", icon: "psychology" },
    { text: "We can discuss this soon.", icon: "event" },
    { text: "Try a 5-min breath.", icon: "spa" }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text?: string) => {
    const msgText = text || inputValue;
    if (!msgText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'therapist',
      text: msgText,
      time: 'Just now'
    };

    setMessages([...messages, newMsg]);
    setInputValue('');
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-dark text-white max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
      <header className="relative z-10 px-6 pt-10 pb-6 bg-background-dark/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(AppScreen.EXPERT_CONFESSION_REVIEW)} className="size-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </button>
          <div className="flex items-center gap-3">
             <div className="size-11 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-lg shadow-emerald-500/20">
                <img src="https://picsum.photos/seed/u4/100/100" className="size-full object-cover" alt="Alex Johnson" />
             </div>
             <div>
                <h2 className="text-sm font-black tracking-tight leading-none mb-1">Alex Johnson</h2>
                <div className="flex items-center gap-1.5">
                   <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                   <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Active Client</span>
                </div>
             </div>
          </div>
        </div>
        <button className="size-11 flex items-center justify-center text-slate-500 bg-white/5 rounded-2xl">
           <span className="material-symbols-outlined">clinical_notes</span>
        </button>
      </header>

      {/* Shared Reflection Context Banner */}
      <div className="px-6 py-4 bg-primary/10 border-b border-primary/20 animate-in slide-in-from-top duration-500">
         <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
               <span className="material-symbols-outlined text-primary text-xs fill-1">history_edu</span>
               <p className="text-[9px] font-black uppercase tracking-widest text-primary">Context: Reflection #829</p>
            </div>
            <span className="text-[8px] font-bold text-primary/60 uppercase">Oct 23 • 11:45 PM</span>
         </div>
         <p className="text-xs text-slate-400 italic line-clamp-1 font-medium bg-background-dark/40 px-3 py-2 rounded-xl border border-white/5">
           "I'm feeling much better today after the breathing exercises we practiced..."
         </p>
      </div>

      <main ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar scroll-smooth">
        <div className="flex flex-col items-center py-6">
           <div className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">
              Beginning of Follow-up
           </div>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'therapist' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-${msg.sender === 'therapist' ? 'right' : 'left'}-4 duration-300`}>
            <div className={`max-w-[85%] rounded-3xl px-5 py-4 shadow-xl ${
              msg.sender === 'therapist' 
                ? 'bg-primary text-white rounded-br-none shadow-primary/20' 
                : 'bg-white/5 text-slate-300 rounded-bl-none border border-white/10'
            }`}>
              <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
              <div className="flex justify-between items-center mt-2 opacity-50">
                <p className="text-[9px] font-bold uppercase">{msg.time}</p>
                {msg.sender === 'therapist' && <span className="material-symbols-outlined text-[14px]">done_all</span>}
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Quick Replies & Input */}
      <footer className="p-6 bg-background-dark/95 backdrop-blur-xl border-t border-white/5 space-y-5 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-right">
           {empathyTemplates.map((template, idx) => (
             <button 
               key={idx}
               onClick={() => handleSend(template.text)}
               className="shrink-0 flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 shadow-sm"
             >
               <span className="material-symbols-outlined text-sm">{template.icon}</span>
               {template.text}
             </button>
           ))}
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative group">
             <input 
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               className="w-full bg-white/5 border border-white/10 rounded-2xl pl-5 pr-12 h-16 text-sm focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-700 font-medium"
               placeholder="Write a supportive message..."
             />
             <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">attach_file</span>
             </button>
          </div>
          <button 
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            className="size-16 urkio-gradient rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/30 disabled:opacity-30 disabled:grayscale active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-2xl">send</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ExpertCheckinChat;
