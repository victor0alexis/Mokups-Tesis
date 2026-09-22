import { Patient, DialogueMessage, DiagnosticOption, Medication } from '../types';

export const PATIENTS_LIST: Patient[] = [
  {
    id: 'camila-morales',
    name: 'Camila Morales',
    age: 32,
    gestationalWeeks: 32,
    gestationalFormula: 'Multípara (G2P1)',
    occupation: 'Profesora Básica',
    timeSlot: '09:00',
    status: 'siguiente',
    caseTitle: 'Diabetes Gestacional',
    chiefComplaint: 'Últimamente me siento muy cansada y mis tobillos están bastante hinchados. También he notado que mi orina hace mucha espuma...',
    suspicions: ['Edema EEII (+/+++)', 'Sospecha de Proteinuria', 'Astenia marcada'],
    adherencePercent: 50,
    avatarColor: 'rose',
    initials: 'CM'
  },
  {
    id: 'elena-valladares',
    name: 'Elena Valladares',
    age: 28,
    gestationalWeeks: 36,
    gestationalFormula: 'Primigesta (G1P0)',
    occupation: 'Contadora',
    timeSlot: '09:30',
    status: 'nuevo',
    caseTitle: 'Amenaza de Parto Prematuro',
    chiefComplaint: 'Doctora, siento contracciones irregulares y molestia lumbar baja desde anoche...',
    suspicions: ['Dinámica uterina irregular', 'Modificación cervical inicial'],
    adherencePercent: 85,
    avatarColor: 'teal',
    initials: 'EV'
  },
  {
    id: 'isabel-morente',
    name: 'Isabel Morente',
    age: 24,
    gestationalWeeks: 24,
    gestationalFormula: 'Gestante (G1P0)',
    occupation: 'Diseñadora Gráfica',
    timeSlot: '10:15',
    status: 'control',
    caseTitle: 'Control Prenatal Normal',
    chiefComplaint: 'Control de rutina y revisión de ecografía morfológica de segundo trimestre...',
    suspicions: ['Crecimiento fetal adecuado', 'Exámenes de 2° trimestre normales'],
    adherencePercent: 100,
    avatarColor: 'amber',
    initials: 'IM'
  }
];

export const INITIAL_DIALOGUE: DialogueMessage[] = [
  {
    id: 'msg-1',
    sender: 'student',
    senderTitle: 'Tú (Estudiante Obstetricia)',
    initials: 'EO',
    timestamp: '10:14',
    audioDuration: '00:06',
    relevanceTag: 'Descarte SHE • Relevancia Alta',
    transcript: 'Camila, cuénteme con calma: ¿desde cuándo siente esta fatiga, ha notado dolores de cabeza intensos o destellos luminosos al levantarse?',
    stressImpact: -2
  },
  {
    id: 'msg-2',
    sender: 'patient',
    senderTitle: 'Camila Morales (Gestante)',
    initials: 'CM',
    timestamp: '10:15',
    audioDuration: '00:14',
    transcript: 'La fatiga empezó hace tres días, pero los tobillos se me hinchan mucho en las tardes. No he tenido dolor de cabeza fuerte, pero sí vi como chispitas de luz ayer al levantarme rápido. Y la orina me llamó la atención porque hace mucha espuma, me dio susto.',
    highlightedText: 'los tobillos se me hinchan mucho / vi como chispitas de luz ayer / hace mucha espuma',
    stressImpact: 3
  }
];

