import React from 'react';
import { Truck, ShieldCheck, CreditCard } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const TrustBadges: React.FC = () => {
  return (
    <section className="bg-white py-10 border-b border-[#E5DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
            <div className="w-12 h-12 rounded-xl bg-[#2B231E] text-[#C9A468] flex items-center justify-center shrink-0 shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#2B231E]">2–3 Days Delivery</h4>
              <p className="text-xs text-gray-500 mt-0.5">Express courier shipping across all of Pakistan</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
            <div className="w-12 h-12 rounded-xl bg-[#2B231E] text-[#DFBF88] flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#2B231E]">7 Days Warranty</h4>
              <p className="text-xs text-gray-500 mt-0.5">Hassle-free return & replacement guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
            <div className="w-12 h-12 rounded-xl bg-[#2B231E] text-[#C9A468] flex items-center justify-center shrink-0 shadow-sm">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#2B231E]">COD & Bank Transfer</h4>
              <p className="text-xs text-gray-500 mt-0.5">Cash on Delivery & easy bank wire options</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
            <div className="w-12 h-12 rounded-xl bg-[#2B231E] text-[#25D366] flex items-center justify-center shrink-0 shadow-sm">
              <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#2B231E]">WhatsApp Ordering</h4>
              <p className="text-xs text-gray-500 mt-0.5">Instant bespoke concierge & personal care</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
