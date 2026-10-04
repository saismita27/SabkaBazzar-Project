import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  MessageSquare, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  Send,
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { OrderState, Product } from '../types';

export const AdminPortalModal: React.FC = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    orders, 
    advanceOrderState, 
    supportTickets, 
    replySupportTicket,
    openOrderTracking,
    language 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'tickets'>('orders');
  const [ticketReplies, setTicketReplies] = useState<Record<string, string>>({});
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempStock, setTempStock] = useState<number>(0);

  if (!isAdminOpen) return null;

  const handleStartEdit = (p: Product) => {
    setEditingProductId(p.id);
    setTempPrice(p.price);
    setTempStock(p.stock);
  };

  const handleSaveProduct = (pId: string) => {
    setProductList(prev => prev.map(p => {
      if (p.id === pId) {
        return { ...p, price: tempPrice, stock: tempStock };
      }
      return p;
    }));
    setEditingProductId(null);
  };

  const handleReplyTicket = (ticketId: string) => {
    const text = ticketReplies[ticketId];
    if (!text || !text.trim()) return;
    replySupportTicket(ticketId, text.trim());
    setTicketReplies(prev => ({ ...prev, [ticketId]: '' }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-wide">
                Demo Admin Controls (Browser Only)
              </h2>
              <p className="text-[11px] text-slate-400">
                Order Pipeline, Catalog Price & Stock Management, and Customer Ticket Dispatch
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'orders' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders & State Dispatch ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'products' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Products & Vernacular Aliases ({productList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tickets' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Support Inbox ({supportTickets.length})</span>
          </button>
        </div>

        {/* Tab 1: Orders & State Dispatch */}
        {activeTab === 'orders' && (
          <div className="p-6 overflow-y-auto space-y-4">
            <div className="text-xs text-slate-500 mb-2">
              Advance order statuses through the state machine: 
              <span className="font-mono text-slate-700 ml-1">Placed ➔ Confirmed ➔ Packed ➔ Shipped ➔ Out for Delivery ➔ Delivered</span>
            </div>

            {orders.map(order => (
              <div key={order.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">{order.id}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">{order.createdAt}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-bold text-orange-600">₹{order.total.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                      order.status === 'Delivered' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : order.status === 'Cancelled' 
                          ? 'bg-rose-100 text-rose-700' 
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status}
                    </span>

                    <button
                      onClick={() => openOrderTracking(order.id)}
                      className="text-orange-600 hover:underline font-semibold"
                    >
                      Track
                    </button>
                  </div>
                </div>

                {/* State Transition Actions */}
                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/60">
                    <span className="text-slate-500 font-semibold self-center mr-1">Move To:</span>
                    {(['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'] as OrderState[]).map(next => (
                      <button
                        key={next}
                        onClick={() => advanceOrderState(order.id, next)}
                        className="px-2.5 py-1 bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-700 border border-slate-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        {next}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Products & Vernacular Aliases */}
        {activeTab === 'products' && (
          <div className="p-6 overflow-y-auto space-y-3">
            {productList.map(p => (
              <div key={p.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={p.imageUrl} alt={p.name.en} className="w-14 h-14 object-cover rounded-xl bg-slate-200" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{p.name.en}</h4>
                    <p className="text-slate-500 text-[11px]">Brand: {p.brand} • Unit: {p.unit}</p>
                    {p.aliases && p.aliases.length > 0 && (
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-600">
                        <Tag className="w-3 h-3 text-orange-600" />
                        <span>Aliases: {p.aliases.map(a => a.term).join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price & Stock Adjustment */}
                {editingProductId === p.id ? (
                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-300">
                    <div>
                      <label className="text-[10px] text-slate-400 block">Price (₹)</label>
                      <input 
                        type="number" 
                        value={tempPrice} 
                        onChange={e => setTempPrice(Number(e.target.value))} 
                        className="w-20 p-1 border rounded text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">Stock</label>
                      <input 
                        type="number" 
                        value={tempStock} 
                        onChange={e => setTempStock(Number(e.target.value))} 
                        className="w-16 p-1 border rounded text-xs font-bold"
                      />
                    </div>
                    <button
                      onClick={() => handleSaveProduct(p.id)}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-slate-900 text-sm">₹{p.price}</div>
                      <div className="text-slate-500 text-[11px]">{p.stock} units in stock</div>
                    </div>
                    <button
                      onClick={() => handleStartEdit(p)}
                      className="p-2 text-slate-600 hover:text-orange-600 hover:bg-white rounded-lg border border-slate-200 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Support Inbox */}
        {activeTab === 'tickets' && (
          <div className="p-6 overflow-y-auto space-y-4">
            {supportTickets.map(tck => (
              <div key={tck.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-slate-800">{tck.id}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold ${
                    tck.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {tck.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900">{tck.subject}</h4>
                <p className="text-slate-600">{tck.message}</p>

                {/* Reply section */}
                <div className="pt-2 border-t border-slate-200">
                  {tck.adminReply && (
                    <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-xl mb-2 text-orange-950">
                      <strong>Current Reply:</strong> {tck.adminReply}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write response to customer..."
                      value={ticketReplies[tck.id] || ''}
                      onChange={e => setTicketReplies({ ...ticketReplies, [tck.id]: e.target.value })}
                      className="flex-1 p-2 bg-white border border-slate-300 rounded-xl focus:ring-1 focus:ring-orange-500 text-xs"
                    />
                    <button
                      onClick={() => handleReplyTicket(tck.id)}
                      className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
