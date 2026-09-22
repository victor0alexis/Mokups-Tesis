export type ScreenView = 'lobby' | 'case_brief' | 'consultation';

export type BottomTab = 'inicio' | 'consulta' | 'guias' | 'progreso';

export type ClinicalDrawerTab = 'pruebas' | 'examen' | 'preguntar' | 'constantes' | 'historial';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AppTheme = ThemeMode; // Alias for flexibility

export interface AccessibilitySettings {
  highContrastVitals: boolean;
  reduceMotion: boolean;
  largerFontSize: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gestationalWeeks: number;
  gestationalFormula: string; // e.g. "Multípara (G2P1)"
  occupation: string;
  timeSlot: string;
  status: 'siguiente' | 'nuevo' | 'control';
  caseTitle: string;
  chiefComplaint: string;
  suspicions: string[];
  adherencePercent: number;
  avatarColor: string;
  initials: string;
}

export interface DialogueMessage {
  id: string;
  sender: 'student' | 'patient';
  senderTitle: string;
  initials: string;
  timestamp: string;
  audioDuration: string;
  isPlaying?: boolean;
  relevanceTag?: string;
  transcript: string;
  highlightedText?: string;
  stressImpact?: number; // change to maternal stress (+ or -)
}

export interface DiagnosticOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
}
