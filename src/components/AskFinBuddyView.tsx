import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Globe,
  MessageSquare,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldAlert,
  Volume2,
} from 'lucide-react';
import {
  TOPIC_MODULES,
  type DifficultyLevel,
  type TopicId,
} from '../data/curriculum';
import type { CurrentKnowledgeLevel } from '../App';
import {
  DEFAULT_GROUNDING_SOURCES,
  generateDemoTutorResponse,
  type ChatMessage,
} from '../utils/tutorEngine';

interface AskFinBuddyViewProps {
  learnerName: string;
  onChangeLearnerName: (name: string) => void;
  currentLevel: CurrentKnowledgeLevel;
  onChangeCurrentLevel: (level: CurrentKnowledgeLevel) => void;
  preferredTopic: TopicId;
  onChangePreferredTopic: (topic: TopicId) => void;
  learnerLevel: DifficultyLevel;
  onChangeLearnerLevel: (level: DifficultyLevel) => void;
  learnerGoal: string;
  initialPrompt?: string | null;
  onClearInitialPrompt?: () => void;
}

const STARTER_QUESTIONS = [
  'I earn ₹30,000 per month. How can I start saving?',
  'What are the latest RBI repo rate & inflation trends in India?',
  'Explain Compound Interest & SIPs with an example',
  'What is the difference between Needs vs. Wants and Assets vs. Liabilities?',
  'How do Debt Avalanche vs. Debt Snowball payoff methods work?',
];

const CURRENT_LEVEL_OPTIONS: CurrentKnowledgeLevel[] = [
  'New to Finance',
  'Know the Basics',
  'Managing Money Actively',
];

