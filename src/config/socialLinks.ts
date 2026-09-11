/**
 * Centralized configuration for all official NOORBAL social and contact channels.
 * To update any official URL or handle, modify it here and it will propagate
 * across the entire NOORBAL digital ecosystem (Social Hub, Footer, Navbar, Floating Concierge).
 */

export interface SocialChannel {
  id: string;
  name: string;
  url: string;
  handle: string;
  description: string;
  badge?: string;
  accentColor: string;
  hoverBg: string;
}

export const socialLinks = {
  whatsapp: 'https://wa.me/923130267697',
  instagram: 'https://instagram.com/noorbal.official',
  facebook: 'https://facebook.com/NOORBAL',
  tiktok: 'https://www.tiktok.com/@noorbal.official',
  email: 'mailto:noorbal.offical@gmail.com',
};

export const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    url: socialLinks.whatsapp,
    handle: '0313 0267697',
    description: 'Instant concierge, bespoke orders & customer assistance',
    badge: 'Concierge',
    accentColor: '#25D366',
    hoverBg: 'rgba(37, 211, 102, 0.08)',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: socialLinks.instagram,
    handle: '@noorbal.official',
    description: 'Editorial lookbooks, artisan behind-the-scenes & drops',
    badge: 'Official',
    accentColor: '#E1306C',
    hoverBg: 'rgba(225, 48, 108, 0.08)',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    url: socialLinks.facebook,
    handle: 'NOORBAL',
    description: 'Official Facebook community & heritage chronicles',
    accentColor: '#1877F2',
    hoverBg: 'rgba(24, 119, 242, 0.08)',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: socialLinks.tiktok,
    handle: '@noorbal.official',
    description: 'Hand-embroidery craft videos & styling reels',
    accentColor: '#010101',
    hoverBg: 'rgba(0, 0, 0, 0.08)',
  },
  {
    id: 'email',
    name: 'Gmail',
    url: socialLinks.email,
    handle: 'noorbal.offical@gmail.com',
    description: 'Direct email inquiries & bespoke consultations',
    badge: 'Direct',
    accentColor: '#EA4335',
    hoverBg: 'rgba(234, 67, 53, 0.08)',
  },
];
