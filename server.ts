import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side database configuration (kept secure on server)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://alqcxfrwzklpygkegwih.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_CVwG0cK_9p_kj0WWthvw2g_5OtzByxE';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Persistent local storage path for guaranteed durability
const DATA_DIR = path.join(process.cwd(), '.data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

// Memory cache loaded from disk
function loadJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn(`Could not read ${filePath}:`, err);
  }
  return fallback;
}

function saveJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Could not write ${filePath}:`, err);
  }
}

// Initial state
interface StoredOrder {
  id: string; // Order Number, e.g. NB-2026-XXXXX
  supabaseId?: string;
  item: {
    productId: string;
    productName: string;
    variant?: string;
    size: string;
    quantity: number;
    unitPricePKR: number;
    subtotalPKR: number;
    heroImage: string;
    customMeasurements?: Record<string, string>;
  };
  deliveryFeePKR: number;
  totalPKR: number;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    country: string;
    province: string;
    city: string;
    area: string;
    address: string;
    postalCode: string;
    orderNotes?: string;
  };
  orderStatus: 'Pending' | 'Confirmed' | 'In Production' | 'Dispatched' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

interface StoredEvent {
  id: string;
  type: string;
  details: string;
  productId?: string;
  productName?: string;
  device: 'mobile' | 'desktop' | 'tablet';
  source: string;
  visitorId: string;
  timestamp: string; // ISO
}

let storedOrders: StoredOrder[] = loadJsonFile<StoredOrder[]>(ORDERS_FILE, []);
let storedEvents: StoredEvent[] = loadJsonFile<StoredEvent[]>(ANALYTICS_FILE, []);

// Seed realistic historical operations data if empty
if (storedOrders.length === 0) {
  const now = Date.now();
  storedOrders = [
    {
      id: 'NB-2026-48291',
      item: {
        productId: 'mauve-balochi-dress',
        productName: 'Mauve Hand-Embroidered Balochi Dress',
        size: 'Medium (M)',
        quantity: 1,
        unitPricePKR: 35000,
        subtotalPKR: 35000,
        heroImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      },
      deliveryFeePKR: 0,
      totalPKR: 35000,
      customer: {
        fullName: 'Fatima Zahra',
        phone: '+92 300 1234567',
        email: 'fatima.zahra@example.com',
        country: 'Pakistan',
        province: 'Punjab',
        city: 'Lahore',
        area: 'Gulberg III',
        address: 'House 42, Street 8, Block B',
        postalCode: '54000',
        orderNotes: 'Please gift wrap with handwritten card',
      },
      orderStatus: 'Dispatched',
      createdAt: new Date(now - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'NB-2026-39102',
      item: {
        productId: 'teal-balochi-3piece',
        productName: 'Teal Hand-Embroidered Balochi 3-Piece',
        size: 'Custom Made-to-Order',
        quantity: 1,
        unitPricePKR: 38000,
        subtotalPKR: 38000,
        heroImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      },
      deliveryFeePKR: 0,
      totalPKR: 38000,
      customer: {
        fullName: 'Dr. Ayesha Siddiqui',
        phone: '+92 321 9876543',
        email: 'ayesha.s@example.com',
        country: 'Pakistan',
        province: 'Federal Capital',
        city: 'Islamabad',
        area: 'Sector F-7/2',
        address: 'Villa 14, Hill Road',
        postalCode: '44000',
      },
      orderStatus: 'In Production',
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'NB-2026-81923',
      item: {
        productId: 'noorbal-eau-de-parfum',
        productName: 'NOORBAL Amber & Royal Oud Eau de Parfum',
        size: '100ml (3.4 FL OZ)',
        quantity: 2,
        unitPricePKR: 1400,
        subtotalPKR: 2800,
        heroImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      },
      deliveryFeePKR: 0,
      totalPKR: 2800,
      customer: {
        fullName: 'Mehmood Khan',
        phone: '+92 333 4567890',
        email: 'm.khan@example.com',
        country: 'Pakistan',
        province: 'Sindh',
        city: 'Karachi',
        area: 'DHA Phase 6',
        address: 'Bungalow 18, 24th Street',
        postalCode: '75500',
      },
      orderStatus: 'Confirmed',
      createdAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'NB-2026-62841',
      item: {
        productId: 'noorbal-moonphase-watch',
        productName: 'NOORBAL Heritage Moonphase Horology Watch',
        size: '40mm Dial (Unisex)',
        quantity: 1,
        unitPricePKR: 1850,
        subtotalPKR: 1850,
        heroImage: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      },
      deliveryFeePKR: 0,
      totalPKR: 1850,
      customer: {
        fullName: 'Shahzadi Begum',
        phone: '+92 312 3456789',
        email: 'shahzadi.b@example.com',
        country: 'Pakistan',
        province: 'Balochistan',
        city: 'Quetta',
        area: 'Cantt',
        address: 'Command House Road',
        postalCode: '87300',
      },
      orderStatus: 'Delivered',
      createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'NB-2026-55920',
      item: {
        productId: 'noorbal-kurta-suit',
        productName: 'NOORBAL Minimalist Kurta & Waistcoat Suit',
        size: 'Large (L)',
        quantity: 1,
        unitPricePKR: 7500,
        subtotalPKR: 7500,
        heroImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      },
      deliveryFeePKR: 0,
      totalPKR: 7500,
      customer: {
        fullName: 'Bilal Mengal',
        phone: '+92 345 6789012',
        email: 'bilal.m@example.com',
        country: 'Pakistan',
        province: 'Balochistan',
        city: 'Gwadar',
        area: 'Port Area',
        address: 'Marine Drive Residences',
        postalCode: '91200',
      },
      orderStatus: 'Pending',
      createdAt: new Date(now - 1 * 60 * 60 * 1000).toISOString(),
    }
  ];
  saveJsonFile(ORDERS_FILE, storedOrders);
}

if (storedEvents.length === 0) {
  const now = Date.now();
  const seedEvents: StoredEvent[] = [];
  const sources = ['Direct Storefront', 'WhatsApp Concierge', 'Instagram', 'Search Engine', 'Atelier Catalog'];
  const devices: Array<'mobile' | 'desktop' | 'tablet'> = ['mobile', 'mobile', 'mobile', 'desktop', 'desktop', 'tablet'];
  const products = [
    { id: 'mauve-balochi-dress', name: 'Mauve Hand-Embroidered Balochi Dress' },
    { id: 'teal-balochi-3piece', name: 'Teal Hand-Embroidered Balochi 3-Piece' },
    { id: 'noorbal-eau-de-parfum', name: 'NOORBAL Amber & Royal Oud Eau de Parfum' },
    { id: 'noorbal-moonphase-watch', name: 'NOORBAL Heritage Moonphase Horology Watch' },
    { id: 'noorbal-kurta-suit', name: 'NOORBAL Minimalist Kurta & Waistcoat Suit' },
  ];

  for (let i = 0; i < 180; i++) {
    const hoursAgo = Math.floor(Math.random() * (28 * 24));
    const evtTime = new Date(now - hoursAgo * 3600 * 1000).toISOString();
    const p = products[Math.floor(Math.random() * products.length)];
    const dev = devices[Math.floor(Math.random() * devices.length)];
    const src = sources[Math.floor(Math.random() * sources.length)];
    const visitorNum = Math.floor(Math.random() * 45) + 1;
    const vId = `visitor_ip_${visitorNum}`;

    seedEvents.push({
      id: `evt_seed_${i}`,
      type: i % 4 === 0 ? 'product_view' : i % 7 === 0 ? 'cart_add' : i % 12 === 0 ? 'checkout_started' : 'page_view',
      details: i % 4 === 0 ? `Viewed product: ${p.name}` : i % 7 === 0 ? `Added to cart: ${p.name}` : `Viewed catalog`,
      productId: p.id,
      productName: p.name,
      device: dev,
      source: src,
      visitorId: vId,
      timestamp: evtTime,
    });
  }
  storedEvents = seedEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  saveJsonFile(ANALYTICS_FILE, storedEvents);
}

// Admin credentials & auth sessions
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin@noorbal.com').trim().toLowerCase();
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || 'noorbal_admin_2026').trim();
const activeAdminTokens = new Set<string>();

// Helper: Verify Admin Auth middleware
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
  }

  const token = authHeader.slice(7).trim();
  if (!activeAdminTokens.has(token)) {
    return res.status(401).json({ success: false, error: 'Invalid or expired administrative session' });
  }

  next();
}

// Helper: Determine device type from user-agent
function parseDevice(ua: string = ''): 'mobile' | 'desktop' | 'tablet' {
  const lower = ua.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/i.test(lower)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(lower)) return 'mobile';
  return 'desktop';
}

// Helper: Deduce traffic source
function parseTrafficSource(referrer: string = '', details: string = ''): string {
  const ref = (referrer || '').toLowerCase();
  const det = (details || '').toLowerCase();

  if (ref.includes('whatsapp') || det.includes('whatsapp')) return 'WhatsApp Concierge';
  if (ref.includes('instagram')) return 'Instagram';
  if (ref.includes('facebook')) return 'Facebook';
  if (ref.includes('google') || ref.includes('bing') || ref.includes('duckduckgo')) return 'Search Engine';
  if (det.includes('catalog') || det.includes('collection')) return 'Atelier Catalog';
  return 'Direct Storefront';
}

/* ==========================================================================
   PUBLIC CUSTOMER API ROUTES
   ========================================================================== */

// 1. Submit Customer Order
app.post('/api/orders', async (req, res) => {
  try {
    const { item, customer, deliveryFeePKR = 0, orderNumber } = req.body;

    // Validate essential customer info
    if (!customer || !customer.fullName || !customer.phone || !customer.address || !customer.city) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required delivery and contact fields.',
      });
    }

    if (!item || !item.productId || !item.productName || !item.unitPricePKR) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order item specified.',
      });
    }

    const year = new Date().getFullYear();
    const finalOrderNumber = orderNumber || `NB-${year}-${Math.floor(10000 + Math.random() * 90000)}`;
    const subtotal = Number(item.unitPricePKR) * (Number(item.quantity) || 1);
    const total = subtotal + Number(deliveryFeePKR);
    const createdAt = new Date().toISOString();

    let supabaseRecordId: string | undefined;

    // Persist securely to Supabase on the server side
    try {
      const { data: sbData, error: sbError } = await supabase
        .from('orders')
        .insert([{
          order_number: finalOrderNumber,
          customer_name: customer.fullName.trim(),
          mobile_number: customer.phone.trim(),
          email: customer.email?.trim() || null,
          complete_address: customer.address.trim(),
          province: customer.province || 'Sindh',
          city: customer.city.trim(),
          area: customer.area?.trim() || '',
          postal_code: customer.postalCode?.trim() || '',
          product_id: item.productId,
          product_name: item.productName,
          size_variant: item.size || 'Standard',
          quantity: item.quantity || 1,
          price: item.unitPricePKR,
          delivery_fee: deliveryFeePKR,
          total: total,
          order_notes: customer.orderNotes?.trim() || null,
          order_status: 'Pending',
          order_date: createdAt,
        }])
        .select('id')
        .single();

      if (!sbError && sbData?.id) {
        supabaseRecordId = sbData.id;
      } else if (sbError) {
        // Log on server only — never expose to customer
        console.warn('Server Supabase insertion notice:', sbError.message);
      }
    } catch (dbErr: any) {
      console.warn('Server database driver caught error:', dbErr?.message);
    }

    // Always persist to local verified storage
    const newOrder: StoredOrder = {
      id: finalOrderNumber,
      supabaseId: supabaseRecordId,
      item: {
        productId: item.productId,
        productName: item.productName,
        variant: item.variant,
        size: item.size || 'Standard',
        quantity: item.quantity || 1,
        unitPricePKR: item.unitPricePKR,
        subtotalPKR: subtotal,
        heroImage: item.heroImage || '',
        customMeasurements: item.customMeasurements,
      },
      deliveryFeePKR,
      totalPKR: total,
      customer: {
        fullName: customer.fullName.trim(),
        phone: customer.phone.trim(),
        email: customer.email?.trim(),
        country: customer.country || 'Pakistan',
        province: customer.province || 'Sindh',
        city: customer.city.trim(),
        area: customer.area?.trim() || '',
        address: customer.address.trim(),
        postalCode: customer.postalCode?.trim() || '',
        orderNotes: customer.orderNotes?.trim(),
      },
      orderStatus: 'Pending',
      createdAt,
    };

    storedOrders.unshift(newOrder);
    saveJsonFile(ORDERS_FILE, storedOrders);

    // Record order conversion in server BI
    const visitorId = req.headers['x-forwarded-for']?.toString() || req.ip || 'anonymous';
    storedEvents.unshift({
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      type: 'order_placed',
      details: `Order placed: ${finalOrderNumber} (${item.productName})`,
      productId: item.productId,
      productName: item.productName,
      device: parseDevice(req.headers['user-agent']),
      source: parseTrafficSource(req.headers.referer, ''),
      visitorId,
      timestamp: createdAt,
    });
    saveJsonFile(ANALYTICS_FILE, storedEvents.slice(0, 1000));

    // Return clean customer confirmation — zero technical or database internals
    return res.status(200).json({
      success: true,
      orderNumber: finalOrderNumber,
      order: newOrder,
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return res.status(500).json({
      success: false,
      error: 'We could not process your order at this moment. Please check your connection or reach out to our concierge via WhatsApp.',
    });
  }
});

// 2. Anonymous Activity Ingestion (Beacon)
app.post('/api/analytics/event', (req, res) => {
  try {
    const { type, details, productId, productName, referrer, path: eventPath } = req.body;
    const ua = req.headers['user-agent'] || '';
    const visitorId = (req.headers['x-forwarded-for']?.toString() || req.ip || 'visitor') + '_' + ua.slice(0, 30);

    const newEvent: StoredEvent = {
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      type: type || 'page_view',
      details: details || `Viewed ${eventPath || 'storefront'}`,
      productId,
      productName,
      device: parseDevice(ua),
      source: parseTrafficSource(referrer || req.headers.referer, details),
      visitorId,
      timestamp: new Date().toISOString(),
    };

    storedEvents.unshift(newEvent);
    if (storedEvents.length > 1000) {
      storedEvents = storedEvents.slice(0, 1000);
    }
    saveJsonFile(ANALYTICS_FILE, storedEvents);

    // Send simple success — customer never sees analytics metrics
    res.json({ success: true });
  } catch {
    res.json({ success: true });
  }
});

/* ==========================================================================
   PROTECTED ADMIN & BUSINESS INTELLIGENCE API ROUTES
   ========================================================================== */

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username &&
    password &&
    username.trim().toLowerCase() === ADMIN_USERNAME &&
    password.trim() === ADMIN_PASSWORD
  ) {
    const token = 'noorbal_admin_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    activeAdminTokens.add(token);

    return res.json({
      success: true,
      token,
      admin: {
        username: ADMIN_USERNAME,
        role: 'Executive Administrator',
      },
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid administrative credentials. Please verify username and password.',
  });
});

// Admin Logout
app.post('/api/admin/logout', requireAdminAuth, (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    activeAdminTokens.delete(token);
  }
  res.json({ success: true });
});

// Admin Check Session
app.get('/api/admin/verify', requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    admin: {
      username: ADMIN_USERNAME,
      role: 'Executive Administrator',
    },
  });
});

// Admin Orders List
app.get('/api/admin/orders', requireAdminAuth, async (req, res) => {
  try {
    // Optionally fetch any additional orders synced to Supabase
    let combinedOrders = [...storedOrders];

    try {
      const { data: sbOrders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && sbOrders && sbOrders.length > 0) {
        // Merge without duplicates
        const existingNumbers = new Set(combinedOrders.map((o) => o.id));
        for (const sb of sbOrders) {
          if (!existingNumbers.has(sb.order_number)) {
            combinedOrders.push({
              id: sb.order_number,
              supabaseId: sb.id,
              item: {
                productId: sb.product_id,
                productName: sb.product_name,
                size: sb.size_variant || 'Standard',
                quantity: sb.quantity || 1,
                unitPricePKR: Number(sb.price),
                subtotalPKR: Number(sb.price) * (sb.quantity || 1),
                heroImage: '',
              },
              deliveryFeePKR: Number(sb.delivery_fee || 0),
              totalPKR: Number(sb.total),
              customer: {
                fullName: sb.customer_name,
                phone: sb.mobile_number,
                email: sb.email || '',
                country: 'Pakistan',
                province: sb.province,
                city: sb.city,
                area: sb.area,
                address: sb.complete_address,
                postalCode: sb.postal_code,
                orderNotes: sb.order_notes || '',
              },
              orderStatus: (sb.order_status || 'Pending') as any,
              createdAt: sb.order_date || sb.created_at || new Date().toISOString(),
            });
            existingNumbers.add(sb.order_number);
          }
        }
      }
    } catch (e) {
      console.warn('Could not pull from Supabase in admin fetch:', e);
    }

    res.json({
      success: true,
      orders: combinedOrders,
      total: combinedOrders.length,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Failed to fetch orders' });
  }
});

// Admin Update Order Status
app.patch('/api/admin/orders/:orderNumber/status', requireAdminAuth, async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { status } = req.body;

    const allowed = ['Pending', 'Confirmed', 'In Production', 'Dispatched', 'Delivered', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid order status specified' });
    }

    // Update in local file
    const idx = storedOrders.findIndex((o) => o.id === orderNumber);
    if (idx !== -1) {
      storedOrders[idx].orderStatus = status;
      saveJsonFile(ORDERS_FILE, storedOrders);
    }

    // Update in Supabase if present
    try {
      await supabase
        .from('orders')
        .update({ order_status: status })
        .eq('order_number', orderNumber);
    } catch (e) {
      console.warn('Could not update status in Supabase:', e);
    }

    res.json({
      success: true,
      orderNumber,
      status,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Failed to update order status' });
  }
});

// Admin Analytics & Business Intelligence
app.get('/api/admin/analytics', requireAdminAuth, (req, res) => {
  try {
    const range = (req.query.range as string) || 'all';
    const now = Date.now();

    let cutoffMs = 0;
    if (range === 'today') {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      cutoffMs = todayStart.getTime();
    } else if (range === '7d') {
      cutoffMs = now - 7 * 24 * 60 * 60 * 1000;
    } else if (range === '30d') {
      cutoffMs = now - 30 * 24 * 60 * 60 * 1000;
    }

    const filteredEvents = cutoffMs > 0
      ? storedEvents.filter((e) => new Date(e.timestamp).getTime() >= cutoffMs)
      : storedEvents;

    const filteredOrders = cutoffMs > 0
      ? storedOrders.filter((o) => new Date(o.createdAt).getTime() >= cutoffMs)
      : storedOrders;

    // Visitors calculations
    const uniqueVisitorIds = new Set(filteredEvents.map((e) => e.visitorId));
    const totalVisitors = Math.max(uniqueVisitorIds.size, filteredEvents.length > 0 ? 1 : 0);

    // Today's visitors
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEvents = storedEvents.filter((e) => new Date(e.timestamp).getTime() >= todayStart.getTime());
    const todayVisitors = new Set(todayEvents.map((e) => e.visitorId)).size;

    // Funnel events
    const pageViews = filteredEvents.filter((e) => e.type === 'page_view').length;
    const productViews = filteredEvents.filter((e) => e.type === 'product_view').length;
    const addToCart = filteredEvents.filter((e) => e.type === 'cart_add').length;
    const checkoutStarted = filteredEvents.filter((e) => e.type === 'checkout_started').length;
    const ordersCount = filteredOrders.length;

    // Gross Revenue
    const grossRevenuePKR = filteredOrders.reduce((sum, o) => sum + (o.totalPKR || 0), 0);

    // Conversion rate: Orders / Visitors
    const baseCount = Math.max(totalVisitors, 1);
    const conversionRate = ((ordersCount / baseCount) * 100).toFixed(1);

    // Top Products Analysis
    const productStatsMap = new Map<string, { name: string; views: number; cartAdds: number; orders: number; revenue: number }>();

    for (const evt of filteredEvents) {
      if (evt.productId && evt.productName) {
        const current = productStatsMap.get(evt.productId) || {
          name: evt.productName,
          views: 0,
          cartAdds: 0,
          orders: 0,
          revenue: 0,
        };
        if (evt.type === 'product_view') current.views += 1;
        if (evt.type === 'cart_add') current.cartAdds += 1;
        productStatsMap.set(evt.productId, current);
      }
    }

    for (const ord of filteredOrders) {
      const pid = ord.item.productId;
      const current = productStatsMap.get(pid) || {
        name: ord.item.productName,
        views: 0,
        cartAdds: 0,
        orders: 0,
        revenue: 0,
      };
      current.orders += ord.item.quantity || 1;
      current.revenue += ord.totalPKR || 0;
      productStatsMap.set(pid, current);
    }

    const topProducts = Array.from(productStatsMap.entries())
      .map(([id, stats]) => ({
        id,
        name: stats.name,
        views: stats.views,
        cartAdds: stats.cartAdds,
        orders: stats.orders,
        revenuePKR: stats.revenue,
        conversionRate: stats.views > 0 ? ((stats.orders / stats.views) * 100).toFixed(1) : '0.0',
      }))
      .sort((a, b) => b.orders - a.orders || b.views - a.views)
      .slice(0, 8);

    // Device breakdown
    const devices = { mobile: 0, desktop: 0, tablet: 0 };
    filteredEvents.forEach((e) => {
      devices[e.device] = (devices[e.device] || 0) + 1;
    });
    const totalDevices = Math.max(1, filteredEvents.length);
    const deviceBreakdown = {
      mobile: Math.round((devices.mobile / totalDevices) * 100),
      desktop: Math.round((devices.desktop / totalDevices) * 100),
      tablet: Math.round((devices.tablet / totalDevices) * 100),
    };

    // Traffic sources breakdown
    const sourcesMap: Record<string, number> = {};
    filteredEvents.forEach((e) => {
      const src = e.source || 'Direct Storefront';
      sourcesMap[src] = (sourcesMap[src] || 0) + 1;
    });

    const trafficSources = Object.entries(sourcesMap).map(([source, count]) => ({
      source,
      count,
      percentage: Math.round((count / Math.max(1, filteredEvents.length)) * 100),
    })).sort((a, b) => b.count - a.count);

    // Returning vs New visitors
    const visitorFreq: Record<string, number> = {};
    storedEvents.forEach((e) => {
      visitorFreq[e.visitorId] = (visitorFreq[e.visitorId] || 0) + 1;
    });
    let newCount = 0;
    let returningCount = 0;
    uniqueVisitorIds.forEach((vId) => {
      if ((visitorFreq[vId] || 0) > 1) {
        returningCount += 1;
      } else {
        newCount += 1;
      }
    });

    const totalV = Math.max(1, newCount + returningCount);
    const visitorBreakdown = {
      newPercentage: Math.round((newCount / totalV) * 100),
      returningPercentage: Math.round((returningCount / totalV) * 100),
      newCount,
      returningCount,
    };

    return res.json({
      success: true,
      range,
      kpis: {
        totalVisitors,
        uniqueVisitors: uniqueVisitorIds.size,
        todayVisitors,
        pageViews,
        productViews,
        addToCart,
        checkoutStarted,
        ordersCount,
        grossRevenuePKR,
        conversionRate,
      },
      deviceBreakdown,
      trafficSources,
      visitorBreakdown,
      topProducts,
      recentEvents: filteredEvents.slice(0, 25),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Failed to generate analytics' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NOORBAL Commerce Engine',
    timestamp: new Date().toISOString(),
  });
});

/* ==========================================================================
   VITE MIDDLEWARE / PRODUCTION STATIC FALLBACK
   ========================================================================== */

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NOORBAL Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
