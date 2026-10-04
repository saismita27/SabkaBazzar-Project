import { useCppStore, cppEnabled } from '../backend/useCppStore';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  LanguageCode, 
  Product, 
  CartItem, 
  Order, 
  OrderState, 
  Address, 
  SupportTicket, 
  User, 
  KioskHardwareEvent 
} from '../types';
import { PRODUCTS } from '../data/products';
import { TRANSLATIONS } from '../data/translations';

interface AppContextType {
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  easyMode: boolean;
  toggleEasyMode: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  selectedSubCategory: string | null;
  setSelectedSubCategory: (sub: string | null) => void;
  
  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  removeFromCart: (productId: string, variant?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartGst: number;
  cartDeliveryFee: number;
  cartTotal: number;

  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (shippingAddress: Address, paymentMethod: 'COD' | 'UPI' | 'Card', idempotencyToken: string) => Promise<Order>;
  cancelOrder: (orderId: string) => boolean | Promise<boolean>;
  advanceOrderState: (orderId: string, nextState: OrderState) => void;

  // User & Address
  user: User | null;
  loginUser: (name: string, phone: string, email: string) => void;
  logoutUser: () => void;
  addresses: Address[];
  addAddress: (addr: Address) => void;

  // Support
  supportTickets: SupportTicket[];
  createSupportTicket: (type: SupportTicket['type'], subject: string, message: string, orderId?: string) => void;
  replySupportTicket: (ticketId: string, reply: string) => void;

  // Kiosk Device Driver & Hardware
  kioskHardwareEvent: KioskHardwareEvent | null;
  triggerSimulatedKioskEvent: (source?: string) => void;
  dismissKioskHardwareEvent: () => void;

  // Modals & Panels
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  isOrderTrackingOpen: boolean;
  setIsOrderTrackingOpen: (open: boolean) => void;
  activeTrackingOrderId: string | null;
  openOrderTracking: (orderId: string) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isLinuxInspectorOpen: boolean;
  setIsLinuxInspectorOpen: (open: boolean) => void;
  selectedProductDetail: Product | null;
  setSelectedProductDetail: (p: Product | null) => void;

  // Helpers
  speakText: (text: string) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Browser-local demo storage; this is not an authentication boundary.
const storage = {
  getItem(key: string): string | null { try { return localStorage.getItem('fixed_v1_' + key); } catch { return null; } },
  setItem(key: string, value: string) { try { localStorage.setItem('fixed_v1_' + key, value); } catch { /* Continue in memory when storage is unavailable. */ } },
  removeItem(key: string) { try { localStorage.removeItem('fixed_v1_' + key); } catch {} }
};
function savedArray<T>(key: string): T[] {
  try { const value = JSON.parse(storage.getItem(key) || '[]'); return Array.isArray(value) ? value : []; } catch { return []; }
}
const INITIAL_ORDERS: Order[] = [];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = storage.getItem('sb_lang');
    return saved && Object.hasOwn(TRANSLATIONS, saved) ? saved as LanguageCode : 'en';
  });

  const [selectedState, setSelectedState] = useState<string>(() => {
    return storage.getItem('sb_state') || 'Odisha';
  });

  const [easyMode, setEasyMode] = useState<boolean>(() => {
    return storage.getItem('sb_easymode') === 'true';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategoryState] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  const setSelectedCategory = (cat: string | null) => {
    setSelectedCategoryState(cat);
    setSelectedSubCategory(null); // Reset subcategory when category changes
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = storage.getItem('sb_cart');
      return saved && Array.isArray(JSON.parse(saved)) ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = storage.getItem('sb_wishlist');
      return saved && Array.isArray(JSON.parse(saved)) ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = storage.getItem('sb_orders');
      return saved && Array.isArray(JSON.parse(saved)) ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // User (defaults to guest until logged in)
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = storage.getItem('sb_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [addresses, setAddresses] = useState<Address[]>(() => savedArray<Address>('sb_addresses'));

  // Support
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => savedArray<SupportTicket>('sb_tickets'));
  const checkoutResults = useRef(new Map<string, Order>());
  useEffect(() => storage.setItem('sb_addresses', JSON.stringify(addresses)), [addresses]);
  useEffect(() => storage.setItem('sb_tickets', JSON.stringify(supportTickets)), [supportTickets]);

  // Kiosk Hardware
  const [kioskHardwareEvent, setKioskHardwareEvent] = useState<KioskHardwareEvent | null>(null);

  // Modals
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  // Auto-open Login page on app open if user is not logged in
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(() => {
    try {
      const savedUser = storage.getItem('sb_user');
      if (savedUser) return false;
      const loginLater = sessionStorage.getItem('sb_login_later');
      return loginLater !== 'true';
    } catch {
      return true;
    }
  });
  const [isLinuxInspectorOpen, setIsLinuxInspectorOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // Persist state
  useEffect(() => {
    if (user) {
      storage.setItem('sb_user', JSON.stringify(user));
    } else {
      storage.removeItem('sb_user');
    }
  }, [user]);

  // Persist state
  useEffect(() => {
    storage.setItem('sb_lang', language);
  }, [language]);

  useEffect(() => {
    storage.setItem('sb_state', selectedState);
  }, [selectedState]);

  useEffect(() => {
    storage.setItem('sb_easymode', String(easyMode));
  }, [easyMode]);

  useEffect(() => {
    storage.setItem('sb_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    storage.setItem('sb_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    storage.setItem('sb_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (user) {
      storage.setItem('sb_user', JSON.stringify(user));
    } else {
      storage.removeItem('sb_user');
    }
  }, [user]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const toggleEasyMode = () => {
    setEasyMode(prev => !prev);
  };

  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedVariant === variant);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map(item => 
          item.product.id === product.id && item.selectedVariant === variant
            ? { ...item, quantity: newQty }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock), selectedVariant: variant }];
    });
  };

  const updateQuantity = (productId: string, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedVariant === variant) {
        return { ...item, quantity: Math.min(quantity, item.product.stock) };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string, variant?: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedVariant === variant)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  // Cart Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartGst = Math.round(cartSubtotal * 0.05); // Illustrative demo tax, not a verified tax schedule.
  const cartDeliveryFee = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 40;
  const cartTotal = cartSubtotal + cartGst + cartDeliveryFee;

  // Place Order
  const placeOrder = async (
    shippingAddress: Address, 
    paymentMethod: 'COD' | 'UPI' | 'Card', 
    idempotencyToken: string
  ): Promise<Order> => {
    // Check for duplicate token
    const existing = checkoutResults.current.get(idempotencyToken) || orders.find(o => o.idempotencyToken === idempotencyToken);
    if (existing) {
      return existing;
    }

    if (!cart.length) throw new Error('Your cart is empty.');
    if (!shippingAddress.fullName.trim() || !shippingAddress.addressLine.trim() || !shippingAddress.city.trim() || !/^\d{6}$/.test(shippingAddress.pincode) || !/^\d{10}$/.test(shippingAddress.mobile)) {
      throw new Error('Enter a name, address, city, 6-digit PIN and 10-digit demo mobile number.');
    }
    const quantities = new Map<string, number>();
    for (const item of cart) {
      const total = (quantities.get(item.product.id) || 0) + item.quantity;
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || total > item.product.stock) throw new Error('Quantity exceeds available demo stock.');
      quantities.set(item.product.id, total);
    }
    const orderId = `SB-ORD-${crypto.randomUUID()}`;
    const nowStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newOrder: Order = {
      id: orderId,
      userId: user?.id || 'guest-1',
      items: [...cart],
      subtotal: cartSubtotal,
      gst: cartGst,
      deliveryFee: cartDeliveryFee,
      discount: 0,
      total: cartTotal,
      status: 'Placed',
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      shippingAddress,
      idempotencyToken,
      createdAt: nowStr,
      timeline: [
        {
          status: 'Placed',
          timestamp: nowStr,
          note: 'Order successfully registered in Sabka Bazzar system'
        }
      ]
    };

    checkoutResults.current.set(idempotencyToken, newOrder);
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const cancelOrder = (orderId: string): boolean => {
    const target = orders.find(o => o.id === orderId);
    if (!target) return false;

    // Cancellation guard: only allowed in 'Placed' or 'Confirmed'
    if (target.status !== 'Placed' && target.status !== 'Confirmed') {
      return false;
    }

    const nowStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Cancelled',
          timeline: [
            ...o.timeline,
            { status: 'Cancelled', timestamp: nowStr, note: 'Order cancelled by customer request' }
          ]
        };
      }
      return o;
    }));
    return true;
  };

  const advanceOrderState = (orderId: string, nextState: OrderState) => {
    const nowStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    setOrders(prev => prev.map(o => {
      const flow: OrderState[] = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
      if (o.id === orderId && flow.indexOf(o.status) >= 0 && flow[flow.indexOf(o.status) + 1] === nextState) {
        return {
          ...o,
          status: nextState,
          timeline: [
            ...o.timeline,
            { status: nextState, timestamp: nowStr, note: `Lifecycle advanced to ${nextState}` }
          ]
        };
      }
      return o;
    }));
  };

  const loginUser = (name: string, phone: string, email: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      phone,
      email,
      preferredLanguage: language,
      selectedState,
      role: 'customer'
    };
    setUser(newUser);
  };

  const logoutUser = () => {
    setUser(null);
    setCart([]); setWishlist([]); setOrders([]); setAddresses([]); setSupportTickets([]); checkoutResults.current.clear();
    try {
      storage.removeItem('sb_user');
      sessionStorage.removeItem('sb_login_later');
    } catch {}
  };

  const addAddress = (addr: Address) => {
    setAddresses(prev => [addr, ...prev]);
  };

  const createSupportTicket = (type: SupportTicket['type'], subject: string, message: string, orderId?: string) => {
    const newTicket: SupportTicket = {
      id: `TCK-${crypto.randomUUID()}`,
      userId: user?.id || 'guest',
      orderId,
      type,
      subject,
      message,
      status: 'Open',
      createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
    setSupportTickets(prev => [newTicket, ...prev]);
  };

  const replySupportTicket = (ticketId: string, reply: string) => {
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'In Progress',
          adminReply: reply
        };
      }
      return t;
    }));
  };

  // Hardware Button Trigger Simulation
  const triggerSimulatedKioskEvent = (source = 'BROWSER_SIMULATOR') => {
    if (cppEnabled) cppStore.pairKiosk();
    const evt: KioskHardwareEvent = {
      eventId: Date.now(),
      kioskId: 101,
      timestamp: new Date().toISOString(),
      source,
      rawPayload: 'SIMULATED_HELP_REQUEST',
      handled: false
    };
    setKioskHardwareEvent(evt);
    setIsHelpModalOpen(true);

    // Audio chime cue
    speakText('Help requested at kiosk. Attendant assistance panel is now open.');
  };

  const dismissKioskHardwareEvent = () => {
    setKioskHardwareEvent(null);
  };

  const openOrderTracking = (orderId: string) => {
    setActiveTrackingOrderId(orderId);
    setIsOrderTrackingOpen(true);
  };

  // Speech Synthesizer
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'hi') utterance.lang = 'hi-IN';
      else if (language === 'or') utterance.lang = 'or-IN';
      else if (language === 'bn') utterance.lang = 'bn-IN';
      else if (language === 'ta') utterance.lang = 'ta-IN';
      else if (language === 'te') utterance.lang = 'te-IN';
      else if (language === 'gu') utterance.lang = 'gu-IN';
      else if (language === 'mr') utterance.lang = 'mr-IN';
      else utterance.lang = 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Translation helper
  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let text = dict[key] || TRANSLATIONS.en[key] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  };

  const cppStore = useCppStore(language, selectedState, event => {setKioskHardwareEvent(event);setIsHelpModalOpen(true);});
  return (
    <AppContext.Provider
      value={{
        isWishlistOpen, setIsWishlistOpen,
        language,
        setLanguage,
        selectedState,
        setSelectedState,
        easyMode,
        toggleEasyMode,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSubCategory,
        setSelectedSubCategory,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartGst,
        cartDeliveryFee,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        placeOrder,
        cancelOrder,
        advanceOrderState,
        user,
        loginUser,
        logoutUser,
        addresses,
        addAddress,
        supportTickets,
        createSupportTicket,
        replySupportTicket,
        kioskHardwareEvent,
        triggerSimulatedKioskEvent,
        dismissKioskHardwareEvent,
        isHelpModalOpen,
        setIsHelpModalOpen,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        isOrderTrackingOpen,
        setIsOrderTrackingOpen,
        activeTrackingOrderId,
        openOrderTracking,
        isAdminOpen,
        setIsAdminOpen,
        isAuthOpen,
        setIsAuthOpen,
        isLinuxInspectorOpen,
        setIsLinuxInspectorOpen,
        selectedProductDetail,
        setSelectedProductDetail,
        speakText,
        t, ...(cppEnabled ? cppStore : {})
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
