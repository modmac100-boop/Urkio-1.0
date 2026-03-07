import React from 'react';

interface AvatarProps {
  src: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isExpert?: boolean;
  isTopSupporter?: boolean;
  isHallOfFame?: boolean;
  isEndorsed?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  size = 'md', 
  isExpert = false, 
  isTopSupporter = false,
  isHallOfFame = false,
  isEndorsed = false,
  className = ""
}) => {
  const sizeClasses = {
    sm: 'size-10 rounded-xl',
    md: 'size-12 rounded-[1.2rem]',
    lg: 'size-16 rounded-[1.5rem]',
    xl: 'size-32 rounded-[3rem]'
  };

  const innerRounded = {
    sm: 'rounded-[10px]',
    md: 'rounded-[1rem]',
    lg: 'rounded-[1.3rem]',
    xl: 'rounded-[2.8rem]'
  };

  return (
    <div className={`relative shrink-0 ${sizeClasses[size]} ${className}`}>
      {/* High-Intensity Hall of Fame Glowing Ring */}
      {isHallOfFame && (
        <>
          <div className="absolute -inset-2.5 gold-gradient rounded-[inherit] opacity-40 blur-[12px] animate-elite-glow z-0"></div>
          <div className="absolute -inset-1.5 urkio-gradient rounded-[inherit] opacity-80 blur-[4px] animate-pulse z-0"></div>
          {/* Animated Rotating Gradient Ring */}
          <div className="absolute -inset-[3px] rounded-[inherit] bg-gradient-to-tr from-yellow-400 via-urkio-magenta to-accent-cyan animate-[spin_4s_linear_infinite] z-0 opacity-100"></div>
        </>
      )}
      
      {/* Supporter Glow */}
      {isTopSupporter && !isHallOfFame && (
        <div className="absolute -inset-1.5 urkio-gradient rounded-[inherit] opacity-70 blur-[4px] animate-pulse"></div>
      )}
      
      <div className={`size-full p-0.5 relative z-10 ${
        isHallOfFame ? 'bg-[#0a0a1a] shadow-[0_0_30px_rgba(251,191,36,0.4)]' :
        isTopSupporter ? 'urkio-gradient shadow-lg' : 
        isExpert ? 'urkio-gradient shadow-md' : 'bg-slate-200 dark:bg-slate-800'
      } ${sizeClasses[size]}`}>
        <img 
          src={src} 
          className={`size-full object-cover border-2 ${isHallOfFame ? 'border-yellow-400/50' : 'border-white dark:border-slate-900'} ${innerRounded[size]}`} 
          alt="Avatar" 
        />
      </div>

      {/* Expert Verification Badge */}
      {isExpert && !isTopSupporter && !isHallOfFame && (
        <div className="absolute -bottom-1 -right-1 z-20 size-5 bg-emerald-500 rounded-lg border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-lg">
          <span className="material-symbols-outlined text-white text-[10px] font-black">verified</span>
        </div>
      )}

      {/* Supporter Heart Badge */}
      {isTopSupporter && !isHallOfFame && (
        <div className="absolute -bottom-1 -right-1 z-20 size-6 bg-urkio-magenta rounded-xl border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-xl animate-bounce duration-[3000ms]">
          <span className="material-symbols-outlined text-white text-[14px] fill-1">favorite</span>
        </div>
      )}

      {/* Hall of Fame Crown Badge */}
      {isHallOfFame && (
        <div className="absolute -bottom-2 -right-2 z-30 size-9 gold-gradient rounded-2xl border-[3px] border-white flex items-center justify-center shadow-2xl animate-bounce duration-[2500ms]">
          <span className="material-symbols-outlined text-white text-[20px] fill-1">workspace_premium</span>
        </div>
      )}

      {/* Professional Shield Badge (Endorsements) */}
      {isEndorsed && (
        <div className="absolute -top-1 -left-1 z-20 size-6 bg-primary rounded-xl border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-xl animate-pulse">
          <span className="material-symbols-outlined text-white text-[12px] fill-1">verified_user</span>
        </div>
      )}
    </div>
  );
};