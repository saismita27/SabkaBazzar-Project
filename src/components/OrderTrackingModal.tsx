import React, { useEffect } from 'react';
import { 
  X, 
  Package, 
  CheckCircle, 
  Clock, 
  Truck, 
  MapPin, 
  AlertCircle, 
  Ban, 
  ShieldCheck, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderState } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const {
    isOrderTrackingOpen,
    setIsOrderTrackingOpen,
    activeTrackingOrderId,
    orders,
    cancelOrder,
    advanceOrderState,
    language,
    t
  } = useApp();

  useEffect(() => {
    if (!isOrderTrackingOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOrderTrackingOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOrderTrackingOpen, setIsOrderTrackingOpen]);

  if (!isOrderTrackingOpen) return null;

  const currentOrder = orders.find(o => o.id === activeTrackingOrderId) || orders[0];
  if (!currentOrder) return null;

  const orderStates: OrderState[] = [
    'Placed',
    'Confirmed',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  const getStateIndex = (state: OrderState) => {
    return orderStates.indexOf(state);
  };

  const currentIndex = getStateIndex(currentOrder.status);
  const isCancelled = currentOrder.status === 'Cancelled';
  const canCancel = currentOrder.status === 'Placed' || currentOrder.status === 'Confirmed';

  const handleCancel = () => {
    if (window.confirm(t('confirmCancel'))) {
      const ok = cancelOrder(currentOrder.id);
      if (ok) {
        alert(t('cancelSuccess'));
      } else {
        alert(t('cannotCancel'));
      }
    }
  };

  const handleAdvanceState = () => {
    if (currentIndex < orderStates.length - 1 && !isCancelled) {
      const nextState = orderStates[currentIndex + 1];
      advanceOrderState(currentOrder.id, nextState);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div role="dialog" aria-modal="true" aria-labelledby="order-tracking-title" className="bg-white rounded-2xl max-w-xl w-full max-h-[85dvh] min-h-0 flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="shrink-0 px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-600" />
              <h2 id="order-tracking-title" className="text-base font-extrabold text-slate-900 break-all">
                {t('orders')} • <span className="font-mono text-orange-600">{currentOrder.id}</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500">Placed on: {currentOrder.createdAt}</p>
          </div>
          <button
            aria-label="Close order details"
            onClick={() => setIsOrderTrackingOpen(false)}
            className="shrink-0 min-w-11 min-h-11 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-orange-600 p-2 text-slate-600 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div tabIndex={0} aria-label="Order details" className="min-h-0 overflow-y-auto overscroll-contain p-4 space-y-4">
          {/* Tracking State Timeline */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Order Lifecycle (State Machine)
              </span>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                isCancelled 
                  ? 'bg-rose-100 text-rose-700' 
                  : currentOrder.status === 'Delivered' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-orange-100 text-orange-800'
              }`}>
                {currentOrder.status}
              </span>
            </div>

            {isCancelled ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-sm">
                <Ban className="w-5 h-5 text-rose-600" />
                <span>This order was cancelled. Any authorized payments have been queued for refund.</span>
              </div>
            ) : (
              <div className="relative">
                {/* Horizontal Progress Line on Desktop */}
                <div className="hidden sm:block absolute top-4 left-6 right-6 h-1 bg-slate-200 -z-0">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.max(0, (currentIndex / (orderStates.length - 1)) * 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-1 text-center relative z-10">
                  {orderStates.map((st, idx) => {
                    const isDone = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;
                    return (
                      <div key={st} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isCurrent
                            ? 'bg-orange-600 text-white ring-4 ring-orange-200'
                            : isDone
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 text-slate-500'
                        }`}>
                          {isDone ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`text-[11px] mt-2 font-medium leading-tight ${
                          isCurrent ? 'font-bold text-orange-600' : isDone ? 'text-slate-800' : 'text-slate-400'
                        }`}>
                          {st}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Academic Simulation Notice */}
            <p className="text-[10px] text-slate-400 text-center mt-4">
              * Simulated logistics demonstration. State transitions are verified deterministically by the embedded state machine.
            </p>
          </div>

          {/* Admin State Advancer (For Interview & Viva Presentation) */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Interview Demo Control: Advance Order Pipeline</span>
              </div>
              <p className="text-[11px] text-amber-700">
                Click below to demonstrate live state machine transitions for interviewers.
              </p>
            </div>

            <button
              onClick={handleAdvanceState}
              disabled={currentIndex >= orderStates.length - 1 || isCancelled}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Advance Next Stage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Items In This Order */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Purchased Items
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between bg-white text-xs">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name.en} 
                      className="w-12 h-12 object-cover rounded-lg bg-slate-100" 
                    />
                    <div>
                      <div className="font-bold text-slate-900">{item.product.name[language] || item.product.name.en}</div>
                      <div className="text-slate-500">Qty: {item.quantity} • {item.product.unit}</div>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address & Cost Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Delivery Address:</span>
              <p className="text-slate-600">
                {currentOrder.shippingAddress.fullName} ({currentOrder.shippingAddress.mobile})<br />
                {currentOrder.shippingAddress.addressLine}, {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pincode}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal:</span>
                <span>₹{currentOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GST:</span>
                <span>₹{currentOrder.gst}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery:</span>
                <span>{currentOrder.deliveryFee === 0 ? 'FREE' : `₹${currentOrder.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>Total:</span>
                <span className="text-orange-600">₹{currentOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Cancellation Control (Protected State Transition) */}
          <div className="pt-2 flex items-center justify-between">
            {canCancel && !isCancelled && (
              <button
                onClick={handleCancel}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors cursor-pointer"
              >
                {t('cancelOrder')}
              </button>
            )}
            <span className="text-[11px] text-slate-400 ml-auto">
              Eligible for cancellation during 'Placed' and 'Confirmed' only.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
