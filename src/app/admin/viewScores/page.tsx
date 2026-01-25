'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { 
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  UserIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import type { CallSession, TranscriptMessage, CallScore } from '@/types/database';

export default function ViewScoresPage() {
  const [sessions, setSessions] = useState<CallSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedSession, setSelectedSession] = useState<CallSession | null>(null);
  const [activeSummary, setActiveSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (selectedSession || activeSummary) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedSession, activeSummary]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data, error } = await supabase
          .from('call_sessions')
          .select(`*, profiles (first_name, last_name)`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const safeParseScore = (rawScore: any): CallScore => {
          if (typeof rawScore !== 'string') return rawScore as CallScore;
          try {
            const cleanJson = rawScore.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson);
          } catch (e) {
            return { score: 'N/A', verdict: 'Error', reasoning: 'Invalid format' };
          }
        };

        const formattedData = (data as any[]).map(item => ({
          ...item,
          score: safeParseScore(item.score)
        })) as CallSession[];

        setSessions(formattedData);
      } catch (err) {
        console.error('Error fetching sessions:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, [supabase]);

  /**
   * FORMATTING FUNCTION: 
   * Converts raw AI text into structured UI components
   */
  const renderFormattedSummary = (rawText: string | null) => {
    if (!rawText) return null;

    // 1. Identify the sections. Matches "**Title:**" or "* **Title:**"
    const regex = /(\*?\s?\*\*(.*?):\*\*)/g;
    const segments = rawText.split(regex);
    
    // segments[0] is usually the "Here's a summary..." intro
    const intro = segments[0];
    const elements = [];

    if (intro && intro.trim().length > 0) {
      elements.push(
        <div key="intro" className="mb-12">
          <p className="text-gray-400 font-medium text-[10px] uppercase tracking-[0.3em] border-b border-gray-100 pb-4">
            {intro.trim()}
          </p>
        </div>
      );
    }

    // Loop through the segments. The regex groups mean:
    // segments[i] = full match (e.g., "* **Personality Traits:**")
    // segments[i+1] = inner match (e.g., "Personality Traits")
    // segments[i+2] = the actual text content until next match
    for (let i = 1; i < segments.length; i += 3) {
      const heading = segments[i + 1];
      const content = segments[i + 2];

      if (heading && content) {
        elements.push(
          <div key={heading} className="mb-12 group/item">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-6 bg-black group-hover/item:w-10 transition-all duration-300" />
              <h4 className="text-black font-black text-xs uppercase tracking-[0.2em]">
                {heading.trim()}
              </h4>
            </div>
            <div className="pl-9">
              <p className="text-gray-700 leading-relaxed text-lg font-serif italic opacity-90 group-hover/item:opacity-100 transition-opacity">
                {content.trim()}
              </p>
            </div>
          </div>
        );
      }
    }

    return elements;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredSessions = sessions.filter((s) => {
    const name = `${s.profiles?.first_name} ${s.profiles?.last_name}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase()) || s.phone.includes(searchQuery);
  });

  return (
    <div className="min-h-screen bg-white py-12 px-6 lg:px-16 font-sans text-black selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="space-y-4">
            <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-none">Talent Board</h1>
            <p className="text-gray-400 font-medium tracking-[0.4em] text-[10px] uppercase">Evaluation Intelligence</p>
          </div>
          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
            <input
              type="text"
              placeholder="Search talent..."
              className="w-full pl-12 pr-6 py-5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-gray-300"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Board Rows */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-40 text-gray-200 font-black uppercase tracking-[0.5em] animate-pulse">Syncing...</div>
          ) : filteredSessions.map((session) => (
            <div key={session.id} className="grid grid-cols-1 lg:grid-cols-12 items-center bg-white border border-gray-100 rounded-[2.5rem] p-8 hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] hover:border-black transition-all duration-500 group">
              <div className="col-span-1 lg:col-span-3 flex items-center gap-6">
                <div className="h-16 w-16 rounded-3xl bg-black flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-xl">
                  <UserIcon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl tracking-tighter leading-none">{session.profiles?.first_name} {session.profiles?.last_name}</h3>
                  <p className="text-[10px] text-gray-400 mt-2 font-mono tracking-widest uppercase">{session.phone}</p>
                </div>
              </div>

              <div className="col-span-1 lg:col-span-2 flex items-center gap-10 px-4">
                <div className="text-4xl font-black italic tracking-tighter">{session.score?.score}</div>
                <span className="px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-gray-100 border border-gray-100">
                  {session.score?.verdict}
                </span>
              </div>

              <div className="col-span-1 lg:col-span-4 flex items-start gap-4 pr-8">
                <p className="text-sm text-gray-400 italic leading-relaxed line-clamp-2">
                  {session.score?.reasoning}
                </p>
              </div>

              <div className="col-span-1 lg:col-span-3 flex items-center justify-end gap-3">
                <button onClick={() => setActiveSummary(session.summary)} className="flex-1 lg:flex-none border border-black text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                  Brief
                </button>
                <button onClick={() => setSelectedSession(session)} className="flex-1 lg:flex-none bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-2xl transition-all">
                  Transcript
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Structured Executive Brief Modal */}
      {activeSummary && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setActiveSummary(null)} />
          <div className="relative w-full max-w-3xl bg-white rounded-[3.5rem] shadow-2xl animate-in zoom-in-95 duration-500 max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-10 sm:p-14 pb-4 flex justify-between items-start shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2">
                  <SparklesIcon className="h-4 w-4" /> Ellie's Thoughts
                </div>
                <h2 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Executive Brief</h2>
              </div>
              <button 
                onClick={() => setActiveSummary(null)} 
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                title="Close"
              >
                <XMarkIcon className="h-8 w-8 text-black" aria-hidden="true" />
                <span className="sr-only">Close Brief</span>
              </button>
            </div>
            
            {/* Scrollable Structured Content */}
            <div className="px-10 sm:px-14 pb-14 overflow-y-auto flex-1 custom-scrollbar">
              <div className="mt-8">
                {renderFormattedSummary(activeSummary)}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-10 sm:px-14 sm:pb-12 flex items-center justify-between shrink-0 bg-white border-t border-gray-50">
              <button 
                onClick={() => handleCopy(activeSummary)}
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-3 transition-colors"
              >
                {copied ? <CheckCircleIcon className="h-5 w-5 text-black" /> : <DocumentTextIcon className="h-5 w-5" />}
                {copied ? 'Copied' : 'Copy Brief'}
              </button>
              <button onClick={() => setActiveSummary(null)} className="bg-black text-white px-12 py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transcript Logic */}
      {selectedSession && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedSession(null)} />
          <div className="relative w-full max-w-2xl bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-700 overflow-hidden">
             <div className="p-12 border-b border-gray-50 shrink-0 flex justify-between items-start">
                <div>
                  <h2 className="text-5xl font-black tracking-tighter uppercase italic leading-none">{selectedSession.profiles?.first_name}</h2>
                  <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.4em] mt-6">Audio Analysis Transcript</p>
                </div>
                <button 
                    onClick={() => setSelectedSession(null)} 
                    className="p-2 hover:bg-gray-100 rounded-full"
                    title="Close"
                >
                  <XMarkIcon className="h-8 w-8 text-black" aria-hidden="true" />
                  <span className="sr-only">Close Transcript</span>
                </button>
             </div>
             <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar bg-gray-50/20">
              {selectedSession.transcript?.map((msg, i) => {
                const isAI = ['agent', 'assistant'].includes(msg.role.toLowerCase());
                return (
                  <div key={i} className={`flex flex-col ${isAI ? 'items-end' : 'items-start'}`}>
                    <span className="text-[8px] font-black uppercase text-gray-300 mb-3 tracking-widest">{isAI ? 'System' : 'Candidate'}</span>
                    <div className={`max-w-[85%] px-8 py-5 rounded-[2rem] text-sm leading-relaxed ${isAI ? 'bg-black text-white rounded-tr-none' : 'bg-white text-black rounded-tl-none border border-gray-100'}`}>
                      {msg.content || msg.text}
                    </div>
                  </div>
                );
              })}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}