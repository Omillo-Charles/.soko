"use client";

import React from "react";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  MoreVertical,
  Package,
  FileText,
  Truck,
  Settings
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: any) => (
  <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3 sm:mb-4">
      <div className={`p-2.5 sm:p-3 rounded-2xl ${color}`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <button className="text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-50">
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
    <div className="space-y-1">
      <p className="text-[10px] sm:text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
    </div>
    <div className="mt-3 sm:mt-4 flex items-center gap-2">
      <span className={`flex items-center gap-0.5 text-[10px] sm:text-xs font-black px-2 py-0.5 sm:py-1 rounded-lg ${trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {trendValue}
      </span>
      <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">vs last month</span>
    </div>
  </div>
);

const ActivityItem = ({ title, time, status, amount }: any) => (
  <div className="flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-black group-hover:bg-primary group-hover:text-white transition-colors text-sm sm:text-base">
        {title.charAt(0)}
      </div>
      <div className="min-w-0">
        <p className="font-black text-slate-900 text-sm truncate">{title}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Clock className="w-3 h-3 text-slate-400" />
          <span className="text-[10px] sm:text-xs text-slate-500 font-medium">{time}</span>
        </div>
      </div>
    </div>
    <div className="text-right flex-shrink-0 ml-2">
      <p className="font-black text-slate-900 text-sm">{amount}</p>
      <span className={`text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md ${
        status === 'Completed' ? 'text-emerald-600 bg-emerald-50' : 
        status === 'Pending' ? 'text-amber-600 bg-amber-50' : 'text-slate-500 bg-slate-100'
      }`}>
        {status}
      </span>
    </div>
  </div>
);

const DashboardPage = () => {
  return (
    <main className="flex-1 p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <StatCard 
            title="Total Revenue" 
            value="KSh 1.2M" 
            icon={DollarSign} 
            trend="up" 
            trendValue="+12.5%" 
            color="bg-primary shadow-lg shadow-primary/30"
          />
          <StatCard 
            title="Active Orders" 
            value="156" 
            icon={ShoppingBag} 
            trend="up" 
            trendValue="+8.2%" 
            color="bg-amber-500 shadow-lg shadow-amber-500/30"
          />
          <StatCard 
            title="New Customers" 
            value="2,420" 
            icon={Users} 
            trend="down" 
            trendValue="-3.1%" 
            color="bg-indigo-500 shadow-lg shadow-indigo-500/30"
          />
          <StatCard 
            title="Conversion" 
            value="4.2%" 
            icon={TrendingUp} 
            trend="up" 
            trendValue="+2.4%" 
            color="bg-rose-500 shadow-lg shadow-rose-500/30"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Recent Activity */}
          <div className="xl:col-span-2 bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight">Recent Transactions</h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 font-medium">Monitoring your latest sales and orders</p>
              </div>
              <button className="text-[9px] sm:text-[10px] md:text-xs font-black text-primary uppercase tracking-widest hover:underline whitespace-nowrap">
                View All
              </button>
            </div>
            <div className="space-y-1 md:space-y-2">
              <ActivityItem title="MacBook Air M3" time="2 mins ago" status="Completed" amount="KSh 145,000" />
              <ActivityItem title="Nike Air Jordan" time="15 mins ago" status="Pending" amount="KSh 12,500" />
              <ActivityItem title="Sony WH-1000XM5" time="1 hour ago" status="Completed" amount="KSh 45,000" />
              <ActivityItem title="Ergonomic Desk" time="3 hours ago" status="Cancelled" amount="KSh 22,000" />
              <ActivityItem title="Coffee Machine" time="5 hours ago" status="Completed" amount="KSh 18,500" />
            </div>
          </div>

          {/* Quick Actions & Promo */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-slate-900 rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 md:p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg md:text-xl font-black tracking-tight mb-1 sm:mb-2">Grow your business</h3>
                <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm font-medium mb-4 sm:mb-6 leading-relaxed">Boost your posts and products to reach 5,000+ new customers today.</p>
                <button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                  Boost Now
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 sm:w-32 sm:h-32 bg-primary/10 rounded-full blur-2xl sm:blur-3xl group-hover:bg-primary/20 transition-all"></div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm p-5 sm:p-6 md:p-8">
              <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-tight mb-4 sm:mb-6">Quick Tools</h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <button className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white flex items-center justify-center shadow-sm mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-tighter text-slate-600">Add Product</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white flex items-center justify-center shadow-sm mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-tighter text-slate-600">New Post</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white flex items-center justify-center shadow-sm mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-tighter text-slate-600">Ship Order</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white flex items-center justify-center shadow-sm mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-tighter text-slate-600">Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
};

export default DashboardPage;