export const DIAGNOSTIC_OPTIONS: DiagnosticOption[] = [
  {
    id: 'icc',
    label: 'Insuficiencia cardíaca congestiva',
    isCorrect: false,
    explanation: 'Poco probable en gestante joven sin antecedentes cardiopatía, edema gravitacional no cardiogénico.'
  },
  {
    id: 'gomerulo',
    label: 'Glomerulonefritis aguda',
    isCorrect: false,
    explanation: 'Aunque cursa con edema y proteinuria, en una gestante de 32 semanas con PA elevada el diagnóstico prioritario es síndrome hipertensivo.'
  },
  {
    id: 'nefropatia',
    label: 'Nefropatía diabética',
    isCorrect: false,
    explanation: 'La diabetes gestacional se diagnosticó en este embarazo; no hay tiempo de evolución para nefropatía diabética establecida.'
  },
  {
    id: 'preeclampsia',
    label: 'Síndrome Hipertensivo / Preeclampsia',
    isCorrect: true,
    explanation: 'Diagnóstico correcto: Gestante >20 semanas con PA ≥ 140/90 mmHg (142/92), proteinuria cualitativa en tira reactiva (++) y edema con fosfenos.'
  }
];

export const DEFAULT_MEDICATIONS: Medication[] = [
  {
    id: 'alfametildopa',
    name: 'Alfametildopa',
    dosage: '250mg',
    instructions: '1 comp cada 8 hrs V.O. (Control HTA gestacional)'
  }
];

export const AVAILABLE_MEDICATIONS: Medication[] = [
  {
    id: 'alfametildopa',
    name: 'Alfametildopa',
    dosage: '250mg',
    instructions: '1 comp cada 8 hrs V.O. (Control HTA gestacional)'
  },
  {
    id: 'labetalol',
    name: 'Labetalol',
    dosage: '100mg',
    instructions: '1 comp cada 12 hrs V.O. (Alternativa de primera línea)'
  },
  {
    id: 'nifedipino',
    name: 'Nifedipino retard',
    dosage: '20mg',
    instructions: '1 comp cada 12 hrs V.O. (Bloqueador de canales de calcio)'
  },
  {
    id: 'sulfato_magnesio',
    name: 'Sulfato de Magnesio',
    dosage: '4g IV bolo + 1g/h',
    instructions: 'Solo en sospecha de preeclampsia con criterios de severidad (neuroprotección/anticonvulsivante)'
  }
];

export const PRESET_QUESTIONS = [
  {
    text: "Camila, ¿ha sentido dolor de cabeza intenso o visión borrosa recientemente?",
    response: "Ayer en la tarde sentí una pesadez en la frente y al pararme vi unos destellos brillantes en los ojos.",
    tag: "Descarte SHE • Relevancia Alta",
    stressDelta: -3
  },
  {
    text: "¿Ha sentido dolor en la boca del estómago o debajo de las costillas derechas?",
    response: "No he tenido dolor en esa zona por suerte, solo el estómago un poco revuelto por el susto.",
    tag: "Descarte Epigastralgia / HELLP",
    stressDelta: -2
  },
  {
    text: "¿Cómo siente los movimientos de su bebé durante el día?",
    response: "Se mueve bien, sobre todo después de almuerzo y cuando me recuesto de lado izquierdo.",
    tag: "Bienestar Fetal • Movimientos",
    stressDelta: -4
  },
  {
    text: "¿Ha estado siguiendo su pauta de alimentación y controles de glicemia?",
    response: "Sí, he estado comiendo con poca sal y midiendo mi azúcar; en las mañanas casi siempre sale menos de 95.",
    tag: "Metabólico • Adherencia",
    stressDelta: -1
  }
];

export const ULAGOS_LOGO_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuDT5YY66awxhA1KwXm3KPxchHQy9_SG0uHCYAV_VwomC-Q1eC13Jtk2XJNhwOCT8JR3iVXo67097OfTW6l6wdSE8dgCL6TsqQ54o0n2Lhy52sn-PBhcbrysNyQ_DRMcUUoZAuc4FdUNGx7pHZP5FAbPjo_KmRLzux2iTrZvK26WHq8HAbJNhfmRlDVjqVNGNyFfvsyH9AzSsetAKt2mJRwrMbuqSvaXxjbCm4ahXA3z1BGnwfet7bdIeBwZwsW90oIsR-w";
