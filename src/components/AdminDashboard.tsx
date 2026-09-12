import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Key, 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Eye, 
  ShoppingCart, 
  CheckCircle2, 
  RefreshCw, 
  LogOut, 
  ArrowLeft, 
  Calendar, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Package, 
  Sparkles,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';
import { NoorbalLogo } from './NoorbalLogo';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

interface AnalyticsKPIs {
  totalVisitors: number;
  uniqueVisitors: number;
  todayVisitors: number;
  pageViews: number;
  productViews: number;
  addToCart: number;
  checkoutStarted: number;
  ordersCount: number;
  grossRevenuePKR: number;
  conversionRate: string;
}

interface TopProduct {
  id: string;
  name: string;
  views: number;
  cartAdds: number;
  orders: number;
  revenuePKR: number;
  conversionRate: string;
}

interface AnalyticsData {
  range: string;
  kpis: AnalyticsKPIs;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  trafficSources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  visitorBreakdown: {
    newPercentage: number;
    returningPercentage: number;
    newCount: number;
    returningCount: number;
  };
  topProducts: TopProduct[];
  recentEvents: Array<{
    id: string;
    type: string;
    details: string;
    device: string;
    source: string;
    timestamp: string;
  }>;
}

interface OrderRecord {
  id: string;
  item: {
    productId: string;
    productName: string;
    size: string;
    quantity: number;
    unitPricePKR: number;
    subtotalPKR: number;
  };
  deliveryFeePKR: number;
  totalPKR: number;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    city: string;
    province: string;
    address: string;
  };
  orderStatus: 'Pending' | 'Confirmed' | 'In Production' | 'Dispatched' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

