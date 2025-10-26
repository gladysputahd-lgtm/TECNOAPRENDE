
export enum Section {
  DIAGNOSIS = 'diagnosis',
  TUTORIALS = 'tutorials',
  MAINTENANCE = 'maintenance',
  MOTIVATION = 'motivation',
  ASSISTANT = 'assistant',
  SETTINGS = 'settings',
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export interface DiagnosisQuestion {
  question: string;
  options: string[];
}

export type Language = 'es' | 'qu';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
