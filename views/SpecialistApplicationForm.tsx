import React, { useState } from 'react';

const PRIMARY_TEAL = '#00796B';
const SECONDARY_PEACH = '#FFCCBC';
const BG_OFF_WHITE = '#F5F5F7';
const TEXT_PRIMARY = '#212121';
const TEXT_SECONDARY = '#757575';
const ACCENT_GOLD = '#FFC107';
const STATE_PENDING = '#FFB74D';
const STATE_APPROVED = '#4CAF50';
const STATE_REJECTED = '#E57373';

const ROLES = ['Doctor', 'Social Worker', 'Investor'];

export default function SpecialistApplicationForm() {
    const [name, setName] = useState('');
    const [professionalId, setProfessionalId] = useState('');
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = () => {
        if (!name || !professionalId || !selectedRole) {
            setSubmitStatus('error');
            return;
        }
        setIsSubmitting(true);
        setSubmitStatus('idle');

        // Mock submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus('success');
        }, 1500);
    };

    return (
        <div className="min-h-screen font-sans flex flex-col" style={{ backgroundColor: BG_OFF_WHITE }}>
            <div className="flex-1 w-full max-w-lg mx-auto p-6 pb-20 overflow-y-auto no-scrollbar">

                {/* Hero Header */}
                <header className="flex flex-col items-center mt-8 mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div
                        className="size-16 rounded-full flex items-center justify-center mb-5 shadow-lg"
                        style={{ backgroundColor: PRIMARY_TEAL, shadowColor: PRIMARY_TEAL, boxShadow: '0 4px 14px 0 rgba(0, 121, 107, 0.39)' }}
                    >
                        <span className="text-white font-extrabold text-2xl tracking-wider">U</span>
                    </div>
                    <h1 className="text-[28px] font-extrabold text-center tracking-tight leading-tight" style={{ color: TEXT_PRIMARY }}>
                        Join the Urkio Expert Network
                    </h1>
                    <p className="text-base text-center mt-3 leading-relaxed opacity-90" style={{ color: TEXT_SECONDARY }}>
                        Bring your expertise to a community focused on self-development and therapeutic growth.
                    </p>
                </header>

                {/* Validation/Status Alert */}
                {submitStatus === 'error' && (
                    <div className="flex items-center p-4 rounded-2xl mb-8 border border-[#E57373]/30 animate-in fade-in slide-in-from-top-2" style={{ backgroundColor: '#FDECE6' }}>
                        <span className="material-symbols-outlined mr-3" style={{ color: STATE_REJECTED }}>error</span>
                        <span className="font-semibold text-sm" style={{ color: STATE_REJECTED }}>
                            Please complete all required fields.
                        </span>
                    </div>
                )}

                {/* Form Section */}
                <main className="space-y-8">

                    {/* Personal Details */}
                    <section className="space-y-5 bg-white p-6 rounded-[2rem] shadow-sm border border-black/5">
                        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2" style={{ color: TEXT_PRIMARY }}>
                            <span className="material-symbols-outlined text-xl" style={{ color: PRIMARY_TEAL }}>person</span>
                            Personal Details
                        </h2>

                        <div className="space-y-2 relative group">
                            <label className="text-[11px] font-black tracking-widest uppercase ml-2 transition-colors duration-200" style={{ color: TEXT_SECONDARY }}>Full Name</label>
                            <input
                                type="text"
                                className="w-full h-14 bg-[#F8F9FA] rounded-2xl px-5 text-base border-2 transition-all duration-200 focus:outline-none focus:bg-white"
                                style={{
                                    borderColor: submitStatus === 'error' && !name ? STATE_REJECTED : 'transparent',
                                    color: TEXT_PRIMARY,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02) inset'
                                }}
                                placeholder="Dr. Jane Doe"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (submitStatus === 'error') setSubmitStatus('idle');
                                }}
                            />
                        </div>

                        <div className="space-y-2 relative group">
                            <label className="text-[11px] font-black tracking-widest uppercase ml-2 transition-colors duration-200" style={{ color: TEXT_SECONDARY }}>Professional ID / License</label>
                            <input
                                type="text"
                                className="w-full h-14 bg-[#F8F9FA] rounded-2xl px-5 text-base border-2 transition-all duration-200 focus:outline-none focus:bg-white"
                                style={{
                                    borderColor: submitStatus === 'error' && !professionalId ? STATE_REJECTED : 'transparent',
                                    color: TEXT_PRIMARY,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02) inset'
                                }}
                                placeholder="MED-12345678"
                                value={professionalId}
                                onChange={(e) => {
                                    setProfessionalId(e.target.value);
                                    if (submitStatus === 'error') setSubmitStatus('idle');
                                }}
                            />
                        </div>
                    </section>

                    {/* Specialty / Role */}
                    <section className="space-y-5 bg-white p-6 rounded-[2rem] shadow-sm border border-black/5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2" style={{ color: TEXT_PRIMARY }}>
                                <span className="material-symbols-outlined text-xl" style={{ color: PRIMARY_TEAL }}>work</span>
                                Your Specialty
                            </h2>
                            {submitStatus === 'error' && !selectedRole && (
                                <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: STATE_REJECTED }}>Required</span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {ROLES.map((role) => {
                                const isSelected = selectedRole === role;
                                return (
                                    <button
                                        key={role}
                                        onClick={() => {
                                            setSelectedRole(role);
                                            if (submitStatus === 'error') setSubmitStatus('idle');
                                        }}
                                        className={`px-5 py-3 rounded-full border-2 transition-all duration-300 font-semibold tracking-wide text-sm active:scale-95 ${isSelected ? 'shadow-[0_4px_12px_rgba(0,121,107,0.25)]' : 'hover:bg-gray-50'
                                            }`}
                                        style={{
                                            backgroundColor: isSelected ? PRIMARY_TEAL : 'white',
                                            borderColor: isSelected ? PRIMARY_TEAL : (submitStatus === 'error' && !selectedRole ? STATE_REJECTED : '#EAEAEA'),
                                            color: isSelected ? 'white' : TEXT_PRIMARY
                                        }}
                                    >
                                        {role}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Credential Upload */}
                    <section className="pt-2">
                        <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2" style={{ color: TEXT_PRIMARY }}>
                            <span className="material-symbols-outlined text-xl" style={{ color: PRIMARY_TEAL }}>verified</span>
                            Verification Documents
                        </h2>
                        <button
                            className="w-full border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center py-12 bg-white transition-all duration-300 hover:bg-[#F0F7F6] group active:scale-[0.98]"
                            style={{
                                borderColor: PRIMARY_TEAL + '50',
                            }}
                        >
                            <div className="size-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105 shadow-sm" style={{ backgroundColor: SECONDARY_PEACH + '30' }}>
                                <span className="material-symbols-outlined text-3xl" style={{ color: PRIMARY_TEAL }}>cloud_upload</span>
                            </div>
                            <span className="text-[17px] font-black tracking-tight mb-1" style={{ color: TEXT_PRIMARY }}>Upload Credentials</span>
                            <span className="text-[13px] font-medium opacity-80" style={{ color: TEXT_SECONDARY }}>
                                PDF, JPG or PNG. Max size 5MB.
                            </span>
                        </button>
                    </section>

                    {/* Submit Button */}
                    <div className="pt-8 pb-4">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || submitStatus === 'success'}
                            className="w-full h-[60px] rounded-full flex items-center justify-center transition-all duration-300 active:scale-[0.98] disabled:opacity-90 disabled:cursor-not-allowed group relative overflow-hidden"
                            style={{
                                backgroundColor: submitStatus === 'success' ? STATE_APPROVED : PRIMARY_TEAL,
                                boxShadow: submitStatus === 'success'
                                    ? '0 8px 20px -6px rgba(76, 175, 80, 0.5)'
                                    : '0 8px 20px -6px rgba(0, 121, 107, 0.4)'
                            }}
                        >
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {isSubmitting ? (
                                <div className="flex items-center gap-3">
                                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span className="text-white text-[15px] font-bold tracking-widest uppercase">Processing</span>
                                </div>
                            ) : submitStatus === 'success' ? (
                                <div className="flex items-center gap-3 animate-in zoom-in duration-300">
                                    <span className="material-symbols-outlined text-white text-2xl">check_circle</span>
                                    <span className="text-white text-[15px] font-bold tracking-widest uppercase">Application Received</span>
                                </div>
                            ) : (
                                <span className="text-white text-[15px] font-bold tracking-widest uppercase shadow-sm">Submit Application</span>
                            )}
                        </button>
                    </div>

                </main>
            </div>
        </div>
    );
}
