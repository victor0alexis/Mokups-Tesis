import React, { useState, useEffect, useRef } from 'react';
import { Patient, DialogueMessage, ClinicalDrawerTab, Medication, AccessibilitySettings } from '../types';
import { INITIAL_DIALOGUE, DIAGNOSTIC_OPTIONS, DEFAULT_MEDICATIONS, PRESET_QUESTIONS, ULAGOS_LOGO_URL } from '../data/mockData';
import { ExpertModal } from './ExpertModal';
import { AddMedicationModal } from './AddMedicationModal';

interface ConsultationActiveViewProps {
  patient: Patient;
  onBack: () => void;
  onFinishCase: (earnedXp: number) => void;
  onOpenSettings?: () => void;
  effectiveTheme?: 'light' | 'dark';
  onToggleThemeQuick?: () => void;
  accessibility?: AccessibilitySettings;
}

export const ConsultationActiveView: React.FC<ConsultationActiveViewProps> = ({
  patient,
  onBack,
  onFinishCase,
  onOpenSettings,
  effectiveTheme = 'light',
  onToggleThemeQuick,
  accessibility,
}) => {
  // Timer state
  const [seconds, setSeconds] = useState(222); // 03:42

  // Stress level (0 - 100)
  const [stressLevel, setStressLevel] = useState(28);

  // Active drawer panel (null if closed)
  const [activePanel, setActivePanel] = useState<ClinicalDrawerTab | null>('historial');

  // Messages thread
  const [dialogue, setDialogue] = useState<DialogueMessage[]>(INITIAL_DIALOGUE);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Selected Diagnostic Option
  const [selectedDiagnosticId, setSelectedDiagnosticId] = useState<string>('preeclampsia');

  // Medications list
  const [medications, setMedications] = useState<Medication[]>(DEFAULT_MEDICATIONS);

  // Audio Playback simulation
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Voice Dictation Panel state
  const [dictationSeconds, setDictationSeconds] = useState<number>(4);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [liveTranscription, setLiveTranscription] = useState<string>(
    'Camila, ¿ha sentido dolor de cabeza intenso o visión borrosa recientemente?'
  );
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);

  // Sending patient loading state
  const [isSendingPatient, setIsSendingPatient] = useState<boolean>(false);

  // Feedback Full Modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [showAnalysisAccordion, setShowAnalysisAccordion] = useState<boolean>(true);

  // Sub-modals
  const [showExpertModal, setShowExpertModal] = useState<boolean>(false);
  const [showAddMedModal, setShowAddMedModal] = useState<boolean>(false);

  // Vital signs re-measure state
  const [reMeasuringVital, setReMeasuringVital] = useState<boolean>(false);
  const [bloodPressure, setBloodPressure] = useState<string>('142/92');

  // New lab test ordered state
  const [orderedLabTests, setOrderedLabTests] = useState<string[]>([]);
  const [showOrderLabPrompt, setShowOrderLabPrompt] = useState<boolean>(false);

  // Live simulation clock
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatClock = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  // Scroll to bottom when dialogue updates
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [dialogue]);

  // Audio playback simulator
  const togglePlayAudio = (msgId: string) => {
    if (playingAudioId === msgId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(msgId);
      setTimeout(() => {
        setPlayingAudioId(null);
      }, 4000 / playbackSpeed);
    }
  };

  const toggleSpeed = () => {
    setPlaybackSpeed((prev) => (prev === 1.0 ? 1.5 : 1.0));
  };

  // Re-measure PA
  const handleReMeasurePA = () => {
    setReMeasuringVital(true);
    setTimeout(() => {
      setBloodPressure('140/90');
      setReMeasuringVital(false);
      setStressLevel((prev) => Math.max(22, prev - 3));
    }, 1200);
  };

  // Request new lab test
  const handleOrderTest = (testName: string) => {
    if (!orderedLabTests.includes(testName)) {
      setOrderedLabTests((prev) => [...prev, testName]);
    }
    setShowOrderLabPrompt(false);
  };

  // Send question from Voice Dictation Panel
  const handleSendQuestion = () => {
    const currentQ = PRESET_QUESTIONS[selectedPresetIndex];
    const studentQuestionText = liveTranscription || currentQ.text;
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newStudentMsg: DialogueMessage = {
      id: `msg-${Date.now()}-student`,
      sender: 'student',
      senderTitle: 'Tú (Estudiante Obstetricia)',
      initials: 'EO',
      timestamp: timeStr,
      audioDuration: `00:0${dictationSeconds}`,
      relevanceTag: currentQ.tag || 'Descarte SHE • Relevancia Alta',
      transcript: studentQuestionText,
      stressImpact: currentQ.stressDelta || -2,
    };

    setDialogue((prev) => [...prev, newStudentMsg]);
    setActivePanel(null);

    // Apply stress adjustment
    setStressLevel((prev) => Math.max(15, Math.min(85, prev + (currentQ.stressDelta || -2))));

    // Simulate patient response after 1.2s
    setTimeout(() => {
      const newPatientMsg: DialogueMessage = {
        id: `msg-${Date.now()}-patient`,
        sender: 'patient',
        senderTitle: 'Camila Morales (Gestante)',
        initials: 'CM',
        timestamp: timeStr,
        audioDuration: '00:11',
        transcript: currentQ.response,
        stressImpact: 1,
      };
      setDialogue((prev) => [...prev, newPatientMsg]);
    }, 1200);
  };

  // Submit patient and open Feedback Full Modal
  const handleInitiateSendPatient = () => {
    setIsSendingPatient(true);
    setTimeout(() => {
      setIsSendingPatient(false);
      setActivePanel(null);
      setShowFeedbackModal(true);
    }, 700);
  };

  const handleFinishAndReturn = () => {
    setShowFeedbackModal(false);
    onFinishCase(50);
  };

  return (
    <div className="flex-1 flex flex-col justify-between h-full bg-[#FDFBF9] dark:bg-[#0D131A] text-slate-800 dark:text-slate-100 overflow-hidden select-none relative transition-colors">
      {/* Header institucional */}
      <header
        className="shrink-0 bg-[#FDFBF9]/95 dark:bg-[#0D131A]/95 backdrop-blur-md border-b border-[#EFE7E4] dark:border-slate-800 z-30 shadow-xs transition-colors"
        data-purpose="header-section"
      >
        {/* Top brand bar */}
        <div className="px-3 py-2 grid grid-cols-[auto_1fr_auto] items-center border-b border-[#EFE7E4]/70 dark:border-slate-800 gap-1.5">
          <div className="flex items-center justify-start">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-slate-600 dark:text-slate-300 active:text-slate-900 text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs transition-colors shrink-0 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-sm text-slate-500 dark:text-slate-400">arrow_back_ios_new</span>
              <span>Casos</span>
            </button>
          </div>

          <div className="flex items-center justify-center px-1 overflow-hidden">
            <div className="flex flex-col items-center justify-center gap-0.5">
              <img
                alt="Universidad de Los Lagos"
                className="h-7 w-auto max-w-full object-contain select-none"
                src={ULAGOS_LOGO_URL}
              />
              <div className="inline-flex items-center gap-1 bg-[#EFF8F6] dark:bg-[#296861]/30 border border-[#296861]/20 dark:border-[#296861]/50 px-2 py-0.2 rounded-full shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#296861] dark:bg-[#5AA298] animate-pulse"></span>
                <span className="text-[9px] font-bold text-[#296861] dark:text-[#5AA298] tracking-wider uppercase">
                  Modo Solitario
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-1.5 shrink-0">
            {/* Botón Rápido Modo Guardia Nocturna / Diurna */}
            {onToggleThemeQuick && (
              <button
                onClick={onToggleThemeQuick}
                className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-amber-300 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title={effectiveTheme === 'dark' ? 'Modo guardia virtual activo (Noche)' : 'Modo diurno activo'}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {effectiveTheme === 'dark' ? 'dark_mode' : 'light_mode'}
                </span>
              </button>
            )}

            {/* Botón Configuración de la App */}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Configuración de guardia"
              >
                <span className="material-symbols-outlined text-[15px]">tune</span>
              </button>
            )}

            <div className="flex items-center gap-1 bg-[#FAF0F2] dark:bg-[#B85D6F]/20 border border-[#F3D5DC] dark:border-[#B85D6F]/40 px-2 py-0.5 rounded-full text-[10.5px] font-bold text-[#944152] dark:text-rose-300 shadow-xs">
              <span className="material-symbols-outlined text-[#B85D6F] dark:text-rose-400 text-[13px]">schedule</span>
              <span className="font-mono tracking-tight">{formatClock(seconds)}</span>
            </div>
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs overflow-hidden">
                <span className="material-symbols-outlined text-base">person</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Unified Case & Maternal Stress Integration Bar */}
        <div className="px-3.5 pt-2 pb-2 bg-gradient-to-b from-[#FFFDFD] via-[#FDFBF9] to-[#FFF8F7]/80 dark:from-[#131A24] dark:via-[#0D131A] dark:to-[#131A24]/80 transition-colors">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] font-extrabold text-[#1B2A4A] dark:text-slate-300 tracking-tight shrink-0">
                Caso #04
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-[11px] font-bold text-[#944152] dark:text-rose-300 truncate">
                {patient.caseTitle}
              </span>
              <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                (Semana {patient.gestationalWeeks} • {patient.gestationalFormula.includes('G2') ? 'G2P1' : 'G1P0'})
              </span>
            </div>

            {/* Maternal Well-being Dynamic Pill */}
            <div
              className={`flex items-center gap-1 border px-2 py-0.5 rounded-full shadow-xs shrink-0 transition-colors ${
                stressLevel <= 35
                  ? 'bg-[#EFF8F6] border-[#CFE6E2] text-[#296861]'
                  : stressLevel <= 65
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
              id="header-stress-pill"
              title="Bienestar y Estrés Materno en tiempo real"
            >
              <span className="material-symbols-outlined text-[13px]">favorite</span>
              <span className="text-[10px] font-extrabold">Estrés {stressLevel}%</span>
              <span className="w-1 h-1 rounded-full bg-current opacity-40"></span>
              <span className="text-[9px] font-bold tracking-tight">
                {stressLevel <= 35 ? 'Controlado' : stressLevel <= 65 ? 'Precaución' : 'Reactivo'}
              </span>
            </div>
          </div>

          {/* Case sub-detail and Stage badge */}
          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[9.5px] text-slate-500 font-medium">
                {patient.name} (Sem {patient.gestationalWeeks})
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[9px] font-bold text-slate-600 bg-white border border-[#EFE7E4] px-1.5 py-0.2 rounded shadow-xs">
                Etapa 2/8
              </span>
            </div>
          </div>

          {/* Aesthetic Animated Dynamic Stress & Well-being Bar */}
          <div className="mt-2 relative">
            <div className="relative w-full bg-[#EAE2DE] h-2 rounded-full overflow-hidden flex shadow-inner">
              {/* Dynamic width according to stress level */}
              <div
                className={`relative h-full rounded-l-full transition-all duration-700 ease-out flex items-center justify-end overflow-hidden ${
                  stressLevel <= 35
                    ? 'bg-gradient-to-r from-[#296861] via-[#3E7B73] to-[#5AA298]'
                    : stressLevel <= 65
                    ? 'bg-gradient-to-r from-[#296861] via-[#D97706] to-[#F59E0B]'
                    : 'bg-gradient-to-r from-[#D97706] via-[#B85D6F] to-[#D94F5C]'
                }`}
                style={{ width: `${stressLevel}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent shimmer-effect"></div>
                <span className="w-1.5 h-1.5 rounded-full bg-white mr-0.5 shadow-xs animate-ping opacity-75"></span>
              </div>
              <div
                className="bg-gradient-to-r from-[#D97706]/20 to-[#D97706]/30 h-full"
                style={{ width: '32%' }}
              ></div>
              <div
                className="bg-gradient-to-r from-[#B85D6F]/20 to-[#D94F5C]/30 h-full rounded-r-full"
                style={{ width: '40%' }}
              ></div>
            </div>

            {/* Subtle marker labels below bar */}
            <div className="flex justify-between items-center text-[8.5px] font-semibold text-slate-400 mt-1 px-0.5">
              <span className="text-[#296861] font-bold flex items-center gap-0.5">
                <span className="w-1 h-1 rounded-full bg-[#296861] inline-block"></span>
                0% Estable
              </span>
              <span className="text-amber-600">35% Precaución</span>
              <span className="text-[#B85D6F]">65%+ Reactivo</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main scrollable clinical dialogue */}
      <main
        ref={chatScrollRef}
        className="flex-1 overflow-y-auto px-4 pt-3 space-y-4 w-full hide-scrollbar"
        style={{ paddingBottom: '7rem', scrollBehavior: 'smooth' }}
      >
        <section className="space-y-3" data-purpose="clinical-dialogue-thread">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#296861] text-base">forum</span>
              <h3 className="text-xs font-bold text-[#1B2A4A] tracking-tight">
                Entrevista Clínica en Curso
              </h3>
            </div>
            <span className="text-[10px] font-medium text-slate-400">
              Simulación en tiempo real
            </span>
          </div>

          <div className="space-y-2.5">
            {dialogue.map((msg) => {
              const isStudent = msg.sender === 'student';
              const isPlaying = playingAudioId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col animate-new-bubble ${
                    isStudent ? 'items-end ml-4' : 'items-start mr-2'
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      isStudent ? 'justify-between w-full' : 'gap-1.5'
                    } mb-1 px-1 text-[10px] text-slate-600 font-medium`}
                  >
                    {isStudent ? (
                      <>
                        <span className="text-[9.5px] font-bold text-[#296861] bg-[#EBF6F4] border border-[#CFE6E2] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#296861] animate-pulse"></span>
                          Intervención enviada
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#296861]">Tú</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                          <div className="w-4 h-4 rounded-full bg-[#296861] text-white text-[8px] font-bold flex items-center justify-center shadow-xs">
                            {msg.initials}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 rounded-full bg-[#B85D6F] text-white text-[8px] font-bold flex items-center justify-center shadow-xs">
                          {msg.initials}
                        </div>
                        <span className="font-bold text-[#944152]">{msg.senderTitle}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 font-mono">{msg.timestamp}</span>
                      </>
                    )}
                  </div>

                  {/* Bubble Container */}
                  <div
                    className={`border-2 rounded-2xl p-3.5 shadow-md w-full space-y-3 relative ${
                      isStudent
                        ? 'bg-white dark:bg-[#151D28] border-[#296861]/50 dark:border-[#296861]/70 rounded-tr-sm'
                        : 'bg-white dark:bg-[#151D28] border-[#F3D5DC] dark:border-[#B85D6F]/40 rounded-tl-sm'
                    }`}
                  >
                    {/* Audio Header */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex items-center gap-1.5 text-[11px] font-bold ${
                          isStudent ? 'text-[#296861] dark:text-[#5AA298]' : 'text-[#944152] dark:text-rose-300'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {isStudent ? 'mic' : 'record_voice_over'}
                        </span>
                        <span>
                          {isStudent
                            ? 'Audio de la pregunta (Estudiante)'
                            : 'Respuesta de audio de la gestante'}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isStudent
                            ? 'text-[#296861] dark:text-[#5AA298] bg-[#EBF6F4] dark:bg-[#296861]/30 border border-[#CFE6E2] dark:border-[#296861]/50'
                            : 'text-[#944152] dark:text-rose-300 bg-[#FAF0F2] dark:bg-[#B85D6F]/20 border border-[#F3D5DC] dark:border-[#B85D6F]/40'
                        }`}
                      >
                        {isPlaying ? '00:02' : '00:00'} / {msg.audioDuration}
                      </span>
                    </div>

                    {/* Interactive Player Waveform Box */}
                    <div
                      className={`border rounded-2xl p-3 flex items-center gap-3 shadow-xs ${
                        isStudent
                          ? 'bg-[#FDFBF9] dark:bg-[#1E2736] border-[#CFE6E2] dark:border-slate-700'
                          : 'bg-[#FDFBF9] dark:bg-[#1E2736] border-[#F3D5DC] dark:border-slate-700'
                      }`}
                    >
                      <button
                        onClick={() => togglePlayAudio(msg.id)}
                        className={`w-9 h-9 rounded-full text-white flex items-center justify-center active:scale-95 transition-all shadow-sm shrink-0 cursor-pointer ${
                          isStudent ? 'bg-[#296861] hover:bg-[#1F5750]' : 'bg-[#B85D6F] hover:bg-[#944152]'
                        }`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {isPlaying ? 'pause' : 'play_arrow'}
                        </span>
                      </button>

                      <div className="flex-1 flex flex-col justify-center gap-1.5">
                        <div
                          className={`flex items-center justify-between gap-1 h-6 px-2.5 bg-white dark:bg-[#131A24] rounded-xl border cursor-pointer overflow-hidden shadow-xs ${
                            isStudent ? 'border-[#CFE6E2] dark:border-slate-700' : 'border-[#F3D5DC] dark:border-slate-700'
                          }`}
                        >
                          {[2, 4, 3, 5, 4, 3, 5, 2, 4, 3, 2, 4, 3, 2].map((height, i) => (
                            <span
                              key={i}
                              className={`w-1 rounded-full shrink-0 transition-all ${
                                isStudent ? 'bg-[#296861] dark:bg-[#5AA298]' : 'bg-[#B85D6F] dark:bg-[#D96880]'
                              } ${isPlaying ? 'wave-bar' : ''}`}
                              style={{
                                height: `${height * 3.5}px`,
                                animationDelay: `${(i % 5) * 0.1}s`,
                              }}
                            />
                          ))}
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-600 dark:text-slate-400 font-medium px-0.5">
                          <span>{isPlaying ? '00:02' : '00:00'}</span>
                          <span
                            className={`font-bold text-[9.5px] not-italic ${
                              isStudent ? 'text-[#296861] dark:text-[#5AA298]' : 'text-[#944152] dark:text-rose-300'
                            }`}
                          >
                            {isStudent ? 'Audio estudiante' : 'Audio gestante'}
                          </span>
                          <span>{msg.audioDuration}</span>
                        </div>
                      </div>

                      <button
                        onClick={toggleSpeed}
                        className={`text-[11px] font-mono font-bold bg-white dark:bg-[#131A24] border px-2.5 py-1 rounded-full shadow-xs active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer ${
                          isStudent
                            ? 'text-[#296861] dark:text-[#5AA298] border-[#CFE6E2] dark:border-slate-700'
                            : 'text-[#944152] dark:text-rose-300 border-[#F3D5DC] dark:border-slate-700'
                        }`}
                        type="button"
                      >
                        {playbackSpeed.toFixed(1)}x
                      </button>
                    </div>

                    {/* Transcription Badge & Clinical Relevance */}
                    <div className="flex items-center justify-between pt-0.5">
                      <div
                        className={`text-[11px] font-bold flex items-center gap-1 border px-2.5 py-1 rounded-lg shadow-xs ${
                          isStudent
                            ? 'text-[#296861] dark:text-[#5AA298] bg-[#EFF8F6] dark:bg-[#296861]/30 border-[#CFE6E2] dark:border-[#296861]/50'
                            : 'text-[#944152] dark:text-rose-300 bg-[#FAF0F2] dark:bg-[#B85D6F]/20 border-[#F3D5DC] dark:border-[#B85D6F]/40'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">subject</span>
                        <span>{isStudent ? 'Transcripción de la pregunta' : 'Transcripción completa'}</span>
                      </div>
                      <span className="text-[9.5px] text-[#296861] dark:text-[#5AA298] font-bold flex items-center gap-0.5 bg-[#EBF6F4] dark:bg-[#296861]/30 border border-[#CFE6E2] dark:border-[#296861]/50 px-1.5 py-0.5 rounded">
                        <span className="material-symbols-outlined text-xs">done_all</span>
                        {msg.relevanceTag || 'Audio sincronizado'}
                      </span>
                    </div>

                    {/* Text Blockquote */}
                    <div
                      className={`mt-1 pt-2.5 border-t ${
                        isStudent ? 'border-[#CFE6E2] dark:border-slate-700' : 'border-[#F3D5DC] dark:border-slate-700'
                      }`}
                    >
                      <blockquote
                        className={`leading-relaxed p-2.5 rounded-xl border ${
                          accessibility?.largerFontSize ? 'text-[13.5px]' : 'text-[12px]'
                        } ${
                          isStudent
                            ? 'italic bg-[#EFF8F6] dark:bg-[#182725] text-slate-800 dark:text-slate-100 border-[#CFE6E2]/60 dark:border-[#296861]/40'
                            : 'bg-[#FBF2EF] dark:bg-[#251A1F] text-slate-800 dark:text-slate-100 border-[#F3D5DC]/60 dark:border-[#B85D6F]/40'
                        }`}
                      >
                        <span
                          className={`font-bold not-italic mr-1 ${
                            isStudent ? 'text-[#296861] dark:text-[#5AA298]' : 'text-[#944152] dark:text-rose-300'
                          }`}
                        >
                          «
                        </span>
                        {isStudent ? (
                          msg.transcript
                        ) : (
                          <span>
                            La fatiga empezó hace tres días, pero{' '}
                            <mark className="bg-white dark:bg-[#2F2128] text-[#944152] dark:text-rose-300 border border-[#F3D5DC] dark:border-[#B85D6F]/50 font-bold px-1 rounded shadow-xs not-italic">
                              los tobillos se me hinchan mucho
                            </mark>{' '}
                            en las tardes. No he tenido dolor de cabeza fuerte, pero sí{' '}
                            <mark className="bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-bold px-1 rounded shadow-xs not-italic">
                              vi como chispitas de luz ayer
                            </mark>{' '}
                            al levantarme rápido. Y la orina me llamó la atención porque{' '}
                            <mark className="bg-white dark:bg-[#2F2128] text-[#944152] dark:text-rose-300 border border-[#F3D5DC] dark:border-[#B85D6F]/50 font-bold px-1 rounded shadow-xs not-italic">
                              hace mucha espuma
                            </mark>
                            , me dio susto.
                          </span>
                        )}
                        <span
                          className={`font-bold not-italic ml-1 ${
                            isStudent ? 'text-[#296861] dark:text-[#5AA298]' : 'text-[#944152] dark:text-rose-300'
                          }`}
                        >
                          »
                        </span>
                      </blockquote>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Drawer Overlay */}
      {activePanel !== null && (
        <div
          onClick={() => setActivePanel(null)}
          className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[4px] z-50 transition-opacity duration-300 flex flex-col justify-end"
        >
          {/* Modal Drawer Wrapper */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-[#FFF7F8] dark:bg-[#121822] text-slate-800 dark:text-slate-100 rounded-t-[34px] border-t border-x border-[#F5D3D9] dark:border-slate-800 shadow-[0_-14px_40px_rgba(148,65,82,0.18)] dark:shadow-black/70 p-4 pb-7 flex flex-col justify-between z-50 pointer-events-auto min-h-[340px] max-h-[82vh] overflow-y-auto hide-scrollbar animate-new-bubble transition-colors"
          >
            {/* Grabber Bar */}
            <div className="w-10 h-1.5 bg-[#E8C2CA] dark:bg-slate-700 rounded-full mx-auto -mt-1 mb-2.5 shrink-0" />

            {/* PANEL 1: PRUEBAS */}
            {activePanel === 'pruebas' && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between shrink-0 mb-1 px-0.5">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-[#F5EEF9] border border-[#E4D2EE] px-3 py-1 rounded-full shadow-xs">
                      <span className="material-symbols-outlined text-[#8E44AD] text-[15px]">science</span>
                      <span className="text-[10.5px] font-bold text-[#8E44AD] tracking-wider uppercase">
                        Pruebas y Laboratorio
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#8E44AD] bg-white border border-[#E4D2EE] px-2 py-0.5 rounded-md shadow-xs">
                      {3 + orderedLabTests.length} Exámenes
                    </span>
                  </div>
                  <button
                    onClick={() => setActivePanel(null)}
                    className="w-7 h-7 rounded-full bg-white border border-[#E4D2EE] flex items-center justify-center text-slate-400 hover:text-[#8E44AD] active:scale-90 transition-all shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm font-semibold">close</span>
                  </button>
                </div>

                <div className="space-y-2.5 bg-white rounded-2xl border border-[#E4D2EE] p-3 shadow-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5EEF9]/70 border border-[#E4D2EE]">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-white border border-[#E4D2EE] flex items-center justify-center text-[#8E44AD] font-bold text-xs shadow-xs">
                        TO
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#1B2A4A]">Tira Reactiva de Orina</p>
                        <p className="text-[10px] text-slate-500">Muestra aislada matinal</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#8E44AD] bg-white border border-[#E4D2EE] px-2 py-1 rounded-md shadow-xs">
                      Proteinuria (++)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shadow-xs">
                        GL
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#1B2A4A]">Glicemia en Ayunas</p>
                        <p className="text-[10px] text-slate-500">Monitoreo HGT / Sangre venosa</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-xs">
                      94 mg/dL <span className="text-slate-400 font-normal">(Norma)</span>
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F5EEF9]/40 border border-[#E4D2EE]/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-white border border-[#E4D2EE] flex items-center justify-center text-[#8E44AD] font-bold text-xs shadow-xs">
                        PB
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#1B2A4A]">Perfil Bioquímico & Hepático</p>
                        <p className="text-[10px] text-slate-500">Ácido Úrico 5.2 mg/dL • GOT/GPT Normal</p>
                      </div>
                    </div>
                    <span className="text-[9.5px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      Alerta Leve
                    </span>
                  </div>

                  {orderedLabTests.map((t, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-white border border-emerald-300 flex items-center justify-center text-emerald-700 font-bold text-xs shadow-xs">
                          OK
                        </span>
                        <div>
                          <p className="text-xs font-bold text-[#1B2A4A]">{t}</p>
                          <p className="text-[10px] text-emerald-700">Muestra solicitada en curso</p>
                        </div>
                      </div>
                      <span className="text-[9.5px] font-bold text-emerald-700 bg-white border border-emerald-300 px-2 py-0.5 rounded-md">
                        Procesando
                      </span>
                    </div>
                  ))}
                </div>

                {showOrderLabPrompt ? (
                  <div className="p-3 bg-white rounded-2xl border border-[#E4D2EE] space-y-2">
                    <p className="text-xs font-bold text-[#8E44AD]">Selecciona examen para solicitar:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['Proteinuria 24 hrs', 'Hemograma & Plaquetas', 'Cociente Prot/Creat', 'Clearance Creatinina'].map((t) => (
                        <button
                          key={t}
                          onClick={() => handleOrderTest(t)}
                          className="p-2 text-[10.5px] font-semibold text-slate-700 bg-[#F5EEF9] hover:bg-[#E4D2EE] rounded-xl text-left cursor-pointer transition-colors"
                        >
                          + {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowOrderLabPrompt(true)}
                    className="w-full bg-[#8E44AD] hover:bg-[#763691] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">add_circle</span>
                    Solicitar nuevo examen de laboratorio
                  </button>
                )}
              </div>
            )}

            {/* PANEL 2: EXAMEN FÍSICO */}
            {activePanel === 'examen' && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between shrink-0 mb-1 px-0.5">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-[#FEF7EE] border border-[#FADCB8] px-3 py-1 rounded-full shadow-xs">
                      <span className="material-symbols-outlined text-[#D97706] text-[15px]">
                        accessibility_new
                      </span>
                      <span className="text-[10.5px] font-bold text-[#D97706] tracking-wider uppercase">
                        Examen Físico Obstétrico
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#D97706] bg-white border border-[#FADCB8] px-2 py-0.5 rounded-md shadow-xs">
                      Sem 32
                    </span>
                  </div>
                  <button
                    onClick={() => setActivePanel(null)}
                    className="w-7 h-7 rounded-full bg-white border border-[#FADCB8] flex items-center justify-center text-slate-400 hover:text-[#D97706] active:scale-90 transition-all shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm font-semibold">close</span>
                  </button>
                </div>

                <div className="space-y-2.5 bg-white rounded-2xl border border-[#FADCB8] p-3 shadow-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-[#FEF7EE] border border-[#FADCB8]">
                      <span className="text-[10px] font-bold text-[#D97706]">Altura Uterina (AU)</span>
                      <p className="text-xs font-bold text-[#1B2A4A] mt-0.5">
                        30 cm <span className="text-[9px] font-normal text-slate-500">(Acorde sem 32)</span>
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FEF7EE] border border-[#FADCB8]">
                      <span className="text-[10px] font-bold text-[#D97706]">Maniobras de Leopold</span>
                      <p className="text-xs font-bold text-[#1B2A4A] mt-0.5">
                        Longitudinal cefálica dorso derecho
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FEF7EE]/60 border border-[#FADCB8] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1B2A4A]">Edema Maleolar</p>
                      <p className="text-[10px] text-slate-500">Con fóvea evidente bilateral</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#D97706] bg-white border border-[#FADCB8] px-2 py-0.5 rounded-md shadow-xs">
                      Fóvea (++/+++)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-[#FADCB8]/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1B2A4A]">Reflejos Osteotendíneos (ROTs)</p>
                      <p className="text-[10px] text-slate-500">Reflejo rotuliano exaltado</p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md shadow-xs">
                      (+++/++++) Exaltados
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL 3: PREGUNTAR (VOICE DICTATION) */}
            {activePanel === 'preguntar' && (
              <div className="flex flex-col gap-2">
                {/* Header bar */}
                <div className="flex items-center justify-between shrink-0 mb-1 px-0.5">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-white/90 border border-[#F3CDD3] px-3 py-1 rounded-full shadow-xs">
                      <span className="relative flex h-2 w-2">
                        {isRecording && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B85D6F] opacity-80" />
                        )}
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B85D6F]"></span>
                      </span>
                      <span className="text-[10px] font-bold text-[#944152] tracking-wider uppercase">
                        {isRecording ? 'Grabando...' : 'Dictado listo'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#944152] bg-white/90 border border-[#F3CDD3] px-2.5 py-0.5 rounded-md shadow-xs">
                      00:0{dictationSeconds}
                    </span>
                  </div>
                  <button
                    onClick={() => setActivePanel(null)}
                    className="w-7 h-7 rounded-full bg-white/90 border border-[#F3CDD3] flex items-center justify-center text-slate-400 hover:text-[#944152] active:scale-90 transition-all shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm font-semibold">close</span>
                  </button>
                </div>

                {/* Preset clinical questions selector */}
                <div className="bg-white/95 rounded-2xl border border-[#F3CDD4] p-3 flex flex-col gap-2 shadow-xs">
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#944152]">
                    <span className="uppercase tracking-wide">Seleccionar pregunta clínica:</span>
                    <span className="text-slate-400">{selectedPresetIndex + 1}/{PRESET_QUESTIONS.length}</span>
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {PRESET_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedPresetIndex(idx);
                          setLiveTranscription(q.text);
                        }}
                        className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-xl border whitespace-nowrap transition-all cursor-pointer ${
                          selectedPresetIndex === idx
                            ? 'bg-[#B85D6F] text-white border-[#B85D6F] shadow-xs'
                            : 'bg-[#FCF3F5] text-[#944152] border-[#F5D5DC]'
                        }`}
                      >
                        {q.tag.split('•')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Center Section: Mic Prominente + Ondas vivas */}
                <div className="bg-white/95 rounded-2xl border border-[#F3CDD4] p-3.5 shadow-xs flex flex-col gap-3 my-0.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex items-center justify-center w-13 h-13 shrink-0">
                      {isRecording && (
                        <>
                          <div className="absolute inset-0 rounded-full bg-[#B85D6F]/20 pulse-halo-1"></div>
                          <div className="absolute inset-0 rounded-full bg-[#B85D6F]/15 pulse-halo-2"></div>
                        </>
                      )}
                      <button
                        onClick={() => setIsRecording((prev) => !prev)}
                        className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-tr from-[#944152] via-[#A84A5D] to-[#B85D6F] text-white flex items-center justify-center shadow-lg shadow-[#B85D6F]/25 active:scale-95 transition-transform cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[23px] font-bold">mic</span>
                      </button>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center justify-between h-9 px-3 bg-[#FCF3F5] rounded-xl border border-[#F5D5DC] overflow-hidden">
                        {[1, 2, 1.5, 3, 3.5, 2, 3, 1.5, 2.5, 2, 1].map((scale, i) => (
                          <span
                            key={i}
                            className={`w-[2.5px] bg-gradient-to-t from-[#944152] to-[#B85D6F] rounded-full ${
                              isRecording ? 'live-wave-bar' : 'live-wave-bar paused'
                            }`}
                            style={{
                              height: `${scale * 7}px`,
                              animationDelay: `${i * 0.08}s`,
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-[9.5px] font-semibold text-[#944152]/80 px-1 mt-1">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B85D6F]"></span>
                          Audio HD activo
                        </span>
                        <span className="font-mono text-slate-400 text-[9px]">Cancelación de ruido</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-b from-[#FFF9FA] to-[#FCF4F6] rounded-xl border border-[#F6D7DD] p-3 shadow-inner">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#944152] mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px] text-[#B85D6F]">
                          record_voice_over
                        </span>
                        <span className="tracking-wide uppercase text-[9.5px]">
                          Transcripción en tiempo real:
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-[#296861] bg-[#EBF6F4] border border-[#CFE6E2] px-1.5 py-0.2 rounded-md">
                        {PRESET_QUESTIONS[selectedPresetIndex].tag}
                      </span>
                    </div>

                    <div className="min-h-[44px] flex items-start">
                      <p className="font-editorial text-[14.5px] leading-[22px] tracking-[-0.01em] text-slate-800 italic font-normal">
                        <span className="text-[#B85D6F] font-semibold not-italic">«</span>
                        {liveTranscription}
                        <span className="text-[#B85D6F] font-semibold not-italic">»</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 shrink-0 pt-1 px-0.5">
                  <button
                    onClick={() => setActivePanel(null)}
                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 px-3.5 py-2.5 rounded-xl active:scale-95 transition-transform flex items-center gap-1 bg-white/90 border border-[#F4CED4] shadow-xs cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm text-slate-400">delete</span>
                    Descartar
                  </button>
                  <button
                    onClick={handleSendQuestion}
                    className="flex-1 max-w-[225px] bg-gradient-to-r from-[#B85D6F] to-[#944152] hover:brightness-105 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-[#B85D6F]/20 flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 cursor-pointer"
                    type="button"
                  >
                    <span>Enviar mensaje</span>
                    <span className="material-symbols-outlined text-base">send</span>
                  </button>
                </div>
              </div>
            )}

            {/* PANEL 4: CONSTANTES VITALES */}
            {activePanel === 'constantes' && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between shrink-0 mb-1 px-0.5">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-[#EBF6F4] border border-[#CFE6E2] px-3 py-1 rounded-full shadow-xs">
                      <span className="material-symbols-outlined text-[#296861] text-[15px]">
                        monitor_heart
                      </span>
                      <span className="text-[10.5px] font-bold text-[#296861] tracking-wider uppercase">
                        Constantes Materno-Fetales
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#296861] bg-white border border-[#CFE6E2] px-2 py-0.5 rounded-md shadow-xs">
                      En vivo
                    </span>
                  </div>
                  <button
                    onClick={() => setActivePanel(null)}
                    className="w-7 h-7 rounded-full bg-white border border-[#CFE6E2] flex items-center justify-center text-slate-400 hover:text-[#296861] active:scale-90 transition-all shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm font-semibold">close</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-white rounded-2xl border border-[#CFE6E2] p-3 shadow-xs">
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-rose-700">PA Materna</span>
                      <span className="material-symbols-outlined text-rose-700 text-sm animate-pulse">
                        warning
                      </span>
                    </div>
                    <p className="text-base font-extrabold text-rose-700 mt-1">
                      {bloodPressure} <span className="text-[9px] font-normal text-slate-600">mmHg</span>
                    </p>
                    <span className="text-[8.5px] font-semibold text-rose-700 mt-0.5">
                      Alerta: HTA gestacional
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#EBF6F4] border border-[#CFE6E2] flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#296861]">LCF Fetal (Doppler)</span>
                      <span className="material-symbols-outlined text-[#296861] text-sm">favorite</span>
                    </div>
                    <p className="text-base font-extrabold text-[#296861] mt-1">
                      144 <span className="text-[9px] font-normal text-slate-600">lpm</span>
                    </p>
                    <span className="text-[8.5px] font-semibold text-[#296861] mt-0.5">
                      Doppler reactivo
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#EFF8F6] border border-[#CFE6E2]/70 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-[#1F5750]">FC Materna</span>
                    <p className="text-sm font-bold text-[#1B2A4A] mt-0.5">
                      88 <span className="text-[9px] font-normal text-slate-500">lpm</span>
                    </p>
                    <span className="text-[8.5px] font-medium text-slate-500">Normocárdica</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#EFF8F6] border border-[#CFE6E2]/70 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-[#1F5750]">SatO2 / Temp</span>
                    <p className="text-sm font-bold text-[#1B2A4A] mt-0.5">
                      98% <span className="text-[9px] font-normal text-slate-500">• 36.6°C</span>
                    </p>
                    <span className="text-[8.5px] font-medium text-slate-500">Afebril, eupneica</span>
                  </div>
                </div>

                <div className="flex items-center justify-between px-1">
                  <button
                    onClick={handleReMeasurePA}
                    disabled={reMeasuringVital}
                    className="w-full bg-[#296861] hover:bg-[#1F5750] text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                    type="button"
                  >
                    <span className={`material-symbols-outlined text-sm ${reMeasuringVital ? 'animate-spin' : ''}`}>
                      replay
                    </span>
                    {reMeasuringVital ? 'Tomando presión en reposo...' : 'Volver a medir PA (Reposo 15 min)'}
                  </button>
                </div>
              </div>
            )}

            {/* PANEL 5: HISTORIAL DEL PACIENTE (MATCHES IMAGE 1.PNG EXACTLY) */}
            {activePanel === 'historial' && (
              <div className="flex flex-col gap-3">
                {/* Encabezado superior con botón volver (<), avatar, datos de visita */}
                <div className="flex items-center justify-between shrink-0 mb-0.5 px-0.5">
                  <div className="flex items-center gap-2.5">
                    {/* Botón Volver '<' */}
                    <button
                      onClick={() => setActivePanel(null)}
                      className="w-8 h-8 rounded-xl bg-[#FAF5F2] dark:bg-[#1A2330] border border-[#EFE7E4] dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#1B2A4A] dark:hover:text-white active:scale-95 transition-all shadow-xs cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[19px]">chevron_left</span>
                    </button>
                    {/* Avatar amigable */}
                    <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-[#FAF0F2] via-pink-100 to-rose-200 dark:from-[#2F1D24] dark:via-[#3C222D] dark:to-[#4A2635] border-2 border-white dark:border-slate-700 shadow-xs flex items-center justify-center overflow-hidden">
                      <span className="material-symbols-outlined text-[#B85D6F] dark:text-rose-400 text-[22px]">
                        pregnant_woman
                      </span>
                    </div>
                    {/* Título y Nombre */}
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                        Historial del paciente
                      </span>
                      <h2 className="text-[14px] font-extrabold text-[#1B2A4A] dark:text-white leading-tight">
                        {patient.name}
                      </h2>
                    </div>
                  </div>

                  {/* Badge número de visita */}
                  <div className="w-10 h-10 rounded-xl bg-[#FAF5F2] dark:bg-[#1A2330] border border-[#EFE7E4] dark:border-slate-700 flex flex-col items-center justify-center shadow-xs">
                    <span className="text-[13px] font-extrabold text-[#1B2A4A] dark:text-white leading-none">1</span>
                    <span className="text-[8px] font-semibold text-slate-400 leading-tight">Visita</span>
                  </div>
                </div>

                {/* Pills de datos demográficos y adherencia */}
                <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1 bg-[#FAF5F2] dark:bg-[#1A2330] border border-[#EFE7E4] dark:border-slate-700 px-2.5 py-1 rounded-xl shadow-xs">
                    <span className="text-slate-400 text-xs">🎂</span>
                    <span>{patient.age} años</span>
                  </div>
                  <div className="flex items-center gap-1 bg-[#FAF5F2] dark:bg-[#1A2330] border border-[#EFE7E4] dark:border-slate-700 px-2.5 py-1 rounded-xl shadow-xs">
                    <span className="text-slate-400 text-xs">🤰</span>
                    <span>{patient.gestationalFormula}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-[#FAF5F2] dark:bg-[#1A2330] border border-[#EFE7E4] dark:border-slate-700 px-2.5 py-1 rounded-xl shadow-xs">
                    <span className="text-slate-400 text-xs">📊</span>
                    <span>{patient.adherencePercent}%</span>
                  </div>
                </div>

                {/* Cita textual / Motivo de consulta */}
                <div className="bg-[#FAF5F2] dark:bg-[#1A2330] border border-[#EFE7E4] dark:border-slate-700 rounded-2xl p-3 shadow-xs relative">
                  <span className="text-2xl font-serif text-slate-400 absolute top-1.5 left-2.5 leading-none">
                    “
                  </span>
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 pl-4 font-editorial italic">
                    {patient.chiefComplaint}
                  </p>
                </div>

                {/* SECCIÓN 1: DIAGNÓSTICOS PREVIOS */}
                <div className="bg-[#FAF5F2] dark:bg-[#1A2330] border border-[#EFE7E4] dark:border-slate-700 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#296861] dark:text-[#5AA298] text-[16px] fill-1">
                      verified
                    </span>
                    <span className="text-[10px] font-extrabold tracking-wider text-[#296861] dark:text-[#5AA298] uppercase">
                      Diagnósticos previos
                    </span>
                  </div>
                  <div className="space-y-1 pl-0.5">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                      <span>Comorbilidades:</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-block bg-white dark:bg-[#1E2736] border border-[#EFE7E4] dark:border-slate-700 text-[10.5px] font-bold text-slate-700 dark:text-slate-200 px-3 py-1 rounded-xl shadow-xs">
                        Diabetes Mellitus Gestacional
                      </span>
                      <span className="inline-block bg-white dark:bg-[#1E2736] border border-[#EFE7E4] dark:border-slate-700 text-[10px] font-medium text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-xl shadow-xs">
                        Resistencia a la Insulina
                      </span>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 2: DIAGNÓSTICO (Grid de selección con radio buttons) */}
                <div className="space-y-2">
                  <div className="bg-[#FAF5F2] dark:bg-[#1A2330] border border-[#EFE7E4] dark:border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#296861] dark:text-[#5AA298] text-[16px]">
                      assignment
                    </span>
                    <span className="text-[10px] font-extrabold tracking-wider text-[#296861] dark:text-[#5AA298] uppercase">
                      Diagnóstico
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2" id="diagnostico-options-grid">
                    {DIAGNOSTIC_OPTIONS.map((opt) => {
                      const isSelected = selectedDiagnosticId === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedDiagnosticId(opt.id)}
                          className={`rounded-2xl p-2.5 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all shadow-xs ${
                            isSelected
                              ? 'bg-white dark:bg-[#18332F] border-2 border-[#296861] dark:border-[#5AA298] shadow-sm'
                              : 'bg-[#FAF5F2] dark:bg-[#1A2330] border border-[#EFE7E4] dark:border-slate-700 hover:border-[#296861]/50'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-[#296861] dark:border-[#5AA298] bg-[#296861] dark:bg-[#5AA298]'
                                : 'border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span
                            className={`text-[10.5px] font-bold leading-tight ${
                              isSelected ? 'text-[#296861] dark:text-[#5AA298]' : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {opt.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SECCIÓN 3: RECETA */}
                <div className="space-y-2">
                  <div className="bg-[#FAF5F2] dark:bg-[#1A2330] border border-[#EFE7E4] dark:border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#1B2A4A] dark:text-white text-[16px]">
                      medication
                    </span>
                    <span className="text-[10px] font-extrabold tracking-wider text-[#1B2A4A] dark:text-white uppercase">
                      Receta
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShowAddMedModal(true)}
                      className="bg-[#FAF5F2] dark:bg-[#1A2330] border border-[#EFE7E4] dark:border-slate-700 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 text-[#1B2A4A] dark:text-white hover:bg-white dark:hover:bg-[#253244] active:scale-95 transition-all shadow-xs cursor-pointer"
                      type="button"
                    >
                      <div className="w-6 h-6 rounded-full border-2 border-[#1B2A4A] dark:border-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm font-bold">add</span>
                      </div>
                      <span className="text-[10.5px] font-bold">Añadir medicamento</span>
                    </button>

                    {medications.map((m) => (
                      <div
                        key={m.id}
                        className="bg-white dark:bg-[#1E2736] border border-[#EFE7E4] dark:border-slate-700 rounded-2xl p-2.5 flex flex-col justify-between shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-[#944152] dark:text-rose-300">
                            {m.name}
                          </span>
                          <span className="text-[8.5px] font-bold text-[#296861] dark:text-[#5AA298] bg-[#EBF6F4] dark:bg-[#296861]/30 px-1 rounded">
                            {m.dosage}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-1">{m.instructions}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ACCIONES INFERIORES FIJAS DEL PANEL */}
                <div className="pt-2 flex items-center gap-2 border-t border-[#EFE7E4] dark:border-slate-700">
                  <button
                    onClick={() => setShowExpertModal(true)}
                    className="flex-1 bg-gradient-to-r from-[#D97706] to-[#B45309] hover:brightness-105 text-white font-bold text-[11px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">school</span>
                    <span>Consultar experto</span>
                  </button>

                  <button
                    onClick={handleInitiateSendPatient}
                    disabled={isSendingPatient}
                    className="flex-1 bg-gradient-to-r from-[#296861] to-[#1F5750] hover:brightness-105 text-white font-bold text-[11px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-[#296861]/20 active:scale-95 transition-all group cursor-pointer disabled:opacity-60"
                    type="button"
                  >
                    <span
                      className={`material-symbols-outlined text-sm ${
                        isSendingPatient ? 'animate-spin' : 'group-hover:translate-x-0.5'
                      }`}
                    >
                      {isSendingPatient ? 'hourglass_top' : 'send'}
                    </span>
                    <span>{isSendingPatient ? 'Enviando...' : 'Enviar paciente'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Barra fija ergonómica con los 5 accesos clínicos institucionales */}
      <footer
        className="shrink-0 border-t border-[#EFE7E4] dark:border-slate-800 bg-white dark:bg-[#131A24] z-40 transition-colors"
        data-purpose="clinical-bottom-bar"
      >
        <nav aria-label="Navegación clínica" className="w-full px-3 pt-2 pb-1.5 flex items-end justify-between">
          {/* Pruebas */}
          <button
            onClick={() => setActivePanel('pruebas')}
            className="flex-1 flex flex-col items-center group relative py-1 text-slate-700 active:scale-95 transition-transform cursor-pointer"
            type="button"
          >
            <span
              className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 transition-all group-hover:scale-105 ${
                activePanel === 'pruebas'
                  ? 'bg-[#8E44AD] text-white shadow-xs'
                  : 'bg-[#F5EEF9] dark:bg-[#8E44AD]/20 border border-[#E4D2EE] dark:border-[#8E44AD]/40 text-[#8E44AD] dark:text-purple-300'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">science</span>
            </span>
            <span className="text-[10px] font-bold tracking-tight text-[#8E44AD] dark:text-purple-300">Pruebas</span>
          </button>

          {/* Examen */}
          <button
            onClick={() => setActivePanel('examen')}
            className="flex-1 flex flex-col items-center group relative py-1 text-slate-700 active:scale-95 transition-transform cursor-pointer"
            type="button"
          >
            <span
              className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 transition-all group-hover:scale-105 ${
                activePanel === 'examen'
                  ? 'bg-[#D97706] text-white shadow-xs'
                  : 'bg-[#FEF7EE] dark:bg-amber-950/40 border border-[#FADCB8] dark:border-amber-900/60 text-[#D97706] dark:text-amber-400'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">accessibility_new</span>
            </span>
            <span className="text-[10px] font-bold tracking-tight text-[#D97706] dark:text-amber-400">Examen</span>
          </button>

          {/* Preguntar (Prominent Voice Mic Button) */}
          <button
            onClick={() => setActivePanel('preguntar')}
            className="flex-1 flex flex-col items-center group relative -mt-3.5 cursor-pointer focus:outline-none select-none transition-transform active:scale-95"
            type="button"
          >
            <div className="w-12 h-12 rounded-full bg-[#B85D6F] text-white border-4 border-white dark:border-[#131A24] flex items-center justify-center shadow-md group-hover:shadow-[#B85D6F]/40 group-hover:shadow-lg transition-all">
              <span className="material-symbols-outlined text-2xl font-bold">mic</span>
            </div>
            <span className="text-[10px] font-extrabold tracking-tight text-[#944152] dark:text-rose-300 mt-0.5">
              Preguntar
            </span>
            {activePanel === 'preguntar' && (
              <span className="w-1.5 h-1 bg-[#B85D6F] rounded-full mt-0.5" />
            )}
          </button>

          {/* Constantes */}
          <button
            onClick={() => setActivePanel('constantes')}
            className="flex-1 flex flex-col items-center group relative py-1 text-slate-700 active:scale-95 transition-transform cursor-pointer"
            type="button"
          >
            <span
              className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 transition-all group-hover:scale-105 ${
                activePanel === 'constantes'
                  ? 'bg-[#296861] text-white shadow-xs'
                  : 'bg-[#EBF6F4] dark:bg-[#296861]/25 border border-[#CFE6E2] dark:border-[#296861]/50 text-[#296861] dark:text-[#5AA298]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">monitor_heart</span>
            </span>
            <span className="text-[10px] font-bold tracking-tight text-[#296861] dark:text-[#5AA298]">Constantes</span>
          </button>

          {/* Historial (Matches Image 1.png style) */}
          <button
            onClick={() => setActivePanel('historial')}
            className="flex-1 flex flex-col items-center group relative py-1 text-slate-700 active:scale-95 transition-transform cursor-pointer"
            type="button"
          >
            <span
              className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 transition-all group-hover:scale-105 ${
                activePanel === 'historial'
                  ? 'bg-[#C87D55] text-white shadow-xs'
                  : 'bg-[#FBF2EF] dark:bg-[#C87D55]/20 border-2 border-[#C87D55] dark:border-[#C87D55]/60 text-[#C87D55] dark:text-[#E89E78]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">folder_shared</span>
            </span>
            <span className="text-[10px] font-extrabold tracking-tight text-[#C87D55] dark:text-[#E89E78]">Historial</span>
            {activePanel === 'historial' && (
              <span className="w-1.5 h-1 bg-[#C87D55] rounded-full mt-0.5" />
            )}
          </button>
        </nav>
      </footer>

      {/* FEEDBACK & EVALUATION FULL MODAL */}
      {showFeedbackModal && (
        <div className="absolute inset-0 bg-[#181112]/50 backdrop-blur-md z-[60] flex flex-col justify-end transition-opacity duration-400">
          <div className="w-full h-[94%] bg-[#FDFBF9] rounded-t-[36px] shadow-2xl border-t border-x border-[#F3DCE1] flex flex-col overflow-hidden animate-new-bubble">
            {/* Grabber bar */}
            <div className="pt-3 pb-1 flex justify-center shrink-0 bg-[#FDFBF9]">
              <div className="w-12 h-1.5 bg-[#E2D5D0] rounded-full" />
            </div>

            {/* Scrollable Evaluation Body */}
            <div className="flex-1 overflow-y-auto px-4 pt-1 pb-6 space-y-3.5 hide-scrollbar">
              {/* Checkmark animado grande verde esmeralda */}
              <div className="flex flex-col items-center text-center pt-2 pb-1">
                <div className="relative flex items-center justify-center w-20 h-20 mb-3">
                  <div className="absolute inset-0 rounded-full bg-emerald-100/70 animate-ping opacity-60"></div>
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-[#1E824C] to-[#2ECC71] shadow-lg shadow-emerald-600/30 flex items-center justify-center text-white animate-pop-in">
                    <span className="material-symbols-outlined text-3xl font-extrabold">check</span>
                  </div>
                </div>
                <h1 className="text-[21px] font-extrabold text-[#1B2A4A] tracking-tight leading-snug">
                  Consulta completada
                </h1>
                <p className="text-[11.5px] text-slate-500 font-medium max-w-[310px] mt-1 leading-relaxed">
                  Paciente {patient.name} derivada oportunamente, plan de manejo y seguimiento programado.
                </p>
              </div>

              {/* Tarjeta de Gamificación (+50 XP) */}
              <div className="bg-gradient-to-r from-[#FFF6E5] via-[#FFF3D6] to-[#FFECCE] border border-[#FCD89C] rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] shadow-sm flex items-center justify-center text-white shrink-0">
                    <span className="material-symbols-outlined text-2xl fill-1">star</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-extrabold text-[#92400E] leading-none">+50 XP</span>
                      <span className="text-[9px] font-extrabold text-[#B45309] uppercase tracking-wider bg-white/70 px-1.5 py-0.5 rounded-md border border-[#FCD89C]/80">
                        Nivel Progresivo
                      </span>
                    </div>
                    <span className="text-[10.5px] font-semibold text-[#A16207] mt-0.5">
                      Puntos de experiencia obtenidos
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 pl-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-[#92400E]">
                    <span className="material-symbols-outlined text-xs text-[#D97706]">
                      local_fire_department
                    </span>
                    <span>Racha x3</span>
                  </div>
                  <div className="w-14 h-1.5 bg-[#FDE68A] rounded-full overflow-hidden mt-1">
                    <div className="w-10 h-full bg-[#D97706] rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Tarjeta 'Resumen de la visita 1' */}
              <div className="bg-white rounded-2xl border border-[#EFE7E4] p-3.5 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 border-b border-[#F5EFEB] pb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#2563EB] shadow-xs">
                    <span className="material-symbols-outlined text-base">description</span>
                  </div>
                  <h3 className="text-xs font-bold text-[#1B2A4A]">Resumen de la visita 1</h3>
                </div>

                {/* DIAGNÓSTICO */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] shrink-0 mt-0.5 shadow-xs">
                    <span className="material-symbols-outlined text-base">fact_check</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold tracking-wider text-[#059669] uppercase">
                        Diagnóstico Certero
                      </span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                        100% Precisión
                      </span>
                    </div>
                    <p className="text-[12.5px] font-bold text-[#1B2A4A] mt-0.5 leading-snug">
                      Síndrome Hipertensivo del Embarazo / Preeclampsia
                    </p>
                  </div>
                </div>

                {/* RECETA / MANEJO */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1D4ED8] shrink-0 mt-0.5 shadow-xs">
                    <span className="material-symbols-outlined text-base">medication</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-[9px] font-extrabold tracking-wider text-[#1D4ED8] uppercase">
                      Receta & Manejo
                    </span>
                    <p className="text-[12px] font-bold text-[#1B2A4A] mt-0.5">
                      Alfametildopa 250mg c/8 hrs
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Derivación inmediata a ARO (Alto Riesgo Obstétrico)
                    </p>
                  </div>
                </div>

                {/* SEGUIMIENTO */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#F5F3FF] border border-[#DDD6FE] flex items-center justify-center text-[#7C3AED] shrink-0 mt-0.5 shadow-xs">
                    <span className="material-symbols-outlined text-base">calendar_month</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-[9px] font-extrabold tracking-wider text-[#7C3AED] uppercase">
                      Seguimiento
                    </span>
                    <p className="text-[12px] font-bold text-[#1B2A4A] mt-0.5">Control en 48 hrs</p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Proteinuria cuantitativa (orina 24h) y monitoreo seriado de PA
                    </p>
                  </div>
                </div>
              </div>

              {/* Ficha rápida de paciente */}
              <div className="bg-white rounded-2xl border border-[#EFE7E4] p-3 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FAF0F2] to-pink-100 border border-[#F3D5DC] flex items-center justify-center text-[#944152] shrink-0">
                    <span className="material-symbols-outlined text-lg">pregnant_woman</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1B2A4A] truncate">
                      {patient.name} — {patient.age} años
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {patient.gestationalFormula} • {patient.gestationalWeeks} Semanas
                    </p>
                  </div>
                </div>
                <span className="text-[9.5px] font-bold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 rounded-full shadow-xs shrink-0">
                  Añadido a mis pacientes
                </span>
              </div>

              {/* Accordion Toggle: Análisis del paciente */}
              <button
                onClick={() => setShowAnalysisAccordion((prev) => !prev)}
                className="w-full bg-gradient-to-r from-[#F0F2FE] to-[#F5EEFB] border border-[#D5D9FB] rounded-2xl p-3 flex items-center justify-between text-[#4F46E5] active:scale-[0.98] transition-transform shadow-xs cursor-pointer"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-sm">insert_chart</span>
                  </div>
                  <span className="text-xs font-bold tracking-tight">Análisis del paciente</span>
                </div>
                <span className="material-symbols-outlined text-lg">
                  {showAnalysisAccordion ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                </span>
              </button>

              {/* Accordion Content */}
              {showAnalysisAccordion && (
                <div className="space-y-3 pt-1">
                  {/* Pruebas recomendadas */}
                  <div className="bg-white rounded-2xl border border-[#E4D2EE] p-3.5 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-[#F5EEF9] pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#F5EEF9] border border-[#E4D2EE] flex items-center justify-center text-[#8E44AD]">
                          <span className="material-symbols-outlined text-base">science</span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#1B2A4A]">Pruebas analíticas pertinentes</h4>
                          <p className="text-[9.5px] text-slate-500">
                            {patient.name} • Screening SHE y Metabólico
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-[#8E44AD] bg-[#F5EEF9] border border-[#E4D2EE] px-2 py-0.5 rounded-full">
                        6 Parámetros
                      </span>
                    </div>
                    <ul className="space-y-1.5 pt-1 text-[11px] font-semibold text-slate-700">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#8E44AD] shrink-0"></span>
                        <span>Tira reactiva de orina / Análisis de Orina completa</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#8E44AD] shrink-0"></span>
                        <span>Cociente Proteína / Creatinina en Orina (Prot/Creat)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#8E44AD] shrink-0"></span>
                        <span>Ácido Úrico sérico (5.2 mg/dL)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#8E44AD] shrink-0"></span>
                        <span>Electrolitos plasmáticos y Albúmina sérica</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#8E44AD] shrink-0"></span>
                        <span>Hemoglobina Glicosilada (HbA1c)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#8E44AD] shrink-0"></span>
                        <span>Perfil Lipídico Materno</span>
                      </li>
                    </ul>
                  </div>

                  {/* Hallazgos positivos */}
                  <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FEF7EE] rounded-2xl border border-[#FADCB8] p-3.5 shadow-xs space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center shadow-xs shrink-0">
                        <span className="material-symbols-outlined text-lg">accessibility_new</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#B45309] leading-tight">
                        Hallazgos positivos en la exploración
                      </h4>
                    </div>
                    <p className="text-[10px] text-[#A16207] leading-relaxed italic bg-white/80 p-2 rounded-xl border border-[#FADCB8]/70">
                      Estas exploraciones clínicas obstétricas muestran hallazgos de alta sospecha de preeclampsia:
                    </p>
                    <ul className="space-y-1.5 pt-0.5 text-[11px] font-semibold text-slate-700">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#D97706] shrink-0"></span>
                        <span>Valoración del Edema con Fóvea (++ bilateral)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#D97706] shrink-0"></span>
                        <span>Medición seriada de la Presión Arterial (PA 142/92 mmHg)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#D97706] shrink-0"></span>
                        <span>Evaluación de Reflejos Osteotendíneos (ROTs exaltados)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#D97706] shrink-0"></span>
                        <span>Fondo de Ojo / Descarte de vasoespasmo arteriolar</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#D97706] shrink-0"></span>
                        <span>Exploración Cardiovascular y Doppler Fetal (144 lpm)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Resultado del tratamiento */}
                  <div className="bg-white rounded-2xl border border-[#CFE6E2] p-3.5 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 border-b border-[#EFF8F6] pb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#EBF6F4] border border-[#CFE6E2] flex items-center justify-center text-[#296861]">
                        <span className="material-symbols-outlined text-base">show_chart</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#1F5750]">Resultado del tratamiento</h4>
                    </div>
                    <div className="space-y-2 text-[11px]">
                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#FDFBF9]">
                        <span className="font-medium text-slate-600">Puntuación del tratamiento</span>
                        <span className="font-bold text-[#059669] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          +94%
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#FDFBF9]">
                        <span className="font-medium text-slate-600">Evolución de la salud perinatal</span>
                        <span className="font-bold text-[#296861] bg-[#EBF6F4] border border-[#CFE6E2] px-2 py-0.5 rounded-md">
                          +8.8 (Favorable)
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#EBF6F4]/60 border border-[#CFE6E2]/70">
                        <span className="font-bold text-[#1B2A4A]">Resultado global</span>
                        <span className="font-extrabold text-[#0D9488] bg-white border border-[#99F6E4] px-2.5 py-0.5 rounded-md shadow-xs">
                          Control Óptimo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Buttons */}
            <div className="p-3.5 bg-white border-t border-[#EFE7E4] shrink-0 flex flex-col gap-2">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="w-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:brightness-105 active:scale-[0.98] text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span className="tracking-wide uppercase font-extrabold text-[11px]">
                  Volver a la consulta
                </span>
              </button>
              <button
                onClick={handleFinishAndReturn}
                className="w-full bg-[#FAF5F2] hover:bg-[#F3ECE6] active:scale-[0.98] text-slate-700 font-bold text-[11px] py-2 px-3 rounded-xl border border-[#EFE7E4] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-sm text-slate-500">replay</span>
                <span>Nuevo caso clínico obstétrico</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-modals */}
      <ExpertModal isOpen={showExpertModal} onClose={() => setShowExpertModal(false)} />
      <AddMedicationModal
        isOpen={showAddMedModal}
        onClose={() => setShowAddMedModal(false)}
        onAddMedication={(newMed) => {
          if (!medications.some((m) => m.id === newMed.id)) {
            setMedications((prev) => [...prev, newMed]);
          }
        }}
      />
    </div>
  );
};
