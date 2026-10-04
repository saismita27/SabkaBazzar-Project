import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  MessageSquare, 
  PhoneCall, 
  Send, 
  Bot, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  FileText,
  AlertTriangle,
  Terminal
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomerCareModal: React.FC = () => {
  const {
    isHelpModalOpen,
    setIsHelpModalOpen,
    supportTickets,
    createSupportTicket,
    kioskHardwareEvent,
    triggerSimulatedKioskEvent,
    setIsLinuxInspectorOpen,
    orders,
    t
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ai' | 'callback' | 'ticket' | 'history'>('ai');
  const [callbackNumber, setCallbackNumber] = useState('9861023456');
  const [callbackSuccess, setCallbackSuccess] = useState(false);

  // Ticket fields
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [selectedOrderForTicket, setSelectedOrderForTicket] = useState<string>('');
  const [ticketCreatedSuccess, setTicketCreatedSuccess] = useState(false);

  // AI Chat simulation
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'Namaste! I am the Sabka Bazzar Accessibility Support Assistant. How can I help you today? You can ask about order delivery, refunds, or kiosk assistance.'
    }
  ]);
  const [aiInput, setAiInput] = useState('');

  if (!isHelpModalOpen) return null;

  const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userText = aiInput;
    setAiChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setAiInput('');

    // Generate responsive instant answer based on keywords
    setTimeout(() => {
      let botResponse = 'Thank you for reaching out. This is a scripted demo helper. Open the ticket tab to save a request in this browser.';
      const lower = userText.toLowerCase();

      if (lower.includes('order') || lower.includes('track') || lower.includes('delivery')) {
        botResponse = 'You can track your order directly in the "My Orders" tab. Tracking is simulated; no delivery or SMS is sent.';
      } else if (lower.includes('refund') || lower.includes('cancel') || lower.includes('return')) {
        botResponse = 'Orders can be cancelled before packing. Returns, refunds and pickups are not implemented in this demo.';
      } else if (lower.includes('help') || lower.includes('attendant') || lower.includes('button') || lower.includes('kiosk')) {
        botResponse = 'The browser help button simulates an event. The separate C++ listener and kernel driver are not connected to this web page.';
      }

      setAiChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 400);
  };

  const handleRequestCallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackNumber) return;
    createSupportTicket('general', 'Simulated callback request', 'Demo callback number: ' + callbackNumber);
    setCallbackSuccess(true);
    setTimeout(() => setCallbackSuccess(false), 5000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    createSupportTicket('order_issue', ticketSubject, ticketMessage, selectedOrderForTicket || undefined);
    setTicketSubject('');
    setTicketMessage('');
    setTicketCreatedSuccess(true);
    setTimeout(() => {
      setTicketCreatedSuccess(false);
      setActiveTab('history');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                1-Click Customer Care & Kiosk Help
              </h2>
              <p className="text-[11px] text-slate-500">
                Direct assistance without complicated IVRs or hidden phone menus
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsHelpModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Kiosk Hardware Help Alert (if triggered via /dev/sabka_help) */}
        {kioskHardwareEvent && (
          <div className="bg-rose-600 text-white px-6 py-3 flex items-center justify-between text-xs animate-pulse">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-300" />
              <span>
                <strong>Hardware IRQ Detected:</strong> Physical Kiosk Help Button (/dev/sabka_help) triggered at {kioskHardwareEvent.timestamp.slice(11, 19)} UTC!
              </span>
            </div>
            <button
              onClick={() => {
                setIsHelpModalOpen(false);
                setIsLinuxInspectorOpen(true);
              }}
              className="bg-white text-rose-700 font-bold px-2.5 py-1 rounded text-[11px] hover:bg-rose-50 cursor-pointer"
            >
              View Driver Code
            </button>
          </div>
        )}

        {/* Support Options Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 p-1.5 gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'ai' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Demo FAQ Helper</span>
          </button>
          <button
            onClick={() => setActiveTab('callback')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'callback' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Request Callback</span>
          </button>
          <button
            onClick={() => setActiveTab('ticket')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'ticket' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Raise Ticket</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'history' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>My Tickets ({supportTickets.length})</span>
          </button>
        </div>

        {/* Tab 1: AI Instant Assistant */}
        {activeTab === 'ai' && (
          <div className="p-6 flex flex-col h-96">
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
              {aiChatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-orange-600 text-white rounded-br-xs'
                        : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested Quick Prompts */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {[
                'Track my recent order',
                'How to return a grocery item?',
                'Simulate physical kiosk button press'
              ].map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => {
                    if (suggestion.includes('Simulate')) {
                      triggerSimulatedKioskEvent('SIMULATED_TEST_TRIGGER');
                    } else {
                      setAiInput(suggestion);
                    }
                  }}
                  className="text-[11px] bg-slate-50 hover:bg-orange-50 hover:border-orange-200 text-slate-600 hover:text-orange-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <form onSubmit={handleSendAiMessage} className="relative flex items-center">
              <input
                type="text"
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                placeholder="Ask any question regarding your order or shopping..."
                className="w-full pr-12 pl-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Request SMS Callback */}
        {activeTab === 'callback' && (
          <div className="p-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed">
              <strong>Zero Waiting Queue:</strong> Enter your mobile number. An authorized store executive will call you within 10 minutes to help with orders, language navigation, or product questions.
            </div>

            {callbackSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900 text-sm mb-1">Callback Request Confirmed!</h4>
                <p className="text-xs text-slate-600">
                  Demo callback saved for <strong>+91 {callbackNumber}</strong>. (Simulated Demo Event)
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestCallback} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Your 10-Digit Mobile Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-600 font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={callbackNumber}
                      onChange={e => setCallbackNumber(e.target.value)}
                      required
                      placeholder="9876543210"
                      className="w-full p-2.5 border border-slate-300 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Preferred Language for Call
                  </label>
                  <select className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>Odia (ଓଡ଼ିଆ)</option>
                    <option>Hindi (हिन्दी)</option>
                    <option>English</option>
                    <option>Marathi (मराठी)</option>
                    <option>Bengali (বাংলা)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Confirm Callback Request</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 3: Raise Support Ticket */}
        {activeTab === 'ticket' && (
          <div className="p-6 space-y-4">
            {ticketCreatedSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900 text-sm mb-1">Support Ticket Created!</h4>
                <p className="text-xs text-slate-600">
                  Saved in this browser demo inbox. No message or phone call has been sent.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Select Related Order (Optional)
                  </label>
                  <select
                    value={selectedOrderForTicket}
                    onChange={e => setSelectedOrderForTicket(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="">General Issue (No Order Attached)</option>
                    {orders.map(o => (
                      <option key={o.id} value={o.id}>
                        {o.id} — ₹{o.total} ({o.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Subject / Issue Summary</label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={e => setTicketSubject(e.target.value)}
                    required
                    placeholder="e.g., Wrong variant received or address change request"
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Detailed Description</label>
                  <textarea
                    rows={4}
                    value={ticketMessage}
                    onChange={e => setTicketMessage(e.target.value)}
                    required
                    placeholder="Describe how we can help you..."
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer transition-all"
                >
                  Submit Ticket
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 4: Ticket History & Admin Replies */}
        {activeTab === 'history' && (
          <div className="p-6 overflow-y-auto max-h-96 space-y-3">
            {supportTickets.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">No support tickets found.</p>
            ) : (
              supportTickets.map(tck => (
                <div key={tck.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-800">{tck.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      tck.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {tck.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900">{tck.subject}</h4>
                  <p className="text-slate-600">{tck.message}</p>
                  {tck.adminReply && (
                    <div className="p-2.5 bg-orange-50/80 border border-orange-200 rounded-xl text-orange-950 font-medium">
                      <strong className="block text-[10px] text-orange-700 uppercase tracking-wider">Store Attendant Reply:</strong>
                      {tck.adminReply}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-400">Created: {tck.createdAt}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer: Physical Kiosk Button Simulator trigger */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-orange-600" />
            <span>Kiosk Hardware Simulator Interface:</span>
          </div>

          <button
            onClick={() => triggerSimulatedKioskEvent('SIMULATED_TEST_TRIGGER')}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px] shadow-2xs transition-colors cursor-pointer"
          >
            Simulate /dev/sabka_help Press
          </button>
        </div>
      </div>
    </div>
  );
};
