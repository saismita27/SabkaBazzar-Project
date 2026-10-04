import { useEffect, useRef, useState } from 'react';
import type { Address, Product, Order, OrderState, SupportTicket, User } from '../types';

// The browser renders the UI; these requests delegate shopping operations to C++.
export const cppEnabled = import.meta.env.VITE_CPP_BACKEND === '1';
const empty = { cart: [], wishlist: [], orders: [], addresses: [], supportTickets: [], user: null,
 totals: { subtotal: 0, gst: 0, deliveryFee: 0, total: 0 } };
async function request(path: string, body?: object) {
 const response = await fetch('/api/' + path, { credentials: 'same-origin',
  headers: body ? {'Content-Type':'application/json','X-Sabka-Request':'1'} : {},
  ...(body ? {method:'POST',body:JSON.stringify(body)} : {}) });
 const data = await response.json();
 if (!response.ok) throw new Error(data.error || 'C++ backend request failed');
 return data;
}
export function useCppStore(language: string, selectedState: string, onHelp: (event: any) => void) {
 const [state, setState] = useState<any>(empty);
 const lastHelp = useRef<number>(0);
 const helpCallback = useRef(onHelp); helpCallback.current = onHelp;
 const pending = useRef<Promise<any>>(Promise.resolve());
 useEffect(() => {
  if (!cppEnabled) return;
  pending.current = request('state').then(setState).catch(error => {alert('C++ backend unavailable: ' + error.message);throw error;});
  pending.current.catch(() => {});
  const timer = window.setInterval(() => {
   request('state').then(data => {
    const event = data.helpEvent;
    if (event && event.eventId > lastHelp.current) {lastHelp.current=event.eventId;helpCallback.current(event);}
   }).catch(() => {});
  }, 1000);
  return () => window.clearInterval(timer);
 }, []);
 const action = (body: object) => {
  const operation = pending.current.catch(() => {}).then(async () => {
   const data = await request('action', body);setState(data.state);return data.result;
  });
  pending.current = operation.catch(() => {});return operation;
 };
 const send = (body: object) => { void action(body).catch(e => alert(e.message)); };
 return {
  pairKiosk: () => send({op:'kiosk.bind'}),
  cart: state.cart, wishlist: state.wishlist, orders: state.orders, addresses: state.addresses,
  supportTickets: state.supportTickets, user: state.user,
  cartCount: state.cart.reduce((sum: number,x: any)=>sum+x.quantity,0),
  cartSubtotal: state.totals.subtotal, cartGst: state.totals.gst,
  cartDeliveryFee: state.totals.deliveryFee, cartTotal: state.totals.total,
  addToCart: (p: Product,quantity=1,variant?:string)=>send({op:'cart.add',productId:p.id,quantity,variant:variant||''}),
  updateQuantity: (productId:string,quantity:number,variant?:string)=>send({op:'cart.set',productId,quantity,variant:variant||''}),
  removeFromCart: (productId:string,variant?:string)=>send({op:'cart.remove',productId,variant:variant||''}),
  clearCart: ()=>send({op:'cart.clear'}),
  toggleWishlist: (p:Product)=>send({op:'wishlist.toggle',productId:p.id}),
  isInWishlist: (id:string)=>state.wishlist.some((p:Product)=>p.id===id),
  placeOrder: (address:Address,payment:string,key:string):Promise<Order>=>action({op:'checkout',address,payment,key}),
  cancelOrder: async (orderId:string):Promise<boolean>=>{try{return await action({op:'order.state',orderId,status:'Cancelled'});}catch(e){alert((e as Error).message);return false;}},
  advanceOrderState: (orderId:string,status:OrderState)=>send({op:'order.state',orderId,status}),
  loginUser: (name:string,phone:string,email:string)=>send({op:'profile',user:{name,phone,email,preferredLanguage:language,selectedState}}),
  logoutUser: ()=>send({op:'logout'}),
  addAddress: (address:Address)=>send({op:'address',address}),
  createSupportTicket: (type:SupportTicket['type'],subject:string,message:string,orderId?:string)=>send({op:'support.create',type,subject,message,...(orderId?{orderId}:{})}),
  replySupportTicket: (ticketId:string,reply:string)=>send({op:'support.reply',ticketId,reply})
 };
}
