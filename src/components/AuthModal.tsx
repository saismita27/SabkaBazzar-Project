import React, { useState, useEffect } from 'react';
import { 
  X, 
  User as UserIcon, 
  Lock, 
  Phone, 
  Mail, 
  MapPin, 
  LogOut, 
  Package, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthOpen, 
    setIsAuthOpen, 
    user, 
    loginUser, 
    logoutUser, 
    orders, 
    openOrderTracking,
    t 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!isAuthOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        try { sessionStorage.setItem('sb_login_later', 'true'); } catch {}
        setIsAuthOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isAuthOpen, setIsAuthOpen]);

  if (!isAuthOpen) return null;

  const handleLoginLater = () => {
    try {
      sessionStorage.setItem('sb_login_later', 'true');
    } catch {}
    setIsAuthOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register') {
      loginUser(name || 'Customer', phone || '0000000000', email || 'demo@example.test');
    } else {
      loginUser(name || 'Demo shopper', phone || '0000000000', email || 'demo@example.test');
    }
    setIsAuthOpen(false);
  };

  const handleQuickDemoLogin = () => {
    loginUser('Demo shopper', '0000000000', 'demo@example.test');
    setIsAuthOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" className="bg-white rounded-2xl max-w-md w-full max-h-[85dvh] min-h-0 flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Banner with Catchy Tagline */}
        <div className="shrink-0 relative bg-gradient-to-br from-slate-950 via-orange-950 to-amber-950 text-white p-4 overflow-hidden border-b border-orange-500/20">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/25 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="min-w-0 flex items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/30 font-black text-2xl">
                स
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 id="auth-modal-title" className="text-lg sm:text-xl font-black tracking-tight text-white">
                    सबका बाज़ार
                  </h1>
                  <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                    Sabka Bazaar
                  </span>
                </div>
                <p className="text-[11px] text-amber-200/90 font-medium">
                  {user ? 'Aapka Apna Shopping Account' : 'Welcome to India\'s Family Shopping Store'}
                </p>
              </div>
            </div>

            {/* Quick Dismiss / Login Later Button in top corner */}
            <button
              onClick={handleLoginLater}
              aria-label="Close login popup"
              className="shrink-0 min-w-11 min-h-11 justify-center focus-visible:outline-2 focus-visible:outline-white text-xs font-bold text-amber-200/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md"
              title="Explore store now and login later"
            >
              <span className="hidden sm:inline">{user ? 'Close' : 'Login Later'}</span>
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain">
          {/* User's Exact Tagline Banner */}
          <div className="relative z-10 m-4 p-3 bg-orange-950 rounded-2xl border border-white/15 backdrop-blur-md">
            <p className="text-xs sm:text-sm font-extrabold text-amber-300 leading-snug tracking-wide">
              “Ghar mein generations chaar, pasand ke rang hazaar — sabki shopping ka ek thikana, Sabka Bazaar!”
            </p>
            <p className="text-[11px] text-slate-300 mt-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Dada-Dadi, Mummy-Papa, Teens & Bachpan — Sabke liye Shopping Demo!</span>
            </p>
          </div>
        {user ? (
          /* Profile & My Orders View when Logged In */
          <div className="p-4 space-y-4 text-xs">
            <div className="flex items-center gap-3.5 p-4 bg-orange-50/80 border border-orange-200 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-orange-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-sm text-slate-900 truncate">{user.name}</h3>
                <p className="text-slate-500 truncate">{user.email}</p>
                <p className="text-slate-500 font-mono">+91 {user.phone}</p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                Demo Profile
              </span>
            </div>

            {/* Orders Summary */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-orange-600" />
                  <span>My Active Orders ({orders.length})</span>
                </span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                {orders.map(o => (
                  <div key={o.id} className="p-3 bg-white flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-bold text-slate-900">{o.id}</div>
                      <div className="text-[10px] text-slate-400">{o.createdAt} • ₹{o.total}</div>
                    </div>
                    <button
                      onClick={() => {
                        setIsAuthOpen(false);
                        openOrderTracking(o.id);
                      }}
                      className="text-orange-600 font-bold hover:underline cursor-pointer"
                    >
                      Track Order
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  logoutUser();
                  setIsAuthOpen(false);
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 border border-slate-200"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('logout')}</span>
              </button>
              <button
                onClick={() => setIsAuthOpen(false)}
                className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Login & Registration Form with Prominent "Login Later" Option */
          <div className="p-4 space-y-4">
            <div className="flex border-b border-slate-200 pb-2 gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`pb-2 border-b-2 cursor-pointer transition-colors ${
                  mode === 'login' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`pb-2 border-b-2 cursor-pointer transition-colors ${
                  mode === 'register' ? 'border-orange-600 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {mode === 'register' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mobile Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-600 font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="9861023456"
                    className="w-full p-2.5 border border-slate-300 rounded-r-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
              )}

              <p className="p-3 bg-amber-50 rounded-xl text-amber-900">Local demo profile only. No password verification, SMS, real payments or secure accounts. Use fictional details. Signing out clears this profile's demo shopping history.</p>
              {/* Primary Sign In Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>{mode === 'login' ? 'Continue with Demo Profile' : 'Create Demo Profile'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 1-Click Demo Login */}
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>One-Click Demo Profile</span>
              </button>
            </form>

            {/* Prominent "LOGIN LATER" Option */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <button
                type="button"
                onClick={handleLoginLater}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-300 shadow-2xs text-xs sm:text-sm"
              >
                <ShoppingBag className="w-4 h-4 text-orange-600" />
                <span>Login Later — Explore Sabka Bazaar Now</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>

              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                No account needed right now! Browse all 160+ products, search in 8 Indian mother tongues, and add to cart freely. You can log in anytime later.
              </p>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
