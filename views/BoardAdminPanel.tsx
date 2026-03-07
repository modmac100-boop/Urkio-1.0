
import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';

interface ActivityLog {
  id: string;
  type: 'POST' | 'BOOKING' | 'TRIAGE' | 'ALERT' | 'EXPERTS';
  subject: string;
  details: string;
  timestamp: string;
  status: 'SAFE' | 'FLAGGED' | 'RESOLVED';
}

const MOCK_LOGS: ActivityLog[] = [
  { id: 'L1', type: 'TRIAGE', subject: 'Alex Johnson', details: 'Risk score 88 detected by AI Guide. Transferred to Dr. Elena Rodriguez.', timestamp: '2m ago', status: 'FLAGGED' },
  { id: 'L2', type: 'POST', subject: 'Child Anxiety Circle', details: 'New contribution published by Anonymous Member.', timestamp: '14m ago', status: 'SAFE' },
  { id: 'L3', type: 'EXPERTS', subject: 'Marcus Chen', details: 'Clinical license verification successful. Expert dashboard enabled.', timestamp: '45m ago', status: 'RESOLVED' },
  { id: 'L4', type: 'BOOKING', subject: 'Emma Watson', details: 'New consultation confirmed with Dr. Sarah Miller.', timestamp: '1h ago', status: 'SAFE' },
  { id: 'L5', type: 'ALERT', subject: 'Security System', details: 'Multiple failed Secure Port entries detected from IP: 192.168.1.1.', timestamp: '3h ago', status: 'FLAGGED' },
];

