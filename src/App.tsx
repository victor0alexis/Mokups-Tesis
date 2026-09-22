import React, { useState, useEffect } from 'react';
import { Patient, ScreenView, BottomTab, AppTheme, AccessibilitySettings } from './types';
import { PATIENTS_LIST } from './data/mockData';
import { PhoneFrame } from './components/PhoneFrame';
import { PatientsLobbyView } from './components/PatientsLobbyView';
import { CaseBriefView } from './components/CaseBriefView';
import { ConsultationActiveView } from './components/ConsultationActiveView';
import { ProgressView } from './components/ProgressView';
import { ProtocolsModal } from './components/ProtocolsModal';
import { SettingsModal } from './components/SettingsModal';

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  highContrastVitals: false,
  reduceMotion: false,
  largerFontSize: false,
};

export default function App() {
  const [currentView, setCurrentView] = useState<ScreenView | 'progress'>('consultation');
  const [currentPatient, setCurrentPatient] = useState<Patient>(PATIENTS_LIST[0]);
  const [currentTab, setCurrentTab] = useState<BottomTab>('consulta');
  const [totalXp, setTotalXp] = useState<number>(250);

  // Protocols modal state
  const [activeProtocolName, setActiveProtocolName] = useState<string | null>(null);

  // Settings modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Theme state with localStorage persistence
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('obstetric_sim_theme');
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch {
      // localStorage may fail in sandboxed iframes
    }
    return 'light';
  });

  // Accessibility state with localStorage persistence
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem('obstetric_sim_accessibility');
      if (saved) {
        return { ...DEFAULT_ACCESSIBILITY, ...JSON.parse(saved) };
      }
    } catch {
      // ignore JSON parse or localStorage errors
    }
    return DEFAULT_ACCESSIBILITY;
  });

  // System dark preference listener
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const effectiveTheme: 'light' | 'dark' =
    theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme;

  // Synchronize .dark class on document.documentElement for Tailwind dark: variants
  useEffect(() => {
    const root = document.documentElement;
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Accessibility classes
    if (accessibility.largerFontSize) {
      root.classList.add('larger-font-mode');
    } else {
      root.classList.remove('larger-font-mode');
    }

    if (accessibility.highContrastVitals) {
      root.classList.add('high-contrast-mode');
    } else {
      root.classList.remove('high-contrast-mode');
    }

    if (accessibility.reduceMotion) {
      root.classList.add('reduce-motion-mode');
    } else {
      root.classList.remove('reduce-motion-mode');
    }
  }, [effectiveTheme, accessibility.largerFontSize, accessibility.highContrastVitals, accessibility.reduceMotion]);

  const handleThemeChange = (newTheme: AppTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('obstetric_sim_theme', newTheme);
    } catch {
      // ignore
    }
  };

  const handleToggleThemeQuick = () => {
    const nextTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
    handleThemeChange(nextTheme);
  };

  const handleAccessibilityChange = (newSettings: AccessibilitySettings) => {
    setAccessibility(newSettings);
    try {
      localStorage.setItem('obstetric_sim_accessibility', JSON.stringify(newSettings));
    } catch {
      // ignore
    }
  };

  // View frame mode: 'framed' (iPhone Mockup) or 'fluid'
  const [frameMode, setFrameMode] = useState<'framed' | 'fluid'>('framed');

  const handleSelectCase = (patient: Patient) => {
    setCurrentPatient(patient);
    setCurrentView('case_brief');
  };

  const handleStartConsultation = () => {
    setCurrentView('consultation');
  };

  const handleFinishCase = (earnedXp: number) => {
    setTotalXp((prev) => prev + earnedXp);
    setCurrentView('lobby');
    setCurrentTab('consulta');
  };

  const handleTabChange = (tab: BottomTab) => {
    setCurrentTab(tab);
    if (tab === 'inicio' || tab === 'consulta') {
      setCurrentView('lobby');
    } else if (tab === 'guias') {
      setActiveProtocolName('Guía Perinatal 2023');
    } else if (tab === 'progreso') {
      setCurrentView('progress');
    }
  };

  return (
    <div
      className={`min-h-screen ${
        effectiveTheme === 'dark' ? 'bg-[#0b0f15]' : 'bg-[#211a1a]'
      } flex flex-col items-center justify-center p-0 md:p-4 select-none transition-colors duration-300 ${
        effectiveTheme === 'dark' ? 'dark' : ''
      }`}
    >
      {/* Top Desktop Helper Bar */}
      <header className="w-full max-w-[560px] hidden md:flex items-center justify-between pb-3 px-2 text-xs text-slate-300">
        <div className="flex items-center gap-1.5 font-semibold text-rose-300">
          <span className="material-symbols-outlined text-base">local_hospital</span>
          <span className="tracking-wide">Simulador Clínico Obstetricia • ULAgos</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick theme toggle indicator */}
          <button
            onClick={handleToggleThemeQuick}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-xl border border-white/15 text-slate-200 transition-all cursor-pointer active:scale-95"
            title="Alternar entre modo diurno y guardia virtual (nocturno)"
          >
            <span className="material-symbols-outlined text-sm text-amber-300">
              {effectiveTheme === 'dark' ? 'dark_mode' : 'light_mode'}
            </span>
            <span className="text-[10px] font-bold">
              {effectiveTheme === 'dark' ? 'Guardia Virtual' : 'Modo Diurno'}
            </span>
          </button>

          {/* Settings button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl border border-white/15 text-slate-200 transition-all cursor-pointer active:scale-95"
            title="Configuración de accesibilidad y pantalla"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
          </button>

          {/* Quick Screen Switcher */}
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm p-1 rounded-xl border border-white/15">
            <button
              onClick={() => {
                setCurrentView('lobby');
                setCurrentTab('consulta');
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                currentView === 'lobby' ? 'bg-[#B85D6F] text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Lobby
            </button>
            <button
              onClick={() => setCurrentView('case_brief')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                currentView === 'case_brief' ? 'bg-[#B85D6F] text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Ficha
            </button>
            <button
              onClick={() => setCurrentView('consultation')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                currentView === 'consultation' ? 'bg-[#B85D6F] text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Consulta
            </button>
            <button
              onClick={() => setCurrentView('progress')}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                currentView === 'progress' ? 'bg-[#B85D6F] text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Progreso
            </button>
          </div>
        </div>
      </header>

      {/* Main View Port wrapped in Phone Frame */}
      {frameMode === 'framed' ? (
        <PhoneFrame>
          {currentView === 'lobby' && (
            <PatientsLobbyView
              onSelectCase={handleSelectCase}
              onOpenGuides={() => setActiveProtocolName('Guía Perinatal 2023')}
              onOpenProgress={() => setCurrentView('progress')}
              currentTab={currentTab}
              onChangeTab={handleTabChange}
              onOpenSettings={() => setIsSettingsOpen(true)}
              effectiveTheme={effectiveTheme}
              onToggleThemeQuick={handleToggleThemeQuick}
            />
          )}

          {currentView === 'case_brief' && (
            <CaseBriefView
              patient={currentPatient}
              onBack={() => setCurrentView('lobby')}
              onStartConsultation={handleStartConsultation}
              onOpenProtocol={(protocolName) => setActiveProtocolName(protocolName)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              effectiveTheme={effectiveTheme}
              onToggleThemeQuick={handleToggleThemeQuick}
              accessibility={accessibility}
            />
          )}

          {currentView === 'consultation' && (
            <ConsultationActiveView
              patient={currentPatient}
              onBack={() => setCurrentView('case_brief')}
              onFinishCase={handleFinishCase}
              onOpenSettings={() => setIsSettingsOpen(true)}
              effectiveTheme={effectiveTheme}
              onToggleThemeQuick={handleToggleThemeQuick}
              accessibility={accessibility}
            />
          )}

          {currentView === 'progress' && (
            <ProgressView
              totalXp={totalXp}
              onBack={() => {
                setCurrentView('lobby');
                setCurrentTab('consulta');
              }}
            />
          )}
        </PhoneFrame>
      ) : (
        <div className="w-full max-w-md h-screen bg-[#FDFBF9] dark:bg-[#0D131A] shadow-2xl flex flex-col overflow-hidden transition-colors">
          {currentView === 'lobby' && (
            <PatientsLobbyView
              onSelectCase={handleSelectCase}
              onOpenGuides={() => setActiveProtocolName('Guía Perinatal 2023')}
              onOpenProgress={() => setCurrentView('progress')}
              currentTab={currentTab}
              onChangeTab={handleTabChange}
              onOpenSettings={() => setIsSettingsOpen(true)}
              effectiveTheme={effectiveTheme}
              onToggleThemeQuick={handleToggleThemeQuick}
            />
          )}

          {currentView === 'case_brief' && (
            <CaseBriefView
              patient={currentPatient}
              onBack={() => setCurrentView('lobby')}
              onStartConsultation={handleStartConsultation}
              onOpenProtocol={(protocolName) => setActiveProtocolName(protocolName)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              effectiveTheme={effectiveTheme}
              onToggleThemeQuick={handleToggleThemeQuick}
              accessibility={accessibility}
            />
          )}

          {currentView === 'consultation' && (
            <ConsultationActiveView
              patient={currentPatient}
              onBack={() => setCurrentView('case_brief')}
              onFinishCase={handleFinishCase}
              onOpenSettings={() => setIsSettingsOpen(true)}
              effectiveTheme={effectiveTheme}
              onToggleThemeQuick={handleToggleThemeQuick}
              accessibility={accessibility}
            />
          )}

          {currentView === 'progress' && (
            <ProgressView
              totalXp={totalXp}
              onBack={() => {
                setCurrentView('lobby');
                setCurrentTab('consulta');
              }}
            />
          )}
        </div>
      )}

      {/* Protocols Modal */}
      <ProtocolsModal
        isOpen={activeProtocolName !== null}
        protocolName={activeProtocolName || ''}
        onClose={() => setActiveProtocolName(null)}
      />

      {/* Settings Modal (Theme selector & visual accessibility for virtual guard duty) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={handleThemeChange}
        accessibility={accessibility}
        onAccessibilityChange={handleAccessibilityChange}
      />
    </div>
  );
}
