import React, { useState } from 'react';
import { SOCIAL_CHANNELS, SocialChannel } from '../config/socialLinks';
import { getPlatformIcon } from './SocialIcons';
import { Sparkles, ExternalLink, Check, Copy } from 'lucide-react';

export const SocialHub: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, channel: SocialChannel) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(channel.handle);
    setCopiedId(channel.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section 
      id="connect-section" 
      className="py-12 sm:py-16 bg-[#FAF8F5] relative overflow-hidden border-t border-[#E5DFD5]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Simple, Refined Header */}
        <div className="space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2B231E]/5 border border-[#C9A468]/30 text-[#2B231E] text-xs font-medium tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-[#C9A468]" />
            <span>Official Channels</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#2B231E]">
            Connect With NOORBAL
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 font-sans">
            Reach our artisans and concierge directly across our official platforms.
          </p>
        </div>

        {/* Simple & Attractive Interactive Icons Grid */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {SOCIAL_CHANNELS.map((channel) => (
            <a
              key={channel.id}
              id={`connect-btn-${channel.id}`}
              href={channel.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Connect with NOORBAL on ${channel.name} (${channel.handle})`}
              className="group flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-[#E5DFD5] hover:border-[#C9A468] shadow-2xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {/* Brand Vector Icon with Hover Glow */}
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0"
                style={{
                  backgroundColor: channel.hoverBg,
                  color: channel.accentColor,
                }}
              >
                {getPlatformIcon(channel.id, 'w-5 h-5')}
              </div>

              {/* Channel Name & Handle */}
              <div className="text-left min-w-[110px]">
                <div className="flex items-center gap-1">
                  <span className="text-xs sm:text-sm font-serif font-bold text-[#2B231E] group-hover:text-[#C9A468] transition-colors">
                    {channel.name}
                  </span>
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-[#C9A468] transition-colors opacity-60 group-hover:opacity-100" />
                </div>
                <span className="block text-[11px] text-gray-500 font-sans tracking-tight group-hover:text-gray-700 transition-colors truncate max-w-[150px]">
                  {channel.handle}
                </span>
              </div>

              {/* Copy Button */}
              <button
                type="button"
                onClick={(e) => handleCopy(e, channel)}
                className="p-1.5 text-gray-400 hover:text-[#2B231E] hover:bg-[#FAF8F5] rounded-lg transition-colors ml-1"
                title={`Copy ${channel.handle}`}
                aria-label={`Copy ${channel.name} handle`}
              >
                {copiedId === channel.id ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
