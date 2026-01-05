"use client";

import React from "react";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  Search,
  MoreVertical
} from "lucide-react";

const OrderItem = ({ order }: any) => (
  <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-black text-xs sm:text-sm">
          #{order.id}
        </div>
        <div>
          <p className="font-black text-slate-900 text-xs sm:text-sm">{order.customer}</p>
          <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{order.date}</p>
        </div>
      </div>
      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${
        order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
        order.status === 'Processing' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
      }`}>
        {order.status}
      </span>
    </div>

    <div className="space-y-3 sm:space-y-4">
      {order.items.map((item: any, idx: number) => (
        <div key={idx} className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[9px] sm:text-[10px] font-black flex-shrink-0">
              {item.qty}x
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-600 truncate">{item.name}</p>
          </div>
          <p className="text-[10px] sm:text-xs font-black text-slate-900 flex-shrink-0 ml-2">{item.price}</p>
        </div>
      ))}
    </div>

    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-50 flex items-center justify-between">
      <div>
        <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Amount</p>
        <p className="text-base sm:text-lg font-black text-slate-900">{order.total}</p>
      </div>
      <button className="flex items-center gap-1.5 sm:gap-2 text-primary hover:gap-3 transition-all">
        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Details</span>
        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>
    </div>
  </div>
);

const OrdersPage = () => {
  const orders = [
    { id: "8421", customer: "John Doe", date: "Jan 05, 2026", status: "Processing", total: "KSh 157,500", items: [{ name: "MacBook Air M3", qty: 1, price: "KSh 145,000" }, { name: "USB-C Hub", qty: 1, price: "KSh 12,500" }] },
    { id: "8420", customer: "Sarah Smith", date: "Jan 04, 2026", status: "Completed", total: "KSh 12,500", items: [{ name: "Nike Air Jordan", qty: 1, price: "KSh 12,500" }] },
    { id: "8419", customer: "Mike Johnson", date: "Jan 04, 2026", status: "Cancelled", total: "KSh 45,000", items: [{ name: "Sony Headphones", qty: 1, price: "KSh 45,000" }] },
    { id: "8418", customer: "Emma Wilson", date: "Jan 03, 2026", status: "Completed", total: "KSh 8,500", items: [{ name: "Sneakers", qty: 1, price: "KSh 8,500" }] },
  ];

  return (
    <main className="p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8">
        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
            <button className="whitespace-nowrap px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-900 text-white rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/20 transition-all hover:scale-105">All Orders</button>
            <button className="whitespace-nowrap px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-slate-500 hover:text-primary rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all">Processing</button>
            <button className="whitespace-nowrap px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-slate-500 hover:text-emerald-500 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all">Completed</button>
          </div>
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search ID or Customer..." 
              className="w-full bg-white border border-slate-100 pl-11 pr-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {orders.map(order => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      </main>
  );
};

export default OrdersPage;
