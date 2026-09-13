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

-- 3. Policy: Allow customers to place/submit orders (INSERT ONLY)
-- Anonymous and authenticated users are permitted to insert their new checkout orders.
CREATE POLICY "Allow public order placement"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. SECURITY ENFORCEMENT: ZERO PUBLIC SELECT ACCESS
-- The previous policy ("Allow customer order confirmation lookup" with USING (true))
-- has been REMOVED to prevent unauthorized public dumping or enumeration of customer data.
-- Direct SELECT access by anon/authenticated roles is strictly DENIED by PostgreSQL RLS default-deny.
-- All order tracking and retrieval must occur exclusively through the backend API
-- using the server-side service_role key or protected backend endpoints.
DROP POLICY IF EXISTS "Allow customer order confirmation lookup" ON public.orders;

-- 5. Optional: Dedicated read-only tracking RPC function (Data Minimization)
-- Returns ONLY non-sensitive fulfillment status milestones for an exact matching order number.
-- Excludes customer name, mobile number, complete address, email, notes, and pricing.
CREATE OR REPLACE FUNCTION public.get_order_tracking(p_order_number TEXT)
RETURNS TABLE (
  order_number TEXT,
  product_name TEXT,
  size_variant TEXT,
  quantity INTEGER,
  order_status TEXT,
  city TEXT,
  province TEXT,
  order_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    o.order_number,
    o.product_name,
    o.size_variant,
    o.quantity,
    o.order_status,
    o.city,
    o.province,
    o.order_date,
    o.created_at
  FROM public.orders o
  WHERE UPPER(TRIM(o.order_number)) = UPPER(TRIM(p_order_number))
  LIMIT 1;
$$;

-- Grant execution of tracking lookup function to anon/authenticated clients
GRANT EXECUTE ON FUNCTION public.get_order_tracking(TEXT) TO anon, authenticated;

-- 6. Indexes for fast retrieval
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_mobile_number ON public.orders(mobile_number);
