import React from 'react';
import { Heart, ShoppingCart, Zap, Star, Volume2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    language, 
    easyMode, 
    addToCart,
    cart, 
    toggleWishlist, 
    isInWishlist, 
    setIsCartOpen, 
    setIsCheckoutOpen,
    setSelectedProductDetail,
    speakText,
    t 
  } = useApp();

  const isInCart = cart.some(item => item.product.id === product.id && item.quantity > 0);
  const isFav = isInWishlist(product.id);
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => { e.stopPropagation(); if (isInCart) { setIsCartOpen(true); return; } addToCart(product, 1, product.variants?.[0]); };

  const handleReadAloud = (e: React.MouseEvent) => {
    e.stopPropagation();
    const productName = product.name[language] || product.name.en;
    speakText(`${productName}. Price: ${product.price} rupees. Original price: ${product.mrp} rupees.`);
  };

  return (
    <div 
      onClick={() => setSelectedProductDetail(product)}
      className={`group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col cursor-pointer ${
        easyMode ? 'p-4 border-2 border-slate-300' : 'p-3'
      }`}
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 mb-3">
        <img
          src={product.imageUrl}
          alt={product.name[language] || product.name.en}
          className={`w-full h-full ${Boolean(product.sourceUrl) ? 'object-contain p-6 bg-white' : 'object-cover group-hover:scale-105'} transition-transform duration-300`}
          loading="lazy"
          onError={(e) => {
            if (!e.currentTarget.src.endsWith('/images/product-placeholder.svg')) e.currentTarget.src = '/images/product-placeholder.svg';
          }}
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-rose-600 via-pink-600 to-orange-500 text-white font-black text-[11px] px-2.5 py-0.5 rounded-lg shadow-md shadow-rose-600/20">
            {discountPercent}% demo
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
            isFav 
              ? 'bg-rose-50 text-rose-600 shadow-md' 
              : 'bg-white/80 hover:bg-white text-slate-500 hover:text-rose-600'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Read aloud icon button */}
        <button
          onClick={handleReadAloud}
          className="absolute bottom-2.5 left-2.5 p-1.5 bg-white/90 hover:bg-white text-slate-700 hover:text-orange-600 rounded-lg backdrop-blur-md shadow-xs transition-colors cursor-pointer"
          title={t('audioReadAloud')}
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>

        {/* Brand tag */}
        <span className="absolute bottom-2.5 right-2.5 bg-slate-900/75 text-white text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-xs">
          {product.brand}
        </span>
      </div>

      {/* Product Content */}
      <div className="flex-1 flex flex-col">
        {/* Rating & Review */}
        <div className="flex items-center gap-1.5 mb-1 text-xs">
          <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
            <span>{product.rating}</span>
            <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
          </div>
          <span className="text-slate-400 text-[11px]">({product.reviewCount} demo)</span>
        </div>

        {/* Primary Title in Selected Language */}
        <h3 className={`font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors ${
          easyMode ? 'text-lg mb-1' : 'text-sm mb-0.5'
        }`}>
          {product.name[language] || product.name.en}
        </h3>

        {/* English secondary title if language is not English */}
        {language !== 'en' && (
          <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
            {product.name.en}
          </p>
        )}

        {/* Price & MRP Row */}
        <div className="mt-auto pt-2 flex items-baseline gap-2">
          <span className={`font-extrabold text-slate-900 ${easyMode ? 'text-2xl' : 'text-lg'}`}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-400 line-through">
            ₹{product.mrp.toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-semibold text-emerald-600">
            Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Stock status indicator */}
        <div className="mt-1 mb-3">
          {product.stock > 20 ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              {t('inStock')}
            </span>
          ) : product.stock > 0 ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              {t('onlyLeft', { count: product.stock })}
            </span>
          ) : (
            <span className="text-[11px] text-rose-600 font-semibold">
              {t('outOfStock')}
            </span>
          )}
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 rounded-xl border border-orange-200/80 bg-orange-50/70 hover:bg-orange-100/90 text-orange-900 font-extrabold transition-all cursor-pointer hover:border-orange-400 active:scale-95 ${
              easyMode ? 'py-3 text-sm' : 'py-2 text-xs'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-orange-600" />
            <span>{t(isInCart ? 'goToCart' : 'addToCart')}</span>
          </button>

          <button
            onClick={handleBuyNow}
            className={`flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white font-black shadow-md shadow-orange-500/25 active:scale-95 transition-all cursor-pointer ${
              easyMode ? 'py-3 text-sm' : 'py-2 text-xs'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current text-yellow-200" />
            <span>{t('buyNow')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
