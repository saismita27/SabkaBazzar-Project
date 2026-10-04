import React, { useMemo, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { EasyModeBanner } from './components/EasyModeBanner';
import { CategoryNav } from './components/CategoryNav';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistModal } from './components/WishlistModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CustomerCareModal } from './components/CustomerCareModal';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { LinuxDriverExplorer } from './components/LinuxDriverExplorer';
import { AdminPortalModal } from './components/AdminPortalModal';
import { AuthModal } from './components/AuthModal';
import { KioskOsExplainerModal } from './components/KioskOsExplainerModal';
import { PRODUCTS } from './data/products';
import { 
  Sparkles, 
  Terminal, 
  ShieldCheck, 
  Search, 
  Mic, 
  Layers, 
  Volume2, 
  HelpCircle, 
  Tag,
  Cpu,
  Info,
  Truck,
  CheckCircle2,
  Zap,
  ArrowRight
} from 'lucide-react';

const MainContent: React.FC = () => {
  const [isKioskExplainerOpen, setIsKioskExplainerOpen] = useState(false);
  const { 
    language, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory,
    setSelectedCategory, 
    selectedSubCategory,
    setSelectedSubCategory,
    easyMode, 
    setIsLinuxInspectorOpen, 
    setIsVoiceModalOpen,
    setIsHelpModalOpen,
    setIsAdminOpen,
    triggerSimulatedKioskEvent,
    t 
  } = useApp();

  // Search & Filtering Engine with Vernacular Alias Matching
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;

    if (selectedCategory) {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    if (selectedSubCategory) {
      result = result.filter(p => p.subCategory === selectedSubCategory);
    }

    if (searchQuery.trim()) {
      const normalize = (text: string) => text.normalize('NFKC').toLowerCase().trim().replace(/\s+/g, ' ');
      const q = normalize(searchQuery);

      // Score matching products
      const scored = result.map(p => {
        let score = 0;

        // Check vernacular aliases
        if (p.aliases) {
          for (const alias of p.aliases) {
            const aliasTerm = normalize(alias.term);
            if (aliasTerm === q) {
              score = Math.max(score, 100); // Exact alias match gets top priority
            } else if (aliasTerm.includes(q)) {
              score = Math.max(score, 70);
            }
          }
        }

        // Check local language name
        const localName = (p.name[language] || '').toLowerCase();
        if (localName.includes(q)) {
          score = Math.max(score, 80);
        }

        // Check English name
        const engName = p.name.en.toLowerCase();
        if (engName.includes(q)) {
          score = Math.max(score, 75);
        }

        // Check category / brand
        if (p.brand.toLowerCase().includes(q)) {
          score = Math.max(score, 50);
        }

        return { product: p, score };
      });

      return scored
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.product);
    }

    return result;
  }, [selectedCategory, selectedSubCategory, searchQuery, language]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header /><div className="bg-amber-50 text-amber-950 text-xs text-center px-4 py-2 border-b border-amber-200">Training demo: browser-local profiles, orders and support. Sample prices and ratings are unverified. No real payments or deliveries.</div>
      <EasyModeBanner />
      <CategoryNav />

      {/* Compact shopping welcome */}
      {!searchQuery && !selectedCategory && (
        <section aria-label="Welcome to Sabka Bazaar" className="bg-[#fff7ed] border-b border-orange-100 px-4 sm:px-6 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-6 lg:gap-12">
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-[0.16em] uppercase text-orange-700 mb-3">Apni pasand. Apni bhasha.</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-slate-900">Where every family<br />finds its favourites</h1>
              <p className="text-sm text-slate-600 leading-relaxed mt-3 max-w-md">From daily essentials to little celebrations — sabke liye, sab kuch</p>
              <div className="flex flex-wrap gap-3 mt-5">
                <a href="#catalogue" className="inline-flex items-center gap-2 rounded-full bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">Explore the collection <ArrowRight className="w-4 h-4" /></a>
                <button onClick={() => setIsVoiceModalOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white hover:bg-orange-50 text-orange-900 px-4 py-3 text-sm font-semibold cursor-pointer"><Mic className="w-4 h-4" />{t('voiceSearch')}</button>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-500">
                <span>Try a familiar name:</span>
                {['tej patta', 'haldi', 'kurta'].map(term => <button key={term} onClick={() => setSearchQuery(term)} className="px-3 py-1.5 rounded-full border border-orange-200 text-slate-700 bg-white hover:border-orange-500 cursor-pointer">{term}</button>)}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3" aria-label="Explore departments">
              {[
                { category: 'cat-grocery', label: 'Everyday essentials', short: 'Grocery', color: 'bg-[#eef3e7]' },
                { category: 'cat-fashion', label: 'Find your style', short: 'Fashion', color: 'bg-[#fcece5]' },
                { category: 'cat-mobiles', label: 'Your next upgrade', short: 'Mobiles', color: 'bg-[#e9eff7]' }
              ].map(tile => {
                const product = PRODUCTS.find(p => p.categoryId === tile.category);
                return <button key={tile.category} onClick={() => { setSelectedSubCategory(null); setSelectedCategory(tile.category); }} className={`${tile.color} min-w-0 rounded-2xl p-3 sm:p-4 text-left border border-white shadow-sm hover:shadow-md transition-shadow cursor-pointer focus-visible:outline-2 focus-visible:outline-orange-600`}>
                  <span className="block text-[10px] sm:text-xs text-slate-600 mb-2">{tile.label}</span>
                  {product && <img src={product.imageUrl} alt={product.name.en} className="w-full h-28 sm:h-40 object-contain rounded-xl bg-white p-2" />}
                  <span className="mt-3 flex flex-wrap items-center justify-between gap-1 text-xs sm:text-sm font-bold text-slate-900">{tile.short}<ArrowRight className="w-4 h-4" /></span>
                </button>;
              })}
            </div>
          </div>
        </section>
      )}

      {/* Main Catalog Section */}
      <main id="catalogue" className="scroll-mt-64 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              {searchQuery ? (
                <span>Search results for: <span className="bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent font-black">"{searchQuery}"</span></span>
              ) : selectedSubCategory ? (
                <span>Showing <span className="bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent font-black">{selectedSubCategory}</span></span>
              ) : selectedCategory ? (
                <span>Showing items in selected category</span>
              ) : (
                <span>{t('featuredProducts')}</span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredProducts.length} sample products with demo stock
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedSubCategory && (
              <button
                onClick={() => setSelectedSubCategory(null)}
                className="text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg font-medium cursor-pointer"
              >
                Clear Sub-category
              </button>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-orange-600 font-bold hover:underline cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          /* Graceful Fallback with Category Top Recommendations */
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl flex items-center justify-center font-bold flex-shrink-0 shadow-md">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    No direct matches for this specific filter
                  </h3>
                  <p className="text-xs text-slate-600">
                    Showing top trending verified products in the catalog instead.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {selectedSubCategory && (
                  <button
                    onClick={() => setSelectedSubCategory(null)}
                    className="px-4 py-2 bg-white text-slate-800 border border-slate-300 hover:border-orange-500 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSubCategory(null);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl text-xs font-extrabold shadow-sm cursor-pointer hover:from-orange-500 hover:to-amber-500"
                >
                  Show All Products
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {PRODUCTS.slice(0, 12).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-white font-extrabold text-sm mb-2">
              <span className="w-6 h-6 rounded-md bg-orange-600 flex items-center justify-center text-white text-xs">स</span>
              <span>Sabka Bazzar</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              “Ghar mein generations chaar, pasand ke rang hazaar — sabki shopping ka ek thikana, Sabka Bazaar!” Accessible multilingual Indian commerce platform & embedded Linux subsystem.
            </p>
            <div className="text-[10px] text-slate-500">
              C++17 • Linux VFS • poll() • wait_queue_head_t
            </div>
          </div>

          <div>
            <a href="/photo-credits.html" target="_blank" rel="noreferrer" className="underline">Product photo credits</a><h4 className="text-white font-bold mb-2">Supported Indian Languages</h4>
            <ul className="space-y-1 text-[11px]">
              <li>हिन्दी (Hindi) • ଓଡ଼ିଆ (Odia)</li>
              <li>मराठी (Marathi) • বাংলা (Bengali)</li>
              <li>தமிழ் (Tamil) • తెలుగు (Telugu)</li>
              <li>ગુજરાતી (Gujarati) • English</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-2">Embedded Linux Architecture</h4>
            <ul className="space-y-1 text-[11px]">
              <li>• Character Device Driver (/dev/sabka_help)</li>
              <li>• POSIX poll() non-blocking I/O event waiter</li>
              <li>• copy_to_user() kernel-userspace boundary</li>
              <li>• Write-triggered simulated events</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-2">Academic & Admin Tools</h4>
            <div className="space-y-2">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="w-full text-left px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Store Admin Portal & Orders
              </button>
              <button
                onClick={() => setIsKioskExplainerOpen(true)}
                className="w-full text-left px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-semibold cursor-pointer"
              >
                What is Kiosk OS? (कियोस्क क्या है?)
              </button>
              <button
                onClick={() => setIsLinuxInspectorOpen(true)}
                className="w-full text-left px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-orange-400 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Linux Architecture & Viva Defense
              </button>
              <button
                onClick={() => triggerSimulatedKioskEvent('FOOTER_TRIGGER')}
                className="w-full text-left px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-lg text-xs font-semibold cursor-pointer flex items-center justify-between"
              >
                <span>Simulate Kiosk Hardware Help</span>
                <span className="text-[10px] bg-rose-900/60 text-rose-200 px-1.5 py-0.5 rounded">SIMULATED</span>
              </button>
              <button
                onClick={() => setIsHelpModalOpen(true)}
                className="w-full text-left px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold cursor-pointer"
              >
                1-Click Customer Care Desk
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Sabka Bazzar. Final Year B.Tech CSIT Embedded Linux Project.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-medium">Training Prototype</span>
            <span>Driver testing outstanding</span>
          </div>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <ProductModal />
      <CartDrawer />
      <WishlistModal />
      <CheckoutModal />
      <OrderTrackingModal />
      <CustomerCareModal />
      <VoiceSearchModal />
      <LinuxDriverExplorer />
      <AdminPortalModal />
      <AuthModal />
      <KioskOsExplainerModal isOpen={isKioskExplainerOpen} onClose={() => setIsKioskExplainerOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
