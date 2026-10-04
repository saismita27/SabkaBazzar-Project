import React, { useState } from 'react';
import { 
  Search, 
  Mic, 
  ShoppingCart, 
  Heart, 
  HelpCircle, 
  User as UserIcon, 
  Globe, 
  Sparkles, 
  Terminal, 
  MapPin, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES } from '../data/translations';
import { LanguageCode } from '../types';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    selectedState,
    setSelectedState,
    easyMode,
    toggleEasyMode,
    searchQuery,
    setSearchQuery,
    cartCount,
    wishlist,
    setIsWishlistOpen,
    setIsCartOpen,
    setIsHelpModalOpen,
    setIsVoiceModalOpen,
    setIsAdminOpen,
    setIsAuthOpen,
    setIsLinuxInspectorOpen,
    user,
    t
  } = useApp();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isStateMenuOpen, setIsStateMenuOpen] = useState(false);

  const indianStates = [
    { name: 'Odisha', langs: ['or', 'hi', 'en'] as LanguageCode[], pin: '751001' },
    { name: 'Maharashtra', langs: ['mr', 'hi', 'en'] as LanguageCode[], pin: '400001' },
    { name: 'West Bengal', langs: ['bn', 'hi', 'en'] as LanguageCode[], pin: '700001' },
    { name: 'Tamil Nadu', langs: ['ta', 'en'] as LanguageCode[], pin: '600001' },
    { name: 'Andhra Pradesh', langs: ['te', 'hi', 'en'] as LanguageCode[], pin: '500001' },
    { name: 'Gujarat', langs: ['gu', 'hi', 'en'] as LanguageCode[], pin: '380001' },
    { name: 'Delhi NCR', langs: ['hi', 'en'] as LanguageCode[], pin: '110001' },
    { name: 'Uttar Pradesh', langs: ['hi', 'en'] as LanguageCode[], pin: '226001' }
  ];

  const handleStateSelect = (stateName: string, defaultLang: LanguageCode) => {
    setSelectedState(stateName);
    setLanguage(defaultLang);
    setIsStateMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Colorful Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600" />

      {/* Top Banner: Regional State selector + Embedded Linux Explorer quick link */}
      <div className="bg-slate-950 text-slate-200 text-xs py-1.5 px-4 sm:px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* State / Pincode delivery selector */}
          <div className="relative">
            <button 
              onClick={() => setIsStateMenuOpen(!isStateMenuOpen)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>Deliver to: <strong className="text-white">{selectedState}</strong></span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isStateMenuOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 p-3 z-50">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Select Your State (Local Language Auto-Select)
                </div>
                <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
                  {indianStates.map(st => (
                    <button
                      key={st.name}
                      onClick={() => handleStateSelect(st.name, st.langs[0])}
                      className={`text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        selectedState === st.name ? 'bg-orange-50 text-orange-700 font-semibold' : 'hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <div>{st.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">PIN: {st.pin}</div>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                        {st.langs.map(l => l.toUpperCase()).join(' · ')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Technical Badges */}
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <div className="hidden 2xl:flex items-center gap-1.5 text-amber-300 font-semibold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>“Ghar mein generations chaar, pasand ke rang hazaar — sabki shopping ka ek thikana, Sabka Bazaar!”</span>
            </div>
            <button
              onClick={() => setIsLinuxInspectorOpen(true)}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-medium px-2.5 py-0.5 rounded-full transition-all text-[11px] cursor-pointer border border-white/10 shadow-xs"
              title="Inspect Linux Character Device Driver & System Programming Architecture (/dev/sabka_help)"
            >
              <Terminal className="w-3 h-3 text-yellow-300" />
              <span>Linux Subsystem & Viva</span>
            </button>
            <div className="hidden md:flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multilingual Shopping Demo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 min-w-0 max-w-full">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 font-black text-xl">
              स
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  {t('appTitle')}
                </span>
                <span className="text-[10px] bg-gradient-to-r from-amber-100 to-orange-100 text-orange-950 font-black px-2 py-0.5 rounded-full tracking-wide border border-orange-200">
                  सबका बाज़ार
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block truncate max-w-[16rem]">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Search Bar with Vernacular Alias support & Mic icon */}
          <form onSubmit={handleSearchSubmit} className="order-3 w-full min-w-0 relative">
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className={`w-full pl-10 pr-24 py-2.5 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 bg-slate-50 transition-all ${
                  easyMode ? 'text-base font-medium py-3' : 'text-sm'
                }`}
              />
              
              {/* Voice search button */}
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(true)}
                className="absolute right-12 p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors cursor-pointer"
                title={t('voiceSearch')}
              >
                <Mic className="w-4 h-4 text-orange-600" />
              </button>

              {/* Submit button */}
              <button
                type="submit"
                className="absolute right-1.5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-400 text-white rounded-full p-2 transition-all cursor-pointer shadow-md shadow-orange-500/20 active:scale-95"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Right Action Icons & Toggles */}
          <div className="flex flex-wrap items-center justify-end gap-2 min-w-0 max-w-full">
            {/* Easy Mode Toggle (Accessibility Switch) */}
            <button
              onClick={toggleEasyMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-semibold transition-all cursor-pointer ${
                easyMode 
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md ring-2 ring-amber-300 scale-105' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
              title="Toggle Easy Shopping Mode (Large fonts, simple screen)"
            >
              <Sparkles className={`w-4 h-4 ${easyMode ? 'text-slate-950 animate-spin' : 'text-amber-500'}`} />
              <span className="text-xs hidden md:inline">
                {easyMode ? t('easyModeActive') : t('easyMode')}
              </span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{LANGUAGES.find(l => l.code === language)?.nativeName || 'Language'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Language / भाषा
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                        language === lang.code 
                          ? 'bg-orange-50 text-orange-700 font-bold' 
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 1-Click Help Button (Accessible directly from every screen) */}
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
              title="Open Instant Customer Care & Attendant Support"
            >
              <HelpCircle className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">{t('help')}</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 text-slate-600 hover:text-rose-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label={t('wishlist')} title={t('wishlist')}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">{t('cart')}</span>
              {cartCount > 0 && (
                <span className="bg-white text-orange-700 text-[11px] font-extrabold px-1.5 py-0.2 rounded-full ml-1">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account / Login Menu */}
            {user ? (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all cursor-pointer text-xs font-bold border border-slate-200"
                title={user.name}
              >
                <div className="w-5 h-5 rounded-full bg-orange-600 text-white font-extrabold text-[11px] flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline truncate max-w-[90px]">{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 hover:text-orange-800 font-extrabold text-xs rounded-xl border border-orange-200 transition-all cursor-pointer shadow-2xs"
                title={t('login')}
              >
                <UserIcon className="w-4 h-4 text-orange-600" />
                <span>{t('login')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
