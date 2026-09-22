import React from 'react';
import { AVAILABLE_MEDICATIONS } from '../data/mockData';
import { Medication } from '../types';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedication: (med: Medication) => void;
}

export const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  onAddMedication,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-new-bubble">
      <div className="w-full max-w-sm bg-white dark:bg-[#1E2736] text-slate-800 dark:text-slate-100 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-3.5 max-h-[85vh] overflow-y-auto hide-scrollbar transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-[#B85D6F] dark:text-rose-400">
              <span className="material-symbols-outlined text-[18px]">medication</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Añadir Medicamento</h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Vademécum Obstétrico APS</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div className="space-y-2">
          {AVAILABLE_MEDICATIONS.map((med) => (
            <div
              key={med.id}
              onClick={() => {
                onAddMedication(med);
                onClose();
              }}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#296861] dark:hover:border-[#5AA298] hover:bg-[#E8F3F1]/40 dark:hover:bg-[#18332F]/50 transition-all cursor-pointer flex items-center justify-between active:scale-[0.98]"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{med.name}</span>
                  <span className="text-[10px] font-bold text-[#296861] dark:text-[#5AA298] bg-teal-50 dark:bg-[#18332F] px-2 py-0.5 rounded-full border border-teal-200 dark:border-[#296861]">
                    {med.dosage}
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">{med.instructions}</p>
              </div>
              <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500">add_circle</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