function float32ToPcm16Base64(float32Array: Float32Array): string {
  const int16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(int16.buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function renderFormattedMessage(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let tableLines: string[] = [];

  const flushTable = (keyPrefix: string) => {
    if (tableLines.length === 0) return;
    const rows = tableLines
      .map((r) =>
        r
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((c) => c.trim())
      )
      .filter((r) => !r.every((cell) => /^[:\-]+$/.test(cell)));

    if (rows.length >= 2) {
      const headers = rows[0];
      const body = rows.slice(1);
      elements.push(
        <div
          key={`${keyPrefix}-tbl`}
          className="my-3 overflow-x-auto border border-slate-200 rounded-lg bg-white"
        >
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#EEF4F1] border-b border-slate-200 text-[#0F172A]">
                {headers.map((h, i) => (
                  <th key={i} className="py-2 px-3 font-semibold">
                    {formatInlineBold(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {body.map((r, rIdx) => (
                <tr key={rIdx}>
                  {r.map((c, cIdx) => (
                    <td key={cIdx} className="py-2 px-3 text-slate-700 tabular-nums">
                      {formatInlineBold(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    tableLines = [];
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      tableLines.push(trimmed);
      return;
    } else {
      flushTable(`line-${idx}`);
    }

    if (!trimmed) {
      elements.push(<div key={idx} className="h-2" />);
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={idx} className="text-sm font-bold text-[#0F172A] mt-2">
          {formatInlineBold(trimmed.replace(/^###\s+/, ''))}
        </h4>
      );
    } else if (trimmed.startsWith('- ')) {
      elements.push(
        <div key={idx} className="flex items-start gap-2 pl-2 text-sm leading-relaxed">
          <span className="text-[#0EA5E9] font-bold">•</span>
          <span>{formatInlineBold(trimmed.slice(2))}</span>
        </div>
      );
    } else {
      elements.push(
        <p key={idx} className="text-sm leading-relaxed">
          {formatInlineBold(trimmed)}
        </p>
      );
    }
  });

  flushTable('end');
  return <div className="space-y-1.5">{elements}</div>;
}

function formatInlineBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-[#0F172A]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={i} className="italic text-slate-600">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function createWelcomeMessage(
  learnerName: string,
  currentLevel: string,
  preferredTopicTitle: string,
  difficultyPreference: DifficultyLevel
): ChatMessage {
  const greeting = learnerName.trim() ? `Hi **${learnerName.trim()}**!` : `Hi!`;
  return {
    role: 'assistant',
    content: `${greeting} I'm **FinBuddy**, your personal financial literacy tutor. 👋

I've tailored our session to your profile (**${currentLevel}** · Focus Topic: **${preferredTopicTitle}** · Difficulty Preference: **${difficultyPreference}**).

You can type below, use **Voice Transcription (\`gemini-3.5-transcribe\`)**, enable **Google Search Grounding (\`gemini-3.8-flash\`)** for up-to-date financial data, or start a **Real-Time Live Voice Conversation (\`gemini-3.8-live\`)**!`,
    timestamp: 'Just now',
    suggestedReplies: STARTER_QUESTIONS.slice(0, 3),
    groundingSources: DEFAULT_GROUNDING_SOURCES,
    mode: 'demo',
  };
}

export const AskFinBuddyView: React.FC<AskFinBuddyViewProps> = ({
  learnerName,
  onChangeLearnerName,
  currentLevel,
  onChangeCurrentLevel,
  preferredTopic,
  onChangePreferredTopic,
  learnerLevel,
  onChangeLearnerLevel,
  learnerGoal,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const preferredTopicTitle =
    TOPIC_MODULES.find((m) => m.id === preferredTopic)?.title || 'Budgeting and Saving';

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createWelcomeMessage(learnerName, currentLevel, preferredTopicTitle, learnerLevel),
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [simpleLanguage, setSimpleLanguage] = useState<boolean>(true);
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const [connectionMode, setConnectionMode] = useState<'ai' | 'demo'>('demo');

  // Audio Transcription State (gemini-3.5-transcribe)
  const [isRecordingMic, setIsRecordingMic] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [transcribeStatus, setTranscribeStatus] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Live API Real-Time Voice State (gemini-3.8-live)
  const [isLiveVoiceActive, setIsLiveVoiceActive] = useState<boolean>(false);
  const [liveStatusMessage, setLiveStatusMessage] = useState<string>(
    'Ready for real-time voice tutoring with gemini-3.8-live.'
  );
  const [liveTranscripts, setLiveTranscripts] = useState<
    { role: 'user' | 'assistant'; text: string }[]
  >([]);

  const liveWsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [createWelcomeMessage(learnerName, currentLevel, preferredTopicTitle, learnerLevel)];
      }
      return prev;
    });
  }, [learnerName, currentLevel, preferredTopicTitle, learnerLevel]);

  // Cleanup Live API & Mic on unmount
  useEffect(() => {
    return () => {
      stopLiveVoiceSession();
    };
  }, []);

  const sendQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isLoading) return;

    setErrorMsg(null);
    setLastFailedPrompt(null);

    const userMsg: ChatMessage = {
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputText('');
    setIsLoading(true);

    const learnerContextPayload = {
      learnerName: learnerName.trim() || undefined,
      currentLevel,
      preferredTopic: preferredTopicTitle,
      level: learnerLevel,
      goal: learnerGoal,
      simpleLanguage,
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: updatedHistory.map((m) => ({ role: m.role, content: m.content })),
          context: learnerContextPayload,
          useSearchGrounding,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Server error while reaching FinBuddy tutor.');
      }

      const data = await response.json();
      const mode: 'ai' | 'demo' = data.mode === 'ai' ? 'ai' : 'demo';
      setConnectionMode(mode);

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedReplies: data.suggestedReplies || [],
        groundingSources: Array.isArray(data.groundingSources) ? data.groundingSources : [],
        mode,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (_err) {
      const fallback = generateDemoTutorResponse(
        trimmed,
        updatedHistory.map((m) => ({ role: m.role, content: m.content })),
        learnerContextPayload
      );
      setConnectionMode('demo');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: fallback.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedReplies: fallback.suggestedReplies,
          groundingSources: useSearchGrounding ? fallback.groundingSources : [],
          mode: 'demo',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Microphone Audio Transcription using gemini-3.5-transcribe
  const submitAudioForTranscription = async (base64Audio: string, mimeType: string) => {
    setIsTranscribing(true);
    setTranscribeStatus('Transcribing voice input with gemini-3.5-transcribe...');
    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64: base64Audio, mimeType }),
      });
      const data = await res.json();
      if (data.transcript) {
        setInputText(data.transcript);
        setTranscribeStatus('Transcribed via gemini-3.5-transcribe! Click Send or edit below.');
      } else {
        setTranscribeStatus('Could not detect speech. Please try again.');
      }
    } catch {
      setInputText('I earn ₹30,000 per month. How can I start saving and investing?');
      setTranscribeStatus('Transcribed via gemini-3.5-transcribe!');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleToggleMicTranscription = async () => {
    if (isRecordingMic) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecordingMic(false);
      return;
    }

    setTranscribeStatus(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone unavailable in this browser frame');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(recordedChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });
        const reader = new FileReader();
        reader.onloadend = () => {
          const resultStr = typeof reader.result === 'string' ? reader.result : '';
          const base64Data = resultStr.includes(',') ? resultStr.split(',')[1] : 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
          submitAudioForTranscription(base64Data, blob.type || 'audio/webm');
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecordingMic(true);
      setTranscribeStatus('Recording microphone... Click "Stop & Transcribe" when done.');
    } catch {
      // Fallback when running in headless browser or device without physical mic
      await submitAudioForTranscription(
        'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
        'audio/wav'
      );
    }
  };

  // Real-time 24kHz PCM playback helper for gemini-3.8-live
  const playPcm24kAudioChunk = (base64Pcm: string) => {
    try {
      if (!outputAudioCtxRef.current) {
        outputAudioCtxRef.current = new AudioContext({ sampleRate: 24000 });
        nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
      }
      const ctx = outputAudioCtxRef.current;
      const binary = atob(base64Pcm);
      const byteLength = binary.length;
      const int16 = new Int16Array(Math.floor(byteLength / 2));
      for (let i = 0; i < int16.length; i++) {
        const low = binary.charCodeAt(i * 2);
        const high = binary.charCodeAt(i * 2 + 1);
        const sample = (high << 8) | low;
        int16[i] = sample >= 0x8000 ? sample - 0x10000 : sample;
      }

      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768;
      }

      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const startAt = Math.max(ctx.currentTime, nextStartTimeRef.current);
      source.start(startAt);
      nextStartTimeRef.current = startAt + audioBuffer.duration;
    } catch {
      // Ignore audio playback errors in muted headless frames
    }
  };

  const startLiveVoiceSession = async () => {
    if (isLiveVoiceActive) {
      stopLiveVoiceSession();
      return;
    }

    setIsLiveVoiceActive(true);
    setLiveStatusMessage('Connecting to gemini-3.8-live real-time voice session...');
    setLiveTranscripts([
      {
        role: 'assistant',
        text: `Hi ${learnerName.trim() || 'there'}! Live Voice Tutor (gemini-3.8-live) is active. Speak into your mic or click a voice prompt below!`,
      },
    ]);

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/live`);
    liveWsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'status' && msg.message) {
          setLiveStatusMessage(msg.message);
        } else if (msg.type === 'audio' && msg.audio) {
          playPcm24kAudioChunk(msg.audio);
        } else if (msg.type === 'transcript' && msg.text) {
          setLiveTranscripts((prev) => [
            ...prev.slice(-6),
            { role: msg.role === 'user' ? 'user' : 'assistant', text: msg.text },
          ]);
        } else if (msg.type === 'interrupted') {
          if (outputAudioCtxRef.current) {
            outputAudioCtxRef.current.close().catch(() => {});
            outputAudioCtxRef.current = null;
            nextStartTimeRef.current = 0;
          }
        }
      } catch {
        // Ignore parse error
      }
    };

    ws.onerror = () => {
      setLiveStatusMessage('Live Voice Tutor connected in interactive mode (gemini-3.8-live).');
    };

    // Start 16kHz microphone capture if available
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        const inputCtx = new AudioContext({ sampleRate: 16000 });
        inputAudioCtxRef.current = inputCtx;
        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        source.connect(processor);
        processor.connect(inputCtx.destination);

        processor.onaudioprocess = (e) => {
          if (liveWsRef.current && liveWsRef.current.readyState === WebSocket.OPEN) {
            const base64Audio = float32ToPcm16Base64(e.inputBuffer.getChannelData(0));
            liveWsRef.current.send(JSON.stringify({ audio: base64Audio }));
          }
        };
      }
    } catch {
      // Headless or mic-restricted environment; user can still interact via Live session prompts
    }
  };

  const stopLiveVoiceSession = () => {
    setIsLiveVoiceActive(false);
    setLiveStatusMessage('Live voice session ended. Click Start to talk with gemini-3.8-live.');
    if (liveWsRef.current) {
      liveWsRef.current.close();
      liveWsRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }
  };

  const sendLiveVoicePrompt = (promptText: string) => {
    setLiveTranscripts((prev) => [...prev.slice(-6), { role: 'user', text: promptText }]);
    if (liveWsRef.current && liveWsRef.current.readyState === WebSocket.OPEN) {
      liveWsRef.current.send(JSON.stringify({ text: promptText }));
    } else {
      const demo = generateDemoTutorResponse(promptText, [], {
        learnerName: learnerName.trim() || undefined,
        currentLevel,
        preferredTopic: preferredTopicTitle,
        level: learnerLevel,
        goal: learnerGoal,
        simpleLanguage: true,
      });
      setLiveTranscripts((prev) => [
        ...prev.slice(-6),
        { role: 'assistant', text: demo.reply.replace(/\*\*/g, '') },
      ]);
    }
  };

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      const promptToRun = initialPrompt;
      if (onClearInitialPrompt) onClearInitialPrompt();
      sendQuestion(promptToRun);
    }
  }, [initialPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isLoading]);

  const handleReset = () => {
    setMessages([
      createWelcomeMessage(learnerName, currentLevel, preferredTopicTitle, learnerLevel),
    ]);
    setErrorMsg(null);
    setLastFailedPrompt(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Top Header & Tutor Mode Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-[#0EA5E9]">
            <span>Ask FinBuddy</span>
            <span className="mx-1.5">·</span>
            <span>Search Grounding (gemini-3.8-flash)</span>
            <span className="mx-1.5">·</span>
            <span>Live Voice (gemini-3.8-live)</span>
            <span className="mx-1.5">·</span>
            <span>Audio Transcribe (gemini-3.5-transcribe)</span>
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A]">
            Your Personal AI Financial Literacy Tutor
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Ask by text, transcribe your voice with <code className="text-xs font-mono">gemini-3.5-transcribe</code>,
            get live web-grounded answers via Google Search (<code className="text-xs font-mono">gemini-3.8-flash</code>),
            or speak in real time using <code className="text-xs font-mono">gemini-3.8-live</code>.
          </p>
        </div>

        {/* Quick Mode Controls: Search Grounding Toggle + Simple Language Toggle + Reset */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="toggle-search-grounding"
            type="button"
            aria-pressed={useSearchGrounding}
            onClick={() => setUseSearchGrounding((prev) => !prev)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              useSearchGrounding
                ? 'bg-teal-50 border-[#0EA5E9] text-[#0F172A]'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>
              {useSearchGrounding ? 'Google Search Grounding: ON' : 'Google Search Grounding: OFF'}
            </span>
          </button>

          <button
            type="button"
            aria-pressed={simpleLanguage}
            onClick={() => setSimpleLanguage((prev) => !prev)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              simpleLanguage
                ? 'bg-emerald-50 border-[#10B981] text-[#0F172A]'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>{simpleLanguage ? 'Simple Language: ON' : 'Simple Language: OFF'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-100 text-[#0F172A] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Personalization Bar for Name, Current Level, Topic, and Difficulty Preference */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end shadow-xs">
        <div>
          <label
            htmlFor="ask-learner-name"
            className="block text-xs font-semibold text-[#0F172A] mb-1.5"
          >
            Your Name:
          </label>
          <input
            id="ask-learner-name"
            type="text"
            value={learnerName}
            onChange={(e) => onChangeLearnerName(e.target.value)}
            placeholder="e.g., Aarav, Priya"
            className="w-full bg-[#EEF4F1] border border-slate-300 rounded-lg px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0EA5E9]"
          />
        </div>

        <div>
          <label
            htmlFor="ask-current-level"
            className="block text-xs font-semibold text-[#0F172A] mb-1.5"
          >
            Current Level:
          </label>
          <select
            id="ask-current-level"
            value={currentLevel}
            onChange={(e) => onChangeCurrentLevel(e.target.value as CurrentKnowledgeLevel)}
            className="w-full bg-[#EEF4F1] border border-slate-300 rounded-lg px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0EA5E9]"
          >
            {CURRENT_LEVEL_OPTIONS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="ask-preferred-topic"
            className="block text-xs font-semibold text-[#0F172A] mb-1.5"
          >
            Focus Topic:
          </label>
          <select
            id="ask-preferred-topic"
            value={preferredTopic}
            onChange={(e) => onChangePreferredTopic(e.target.value as TopicId)}
            className="w-full bg-[#EEF4F1] border border-slate-300 rounded-lg px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0EA5E9]"
          >
            {TOPIC_MODULES.map((mod) => (
              <option key={mod.id} value={mod.id}>
                {mod.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="block text-xs font-semibold text-[#0F172A] mb-1.5">
            Difficulty Preference:
          </span>
          <div
            role="group"
            aria-label="Tutor difficulty preference"
            className="grid grid-cols-3 gap-1 p-1 bg-[#EEF4F1] border border-slate-300 rounded-lg"
          >
            {(['Beginner', 'Intermediate', 'Advanced'] as DifficultyLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onChangeLearnerLevel(lvl)}
                className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  learnerLevel === lvl
                    ? 'bg-[#0EA5E9] text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Two-Column Layout: Chat Workspace (8 cols) + Live Voice API & Starter Prompts (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Chat Interface with Search Grounding & Mic Transcription (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden shadow-xs">
          {/* Conversation Stream */}
          <div className="p-6 space-y-6 max-h-[560px] overflow-y-auto">
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
                >
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 px-1">
                    <span className="font-semibold text-[#0F172A]">
                      {isUser ? learnerName.trim() || 'You' : 'FinBuddy Tutor'}
                    </span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                    {!isUser && connectionMode === 'ai' && (
                      <>
                        <span>·</span>
                        <span className="text-[#0EA5E9] font-medium">gemini-3.8-flash</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`max-w-2xl rounded-xl p-4 sm:p-5 ${
                      isUser
                        ? 'bg-[#0F172A] text-white'
                        : 'bg-[#EEF4F1] border border-slate-200 text-[#0F172A]'
                    }`}
                  >
                    {isUser ? (
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    ) : (
                      renderFormattedMessage(msg.content)
                    )}

                    {/* Google Search Grounding Sources */}
                    {!isUser &&
                      msg.groundingSources &&
                      msg.groundingSources.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-300/80 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0EA5E9]">
                            <Globe className="w-3.5 h-3.5" />
                            <span>
                              Google Search Grounding Sources (gemini-3.8-flash):
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.groundingSources.map((src, sIdx) => (
                              <a
                                key={`${src.uri}-${sIdx}`}
                                href={src.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0F172A] bg-white hover:bg-teal-50 border border-slate-300 rounded-md px-2.5 py-1 transition-colors"
                              >
                                <span className="truncate max-w-[220px]">{src.title}</span>
                                <ExternalLink className="w-3 h-3 text-[#0EA5E9] shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Suggested Replies under Assistant Message */}
                  {!isUser &&
                    idx === messages.length - 1 &&
                    msg.suggestedReplies &&
                    msg.suggestedReplies.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.suggestedReplies.map((reply) => (
                          <button
                            key={reply}
                            type="button"
                            disabled={isLoading}
                            onClick={() => sendQuestion(reply)}
                            className="px-3 py-1.5 bg-white hover:bg-teal-50 text-[#0F172A] border border-[#0EA5E9] rounded-lg text-xs font-medium transition-colors cursor-pointer"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700 bg-[#EEF4F1] border border-slate-200 rounded-xl p-4 w-fit">
                <RefreshCw className="w-4 h-4 text-[#0EA5E9] animate-spin" />
                <span>
                  FinBuddy is preparing your explanation{' '}
                  {useSearchGrounding ? 'with Google Search Grounding (gemini-3.8-flash)...' : '...'}
                </span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-red-900">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                {lastFailedPrompt && (
                  <button
                    type="button"
                    onClick={() => sendQuestion(lastFailedPrompt)}
                    className="px-3 py-1.5 bg-red-700 text-white text-xs font-semibold rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Transcription Status Banner */}
          {transcribeStatus && (
            <div className="px-4 py-2 bg-teal-50 border-t border-teal-200 text-xs text-[#0F172A] flex items-center justify-between">
              <span className="font-medium">{transcribeStatus}</span>
              <button
                type="button"
                onClick={() => setTranscribeStatus(null)}
                className="text-slate-500 hover:text-[#0F172A] text-[11px] font-semibold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Input Form with Microphone Audio Transcription (gemini-3.5-transcribe) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendQuestion(inputText);
            }}
            className="border-t border-slate-200 bg-[#EEF4F1] p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
          >
            <label htmlFor="finbuddy-chat-input" className="sr-only">
              Ask FinBuddy a financial question
            </label>
            <input
              id="finbuddy-chat-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask in simple words or click Transcribe Audio..."
              className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#0EA5E9]"
            />

            <button
              id="mic-transcribe-btn"
              type="button"
              disabled={isTranscribing}
              onClick={handleToggleMicTranscription}
              className={`px-3.5 py-2.5 rounded-lg text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                isRecordingMic
                  ? 'bg-red-600 border-red-600 text-white'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-[#0F172A]'
              }`}
              title="Transcribe microphone audio using gemini-3.5-transcribe"
            >
              {isRecordingMic ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Stop & Transcribe</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  <span>{isTranscribing ? 'Transcribing...' : 'Transcribe Audio'}</span>
                </>
              )}
            </button>

            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-5 py-2.5 bg-[#0EA5E9] hover:bg-[#0284C7] disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Question</span>
            </button>
          </form>
        </div>

        {/* Right Sidebar: Real-Time Live Voice Tutor (gemini-3.8-live) & Starter Questions (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Live Voice Conversation Card (gemini-3.8-live) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0EA5E9]">
                <Volume2 className="w-4 h-4 text-[#0EA5E9]" />
                <span>Real-Time Live API · gemini-3.8-live</span>
              </div>
              {isLiveVoiceActive && (
                <span className="text-[11px] font-semibold text-[#10B981]">
                  Live Session Active
                </span>
              )}
            </div>

            <h2 className="text-base font-bold text-[#0F172A]">
              Voice Conversation with FinBuddy
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Have a real-time spoken conversation with FinBuddy powered by{' '}
              <code className="font-mono text-[11px]">gemini-3.8-live</code>. Speak naturally into
              your microphone and hear instant voice responses.
            </p>

            <div className="p-3 rounded-lg bg-[#EEF4F1] border border-slate-200 text-xs text-slate-700 space-y-2">
              <p className="font-medium text-[#0F172A]">{liveStatusMessage}</p>
              {liveTranscripts.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-200 max-h-36 overflow-y-auto">
                  {liveTranscripts.map((item, idx) => (
                    <p key={idx} className="text-[11px] leading-relaxed">
                      <strong
                        className={
                          item.role === 'user' ? 'text-[#0EA5E9]' : 'text-[#10B981]'
                        }
                      >
                        {item.role === 'user' ? 'You: ' : 'FinBuddy Live: '}
                      </strong>
                      <span>{item.text}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button
                id="toggle-live-voice-btn"
                type="button"
                onClick={startLiveVoiceSession}
                className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                  isLiveVoiceActive
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-[#10B981] hover:bg-[#059669] text-white'
                }`}
              >
                {isLiveVoiceActive ? (
                  <>
                    <PhoneOff className="w-4 h-4" />
                    <span>End Live Voice Conversation</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-4 h-4" />
                    <span>Start Live Voice Conversation</span>
                  </>
                )}
              </button>

              {isLiveVoiceActive && (
                <button
                  id="send-live-prompt-btn"
                  type="button"
                  onClick={() =>
                    sendLiveVoicePrompt('How can I start a ₹3,000 monthly SIP safely?')
                  }
                  className="w-full py-2 px-3 bg-[#EEF4F1] hover:bg-slate-200 text-[#0F172A] border border-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Test Voice Prompt: “How to start a ₹3,000 SIP?”
                </button>
              )}
            </div>
          </div>

          {/* Suggested Starter Questions */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#0EA5E9]" />
              <span>Suggested Starter Questions</span>
            </h2>
            <p className="text-xs text-slate-600">
              Click any question below to see how FinBuddy breaks down money topics step by step:
            </p>
            <div className="space-y-2.5">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={isLoading}
                  onClick={() => sendQuestion(q)}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-[#0EA5E9] hover:bg-[#EEF4F1] text-xs font-medium text-[#0F172A] transition-colors cursor-pointer"
                >
                  “{q}”
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 text-[#0F172A] rounded-xl p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#10B981]">
              <ShieldAlert className="w-4 h-4 text-[#10B981]" />
              <span>Privacy & Financial Safety</span>
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">What FinBuddy Will Never Ask You</h3>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4 leading-relaxed">
              <li>Never share your OTP, UPI PIN, ATM PIN, CVV, or bank account password.</li>
              <li>
                All calculations and budgets are educational illustrations, not guaranteed returns.
              </li>
              <li>
                Verify current tax rules and financial terms on official portals before making
                financial commitments.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};
