import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, Search, AlertCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VoiceSearchModal: React.FC = () => {
  const { 
    isVoiceModalOpen, 
    setIsVoiceModalOpen, 
    setSearchQuery, setSelectedCategory, 
    language,
    speakText,
    t 
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [recognitionSupported, setRecognitionSupported] = useState(true);

  // Check speech recognition capability
  useEffect(() => {
    if (!isVoiceModalOpen) {
      setIsListening(false);
      setTranscript('');
      setErrorMsg('');
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setRecognitionSupported(false);
      setErrorMsg(t('voiceNotSupported'));
      return;
    }

    setRecognitionSupported(true);
    // Microphone starts only after the Speak button is clicked.

    return () => {
      stopListening();
    };
  }, [isVoiceModalOpen, language]);

  const recognitionInstance = useRef<any>(null);

  const startListening = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec || recognitionInstance.current) return;

    try {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = true;

      // Map language code to BCP-47 locale
      if (language === 'hi') rec.lang = 'hi-IN';
      else if (language === 'or') rec.lang = 'or-IN';
      else if (language === 'mr') rec.lang = 'mr-IN';
      else if (language === 'bn') rec.lang = 'bn-IN';
      else if (language === 'ta') rec.lang = 'ta-IN';
      else if (language === 'te') rec.lang = 'te-IN';
      else if (language === 'gu') rec.lang = 'gu-IN';
      else rec.lang = 'en-IN';

      rec.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
      };

      rec.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setTranscript(text);
      };

      rec.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access was denied. Please allow microphone permissions in your browser.');
        } else {
          setErrorMsg(`Voice recognition note: ${event.error}. You can also type or use sample queries below.`);
        }
      };

      rec.onend = () => {
        if (recognitionInstance.current === rec) recognitionInstance.current = null;
        setIsListening(false);
      };

      recognitionInstance.current = rec;
      rec.start();
    } catch (err: any) {
      recognitionInstance.current = null;
      setErrorMsg(err.message || 'Could not access audio recognition.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionInstance.current) {
      try {
        recognitionInstance.current.onresult = null; recognitionInstance.current.onerror = null; recognitionInstance.current.onend = null; recognitionInstance.current.abort(); recognitionInstance.current = null;
      } catch {}
    }
    setIsListening(false);
  };

  const handleApplySearch = () => {
    if (transcript.trim()) {
      setSelectedCategory(null); setSearchQuery(transcript.trim());
      speakText(`Searching for ${transcript}`);
      setIsVoiceModalOpen(false);
    }
  };

  const handleSampleClick = (sampleTerm: string) => {
    setTranscript(sampleTerm);
    // Let the user review the query before searching.
  };

  if (!isVoiceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 text-center p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>Browser Voice Search</span>
          </div>
          <button
            onClick={() => setIsVoiceModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pulsing Mic Waveform */}
        <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-orange-400/20 animate-ping" />
          )}
          <div className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-colors ${
            isListening ? 'bg-orange-600 text-white shadow-orange-500/40 ring-8 ring-orange-100' : 'bg-slate-100 text-slate-400'
          }`}>
            {isListening ? (
              <Mic className="w-10 h-10 animate-pulse" />
            ) : (
              <MicOff className="w-10 h-10" />
            )}
          </div>
        </div>

        <h3 className="text-lg font-extrabold text-slate-900 mb-1">
          {isListening ? t('voiceListening') : 'Voice Assistant Ready'}
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Say local names like <strong className="text-slate-700">"tej patta"</strong>, <strong className="text-slate-700">"haldi"</strong>, or <strong className="text-slate-700">"laptop"</strong> in your language.
        </p>

        {/* Live Transcript Display Box */}
        <label htmlFor="voice-query" className="block text-sm text-slate-700">Review or type your search</label>
        <textarea id="voice-query" value={transcript} onChange={e => setTranscript(e.target.value)} className="w-full min-h-16 p-3 bg-slate-50 border border-slate-300 rounded-2xl mb-4" placeholder="Type here or click Start Listening" />
        <p className="text-xs text-slate-500 mb-3">Voice availability depends on your browser and language service; internet may be required.</p>

        {errorMsg && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 mb-4 text-left">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            disabled={!recognitionSupported} onClick={isListening ? stopListening : startListening}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-colors cursor-pointer border ${
              isListening
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
            }`}
          >
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
          <button
            onClick={handleApplySearch}
            disabled={!transcript.trim()}
            className="py-2.5 px-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Term</span>
          </button>
        </div>

        {/* Quick Clickable Vernacular Query Samples for Demonstration */}
        <div className="pt-3 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Try Sample Vernacular Terms:
          </span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {['tej patta', 'तेज पत्ता', 'haldi', 'jeera', 'iphone', 'khadi kurta'].map(sample => (
              <button
                key={sample}
                onClick={() => handleSampleClick(sample)}
                className="text-xs bg-orange-50 text-orange-800 hover:bg-orange-100 font-medium px-2.5 py-1 rounded-full border border-orange-200 transition-colors cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
