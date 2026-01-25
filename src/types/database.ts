// types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface TranscriptMessage {
  role: 'agent' | 'user' | 'assistant' | 'system' | string;
  content?: string;
  text?: string;
  message?: string;
}

export interface CallScore {
  score: number;
  verdict: string;
  reasoning: string;
}

export interface CallSession {
  id: string;
  phone: string;
  summary: string | null;
  transcript: TranscriptMessage[] | null; // Replaces any[]
  score: CallScore | null;               // Replaces any
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  } | null;
}