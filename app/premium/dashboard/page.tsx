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
  ArrowLeft,
  Bell,
  LayoutDashboard,
  Settings,
  PieChart,
  Activity,
  Layers
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useSellerOrders } from "@/hooks/useSellerOrders";
import { useMyProducts } from "@/hooks/useProducts";

// Sleek Area Chart Component
const AreaChart = ({ data, color, height = 60 }: { data: number[], color: string, height?: number }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d - min) / range) * 70 - 15;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `0,100 ${points} 100,100`;
  
  return (
    <svg viewBox="0 0 100 100" className="w-full overflow-visible" style={{ height: `${height}px` }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M ${areaPoints}`}
        fill={`url(#gradient-${color})`}
      />
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

export default function PremiumDashboard() {
  const { user, isLoading: userLoading } = useUser();
  const { orders = [], isLoading: ordersLoading } = useSellerOrders();
  const { data: products = [], isLoading: productsLoading } = useMyProducts();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-500/20 rounded-full animate-spin border-t-amber-500"></div>
          <Crown className="absolute inset-0 m-auto w-6 h-6 text-amber-500 animate-pulse" />
        </div>
      </div>
    );
  }

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);
  
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const recentOrders = orders.slice(0, 6);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-amber-500/30 transition-colors duration-500">
      {/* Custom Styles for hidden scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        .custom-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>

      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-100">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 dark:bg-amber-500/[0.05] blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-500/[0.05] blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="flex min-h-screen relative z-10">
        {/* Sleek Mini Sidebar */}
        <aside className="hidden lg:flex fixed left-0 top-[128px] h-[calc(100vh-128px)] overflow-y-auto flex-col items-center w-20 py-8 border-r border-border bg-background/50 backdrop-blur-xl z-50 custom-scrollbar">
          <Link href="/" className="mb-12 group flex-shrink-0">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
              <Crown className="w-7 h-7 text-black" />
            </div>
          </Link>
          
          <nav className="flex flex-col gap-6 flex-1">
            {[
              { icon: LayoutDashboard, id: 'overview' },
              { icon: Activity, id: 'analytics' },
              { icon: ShoppingBag, id: 'orders' },
              { icon: Users, id: 'customers' },
              { icon: Layers, id: 'inventory' },
              { icon: Settings, id: 'settings' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-3 rounded-xl transition-all duration-300 group relative ${
                  activeTab === item.id 
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <div className="absolute left-full ml-4 px-2 py-1 bg-foreground text-background text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-border">
                  {item.id.charAt(0).toUpperCase() + item.id.slice(1)}
                </div>
              </button>
            ))}
          </nav>

          <button className="mt-auto p-3 text-muted-foreground hover:text-rose-500 transition-colors flex-shrink-0">
            <Bell className="w-6 h-6" />
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 lg:ml-20">
          {/* Header */}
          <header className="h-20 border-b border-border px-8 flex items-center justify-between bg-background/30 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <Link href="/account" className="lg:hidden p-2 hover:bg-muted rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2 text-foreground">
                Dashboard 
                <span className="text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 uppercase tracking-widest">Premium</span>
              </h1>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-amber-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Quick search..."
                  className="bg-muted border-none rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-amber-500/20 transition-all text-foreground placeholder:text-muted-foreground/50"
                />
              </div>

              <div className="flex items-center gap-3 pl-6 border-l border-border">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold truncate max-w-[120px] text-foreground">{user?.name || 'Store Owner'}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Enterprise Plan</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-sm shadow-lg shadow-amber-500/10">
                  {user?.name?.charAt(0) || 'S'}
                </div>
              </div>
            </div>
          </header>

          <div className="p-8 overflow-y-auto">
            {/* Top Metrics Grid - Very Small Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Revenue", value: `KES ${totalRevenue.toLocaleString()}`, trend: "+12%", color: "#f59e0b", data: [30, 45, 35, 60, 55, 80, 75], icon: BarChart3 },
                { label: "Orders", value: orders.length, trend: "+8%", color: "#6366f1", data: [40, 30, 50, 45, 60, 55, 70], icon: ShoppingBag },
                { label: "Products", value: products.length, trend: "+2%", color: "#10b981", data: [20, 30, 25, 40, 35, 50, 45], icon: Layers },
                { label: "Customers", value: "1,248", trend: "+15%", color: "#ec4899", data: [60, 55, 70, 65, 80, 75, 90], icon: Users },
              ].map((stat, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-5 hover:border-amber-500/30 transition-all duration-300 group shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-amber-500/10 transition-colors">
                      <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                    </div>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${stat.trend.startsWith('+') ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                  <h3 className="text-xl font-black mb-4 text-foreground">{stat.value}</h3>
                  <div className="h-8 w-full opacity-60 group-hover:opacity-100 transition-opacity">
                    <AreaChart data={stat.data} color={stat.color} height={32} />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              {/* Main Performance Card */}
              <div className="lg:col-span-8 bg-card border border-border rounded-[2rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-foreground">Sales Analytics</h3>
                    <p className="text-xs text-muted-foreground font-medium">Weekly performance comparison</p>
                  </div>
                  <div className="flex gap-2">
                    {['W', 'M', 'Y'].map((p) => (
                      <button key={p} className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${p === 'W' ? 'bg-amber-500 text-black' : 'hover:bg-muted text-muted-foreground'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="h-64 flex items-end gap-3 px-2 relative">
                  {[40, 65, 45, 80, 60, 95, 75, 85, 55, 90, 70, 85].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar">
                      <div className="w-full relative">
                        <div 
                          className="w-full bg-muted rounded-t-lg transition-all duration-700 group-hover/bar:bg-amber-500/40 relative overflow-hidden"
                          style={{ height: `${h * 2}px` }}
                        >
                          <div 
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-lg transition-all duration-1000 delay-150"
                            style={{ height: activeTab === 'overview' ? '60%' : '0%' }}
                          />
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Day {i + 1}</span>
                    </div>
                  ))}
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5 px-2 pb-8">
                    {[1, 2, 3, 4].map(l => <div key={l} className="w-full border-t border-foreground"></div>)}
                  </div>
                </div>
              </div>

              {/* AI Insight Card - Sleeker */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-xl shadow-indigo-500/10">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Intelligence</span>
                    </div>
                    <h3 className="text-xl font-black mb-3 leading-tight">Stock Optimization Required</h3>
                    <p className="text-white/70 text-xs font-medium leading-relaxed mb-6">
                      Electronics demand is predicted to increase by <span className="text-amber-400 font-black">28%</span> next week.
                    </p>
                    <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-black text-xs hover:bg-amber-400 hover:text-black transition-all duration-300">
                      View Recommendations
                    </button>
                  </div>
                  <Zap className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                </div>

                <div className="bg-card border border-border rounded-[2rem] p-6 flex-1 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-foreground">
                    <Globe className="w-4 h-4 text-amber-500" />
                    Market Reach
                  </h4>
                  <div className="space-y-5">
                    {[
                      { label: 'Nairobi', val: 75, color: '#f59e0b' },
                      { label: 'Mombasa', val: 45, color: '#6366f1' },
                      { label: 'Kisumu', val: 30, color: '#10b981' },
                    ].map((m, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                          <span className="text-muted-foreground">{m.label}</span>
                          <span className="text-foreground">{m.val}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${m.val}%`, backgroundColor: m.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - Recent Activity & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Compact Transaction Table */}
              <div className="lg:col-span-7 bg-card border border-border rounded-[2rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black tracking-tight text-foreground">Recent Orders</h3>
                  <button className="text-[10px] font-black text-amber-500 hover:underline">View All Activity</button>
                </div>
                <div className="space-y-3">
                  {recentOrders.map((order, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted transition-all border border-transparent hover:border-border group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-foreground">#{order._id.slice(-6).toUpperCase()}</p>
                          <p className="text-[9px] text-muted-foreground font-bold uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right hidden sm:block">
                          <p className="text-[9px] text-muted-foreground font-bold uppercase">Status</p>
                          <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full capitalize">{order.status}</span>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <p className="text-[9px] text-muted-foreground font-bold uppercase">Amount</p>
                          <p className="text-xs font-black text-foreground">KES {order.totalAmount.toLocaleString()}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products/Performance */}
              <div className="lg:col-span-5 bg-card border border-border rounded-[2rem] p-8 shadow-sm">
                <h3 className="text-lg font-black tracking-tight mb-8 text-foreground">Growth Trajectory</h3>
                <div className="relative h-64 flex items-center justify-center">
                  {/* Mock Radar/Pie Chart Center */}
                  <div className="w-48 h-48 rounded-full border-8 border-muted flex items-center justify-center relative">
                    <div className="text-center">
                      <p className="text-3xl font-black text-amber-500">84%</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Efficiency</p>
                    </div>
                    {/* Floating Decorative Elements */}
                    <div className="absolute -top-4 -right-4 p-3 bg-indigo-500 text-white rounded-2xl shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  {/* Decorative Chart Elements */}
                  <div className="absolute inset-0 border border-muted rounded-full scale-75 opacity-50" />
                  <div className="absolute inset-0 border border-muted rounded-full scale-110 opacity-20" />
                  
                  {/* Floating Metric Badges */}
                  <div className="absolute top-0 left-0 p-4 rounded-2xl bg-muted text-center">
                    <p className="text-[10px] font-black text-amber-500">↑ 12%</p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase">Retention</p>
                  </div>
                  <div className="absolute bottom-4 right-0 p-4 rounded-2xl bg-muted text-center">
                    <p className="text-[10px] font-black text-indigo-500">↑ 24%</p>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase">Conversion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
