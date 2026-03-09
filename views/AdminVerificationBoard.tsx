import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types';
import { db, auth } from '../services/firebase';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';

interface PendingSpecialist {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    credentialUrl?: string;
    letter?: string;
    role: string;
    isVerified: boolean;
    rejectionReason?: string;
    submittedAt?: any;
}

interface Props {
    navigate: (screen: AppScreen) => void;
    handleLogout: () => void;
}

const AdminVerificationBoard: React.FC<Props> = ({ navigate, handleLogout }) => {
    const [pendingUsers, setPendingUsers] = useState<PendingSpecialist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedUser, setSelectedUser] = useState<PendingSpecialist | null>(null);
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            // First, verify current user is a BOARD member (admin)
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("Not authenticated");

            const adminDoc = await getDoc(doc(db, 'profiles', currentUser.uid));
            if (!adminDoc.exists() || !['BOARD', 'FOUNDER'].includes(adminDoc.data()?.role)) {
                throw new Error("Unauthorized: Board clearance required.");
            }

            // Fetch pending specialists
            const profilesRef = collection(db, 'profiles');
            // Using 'in' requires a special index if combined with other fields, but we will just fetch where isVerified == false and filter role locally if needed, or query by role then filter isVerified locally to avoid index errors initially.
            const q = query(profilesRef, where('isVerified', '==', false));
            const querySnapshot = await getDocs(q);

            const pending: PendingSpecialist[] = [];
            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                if (data.role === 'SPECIALIST' || data.role === 'DOCTOR') {
                    // Exclude already rejected ones if desired, or show them with a tag
                    if (!data.rejectionReason) {
                        pending.push({ id: docSnap.id, ...data } as PendingSpecialist);
                    }
                }
            });

            // Sort by submission date locally
            pending.sort((a, b) => {
                const timeA = a.submittedAt?.toMillis() || 0;
                const timeB = b.submittedAt?.toMillis() || 0;
                return timeB - timeA;
            });

            setPendingUsers(pending);
        } catch (err: any) {
            console.error("Error fetching pending users:", err);
            setError(err.message || "Failed to load pending verifications.");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedUser) return;
        setActionLoading(true);
        try {
            const userRef = doc(db, 'profiles', selectedUser.id);
            await updateDoc(userRef, {
                isVerified: true,
                verifiedAt: serverTimestamp(),
                rejectionReason: null // Clear any past rejections just in case
            });

            // Remove from list
            setPendingUsers(prev => prev.filter(u => u.id !== selectedUser.id));
            setSelectedUser(null);
        } catch (err: any) {
            console.error("Error approving user:", err);
            alert("Failed to approve user: " + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedUser || !rejectReason.trim()) return;
        setActionLoading(true);
        try {
            const userRef = doc(db, 'profiles', selectedUser.id);
            await updateDoc(userRef, {
                rejectionReason: rejectReason.trim()
            });

            // Remove from list
            setPendingUsers(prev => prev.filter(u => u.id !== selectedUser.id));
            setSelectedUser(null);
            setIsRejecting(false);
            setRejectReason('');
        } catch (err: any) {
            console.error("Error rejecting user:", err);
            alert("Failed to reject user: " + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex flex-col bg-[#020617] text-white max-w-md mx-auto shadow-2xl font-sans overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_#1e1b4b_0%,_transparent_60%)]"></div>
            </div>

            <header className="relative z-10 p-6 border-b border-white/5 bg-[#020617]/90 backdrop-blur-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(AppScreen.SECURE_PORTAL)}
                        className="size-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-all shadow-inner active:scale-95"
                    >
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    <div>
                        <h1 className="text-xl font-black tracking-tight font-display">Board Core</h1>
                        <p className="text-[9px] font-mono tracking-[0.3em] uppercase text-primary">Verification Panel</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="size-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-red-500 hover:bg-red-500/10 transition-all"
                >
                    <span className="material-symbols-outlined">logout</span>
                </button>
            </header>

            <main className="relative z-10 flex-1 overflow-y-auto no-scrollbar p-6">
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-6 text-red-500 text-sm">
                        <span className="material-symbols-outlined align-middle mr-2">error</span>
                        {error}
                    </div>
                )}

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Pending Actions</h2>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black">{pendingUsers.length} queue</span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                        <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Querying Vaults...</p>
                    </div>
                ) : pendingUsers.length === 0 ? (
                    <div className="text-center py-20 px-8 opacity-60">
                        <span className="material-symbols-outlined text-5xl mb-4 text-slate-600">task_alt</span>
                        <h3 className="text-lg font-black mb-2">Queue Cleared</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">There are no pending specialist applications for the board to review at this time.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingUsers.map(user => (
                            <div
                                key={user.id}
                                onClick={() => setSelectedUser(user)}
                                className="bg-white/5 border border-white/10 rounded-[2rem] p-5 cursor-pointer hover:bg-white/10 hover:border-primary/30 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-12 rounded-2xl bg-black/40 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                            <span className="material-symbols-outlined text-[24px]">badge</span>
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-white">{user.fullName}</h3>
                                            <p className="text-[10px] font-mono text-slate-500 uppercase">{user.role}</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">chevron_right</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-black/40 rounded border border-white/5 text-[9px] text-slate-400">{user.email}</span>
                                    {user.phone && <span className="px-2 py-1 bg-black/40 rounded border border-white/5 text-[9px] text-slate-400">{user.phone}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Detail Modal */}
            {selectedUser && (
                <div className="absolute inset-0 z-50 bg-[#020617]/95 backdrop-blur-2xl flex flex-col animate-in slide-in-from-bottom-full duration-300">
                    <header className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
                        <h2 className="text-lg font-black font-display tracking-tight">Review Application</h2>
                        <button
                            onClick={() => { setSelectedUser(null); setIsRejecting(false); }}
                            className="size-10 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                    </header>

                    <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 pb-32">
                        {/* Applicant Profile */}
                        <section className="bg-white/5 rounded-3xl p-6 border border-white/10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="size-16 rounded-[1.5rem] bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                                    <span className="material-symbols-outlined text-3xl">psychology</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black">{selectedUser.fullName}</h3>
                                    <p className="text-xs text-slate-400 font-mono tracking-wider">{selectedUser.role}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Email</span>
                                    <span className="font-medium">{selectedUser.email}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Phone</span>
                                    <span className="font-medium">{selectedUser.phone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">UID</span>
                                    <span className="font-mono text-xs text-slate-400">{selectedUser.id}</span>
                                </div>
                            </div>
                        </section>

                        {/* Letter to Board */}
                        {selectedUser.letter && (
                            <section className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Introductions</h4>
                                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-sm leading-relaxed text-slate-300">
                                    "{selectedUser.letter}"
                                </div>
                            </section>
                        )}

                        {/* Document Viewer Stub */}
                        <section className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Clinical Credentials</h4>
                            <div className="h-64 bg-black/60 rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                                {selectedUser.credentialUrl ? (
                                    <div className="text-center p-6">
                                        <span className="material-symbols-outlined text-5xl text-emerald-500 mb-3 block">verified</span>
                                        <p className="text-sm font-medium">Document Uploaded</p>
                                        <a href={selectedUser.credentialUrl} target="_blank" rel="noreferrer" className="text-[10px] text-primary underline mt-2 inline-block uppercase tracking-widest font-black">View Original Source</a>
                                    </div>
                                ) : (
                                    <div className="text-center p-6 opacity-50">
                                        <span className="material-symbols-outlined text-4xl mb-3 block">description</span>
                                        <p className="text-xs">No document provided.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Reject Workflow */}
                        {isRejecting && (
                            <section className="p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] animate-in fade-in slide-in-from-top-4 duration-300">
                                <h4 className="text-xs font-black uppercase text-red-500 mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">warning</span>
                                    Rejection Reason
                                </h4>
                                <textarea
                                    value={rejectReason}
                                    onChange={e => setRejectReason(e.target.value)}
                                    placeholder="Provide clinical feedback for rejection..."
                                    className="w-full h-24 bg-black/40 border border-red-500/30 rounded-2xl p-4 text-sm text-white placeholder:text-red-500/50 focus:outline-none focus:border-red-500 resize-none mb-4 font-medium"
                                />
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsRejecting(false)}
                                        className="flex-1 py-3 bg-white/5 rounded-xl text-xs font-black uppercase text-slate-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        disabled={!rejectReason.trim() || actionLoading}
                                        className="flex-1 py-3 bg-red-600 rounded-xl text-xs font-black uppercase text-white shadow-lg disabled:opacity-50"
                                    >
                                        {actionLoading ? 'Processing...' : 'Confirm Reject'}
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>

                    {!isRejecting && (
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent flex gap-4">
                            <button
                                onClick={() => setIsRejecting(true)}
                                disabled={actionLoading}
                                className="flex-[0.8] h-14 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 transition-colors"
                            >
                                Reject
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={actionLoading}
                                className="flex-[1.2] h-14 bg-emerald-500 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
                            >
                                {actionLoading ? (
                                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                                        Approve
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminVerificationBoard;
