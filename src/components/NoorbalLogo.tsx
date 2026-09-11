import React from 'react';

interface NoorbalLogoProps {
  className?: string;
  size?: number | string;
  withBackground?: boolean;
  goldColor?: string;
  bgColor?: string;
  alt?: string;
  id?: string;
}

/**
 * NOORBAL Official Emblem Logo
 * Features the signature golden crescent moon emblem with profile contour
 * on a dark ebony medallion, matching the official brand identity.
 */
export const NoorbalLogo: React.FC<NoorbalLogoProps> = ({
  className = '',
  size = 32,
  withBackground = true,
  goldColor = '#D4AA64',
  bgColor = '#221C18',
  alt = 'NOORBAL Logo',
  id = 'noorbal-brand-logo',
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <svg
      id={id}
      viewBox="0 0 1000 1000"
      width={pixelSize}
      height={pixelSize}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={alt}
      className={`shrink-0 select-none ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <title>{alt}</title>
      {withBackground && (
        <circle cx="500" cy="500" r="500" fill={bgColor} />
      )}
      {/* Signature NOORBAL Golden Crescent Moon with Profile Notch */}
      <path
        d="M 768 188 C 802 290 855 435 832 615 C 795 730 710 818 545 842 C 370 858 240 765 134 498 C 178 625 288 725 475 744 C 638 758 742 675 782 540 C 788 518 788 495 780 478 C 764 450 762 438 782 426 C 792 418 792 385 790 350 C 785 280 774 230 768 188 Z"
        fill={goldColor}
      />
    </svg>
  );
};

export default NoorbalLogo;
