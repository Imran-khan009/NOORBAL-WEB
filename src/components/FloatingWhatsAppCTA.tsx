import React, { useState } from 'react';
import { socialLinks } from '../config/socialLinks';
import { WhatsAppBrandIcon } from './SocialIcons';

export const FloatingWhatsAppCTA: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside 
      aria-label="WhatsApp Concierge Support" 
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Tooltip / Label */}
      <span 
        className={`hidden sm:inline-block px-3 py-1.5 rounded-full bg-[#2B231E]/95 backdrop-blur-md text-white text-xs font-sans font-medium border border-[#C9A468]/50 shadow-lg pointer-events-none transition-all duration-200 ${
          isHovered ? 'opacity-100 -translate-x-1' : 'opacity-0 translate-x-2'
        }`}
      >
        Need help?
      </span>

      {/* Floating Action Button */}
      <a
        id="floating-whatsapp-btn"
        href={socialLinks.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Contact NOORBAL Concierge Support on WhatsApp"
        className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-108 active:scale-95 border-2 border-white"
        title="Need help? Chat with NOORBAL Support"
        data-cursor-text="CHAT"
      >
        <WhatsAppBrandIcon className="w-6 h-6 fill-white" />
      </a>
    </aside>
  );
};
