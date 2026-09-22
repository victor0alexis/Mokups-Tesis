import React from 'react';

interface ProtocolsModalProps {
  isOpen: boolean;
  protocolName: string;
  onClose: () => void;
}

export const ProtocolsModal: React.FC<ProtocolsModalProps> = ({
  isOpen,
  protocolName,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-new-bubble">
      <div className="w-full max-w-sm bg-white dark:bg-[#1E2736] text-slate-800 dark:text-slate-100 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-3.5 max-h-[85vh] overflow-y-auto hide-scrollbar transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-[#296861]/30 border border-teal-200 dark:border-[#296861] flex items-center justify-center text-[#296861] dark:text-[#5AA298]">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{protocolName}</h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">MINSAL Chile • Perinatal</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {protocolName.includes('2023') ? (
          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <div className="p-3 bg-[#E8F3F1] dark:bg-[#18332F]/50 rounded-2xl border border-[#296861]/20 dark:border-[#296861]/40">
              <h4 className="font-bold text-[#296861] dark:text-[#5AA298] mb-1">Criterios de Síndrome Hipertensivo del Embarazo (SHE)</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Presión Arterial sistólica ≥ 140 mmHg y/o diastólica ≥ 90 mmHg en al menos 2 tomas separadas por 4-6 horas en gestante sobre las 20 semanas.
              </p>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <p className="font-bold text-slate-800 dark:text-slate-100">Criterios diagnósticos de Preeclampsia:</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                <li>Hipertensión gestacional + Proteinuria significativa (≥ 300 mg/24h o tira reactiva ≥ 1+ persistente).</li>
                <li>En ausencia de proteinuria: disfunción de órgano blanco (trombocitopenia, alteración hepática, insuficiencia renal, síntomas neurológicos o restricción de crecimiento fetal).</li>
              </ul>
            </div>
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-[11px] font-medium">
              ⚠️ En APS: Frente a sospecha clínica de preeclampsia moderada/severa, derivar con indicación de reposo y manejo antihipertensivo de primera línea (Alfametildopa o Labetalol).
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <div className="p-3 bg-[#E8F3F1] dark:bg-[#18332F]/50 rounded-2xl border border-[#296861]/20 dark:border-[#296861]/40">
              <h4 className="font-bold text-[#296861] dark:text-[#5AA298] mb-1">Criterios IADPSG (Diabetes Gestacional)</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Valores de corte en PTGO con 75g de glucosa (Semana 24-28):
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 dark:bg-[#131A24] p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase block">Ayunas</span>
                <span className="text-xs font-bold text-slate-800 dark:text-white">≥ 92 mg/dL</span>
              </div>
              <div className="bg-slate-50 dark:bg-[#131A24] p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase block">1 Hora</span>
                <span className="text-xs font-bold text-slate-800 dark:text-white">≥ 180 mg/dL</span>
              </div>
              <div className="bg-slate-50 dark:bg-[#131A24] p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase block">2 Horas</span>
                <span className="text-xs font-bold text-slate-800 dark:text-white">≥ 153 mg/dL</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Basta un solo valor alterado para confirmar el diagnóstico de Diabetes Mellitus Gestacional e iniciar plan alimentario y automonitoreo.
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#296861] text-white text-xs font-bold rounded-xl active:scale-95 transition-transform cursor-pointer"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
