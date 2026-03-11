-- Database Schema for Barber Supply

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    category TEXT NOT NULL CHECK (category IN ('Clippers', 'Trimmers', 'Shaving products', 'Hair products', 'Cosmetics', 'Accessories')),
    price DECIMAL(10, 2) NOT NULL,
    offer_price DECIMAL(10, 2),
    offer_expiry TIMESTAMP WITH TIME ZONE,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Staff Requests Table
CREATE TABLE IF NOT EXISTS public.staff_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--- ENABLE RLS ---

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

--- POLICIES ---

-- Products: Everyone can view, only approved staff can edit
CREATE POLICY "Allow public read access for products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow staff to manage products" ON public.products
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.staff_requests
            WHERE email = auth.jwt()->>'email' AND status = 'approved'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.staff_requests
            WHERE email = auth.jwt()->>'email' AND status = 'approved'
        )
    );

-- Staff Requests: Staff can create, admins can read/update (simplified: anyone can create pending)
CREATE POLICY "Allow anyone to request staff access" ON public.staff_requests FOR INSERT WITH CHECK (status = 'pending');
CREATE POLICY "Allow staff to view their own request status" ON public.staff_requests FOR SELECT USING (email = auth.jwt()->>'email');

-- Contact Messages: Anyone can insert, staff can view
CREATE POLICY "Allow public to insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow staff to view contact messages" ON public.contact_messages FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.staff_requests
            WHERE email = auth.jwt()->>'email' AND status = 'approved'
        )
    );
