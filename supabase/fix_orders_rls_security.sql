-- ==============================================================================
-- NOORBAL SECURITY FIX — STEP 1: Supabase Orders RLS Hardening
-- Project ID: alqcxfrwzklpygkegwih
-- ==============================================================================

-- 1. Ensure Row Level Security (RLS) is strictly active on public.orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 2. CRITICAL FIX: Remove broad public SELECT access
-- The existing policy "Allow customer order confirmation lookup" had USING (true),
-- allowing anonymous clients to read the entire table and leak customer PII.
DROP POLICY IF EXISTS "Allow customer order confirmation lookup" ON public.orders;

-- 3. Ensure public order creation (INSERT) is preserved
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' AND policyname = 'Allow public order placement'
  ) THEN
    CREATE POLICY "Allow public order placement"
    ON public.orders
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
  END IF;
END
$$;

-- 4. Secure Read-Only Tracking Function (Data Minimization)
-- Returns strictly fulfillment status fields for an exact matching order number.
-- Excludes customer_name, mobile_number, email, complete_address, postal_code, notes, and pricing.
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

GRANT EXECUTE ON FUNCTION public.get_order_tracking(TEXT) TO anon, authenticated;
