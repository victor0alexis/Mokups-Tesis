import React from 'react';

interface ProgressViewProps {
  totalXp: number;
  onBack: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ totalXp, onBack }) => {
  return (
    <div className="flex-1 flex flex-col justify-between h-full bg-[#FDFBF9] dark:bg-[#0E131B] text-slate-800 dark:text-slate-100 overflow-hidden select-none transition-colors">
      {/* Header */}
      <header className="w-full pt-2 pb-2.5 px-4 flex items-center justify-between border-b border-[#EFE7E4]/70 dark:border-slate-800 bg-[#FDFBF9]/95 dark:bg-[#131A24]/95 backdrop-blur-md shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[#B85368] dark:text-rose-400 bg-[#FFF5F6] dark:bg-rose-950/40 border border-[#F1E5E4] dark:border-rose-900/60 transition-colors font-semibold text-xs py-1.5 px-3 rounded-full active:scale-[0.98] shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px]">arrow_back_ios_new</span>
          <span>Volver</span>
        </button>
        <span className="text-xs font-bold text-slate-800 dark:text-white">Mi Perfil y Progreso</span>
        <div className="w-7 h-7 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-800 dark:text-amber-400 text-xs font-bold">
          EO
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 hide-scrollbar">
        {/* Student Profile Card */}
        <div className="bg-gradient-to-br from-white via-[#FFF5F6] to-[#FAF0F2] dark:from-[#18212D] dark:via-[#1F2633] dark:to-[#2A1E27] rounded-3xl p-4 border border-[#F3D5DC] dark:border-slate-700 shadow-sm flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#B85D6F] to-[#944152] text-white flex items-center justify-center text-xl font-bold shadow-md shadow-[#B85D6F]/20">
            EO
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#B85D6F] dark:text-rose-400 uppercase tracking-wider">
              Estudiante Obstetricia #7594
            </span>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
              Víctor Alexis Delgado
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Universidad de Los Lagos • 4° Año</p>
          </div>
        </div>

        {/* Level & XP Stats */}
        <div className="bg-white dark:bg-[#161F2C] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Nivel 2 • Interno Inicial</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{totalXp} XP</p>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-3 py-1 rounded-full text-amber-800 dark:text-amber-300 font-bold text-xs">
              <span className="material-symbols-outlined text-[16px] text-amber-600 dark:text-amber-400">local_fire_department</span>
              <span>Racha 3 días</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10.5px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              <span>Progreso a Nivel 3</span>
              <span>{totalXp} / 500 XP</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-750 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-[#B85D6F] rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (totalXp / 500) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Competencies Breakdown */}
        <div className="bg-white dark:bg-[#161F2C] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white">Competencias Clínicas Evaluadas</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-300">Razonamiento Clínico Obstétrico</span>
              <span className="font-bold text-[#296861] dark:text-[#5AA298]">92%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="w-[92%] h-full bg-[#296861] dark:bg-[#5AA298] rounded-full"></div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-600 dark:text-slate-300">Manejo de Estrés Materno en Anamnesis</span>
              <span className="font-bold text-[#B85D6F] dark:text-rose-400">88%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="w-[88%] h-full bg-[#B85D6F] dark:bg-rose-400 rounded-full"></div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-600 dark:text-slate-300">Adherencia a Guías MINSAL / ARO</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">96%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="w-[96%] h-full bg-emerald-600 dark:bg-emerald-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Completed Cases History */}
        <div className="bg-white dark:bg-[#161F2C] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white">Historial de Casos</h3>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#1C2636] border border-slate-200 dark:border-slate-750 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">Caso #04: Camila Morales</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Preeclampsia + DMG • 32 sem</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                100% Precisión
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#1C2636] border border-slate-200 dark:border-slate-750 flex items-center justify-between opacity-75">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">Caso #03: Constanza Rivas</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Infección Urinaria (ITU) • 26 sem</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                94% Aprobado
              </span>
            </div>
          </div>
        </div>
      </main>

      <div className="p-3 bg-white dark:bg-[#131A24] border-t border-[#EFE7E4] dark:border-slate-800 shrink-0">
        <button
          onClick={onBack}
          className="w-full py-2.5 bg-[#B85D6F] hover:bg-[#A34F60] text-white text-xs font-bold rounded-xl active:scale-95 transition-transform cursor-pointer shadow-sm"
        >
          Volver a Consulta
        </button>
      </div>
    </div>
  );
};
