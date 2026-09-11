-- ==============================================================================
-- NOORBAL Luxury E-Commerce: Supabase Database Schema & RLS Policies
-- Project ID: alqcxfrwzklpygkegwih
-- ==============================================================================

-- 1. Create the `orders` table with all customer and product fields
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email TEXT,
  complete_address TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  size_variant TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL,
  delivery_fee NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  order_notes TEXT,
  order_status TEXT NOT NULL DEFAULT 'Pending',
  order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS) to keep customer data private and secure
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow customers to place/submit orders (INSERT)
CREATE POLICY "Allow public order placement"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. Policy: Allow lookup by order_number for order confirmation display
CREATE POLICY "Allow customer order confirmation lookup"
ON public.orders
FOR SELECT
TO anon, authenticated
USING (true);

-- 5. Indexes for fast retrieval
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_mobile_number ON public.orders(mobile_number);
