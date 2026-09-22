import React from 'react';
import { ThemeMode, AccessibilitySettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  accessibility: AccessibilitySettings;
  onAccessibilityChange: (settings: AccessibilitySettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  theme,
  onThemeChange,
  accessibility,
  onAccessibilityChange,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[75] flex items-center justify-center p-3 animate-new-bubble">
      <div className="w-full max-w-sm bg-white dark:bg-[#151D28] text-slate-800 dark:text-slate-100 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto hide-scrollbar transition-colors">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FAF0F2] dark:bg-[#B85D6F]/20 border border-[#F3D5DC] dark:border-[#B85D6F]/40 flex items-center justify-center text-[#B85D6F]">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Configuración y Accesibilidad
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                Guardias Virtuales • ULAgos
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 transition-colors cursor-pointer"
            aria-label="Cerrar configuración"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Section: Tema Visual */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#B85D6F]">palette</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Tema de Visualización
              </h4>
            </div>
            <span className="text-[9.5px] font-bold text-[#296861] dark:text-[#5AA298] bg-[#EBF6F4] dark:bg-[#296861]/30 px-2 py-0.5 rounded-full">
              Turnos Clínicos
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {/* Opción Claro */}
            <div
              onClick={() => onThemeChange('light')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-[#FFF5F6] to-white border-[#B85D6F] shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200 shadow-xs">
                  <span className="material-symbols-outlined text-xl">light_mode</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Modo Claro (Diurno)</p>
                    <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">Día</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Fondo cálido (#FDFBF9) para box de atención con iluminación natural.
                  </p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                theme === 'light' ? 'border-[#B85D6F] bg-[#B85D6F]' : 'border-slate-300 dark:border-slate-600'
              }`}>
                {theme === 'light' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>

            {/* Opción Oscuro (Guardia Virtual) */}
            <div
              onClick={() => onThemeChange('dark')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-[#1E293B] to-[#0F172A] border-[#B85D6F] shadow-md text-white'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-900/80 text-indigo-300 flex items-center justify-center border border-indigo-700 shadow-xs">
                  <span className="material-symbols-outlined text-xl">dark_mode</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Modo Oscuro (Guardia Virtual)
                    </p>
                    <span className="text-[9px] font-bold bg-[#B85D6F] text-white px-1.5 py-0.2 rounded">
                      Noche
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Bajo brillo para turnos nocturnos, protegiendo la fatiga ocular.
                  </p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                theme === 'dark' ? 'border-[#B85D6F] bg-[#B85D6F]' : 'border-slate-300 dark:border-slate-600'
              }`}>
                {theme === 'dark' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>

            {/* Opción Sistema */}
            <div
              onClick={() => onThemeChange('system')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                theme === 'system'
                  ? 'bg-[#EFF8F6] dark:bg-[#296861]/20 border-[#296861] shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center border border-slate-300 dark:border-slate-600 shadow-xs">
                  <span className="material-symbols-outlined text-xl">brightness_auto</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Automático / Sistema</p>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Sincroniza según el horario o tema del sistema operativo.
                  </p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                theme === 'system' ? 'border-[#296861] bg-[#296861]' : 'border-slate-300 dark:border-slate-600'
              }`}>
                {theme === 'system' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Accesibilidad para Guardias */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-[#296861]">visibility</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Accesibilidad de Guardia
            </h4>
          </div>

          <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            {/* Toggle: Alto Contraste en Signos Vitales */}
            <label className="flex items-center justify-between cursor-pointer gap-2 select-none">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Alto contraste en constantes vitales
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Resalta PA 142/92, LCF fetal y alertas críticas con bordes luminosos.
                </p>
              </div>
              <input
                type="checkbox"
                checked={accessibility.highContrastVitals}
                onChange={(e) =>
                  onAccessibilityChange({
                    ...accessibility,
                    highContrastVitals: e.target.checked,
                  })
                }
                className="w-5 h-5 text-[#B85D6F] rounded border-slate-300 dark:border-slate-600 focus:ring-[#B85D6F] cursor-pointer"
              />
            </label>

            {/* Toggle: Reducir animaciones intensas */}
            <label className="flex items-center justify-between cursor-pointer gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 select-none">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Atenuar animaciones y destellos
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Desactiva ondas y pings parpadeantes para evitar cansancio ocular nocturno.
                </p>
              </div>
              <input
                type="checkbox"
                checked={accessibility.reduceMotion}
                onChange={(e) =>
                  onAccessibilityChange({
                    ...accessibility,
                    reduceMotion: e.target.checked,
                  })
                }
                className="w-5 h-5 text-[#B85D6F] rounded border-slate-300 dark:border-slate-600 focus:ring-[#B85D6F] cursor-pointer"
              />
            </label>

            {/* Toggle: Tipografía ampliada */}
            <label className="flex items-center justify-between cursor-pointer gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 select-none">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Tipografía clínica optimizada
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Aumenta el tamaño de la anamnesis y transcripciones para lectura ágil.
                </p>
              </div>
              <input
                type="checkbox"
                checked={accessibility.largerFontSize}
                onChange={(e) =>
                  onAccessibilityChange({
                    ...accessibility,
                    largerFontSize: e.target.checked,
                  })
                }
                className="w-5 h-5 text-[#B85D6F] rounded border-slate-300 dark:border-slate-600 focus:ring-[#B85D6F] cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Informative Callout */}
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 flex items-start gap-2.5">
          <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-lg shrink-0 mt-0.5">
            nights_stay
          </span>
          <p className="text-[11px] text-indigo-950 dark:text-indigo-200 leading-relaxed">
            El <strong>Modo Guardia Virtual</strong> preserva la fidelidad de los colores diagnósticos (rosa de obstetricia, verde perinatal, ámbar de alerta) con contraste certificado WCAG AA para turnos de noche en simulación clínica.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-[#B85D6F] to-[#944152] text-white text-xs font-bold rounded-2xl active:scale-95 transition-all shadow-md shadow-[#B85D6F]/25 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">check</span>
          <span>Aplicar y Continuar Consulta</span>
        </button>
      </div>
    </div>
  );
};
