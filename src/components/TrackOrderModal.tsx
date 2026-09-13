import React, { useState } from 'react';
import { 
  Package, 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Sparkles, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { WhatsAppBrandIcon } from './SocialIcons';
import { socialLinks } from '../config/socialLinks';
import { apiFetch } from '../utils/api';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
}

interface TrackedOrderDetails {
  id: string;
  productName: string;
  quantity: number;
  size: string;
  status: string;
  city?: string;
  province?: string;
  totalPKR?: number;
  createdAt?: string;
  courier?: string;
  trackingNumber?: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  initialOrderNumber = '',
}) => {
  const [orderQuery, setOrderQuery] = useState(initialOrderNumber || '');
  const [isLoading, setIsLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrderDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrack = async (queryToSearch?: string) => {
    const term = (queryToSearch ?? orderQuery).trim();
    if (!term) {
      setErrorMessage('Please enter an Order ID or phone number.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiFetch(`/api/orders/${encodeURIComponent(term)}/track`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.order) {
          setTrackedOrder(data.order);
        } else {
          setErrorMessage(data.error || 'Order not found. Please verify your order number.');
          setTrackedOrder(null);
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        setErrorMessage(errData.error || 'Could not locate this order. Please verify your ID or contact concierge.');
        setTrackedOrder(null);
      }
    } catch {
      setErrorMessage('Network connection issue. Please verify and try again.');
      setTrackedOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStepIndex = (statusStr: string = '') => {
    const s = statusStr.toLowerCase();
    if (s.includes('deliver') || s.includes('complete')) return 4;
    if (s.includes('dispatch') || s.includes('ship') || s.includes('transit')) return 3;
    if (s.includes('product') || s.includes('craft') || s.includes('embroid')) return 2;
    if (s.includes('confirm') || s.includes('verif') || s.includes('process')) return 1;
    return 0; // pending / received
  };

  const currentStep = trackedOrder ? getStatusStepIndex(trackedOrder.status) : 0;

  const steps = [
    { label: 'Order Received', desc: 'Logged & awaiting artisan review', icon: CheckCircle2 },
    { label: 'Verified', desc: 'Design & sizing confirmed', icon: Sparkles },
    { label: 'In Production', desc: 'Authentic Balochi hand-embroidery', icon: Clock },
    { label: 'Dispatched', desc: 'Shipped via Trax/TCS Courier', icon: Truck },
    { label: 'Delivered', desc: 'Delivered with 7-Day Warranty', icon: ShieldCheck },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div 
        id="track-order-dialog"
        className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#E5DFD5] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-[#2B231E] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-[#C9A468]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C9A468]/20 border border-[#C9A468]/40 flex items-center justify-center text-[#DFBF88]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold tracking-wide text-[#FAF8F5]">
                Track Your Order
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#DFBF88] font-sans tracking-wider uppercase">
                NOORBAL Nationwide Luxury Delivery
              </p>
            </div>
          </div>
          <button
            id="close-track-order-modal"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Close track order modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Search Form */}
          <div>
            <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#2B231E] mb-2">
              Enter Order ID or Mobile Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8D7B68] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="track-order-input"
                  type="text"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                  placeholder="e.g. NB-2026-48291 or 03001234567"
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#E5DFD5] rounded-xl text-xs sm:text-sm font-sans text-[#2B231E] placeholder:text-[#A89F91] focus:outline-none focus:border-[#C9A468] transition-colors shadow-xs"
                />
              </div>
              <button
                id="track-order-submit-btn"
                type="button"
                onClick={() => handleTrack()}
                disabled={isLoading}
                className="px-4 sm:px-5 py-2.5 bg-[#2B231E] hover:bg-[#3D322B] text-white rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isLoading ? 'Searching...' : 'Track'}
              </button>
            </div>

          {/* Form helper note */}
          <div className="text-[11px] text-[#8D7B68] -mt-3">
            Enter your unique order number provided upon checkout (e.g. NB-2026-XXXXX).
          </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Tracked Order Details Card */}
          {trackedOrder && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-white border border-[#E5DFD5] rounded-xl shadow-xs space-y-3">
                <div className="flex items-start justify-between border-b border-[#F0ECE6] pb-2.5">
                  <div>
                    <span className="text-[10px] uppercase font-sans font-semibold text-[#8D7B68] tracking-wider block">
                      Order Reference
                    </span>
                    <span className="font-mono text-sm sm:text-base font-bold text-[#2B231E]">
                      {trackedOrder.id}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-[#C9A468]/15 text-[#8D6B28] border border-[#C9A468]/30">
                    {trackedOrder.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#8D7B68] block text-[10px] uppercase tracking-wider">Product</span>
                    <span className="font-medium text-[#2B231E] line-clamp-1">{trackedOrder.productName}</span>
                  </div>
                  <div>
                    <span className="text-[#8D7B68] block text-[10px] uppercase tracking-wider">Size & Qty</span>
                    <span className="font-medium text-[#2B231E]">{trackedOrder.size} · Qty: {trackedOrder.quantity}</span>
                  </div>
                  {trackedOrder.city && (
                    <div>
                      <span className="text-[#8D7B68] block text-[10px] uppercase tracking-wider">Destination</span>
                      <span className="font-medium text-[#2B231E] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#C9A468]" />
                        {trackedOrder.city}, {trackedOrder.province || 'PK'}
                      </span>
                    </div>
                  )}
                  {trackedOrder.trackingNumber && (
                    <div>
                      <span className="text-[#8D7B68] block text-[10px] uppercase tracking-wider">Courier Consignment</span>
                      <span className="font-mono font-semibold text-[#2B231E]">
                        {trackedOrder.trackingNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Stepper Timeline */}
              <div className="p-4 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl space-y-3">
                <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-[#2B231E]">
                  Dispatch & Crafting Milestone
                </h4>

                <div className="space-y-3 pt-1">
                  {steps.map((step, idx) => {
                    const isDone = idx <= currentStep;
                    const isCurrent = idx === currentStep;
                    const StepIcon = step.icon;

                    return (
                      <div key={step.label} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div 
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                              isDone 
                                ? 'bg-[#C9A468] text-[#2B231E]' 
                                : 'bg-[#E5DFD5] text-[#8D7B68]'
                            }`}
                          >
                            <StepIcon className="w-3.5 h-3.5" />
                          </div>
                          {idx < steps.length - 1 && (
                            <div 
                              className={`w-0.5 h-6 my-0.5 ${
                                idx < currentStep ? 'bg-[#C9A468]' : 'bg-[#E5DFD5]'
                              }`} 
                            />
                          )}
                        </div>
                        <div className="pt-0.5">
                          <div className="flex items-center gap-2">
                            <span 
                              className={`text-xs font-sans font-bold uppercase tracking-wider ${
                                isCurrent 
                                  ? 'text-[#2B231E]' 
                                  : isDone 
                                  ? 'text-[#5C4D3C]' 
                                  : 'text-[#A89F91]'
                              }`}
                            >
                              {step.label}
                            </span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-sans font-semibold bg-[#C9A468]/20 text-[#8D6B28]">
                                Current Stage
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#8D7B68] font-sans">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Concierge Support Direct Help */}
          <div className="p-3.5 bg-white border border-[#E5DFD5] rounded-xl flex items-center justify-between gap-3">
            <div className="text-xs">
              <span className="font-semibold text-[#2B231E] block">Need Assistance with your Order?</span>
              <span className="text-[11px] text-[#8D7B68]">Our Karachi/Quetta concierge answers 24/7</span>
            </div>
            <a
              href={`${socialLinks.whatsapp}&text=${encodeURIComponent(
                trackedOrder 
                  ? `Hello NOORBAL, I would like to inquire about my Order #${trackedOrder.id}.`
                  : 'Hello NOORBAL, I would like assistance with my order tracking.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <WhatsAppBrandIcon className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF8F5] px-5 sm:px-6 py-3 border-t border-[#E5DFD5] flex items-center justify-between text-xs text-[#8D7B68]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A468]" />
            7-Day Replacement Warranty
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 border border-[#D5CEC4] hover:bg-black/5 text-[#2B231E] rounded-lg font-sans font-medium text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
