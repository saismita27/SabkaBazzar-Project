import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  ShoppingCart, 
  Zap, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Volume2, 
  Heart,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProductModal: React.FC = () => {
  const { 
    selectedProductDetail, 
    setSelectedProductDetail, 
    language, 
    easyMode, 
    addToCart,
    cart, 
    toggleWishlist, 
    isInWishlist, 
    setIsCheckoutOpen,
    setIsCartOpen,
    selectedState,
    speakText,
    t 
  } = useApp();

  const [variant, setVariant] = useState<string | undefined>();
  useEffect(() => setVariant(selectedProductDetail?.variants?.[0]), [selectedProductDetail]);
  if (!selectedProductDetail) return null;
  const p = selectedProductDetail;
  const isInCart = cart.some(item => item.product.id === p.id && (item.selectedVariant || undefined) === variant && item.quantity > 0);
  const isFav = isInWishlist(p.id);
  const discountPercent = Math.round(((p.mrp - p.price) / p.mrp) * 100);

  const handleBuyNow = () => {
    addToCart(p, 1, variant);
    setSelectedProductDetail(null);
    setIsCheckoutOpen(true);
  };

  const handleAddToCart = () => { if (isInCart) { setSelectedProductDetail(null); setIsCartOpen(true); return; } addToCart(p, 1, variant); };

  const handleSpeak = () => {
    const desc = p.description[language] || p.description.en;
    speakText(`${p.name[language] || p.name.en}. ${desc}. Price is ${p.price} rupees.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              {p.brand}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">{p.unit}</span>
          </div>
          <button
            onClick={() => setSelectedProductDetail(null)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Image & Thumbnails */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={p.imageUrl}
                alt={p.name[language] || p.name.en}
                className={`w-full h-full ${Boolean(p.sourceUrl) ? 'object-contain p-8 bg-white' : 'object-cover'}`}
                onError={(e) => {
                  if (!e.currentTarget.src.endsWith('/images/product-placeholder.svg')) e.currentTarget.src = '/images/product-placeholder.svg';
                }}
              />
              <button
                onClick={() => toggleWishlist(p)}
                className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 shadow-md text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>
            </div>

            {/* Local Vernacular Aliases Card */}
            {p.aliases && p.aliases.length > 0 && (
              <div className="mt-4 p-3.5 bg-orange-50/70 border border-orange-200 rounded-2xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-800 mb-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Vernacular Names / स्थानीय प्रचलित नाम:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.aliases.map((a, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs bg-white text-orange-950 font-medium px-2 py-0.5 rounded-md border border-orange-200/60 shadow-2xs"
                    >
                      {a.term}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Details & Buying options */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-200 text-xs">
                <span>{p.rating}</span>
                <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              </div>
              <span className="text-xs text-slate-500 font-medium">{p.reviewCount} sample reviews (unverified)</span>
              <button
                onClick={handleSpeak}
                className="ml-auto flex items-center gap-1 text-xs text-orange-600 hover:underline font-semibold cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>{t('audioReadAloud')}</span>
              </button>
            </div>

            <h2 className={`font-extrabold text-slate-900 leading-snug mb-1 ${easyMode ? 'text-2xl' : 'text-xl'}`}>
              {p.name[language] || p.name.en}
            </h2>
            {language !== 'en' && (
              <p className="text-xs text-slate-500 mb-3">{p.name.en}</p>
            )}

            {/* Pricing Section */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 mb-4">
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-extrabold text-slate-900">
                  ₹{p.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-slate-400 line-through">
                  ₹{p.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-black text-white bg-gradient-to-r from-rose-600 to-orange-500 px-2.5 py-0.5 rounded-lg shadow-2xs">
                  {discountPercent}% OFF
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Demo tax is added at checkout. Simulated delivery fee waived for <strong>{selectedState}</strong> on orders above ₹499.
              </p>
            </div>

            {p.sourceUrl && (
  <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-block mb-4 text-sm font-semibold text-orange-700 underline focus-visible:outline-2 focus-visible:outline-orange-600">
    Product &amp; packaging reference ↗
  </a>
)}
{/* Description */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Description / विवरण
              </h4>
              <p className={`text-slate-600 leading-relaxed ${easyMode ? 'text-base font-medium' : 'text-sm'}`}>
                {p.description[language] || p.description.en}
              </p>
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center text-[11px] text-slate-600 mb-4">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-orange-600" />
                <span>Mock Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-orange-600" />
                <span>Returns Not Implemented</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                <span>Sample Product</span>
              </div>
            </div>

            {/* Action CTAs */}
            {p.variants?.length ? <label className="block mb-4 text-sm">Choose variant
              <select aria-label="Choose variant" value={variant || ''} onChange={e => setVariant(e.target.value)} className="block w-full p-2 border rounded-lg">
                {p.variants.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </label> : null}
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-bold transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{t(isInCart ? 'goToCart' : 'addToCart')}</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white font-black shadow-md shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current text-yellow-200" />
                <span>{t('buyNow')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
