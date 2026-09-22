import React from 'react';

interface ExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpertModal: React.FC<ExpertModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-new-bubble">
      <div className="w-full max-w-sm bg-white dark:bg-[#1E2736] text-slate-800 dark:text-slate-100 rounded-3xl p-5 shadow-2xl border border-amber-200 dark:border-amber-900/60 space-y-3.5 max-h-[85vh] overflow-y-auto hide-scrollbar transition-colors">
        <div className="flex items-center justify-between border-b border-amber-100 dark:border-amber-900/40 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-[#D97706] dark:text-amber-400">
              <span className="material-symbols-outlined text-[18px]">school</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Consejo del Tutor Experto</h3>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold uppercase">Matrona Docente ULAgos</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-950 dark:text-amber-200 space-y-2">
          <p className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">tips_and_updates</span>
            Orientación Diagnóstica:
          </p>
          <p className="leading-relaxed text-[11.5px]">
            "Estudiante, fíjate en la tríada de Camila: gestación de 32 semanas, <strong className="text-amber-900 dark:text-amber-100 font-bold">PA 142/92 mmHg</strong> confirmada en reposo, <strong className="text-amber-900 dark:text-amber-100 font-bold">proteinuria (++)</strong> en orina matinal y edema maleolar bilateral con fóvea y reflejos exaltados."
          </p>
          <p className="leading-relaxed text-[11.5px]">
            "El antecedente de Diabetes Gestacional es un factor de riesgo endotelial importante. La prioridad clínica inmediata es confirmar <strong className="text-amber-900 dark:text-amber-100 font-bold">Síndrome Hipertensivo / Preeclampsia</strong>, iniciar Alfametildopa y derivar al Policlínico de Alto Riesgo Obstétrico (ARO)."
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-gradient-to-r from-[#D97706] to-[#B45309] text-white text-xs font-bold rounded-xl active:scale-95 transition-transform cursor-pointer shadow-sm"
        >
          Aplicar recomendación al caso
        </button>
      </div>
    </div>
  );
};
