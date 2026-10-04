import React from 'react';
import { Volume2, PhoneCall, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EasyModeBanner: React.FC = () => {
  const { easyMode, toggleEasyMode, speakText, setIsHelpModalOpen, t } = useApp();

  if (!easyMode) return null;

  const handleAudioHelp = () => {
    speakText('आप सुगम खरीदारी मोड में हैं। यहाँ अक्षर बड़े हैं और खरीदारी बहुत आसान है। किसी भी सहायता के लिए नीचे दिए गए लाल बटन को दबाएँ।');
  };

  return (
    <div className="bg-amber-50 border-b-2 border-amber-300 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 flex-shrink-0 font-bold shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {t('easyModeActive')}
              </h2>
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Senior Friendly
              </span>
            </div>
            <p className="text-sm font-medium text-slate-700">
              {t('easyModeDesc')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
          {/* Read aloud helper */}
          <button
            onClick={handleAudioHelp}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border-2 border-amber-400 px-4 py-2 rounded-xl text-sm font-bold shadow-xs transition-all cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>{t('audioReadAloud')}</span>
          </button>

          {/* Quick Call Assistant button */}
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-extrabold shadow-sm transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t('callAttendant')}</span>
          </button>

          {/* Turn off Easy Mode button */}
          <button
            onClick={toggleEasyMode}
            className="text-xs text-slate-500 hover:text-slate-800 underline px-2 py-1 cursor-pointer"
          >
            Standard View
          </button>
        </div>
      </div>
    </div>
  );
};
