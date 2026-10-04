import React from 'react';
import { 
  X, 
  Monitor, 
  Cpu, 
  HelpCircle, 
  ShieldCheck, 
  Volume2, 
  Sparkles, 
  Store, 
  Plane, 
  Coffee, 
  ArrowRight,
  Terminal,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const KioskOsExplainerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { triggerSimulatedKioskEvent, setIsLinuxInspectorOpen } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 overflow-hidden">
        {/* Luminous Background Accent */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-amber-500/20 via-rose-500/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 relative z-10 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Concept & Academic Architecture</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                What is a Kiosk OS? <span className="text-amber-400 text-lg font-normal">(कियोस्क ओएस क्या है?)</span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-sm text-slate-300 relative z-10">
          {/* Quick Definition */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <h3 className="text-amber-300 font-bold text-base mb-1.5 flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-400" />
              1. The Simple Meaning of a "Kiosk"
            </h3>
            <p className="leading-relaxed text-slate-200">
              A <strong>Kiosk</strong> is a standalone, public touchscreen machine placed in stores, airports, railway stations, or village centers for self-service.
              A <strong>Kiosk OS</strong> is a specialized, locked-down operating system (typically custom Linux) that boots directly into <em>only one full-screen app</em>, blocking desktop access, browsers, or system settings so public users cannot tamper with it.
            </p>
          </div>

          {/* Real-world Examples */}
          <div>
            <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400">
              <Layers className="w-4 h-4 text-orange-400" />
              Real-World Examples You See Everyday:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col items-center text-center">
                <Coffee className="w-6 h-6 text-amber-400 mb-2" />
                <span className="font-bold text-white text-xs">Fast-Food Kiosks</span>
                <span className="text-[11px] text-slate-400 mt-1">McDonald's / KFC self-ordering touchscreens</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col items-center text-center">
                <Plane className="w-6 h-6 text-cyan-400 mb-2" />
                <span className="font-bold text-white text-xs">Airport Check-In</span>
                <span className="text-[11px] text-slate-400 mt-1">Boarding pass & baggage tag printing machines</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col items-center text-center">
                <Store className="w-6 h-6 text-emerald-400 mb-2" />
                <span className="font-bold text-white text-xs">Retail & Railway</span>
                <span className="text-[11px] text-slate-400 mt-1">D-Mart self-checkout & Metro/IRCTC ticket kiosks</span>
              </div>
            </div>
          </div>

          {/* Why Sabka Bazzar uses a Kiosk OS */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/30">
            <h3 className="text-amber-300 font-bold text-base mb-2 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-rose-400" />
              2. Why Sabka Bazzar Uses an Embedded Linux Kiosk
            </h3>
            <p className="leading-relaxed text-slate-200 mb-3">
              In Indian village panchayats, post offices, and local mandis, many elderly citizens and rural shoppers don't own high-end smartphones or read English.
              <strong> Sabka Bazzar Kiosk</strong> is designed as a community touch terminal where:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300 pl-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Shoppers can search in their mother tongue (e.g. <em>"haldi"</em>, <em>"tej patta"</em>, <em>"dhoti"</em>).</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Text-to-speech audio reads out prices and product specs aloud.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span><strong>The Red Panic Button:</strong> If an elderly person gets stuck, they press the physical red button on the kiosk to summon immediate store assistance!</span>
              </li>
            </ul>
          </div>

          {/* Hardware Driver Workflow */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              How the Physical Button Works in Linux (Hardware ➔ Kernel ➔ UI)
            </h3>
            <div className="font-mono text-[11px] bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 space-y-1 leading-relaxed">
              <p><span className="text-rose-400 font-bold">1. Hardware Push:</span> User presses physical red button on kiosk (GPIO Pin 17).</p>
              <p><span className="text-amber-400 font-bold">2. Kernel ISR:</span> Linux character device driver <code className="text-amber-300">/dev/sabka_help</code> wakes up wait queue.</p>
              <p><span className="text-cyan-400 font-bold">3. C++ Daemon:</span> Background listener daemon unblocks on non-blocking <code className="text-cyan-300">poll()</code> with 0% CPU idle.</p>
              <p><span className="text-emerald-400 font-bold">4. React Kiosk Web UI:</span> Assistance modal pops up immediately with chime and vernacular read-aloud!</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <button
            onClick={() => {
              onClose();
              setIsLinuxInspectorOpen(true);
            }}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white rounded-xl font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
          >
            <Terminal className="w-4 h-4" />
            <span>View C Driver Code & Viva Notes</span>
          </button>

          <button
            onClick={() => {
              onClose();
              triggerSimulatedKioskEvent('EXPLAINER_MODAL_TEST');
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-rose-600 via-red-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl font-black text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Test Hardware Help Button</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
