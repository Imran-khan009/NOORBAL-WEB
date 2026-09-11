import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export const WhatsAppBrandIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.24 3.67 16.31 4.53 17.87 6.09C19.42 7.64 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.56 20.16 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.04 3.67ZM8.53 7.33C8.36 7.33 8.08 7.39 7.84 7.65C7.6 7.91 6.92 8.55 6.92 9.85C6.92 11.15 7.87 12.4 8.01 12.58C8.14 12.76 9.83 15.37 12.43 16.49C14.59 17.42 15.03 17.23 15.5 17.19C15.96 17.14 17 16.57 17.2 16C17.41 15.43 17.41 14.95 17.34 14.85C17.27 14.75 17.1 14.69 16.84 14.56C16.58 14.43 15.32 13.81 15.09 13.72C14.85 13.64 14.68 13.6 14.51 13.85C14.34 14.11 13.84 14.69 13.69 14.86C13.54 15.03 13.39 15.05 13.13 14.92C12.87 14.79 12.04 14.52 11.05 13.64C10.28 12.95 9.76 12.1 9.61 11.85C9.47 11.59 9.6 11.45 9.73 11.32C9.84 11.21 9.98 11.03 10.12 10.87C10.25 10.71 10.3 10.59 10.39 10.42C10.47 10.25 10.43 10.11 10.37 9.98C10.3 9.85 9.8 8.63 9.59 8.12C9.39 7.63 9.18 7.69 9.03 7.69C8.88 7.68 8.71 7.68 8.53 7.68V7.33Z" />
  </svg>
);

export const InstagramBrandIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" />
  </svg>
);

export const FacebookBrandIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const MessengerBrandIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <path d="M12 2C6.36 2 2 6.13 2 11.7C2 14.88 3.45 17.65 5.82 19.43V22.5L8.74 20.9C9.77 21.19 10.86 21.35 12 21.35C17.64 21.35 22 17.22 22 11.65C22 6.08 17.64 2 12 2ZM13.06 14.94L10.5 12.2L5.5 14.94L10.94 9.17L13.5 11.91L18.5 9.17L13.06 14.94Z" />
  </svg>
);

export const TikTokBrandIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.31 0 .61.05.89.14V9.02a6.34 6.34 0 0 0-.89-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.17a8.16 8.16 0 0 0 4.76 1.52v-3.4c-.4-.01-.79-.21-1.1-.6z" />
  </svg>
);

export const YouTubeBrandIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const GmailBrandIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    {...props}
  >
    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
  </svg>
);

export const getPlatformIcon = (id: string, className = 'w-5 h-5') => {
  switch (id) {
    case 'whatsapp':
      return <WhatsAppBrandIcon className={className} />;
    case 'instagram':
      return <InstagramBrandIcon className={className} />;
    case 'facebook':
      return <FacebookBrandIcon className={className} />;
    case 'messenger':
      return <MessengerBrandIcon className={className} />;
    case 'tiktok':
      return <TikTokBrandIcon className={className} />;
    case 'youtube':
      return <YouTubeBrandIcon className={className} />;
    case 'email':
    default:
      return <GmailBrandIcon className={className} />;
  }
};
