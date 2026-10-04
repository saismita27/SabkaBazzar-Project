import React from 'react';
import { useApp } from '../context/AppContext';
export const WishlistModal: React.FC = () => {
  const { isWishlistOpen, setIsWishlistOpen, wishlist, toggleWishlist, addToCart, language, t } = useApp();
  if (!isWishlistOpen) return null;
  return <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
    <section role="dialog" aria-modal="true" aria-label="Wishlist" className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-auto shadow-2xl">
      <div className="flex justify-between mb-5"><h2 className="font-bold text-xl">{t('wishlist')} ({wishlist.length})</h2><button onClick={() => setIsWishlistOpen(false)} aria-label="Close wishlist">Close</button></div>
      {!wishlist.length && <p>No saved products yet. Use the heart on a product to save it.</p>}
      {wishlist.map(p => <div key={p.id} className="flex gap-3 border-t py-4">
        <img src={p.imageUrl} alt="" className="w-20 h-20 object-contain" />
        <div><h3 className="font-semibold">{p.name[language] || p.name.en}</h3><p>₹{p.price.toLocaleString('en-IN')}</p>
        <button onClick={() => addToCart(p)} className="text-orange-700 font-bold mr-4">{t('addToCart')}</button>
        <button onClick={() => toggleWishlist(p)} className="text-rose-700">Remove</button></div>
      </div>)}
    </section>
  </div>;
};
