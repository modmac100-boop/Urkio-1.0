
import React, { useState } from 'react';
import { AppScreen } from '../types';
import { BottomNav } from '../components/Navigation';

interface Transaction {
  id: string;
  type: 'Consultation' | 'Case Management' | 'Live Event' | 'Withdrawal';
  amount: number;
  date: string;
  client?: string;
  status: 'Completed' | 'Pending';
}

const TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'Consultation', amount: 60.00, date: 'Today, 10:30 AM', client: 'Liam Payne', status: 'Completed' },
  { id: 't2', type: 'Case Management', amount: 15.00, date: 'Today, 09:15 AM', client: 'Alex Johnson', status: 'Completed' },
  { id: 't3', type: 'Live Event', amount: 124.50, date: 'Yesterday', client: 'Sleep Science Workshop', status: 'Completed' },
  { id: 't4', type: 'Withdrawal', amount: -500.00, date: 'Oct 22, 2024', status: 'Completed' },
  { id: 't5', type: 'Consultation', amount: 60.00, date: 'Oct 22, 2024', client: 'Emma Watson', status: 'Completed' },
];

const ProfitOverview: React.FC<{navigate: (s: AppScreen) => void}> = ({ navigate }) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setWithdrawSuccess(true);
      setTimeout(() => setWithdrawSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark max-w-md mx-auto shadow-2xl pb-32 text-white font-sans overflow-x-hidden">
      {/* Financial Header */}
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-xl p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(AppScreen.EXPERT_DASHBOARD)} 
            className="size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </button>
          <h2 className="text-xl font-black font-display tracking-tight">Financial Hub</h2>
        </div>
        <button className="size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400">
          <span className="material-symbols-outlined">receipt_long</span>
        </button>
      </header>

      <main className="p-6 space-y-10">
        {/* Earnings Hero Card */}
        <section>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/10 p-8 shadow-2xl group">
             <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[60px] translate-x-12 -translate-y-12"></div>
             <div className="relative z-10 space-y-8">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-2">Available Balance</p>
                   <h1 className="text-5xl font-black font-display">$8,450.00</h1>
                </div>
                
                <div className="flex gap-4">
                   <div className="flex-1 space-y-1">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Expected Monthly</p>
                      <p className="text-lg font-black text-white">$12,400.00</p>
                   </div>
                   <div className="flex-1 space-y-1">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Year to Date</p>
                      <p className="text-lg font-black text-white">$42,850.00</p>
                   </div>
                </div>

                <button 
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                  className="w-full h-14 bg-emerald-500 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isWithdrawing ? (
                    <div className="size-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                      Withdraw Funds
                    </>
                  )}
                </button>
             </div>
          </div>
        </section>

        {/* Growth Analytics Mini Chart */}
        <section className="space-y-6">
           <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Earnings Growth</h3>
              <span className="text-[10px] font-black text-emerald-500">+18.4% vs last month</span>
           </div>
           <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 h-40 flex items-end justify-between gap-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
              {[30, 45, 40, 60, 55, 75, 90, 85, 100].map((h, i) => (
                <div key={i} className="flex-1 group relative flex flex-col items-center justify-end h-full">
                   <div 
                     className={`w-full rounded-t-lg transition-all duration-1000 ${i === 8 ? 'bg-primary shadow-[0_0_20px_rgba(19,91,236,0.3)]' : 'bg-white/10 group-hover:bg-primary/40'}`} 
                     style={{ height: `${h}%` }}
                   ></div>
                   {i === 8 && <div className="absolute -top-6 px-2 py-0.5 bg-primary rounded text-[8px] font-black uppercase">Current</div>}
                </div>
              ))}
           </div>
        </section>

        {/* Recent Transactions List */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Recent Activity</h3>
              <button className="text-primary text-[10px] font-black uppercase tracking-widest">Filter</button>
           </div>
           
           <div className="space-y-3">
              {TRANSACTIONS.map((t) => (
                <div key={t.id} className="bg-white/5 border border-white/10 rounded-3xl p-5 flex items-center justify-between group hover:bg-white/10 transition-all">
                   <div className="flex items-center gap-4">
                      <div className={`size-12 rounded-2xl flex items-center justify-center ${t.amount < 0 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                         <span className="material-symbols-outlined text-2xl">
                           {t.type === 'Withdrawal' ? 'outbox' : t.type === 'Live Event' ? 'podcasts' : 'medical_services'}
                         </span>
                      </div>
                      <div>
                         <h4 className="text-sm font-black">{t.type}</h4>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.client || 'Bank Account'}</p>
                         <p className="text-[8px] text-slate-600 mt-1">{t.date}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className={`text-sm font-black ${t.amount < 0 ? 'text-white' : 'text-emerald-500'}`}>
                        {t.amount < 0 ? `- $${Math.abs(t.amount).toFixed(2)}` : `+ $${t.amount.toFixed(2)}`}
                      </p>
                      <span className="text-[8px] font-black uppercase text-slate-600 tracking-tighter">{t.status}</span>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </main>

      {/* Withdraw Success Modal Overlay */}
      {withdrawSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background-dark/95 backdrop-blur-xl animate-in fade-in duration-500">
           <div className="text-center px-10 animate-in zoom-in duration-300">
              <div className="size-24 rounded-[2.5rem] urkio-gradient flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/40">
                 <span className="material-symbols-outlined text-white text-5xl font-black">check_circle</span>
              </div>
              <h3 className="text-3xl font-black mb-3 font-display">Transfer Initiated</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                 Your funds are being processed and should arrive in your verified bank account within 2-3 business days.
              </p>
              <div className="mt-10 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                 <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Transaction Ref</p>
                 <p className="text-xs font-mono text-primary uppercase">TX-8291-00192-URK</p>
              </div>
           </div>
        </div>
      )}

      <BottomNav role="EXPERT" currentScreen={AppScreen.PROFIT_OVERVIEW} navigate={navigate} />
    </div>
  );
};

export default ProfitOverview;
