import React from 'react';
import { Truck, ShieldCheck, CreditCard } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const TrustBadges: React.FC = () => {
  return (
    <section className="bg-white py-8 sm:py-10 border-b border-[#E5DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          
          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] shadow-2xs">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#2B231E] text-[#C9A468] flex items-center justify-center shrink-0 shadow-xs">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-serif text-sm sm:text-base font-medium sm:font-semibold text-[#2B231E]">2–3 Days Delivery</h3>
              <p className="text-xs text-gray-500 font-sans mt-0.5 leading-normal">Express courier shipping across all of Pakistan</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] shadow-2xs">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#2B231E] text-[#DFBF88] flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-serif text-sm sm:text-base font-medium sm:font-semibold text-[#2B231E]">7 Days Warranty</h3>
              <p className="text-xs text-gray-500 font-sans mt-0.5 leading-normal">Hassle-free return & replacement guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] shadow-2xs">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#2B231E] text-[#C9A468] flex items-center justify-center shrink-0 shadow-xs">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-serif text-sm sm:text-base font-medium sm:font-semibold text-[#2B231E]">COD & Bank Transfer</h3>
              <p className="text-xs text-gray-500 font-sans mt-0.5 leading-normal">Cash on Delivery & easy bank wire options</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] shadow-2xs">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#2B231E] text-[#25D366] flex items-center justify-center shrink-0 shadow-xs">
              <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#25D366]" />
            </div>
            <div>
              <h3 className="font-serif text-sm sm:text-base font-medium sm:font-semibold text-[#2B231E]">WhatsApp Ordering</h3>
              <p className="text-xs text-gray-500 font-sans mt-0.5 leading-normal">Instant bespoke concierge & personal care</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
