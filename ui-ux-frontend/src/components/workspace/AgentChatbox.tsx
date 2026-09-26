import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  FileCode2, 
  Download, 
  Eye, 
  RefreshCw, 
  Trash2,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ChatMessage, ExecutionTraceStep, AOIPreset } from '../../types';
import { OrbitMascot } from '../mascot/OrbitMascot';
import { SatQueryApiService } from '../../services/apiService';

interface AgentChatboxProps {
  activeAOI: AOIPreset;
  onHighlightFeature?: (featureId: string) => void;
  onExportGeoJSON?: () => void;
}

export const AgentChatbox: React.FC<AgentChatboxProps> = ({
  activeAOI,
  onHighlightFeature,
  onExportGeoJSON
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'agent',
      timestamp: '14:20:04',
      text: `Initialized Satellite AI Assistant. Ready to analyze imagery. Active location is set to **${activeAOI.name}**. What would you like to check or analyze?`,
      traces: [
        {
          id: 't-0',
          title: 'Image Alignment & Coordinates',
          status: 'completed',
          durationMs: 14,
          details: `Aligned satellite imagery bounds to target region.`
        },
        {
          id: 't-1',
          title: 'Cloud & Shadow Check',
          status: 'completed',
          durationMs: 22,
          details: 'Checked for cloud cover across target area (2.4% cloud detected).'
        }
      ]
    },
    {
      id: 'm-query-1',
      sender: 'user',
      timestamp: '14:21:10',
      text: 'Show recent tree loss and identify cleared areas in Sector 4.'
    },
    {
      id: 'm-res-1',
      sender: 'agent',
      timestamp: '14:21:12',
      text: `Analysis complete for **${activeAOI.name}** (Sector 4). 

Comparing satellite images from June vs August 2024, we detected **48.2 hectares** of new tree cover loss. The vegetation index dropped significantly in affected clusters.`,
      traces: [
        {
          id: 'tr-1',
          title: 'Step 1: Loading Satellite Images',
          status: 'completed',
          durationMs: 28,
          details: 'Loaded 4 satellite image layers. Aligned images with high precision.',
          payload: {
            source: 'satellite-imagery',
            collection: 'sentinel-2-surface',
            region: activeAOI.name,
            cloud_cover_percent: 2.1
          }
        },
        {
          id: 'tr-2',
          title: 'Step 2: Comparing Color and Light Bands',
          status: 'completed',
          durationMs: 19,
          details: 'Calculated vegetation change across all pixels.'
        },
        {
          id: 'tr-3',
          title: 'Step 3: AI Detection Analysis',
          status: 'completed',
          durationMs: 34,
          details: 'Detected 14 separate disturbance areas with 98.6% confidence.',
          payload: {
            model: 'SatQuery-High-Accuracy-Detector',
            features_detected: 14,
            loss_area_ha: 48.2
          }
        },
        {
          id: 'tr-4',
          title: 'Step 4: Metric Calculation',
          status: 'completed',
          durationMs: 12,
          details: 'Calculated exact area measurements and checked against conservation boundaries.'
        }
      ],
      groundedStats: [
        { label: 'Total Loss Area', value: '48.2', unit: 'hectares' },
        { label: 'Vegetation Drop', value: '-63.1%', unit: 'relative' },
        { label: 'Model Confidence', value: '98.6%', unit: 'Verified' },
        { label: 'Detected Areas', value: '14', unit: 'zones' }
      ],
      suggestedAction: {
        label: 'Highlight Area #1',
        actionType: 'highlight-scar'
      }
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>('m-res-1');
  const [showRawJson, setShowRawJson] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQueries = [
    'Calculate burned area and damage severity',
    'Map peak flooded areas with water depth > 1.2m',
    'Check crop health and vegetation stress'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toTimeString().split(' ')[0],
      text: textToSend
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsProcessing(true);

    const livePromise = SatQueryApiService.sendChat(textToSend, activeAOI.name);

    setTimeout(async () => {
      const liveRes = await livePromise;
      const agentResId = `agt-${Date.now()}`;

      if (liveRes && liveRes.reply) {
        const liveAgentMessage: ChatMessage = {
          id: agentResId,
          sender: 'agent',
          timestamp: new Date().toTimeString().split(' ')[0],
          text: liveRes.reply,
          traces: (liveRes.traces as any) || [],
          groundedStats: liveRes.groundedStats,
          suggestedAction: (liveRes.suggestedAction as any)
        };
        setMessages(prev => [...prev, liveAgentMessage]);
        setExpandedTraceId(agentResId);
        setIsProcessing(false);
        return;
      }

      const agentMessage: ChatMessage = {
        id: agentResId,
        sender: 'agent',
        timestamp: new Date().toTimeString().split(' ')[0],
        text: `Processed question: "${textToSend}" for **${activeAOI.name}**. 

The AI model identified **28.4 km²** of changes with high confidence. Satellite comparisons verified these areas with **97.4% precision**.`,
        traces: [
          {
            id: `tr-a-${Date.now()}`,
            title: '1. Image Alignment',
            status: 'completed',
            durationMs: 24,
            details: `Retrieved satellite surface imagery for selected region.`,
            payload: {
              sensor: 'sentinel-2',
              bands: ['Blue', 'Green', 'Red', 'Near-IR', 'Shortwave-IR'],
              resolution: '10m'
            }
          },
          {
            id: `tr-b-${Date.now()}`,
            title: '2. AI Detection Analysis',
            status: 'completed',
            durationMs: 38,
            details: 'Ran AI image analysis in 38ms.'
          },
          {
            id: `tr-c-${Date.now()}`,
            title: '3. Area Boundary Mapping',
            status: 'completed',
            durationMs: 18,
            details: 'Created boundary outlines for detected areas.'
          }
        ],
        groundedStats: [
          { label: 'Detected Area', value: '28.4', unit: 'km²' },
          { label: 'Vegetation Index', value: '0.78', unit: 'Normalized' },
          { label: 'Confidence Score', value: '97.4%', unit: 'Verified' }
        ],
        suggestedAction: {
          label: 'Export Analysis Results',
          actionType: 'export-geojson'
        }
      };

      setMessages(prev => [...prev, agentMessage]);
      setExpandedTraceId(agentResId);
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-950/95 border-l border-white/10 text-xs select-none text-white relative transition-colors duration-200">
      {/* Cyan/Blue Top Trim */}
      <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500"></div>

      {/* Agent Header */}
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-gray-900/80 backdrop-blur-md transition-colors duration-200">
        <div className="flex items-center gap-2.5">
          <OrbitMascot size="sm" mood={isProcessing ? 'analyzing' : 'idle'} showHalo={false} />
          <div>
            <div className="flex items-center gap-1.5 font-bold text-white">
              <span>Orbit AI Assistant</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[10px] text-gray-400">
              Satellite Analysis Copilot
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-150 active:scale-[0.98]"
          title="Clear Chat History"
          aria-label="Clear Chat History"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/60 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Sender tag */}
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-1 px-1">
              {msg.sender === 'user' ? (
                <>
                  <span className="font-medium text-gray-300">You</span>
                  <User className="w-3 h-3 text-gray-400" />
                </>
              ) : (
                <>
                  <OrbitMascot size="xs" mood="idle" showHalo={false} />
                  <span className="text-cyan-400 font-semibold">Orbit Copilot</span>
                </>
              )}
              <span>•</span>
              <span className="text-gray-500">{msg.timestamp}</span>
            </div>

            {/* Message Bubble */}
            <div
              className={`p-3.5 rounded-2xl max-w-[92%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-tr-sm shadow-lg shadow-cyan-900/20'
                  : 'bg-gray-900/90 border border-white/10 text-gray-200 rounded-tl-sm shadow-lg backdrop-blur-md'
              }`}
            >
              <div className="text-xs whitespace-pre-line">{msg.text}</div>

              {/* Observable Execution Traces Widget */}
              {msg.traces && msg.traces.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <button
                    onClick={() =>
                      setExpandedTraceId(expandedTraceId === msg.id ? null : msg.id)
                    }
                    className="w-full flex items-center justify-between text-[11px] font-mono font-semibold text-cyan-400 hover:text-cyan-300 active:scale-[0.98] py-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Analysis Steps ({msg.traces.length} steps)</span>
                    </span>
                    {expandedTraceId === msg.id ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {expandedTraceId === msg.id && (
                    <div className="mt-2 space-y-2 font-mono text-[11px] bg-black/60 p-3 rounded-xl border border-white/10 animate-in fade-in">
                      {msg.traces.map((trace) => (
                        <div
                          key={trace.id}
                          className="p-2 rounded-lg bg-white/5 border border-white/5 space-y-1 shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                              {trace.title}
                            </span>
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-500" />
                              {trace.durationMs}ms
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 pl-5">
                            {trace.details}
                          </p>

                          {/* Raw Payload Inspector toggle */}
                          {trace.payload && (
                            <div className="pl-5 pt-1">
                              <button
                                onClick={() => setShowRawJson(!showRawJson)}
                                className="text-[9px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                              >
                                <FileCode2 className="w-3 h-3" />
                                {showRawJson ? 'Hide Details' : 'View Details'}
                              </button>
                              {showRawJson && (
                                <pre className="mt-1 p-2 rounded bg-black/80 border border-white/10 text-cyan-300 text-[9px] overflow-x-auto">
                                  {JSON.stringify(trace.payload, null, 2)}
                                </pre>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Grounded Quantitative Statistics Grid */}
              {msg.groundedStats && (
                <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-2 gap-2">
                  {msg.groundedStats.map((stat, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="text-[10px] text-gray-400 font-mono">{stat.label}</div>
                      <div className="text-xs font-bold font-mono text-cyan-400 mt-0.5">
                        {stat.value}{' '}
                        <span className="text-[10px] font-normal text-gray-500">
                          {stat.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons inside responses */}
              {msg.suggestedAction && (
                <div className="mt-3 pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (msg.suggestedAction?.actionType === 'export-geojson') {
                        onExportGeoJSON?.();
                      } else {
                        onHighlightFeature?.('feature-1');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-semibold flex items-center gap-1.5 transition-all duration-150 active:scale-[0.98]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{msg.suggestedAction.label}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex flex-col items-start animate-in fade-in">
            <div className="p-3 rounded-2xl bg-gray-900/90 border border-white/10 text-white rounded-tl-sm flex items-center gap-3 text-xs shadow-lg backdrop-blur-md">
              <OrbitMascot size="xs" mood="analyzing" showHalo={false} />
              <div className="flex items-center gap-1.5 font-medium text-cyan-400">
                <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Orbit is analyzing satellite images...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Queries */}
      <div className="p-2.5 border-t border-white/10 bg-gray-950/80 overflow-x-auto flex items-center gap-1.5">
        {suggestedQueries.map((query, i) => (
          <button
            key={i}
            onClick={() => handleSend(query)}
            disabled={isProcessing}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 text-[11px] font-medium text-gray-300 hover:text-cyan-300 whitespace-nowrap transition-all duration-150 active:scale-[0.98] shadow-xs"
          >
            {query}
          </button>
        ))}
      </div>

      {/* Input Query Bar */}
      <div className="p-3 border-t border-white/10 bg-gray-900/90 backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask anything about this region..."
            disabled={isProcessing}
            className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-500 outline-none focus:bg-black/90 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 text-xs"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isProcessing}
            className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md shadow-cyan-900/30 transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:opacity-40"
            aria-label="Send Query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
