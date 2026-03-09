
import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';

interface ActiveEvent {
   id: string;
   type: 'TRIAGE' | 'TRANSACTION' | 'MODERATION' | 'SYSTEM';
   status: 'SAFE' | 'WARNING' | 'CRITICAL';
   label: string;
   details: string;
   timestamp: string;
}

const LIVE_EVENTS: ActiveEvent[] = [
   { id: 'E1', type: 'TRIAGE', status: 'WARNING', label: 'High Cortisol Pattern', details: 'User #9912 flagged by AI in Homii reflection. High urgency score (84).', timestamp: 'Just now' },
   { id: 'E2', type: 'TRANSACTION', status: 'SAFE', label: 'Payout Authorized', details: 'Commission of $1,240.00 synced to expert wallet #EX-14.', timestamp: '3m ago' },
   { id: 'E3', type: 'MODERATION', status: 'CRITICAL', label: 'Policy Violation', details: 'Post #8291 in Circle "Deep Health" flagged for off-platform solicitation.', timestamp: '12m ago' },
   { id: 'E4', type: 'SYSTEM', status: 'SAFE', label: 'Vault Sync Complete', details: 'Global biometric data backup established across 4 clinical nodes.', timestamp: '1h ago' },
];

const FounderAdminPanel: React.FC<{ navigate: (s: AppScreen) => void, handleLogout: () => void }> = ({ navigate, handleLogout }) => {
   const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'FINANCE' | 'OVERRIDE'>('TELEMETRY');
   const [systemLoad, setSystemLoad] = useState(42);
   const [userCount, setUserCount] = useState(12402);
   const [isEmergencyActive, setIsEmergencyActive] = useState(false);

   useEffect(() => {
      const timer = setInterval(() => {
         setSystemLoad(prev => Math.min(Math.max(prev + Math.floor(Math.random() * 7) - 3, 30), 85));
         setUserCount(prev => prev + Math.floor(Math.random() * 2));
      }, 3000);
      return () => clearInterval(timer);
   }, []);

   return (
      <div className="relative min-h-screen w-full flex flex-col bg-[#000000] text-white max-w-md mx-auto shadow-2xl font-sans overflow-x-hidden">
         {/* Void Atmosphere */}
         <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#0c4a6e_0%,_transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
         </div>

         <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-2xl p-6 border-b border-cyan-500/20 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-4">
               <button
                  onClick={() => navigate(AppScreen.SECURE_PORTAL)}
                  className="size-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-all active:scale-90 mr-2"
               >
                  <span className="material-symbols-outlined">arrow_back</span>
               </button>
               <div className="size-14 rounded-3xl urkio-gradient p-0.5 shadow-[0_0_30px_rgba(0,242,255,0.3)] group">
                  <div className="size-full bg-black rounded-[26px] flex items-center justify-center transition-transform group-hover:scale-90">
                     <span className="material-symbols-outlined text-white text-3xl animate-pulse">admin_panel_settings</span>
                  </div>
               </div>
               <div>
                  <h1 className="text-xl font-black tracking-tight leading-none mb-1 font-display uppercase italic">Foundry Core</h1>
                  <p className="text-[9px] font-mono uppercase tracking-[0.4em] text-cyan-400">Founder Direct Access</p>
               </div>
            </div>
            <button
               onClick={handleLogout}
               className="size-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-all active:scale-90"
            >
               <span className="material-symbols-outlined">logout</span>
            </button>
         </header>

         {/* Primary Tab Navigation */}
         <div className="px-6 mt-8">
            <div className="flex p-1.5 bg-white/5 rounded-3xl border border-white/5 shadow-inner">
               {(['TELEMETRY', 'FINANCE', 'OVERRIDE'] as const).map(tab => (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`flex-1 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(0,242,255,0.5)]' : 'text-slate-500 hover:text-slate-300'
                        }`}
                  >
                     {tab}
                  </button>
               ))}
            </div>
         </div>

         <main className="flex-1 p-6 space-y-10 overflow-y-auto no-scrollbar pb-40">
            {activeTab === 'TELEMETRY' && (
               <div className="space-y-10 animate-in fade-in duration-500">
                  {/* Dynamic Performance Matrix */}
                  <section className="bg-white/5 border border-white/10 rounded-[3rem] p-8 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                        <span className="material-symbols-outlined text-[140px]">radar</span>
                     </div>
                     <div className="relative z-10 space-y-10">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-2">Neural Bandwidth</p>
                              <h2 className="text-6xl font-black font-display tracking-tighter">{systemLoad}%</h2>
                           </div>
                           <div className="size-16 rounded-[2rem] bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 shadow-2xl shadow-cyan-400/20">
                              <span className="material-symbols-outlined text-4xl animate-pulse">cloud_sync</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-6 bg-black/60 rounded-[2rem] border border-white/5">
                              <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest mb-1">Total Seeders</p>
                              <p className="text-2xl font-black text-white">{userCount.toLocaleString()}</p>
                              <p className="text-[8px] text-emerald-400 mt-1 font-bold">+12 today</p>
                           </div>
                           <div className="p-6 bg-black/60 rounded-[2rem] border border-white/5">
                              <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest mb-1">Critical Triages</p>
                              <p className="text-2xl font-black text-red-500">04</p>
                              <p className="text-[8px] text-slate-600 mt-1 font-bold">Pending Review</p>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">
                              <span>CPU Utilization</span>
                              <span>Nominal</span>
                           </div>
                           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-400 shadow-[0_0_15px_#00f2ff] transition-all duration-1000" style={{ width: `${systemLoad}%` }}></div>
                           </div>
                        </div>
                     </div>
                  </section>

                  {/* Live Activity Discovery Stream */}
                  <section className="space-y-6">
                     <div className="flex items-center justify-between px-2">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Global Activity Signal</h3>
                        <span className="size-2 rounded-full bg-emerald-500 animate-ping"></span>
                     </div>

                     <div className="space-y-4">
                        {LIVE_EVENTS.map((event) => (
                           <div
                              key={event.id}
                              className="bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:bg-white/10 transition-all cursor-pointer group"
                           >
                              <div className="flex justify-between items-start mb-4">
                                 <div className="flex items-center gap-4">
                                    <div className={`size-10 rounded-xl flex items-center justify-center ${event.status === 'CRITICAL' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' :
                                          event.status === 'WARNING' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' :
                                             'bg-cyan-500/10 text-cyan-400'
                                       }`}>
                                       <span className="material-symbols-outlined text-2xl">
                                          {event.type === 'TRIAGE' ? 'psychology' :
                                             event.type === 'TRANSACTION' ? 'payments' :
                                                event.type === 'MODERATION' ? 'gavel' : 'shield'}
                                       </span>
                                    </div>
                                    <div>
                                       <h4 className="text-sm font-black tracking-tight">{event.label}</h4>
                                       <p className="text-[9px] font-mono uppercase text-slate-500">Ref: #{event.id}-{event.type}</p>
                                    </div>
                                 </div>
                                 <span className="text-[8px] font-mono text-slate-700">{event.timestamp}</span>
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed font-medium pl-14">
                                 {event.details}
                              </p>
                              <div className="mt-4 pt-4 border-t border-white/5 flex gap-2 pl-14">
                                 <button className="h-8 px-4 bg-white/5 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Deep Audit</button>
                                 {event.status === 'CRITICAL' && (
                                    <button className="h-8 px-4 bg-red-600 rounded-lg text-[8px] font-black uppercase tracking-widest text-white shadow-lg active:scale-95 transition-all">Founder Intervention</button>
                                 )}
                              </div>
                           </div>
                        ))}
                     </div>
                  </section>
               </div>
            )}

            {activeTab === 'FINANCE' && (
               <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                  <section className="bg-gradient-to-br from-[#0d1a12] to-black border border-emerald-500/20 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                        <span className="material-symbols-outlined text-9xl text-emerald-500">payments</span>
                     </div>
                     <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-2">Net Platform Revenue</p>
                        <h2 className="text-5xl font-black font-display tracking-tighter mb-10">$142,850.20</h2>

                        <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                           <div>
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Expert Payouts</p>
                              <p className="text-xl font-black text-white">$92,400</p>
                              <p className="text-[8px] text-emerald-500 font-bold">64.6% of GMV</p>
                           </div>
                           <div>
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Growth Velocity</p>
                              <p className="text-xl font-black text-primary">+24.2%</p>
                              <p className="text-[8px] text-slate-600 font-bold">Quarterly Metric</p>
                           </div>
                        </div>
                     </div>
                  </section>

                  <section className="space-y-4">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Revenue Breakdown</h4>
                     <div className="space-y-3">
                        {[
                           { label: 'Clinical Sessions', value: '$82k', icon: 'medical_services', color: 'bg-primary' },
                           { label: 'Circle Memberships', value: '$45k', icon: 'groups_3', color: 'bg-urkio-magenta' },
                           { label: 'Resource Unlocks', value: '$15k', icon: 'auto_stories', color: 'bg-cyan-500' },
                        ].map((item) => (
                           <div key={item.label} className="bg-white/5 border border-white/10 rounded-[1.8rem] p-5 flex items-center justify-between group hover:bg-white/10 transition-all">
                              <div className="flex items-center gap-4">
                                 <div className={`size-10 rounded-xl ${item.color}/10 flex items-center justify-center text-white`}>
                                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                 </div>
                                 <h5 className="text-sm font-black text-slate-300">{item.label}</h5>
                              </div>
                              <p className="text-base font-black text-white">{item.value}</p>
                           </div>
                        ))}
                     </div>
                  </section>
               </div>
            )}

            {activeTab === 'OVERRIDE' && (
               <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                  <section className="bg-red-500/5 border border-red-500/20 rounded-[3rem] p-8 text-center space-y-8">
                     <div className="size-20 rounded-[2.5rem] bg-red-600 flex items-center justify-center mx-auto shadow-2xl shadow-red-600/40 animate-pulse">
                        <span className="material-symbols-outlined text-white text-4xl font-black">emergency</span>
                     </div>
                     <div>
                        <h3 className="text-2xl font-black font-display text-white mb-2">Global Override</h3>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed px-4">Instant platform-wide control. These actions affect all sessions and user access immediately.</p>
                     </div>

                     <div className="grid grid-cols-1 gap-3">
                        <button
                           onClick={() => setIsEmergencyActive(!isEmergencyActive)}
                           className={`w-full h-16 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isEmergencyActive ? 'bg-white text-red-600 shadow-2xl' : 'bg-red-600 text-white shadow-xl shadow-red-600/20'
                              }`}
                        >
                           {isEmergencyActive ? 'Disable Maintenance Mode' : 'Activate Maintenance Mode'}
                        </button>
                        <button className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                           Broadcast Emergency Notice
                        </button>
                     </div>
                  </section>

                  <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                     <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                        <span className="material-symbols-outlined text-cyan-400">terminal</span>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">System Logs</h4>
                     </div>
                     <div className="font-mono text-[8px] text-cyan-500/60 h-48 overflow-y-auto no-scrollbar space-y-1">
                        <p>&gt; Protocol 7.2 handshake successful.</p>
                        <p>&gt; Foundry Core initialized for node 0x829.</p>
                        <p>&gt; Routing all clinical logs to Founder Vault.</p>
                        <p>&gt; Decrypting active session streams...</p>
                        <p>&gt; User #1024 connected to Expert #12.</p>
                        <p>&gt; Warning: Anomaly detected in region US-EAST-1.</p>
                        <p>&gt; Auto-scaling neural guide capacity...</p>
                        <p>&gt; Syncing financial ledger with clinical bridge.</p>
                        <p>&gt; Identity verified: Founder_Alpha_Actual.</p>
                        <p>&gt; Waiting for direct command...</p>
                        <p className="animate-pulse">_</p>
                     </div>
                  </section>
               </div>
            )}
         </main>

         <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-12 bg-gradient-to-t from-[#000000] via-[#000000]/95 to-transparent z-50 text-center flex flex-col items-center gap-6">
            <div className="w-20 h-1.5 urkio-gradient rounded-full opacity-40 shadow-[0_0_10px_#00f2ff]"></div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.6em] text-cyan-400">Absolute Authority Mode</p>
               <p className="text-[8px] font-mono text-slate-800 uppercase mt-2 tracking-tighter">Active Signature: Founder_actual_0x1192_Elite</p>
            </div>
         </footer>
      </div>
   );
};

export default FounderAdminPanel;
