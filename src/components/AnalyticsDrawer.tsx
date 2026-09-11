import React, { useEffect, useState } from 'react';
import { X, BarChart3, TrendingUp, Users, MessageCircle, Eye, RefreshCw, Sparkles } from 'lucide-react';
import { AnalyticsEvent } from '../types';
import { getStoredEvents } from '../utils/analytics';

interface AnalyticsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsDrawer: React.FC<AnalyticsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  const loadEvents = () => {
    setEvents(getStoredEvents());
  };

  useEffect(() => {
    loadEvents();
    const handleUpdate = () => loadEvents();
    window.addEventListener('noorbal:analytics_updated', handleUpdate);
    return () => window.removeEventListener('noorbal:analytics_updated', handleUpdate);
  }, []);

  // Lock body scroll when drawer is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalPageViews = events.filter((e) => e.type === 'page_view').length || 1;
  const totalProductViews = events.filter((e) => e.type === 'product_view').length;
  const totalWhatsAppClicks = events.filter((e) => e.type === 'whatsapp_click').length;
  const conversionRate = totalProductViews > 0 
    ? ((totalWhatsAppClicks / totalProductViews) * 100).toFixed(1) 
    : '0.0';

  const clearAnalytics = () => {
    localStorage.removeItem('noorbal_analytics_events');
    setEvents([]);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-3 sm:pl-10">
        <div 
          className="w-screen max-w-md bg-[#2B231E] text-white shadow-2xl border-l border-[#C9A468]/30 flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#382E28]">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#C9A468] shrink-0" />
              <div>
                <h3 className="font-serif text-base sm:text-lg font-medium sm:font-semibold text-white">
                  NOORBAL Business Intelligence
                </h3>
                <p className="text-[10px] text-[#DFBF88] font-sans uppercase tracking-widest font-medium">
                  Live Conversion & Activity Funnel
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center active:scale-90 transition-all shrink-0 cursor-pointer"
              aria-label="Close analytics"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Metrics Overview */}
          <div className="p-5 overflow-y-auto flex-1 space-y-5 font-sans">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between text-[#DFBF88] text-xs font-sans">
                  <span>Product Views</span>
                  <Eye className="w-4 h-4 text-[#C9A468]" />
                </div>
                <div className="font-sans text-2xl font-bold mt-1 text-white">
                  {totalProductViews}
                </div>
                <p className="text-[10px] text-white/50 mt-0.5 font-sans">Customer product clicks</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between text-[#25D366] text-xs font-sans">
                  <span>WhatsApp Inquiries</span>
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="font-sans text-2xl font-bold mt-1 text-white">
                  {totalWhatsAppClicks}
                </div>
                <p className="text-[10px] text-white/50 mt-0.5 font-sans">High-intent conversions</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between text-[#C9A468] text-xs font-sans">
                  <span>Conversion Rate</span>
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="font-sans text-2xl font-bold mt-1 text-white">
                  {conversionRate}%
                </div>
                <p className="text-[10px] text-white/50 mt-0.5 font-sans">View-to-WhatsApp intent</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between text-sky-400 text-xs font-sans">
                  <span>Session Events</span>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="font-sans text-2xl font-bold mt-1 text-white">
                  {events.length}
                </div>
                <p className="text-[10px] text-white/50 mt-0.5 font-sans">Recorded user triggers</p>
              </div>
            </div>

            {/* Target Audience Strategy Insight */}
            <div className="p-4 rounded-xl bg-[#FAF8F5]/5 border border-[#C9A468]/30 space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#C9A468]">
                Conversion Funnel Strategy
              </h4>
              <p className="text-xs text-white/80 leading-relaxed">
                NOORBAL uses direct <strong>WhatsApp-first concierge commerce</strong> to build high-trust relationships with customers in Pakistan and overseas, backed by 2–3 days express delivery and a 7-day warranty.
              </p>
            </div>

            {/* Real-Time Event Log */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-[#DFBF88] uppercase tracking-wider">
                  Live Event Stream ({events.length})
                </h4>
                <button
                  type="button"
                  onClick={clearAnalytics}
                  className="text-[11px] text-white/40 hover:text-rose-400 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Logs</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 text-xs">
                {events.length === 0 ? (
                  <p className="text-white/40 text-center py-6 text-xs">
                    No interactions logged yet. Browse products or click WhatsApp buttons to see live analytics!
                  </p>
                ) : (
                  events.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-2 rounded bg-white/5 border border-white/5 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          evt.type === 'whatsapp_click' ? 'bg-[#25D366]' :
                          evt.type === 'product_view' ? 'bg-[#C9A468]' :
                          evt.type === 'wishlist_add' ? 'bg-rose-500' : 'bg-sky-400'
                        }`} />
                        <span className="text-white/90 font-medium">{evt.details}</span>
                      </div>
                      <span className="text-white/40 font-mono text-[10px]">{evt.timestamp}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-[#382E28] text-center text-xs text-white/60">
            NOORBAL Data & Analytics Strategy Engine · Privacy-Compliant Client BI
          </div>

        </div>
      </div>
    </div>
  );
};
