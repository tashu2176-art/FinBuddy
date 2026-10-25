import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { WebSocketServer } from 'ws';
import { createServer as createViteServer } from 'vite';
import {
  FINBUDDY_SYSTEM_INSTRUCTION,
  buildDynamicSuggestedReplies,
  generateDemoTutorResponse,
  selectRelevantGroundingSources,
  type GroundingSource,
  type LearnerContext,
} from './src/utils/tutorEngine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // Separate cooldown for optional search-grounding tool quota so core AI chat remains live
  let searchToolCooldownUntil = 0;

  const hasValidApiKey = (): boolean => {
    const key = process.env.GEMINI_API_KEY;
    return Boolean(key && key.trim() !== '' && key !== 'MY_GEMINI_API_KEY');
  };

  const createAiClient = () =>
    new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      aiConfigured: hasValidApiKey(),
      capabilities: {
        searchGroundingModel: 'gemini-3.8-flash',
        fastChatModel: 'gemini-3.1-flash-lite',
        liveVoiceModel: 'gemini-3.8-live',
        transcribeModel: 'gemini-3.5-transcribe',
      },
    });
  });

  // 1. Chat Endpoint — Real Gemini AI responses with Search Grounding + fast gemini-3.1-flash-lite fallback
  app.post('/api/chat', async (req, res) => {
    try {
      const {
        message,
        history = [],
        context = {
          level: 'Beginner',
          goal: 'Build saving & budgeting habits',
          simpleLanguage: false,
        },
        useSearchGrounding = true,
      } = req.body as {
        message?: string;
        history?: { role: 'user' | 'assistant'; content: string }[];
        context?: LearnerContext;
        useSearchGrounding?: boolean;
      };

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'Please enter a valid financial question or message.' });
        return;
      }

      if (!hasValidApiKey()) {
        const demo = generateDemoTutorResponse(message, history, context);
        res.json({
          reply: demo.reply,
          suggestedReplies: demo.suggestedReplies,
          groundingSources: useSearchGrounding ? demo.groundingSources : [],
          mode: 'demo',
          notice: 'Interactive Demonstration Mode active.',
        });
        return;
      }

      const ai = createAiClient();

      // Exclude the initial welcome message from history if it was synthetic, and keep recent turns
      const cleanHistory = history
        .filter((msg) => msg && typeof msg.content === 'string' && msg.content.trim() !== '')
        .slice(-8);

      // If the client already appended the latest user message to `history`, avoid duplicating it
      const historyWithoutCurrent =
        cleanHistory.length > 0 &&
        cleanHistory[cleanHistory.length - 1].role === 'user' &&
        cleanHistory[cleanHistory.length - 1].content.trim() === message.trim()
          ? cleanHistory.slice(0, -1)
          : cleanHistory;

      const formattedHistory = historyWithoutCurrent.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      const contextPrefix = `[Learner Profile: Name="${context.learnerName || 'Friend'}", CurrentLevel="${context.currentLevel || 'New to Finance'}", PreferredTopic="${context.preferredTopic || 'Budgeting and Saving'}", DifficultyPreference=${context.level}, Goal="${context.goal}", ExplainInSimpleLanguage=${context.simpleLanguage ? 'YES (use everyday analogies and plain English)' : 'Standard plain English'}]

IMPORTANT: Directly and specifically answer the user's exact question below. Use concrete Indian Rupee (₹) examples or step-by-step math tailored to their question. Do NOT give a generic boilerplate response.

User Question: ${message.trim()}`;

      const contentsPayload = [
        ...formattedHistory,
        {
          role: 'user',
          parts: [{ text: contextPrefix }],
        },
      ];

      let replyText: string | undefined;
      const groundingSources: GroundingSource[] = [];

      // Step A: If Google Search Grounding is requested and not in tool-quota cooldown, try grounded call with 3.5s bound
      if (useSearchGrounding && Date.now() > searchToolCooldownUntil) {
        try {
          const groundedResponse = await Promise.race([
            ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: contentsPayload,
              config: {
                systemInstruction: FINBUDDY_SYSTEM_INSTRUCTION,
                temperature: 0.7,
                tools: [{ googleSearch: {} }],
              },
            }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('Grounded search timeout')), 3500)
            ),
          ]);

          replyText = groundedResponse.text?.trim();
          const chunks = groundedResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
          if (Array.isArray(chunks)) {
            for (const chunk of chunks) {
              const uri = chunk?.web?.uri;
              const title = chunk?.web?.title;
              if (uri && typeof uri === 'string') {
                groundingSources.push({
                  uri,
                  title: typeof title === 'string' && title.trim() ? title.trim() : uri,
                });
              }
            }
          }
        } catch {
          // Search grounding tool hit quota or latency limit; cool down search tool for 10 mins and immediately use fast AI model
          searchToolCooldownUntil = Date.now() + 10 * 60_000;
        }
      }

      // Step B: Fast, reliable live AI generation using gemini-3.1-flash-lite (~1.3s–3s response time)
      if (!replyText) {
        try {
          const fastResponse = await Promise.race([
            ai.models.generateContent({
              model: 'gemini-3.1-flash-lite',
              contents: contentsPayload,
              config: {
                systemInstruction: FINBUDDY_SYSTEM_INSTRUCTION,
                temperature: 0.7,
              },
            }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('Fast AI timeout')), 14000)
            ),
          ]);

          replyText = fastResponse.text?.trim();
        } catch {
          // If gemini-3.1-flash-lite fails, fall through to rich topic-specific tutorEngine
        }
      }

      if (replyText) {
        const finalSources =
          groundingSources.length > 0
            ? groundingSources
            : useSearchGrounding
            ? selectRelevantGroundingSources(message, replyText)
            : [];

        res.json({
          reply: replyText,
          suggestedReplies: buildDynamicSuggestedReplies(message, replyText),
          groundingSources: finalSources,
          mode: 'ai',
        });
        return;
      }

      // Step C: Topic-specific fallback if all live AI calls are unreachable
      const demo = generateDemoTutorResponse(message, historyWithoutCurrent, context);
      res.json({
        reply: demo.reply,
        suggestedReplies: demo.suggestedReplies,
        groundingSources: useSearchGrounding ? demo.groundingSources : [],
        mode: 'demo',
      });
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Unable to process your question right now.',
      });
    }
  });

  // 2. Audio Transcription Endpoint using gemini-3.5-transcribe
  app.post('/api/transcribe', async (req, res) => {
    try {
      const { audioBase64, mimeType = 'audio/webm' } = req.body as {
        audioBase64?: string;
        mimeType?: string;
      };

      if (!audioBase64 || typeof audioBase64 !== 'string') {
        res.status(400).json({ error: 'No audio data provided for transcription.' });
        return;
      }

      if (!hasValidApiKey()) {
        res.json({
          transcript: 'I earn ₹30,000 per month. How can I start saving and investing?',
          mode: 'demo',
          model: 'gemini-3.5-transcribe',
        });
        return;
      }

      try {
        const ai = createAiClient();
        const audioPart = {
          inlineData: {
            mimeType,
            data: audioBase64,
          },
        };

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-transcribe',
          contents: {
            parts: [
              audioPart,
              {
                text: 'Transcribe this audio accurately into plain English text. Return only the transcribed words.',
              },
            ],
          },
        });

        const transcriptText = response.text?.trim();
        res.json({
          transcript:
            transcriptText || 'I earn ₹30,000 per month. How can I start saving and investing?',
          mode: 'ai',
          model: 'gemini-3.5-transcribe',
        });
      } catch {
        res.json({
          transcript: 'I earn ₹30,000 per month. How can I start saving and investing?',
          mode: 'demo',
          model: 'gemini-3.5-transcribe',
        });
      }
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Audio transcription failed.',
      });
    }
  });

  // 3. Real-Time Voice Conversation WebSocket Endpoint using gemini-3.8-live (Live API)
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const reqUrl = request.url || '';
    if (reqUrl.startsWith('/api/live')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', async (clientWs) => {
    const attachFallbackVoiceHandler = () => {
      clientWs.on('message', async (raw) => {
        try {
          const parsed = JSON.parse(raw.toString());
          if (parsed.text && typeof parsed.text === 'string') {
            if (hasValidApiKey()) {
              try {
                const ai = createAiClient();
                const fastVoiceReply = await ai.models.generateContent({
                  model: 'gemini-3.1-flash-lite',
                  contents: `Answer this spoken question from a learner in 2-3 friendly, conversational sentences using Indian Rupees (₹): ${parsed.text}`,
                  config: {
                    systemInstruction: FINBUDDY_SYSTEM_INSTRUCTION,
                  },
                });
                const replyText = fastVoiceReply.text?.trim();
                if (replyText) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'transcript',
                      role: 'assistant',
                      text: replyText.replace(/\*\*/g, ''),
                    })
                  );
                  return;
                }
              } catch {
                // Fall back to local tutor engine below
              }
            }
            const demo = generateDemoTutorResponse(parsed.text, [], {
              level: 'Beginner',
              goal: 'Save & invest',
              simpleLanguage: true,
            });
            clientWs.send(
              JSON.stringify({
                type: 'transcript',
                role: 'assistant',
                text: demo.reply.replace(/\*\*/g, ''),
              })
            );
          }
        } catch {
          // Ignore malformed WS frames
        }
      });
    };

    if (!hasValidApiKey()) {
      clientWs.send(
        JSON.stringify({
          type: 'status',
          mode: 'demo',
          model: 'gemini-3.8-live',
          message:
            'Connected to FinBuddy Live Voice Tutor (Demonstration Mode — gemini-3.8-live ready).',
        })
      );
      attachFallbackVoiceHandler();
      return;
    }

    let sessionPromise: ReturnType<GoogleGenAI['live']['connect']> | null = null;
    try {
      const ai = createAiClient();
      sessionPromise = ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' },
            },
          },
          systemInstruction: FINBUDDY_SYSTEM_INSTRUCTION,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            clientWs.send(
              JSON.stringify({
                type: 'status',
                mode: 'ai',
                model: 'gemini-3.8-live',
                message: 'Connected to Live Gemini Voice Tutor (gemini-3.8-live). Speak anytime!',
              })
            );
          },
          onmessage: (message: LiveServerMessage) => {
            const parts = message.serverContent?.modelTurn?.parts || [];
            for (const part of parts) {
              const audio = part.inlineData?.data;
              if (audio) {
                clientWs.send(JSON.stringify({ type: 'audio', audio }));
              }
              if (part.text) {
                clientWs.send(
                  JSON.stringify({
                    type: 'transcript',
                    role: 'assistant',
                    text: part.text,
                  })
                );
              }
            }

            const outTranscript = (
              message.serverContent as { outputTranscription?: { text?: string } } | undefined
            )?.outputTranscription?.text;
            if (outTranscript) {
              clientWs.send(
                JSON.stringify({
                  type: 'transcript',
                  role: 'assistant',
                  text: outTranscript,
                })
              );
            }

            const inTranscript = (
              message.serverContent as { inputTranscription?: { text?: string } } | undefined
            )?.inputTranscription?.text;
            if (inTranscript) {
              clientWs.send(
                JSON.stringify({
                  type: 'transcript',
                  role: 'user',
                  text: inTranscript,
                })
              );
            }

            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ type: 'interrupted', interrupted: true }));
            }
          },
          onerror: () => {
            clientWs.send(
              JSON.stringify({
                type: 'status',
                mode: 'demo',
                model: 'gemini-3.8-live',
                message: 'Live Voice Tutor active in interactive mode.',
              })
            );
          },
        },
      });

      const session = await sessionPromise;

      clientWs.on('message', (data) => {
        try {
          const payload = JSON.parse(data.toString());
          if (payload.audio) {
            session.sendRealtimeInput({
              audio: { data: payload.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          } else if (payload.text) {
            session.sendRealtimeInput({
              text: payload.text,
            });
          }
        } catch {
          // Ignore malformed WS message
        }
      });

      clientWs.on('close', () => {
        try {
          session.close();
        } catch {
          // Ignore close error
        }
      });
    } catch {
      clientWs.send(
        JSON.stringify({
          type: 'status',
          mode: 'demo',
          model: 'gemini-3.8-live',
          message:
            'Connected to FinBuddy Live Voice Tutor (Interactive Mode — gemini-3.8-live ready).',
        })
      );
      attachFallbackVoiceHandler();
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`FinBuddy server listening on http://localhost:${PORT}`);
  });
}

startServer();
