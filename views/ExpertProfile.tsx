
import React, { useState, useEffect, useRef } from 'react';
import { AppScreen, Expert, Certification } from '../types';
import { BottomNav } from '../components/Navigation';

interface ExpertiseItem {
  name: string;
  isVisible: boolean;
}

interface Props {
  navigate: (screen: AppScreen, expert?: Expert, query?: string) => void;
}

interface AvailabilityDate {
  date: string;
  isActive: boolean;
}

const STUDY_LEVELS = [
  'Bachelor’s Degree',
  'Master’s Degree',
  'Doctorate',
  'Post-Doctorate',
  'Clinical Residency',
  'Board Certification'
];

const ExpertProfile: React.FC<Props> = ({ navigate }) => {
  const [formData, setFormData] = useState({
    name: 'Dr. Aris Varma',
    title: 'Clinical Psychologist',
    experience: '12',
    studyLevel: 'Doctorate',
    bio: 'Dedicated to providing holistic mental health support through science-based psychological practices.',
    linkedin: 'linkedin.com/in/arisvarma',
    twitter: '@drarisvarma',
    website: 'https://drarisvarma.com',
    instagram: '@aris_psychology',
    certSectionDesc: 'Official clinical credentials and board certifications verified by the medical council.',
    visibility: {
      linkedin: true,
      twitter: true,
      website: true,
      instagram: true,
      experience: true,
      bio: true,
      certifications: true,
    }
  });

  const isDietitian = formData.title.toLowerCase().includes('dietitian') || formData.title.toLowerCase().includes('nutrition');
  const themeGradient = isDietitian ? 'diet-gradient' : 'urkio-gradient';
  const themePrimaryText = isDietitian ? 'text-urkio-green' : 'text-primary';
  const themeBgPrimary = isDietitian ? 'bg-urkio-green' : 'bg-primary';
  const themePrimaryBorder = isDietitian ? 'border-urkio-green' : 'border-primary';
  const themeShadow = isDietitian ? 'shadow-urkio-green/40' : 'shadow-primary/40';

  const [expertise, setExpertise] = useState<ExpertiseItem[]>([
    { name: 'Anxiety', isVisible: true },
    { name: 'Cognitive Behavioral Therapy', isVisible: true },
    { name: 'Mindfulness', isVisible: true },
    { name: 'Stress Management', isVisible: false }
  ]);

  const [availabilityDates, setAvailabilityDates] = useState<AvailabilityDate[]>([
    { date: '2024-10-25', isActive: true },
    { date: '2024-10-26', isActive: true }
  ]);
  const [datePickerValue, setDatePickerValue] = useState('');

  const [certifications, setCertifications] = useState<Certification[]>([
    { id: '1', name: 'American Psychological Association (APA)', link: 'https://apa.org/verify/123' },
    { id: '2', name: 'Board Certified Telehealth Professional', link: 'https://credentials.example.com/verify' }
  ]);

  const [newTag, setNewTag] = useState('');
  const [newCertName, setNewCertName] = useState('');
  const [newCertLink, setNewCertLink] = useState('');
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [editingTagName, setEditingTagName] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowToast] = useState(false);
  const [profileImage, setProfileImage] = useState('https://picsum.photos/seed/expert/200/200');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80');
  
  const toastTimeoutRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
      setShowToast(false);
    }

    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      
      toastTimeoutRef.current = window.setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }, 1200);
  };

  const addExpertise = (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    const trimmed = newTag.trim();
    if (trimmed && !expertise.some(t => t.name.toLowerCase() === trimmed.toLowerCase())) {
      setExpertise([...expertise, { name: trimmed, isVisible: true }]);
      setNewTag('');
    }
  };

  const addCertification = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCertName.trim();
    const link = newCertLink.trim();
    if (name) {
      const newCert: Certification = {
        id: Date.now().toString(),
        name,
        link
      };
      setCertifications([...certifications, newCert]);
      setNewCertName('');
      setNewCertLink('');
    }
  };

  const removeCertification = (id: string) => {
    setCertifications(prev => prev.filter(c => c.id !== id));
  };

  const addAvailabilityDate = () => {
    if (datePickerValue && !availabilityDates.some(a => a.date === datePickerValue)) {
      setAvailabilityDates([...availabilityDates, { date: datePickerValue, isActive: true }]);
      setDatePickerValue('');
    }
  };

  const removeAvailabilityDate = (date: string) => {
    setAvailabilityDates(prev => prev.filter(a => a.date !== date));
  };

  const startEditTag = (tag: ExpertiseItem) => {
    setEditingTagName(tag.name);
    setEditValue(tag.name);
  };

  const saveEditTag = () => {
    const trimmed = editValue.trim();
    if (trimmed && editingTagName) {
      setExpertise(prev => prev.map(t => 
        t.name === editingTagName ? { ...t, name: trimmed } : t
      ));
      setEditingTagName(null);
      setEditValue('');
    }
  };

  const removeExpertise = (name: string) => {
    setExpertise(prev => prev.filter(t => t.name !== name));
  };

  const toggleTagVisibility = (name: string) => {
    setExpertise(prev => prev.map(t => 
      t.name === name ? { ...t, isVisible: !t.isVisible } : t
    ));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredExpertise = expertise.filter(tag => 
    tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark text-white max-w-md mx-auto shadow-2xl pb-40">
      <header className="sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md px-4 py-6 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => navigate(AppScreen.EXPERT_DASHBOARD)} className="size-10 flex items-center justify-center rounded-full bg-white/5">
          <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
        </button>
        <div className="text-center">
           <h2 className="text-sm font-black uppercase tracking-widest">Profile Builder</h2>
           <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">Public Identity Core</p>
        </div>
        <div className="size-10 flex items-center justify-center rounded-full bg-white/5">
          <svg className="size-6" viewBox="0 0 100 120" fill="none">
             <path d="M24 15V80C24 95 36 105 50 105C64 105 76 95 76 80V15" stroke="currentColor" strokeWidth="30" strokeLinecap="round" />
          </svg>
        </div>
      </header>

      <main className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
        {/* Construction Progress */}
        <div className="px-6 pt-6">
           <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                 <div className={`h-full ${themeBgPrimary} w-[65%] shadow-lg transition-all duration-1000`}></div>
              </div>
              <span className={`text-[10px] font-black ${themePrimaryText} uppercase`}>65% Complete</span>
           </div>
        </div>

        {/* Cover Photo */}
        <section className="relative group">
           <div 
             onClick={() => coverInputRef.current?.click()}
             className="w-full h-48 bg-slate-900 overflow-hidden cursor-pointer relative"
           >
              <img src={coverImage} className="size-full object-cover transition-transform group-hover:scale-105 duration-700 opacity-60" alt="Cover" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex flex-col items-center justify-center">
                 <div className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center gap-2">
                    <span className="material-symbols-outlined text-white text-sm">add_photo_alternate</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Select Background Scene</span>
                 </div>
              </div>
           </div>
           <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, setCoverImage)} />
        </section>

        {/* Profile Picture */}
        <section className="flex flex-col items-center -mt-16 relative z-10 px-6">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className={`size-32 rounded-3xl ${themeGradient} p-1 shadow-2xl`}>
              <div 
                className="size-full rounded-[24px] bg-center bg-no-repeat bg-cover transition-transform group-hover:scale-95 border-4 border-background-dark" 
                style={{backgroundImage: `url("${profileImage}")`}}
              ></div>
            </div>
            <button className={`absolute -bottom-1 -right-1 size-10 rounded-2xl ${themeBgPrimary} flex items-center justify-center border-4 border-background-dark shadow-lg`}>
              <span className="material-symbols-outlined text-white text-lg fill-1">photo_camera</span>
            </button>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, setProfileImage)} />
          <button onClick={() => fileInputRef.current?.click()} className={`mt-4 text-[10px] font-black ${themePrimaryText} uppercase tracking-[0.3em] hover:underline`}>
            Update Professional Headshot
          </button>
        </section>

        {/* Details Form */}
        <div className="px-6 space-y-12 pb-12">
          {/* Core Identity */}
          <section className="space-y-6">
            <h3 className={`text-xs font-bold uppercase tracking-widest ${themePrimaryText} border-b ${isDietitian ? 'border-urkio-green/20' : 'border-primary/20'} pb-2`}>Core Identity</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Professional Name</label>
              <input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className={`w-full h-14 px-5 bg-white/5 border-none rounded-2xl focus:ring-2 ${isDietitian ? 'focus:ring-urkio-green/50' : 'focus:ring-primary/50'} text-sm`}
                placeholder="e.g. Dr. Jane Smith"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Job Title</label>
              <input 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className={`w-full h-14 px-5 bg-white/5 border-none rounded-2xl focus:ring-2 ${isDietitian ? 'focus:ring-urkio-green/50' : 'focus:ring-primary/50'} text-sm`}
                placeholder="e.g. Psychologist"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Professional Bio</label>
              <textarea 
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
                className={`w-full min-h-[140px] p-5 bg-white/5 border-none rounded-2xl focus:ring-2 ${isDietitian ? 'focus:ring-urkio-green/50' : 'focus:ring-primary/50'} text-sm leading-relaxed`}
                placeholder="Tell seekers about your approach..."
              />
            </div>
          </section>

          {/* Professional Certifications Management */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className={`text-xs font-bold uppercase tracking-widest ${themePrimaryText}`}>Professional Certifications</h3>
              <div className="flex items-center gap-3">
                <span className="text-[8px] font-black text-slate-500 uppercase">{formData.visibility.certifications ? 'Public' : 'Hidden'}</span>
                <button 
                  onClick={() => setFormData({...formData, visibility: {...formData.visibility, certifications: !formData.visibility.certifications}})}
                  className={`w-10 h-5 rounded-full p-1 transition-all flex items-center ${formData.visibility.certifications ? themeBgPrimary : 'bg-slate-700 justify-start'}`}
                >
                  <div className="size-3 bg-white rounded-full shadow-lg"></div>
                </button>
              </div>
            </div>

            <div className="space-y-4">
               <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Certification Name</label>
                    <input 
                      value={newCertName}
                      onChange={(e) => setNewCertName(e.target.value)}
                      className="w-full h-12 px-4 bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-primary/40 text-sm"
                      placeholder="e.g. Board Certified Behavior Analyst"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Preview URL (Optional)</label>
                    <input 
                      value={newCertLink}
                      onChange={(e) => setNewCertLink(e.target.value)}
                      className="w-full h-12 px-4 bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-primary/40 text-sm"
                      placeholder="https://verify.org/id/123"
                    />
                  </div>
                  <button 
                    onClick={addCertification}
                    disabled={!newCertName.trim()}
                    className={`w-full h-12 rounded-xl ${themeBgPrimary} text-white text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg ${themeShadow} disabled:opacity-30`}
                  >
                    Add Certification
                  </button>
               </div>
            </div>

            <div className="space-y-3">
               {certifications.map((cert) => (
                 <div key={cert.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                       <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-xl">workspace_premium</span>
                       </div>
                       <div className="min-w-0 flex-1">
                          <p className="text-sm font-black truncate">{cert.name}</p>
                          {cert.link && (
                            <a href={cert.link} target="_blank" rel="noreferrer" className="text-[8px] font-bold text-primary uppercase tracking-widest hover:underline truncate block">
                              Preview Link
                            </a>
                          )}
                       </div>
                    </div>
                    <button 
                      onClick={() => removeCertification(cert.id)}
                      className="size-10 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                    >
                       <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                 </div>
               ))}
               {certifications.length === 0 && (
                 <div className="py-6 text-center rounded-[2rem] border-2 border-dashed border-white/5 opacity-40">
                    <p className="text-[10px] font-black uppercase text-slate-500">No certifications added yet</p>
                 </div>
               )}
            </div>
          </section>

          {/* Professional Presence */}
          <section className="space-y-6">
            <h3 className={`text-xs font-bold uppercase tracking-widest ${themePrimaryText} border-b ${isDietitian ? 'border-urkio-green/20' : 'border-primary/20'} pb-2`}>Professional Presence</h3>
            
            <div className="grid grid-cols-1 gap-6">
               <div className="space-y-2 group">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">LinkedIn Profile</label>
                 <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-primary transition-colors">link</span>
                    <input 
                      value={formData.linkedin}
                      onChange={e => setFormData({...formData, linkedin: e.target.value})}
                      className={`w-full h-14 pl-12 pr-5 bg-white/5 border-none rounded-2xl focus:ring-2 ${isDietitian ? 'focus:ring-urkio-green/50' : 'focus:ring-primary/50'} text-sm`}
                      placeholder="linkedin.com/in/username"
                    />
                 </div>
               </div>

               <div className="space-y-2 group">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Twitter / X</label>
                 <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-primary transition-colors">alternate_email</span>
                    <input 
                      value={formData.twitter}
                      onChange={e => setFormData({...formData, twitter: e.target.value})}
                      className={`w-full h-14 pl-12 pr-5 bg-white/5 border-none rounded-2xl focus:ring-2 ${isDietitian ? 'focus:ring-urkio-green/50' : 'focus:ring-primary/50'} text-sm`}
                      placeholder="@username"
                    />
                 </div>
               </div>

               <div className="space-y-2 group">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Professional Website</label>
                 <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-primary transition-colors">language</span>
                    <input 
                      value={formData.website}
                      onChange={e => setFormData({...formData, website: e.target.value})}
                      className={`w-full h-14 pl-12 pr-5 bg-white/5 border-none rounded-2xl focus:ring-2 ${isDietitian ? 'focus:ring-urkio-green/50' : 'focus:ring-primary/50'} text-sm`}
                      placeholder="https://yourwebsite.com"
                    />
                 </div>
               </div>

               <div className="space-y-2 group">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Instagram</label>
                 <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-primary transition-colors">photo_camera</span>
                    <input 
                      value={formData.instagram}
                      onChange={e => setFormData({...formData, instagram: e.target.value})}
                      className={`w-full h-14 pl-12 pr-5 bg-white/5 border-none rounded-2xl focus:ring-2 ${isDietitian ? 'focus:ring-urkio-green/50' : 'focus:ring-primary/50'} text-sm`}
                      placeholder="@username"
                    />
                 </div>
               </div>
            </div>
          </section>

          {/* Availability Protocol */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
               <h3 className={`text-xs font-bold uppercase tracking-widest ${themePrimaryText}`}>Availability Protocol</h3>
               <span className="material-symbols-outlined text-sm text-slate-500">calendar_month</span>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Set Specific Open Dates</label>
               <div className="flex gap-2">
                  <input 
                    type="date"
                    value={datePickerValue}
                    onChange={(e) => setDatePickerValue(e.target.value)}
                    className="flex-1 h-12 px-4 bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-primary/40 text-sm dark:color-scheme-dark text-white font-mono"
                  />
                  <button 
                    onClick={addAvailabilityDate}
                    disabled={!datePickerValue}
                    className={`px-4 h-12 rounded-xl ${themeBgPrimary} text-white text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg ${themeShadow} disabled:opacity-30`}
                  >
                    Add Date
                  </button>
               </div>
            </div>

            <div className="space-y-3">
               {availabilityDates.map((item) => (
                 <div key={item.date} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-4">
                       <div className={`size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center`}>
                          <span className="material-symbols-outlined text-xl">event_available</span>
                       </div>
                       <div>
                          <p className="text-sm font-black font-mono">{new Date(item.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Clinical Session Active</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => removeAvailabilityDate(item.date)}
                      className="size-10 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                    >
                       <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                 </div>
               ))}
               {availabilityDates.length === 0 && (
                 <div className="py-6 text-center rounded-[2rem] border-2 border-dashed border-white/5 opacity-40">
                    <p className="text-[10px] font-black uppercase text-slate-500">No specific dates committed yet</p>
                 </div>
               )}
            </div>
          </section>

          {/* Expertise Tagging System */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className={`text-xs font-bold uppercase tracking-widest ${themePrimaryText}`}>Expertise Areas</h3>
              <span className="text-[9px] font-black text-slate-500 uppercase">{expertise.length} Tags</span>
            </div>

            {/* Add New Tag */}
            <div className="space-y-3">
               <div className="flex gap-2">
                  <input 
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addExpertise()}
                    className="flex-1 h-12 px-4 bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-primary/40 text-sm placeholder:text-slate-600"
                    placeholder="Add specialized skill..."
                  />
                  <button 
                    onClick={() => addExpertise()}
                    className={`px-4 h-12 rounded-xl ${themeBgPrimary} text-white text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg ${themeShadow}`}
                  >
                    Add
                  </button>
               </div>
            </div>

            {/* Filter / Search Tags */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-sm">search</span>
              <input 
                value={tagSearchQuery}
                onChange={(e) => setTagSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 bg-white/5 border-none rounded-xl text-[11px] focus:ring-1 focus:ring-white/20"
                placeholder="Find existing tags..."
              />
            </div>

            {/* Tags List */}
            <div className="flex flex-wrap gap-2">
              {filteredExpertise.map(tag => {
                const isEditing = editingTagName === tag.name;
                return (
                  <div 
                    key={tag.name} 
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all ${
                      isEditing ? 'bg-primary/20 border-primary ring-2 ring-primary/20' : 
                      tag.isVisible ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/5 opacity-40 grayscale'
                    }`}
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input 
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEditTag()}
                          className="bg-transparent border-none p-0 text-[10px] font-black uppercase tracking-widest focus:ring-0 w-24"
                        />
                        <button onClick={saveEditTag} className="text-emerald-500 hover:scale-125 transition-transform">
                          <span className="material-symbols-outlined text-[16px] font-black">check</span>
                        </button>
                        <button onClick={() => setEditingTagName(null)} className="text-red-500 hover:scale-125 transition-transform">
                          <span className="material-symbols-outlined text-[16px] font-black">close</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${tag.isVisible ? themePrimaryText : 'text-slate-500'}`}>
                          {tag.name}
                        </span>
                        
                        <div className="flex items-center gap-1 ml-1 pl-2 border-l border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => toggleTagVisibility(tag.name)} className="text-slate-500 hover:text-white transition-colors" title="Toggle Visibility">
                              <span className="material-symbols-outlined text-[14px]">{tag.isVisible ? 'visibility' : 'visibility_off'}</span>
                           </button>
                           <button onClick={() => startEditTag(tag)} className="text-slate-500 hover:text-primary transition-colors" title="Edit Tag">
                              <span className="material-symbols-outlined text-[14px]">edit</span>
                           </button>
                           <button onClick={() => removeExpertise(tag.name)} className="text-slate-500 hover:text-red-500 transition-colors" title="Remove Tag">
                              <span className="material-symbols-outlined text-[14px]">delete</span>
                           </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* Save Button */}
      <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-6 z-[60]">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full h-16 ${themeGradient} rounded-2xl font-bold text-white shadow-xl ${themeShadow} flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70`}
        >
          {isSaving ? (
            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="material-symbols-outlined">publish</span>
              Launch Professional Page
            </>
          )}
        </button>
      </div>

      {showSavedToast && (
        <div className="fixed bottom-44 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4">
           <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
              <span className="material-symbols-outlined">check_circle</span>
              <p className="text-xs font-black uppercase tracking-widest">Changes Synced to Profile</p>
           </div>
        </div>
      )}

      <BottomNav role="EXPERT" currentScreen={AppScreen.EXPERT_PROFILE} navigate={navigate} />
    </div>
  );
};

export default ExpertProfile;
