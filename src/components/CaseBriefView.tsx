import React from 'react';
import { Patient, AccessibilitySettings } from '../types';
import { ULAGOS_LOGO_URL } from '../data/mockData';

interface CaseBriefViewProps {
  patient: Patient;
  onBack: () => void;
  onStartConsultation: () => void;
  onOpenProtocol: (protocolName: string) => void;
  onOpenSettings?: () => void;
  effectiveTheme?: 'light' | 'dark';
  onToggleThemeQuick?: () => void;
  accessibility?: AccessibilitySettings;
}

export const CaseBriefView: React.FC<CaseBriefViewProps> = ({
  patient,
  onBack,
  onStartConsultation,
  onOpenProtocol,
  onOpenSettings,
  effectiveTheme = 'light',
  onToggleThemeQuick,
  accessibility,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between h-full bg-[#FDFBF9] dark:bg-[#0D131A] overflow-hidden select-none transition-colors">
      {/* Compact Header Navigation */}
      <header className="w-full pt-2 pb-2.5 px-4 flex items-center justify-between border-b border-[#EFE7E4]/70 dark:border-slate-800 bg-[#FDFBF9]/95 dark:bg-[#0D131A]/95 backdrop-blur-md shrink-0 z-40 transition-colors">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[#B85368] dark:text-rose-300 bg-[#FFF5F6] dark:bg-[#B85368]/20 border border-[#F1E5E4] dark:border-[#B85368]/40 transition-colors font-semibold text-xs py-1.5 px-3 rounded-full active:scale-[0.98] shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px]">arrow_back_ios_new</span>
          <span>Casos</span>
        </button>

        <div className="flex items-center justify-center bg-white dark:bg-slate-800 border border-[#F1E5E4] dark:border-slate-700 rounded-full px-3 py-1 shadow-xs">
          <img
            alt="Logo Universidad de Los Lagos"
            className="h-8 object-contain drop-shadow-sm brightness-105 contrast-105 transition-all"
            src={ULAGOS_LOGO_URL}
          />
        </div>

        {/* Acciones derecha: Tema, Ajustes y Perfil */}
        <div className="flex items-center gap-1.5">
          {onToggleThemeQuick && (
            <button
              onClick={onToggleThemeQuick}
              className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-amber-300 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={effectiveTheme === 'dark' ? 'Modo guardia virtual activo (Noche)' : 'Modo diurno activo'}
            >
              <span className="material-symbols-outlined text-[17px]">
                {effectiveTheme === 'dark' ? 'dark_mode' : 'light_mode'}
              </span>
            </button>
          )}

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Configuración de guardia"
            >
              <span className="material-symbols-outlined text-[17px]">tune</span>
            </button>
          )}

          <div className="w-8 h-8 rounded-full bg-[#B85368] text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[17px]">person</span>
          </div>
        </div>
      </header>

      {/* Main Scrollable Content Inside Chassis */}
      <main className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3.5 scrollbar-none hide-scrollbar">
        {/* Header del caso clínico con paleta cálida perinatal */}
        <div className="flex flex-col rounded-2xl bg-gradient-to-br from-white via-[#FFF5F6]/40 to-[#FFF7F5] dark:from-[#151D28] dark:via-[#1A2433] dark:to-[#171A24] border border-[#F1E5E4] dark:border-slate-800 p-4 gap-2.5 shadow-[0_4px_18px_rgba(184,83,104,0.06)] relative overflow-hidden transition-colors">
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-[#FFF1F3] dark:bg-[#B85D6F]/10 blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between relative z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF5F6] dark:bg-[#B85D6F]/20 text-[#B85368] dark:text-rose-300 text-[10px] font-bold uppercase tracking-wider border border-[#F1E5E4] dark:border-[#B85D6F]/40">
              <span className="material-symbols-outlined text-[13px] text-[#B85368] dark:text-rose-400">pregnant_woman</span>
              Obstetricia
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FEF7EE] dark:bg-amber-950/40 text-[#C5782C] dark:text-amber-300 text-[10px] font-bold border border-[#ffdcc2] dark:border-amber-800/60 shadow-xs">
              <span className="material-symbols-outlined text-[13px] text-[#C5782C] dark:text-amber-400 fill-1">bolt</span>
              Nivel 1 • Fácil
            </span>
          </div>
          <div className="relative z-10">
            <h1 className="text-[21px] leading-tight font-bold text-[#231B1C] dark:text-white tracking-tight font-sans">
              {patient.caseTitle}
            </h1>
            <div className="flex items-center gap-1.5 text-[#5D4E51] dark:text-slate-300 text-xs mt-1.5">
              <div className="w-5 h-5 rounded-full bg-[#EBF6F4] dark:bg-[#296861]/30 flex items-center justify-center text-[#2A756C] dark:text-[#5AA298]">
                <span className="material-symbols-outlined text-[13px]">calendar_month</span>
              </div>
              <span className="text-[11px] font-semibold text-[#2A756C] dark:text-[#5AA298]">
                Semana {patient.gestationalWeeks} • Tercer Trimestre
              </span>
            </div>
          </div>
        </div>

        {/* 3 Métricas esenciales compactas */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-white dark:bg-[#151D28] border border-[#F1E5E4] dark:border-slate-800 text-center shadow-xs">
            <span className="text-[10px] text-[#8A797C] dark:text-slate-400 font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#D96880]">schedule</span>
              Tiempo
            </span>
            <span className="text-[14px] font-bold text-[#231B1C] dark:text-white mt-0.5">20 min</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-white dark:bg-[#151D28] border border-[#ffdcc2] dark:border-amber-900/50 text-center shadow-xs">
            <span className="text-[10px] text-[#C5782C] dark:text-amber-400 font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#C5782C] dark:text-amber-400 fill-1">star</span>
              Premio
            </span>
            <span className="text-[14px] font-bold text-[#C5782C] dark:text-amber-300 mt-0.5">+50 XP</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-white dark:bg-[#151D28] border border-[#b0efe4] dark:border-emerald-950/80 text-center shadow-xs">
            <span className="text-[10px] text-[#2A756C] dark:text-[#5AA298] font-semibold flex items-center gap-1 truncate">
              <span className="material-symbols-outlined text-[14px] text-[#2A756C] dark:text-[#5AA298]">psychology</span>
              Competencia
            </span>
            <span className="text-[12px] font-bold text-[#2A756C] dark:text-[#6BC1B6] mt-0.5 leading-tight truncate px-1">
              Razonamiento
            </span>
          </div>
        </div>

        {/* Tarjeta Compacta: Paciente */}
        <div className="rounded-2xl bg-white dark:bg-[#151D28] border border-[#F1E5E4] dark:border-slate-800 p-4 flex flex-col gap-3 shadow-[0_4px_20px_rgba(184,83,104,0.06)] relative overflow-hidden transition-all duration-300 hover:shadow-[0_6px_24px_rgba(184,83,104,0.1)]">
          <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-[#FFF1F3]/60 dark:bg-[#B85D6F]/10 blur-xl pointer-events-none"></div>

          {/* Header Section with Refined Badging */}
          <div className="flex items-center justify-between border-b border-[#F1E5E4]/80 dark:border-slate-800 pb-2.5 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#FFF5F6] dark:bg-[#B85D6F]/20 border border-[#F1E5E4] dark:border-[#B85D6F]/40 flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[#B85368] dark:text-rose-400 text-[15px]">badge</span>
              </div>
              <div>
                <h2 className="text-[11px] font-bold text-[#231B1C] dark:text-white uppercase tracking-wider leading-none">
                  Ficha de Paciente
                </h2>
                <span className="text-[9px] text-[#8A797C] dark:text-slate-400 font-medium tracking-wide block mt-0.5">
                  Historia Clínica Perinatal
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#2A756C] dark:text-[#5AA298] bg-[#EBF6F4] dark:bg-[#296861]/30 px-2.5 py-1 rounded-full border border-[#b0efe4] dark:border-[#296861]/40 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2A756C] dark:bg-[#5AA298] animate-pulse"></span>
              Ficha Activa
            </span>
          </div>

          {/* Key Clinical Identity Row */}
          <div className="grid grid-cols-2 gap-2 relative z-10 text-xs">
            {/* Paciente Tile */}
            <div className="bg-gradient-to-br from-[#FAF6F5] via-white to-[#FFF5F6]/30 dark:from-[#1E2736] dark:via-[#1A2330] dark:to-[#1E2736] p-2.5 rounded-xl border border-[#F1E5E4] dark:border-slate-700 transition-all duration-300 hover:border-[#B85368]/40 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-[#8A797C] dark:text-slate-400 font-bold uppercase tracking-wider">Paciente</span>
                <span className="material-symbols-outlined text-[13px] text-[#B85368]/60 dark:text-rose-400">person</span>
              </div>
              <span className="font-bold text-[#231B1C] dark:text-white text-[12px] tracking-tight mt-1 truncate">
                {patient.name} <span className="text-[11px] font-normal text-[#5D4E51] dark:text-slate-400">({patient.age} a)</span>
              </span>
            </div>

            {/* Formula Obstétrica Tile */}
            <div className="bg-gradient-to-br from-[#FAF6F5] via-white to-[#EBF6F4]/30 dark:from-[#1E2736] dark:via-[#1A2330] dark:to-[#1E2736] p-2.5 rounded-xl border border-[#F1E5E4] dark:border-slate-700 transition-all duration-300 hover:border-[#2A756C]/40 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-[#8A797C] dark:text-slate-400 font-bold uppercase tracking-wider">Fórmula Obstétrica</span>
                <span className="material-symbols-outlined text-[13px] text-[#2A756C]/70 dark:text-[#5AA298]">child_care</span>
              </div>
              <span className="font-bold text-[#231B1C] dark:text-white text-[12px] tracking-tight mt-1 truncate">
                {patient.gestationalFormula}
              </span>
            </div>
          </div>

          {/* Modalidad & Gestational Age Row */}
          <div className="bg-gradient-to-br from-[#FAF6F5] via-white to-[#FFF5F6]/40 dark:from-[#1E2736] dark:via-[#1A2330] dark:to-[#1E2736] p-2.5 rounded-xl border border-[#F1E5E4] dark:border-slate-700 transition-all duration-300 hover:border-[#B85368]/30 shadow-xs flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 border border-[#F1E5E4] dark:border-slate-700 flex items-center justify-center text-[#B85368] dark:text-rose-400 shadow-xs">
                <span className="material-symbols-outlined text-[14px]">local_hospital</span>
              </div>
              <div>
                <span className="text-[9px] text-[#8A797C] dark:text-slate-400 font-bold uppercase tracking-wider block leading-none">
                  Modalidad de Atención
                </span>
                <span className="font-bold text-[#231B1C] dark:text-white text-[11px] tracking-tight block mt-0.5">
                  Consulta Espontánea en APS
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2A756C] dark:text-[#5AA298] bg-[#EBF6F4] dark:bg-[#296861]/30 px-2.5 py-1 rounded-full border border-[#b0efe4] dark:border-[#296861]/40 shadow-xs">
              <span className="material-symbols-outlined text-[12px]">calendar_today</span>
              {patient.gestationalWeeks} semanas
            </span>
          </div>
        </div>

        {/* Tarjeta Compacta: Sospechas Clínicas */}
        <div className="rounded-2xl bg-white dark:bg-[#151D28] border border-[#ffdcc2] dark:border-amber-900/60 p-3.5 flex flex-col gap-2.5 shadow-[0_2px_12px_rgba(197,120,44,0.04)] transition-colors">
          <div className="flex items-center justify-between border-b border-[#ffdcc2]/60 dark:border-amber-900/40 pb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-[#FEF7EE] dark:bg-amber-950/50 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#C5782C] dark:text-amber-400 text-[15px]">warning</span>
              </div>
              <h2 className="text-[11px] font-bold text-[#C5782C] dark:text-amber-300 uppercase tracking-wider">
                Sospechas Clínicas
              </h2>
            </div>
            <span className="text-[10px] font-bold text-[#C5782C] dark:text-amber-300 bg-[#FEF7EE] dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-[#ffdcc2] dark:border-amber-800">
              Hallazgos
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {patient.suspicions.map((susp, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-xs ${
                  idx === 0
                    ? 'bg-[#FEF7EE] dark:bg-amber-950/40 border border-[#ffdcc2] dark:border-amber-900 text-[#C5782C] dark:text-amber-300'
                    : idx === 1
                    ? 'bg-[#FFF5F6] dark:bg-rose-950/40 border border-[#F1E5E4] dark:border-rose-900 text-[#B85368] dark:text-rose-300'
                    : 'bg-[#EBF6F4] dark:bg-[#296861]/30 border border-[#b0efe4] dark:border-[#296861]/60 text-[#2A756C] dark:text-[#5AA298]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    idx === 0 ? 'bg-[#C5782C]' : idx === 1 ? 'bg-[#D96880]' : 'bg-[#2A756C]'
                  }`}
                />
                {susp}
              </span>
            ))}
          </div>
        </div>

        {/* Tarjeta Compacta: Protocolos */}
        <div className="rounded-2xl bg-white dark:bg-[#151D28] border border-[#F1E5E4] dark:border-slate-800 p-3.5 flex flex-col gap-2.5 shadow-[0_2px_12px_rgba(35,27,28,0.03)] transition-colors">
          <div className="flex items-center justify-between border-b border-[#F1E5E4]/60 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-[#FFF5F6] dark:bg-[#B85D6F]/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#B85368] dark:text-rose-400 text-[15px]">menu_book</span>
              </div>
              <h2 className="text-[11px] font-bold text-[#231B1C] dark:text-white uppercase tracking-wider">
                Protocolos Oficiales
              </h2>
            </div>
            <span className="text-[10px] font-bold text-[#2A756C] dark:text-[#5AA298] bg-[#EBF6F4] dark:bg-[#296861]/30 px-2.5 py-0.5 rounded-full border border-[#b0efe4] dark:border-[#296861]/40 tracking-wide uppercase">
              MINSAL
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onOpenProtocol('Guía Perinatal 2023')}
              className="p-2.5 rounded-xl bg-white dark:bg-[#1E2736] border border-[#F1E5E4] dark:border-slate-700 flex items-center gap-2 hover:border-[#2A756C] dark:hover:border-[#5AA298] transition-all shadow-xs text-left active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#2A756C] dark:text-[#5AA298] text-[17px]">verified</span>
              <span className="text-[11px] font-bold text-[#231B1C] dark:text-slate-100 truncate">Guía Perinatal 2023</span>
            </button>
            <button
              onClick={() => onOpenProtocol('Criterios IADPSG')}
              className="p-2.5 rounded-xl bg-white dark:bg-[#1E2736] border border-[#F1E5E4] dark:border-slate-700 flex items-center gap-2 hover:border-[#2A756C] dark:hover:border-[#5AA298] transition-all shadow-xs text-left active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#2A756C] dark:text-[#5AA298] text-[17px]">verified</span>
              <span className="text-[11px] font-bold text-[#231B1C] dark:text-slate-100 truncate">Criterios IADPSG</span>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom CTA Container */}
      <div className="w-full px-4 pt-2 pb-3 bg-[#FDFBF9]/95 dark:bg-[#0D131A]/95 border-t border-[#EFE7E4]/70 dark:border-slate-800 shrink-0 transition-colors">
        <button
          onClick={onStartConsultation}
          className="w-full h-14 py-3 rounded-2xl bg-gradient-to-r from-[#A7445A] via-[#B85368] to-[#C96B80] flex items-center justify-between px-4 text-white font-semibold shadow-[0_8px_24px_rgba(184,83,104,0.32)] hover:shadow-[0_10px_28px_rgba(184,83,104,0.4)] active:scale-[0.98] transition-all border border-white/20 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 shadow-xs">
              <span className="material-symbols-outlined text-[19px]">mic</span>
            </div>
            <div className="text-left">
              <span className="text-[15px] tracking-tight font-bold block leading-snug">
                Comenzar Caso Clínico
              </span>
              <span className="text-[11px] text-[#ffd9de] font-medium block">
                Simulación interactiva por voz
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 shadow-xs">
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </div>
        </button>
      </div>
    </div>
  );
};
