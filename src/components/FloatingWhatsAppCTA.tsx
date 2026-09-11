import React, { useState } from 'react';
import { socialLinks } from '../config/socialLinks';
import { WhatsAppBrandIcon } from './SocialIcons';

export const FloatingWhatsAppCTA: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside 
      aria-label="WhatsApp Concierge Support" 
      className="fixed bottom-20 right-3.5 sm:bottom-6 sm:right-6 z-30 flex items-center gap-2 group animate-in fade-in slide-in-from-bottom-3 duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Tooltip / Label on Desktop */}
      <span 
        className={`hidden sm:inline-block px-3 py-1.5 rounded-full bg-[#2B231E]/95 backdrop-blur-md text-white text-xs font-sans font-medium border border-[#C9A468]/50 shadow-lg pointer-events-none transition-all duration-200 ${
          isHovered ? 'opacity-100 -translate-x-1' : 'opacity-0 translate-x-2'
        }`}
      >
        Need help? Chat with NOORBAL
      </span>

      {/* Floating Action Button */}
      <a
        id="floating-whatsapp-btn"
        href={socialLinks.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Contact NOORBAL Concierge Support on WhatsApp"
        className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-108 active:scale-95 border-2 border-white cursor-pointer relative"
        title="Need help? Chat with NOORBAL Support"
        data-cursor-text="CHAT"
      >
        {/* Subtle breathing ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
        <WhatsAppBrandIcon className="w-6 h-6 fill-white relative z-10" />
      </a>
    </aside>
  );
};
