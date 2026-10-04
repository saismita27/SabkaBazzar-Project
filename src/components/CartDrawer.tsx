import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartGst,
    cartDeliveryFee,
    cartTotal,
    setIsCheckoutOpen,
    language,
    easyMode,
    t
  } = useApp();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 499;
  const amountNeeded = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const deliveryProgress = Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-extrabold text-slate-900">
              {t('cart')} ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Meter */}
        <div className="bg-amber-50/70 border-b border-amber-200/60 px-6 py-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-orange-600" />
              {amountNeeded === 0 ? (
                <span className="text-emerald-700 font-bold">You unlocked FREE Delivery! 🎉</span>
              ) : (
                <span>Add <strong>₹{amountNeeded}</strong> more for <strong>FREE Delivery</strong></span>
              )}
            </span>
            <span className="text-[11px] font-bold text-slate-500">{Math.round(deliveryProgress)}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${amountNeeded === 0 ? 'bg-emerald-500' : 'bg-orange-500'}`} 
              style={{ width: `${deliveryProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{t('emptyCart')}</h3>
              <p className="text-xs text-slate-500 mb-6">Discover thousands of groceries, fashion and electronics at great prices.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-sm cursor-pointer"
              >
                {t('emptyCartAction')}
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const p = item.product;
              return (
                <div 
                  key={`${p.id}-${item.selectedVariant || ''}`}
                  className="flex gap-3.5 p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name[language] || p.name.en}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className={`font-bold text-slate-900 line-clamp-1 ${easyMode ? 'text-base' : 'text-sm'}`}>
                        {p.name[language] || p.name.en}
                      </h4>
                      <p className="text-xs text-slate-500">{p.unit}</p>
                      {item.selectedVariant && <p className="text-xs text-slate-600">Variant: {item.selectedVariant}</p>}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-extrabold text-slate-900 text-sm">
                        ₹{(p.price * item.quantity).toLocaleString('en-IN')}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                        <button
                          onClick={() => updateQuantity(p.id, item.quantity - 1, item.selectedVariant)}
                          className="p-1 hover:bg-white rounded text-slate-600 cursor-pointer transition-colors"
                          title="Decrease quantity"
                        >
                          {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-600" /> : <Minus className="w-3.5 h-3.5" />}
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(p.id, item.quantity + 1, item.selectedVariant)}
                          disabled={item.quantity >= p.stock}
                          className="p-1 hover:bg-white rounded text-slate-600 disabled:opacity-40 cursor-pointer transition-colors"
                          title="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bill Summary & Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <div className="space-y-2 text-xs text-slate-600 mb-4">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-medium text-slate-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('gst')}</span>
                <span className="font-medium text-slate-900">₹{cartGst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('deliveryFee')}</span>
                {cartDeliveryFee === 0 ? (
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">{t('freeDelivery')}</span>
                ) : (
                  <span className="font-medium text-slate-900">₹{cartDeliveryFee}</span>
                )}
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                <span>{t('totalPayable')}</span>
                <span className="text-lg text-orange-600">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-2xl shadow-md flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
            >
              <span>{t('proceedToCheckout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('safeAndSecure')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
