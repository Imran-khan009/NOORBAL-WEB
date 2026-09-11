import React, { useState } from 'react';
import { SocialChannel } from '../config/socialLinks';
import { getPlatformIcon } from './SocialIcons';

interface SocialIconProps {
  channel: SocialChannel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const SocialIcon: React.FC<SocialIconProps> = ({
  channel,
  size = 'md',
  showLabel = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Size mapping
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-13 h-13 sm:w-14 sm:h-14',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5 sm:w-6 sm:h-6',
    lg: 'w-7 h-7',
  };

  return (
    <div
      className="relative flex flex-col items-center group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor-text={channel.name}
    >
      {/* Floating Tooltip with Smooth Transition */}
      <div
        role="tooltip"
        className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#2B231E] text-white text-[11px] font-sans font-medium whitespace-nowrap shadow-md pointer-events-none transition-all duration-300 z-30 border border-[#C9A468]/30 ${
          isHovered
            ? 'opacity-100 -translate-y-1 scale-100'
            : 'opacity-0 translate-y-1 scale-95'
        }`}
      >
        <span>{channel.name}</span>
        {/* Tooltip caret */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#2B231E]" />
      </div>

      {/* Interactive Icon Button */}
      <a
        id={`social-link-${channel.id}`}
        href={channel.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Connect with NOORBAL on ${channel.name} (${channel.handle})`}
        className={`relative ${sizeClasses[size]} rounded-2xl flex items-center justify-center transition-all duration-300 ease-out border backdrop-blur-xs ${
          isHovered
            ? 'scale-108 -translate-y-1 shadow-lg'
            : 'scale-100 translate-y-0 shadow-2xs'
        }`}
        style={{
          backgroundColor: isHovered ? channel.hoverBg : '#FAF8F5',
          borderColor: isHovered ? channel.accentColor : '#E5DFD5',
          color: isHovered ? channel.accentColor : '#2B231E',
          boxShadow: isHovered
            ? `0 8px 20px -4px ${channel.accentColor}25`
            : undefined,
        }}
      >
        {/* Subtle Ambient Radial Glow on Hover */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${channel.accentColor}15 0%, transparent 70%)`,
          }}
        />

        {/* Official Brand Vector Icon */}
        <div
          className={`transition-transform duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        >
          {getPlatformIcon(channel.id, iconSizes[size])}
        </div>
      </a>

      {showLabel && (
        <span
          className={`mt-2 text-[11px] font-medium tracking-wider uppercase transition-colors duration-200 ${
            isHovered ? 'text-[#2B231E] font-semibold' : 'text-gray-500'
          }`}
        >
          {channel.name}
        </span>
      )}
    </div>
  );
};
