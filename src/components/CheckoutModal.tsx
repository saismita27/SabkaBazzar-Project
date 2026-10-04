import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  CreditCard, 
  Banknote, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Address } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    cartSubtotal,
    cartGst,
    cartDeliveryFee,
    addresses,
    addAddress,
    placeOrder,
    openOrderTracking,
    selectedState,
    t
  } = useApp();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || 'addr-new');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'Card'>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string>('');
  const [placedTotal, setPlacedTotal] = useState(0);

  const token = useRef(crypto.randomUUID());
  const submitting = useRef(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (isCheckoutOpen) { token.current = crypto.randomUUID(); setIsSuccess(false); setError(''); }
  }, [isCheckoutOpen]);

  // New address state
  const [showNewAddressForm, setShowNewAddressForm] = useState(addresses.length === 0);
  const [fullName, setFullName] = useState('Demo shopper');
  const [mobile, setMobile] = useState('0000000000');
  const [addressLine, setAddressLine] = useState('Demo address - no delivery');
  const [city, setCity] = useState('Bhubaneswar');
  const [pincode, setPincode] = useState('751007');

  if (!isCheckoutOpen) return null;

  const handleCreateOrder = async () => {
    if (submitting.current) return;
    submitting.current = true; setError('');
    setIsSubmitting(true);

    let finalAddress: Address;
    if (showNewAddressForm || !addresses.find(a => a.id === selectedAddressId)) {
      finalAddress = {
        id: `addr-${Date.now()}`,
        fullName,
        mobile,
        addressLine,
        city,
        state: selectedState,
        pincode
      };

    } else {
      finalAddress = addresses.find(a => a.id === selectedAddressId)!;
    }

    // Generate unique Idempotency Token
    const idempotencyToken = token.current;

    try {
      const order = await placeOrder(finalAddress, paymentMethod, idempotencyToken);
      if (!addresses.some(a => a.id === finalAddress.id)) addAddress(finalAddress);
      setPlacedOrderId(order.id);
      setPlacedTotal(order.total);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place demo order.');
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setIsCheckoutOpen(false);
    setIsSuccess(false);
    if (placedOrderId) {
      openOrderTracking(placedOrderId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-extrabold text-slate-900">{t('checkout')}</h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <p role="alert" className="p-4 text-rose-700 bg-rose-50">{error}</p>}
        {isSuccess ? (
          /* Order Confirmation View */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
              {t('orderSuccess')}
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Your simulated order is saved in this browser. No payment, dispatch or delivery takes place.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto mb-6 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('orderId')}:</span>
                <span className="font-mono font-bold text-slate-900">{placedOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment:</span>
                <span className="font-semibold text-slate-800">{paymentMethod} (Demonstration)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Paid/Payable:</span>
                <span className="font-extrabold text-orange-600 text-sm">₹{placedTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full max-w-md mx-auto py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>{t('trackOrder')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Multi-step Checkout Form */
          <div className="p-6 space-y-6">
            {/* Step 1: Address Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>1. {t('deliveryAddress')}</span>
                </h3>
                {addresses.length > 0 && (
                  <button
                    onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                    className="text-xs text-orange-600 font-semibold hover:underline cursor-pointer"
                  >
                    {showNewAddressForm ? 'Select Saved Address' : '+ Add New Address'}
                  </button>
                )}
              </div>

              {showNewAddressForm ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Mobile Number</label>
                    <input
                      type="text"
                      value={mobile}
                      onChange={e => setMobile(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-medium mb-1">House / Street / Locality</label>
                    <input
                      type="text"
                      value={addressLine}
                      onChange={e => setAddressLine(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={e => setPincode(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                        selectedAddressId === addr.id
                          ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="addressRadio"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-0.5 text-orange-600 focus:ring-orange-500"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{addr.fullName} • {addr.mobile}</div>
                        <div className="text-slate-600">{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Payment Method */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-orange-600" />
                <span>2. {t('paymentMethod')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'COD'
                      ? 'border-orange-500 bg-orange-50/50 shadow-xs ring-1 ring-orange-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <input
                      type="radio"
                      name="paymentRadio"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Cash on Delivery</div>
                    <div className="text-[10px] text-slate-500">Pay cash upon delivery</div>
                  </div>
                </div>

                {/* UPI QR */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'UPI'
                      ? 'border-orange-500 bg-orange-50/50 shadow-xs ring-1 ring-orange-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <QrCode className="w-5 h-5 text-indigo-600" />
                    <input
                      type="radio"
                      name="paymentRadio"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">UPI / QR Code</div>
                    <div className="text-[10px] text-slate-500">PhonePe, GPay, Paytm (Demo)</div>
                  </div>
                </div>

                {/* RuPay / Debit Card */}
                <div
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'Card'
                      ? 'border-orange-500 bg-orange-50/50 shadow-xs ring-1 ring-orange-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="w-5 h-5 text-sky-600" />
                    <input
                      type="radio"
                      name="paymentRadio"
                      checked={paymentMethod === 'Card'}
                      onChange={() => setPaymentMethod('Card')}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">RuPay / Debit Card</div>
                    <div className="text-[10px] text-slate-500">Zero surcharge (Demo)</div>
                  </div>
                </div>
              </div>

              {/* Simulation Disclaimer Label */}
              <div className="flex items-center gap-2 mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Academic Demonstration Notice:</strong> No real bank credentials or card numbers are collected. This browser-only checkout prevents repeated clicks; it is not a server transaction.
                </span>
              </div>
            </div>

            {/* Step 3: Order Summary & Place Button */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center text-sm font-bold text-slate-900 mb-2">
                <span>Total Amount to Pay:</span>
                <span className="text-xl text-orange-600 font-extrabold">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={handleCreateOrder}
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
              >
                {isSubmitting ? (
                  <span>Processing Transaction...</span>
                ) : (
                  <>
                    <span>{t('placeOrder')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
