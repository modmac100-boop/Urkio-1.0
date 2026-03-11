
import React, { useState, useRef, useEffect } from 'react';
import { AppScreen, ChatMessage, Expert } from '../types';
import { BottomNav } from '../components/Navigation';
import { getAiResponse, analyzeUserSituation } from '../services/geminiService';

interface Props {
  navigate: (screen: AppScreen, e?: Expert) => void;
  language: 'en' | 'ar' | 'fr';
}

const ThinkingSkeleton = ({ language }: { language: 'en' | 'ar' | 'fr' }) => (
  <div className="flex justify-start animate-in fade-in slide-in-from-left-4 duration-500 max-w-[85%]">
    <div className="relative w-full bg-white dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl rounded-bl-none border border-primary/20 shadow-2xl overflow-hidden p-6">
      {/* Neural Pulse Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-urkio-magenta/5 to-transparent animate-pulse"></div>

      <div className="relative z-10 space-y-4">
        {/* Status Badge */}
        <div className="flex items-center gap-2 mb-2">
          <div className="relative size-4">
            <span className="absolute inset-0 bg-primary/40 rounded-full animate-ping"></span>
            <span className="material-symbols-outlined text-primary text-[14px] animate-[spin_3s_linear_infinite]">hub</span>
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">
            {language === 'ar' ? 'جاري تحليل البيانات...' : language === 'fr' ? 'Traitement du Neural Core...' : 'Neural Core Processing...'}
          </span>
        </div>

        {/* Shimmering Lines */}
        <div className="space-y-3">
          <div className="h-2.5 w-3/4 bg-slate-200 dark:bg-slate-700/50 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent animate-shimmer"></div>
          </div>
          <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full relative overflow-hidden" style={{ animationDelay: '100ms' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent animate-shimmer"></div>
          </div>
          <div className="h-2.5 w-5/6 bg-slate-200 dark:bg-slate-700/50 rounded-full relative overflow-hidden" style={{ animationDelay: '200ms' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AiGuide: React.FC<Props> = ({ navigate, language }) => {
  const t = language === 'ar' ? {
    header: 'مرشد Urkio الذكي',
    help: 'مساعدة',
    introTitle: 'كيف يمكنني مساعدتك؟',
    introDesc: 'حلل مسارك أو اطلب مدير حالة.',
    actionScore: 'درجة الوضع',
    actionScoreDesc: 'تقدير التقدم بالذكاء الاصطناعي',
    actionHandoff: 'تسليم الحالة',
    actionHandoffDesc: 'إرسال إلى مدير الحالة',
    placeholder: 'تحدث مع مرشدك الذكي...',
    systemEstimation: 'بناءً على نشاطك (تتابع 4 أيام، 30 تأملاً)، جاهزيتك للعافية بنسبة 88٪. تشير تقلبات يوم الأربعاء إلى إجهاد حاد. أوصي بمشاركة هذا مع مدير الحالة.',
    systemHandoff: 'تم تغليف تأملاتك وبياناتك الصحية الأخيرة وإرسالها بأمان إلى مركز إدارة حالة Urkio. سيقوم مدير الحالة بمراجعة وضعك وتعيين خبير متخصص لرحلتك قريباً.',
    initialMsg: "مرحباً! أنا مرشدك في Urkio. يمكنني مساعدتك في فهم وضعك، أو تقديم تقديرات للعافية، أو تغليف بياناتك لمدير حالة بشري. ما الذي يدور في ذهنك؟",
    statusReadiness: 'جاهزية عالية',
    statusRouted: 'تم التوجيه إلى مركز الإدارة'
  } : language === 'fr' ? {
    header: 'Guide IA Urkio',
    help: 'Aide',
    introTitle: 'Comment puis-je vous guider ?',
    introDesc: 'Analysez votre parcours ou demandez un gestionnaire de cas.',
    actionScore: 'Score de situation',
    actionScoreDesc: 'Estimation IA',
    actionHandoff: 'Transfert de cas',
    actionHandoffDesc: 'Envoyer à un gestionnaire',
    placeholder: 'Parlez à votre guide IA...',
    systemEstimation: 'D\'après votre activité (série de 4 jours, 30 réflexions), votre préparation au bien-être est à 88%. Les pics de mercredi suggèrent un stress aigu. Je recommande de partager cela.',
    systemHandoff: 'Vos récentes réflexions de bien-être ont été transmises au centre de gestion des cas Urkio. Un gestionnaire examinera votre situation et vous assignera un expert.',
    initialMsg: "Bonjour ! Je suis votre guide Urkio. Je peux vous aider à comprendre votre situation, fournir des estimations de bien-être, ou transmettre vos données à un gestionnaire de cas humain. Que souhaitez-vous faire ?",
    statusReadiness: 'Haute préparation',
    statusRouted: 'Transmis au centre de gestion'
  } : {
    header: 'Urkio AI Guide',
    help: 'Help',
    introTitle: 'How can I guide you?',
    introDesc: 'Analyze your path or request a Case Manager.',
    actionScore: 'Situation Score',
    actionScoreDesc: 'AI progress estimation',
    actionHandoff: 'Case Handoff',
    actionHandoffDesc: 'Send to Case Manager',
    placeholder: 'Talk to your AI Guide...',
    systemEstimation: "Based on your activity (4-day streak, 30 reflections), your Wellness Readiness is at 88%. Wednesday spikes suggest acute stress. I recommend sharing this with a Case Manager.",
    systemHandoff: "Your recent reflections and wellness data have been securely packaged and transmitted to the Urkio Case Management Hub. A Case Manager will review your situation and assign a specialized expert to your journey shortly.",
    initialMsg: "Hello! I'm your Urkio Guide. I can help you understand your situation, provide wellness estimations, or package your data for a human Case Manager. What's on your mind?",
    statusReadiness: 'High Readiness',
    statusRouted: 'Routed to Management Hub'
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: t.initialMsg, time: '10:00 AM' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Prepare history for Gemini
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const aiResponseText = await getAiResponse(textToSend, history);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: aiResponseText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const runEstimation = async () => {
    setIsTyping(true);

    // Mock user data for analysis
    const mockUserData = {
      streak: 4,
      reflections: 30,
      recentMoods: ['anxious', 'stressed', 'tired'],
      lastReflection: "I've been feeling a lot of pressure at work lately and it's affecting my sleep."
    };

    const analysis = await analyzeUserSituation(mockUserData);

    const estimationMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'model',
      text: analysis?.summary || t.systemEstimation,
      time: language === 'ar' ? 'الآن' : language === 'fr' ? 'À l\'instant' : 'Just now',
      isSystemAction: true,
      actionType: 'estimation',
      analysisData: analysis
    };

    setMessages(prev => [...prev, estimationMsg]);
    setIsTyping(false);
  };

  const handoffToExpert = () => {
    setIsTyping(true);
    setTimeout(() => {
      const handoffMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        text: t.systemHandoff,
        time: language === 'ar' ? 'الآن' : language === 'fr' ? 'À l\'instant' : 'Just now',
        isSystemAction: true,
        actionType: 'handoff'
      };
      setMessages(prev => [...prev, handoffMsg]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-slate-50 dark:bg-background-dark max-w-md mx-auto shadow-2xl overflow-hidden">
      <header className="flex items-center p-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => navigate(AppScreen.USER_DASHBOARD)} className="text-primary pr-4">
          <span className={`material-symbols-outlined ${language === 'ar' ? 'rotate-180' : ''}`}>arrow_back_ios</span>
        </button>
        <div className="flex-1 text-center">
          <h2 className="text-lg font-bold no-mirror">Urkio AI Guide</h2>
        </div>
        <button
          onClick={() => navigate(AppScreen.EMERGENCY_SUPPORT)}
          className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-red-500 text-[14px] fill-1">emergency_home</span>
          <span className="text-[9px] font-black uppercase text-red-500 tracking-widest">{t.help}</span>
        </button>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        <section className="flex flex-col items-center py-6 text-center">
          <div className="size-24 rounded-full urkio-gradient p-1 mb-4 relative">
            <div className="size-full rounded-full bg-white dark:bg-background-dark flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-5xl">smart_toy</span>
            </div>
            <div className="absolute -bottom-1 -right-1 size-8 bg-emerald-500 rounded-full border-4 border-white dark:border-background-dark flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xs animate-pulse">check</span>
            </div>
          </div>
          <h3 className="text-xl font-black font-display">{t.introTitle}</h3>
          <p className="text-slate-500 text-sm font-medium">{t.introDesc}</p>
        </section>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={runEstimation}
            className="bg-primary/10 border border-primary/20 p-4 rounded-3xl text-start hover:bg-primary/20 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-primary mb-2">analytics</span>
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{t.actionScore}</h4>
            <p className="text-[9px] text-slate-500 font-bold mt-1">{t.actionScoreDesc}</p>
          </button>
          <button
            onClick={handoffToExpert}
            className="bg-urkio-magenta/10 border border-urkio-magenta/20 p-4 rounded-3xl text-start hover:bg-urkio-magenta/20 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-urkio-magenta mb-2">send_and_archive</span>
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{t.actionHandoff}</h4>
            <p className="text-[9px] text-slate-500 font-bold mt-1">{t.actionHandoffDesc}</p>
          </button>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-[1.8rem] px-5 py-4 shadow-sm ${msg.role === 'user'
                ? 'bg-primary text-white rounded-br-none'
                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none border border-gray-100 dark:border-gray-700'
              }`}>
              {msg.actionType === 'estimation' && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                  <div className="size-10 rounded-xl urkio-gradient flex items-center justify-center text-white">
                    <span className="text-sm font-black">{msg.analysisData?.readinessScore || '88'}%</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                    {msg.analysisData?.readinessScore > 70 ? t.statusReadiness : 'Needs Attention'}
                  </p>
                </div>
              )}
              {msg.actionType === 'handoff' && (
                <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">{t.statusRouted}</p>
                </div>
              )}
              <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
              <p className={`text-[10px] mt-2 opacity-50 font-bold`}>{msg.time}</p>
            </div>
          </div>
        ))}
        {isTyping && <ThinkingSkeleton language={language} />}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 dark:bg-background-dark/95 backdrop-blur-3xl border-t border-gray-100 dark:border-gray-800 pb-24 z-20">
        <div className="flex gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
            placeholder={t.placeholder}
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isTyping}
            className="size-14 urkio-gradient rounded-2xl flex items-center justify-center text-white shadow-lg disabled:opacity-50 active:scale-95 transition-all"
          >
            <span className={`material-symbols-outlined text-2xl ${language === 'ar' ? 'rotate-180' : ''}`}>send</span>
          </button>
        </div>
      </footer>
      <BottomNav role="USER" currentScreen={AppScreen.AI_GUIDE} navigate={navigate} language={language} />
    </div>
  );
};

export default AiGuide;
