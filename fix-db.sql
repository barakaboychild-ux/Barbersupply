-- Run this SQL in your Supabase SQL Editor to add missing columns for M-Pesa integration

-- 1. Add missing columns to the orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'delivery',
ADD COLUMN IF NOT EXISTS checkout_request_id TEXT,
ADD COLUMN IF NOT EXISTS mpesa_result_code INTEGER,
ADD COLUMN IF NOT EXISTS mpesa_result_desc TEXT;

-- 2. Update existing rows if necessary (optional)
UPDATE orders SET payment_method = 'delivery' WHERE payment_method IS NULL;
