import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
  activeAudio?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="relative w-full max-w-[430px] h-[932px] max-h-screen bg-[#FDFBF9] dark:bg-[#0D131A] text-[#211a1a] dark:text-slate-100 sm:rounded-[48px] shadow-2xl overflow-hidden flex flex-col border-0 sm:border-[7px] border-[#181112]/90 dark:border-[#222B38] select-none transition-colors duration-300">
      {/* iOS Status Bar & Dynamic Island */}
      <div 
        className="w-full pt-3 px-7 flex justify-between items-center z-50 shrink-0 select-none bg-[#FDFBF9]/95 dark:bg-[#0D131A]/95 backdrop-blur-md transition-colors"
        data-purpose="ios-status-bar"
      >
        <span className="text-xs font-bold tracking-tight text-[#211a1a] dark:text-slate-200">09:41</span>
        
        {/* Dynamic Island with animated audio pill */}
        <div className="h-7 w-28 bg-black rounded-full flex items-center justify-between px-3 shadow-inner">
          <div className="w-2 h-2 rounded-full bg-[#B85D6F] animate-ping" />
          <div className="flex items-center gap-[3px] h-3">
            <div className="w-[2px] h-2 bg-[#B85D6F] rounded-full wave-bar" />
            <div className="w-[2px] h-3.5 bg-[#B85D6F] rounded-full wave-bar" style={{ animationDelay: '0.2s' }} />
            <div className="w-[2px] h-1.5 bg-[#B85D6F] rounded-full wave-bar" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[#211a1a] dark:text-slate-200">
          <span className="material-symbols-outlined text-[15px]">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-[15px]">wifi</span>
          <span className="material-symbols-outlined text-[17px]">battery_full</span>
        </div>
      </div>

      {/* Viewport Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {children}
      </div>

      {/* iOS Home Indicator */}
      <div className="w-full flex justify-center pb-2 pt-1 bg-[#FDFBF9] dark:bg-[#0D131A] shrink-0 z-50 transition-colors">
        <div className="w-32 h-1 bg-[#181112]/20 dark:bg-white/25 rounded-full" />
      </div>
    </div>
  );
};

