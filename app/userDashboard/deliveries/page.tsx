"use client";

import React from "react";
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  User,
  Phone,
  ArrowRight,
  MoreVertical
} from "lucide-react";

const DeliveryCard = ({ delivery }: any) => (
  <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm overflow-hidden group">
    <div className="p-4 sm:p-6 border-b border-slate-50 flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center ${
          delivery.status === 'In Transit' ? 'bg-blue-50 text-blue-500' : 
          delivery.status === 'Pending' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
        }`}>
          <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tracking ID</p>
          <p className="font-black text-slate-900 text-xs sm:text-sm">{delivery.trackingId}</p>
        </div>
      </div>
      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${
        delivery.status === 'In Transit' ? 'bg-blue-50 text-blue-600' : 
        delivery.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
      }`}>
        {delivery.status}
      </span>
    </div>

    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex flex-col items-center gap-1 mt-1">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary shadow-[0_0_0_3px_rgba(59,130,246,0.1)] sm:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"></div>
          <div className="w-0.5 h-8 sm:h-10 bg-slate-100"></div>
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />
        </div>
        <div className="space-y-3 sm:space-y-4 min-w-0">
          <div>
            <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Pickup</p>
            <p className="text-[10px] sm:text-xs font-black text-slate-900 truncate">Duuka Central Warehouse, Nairobi</p>
          </div>
          <div>
            <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Destination</p>
            <p className="text-[10px] sm:text-xs font-black text-slate-900 truncate">{delivery.address}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-black text-slate-900">{delivery.courier}</p>
            <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold">Courier Partner</p>
          </div>
        </div>
        <button className="p-1.5 sm:p-2 bg-white text-primary hover:bg-primary hover:text-white rounded-lg sm:rounded-xl shadow-sm transition-all">
          <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>

    <div className="p-4 sm:p-6 pt-0">
      <button className="w-full py-2.5 sm:py-3 bg-slate-900 text-white rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
        Track Live Location
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  </div>
);

const DeliveriesPage = () => {
  const deliveries = [
    { trackingId: "DK-772-01", status: "In Transit", address: "Westlands, Woodvale Grove, Nairobi", courier: "Speedy Logistics", eta: "2:30 PM" },
    { trackingId: "DK-771-95", status: "Pending", address: "Kilimani, Galana Rd, Nairobi", courier: "City Express", eta: "4:15 PM" },
    { trackingId: "DK-771-82", status: "Delivered", address: "Karen, Hardy Estate, Nairobi", courier: "SafeShip Kenya", eta: "11:00 AM" },
  ];

  return (
    <main className="p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8">
        {/* Logistics Overview */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Shipments</p>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900">1,284</h3>
          </div>
          <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Active Deliveries</p>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900">42</h3>
          </div>
          <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm xs:col-span-2 md:col-span-1">
            <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Success Rate</p>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900">99.2%</h3>
          </div>
        </div>

        {/* Deliveries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {deliveries.map((delivery, idx) => (
            <DeliveryCard key={idx} delivery={delivery} />
          ))}
        </div>
      </main>
  );
};

export default DeliveriesPage;
