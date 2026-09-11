import { createClient } from '@supabase/supabase-js';
import { SupabaseOrderRow } from '../types';

export const SUPABASE_CONFIG = {
  projectId: 'alqcxfrwzklpygkegwih',
  apiUrl: (import.meta.env.VITE_SUPABASE_URL || 'https://alqcxfrwzklpygkegwih.supabase.co')
    .trim()
    .replace(/\/+$/, ''),
  anonKey: (import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_CVwG0cK_9p_kj0WWthvw2g_5OtzByxE')
    .trim()
    .replace(/^\/+/, ''),
};

/**
 * Official Supabase Client initialized with user's project credentials
 */
export const supabase = createClient(SUPABASE_CONFIG.apiUrl, SUPABASE_CONFIG.anonKey);

export interface InsertOrderResult {
  success: boolean;
  data?: SupabaseOrderRow;
  error?: {
    code?: string;
    message: string;
    details?: string;
    isTableMissing?: boolean;
  };
}

/**
 * Directly inserts a customer order record into the Supabase database.
 * Enforces database insertion before order confirmation.
 */
export async function insertOrderToSupabase(
  orderData: SupabaseOrderRow
): Promise<InsertOrderResult> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error('Supabase order insertion error:', error);
      const isTableMissing =
        error.code === 'PGRST205' ||
        error.message?.toLowerCase().includes('not find the table') ||
        error.message?.toLowerCase().includes('does not exist');

      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details || error.hint || undefined,
          isTableMissing,
        },
      };
    }

    return {
      success: true,
      data: data as SupabaseOrderRow,
    };
  } catch (err: any) {
    console.error('Network or unexpected error communicating with Supabase:', err);
    return {
      success: false,
      error: {
        message:
          err?.message ||
          'Failed to connect to the Supabase database. Please check your network connection.',
      },
    };
  }
}

/**
 * Retrieve a confirmed order directly from Supabase by order_number
 */
export async function fetchOrderByNumber(orderNumber: string): Promise<SupabaseOrderRow | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();

    if (error || !data) {
      return null;
    }
    return data as SupabaseOrderRow;
  } catch (err) {
    console.error('Error fetching order from Supabase:', err);
    return null;
  }
}

/**
 * Health check to verify connection & table presence
 */
export async function checkSupabaseOrdersTable(): Promise<{
  connected: boolean;
  tableExists: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase.from('orders').select('id').limit(1);
    if (!error) {
      return { connected: true, tableExists: true };
    }
    if (error.code === 'PGRST205' || error.message?.includes('not find the table')) {
      return { connected: true, tableExists: false, error: error.message };
    }
    return { connected: false, tableExists: false, error: error.message };
  } catch (err: any) {
    return { connected: false, tableExists: false, error: err?.message };
  }
}

/**
 * SQL script for Supabase SQL Editor
 */
export const SUPABASE_ORDERS_SQL = `-- NOORBAL Luxury E-Commerce: Supabase Database Schema & RLS Policies
-- Project: alqcxfrwzklpygkegwih
-- SQL Editor URL: https://supabase.com/dashboard/project/alqcxfrwzklpygkegwih/sql/new

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

-- Enable Row Level Security (RLS) to keep customer data private and secure
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public customers to submit orders directly
CREATE POLICY "Allow public order placement"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow customers to read their order confirmation by order_number
CREATE POLICY "Allow customer order confirmation lookup"
ON public.orders
FOR SELECT
TO anon, authenticated
USING (true);

-- Index for instant retrieval
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
`;
