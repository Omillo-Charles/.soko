"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Filter,
  Download,
  MoreVertical,
  Zap,
  Crown,
  Target,
  Globe,
  MessageSquare,
  Search,
  ChevronRight,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useSellerOrders } from "@/hooks/useSellerOrders";
import { useMyProducts } from "@/hooks/useProducts";

// Simple SVG Line Chart Component
const MiniChart = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - ((d - min) / range) * 80 - 10}`).join(" ");
  
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

// Main Premium Dashboard Component
export default function PremiumDashboard() {
  const { user, isLoading: userLoading } = useUser();
  const { orders = [], isLoading: ordersLoading } = useSellerOrders();
  const { data: products = [], isLoading: productsLoading } = useMyProducts();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0a0c]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <Crown className="absolute inset-0 m-auto w-8 h-8 text-amber-500 animate-pulse" />
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);
  
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-slate-200 font-sans selection:bg-amber-500/30 transition-colors duration-300">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] bg-purple-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/account" className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Crown className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
                  Premium Intelligence
                </h1>
                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.2em]">Enterprise Suite</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md mx-12">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-amber-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search analytics, customers, trends..."
                className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-semibold transition-all text-slate-900 dark:text-white">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Report</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-white dark:bg-[#0a0a0c] flex items-center justify-center overflow-hidden">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{user?.name?.charAt(0) || 'U'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8 relative">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] font-bold uppercase tracking-wider">Early Access</span>
              <span className="text-slate-400 dark:text-slate-500 text-xs">•</span>
              <span className="text-slate-400 dark:text-slate-500 text-xs">Updated 2 minutes ago</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
              Welcome back, <span className="text-amber-500">{user?.name?.split(' ')[0] || 'Premium'}</span>.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Your store performance is <span className="text-emerald-600 dark:text-emerald-500 font-bold">up 12.5%</span> this week. We've detected new growth opportunities in the electronics category.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-1.5 rounded-2xl shadow-sm">
            <button className="px-4 py-2 bg-amber-500 text-black rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all">
              Live View
            </button>
            <button className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-bold">
              Insights
            </button>
            <button className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-bold">
              Settings
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Revenue", value: `KES ${totalRevenue.toLocaleString()}`, trend: "+14.2%", color: "#f59e0b", icon: BarChart3, data: [30, 45, 35, 60, 55, 80, 75] },
            { label: "Conversion Rate", value: "3.24%", trend: "+1.2%", color: "#10b981", icon: Target, data: [40, 30, 50, 45, 60, 55, 70] },
            { label: "Active Customers", value: "1,284", trend: "+5.4%", color: "#6366f1", icon: Users, data: [20, 30, 25, 40, 35, 50, 45] },
            { label: "Average Order", value: `KES ${Math.round(avgOrderValue).toLocaleString()}`, trend: "-0.8%", color: "#ec4899", icon: ShoppingBag, data: [60, 55, 70, 65, 80, 75, 90] },
          ].map((stat, i) => (
            <div key={i} className="group bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 hover:bg-slate-50 dark:hover:bg-white/[0.05] hover:border-amber-500/20 dark:hover:border-white/20 transition-all duration-500 relative overflow-hidden shadow-sm hover:shadow-xl">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'text-emerald-600 dark:text-emerald-500 bg-emerald-500/10' : 'text-rose-600 dark:text-rose-500 bg-rose-500/10'}`}>
                    {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.trend}
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-500 text-sm font-semibold mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                
                <div className="mt-8 h-16 w-full opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                  <MiniChart data={stat.data} color={stat.color} />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 blur-[60px] opacity-10 dark:opacity-20 transition-all duration-500 group-hover:opacity-30 dark:group-hover:opacity-40" style={{ backgroundColor: stat.color }}></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Main Chart Card */}
          <div className="lg:col-span-8 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Performance Forecast</h3>
                <p className="text-slate-500 dark:text-slate-500 text-xs font-medium">Predictive analysis for the next 30 days</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                {['1D', '1W', '1M', '1Y'].map((t) => (
                  <button key={t} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${t === '1M' ? 'bg-amber-500 text-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Large Mock Chart */}
            <div className="h-[350px] w-full relative">
              <div className="absolute inset-0 flex items-end justify-between px-2">
                {[40, 65, 45, 80, 60, 95, 75, 85, 55, 90, 100, 80].map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-4 group/bar w-full">
                    <div className="relative w-full px-2">
                      <div 
                        className="w-full bg-gradient-to-t from-amber-500/20 to-amber-500/60 dark:to-amber-500/60 rounded-t-xl transition-all duration-1000 group-hover:from-amber-500/40 group-hover:to-amber-500 shadow-sm"
                        style={{ height: `${h * 3}px` }}
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-black px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                          {h * 10} Sales
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 group-hover/bar:text-slate-600 dark:group-hover/bar:text-slate-400 uppercase tracking-tighter">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Chart Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className="w-full border-t border-dashed border-slate-300 dark:border-white/20"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - AI Insights */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-[2.5rem] p-8 text-black relative overflow-hidden group shadow-xl">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-black/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                    <Sparkles className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">AI Opportunity</span>
                </div>
                <h3 className="text-2xl font-black leading-tight mb-4">Increase stock for "Electronics" by 25%</h3>
                <p className="text-black/70 text-sm font-medium leading-relaxed mb-6">
                  Based on seasonal trends and current market demand, electronics are projected to spike in the next 14 days.
                </p>
                <button className="w-full bg-black text-white py-4 rounded-2xl font-black text-sm hover:bg-black/80 transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                  Apply Insight
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <Zap className="absolute -right-6 -bottom-6 w-32 h-32 text-black/5 -rotate-12" />
            </div>

            <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                Global Sales Distribution
              </h3>
              <div className="space-y-4">
                {[
                  { region: "Nairobi, Kenya", percentage: 65, color: "#f59e0b" },
                  { region: "Mombasa, Kenya", percentage: 20, color: "#6366f1" },
                  { region: "Kisumu, Kenya", percentage: 10, color: "#10b981" },
                  { region: "Others", percentage: 5, color: "#ec4899" },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-500 dark:text-slate-400">{item.region}</span>
                      <span className="text-slate-900 dark:text-white">{item.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Transactions & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent High-Value Transactions */}
          <div className="lg:col-span-7 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">High-Value Transactions</h3>
              <button className="text-xs font-bold text-amber-600 dark:text-amber-500 hover:text-amber-500 dark:hover:text-amber-400 transition-colors">View All</button>
            </div>
            <div className="space-y-4">
              {recentOrders.length > 0 ? recentOrders.map((order, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl hover:bg-white dark:hover:bg-white/10 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="hidden sm:block text-right">
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">Items</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white">{order.items.length}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">Amount</p>
                      <p className="text-lg font-black text-slate-900 dark:text-white">KES {order.totalAmount.toLocaleString()}</p>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-800 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No high-value transactions found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Performance Heatmap Mockup */}
          <div className="lg:col-span-5 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Engagement Heatmap</h3>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => {
                const intensity = Math.random();
                return (
                  <div 
                    key={i} 
                    className="aspect-square rounded-lg transition-all duration-500 hover:scale-110 cursor-help border border-slate-100 dark:border-transparent"
                    style={{ 
                      backgroundColor: `rgba(245, 158, 11, ${intensity})`,
                      opacity: intensity < 0.2 ? 0.1 : intensity
                    }}
                    title={`Engagement: ${Math.round(intensity * 100)}%`}
                  ></div>
                );
              })}
            </div>
            <div className="flex justify-between mt-6 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
            
            <div className="mt-10 p-6 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 dark:border-indigo-500/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h4 className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">Customer Sentiment</h4>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-medium">
                Overall sentiment is <span className="text-slate-900 dark:text-white">"Highly Positive"</span>. Customers frequently mention "fast delivery" and "premium packaging" in recent reviews.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="max-w-[1600px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-200 dark:border-white/5 pt-12">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">System Status: Operational</p>
          </div>
          <div className="flex items-center gap-8 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">
            <span className="hover:text-amber-500 transition-colors cursor-pointer">Documentation</span>
            <span className="hover:text-amber-500 transition-colors cursor-pointer">API Reference</span>
            <span className="hover:text-amber-500 transition-colors cursor-pointer">Support</span>
            <span className="text-slate-300 dark:text-slate-800">v2.4.0-premium</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