const TOKEN_KEY = 'noorbal_admin_token';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || null;
  });

  const [usernameInput, setUsernameInput] = useState('admin@noorbal.com');
  const [passwordInput, setPasswordInput] = useState('noorbal_admin_2026');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Authenticated state
  const [activeTab, setActiveTab] = useState<'bi' | 'orders'>('bi');
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | 'all'>('7d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Verify and fetch data on mount or token change
  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    async function verifyAndLoad() {
      setIsLoadingData(true);
      try {
        // Verify token
        const verifyRes = await fetch('/api/admin/verify', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!verifyRes.ok) {
          // Token expired or invalid
          sessionStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(TOKEN_KEY);
          if (isMounted) setToken(null);
          return;
        }

        // Fetch Analytics
        const analyticsRes = await fetch(`/api/admin/analytics?range=${dateRange}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (analyticsRes.ok) {
          const aData = await analyticsRes.json();
          if (isMounted && aData.success) {
            setAnalytics(aData);
          }
        }

        // Fetch Orders
        const ordersRes = await fetch('/api/admin/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (ordersRes.ok) {
          const oData = await ordersRes.json();
          if (isMounted && oData.success) {
            setOrders(oData.orders || []);
          }
        }
      } catch (err) {
        console.error('Error loading admin data:', err);
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    }

    verifyAndLoad();

    return () => {
      isMounted = false;
    };
  }, [token, dateRange]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        sessionStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
      } else {
        setLoginError(data.error || 'Invalid credentials. Please verify your username and password.');
      }
    } catch {
      setLoginError('Unable to connect to administrative server. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // proceed with local cleanup
      }
    }
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setAnalytics(null);
    setOrders([]);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderRecord['orderStatus']) => {
    if (!token) return;
    setStatusUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const refreshData = async () => {
    if (!token) return;
    setIsLoadingData(true);
    try {
      const [analyticsRes, ordersRes] = await Promise.all([
        fetch(`/api/admin/analytics?range=${dateRange}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/orders', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (analyticsRes.ok) {
        const aData = await analyticsRes.json();
        if (aData.success) setAnalytics(aData);
      }
      if (ordersRes.ok) {
        const oData = await ordersRes.json();
        if (oData.success) setOrders(oData.orders || []);
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  // =========================================================================
  // VIEW 1: UNAUTHENTICATED LOGIN VIEW
  // =========================================================================
  if (!token) {
    return (
      <div className="min-h-screen bg-[#1A1614] text-[#FAF8F5] flex flex-col justify-between selection:bg-[#C9A468]/30">
        
        {/* Top Header */}
        <header className="p-4 sm:p-6 border-b border-[#C9A468]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2B231E] border border-[#C9A468]/40 flex items-center justify-center">
              <NoorbalLogo size="100%" className="w-full h-full" alt="NOORBAL Logo" />
            </div>
            <div>
              <span className="font-serif text-lg tracking-[0.2em] font-medium text-white block">
                NOORBAL
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#DFBF88] font-sans">
                Internal Executive Portal
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToStore}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans text-[#FAF8F5]/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Store</span>
          </button>
        </header>

        {/* Center Login Form */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-[#241F1C] border border-[#C9A468]/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-full bg-[#C9A468]/10 border border-[#C9A468]/30 mb-1">
                <Lock className="w-6 h-6 text-[#C9A468]" />
              </div>
              <h1 className="font-serif text-2xl font-medium text-white">
                Administrative Authentication
              </h1>
              <p className="text-xs text-[#FAF8F5]/70 font-sans leading-relaxed">
                Enter authorized credentials to access private Business Intelligence metrics, visitor analytics, and order operations.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 font-sans">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#DFBF88] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#C9A468]" />
                  <span>Admin Email</span>
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin@noorbal.com"
                  required
                  className="w-full py-2.5 px-3 bg-[#1A1614] border border-[#C9A468]/30 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C9A468] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#DFBF88] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#C9A468]" />
                  <span>Security Password</span>
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full py-2.5 px-3 bg-[#1A1614] border border-[#C9A468]/30 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C9A468] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-[#C9A468] hover:bg-[#DFBF88] text-[#1A1614] rounded-xl font-sans font-bold text-sm uppercase tracking-wider transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Access Executive BI</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-[#FAF8F5]/60 font-sans">
                <span>Default Credentials Preloaded</span>
                <span className="text-[#C9A468]">admin@noorbal.com</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUsernameInput('admin@noorbal.com');
                  setPasswordInput('noorbal_admin_2026');
                  handleLogin();
                }}
                className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-[#DFBF88] font-sans font-medium transition-colors cursor-pointer"
              >
                Fast One-Click Demo Sign-in
              </button>
            </div>

          </div>
        </main>

        <footer className="p-4 text-center text-xs text-white/40 font-sans border-t border-white/5">
          NOORBAL Private Administrative Console · End-to-End Encrypted Session
        </footer>

      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED EXECUTIVE DASHBOARD
  // =========================================================================
  const kpis = analytics?.kpis;

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.phone.includes(orderSearch) ||
      o.customer.city.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.item.productName.toLowerCase().includes(orderSearch.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#161210] text-[#FAF8F5] flex flex-col font-sans selection:bg-[#C9A468]/30">
      
      {/* Executive Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#211B17]/95 backdrop-blur-md border-b border-[#C9A468]/30 px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#161210] border border-[#C9A468]/50 flex items-center justify-center shrink-0">
            <NoorbalLogo size="100%" className="w-full h-full" alt="NOORBAL Logo" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg sm:text-xl tracking-[0.15em] font-semibold text-white">
                NOORBAL
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#C9A468]/20 border border-[#C9A468]/40 text-[10px] font-mono text-[#DFBF88] font-bold">
                ADMIN / BI
              </span>
            </div>
            <p className="text-[10px] text-[#FAF8F5]/60 font-sans tracking-wide">
              Executive Business Intelligence & Order Operations
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={refreshData}
            disabled={isLoadingData}
            title="Refresh analytics data"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-[#C9A468]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={onBackToStore}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans text-[#DFBF88] bg-[#C9A468]/10 hover:bg-[#C9A468]/20 border border-[#C9A468]/30 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Public Storefront</span>
            <span className="sm:hidden">Store</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans text-red-300 hover:text-red-100 bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Sub-Header Tabs & Date Range Filter */}
      <div className="bg-[#1C1714] border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('bi')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'bi'
                ? 'bg-[#C9A468] text-[#1A1614] shadow-md'
                : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Business Intelligence</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#C9A468] text-[#1A1614] shadow-md'
                : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Fulfillment ({orders.length})</span>
          </button>
        </div>

        {/* Date Range Selector (for BI Tab) */}
        {activeTab === 'bi' && (
          <div className="flex items-center gap-1 bg-[#120E0C] p-1 rounded-xl border border-white/10 text-xs">
            <span className="px-2 text-white/40 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#C9A468]" />
              <span className="hidden md:inline">Range:</span>
            </span>
            {(['today', '7d', '30d', 'all'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer capitalize ${
                  dateRange === r
                    ? 'bg-[#C9A468] text-[#161210] font-bold shadow-xs'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : r === 'all' ? 'All Time' : 'Today'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Admin Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {activeTab === 'bi' && (
          <>
            {/* 1. PRIMARY EXECUTIVE KPIS (Grid of 8 high-contrast metric cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Total Visitors */}
              <div className="p-4 rounded-2xl bg-[#211B17] border border-[#C9A468]/20 shadow-lg space-y-1">
                <div className="flex items-center justify-between text-xs text-[#DFBF88]">
                  <span>Total Visitors</span>
                  <Users className="w-4 h-4 text-[#C9A468]" />
                </div>
                <div className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {(kpis?.totalVisitors ?? 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-white/50">
                  Unique: {(kpis?.uniqueVisitors ?? 0).toLocaleString()}
                </div>
              </div>

              {/* Today's Visitors */}
              <div className="p-4 rounded-2xl bg-[#211B17] border border-[#C9A468]/20 shadow-lg space-y-1">
                <div className="flex items-center justify-between text-xs text-[#DFBF88]">
                  <span>Today's Visitors</span>
                  <Calendar className="w-4 h-4 text-[#C9A468]" />
                </div>
                <div className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {(kpis?.todayVisitors ?? 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  <span>Live Audience Traffic</span>
                </div>
              </div>

              {/* Total Page Views */}
              <div className="p-4 rounded-2xl bg-[#211B17] border border-[#C9A468]/20 shadow-lg space-y-1">
                <div className="flex items-center justify-between text-xs text-[#DFBF88]">
                  <span>Page Views</span>
                  <Eye className="w-4 h-4 text-[#C9A468]" />
                </div>
                <div className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {(kpis?.pageViews ?? 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-white/50">
                  Product Views: {(kpis?.productViews ?? 0).toLocaleString()}
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="p-4 rounded-2xl bg-[#211B17] border border-[#C9A468]/20 shadow-lg space-y-1">
                <div className="flex items-center justify-between text-xs text-[#DFBF88]">
                  <span>Conversion Rate</span>
                  <TrendingUp className="w-4 h-4 text-[#C9A468]" />
                </div>
                <div className="font-sans text-2xl sm:text-3xl font-bold text-[#C9A468] tracking-tight">
                  {kpis?.conversionRate ?? '0.0'}%
                </div>
                <div className="text-[11px] text-white/50">
                  Orders / Total Visitors
                </div>
              </div>

              {/* Product Views */}
              <div className="p-4 rounded-2xl bg-[#211B17] border border-[#C9A468]/20 shadow-lg space-y-1">
                <div className="flex items-center justify-between text-xs text-[#DFBF88]">
                  <span>Product Views</span>
                  <Eye className="w-4 h-4 text-[#C9A468]" />
                </div>
                <div className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {(kpis?.productViews ?? 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-white/50">
                  Individual catalog inspections
                </div>
              </div>

              {/* Add to Cart */}
              <div className="p-4 rounded-2xl bg-[#211B17] border border-[#C9A468]/20 shadow-lg space-y-1">
                <div className="flex items-center justify-between text-xs text-[#DFBF88]">
                  <span>Add to Cart</span>
                  <ShoppingCart className="w-4 h-4 text-[#C9A468]" />
                </div>
                <div className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {(kpis?.addToCart ?? 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-white/50">
                  High purchase intent signals
                </div>
              </div>

              {/* Checkout Started */}
              <div className="p-4 rounded-2xl bg-[#211B17] border border-[#C9A468]/20 shadow-lg space-y-1">
                <div className="flex items-center justify-between text-xs text-[#DFBF88]">
                  <span>Checkout Started</span>
                  <ShoppingBag className="w-4 h-4 text-[#C9A468]" />
                </div>
                <div className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {(kpis?.checkoutStarted ?? 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-white/50">
                  Entered delivery formulation
                </div>
              </div>

              {/* Orders Placed & Revenue */}
              <div className="p-4 rounded-2xl bg-[#211B17] border border-[#C9A468]/40 shadow-lg space-y-1 bg-gradient-to-br from-[#211B17] to-[#2B231E]">
                <div className="flex items-center justify-between text-xs text-[#DFBF88]">
                  <span>Confirmed Orders</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-sans text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">
                  {(kpis?.ordersCount ?? 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-[#DFBF88] font-semibold">
                  PKR {(kpis?.grossRevenuePKR ?? 0).toLocaleString()} Gross
                </div>
              </div>

            </div>

            {/* 2. CONVERSION FUNNEL BAR */}
            <div className="p-5 rounded-2xl bg-[#211B17] border border-white/10 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-medium text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C9A468]" />
                  <span>Customer Acquisition & Conversion Funnel</span>
                </h3>
                <span className="text-xs text-[#DFBF88] font-sans">
                  {kpis?.conversionRate ?? '0.0'}% Overall Conversion
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/60 text-[11px]">1. Visitors</p>
                  <p className="text-base font-bold text-white mt-0.5">{kpis?.totalVisitors ?? 0}</p>
                  <span className="text-[10px] text-white/40">100%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/60 text-[11px]">2. Views</p>
                  <p className="text-base font-bold text-white mt-0.5">{kpis?.productViews ?? 0}</p>
                  <span className="text-[10px] text-white/40">
                    {kpis?.totalVisitors ? Math.round(((kpis.productViews / kpis.totalVisitors) * 100)) : 0}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/60 text-[11px]">3. Cart / Checkout</p>
                  <p className="text-base font-bold text-white mt-0.5">{kpis?.checkoutStarted ?? 0}</p>
                  <span className="text-[10px] text-white/40">
                    {kpis?.totalVisitors ? Math.round(((kpis.checkoutStarted / kpis.totalVisitors) * 100)) : 0}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                  <p className="text-emerald-300 text-[11px]">4. Orders</p>
                  <p className="text-base font-bold text-emerald-400 mt-0.5">{kpis?.ordersCount ?? 0}</p>
                  <span className="text-[10px] text-emerald-400 font-bold">{kpis?.conversionRate ?? 0}%</span>
                </div>
              </div>
            </div>

            {/* 3. AUDIENCE & SEGMENTATION ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Device Breakdown */}
              <div className="p-5 rounded-2xl bg-[#211B17] border border-white/10 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-medium text-white flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-[#C9A468]" />
                    <span>Device Breakdown</span>
                  </h4>
                  <span className="text-[10px] text-white/40">User-Agent</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-white/80 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-[#C9A468]" />
                        <span>Mobile Device</span>
                      </span>
                      <span className="font-bold">{analytics?.deviceBreakdown?.mobile ?? 0}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#C9A468] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${analytics?.deviceBreakdown?.mobile ?? 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-white/80 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Laptop className="w-3.5 h-3.5 text-[#DFBF88]" />
                        <span>Desktop PC / Mac</span>
                      </span>
                      <span className="font-bold">{analytics?.deviceBreakdown?.desktop ?? 0}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#DFBF88] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${analytics?.deviceBreakdown?.desktop ?? 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-white/80 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Tablet className="w-3.5 h-3.5 text-white/60" />
                        <span>Tablet / iPad</span>
                      </span>
                      <span className="font-bold">{analytics?.deviceBreakdown?.tablet ?? 0}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-white/40 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${analytics?.deviceBreakdown?.tablet ?? 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Traffic Sources */}
              <div className="p-5 rounded-2xl bg-[#211B17] border border-white/10 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-medium text-white flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#C9A468]" />
                    <span>Traffic Sources</span>
                  </h4>
                  <span className="text-[10px] text-white/40">Referrer Domain</span>
                </div>

                <div className="space-y-2.5">
                  {(analytics?.trafficSources || []).slice(0, 4).map((src, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/80 truncate max-w-[150px]">{src.source}</span>
                        <span className="font-semibold text-[#DFBF88]">{src.percentage}% ({src.count})</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#C9A468] h-full rounded-full" 
                          style={{ width: `${src.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {(!analytics?.trafficSources || analytics.trafficSources.length === 0) && (
                    <p className="text-xs text-white/40">Direct Storefront traffic active.</p>
                  )}
                </div>
              </div>

              {/* New vs Returning Visitors */}
              <div className="p-5 rounded-2xl bg-[#211B17] border border-white/10 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-medium text-white flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#C9A468]" />
                    <span>Audience Retention</span>
                  </h4>
                  <span className="text-[10px] text-white/40">Identity Affinity</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/60">New Visitors</p>
                      <p className="text-lg font-bold text-white">{analytics?.visitorBreakdown?.newPercentage ?? 65}%</p>
                    </div>
                    <span className="text-xs font-mono px-2 py-1 rounded-md bg-[#C9A468]/20 text-[#DFBF88]">
                      {analytics?.visitorBreakdown?.newCount ?? 0} Users
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/60">Returning Customers</p>
                      <p className="text-lg font-bold text-[#C9A468]">{analytics?.visitorBreakdown?.returningPercentage ?? 35}%</p>
                    </div>
                    <span className="text-xs font-mono px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300">
                      {analytics?.visitorBreakdown?.returningCount ?? 0} Loyalists
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* 4. TOP PERFORMING PRODUCTS (Views, Adds, Orders, Conversion) */}
            <div className="p-5 rounded-2xl bg-[#211B17] border border-white/10 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-medium text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#C9A468]" />
                    <span>Top Performing Collections & Items</span>
                  </h3>
                  <p className="text-xs text-white/50 font-sans">
                    Real-time conversion efficiency per luxury product
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[#DFBF88] font-semibold">
                      <th className="py-2.5 px-3">Product Name</th>
                      <th className="py-2.5 px-3 text-center">Views</th>
                      <th className="py-2.5 px-3 text-center">Cart Adds</th>
                      <th className="py-2.5 px-3 text-center">Orders</th>
                      <th className="py-2.5 px-3 text-right">Revenue (PKR)</th>
                      <th className="py-2.5 px-3 text-right">Conversion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/80 font-sans">
                    {(analytics?.topProducts || []).map((prod) => (
                      <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 font-medium text-white">
                          {prod.name}
                        </td>
                        <td className="py-3 px-3 text-center font-mono">
                          {prod.views}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-[#DFBF88]">
                          {prod.cartAdds}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">
                          {prod.orders}
                        </td>
                        <td className="py-3 px-3 text-right font-mono">
                          PKR {prod.revenuePKR.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-[#C9A468]/20 text-[#DFBF88] font-mono font-bold">
                            {prod.conversionRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(!analytics?.topProducts || analytics.topProducts.length === 0) && (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-white/40">
                          No product activity recorded for this period yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. LIVE RECENT ACTIVITY FEED */}
            <div className="p-5 rounded-2xl bg-[#211B17] border border-white/10 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-sm font-medium text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C9A468]" />
                  <span>Real-Time Interaction Feed</span>
                </h3>
                <span className="text-[11px] text-white/40 font-mono">Encrypted Anonymized Log</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {(analytics?.recentEvents || []).map((evt) => (
                  <div key={evt.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <p className="text-white font-medium">{evt.details}</p>
                      <div className="flex items-center gap-2 text-[10px] text-white/40">
                        <span>Device: {evt.device}</span>
                        <span>·</span>
                        <span>Source: {evt.source}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#DFBF88] font-mono shrink-0 ml-2">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </>
        )}

        {/* VIEW 2: ORDERS & FULFILLMENT TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-5">
            
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#211B17] border border-white/10">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by order #, name, phone, city..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full py-2 pl-9 pr-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C9A468]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-white/50 font-medium shrink-0">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C9A468] cursor-pointer"
                >
                  <option value="all" className="bg-[#211B17]">All Statuses ({orders.length})</option>
                  <option value="Pending" className="bg-[#211B17]">Pending</option>
                  <option value="Confirmed" className="bg-[#211B17]">Confirmed</option>
                  <option value="In Production" className="bg-[#211B17]">In Production</option>
                  <option value="Dispatched" className="bg-[#211B17]">Dispatched</option>
                  <option value="Delivered" className="bg-[#211B17]">Delivered</option>
                  <option value="Cancelled" className="bg-[#211B17]">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="p-5 rounded-2xl bg-[#211B17] border border-white/10 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-medium text-white">
                  Customer Order Log & Dispatch Pipeline
                </h3>
                <span className="text-xs text-[#DFBF88] font-mono">
                  {filteredOrders.length} matching order(s)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[#DFBF88] font-semibold">
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Customer Info</th>
                      <th className="py-2.5 px-3">Item & Size</th>
                      <th className="py-2.5 px-3 text-right">Amount (PKR)</th>
                      <th className="py-2.5 px-3 text-center">Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/80 font-sans">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-white block">{ord.id}</span>
                          <span className="text-[10px] text-white/40 block">
                            {new Date(ord.createdAt).toLocaleDateString()} {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-medium text-white">{ord.customer.fullName}</p>
                          <p className="text-[11px] text-[#DFBF88] font-mono">{ord.customer.phone}</p>
                          <p className="text-[10px] text-white/50">{ord.customer.city}, {ord.customer.province}</p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="text-white font-medium">{ord.item.productName}</p>
                          <p className="text-[10px] text-white/60">
                            Size: {ord.item.size} · Qty: {ord.item.quantity}
                          </p>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                          PKR {ord.totalPKR.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <select
                            value={ord.orderStatus}
                            disabled={statusUpdatingId === ord.id}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value as any)}
                            className={`py-1 px-2.5 rounded-lg text-xs font-semibold focus:outline-none border cursor-pointer ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                                : ord.orderStatus === 'Dispatched'
                                ? 'bg-blue-950/60 border-blue-500/50 text-blue-300'
                                : ord.orderStatus === 'In Production'
                                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                                : ord.orderStatus === 'Confirmed'
                                ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                                : ord.orderStatus === 'Cancelled'
                                ? 'bg-red-950/60 border-red-500/50 text-red-300'
                                : 'bg-white/10 border-white/20 text-white'
                            }`}
                          >
                            <option value="Pending" className="bg-[#211B17] text-white">Pending</option>
                            <option value="Confirmed" className="bg-[#211B17] text-white">Confirmed</option>
                            <option value="In Production" className="bg-[#211B17] text-white">In Production</option>
                            <option value="Dispatched" className="bg-[#211B17] text-white">Dispatched</option>
                            <option value="Delivered" className="bg-[#211B17] text-white">Delivered</option>
                            <option value="Cancelled" className="bg-[#211B17] text-white">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-white/40">
                          No matching orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="p-4 bg-[#120E0C] border-t border-white/5 text-center text-xs text-white/40 font-sans">
        NOORBAL Commerce Engine · Executive Administration Session Active
      </footer>

    </div>
  );
};
