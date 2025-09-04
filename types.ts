
export enum Role {
  STUDENT = 'student',
  PARENT = 'parent',
  PSYCHOLOGIST = 'psychologist',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export enum SessionStatus {
  PLANNED = 'planned',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
}

export interface Session {
  id: string;
  studentId: string;
  status: SessionStatus;
  scheduledFor: string;
  title: string;
  description: string;
  tasklets: Tasklet[];
}

export interface DialogueTurn {
  id:string;
  role: 'assistant' | 'student';
  text: string;
  timestamp: number;
  audioUrl?: string;
}

export enum TaskletDomain {
  COGNITIVE = 'cognitive',
  PERSONALITY = 'personality',
  EMOTION = 'emotion',
  SOCIAL = 'social',
  INTEREST = 'interest',
}

export interface Tasklet {
  id: string;
  code: string;
  title: string;
  domain: TaskletDomain;
  estMinutes: number;
}

// Fix: Centralize Web Speech API types to avoid redeclaration errors.
// Types for Web Speech API to ensure TypeScript compatibility.
export interface SpeechRecognitionAlternative {
    readonly transcript: string;
}
  
export interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly [index: number]: SpeechRecognitionAlternative;
    readonly length: number;
}
  
export interface SpeechRecognitionResultList {
    readonly [index: number]: SpeechRecognitionResult;
    readonly length: number;
}
  
export interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
}

export interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
}

export interface SpeechRecognitionStatic {
    new(): SpeechRecognition;
}
  
declare global {
    interface Window {
      SpeechRecognition?: SpeechRecognitionStatic;
      webkitSpeechRecognition?: SpeechRecognitionStatic;
    }
}
