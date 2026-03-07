
import React, { useState, useRef, useEffect } from 'react';
import { AppScreen } from '../types';

interface Question {
  id: string;
  user: string;
  avatar: string;
  text: string;
  upvotes: number;
  time: string;
  isAnswering?: boolean;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    user: 'Alex Johnson',
    avatar: 'https://picsum.photos/seed/alex/100/100',
    text: 'How does long-term stress affect the microbiome specifically?',
    upvotes: 42,
    time: '2m ago',
    isAnswering: true
  },
  {
    id: 'q2',
    user: 'Emma Watson',
    avatar: 'https://picsum.photos/seed/emma/100/100',
    text: 'Are probiotic supplements actually effective, or is natural food better?',
    upvotes: 28,
    time: '5m ago'
  },
  {
    id: 'q3',
    user: 'Liam Payne',
    avatar: 'https://picsum.photos/seed/liam/100/100',
    text: 'Can gut health affect sleep latency?',
    upvotes: 15,
    time: '8m ago'
  }
];

const LiveQa: React.FC<{ navigate: (s: AppScreen) => void }> = ({ navigate }) => {
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [activeTab, setActiveTab] = useState<'Questions' | 'Chat'>('Questions');
  const [inputValue, setInputValue] = useState('');
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [isLive, setIsLive] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleUpvote = (id: string) => {
    setVotedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setQuestions(qs => qs.map(q => q.id === id ? { ...q, upvotes: q.upvotes - 1 } : q));
      } else {
        next.add(id);
        setQuestions(qs => qs.map(q => q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q));
      }
      return next;
    });
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    if (activeTab === 'Questions') {
      const newQ: Question = {
        id: Date.now().toString(),
        user: 'You',
        avatar: 'https://picsum.photos/seed/you/100/100',
        text: inputValue,
        upvotes: 0,
        time: 'Just now'
      };
      setQuestions([newQ, ...questions]);
    }
    setInputValue('');
  };

  const answeringQuestion = questions.find(q => q.isAnswering);

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-dark text-white max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
      {/* Live Video/Visual Stream Area */}
      <div className="relative h-[45%] w-full bg-slate-900 group">
        <img 
          src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1000" 
          className="size-full object-cover opacity-60" 
          alt="Live Stream"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-black/40"></div>
        
        {/* Floating Controls Overlay */}
        <div className="absolute top-8 left-6 right-6 flex items-center justify-between">
           <button 
             onClick={() => navigate(AppScreen.UPCOMING_EVENTS)}
             className="size-11 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all"
           >
             <span className="material-symbols-outlined">arrow_back_ios_new</span>
           </button>
           <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-red-600/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-lg shadow-red-600/20">
                 <div className="size-2 bg-white rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Event</span>
              </div>
              <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                 <span className="material-symbols-outlined text-white text-[14px]">group</span>
                 <span className="text-[10px] font-bold text-white/90">1.2k</span>
              </div>
           </div>
        </div>

        {/* Center Play/Status Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-[60px] animate-pulse"></div>
              <div className="size-24 rounded-full border-2 border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                 <span className="material-symbols-outlined text-5xl text-white fill-1">cast_connected</span>
              </div>
           </div>
        </div>

        {/* Expert Persona Mini-Card */}
        <div className="absolute bottom-6 left-6 flex items-center gap-4 animate-in slide-in-from-left duration-700">
           <div className="relative">
              <div className="size-16 rounded-2xl urkio-gradient p-0.5 shadow-2xl">
                 <img src="https://picsum.photos/seed/mark/100/100" className="size-full rounded-[14px] object-cover border-2 border-background-dark" alt="Expert" />
              </div>
              <div className="absolute -bottom-1 -right-1 size-6 bg-emerald-500 rounded-lg border-2 border-background-dark flex items-center justify-center shadow-lg">
                 <span className="material-symbols-outlined text-white text-[12px] font-black">verified</span>
              </div>
           </div>
           <div className="drop-shadow-lg">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-1">Speaker</p>
              <h3 className="text-xl font-black font-display leading-none">Mark Thompson</h3>
              <p className="text-xs text-white/60 font-medium">Functional Nutritionist</p>
           </div>
        </div>
      </div>

      {/* Interactive Interaction Hub */}
      <div className="flex-1 flex flex-col bg-background-dark rounded-t-[3rem] -mt-10 relative z-10 border-t border-white/5">
        
        {/* Currently Answering Highlight */}
        {answeringQuestion && (
          <div className="mx-6 mt-8 p-6 urkio-gradient rounded-[2.5rem] shadow-2xl shadow-primary/20 relative overflow-hidden animate-in slide-in-from-bottom duration-500">
             <div className="absolute top-0 right-0 p-3 opacity-10">
                <span className="material-symbols-outlined text-6xl">voice_over_off</span>
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                   <span className="bg-white/20 px-2 py-0.5 rounded text-[8px] font-black uppercase text-white tracking-widest border border-white/20">Answering Now</span>
                   <span className="size-2 bg-emerald-400 rounded-full animate-pulse"></span>
                </div>
                <h4 className="text-sm font-black text-white leading-relaxed mb-4">"{answeringQuestion.text}"</h4>
                <div className="flex items-center gap-2">
                   <img src={answeringQuestion.avatar} className="size-6 rounded-full border border-white/20" alt={answeringQuestion.user} />
                   <span className="text-[10px] font-bold text-white/60 tracking-tight">{answeringQuestion.user}</span>
                </div>
             </div>
          </div>
        )}

        {/* Tabs for Questions & Chat */}
        <div className="px-6 mt-8 mb-4">
           <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/5">
              <button 
                onClick={() => setActiveTab('Questions')}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'Questions' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400'}`}
              >
                Questions
              </button>
              <button 
                onClick={() => setActiveTab('Chat')}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'Chat' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400'}`}
              >
                Live Chat
              </button>
           </div>
        </div>

        {/* Scrollable Feed Area */}
        <main ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-6 no-scrollbar">
           {activeTab === 'Questions' ? (
             <>
               <div className="flex items-center justify-between px-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Community Questions</h3>
                  <button className="text-primary text-[10px] font-black uppercase tracking-widest">Sort by Upvotes</button>
               </div>
               
               <div className="space-y-4 pb-20">
                 {questions.map((q) => (
                   <div 
                     key={q.id} 
                     className={`flex items-start gap-4 p-5 rounded-[2rem] border transition-all ${q.isAnswering ? 'bg-primary/10 border-primary/20 scale-[1.02] shadow-lg' : 'bg-white/5 border-white/10'}`}
                   >
                     <img src={q.avatar} className="size-10 rounded-xl border border-white/5 shrink-0" alt={q.user} />
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                           <p className="text-[11px] font-black text-slate-400 truncate">{q.user}</p>
                           <p className="text-[9px] font-bold text-slate-600 uppercase">{q.time}</p>
                        </div>
                        <p className="text-sm font-medium text-slate-200 leading-relaxed mb-3">{q.text}</p>
                        {q.isAnswering && (
                          <div className="flex items-center gap-1.5 mb-2">
                             <span className="material-symbols-outlined text-primary text-[14px] animate-pulse">sensors</span>
                             <span className="text-[9px] font-black uppercase text-primary tracking-widest">Mark is discussing this...</span>
                          </div>
                        )}
                     </div>
                     <button 
                        onClick={() => handleUpvote(q.id)}
                        className={`flex flex-col items-center gap-1 transition-all active:scale-95 ${votedIds.has(q.id) ? 'text-primary' : 'text-slate-600 hover:text-slate-400'}`}
                     >
                        <span className={`material-symbols-outlined text-2xl ${votedIds.has(q.id) ? 'fill-1' : ''}`}>arrow_circle_up</span>
                        <span className="text-xs font-black">{q.upvotes}</span>
                     </button>
                   </div>
                 ))}
               </div>
             </>
           ) : (
             <div className="flex flex-col h-full items-center justify-center py-20 text-center opacity-40">
                <span className="material-symbols-outlined text-5xl mb-4">forum</span>
                <h4 className="text-lg font-black mb-2">Live Chat is On</h4>
                <p className="text-xs px-10 leading-relaxed">Join the real-time conversation with other participants during the stream.</p>
             </div>
           )}
        </main>

        {/* Input Bar Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent pb-10">
           <div className="flex gap-3 items-center">
              <div className="flex-1 relative group">
                 <input 
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                   className="w-full bg-white/5 border border-white/10 rounded-2xl pl-5 pr-12 h-14 text-sm focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-700 font-medium"
                   placeholder={activeTab === 'Questions' ? "Ask the expert a question..." : "Type a message..."}
                 />
                 <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">{activeTab === 'Questions' ? 'help_outline' : 'mood'}</span>
                 </button>
              </div>
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="size-14 urkio-gradient rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/30 disabled:opacity-30 disabled:grayscale active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-2xl">{activeTab === 'Questions' ? 'add' : 'send'}</span>
              </button>
           </div>
           <p className="text-center text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mt-4">Verified Professional Q&A Environment</p>
        </div>

      </div>
    </div>
  );
};

export default LiveQa;
