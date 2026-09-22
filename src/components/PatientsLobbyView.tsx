import React, { useState } from 'react';
import { Patient, BottomTab } from '../types';
import { PATIENTS_LIST } from '../data/mockData';

interface PatientsLobbyViewProps {
  onSelectCase: (patient: Patient) => void;
  onOpenGuides: () => void;
  onOpenProgress: () => void;
  currentTab: BottomTab;
  onChangeTab: (tab: BottomTab) => void;
  onOpenSettings?: () => void;
  effectiveTheme?: 'light' | 'dark';
  onToggleThemeQuick?: () => void;
}

export const PatientsLobbyView: React.FC<PatientsLobbyViewProps> = ({
  onSelectCase,
  onOpenGuides,
  onOpenProgress,
  currentTab,
  onChangeTab,
  onOpenSettings,
  effectiveTheme = 'light',
  onToggleThemeQuick,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('camila-morales');
  const [admitCount, setAdmitCount] = useState<number>(3);
  const [showSpecialtyTooltip, setShowSpecialtyTooltip] = useState<boolean>(true);

  const selectedPatient = PATIENTS_LIST.find((p) => p.id === selectedPatientId) || PATIENTS_LIST[0];

  const handleAdmit = () => {
    setAdmitCount((prev) => prev + 1);
  };

  return (
    <div className="flex-1 flex flex-col justify-between h-full bg-[#FDFBF9] dark:bg-[#0D131A] overflow-hidden select-none transition-colors">
      {/* Scrollable Container */}
      <main className="flex-1 overflow-y-auto no-scrollbar bg-[#FDFBF9] dark:bg-[#0D131A] relative pb-28 transition-colors">
        {/* Header Superior Institucional */}
        <section className="px-5 pt-3 pb-3 bg-[#FDFBF9]/95 dark:bg-[#0D131A]/95 border-b border-[#F3D5DC]/40 dark:border-slate-800 sticky top-0 z-40 backdrop-blur-md transition-colors">
          <div className="flex items-center justify-between">
            {/* Selector de Especialidad / Consulta */}
            <div className="flex items-center gap-2.5">
              <div 
                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#B85D6F] to-[#984757] text-white flex items-center justify-center shadow-md shadow-[#B85D6F]/25 ring-2 ring-white dark:ring-slate-800 cursor-pointer active:scale-95 transition-transform"
                onClick={() => setShowSpecialtyTooltip((prev) => !prev)}
                title="Cambiar especialidad"
              >
                <span className="material-symbols-outlined text-[20px]">sync_alt</span>
              </div>
              <div>
                <div 
                  className="flex items-center gap-1.5 cursor-pointer"
                  onClick={() => setShowSpecialtyTooltip((prev) => !prev)}
                >
                  <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Consulta Obstetricia</h1>
                  <span className="material-symbols-outlined text-[16px] text-slate-500 dark:text-slate-400">expand_more</span>
                </div>
                <p className="text-[11px] font-medium text-[#296861] dark:text-[#5AA298] flex items-center gap-1">
                  <span>ULagos • Estudiante #7594</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </p>
              </div>
            </div>

            {/* Acciones de Cabecera: Selector de tema, Ajustes y Avatar */}
            <div className="flex items-center gap-1.5">
              {/* Botón Rápido Modo Guardia Nocturna / Diurna */}
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

              {/* Botón Configuración de la App */}
              {onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Configuración de guardia y accesibilidad"
                >
                  <span className="material-symbols-outlined text-[17px]">tune</span>
                </button>
              )}

              {/* Avatar Estudiante */}
              <div 
                className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-700/60 flex items-center justify-center text-amber-800 dark:text-amber-300 relative shadow-sm cursor-pointer ml-0.5"
                onClick={onOpenProgress}
                title="Ver progreso de estudiante"
              >
                <span className="material-symbols-outlined text-[17px]">person</span>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#B85D6F] border-2 border-white dark:border-slate-900 rounded-full"></span>
              </div>
            </div>
          </div>

          {/* Popover / Tooltip Tutorial Formativo */}
          {showSpecialtyTooltip && (
            <div className="mt-2.5 relative bg-[#1F2733] text-white text-[11px] py-1.5 px-3 rounded-xl flex items-center justify-between gap-2 shadow-lg shadow-slate-900/10 border border-slate-700/50 animate-new-bubble">
              <div className="absolute -top-1 left-5 w-2 h-2 bg-[#1F2733] rotate-45 border-l border-t border-slate-700/50"></div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#F3D5DC] shrink-0">sync_alt</span>
                <span className="font-medium text-slate-200">
                  Simulación activa con soporte de <strong className="text-amber-300">Guardia Virtual</strong> para turnos nocturnos.
                </span>
              </div>
              <button 
                className="text-slate-400 hover:text-white cursor-pointer"
                onClick={() => setShowSpecialtyTooltip(false)}
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          )}
        </section>

        {/* Content Container */}
        <div className="px-5 pt-3.5 space-y-4">
          {/* Tarjeta de Paciente Activo (Ficha Principal en Espera) */}
          <section 
            className="bg-white dark:bg-[#151D28] rounded-3xl p-4 shadow-[0_8px_25px_-5px_rgba(184,93,111,0.12)] border border-[#F3D5DC]/70 dark:border-slate-800 relative overflow-hidden transition-all duration-300 hover:shadow-[0_10px_28px_rgba(184,93,111,0.18)]"
            data-purpose="featured-patient-card"
          >
            {/* Subtle corner accent glow */}
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#FAF0F2] dark:bg-[#B85D6F]/10 rounded-full blur-xl pointer-events-none"></div>

            {/* Cabecera de la ficha activa */}
            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FAF0F2] dark:bg-[#B85D6F]/20 text-[#B85D6F] dark:text-rose-300 text-[10px] font-bold tracking-wide uppercase mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B85D6F] animate-pulse"></span>
                  PACIENTE EN ESPERA DE LLAMADO
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {selectedPatient.name}
                </h2>
              </div>

              {/* Avatar Gestante */}
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FAF0F2] via-[#F5E6E8] to-[#E2EBEA] dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 p-0.5 border border-[#F3D5DC] dark:border-slate-700 shadow-sm">
                  <div className="w-full h-full rounded-[14px] bg-[#FAF7F5] dark:bg-[#1A2332] flex items-center justify-center overflow-hidden">
                    <span className="material-symbols-outlined text-[#B85D6F] dark:text-rose-400 text-[32px]">pregnant_woman</span>
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 bg-[#296861] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white dark:border-slate-800 shadow-xs">
                  {selectedPatient.gestationalWeeks}s
                </span>
              </div>
            </div>

            {/* Tags y Datos Demográficos */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold">
                <span className="material-symbols-outlined text-[14px] text-slate-400">schedule</span>
                {selectedPatient.age} años
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold">
                <span className="material-symbols-outlined text-[14px] text-slate-400">person</span>
                {selectedPatient.gestationalFormula}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E8F3F1] dark:bg-[#296861]/30 text-[#296861] dark:text-[#6BC1B6] font-semibold">
                <span className="material-symbols-outlined text-[14px] text-[#3E7B73]">work</span>
                {selectedPatient.occupation}
              </span>
            </div>

            {/* Cita textual del motivo de consulta */}
            <div className="mt-3 p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[12px] text-amber-950 dark:text-amber-200 italic leading-relaxed">
              <span className="font-bold text-amber-700 dark:text-amber-400 not-italic text-xs block mb-0.5">
                Motivo de consulta en APS:
              </span>
              “{selectedPatient.chiefComplaint}”
            </div>

            {/* Badges de Sospecha Diagnóstica */}
            <div className="mt-3 pt-2.5 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-[#F3D5DC] dark:border-rose-900/50 text-[#B85D6F] dark:text-rose-300 text-[11px] font-bold">
                  {selectedPatient.caseTitle}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 text-orange-700 dark:text-orange-300 text-[11px] font-bold">
                  Sospecha Preeclampsia
                </span>
              </div>
              <button 
                onClick={() => onSelectCase(selectedPatient)}
                className="text-[11px] font-bold text-[#296861] dark:text-[#5AA298] hover:underline flex items-center gap-0.5 cursor-pointer active:scale-95 transition-transform"
              >
                Ver ficha
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </section>

          {/* Métricas de Consulta (KPIs del Día) */}
          <section className="grid grid-cols-3 gap-2.5" data-purpose="consultation-kpis">
            {/* Total Pacientes */}
            <div className="bg-gradient-to-br from-[#B85D6F] to-[#A64F61] text-white p-3 rounded-2xl shadow-md shadow-[#B85D6F]/20 flex flex-col items-center justify-center text-center">
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[18px] text-white">group</span>
              </div>
              <span className="text-2xl font-extrabold leading-none">{admitCount}</span>
              <span className="text-[11px] font-semibold text-rose-100 mt-0.5">Total</span>
            </div>

            {/* Pacientes Nuevos */}
            <div className="bg-white dark:bg-[#151D28] border border-emerald-100 dark:border-emerald-950/60 p-3 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[18px]">person_add</span>
              </div>
              <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 leading-none">2</span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Nuevos</span>
            </div>

            {/* Seguimiento */}
            <div className="bg-white dark:bg-[#151D28] border border-amber-100 dark:border-amber-950/60 p-3 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[18px]">sync</span>
              </div>
              <span className="text-2xl font-extrabold text-amber-700 dark:text-amber-400 leading-none">1</span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Control</span>
            </div>
          </section>

          {/* Sección Lista de Pacientes */}
          <section className="pt-1" data-purpose="all-patients-list">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#B85D6F] rounded-full"></div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight">Todos los pacientes</h3>
              </div>
              <span className="text-[11px] font-semibold text-[#296861] dark:text-[#5AA298] bg-[#E8F3F1] dark:bg-[#296861]/20 px-2.5 py-0.5 rounded-full border border-[#296861]/20">
                {admitCount} en espera APS
              </span>
            </div>

            <div className="space-y-2.5">
              {PATIENTS_LIST.map((patient, index) => {
                const isSelected = selectedPatientId === patient.id;
                return (
                  <article
                    key={patient.id}
                    onClick={() => setSelectedPatientId(patient.id)}
                    className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#F6EEF0] dark:bg-[#251A20] border-2 border-[#B85D6F]/70 shadow-sm'
                        : 'bg-white dark:bg-[#151D28] border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Columna Turno & Hora */}
                      <div className="text-center min-w-[36px] pt-0.5">
                        <span className={`block text-lg font-black leading-tight ${isSelected ? 'text-[#B85D6F] dark:text-rose-400' : 'text-slate-400'}`}>
                          {index + 1}
                        </span>
                        <span className={`text-[10px] font-bold ${isSelected ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'}`}>
                          {patient.timeSlot}
                        </span>
                      </div>

                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-[#F3D5DC] dark:border-slate-700 shrink-0 flex items-center justify-center p-0.5 shadow-xs">
                        <span className="material-symbols-outlined text-[24px] text-[#B85D6F] dark:text-rose-400">pregnant_woman</span>
                      </div>

                      {/* Detalles */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {patient.name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              patient.status === 'siguiente'
                                ? 'bg-[#B85D6F] text-white shadow-xs'
                                : patient.status === 'nuevo'
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            }`}
                          >
                            {patient.status === 'siguiente'
                              ? 'Siguiente'
                              : patient.status === 'nuevo'
                              ? 'Nuevo'
                              : 'Control'}
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                          {patient.age} años • {patient.gestationalWeeks} sem ({patient.gestationalFormula.includes('G2') ? 'G2P1' : 'G1P0'})
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic truncate mt-0.5">
                          “{patient.chiefComplaint}”
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* Floating Action Control Bar */}
      <div 
        className="absolute bottom-[66px] left-0 right-0 px-4 py-2 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-[#0D131A] dark:via-[#0D131A]/95 z-40 transition-colors"
        data-purpose="floating-action-bar"
      >
        <div className="flex items-center gap-2">
          {/* Botón Secundario: Admitir Paciente */}
          <button 
            onClick={handleAdmit}
            className="flex-1 py-3 px-3 rounded-2xl bg-white dark:bg-[#151D28] border border-[#3E7B73]/30 dark:border-[#3E7B73]/50 text-[#296861] dark:text-[#5AA298] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition cursor-pointer"
            type="button"
          >
            <div className="w-5 h-5 rounded-lg bg-[#E8F3F1] dark:bg-[#296861]/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px] text-[#296861] dark:text-[#5AA298]">add</span>
            </div>
            <span className="truncate">Admitir</span>
            <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
              +50 XP
            </span>
          </button>

          {/* Botón Principal: Llamar a Paciente */}
          <button 
            onClick={() => onSelectCase(selectedPatient)}
            className="flex-[1.6] py-3 px-4 rounded-2xl bg-gradient-to-r from-[#B85D6F] via-[#A64F61] to-[#296861] text-white font-extrabold text-xs flex items-center justify-between shadow-lg shadow-[#B85D6F]/25 active:scale-95 transition cursor-pointer"
            type="button"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-xs">
                <span className="material-symbols-outlined text-[16px] text-white">volume_up</span>
              </div>
              <span className="tracking-tight text-[13px]">Llamar a {selectedPatient.name.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-1 text-white/90">
              <span className="text-[10px] font-medium opacity-80">Caso</span>
              <span className="material-symbols-outlined text-[18px] text-white">arrow_forward</span>
            </div>
          </button>
        </div>
      </div>

      {/* iOS Bottom Navigation Bar (Tab Bar) */}
      <nav className="relative z-50 bg-white/95 dark:bg-[#151D28]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-4 py-2 flex items-center justify-around select-none transition-colors">
        {/* Tab 1: Inicio */}
        <button 
          onClick={() => onChangeTab('inicio')}
          className={`flex flex-col items-center gap-1 transition group cursor-pointer ${
            currentTab === 'inicio' ? 'text-[#B85D6F] dark:text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">home</span>
          <span className="text-[10px] font-semibold">Inicio</span>
        </button>

        {/* Tab 2: Consulta */}
        <button 
          onClick={() => onChangeTab('consulta')}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="px-4 py-1 rounded-2xl bg-[#B85D6F] text-white flex items-center gap-1.5 shadow-md shadow-[#B85D6F]/30">
            <span className="material-symbols-outlined text-[17px] text-white">ecg_heart</span>
            <span className="text-[11px] font-extrabold tracking-tight">Consulta</span>
          </div>
        </button>

        {/* Tab 3: Guías */}
        <button 
          onClick={onOpenGuides}
          className={`flex flex-col items-center gap-1 transition group cursor-pointer ${
            currentTab === 'guias' ? 'text-[#B85D6F] dark:text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">menu_book</span>
          <span className="text-[10px] font-semibold">Guías</span>
        </button>

        {/* Tab 4: Progreso */}
        <button 
          onClick={onOpenProgress}
          className={`flex flex-col items-center gap-1 transition group cursor-pointer ${
            currentTab === 'progreso' ? 'text-[#B85D6F] dark:text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">bar_chart</span>
          <span className="text-[10px] font-semibold">Progreso</span>
        </button>
      </nav>
    </div>
  );
};