const BoardAdminPanel: React.FC<{ navigate: (s: AppScreen) => void }> = ({ navigate }) => {
  const [logs, setLogs] = useState<ActivityLog[]>(MOCK_LOGS);
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'DISCOVER' | 'SECURITY'>('TELEMETRY');
  const [load, setLoad] = useState(62);

  // Simulate real-time data shifts
  useEffect(() => {
    const timer = setInterval(() => {
      setLoad(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(Math.max(prev + delta, 40), 95);
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#020617] text-white max-w-md mx-auto shadow-2xl font-sans overflow-x-hidden">
      {/* HUD Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_transparent_70%)]"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>

      <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-xl p-6 border-b border-white/5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
           <div className="size-12 rounded-2xl urkio-gradient p-0.5 shadow-[0_0_20px_rgba(19,91,236,0.3)]">
              <div className="size-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                 <span className="material-symbols-outlined text-white text-2xl animate-pulse">hub</span>
              </div>
           </div>
           <div>
              <h1 className="text-lg font-black tracking-tight leading-none mb-1 font-display">Urkio Board Core</h1>
              <p className="text-[8px] font-mono uppercase tracking-[0.5em] text-accent-cyan">Platform God Mode</p>
           </div>
        </div>
        <button 
          onClick={() => navigate(AppScreen.SECURE_PORTAL)}
          className="size-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-all"
        >
          <span className="material-symbols-outlined">logout</span>
        </button>
      </header>

      <div className="px-6 mt-6">
         <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
            {(['TELEMETRY', 'DISCOVER', 'SECURITY'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                   activeTab === tab ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
         </div>
      </div>

      <main className="flex-1 p-6 space-y-8 no-scrollbar overflow-y-auto pb-32">
        {activeTab === 'TELEMETRY' && (
          <div className="space-y-8 animate-in fade-in duration-500">
             {/* Global Platform Pulse */}
             <section className="bg-white/5 border border-white/10 rounded-[3rem] p-8 relative overflow-hidden shadow-2xl group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <span className="material-symbols-outlined text-9xl">analytics</span>
                </div>
                <div className="relative z-10 space-y-8">
                   <div className="flex justify-between items-start">
                      <div>
                         <p className="text-[9px] font-black uppercase tracking-[0.3em] text-accent-cyan mb-2">Neural Load</p>
                         <h2 className="text-5xl font-black font-display">{load}%</h2>
                      </div>
                      <div className="size-14 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan">
                         <span className="material-symbols-outlined text-3xl animate-pulse">sensors</span>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 bg-black/40 rounded-3xl border border-white/5">
                         <p className="text-[8px] font-black uppercase text-slate-500 mb-1">Active Sessions</p>
                         <p className="text-xl font-black">1,422</p>
                      </div>
                      <div className="p-5 bg-black/40 rounded-3xl border border-white/5">
                         <p className="text-[8px] font-black uppercase text-slate-500 mb-1">Risk Anomalies</p>
                         <p className="text-xl font-black text-red-500">02</p>
                      </div>
                   </div>

                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-cyan shadow-[0_0_15px_#00f2ff] transition-all duration-1000" style={{ width: `${load}%` }}></div>
                   </div>
                </div>
             </section>

             {/* Platform-wide Stats */}
             <section className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 hover:bg-white/10 transition-all cursor-pointer">
                   <span className="material-symbols-outlined text-primary mb-2">groups</span>
                   <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Growth</h4>
                   <p className="text-xl font-black">+12.4%</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 hover:bg-white/10 transition-all cursor-pointer">
                   <span className="material-symbols-outlined text-urkio-magenta mb-2">payments</span>
                   <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Revenue</h4>
                   <p className="text-xl font-black">$42k</p>
                </div>
             </section>

             {/* System Health Module */}
             <section className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 flex gap-4">
                <div className="size-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                   <span className="material-symbols-outlined text-3xl">verified_user</span>
                </div>
                <div>
                   <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-1">Integrity Score: 99.8%</h4>
                   <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                      All clinical bridges are stable. Data vault sync is operating at nominal parameters across global regions.
                   </p>
                </div>
             </section>
          </div>
        )}

        {activeTab === 'DISCOVER' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Global Activity Stream</h3>
                <span className="text-[8px] font-mono text-primary uppercase">v4.2.1 Core Feed</span>
             </div>

             <div className="space-y-4">
                {logs.map((log, i) => (
                   <div 
                     key={log.id} 
                     className="bg-white/5 border border-white/10 rounded-[2rem] p-6 group hover:bg-white/10 transition-all relative overflow-hidden"
                   >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                        log.status === 'FLAGGED' ? 'bg-red-500' : 
                        log.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-primary'
                      }`}></div>
                      
                      <div className="flex justify-between items-start mb-3">
                         <div className="flex items-center gap-3">
                            <div className="size-9 rounded-xl bg-black/40 flex items-center justify-center text-slate-500">
                               <span className="material-symbols-outlined text-xl">
                                 {log.type === 'TRIAGE' ? 'psychology' : 
                                  log.type === 'POST' ? 'forum' : 
                                  log.type === 'EXPERTS' ? 'verified' : 'bolt'}
                               </span>
                            </div>
                            <div>
                               <h4 className="text-sm font-black text-white">{log.subject}</h4>
                               <p className="text-[8px] font-mono uppercase text-slate-600">Ref: #{log.id}-{log.type}</p>
                            </div>
                         </div>
                         <span className="text-[8px] font-mono text-slate-500">{log.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                         {log.details}
                      </p>
                      
                      <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                         <button className="h-8 px-4 bg-white/5 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Audit</button>
                         {log.status === 'FLAGGED' && (
                           <button className="h-8 px-4 bg-red-600 rounded-lg text-[8px] font-black uppercase tracking-widest text-white shadow-lg active:scale-95 transition-all">Intervene</button>
                         )}
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'SECURITY' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
             <section className="bg-slate-950 p-8 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
                <div className="relative z-10 flex flex-col items-center text-center gap-6">
                   <div className="size-20 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                      <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
                   </div>
                   <div>
                      <h3 className="text-xl font-black font-display mb-2">Board Access Logs</h3>
                      <p className="text-slate-500 text-xs font-medium leading-relaxed px-4">Review all administrative entry attempts to standard management ports and the Board Core.</p>
                   </div>
                   <button className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">View Logs</button>
                </div>
             </section>

             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">System Overrides</h4>
                <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-3xl flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-red-500">emergency</span>
                      <p className="text-xs font-black uppercase tracking-widest text-red-500">Global Read-Only Mode</p>
                   </div>
                   <button className="h-10 px-4 bg-red-600 rounded-xl text-[8px] font-black uppercase text-white shadow-lg">Disable</button>
                </div>
             </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-10 bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent z-50 text-center flex flex-col items-center gap-6">
         <div className="w-16 h-1 bg-primary/20 rounded-full"></div>
         <div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Board Integrity Authority</p>
            <p className="text-[8px] font-mono text-slate-700 uppercase mt-2">Active Signature: Master_Port_7.2_Alpha</p>
         </div>
      </footer>
    </div>
  );
};

export default BoardAdminPanel;
