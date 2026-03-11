# Supabase Database Schema

Please copy and run the following SQL code in your **Supabase SQL Editor** to set up the necessary tables and security policies.

## 1. Create Tables and Security

```sql
-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create the staff_requests table
CREATE TABLE IF NOT EXISTS staff_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on staff_requests
ALTER TABLE staff_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for staff_requests
DROP POLICY IF EXISTS "Anyone can create a staff request" ON staff_requests;
CREATE POLICY "Anyone can create a staff request" ON staff_requests
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read their own request" ON staff_requests;
CREATE POLICY "Users can read their own request" ON staff_requests
    FOR SELECT USING (auth.jwt() ->> 'email' = email);

-- 2. Create the products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    offer_price DECIMAL(12,2),
    category TEXT,
    stock_quantity INTEGER DEFAULT 0,
    image_url TEXT,
    offer_expiry TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
DROP POLICY IF EXISTS "Anyone can view products" ON products;
CREATE POLICY "Anyone can view products" ON products
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff can manage products" ON products;
CREATE POLICY "Staff can manage products" ON products
    FOR ALL USING (auth.role() = 'authenticated');
```

## 2. Approve Your User

Run this command if you are seeing "pending" on the login page:

```sql
-- First, try to update if user already exists
UPDATE staff_requests 
SET status = 'approved' 
WHERE email = 'barakaboychild@gmail.com';

-- If no rows were updated (user doesn't exist yet), run this:
INSERT INTO staff_requests (email, status, full_name) 
SELECT 'barakaboychild@gmail.com', 'approved', 'Barak' 
WHERE NOT EXISTS (
    SELECT 1 FROM staff_requests WHERE email = 'barakaboychild@gmail.com'
);
```

## 3. Create Storage Bucket (For Images)

If images aren't showing up, you need to create the storage bucket. Run this SQL:

```sql
-- 1. Create the products bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to images
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'products');

-- 3. Allow authenticated staff to upload images
DROP POLICY IF EXISTS "Staff Upload" ON storage.objects;
CREATE POLICY "Staff Upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'products' 
        AND auth.role() = 'authenticated'
    );

-- 4. Allow staff to manage (delete/update) images
DROP POLICY IF EXISTS "Staff Manage" ON storage.objects;
CREATE POLICY "Staff Manage" ON storage.objects
    FOR ALL USING (
        bucket_id = 'products' 
        AND auth.role() = 'authenticated'
    );
```

## 4. Seed Initial Products (Optional)

Run this SQL to populate your store with sample tools:

```sql
INSERT INTO products (name, description, price, offer_price, category, image_url)
VALUES 
('Gold Series Clipper', 'Precision professional clipper.', 199.00, 159.00, 'Clippers', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80'),
('Matte Finish Pomade', 'High-hold matte pomade.', 24.00, NULL, 'Hair products', 'https://images.unsplash.com/photo-1599351431247-f577f9747c9c?w=800&q=80'),
('Titanium Detailer', 'T-blade detailer.', 135.00, 110.00, 'Trimmers', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80'),
('Beard Wash', 'Gentle beard wash.', 22.00, NULL, 'Hair products', 'https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?w=800&q=80');
```

## 5. Setup Order Tracking (For Staff)

Run this SQL to enable order tracking:

```sql
-- 1. Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    payment_method TEXT DEFAULT 'delivery',
    checkout_request_id TEXT,
    mpesa_result_code INTEGER,
    mpesa_result_desc TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 4. Policies
DROP POLICY IF EXISTS "Anyone can place orders" ON orders;
CREATE POLICY "Anyone can place orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can view orders" ON orders;
CREATE POLICY "Staff can view orders" ON orders FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Anyone can add order items" ON order_items;
CREATE POLICY "Anyone can add order items" ON order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can view order items" ON order_items;
CREATE POLICY "Staff can view order items" ON order_items FOR SELECT USING (auth.role() = 'authenticated');
```

## 6. Setup Store Settings (Social Media Links)

Run this SQL to create a table that will store your customizable links like Instagram, Facebook, and Twitter:

```sql
-- 1. Create store_settings table
CREATE TABLE IF NOT EXISTS store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Insert default keys (leave value empty for now)
INSERT INTO store_settings (key, value)
VALUES 
    ('social_instagram', ''),
    ('social_facebook', ''),
    ('social_twitter', '')
ON CONFLICT (key) DO NOTHING;

-- 3. Enable RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- 4. Policies
DROP POLICY IF EXISTS "Anyone can read store settings" ON store_settings;
CREATE POLICY "Anyone can read store settings" ON store_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff can update store settings" ON store_settings;
CREATE POLICY "Staff can update store settings" ON store_settings FOR UPDATE USING (auth.role() = 'authenticated');
```
