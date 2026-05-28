-- Oklute Supabase Schema Definitions
-- This script sets up the tables, relationships, indexes, Row Level Security (RLS) policies, and default seeds.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------
-- 1. SITE SETTINGS (Hero CMS)
-- ----------------------------------------------------
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hero_title TEXT NOT NULL DEFAULT 'Flying Solo? No Worries, Oklute is made for all.',
    hero_subtitle TEXT NOT NULL DEFAULT 'Search or Post Your Adult Advertisement',
    hero_image_url TEXT NOT NULL DEFAULT '/hero-anime.png',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_settings
CREATE POLICY "Allow public read access to site_settings" 
    ON public.site_settings FOR SELECT 
    USING (true);

CREATE POLICY "Allow authenticated admins to write site_settings" 
    ON public.site_settings FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Insert default site settings row
INSERT INTO public.site_settings (hero_title, hero_subtitle, hero_image_url)
VALUES ('Flying Solo? No Worries, Oklute is made for all.', 'Search or Post Your Adult Advertisement', '/hero-anime.png');


-- ----------------------------------------------------
-- 2. CATEGORIES
-- ----------------------------------------------------
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    icon_name TEXT, -- Mapping to Lucide icon string
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for Categories
CREATE INDEX idx_categories_slug ON public.categories(slug);

-- Enable RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Allow public read access to categories" 
    ON public.categories FOR SELECT 
    USING (true);

CREATE POLICY "Allow authenticated admins to write categories" 
    ON public.categories FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);


-- ----------------------------------------------------
-- 3. CITIES (Locations)
-- ----------------------------------------------------
CREATE TABLE public.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    state_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for Cities
CREATE INDEX idx_cities_slug ON public.cities(slug);

-- Enable RLS for cities
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cities
CREATE POLICY "Allow public read access to cities" 
    ON public.cities FOR SELECT 
    USING (true);

CREATE POLICY "Allow authenticated admins to write cities" 
    ON public.cities FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);


-- ----------------------------------------------------
-- 4. LISTINGS
-- ----------------------------------------------------
CREATE TABLE public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_id TEXT UNIQUE NOT NULL, -- e.g. CAL1000, MAS1001, etc.
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    name TEXT,
    age INT,
    description TEXT,
    phone TEXT,
    whatsapp TEXT,
    is_vip BOOLEAN DEFAULT false NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'archived', 'draft')),
    images TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    about_me TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    tags TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    services TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    attention_to TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    place_of_service TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    ethnicity TEXT,
    nationality TEXT,
    breast TEXT,
    hair TEXT,
    body_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for Listings for fast filtering
CREATE INDEX idx_listings_category ON public.listings(category_id);
CREATE INDEX idx_listings_city ON public.listings(city_id);
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_is_vip ON public.listings(is_vip);
CREATE INDEX idx_listings_created_at ON public.listings(created_at DESC);

-- Enable RLS for listings
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for listings
CREATE POLICY "Allow public read access to published listings" 
    ON public.listings FOR SELECT 
    USING (status = 'published');

CREATE POLICY "Allow authenticated admins to read all listings" 
    ON public.listings FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Allow authenticated admins to write listings" 
    ON public.listings FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);


-- ----------------------------------------------------
-- 5. FUNCTION TO UPDATE LISTINGS UPDATED_AT TIMESTAMP
-- ----------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_listings_timestamp
    BEFORE UPDATE ON public.listings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------
-- 6. DUMMY METRICS TRACKING (For Dashboard)
-- ----------------------------------------------------
CREATE TABLE public.page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_page_views_created_at ON public.page_views(created_at);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to page_views" 
    ON public.page_views FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow authenticated admins to read page_views" 
    ON public.page_views FOR SELECT 
    TO authenticated 
    USING (true);


-- ----------------------------------------------------
-- 7. SEED DATA
-- ----------------------------------------------------

-- A. Create admin user with email 'admin@oklute.com' and password 'admin123456'
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    new_user_id UUID := 'd0e6c278-f7e9-4676-92e1-4c6e612cb3d3';
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@oklute.com') THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token,
            is_super_admin,
            phone_confirmed_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            new_user_id,
            'authenticated',
            'authenticated',
            'admin@oklute.com',
            crypt('admin123456', gen_salt('bf')),
            now(),
            NULL,
            now(),
            '{"provider":"email","providers":["email"]}',
            '{"role":"admin"}',
            now(),
            now(),
            '',
            '',
            '',
            '',
            false,
            now()
        );

        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            provider_id,
            last_sign_in_at,
            created_at,
            updated_at
        ) VALUES (
            new_user_id,
            new_user_id,
            json_build_object('sub', new_user_id, 'email', 'admin@oklute.com'),
            'email',
            new_user_id::text,
            now(),
            now(),
            now()
        );
    END IF;
END $$;


-- B. Seed Categories
INSERT INTO public.categories (slug, title, description, image_url, icon_name, order_index)
VALUES 
('call-girls', 'Call Girls', 'Call girls and Escorts adult classified to help you locate independent call girls and escorts to fulfill your sensual desires.', '/images/categories/call-girls.png', 'Flame', 0),
('massage', 'Massage', 'The best erotic massage ads with all erotic services. The sexy massage girls give you a soothing hot full body massage.', '/images/categories/massage.png', 'Activity', 1),
('male-escorts', 'Male Escorts', 'Best adult classified for male escort services, hot male escorts, call boys, and gigolos. Find the most sensual sexy male escorts.', '/images/categories/male-escorts.png', 'User', 2),
('transsexual', 'Transsexual', 'Transsexual escorts let you enjoy a new kind of sexual services. shemale, lady boy who have mastered in erotic sex services.', '/images/categories/transsexual.png', 'Footprints', 3),
('adult-meetings', 'Adult Meetings', 'Reliable classified ads for enjoying sexy companionship with local boys and girls. Locate your true love to enjoy stimulating adult meetings.', '/images/categories/adult-meetings.png', 'GlassWater', 4)
ON CONFLICT (slug) DO NOTHING;


-- C. Seed Cities
INSERT INTO public.cities (slug, name, state_name)
VALUES
('bangalore', 'Bangalore', 'Karnataka'),
('hyderabad', 'Hyderabad', 'Telangana'),
('mumbai', 'Mumbai', 'Maharashtra'),
('delhi', 'Delhi', 'Delhi'),
('pune', 'Pune', 'Maharashtra'),
('chennai', 'Chennai', 'Tamil Nadu'),
('kolkata', 'Kolkata', 'West Bengal'),
('ahmedabad', 'Ahmedabad', 'Gujarat'),
('surat', 'Surat', 'Gujarat'),
('jaipur', 'Jaipur', 'Rajasthan'),
('lucknow', 'Lucknow', 'Uttar Pradesh'),
('kanpur', 'Kanpur', 'Uttar Pradesh'),
('nagpur', 'Nagpur', 'Maharashtra'),
('indore', 'Indore', 'Madhya Pradesh'),
('thane', 'Thane', 'Maharashtra'),
('bhopal', 'Bhopal', 'Madhya Pradesh'),
('visakhapatnam', 'Visakhapatnam', 'Andhra Pradesh'),
('patna', 'Patna', 'Bihar'),
('vadodara', 'Vadodara', 'Gujarat'),
('ghaziabad', 'Ghaziabad', 'Uttar Pradesh'),
('ludhiana', 'Ludhiana', 'Punjab'),
('agra', 'Agra', 'Uttar Pradesh'),
('nashik', 'Nashik', 'Maharashtra'),
('faridabad', 'Faridabad', 'Haryana'),
('meerut', 'Meerut', 'Uttar Pradesh'),
('rajkot', 'Rajkot', 'Gujarat'),
('varanasi', 'Varanasi', 'Uttar Pradesh'),
('srinagar', 'Srinagar', 'Jammu & Kashmir'),
('aurangabad', 'Aurangabad', 'Maharashtra'),
('dhanbad', 'Dhanbad', 'Jharkhand'),
('amritsar', 'Amritsar', 'Punjab'),
('navi-mumbai', 'Navi Mumbai', 'Maharashtra'),
('allahabad', 'Allahabad', 'Uttar Pradesh'),
('ranchi', 'Ranchi', 'Jharkhand'),
('howrah', 'Howrah', 'West Bengal'),
('coimbatore', 'Coimbatore', 'Tamil Nadu'),
('jabalpur', 'Jabalpur', 'Madhya Pradesh'),
('gwalior', 'Gwalior', 'Madhya Pradesh'),
('vijayawada', 'Vijayawada', 'Andhra Pradesh'),
('jodhpur', 'Jodhpur', 'Rajasthan'),
('madurai', 'Madurai', 'Tamil Nadu'),
('raipur', 'Raipur', 'Chhattisgarh'),
('kota', 'Kota', 'Rajasthan'),
('guwahati', 'Guwahati', 'Assam'),
('chandigarh', 'Chandigarh', 'Punjab'),
('solapur', 'Solapur', 'Maharashtra'),
('hubli', 'Hubli', 'Karnataka'),
('bareilly', 'Bareilly', 'Uttar Pradesh'),
('mysore', 'Mysore', 'Karnataka'),
('moradabad', 'Moradabad', 'Uttar Pradesh'),
('gurgaon', 'Gurgaon', 'Haryana'),
('aligarh', 'Aligarh', 'Uttar Pradesh'),
('jalandhar', 'Jalandhar', 'Punjab'),
('trichy', 'Tiruchirappalli', 'Tamil Nadu'),
('bhubaneswar', 'Bhubaneswar', 'Odisha'),
('salem', 'Salem', 'Tamil Nadu'),
('warangal', 'Warangal', 'Telangana'),
('gorakhpur', 'Gorakhpur', 'Uttar Pradesh'),
('noida', 'Noida', 'Uttar Pradesh'),
('kochi', 'Kochi', 'Kerala')
ON CONFLICT (slug) DO NOTHING;


-- ----------------------------------------------------
-- 8. DEMO LISTINGS SEEDS (32 Listings total, 20 Call Girls for pagination)
-- ----------------------------------------------------
INSERT INTO public.listings (
    ad_id,
    category_id,
    city_id,
    title,
    name,
    age,
    description,
    phone,
    whatsapp,
    is_vip,
    status,
    images,
    about_me,
    tags,
    services,
    attention_to,
    place_of_service,
    ethnicity,
    nationality,
    breast,
    hair,
    body_type
) VALUES
-- --- CALL GIRLS (20 listings for pagination testing) ---
(
    'CAL1001',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'bangalore' LIMIT 1),
    'VIP Escort High Class Independent Model Available Home & Hotel',
    'Anjali', 21,
    'AVAILABLE FOR COMPLETE ENJOYMENT WITH HIGH PROFILE INDIAN MODEL AVAILABLE HOTEL & HOME ★ SAFE AND SECURE HIGH CLASS SERVICE.',
    '09119151001', '919119151001', true, 'published',
    ARRAY['/image0.png', '/image1.png', '/hero-anime.png'],
    ARRAY['★ SAFE AND SECURE HIGH CLASS SERVICE', '★ All meetings are 100% confidential'],
    ARRAY['Indian', 'Slim', 'VIP'], ARRAY['Oral', 'French kiss', 'Role play'], ARRAY['Men', 'Women'], ARRAY['Hotel / Motel', 'Outcall'],
    'Indian', 'Indian', 'Natural', 'Black', 'Slim'
),
(
    'CAL1002',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'hyderabad' LIMIT 1),
    'Low price Hotel Service Home Services Full Sex Trusted service',
    'Priya', 22,
    'High profile independent call girl offering real meetings. Fully sanitized and safe environment.',
    '09119151002', '919119151002', false, 'published',
    ARRAY['/image1.png', '/image0.png'],
    ARRAY['★ Genuine profile and direct photos', '★ 100% satisfaction guaranteed'],
    ARRAY['Indian', 'Busty'], ARRAY['Oral', '69 position', 'Deep throat'], ARRAY['Men'], ARRAY['Hotel / Motel', 'Incall'],
    'Indian', 'Indian', 'Natural', 'Brown', 'Average'
),
(
    'CAL1003',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'mumbai' LIMIT 1),
    'Independent Premium Call Girls for sensuous escort service',
    'Riya', 20,
    'Friendly, passionate college student model available for hotel outcalls. Let us make unforgettable memories.',
    '09119151003', '919119151003', true, 'published',
    ARRAY['/hero-anime.png', '/image0.png'],
    ARRAY['★ Premium high profile student', '★ Outcalls to top 5-star hotels'],
    ARRAY['Local', 'Slim'], ARRAY['French kiss', 'Body massage', 'Cum in mouth'], ARRAY['Men', 'Couples'], ARRAY['Hotel / Motel'],
    'Indian', 'Indian', 'Natural', 'Black', 'Slim'
),
(
    'CAL1004',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'delhi' LIMIT 1),
    'Genuine Escort Service safe and secure independent call girl',
    'Kavya', 23,
    'Experienced local escort offering premium companionship. Very respectful and cooperative attitude.',
    '09119151004', '919119151004', false, 'published',
    ARRAY['/images/categories/call-girls.png', '/image1.png'],
    ARRAY['★ Safe home visits available', '★ No advance payments required'],
    ARRAY['Indian', 'Curvy'], ARRAY['Oral', 'Foot fetish', 'Role play'], ARRAY['Men'], ARRAY['Outcall', 'Incall'],
    'Indian', 'Indian', 'Natural', 'Black', 'Curvy'
),
(
    'CAL1005',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'pune' LIMIT 1),
    '24/7 Available Adult Meeting Services VIP and Genuine Work',
    'Sonia', 24,
    'Top model providing elite companion services. Home and hotel visits fully accommodated.',
    '09119151005', '919119151005', true, 'published',
    ARRAY['/image0.png', '/hero-anime.png'],
    ARRAY['★ Premium VIP escort model', '★ Multilingual and well educated'],
    ARRAY['VIP', 'Foreigner'], ARRAY['Oral', '69 position', 'Striptease'], ARRAY['Men', 'Women', 'Couples'], ARRAY['Hotel / Motel', 'Outcall'],
    'Russian', 'Russian', 'Silicone', 'Blonde', 'Slim'
),
(
    'CAL1006',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'bangalore' LIMIT 1),
    'Cute college girl ready to hang out and enjoy cozy times',
    'Sneha', 19,
    'Cute and sweet girl next door. Fun-loving and bubbly character who will erase all your stress.',
    '09119151006', '919119151006', false, 'published',
    ARRAY['/image1.png', '/images/categories/call-girls.png'],
    ARRAY['★ Fresh student profile', '★ Completely genuine photos'],
    ARRAY['Indian', 'Slim'], ARRAY['Oral', 'French kiss', 'Body-to-body massage'], ARRAY['Men'], ARRAY['Outcall', 'Incall'],
    'Indian', 'Indian', 'Natural', 'Black', 'Slim'
),
(
    'CAL1007',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'hyderabad' LIMIT 1),
    'Glamorous VIP model offering high class hotel outcalls',
    'Neha', 25,
    'Stunning high class model for elite customers. Very friendly and open-minded.',
    '09119151007', '919119151007', true, 'published',
    ARRAY['/image0.png', '/image1.png'],
    ARRAY['★ Elite high-end companion', '★ Absolute privacy guaranteed'],
    ARRAY['Indian', 'VIP'], ARRAY['Oral', 'Role play', 'Erotic dance'], ARRAY['Men'], ARRAY['Hotel / Motel'],
    'Indian', 'Indian', 'Natural', 'Black', 'Slim'
),
(
    'CAL1008',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'mumbai' LIMIT 1),
    'Direct home service available with sweet and hot girls',
    'Asha', 22,
    'Local independent girl ready to visit your residence. Real pictures and no fake commitments.',
    '09119151008', '919119151008', false, 'published',
    ARRAY['/hero-anime.png', '/image1.png'],
    ARRAY['★ Zero advance charges', '★ Fully cooperative and passionate'],
    ARRAY['Local', 'Average'], ARRAY['Oral', 'French kiss', '69 position'], ARRAY['Men'], ARRAY['Outcall'],
    'Indian', 'Indian', 'Natural', 'Black', 'Average'
),
(
    'CAL1009',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'delhi' LIMIT 1),
    'Independent luxury escort model available for hotel service',
    'Tina', 23,
    'Seductive high-profile companion. Friendly companion for dinners, social events, or private meetings.',
    '09119151009', '919119151009', true, 'published',
    ARRAY['/image0.png', '/image1.png'],
    ARRAY['★ Premium escort for events', '★ Top-tier hosting service'],
    ARRAY['VIP', 'Slim'], ARRAY['Oral', 'Erotic massage', 'French kiss'], ARRAY['Men', 'Women'], ARRAY['Hotel / Motel', 'Outcall'],
    'Indian', 'Indian', 'Natural', 'Black', 'Slim'
),
(
    'CAL1010',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'pune' LIMIT 1),
    'Sensual home service available with very sweet independent girl',
    'Preeti', 21,
    'Charming independent companion. Safe service at your doorstep or hotel.',
    '09119151010', '919119151010', false, 'published',
    ARRAY['/image1.png', '/hero-anime.png'],
    ARRAY['★ 100% privacy maintained', '★ Safe outcall appointments only'],
    ARRAY['Indian', 'Slim'], ARRAY['Oral', 'Body massage', 'Deep kiss'], ARRAY['Men'], ARRAY['Outcall', 'Hotel / Motel'],
    'Indian', 'Indian', 'Natural', 'Black', 'Slim'
),
(
    'CAL1011',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'bangalore' LIMIT 1),
    'Premium escort services - Top profile model call girl',
    'Ishika', 22,
    'Exotic, high-profile escort companion. Elegant and charming for premium visitors.',
    '09119151011', '919119151011', true, 'published',
    ARRAY['/image0.png', '/images/categories/call-girls.png'],
    ARRAY['★ Professional high profile model', '★ Luxury outcalls only'],
    ARRAY['VIP', 'Indian'], ARRAY['Oral', 'French kiss', 'Body massage'], ARRAY['Men'], ARRAY['Hotel / Motel'],
    'Indian', 'Indian', 'Natural', 'Black', 'Slim'
),
(
    'CAL1012',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'hyderabad' LIMIT 1),
    'Sweet and friendly college girl available for cozy hotel times',
    'Divya', 20,
    'Young and lively student companion. Open-minded and ready to share high quality time.',
    '09119151012', '919119151012', false, 'published',
    ARRAY['/image1.png', '/image0.png'],
    ARRAY['★ Very polite and clean profile', '★ Safe outcall services'],
    ARRAY['Indian', 'Slim'], ARRAY['Oral', 'French kiss', 'Erotic massage'], ARRAY['Men'], ARRAY['Hotel / Motel', 'Outcall'],
    'Indian', 'Indian', 'Natural', 'Black', 'Slim'
),
(
    'CAL1013',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'mumbai' LIMIT 1),
    'Elite VIP escort model for high-profile client meetings',
    'Kriti', 24,
    'Breathtaking high-class model available for hotel booking. Elegant, intelligent, and highly sensual.',
    '09119151013', '919119151013', true, 'published',
    ARRAY['/hero-anime.png', '/image0.png'],
    ARRAY['★ High profile model client service', '★ Absolute security and discretion'],
    ARRAY['VIP', 'Foreigner'], ARRAY['Oral', 'Role play', 'Striptease'], ARRAY['Men', 'Women'], ARRAY['Hotel / Motel'],
    'Brazilian', 'Brazilian', 'Silicone', 'Brown', 'Slim'
),
(
    'CAL1014',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'delhi' LIMIT 1),
    'Safe and secure call girl service at budget rates',
    'Pooja', 23,
    'Independent girl offering simple, satisfying, and direct companionship without any complications.',
    '09119151014', '919119151014', false, 'published',
    ARRAY['/images/categories/call-girls.png', '/image1.png'],
    ARRAY['★ Safe home visits', '★ Budget friendly packages'],
    ARRAY['Local', 'Average'], ARRAY['Oral', 'French kiss', '69 position'], ARRAY['Men'], ARRAY['Outcall', 'Incall'],
    'Indian', 'Indian', 'Natural', 'Black', 'Average'
),
(
    'CAL1015',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'pune' LIMIT 1),
    'Gorgeous high class independent escort model available',
    'Simran', 22,
    'Seductive and charming escort model. Passionate and open to exploring your fantasies.',
    '09119151015', '919119151015', true, 'published',
    ARRAY['/image0.png', '/hero-anime.png'],
    ARRAY['★ VIP escort profile', '★ Multilingual and classy'],
    ARRAY['Indian', 'Curvy'], ARRAY['Oral', 'Erotic massage', 'Role play'], ARRAY['Men', 'Couples'], ARRAY['Hotel / Motel', 'Outcall'],
    'Indian', 'Indian', 'Natural', 'Black', 'Curvy'
),
-- Listings page 2 (to test pagination > 15)
(
    'CAL1016',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'bangalore' LIMIT 1),
    'Genuine high profile call girl for direct hotel outcalls',
    'Shruti', 21,
    'Charming, sweet, and fun escort companion. Real photos and professional attitude.',
    '09119151016', '919119151016', false, 'published',
    ARRAY['/image1.png', '/images/categories/call-girls.png'],
    ARRAY['★ 100% genuine photos and service', '★ Safe and clean outcalls only'],
    ARRAY['Indian', 'Slim'], ARRAY['Oral', 'French kiss', 'Body massage'], ARRAY['Men'], ARRAY['Hotel / Motel', 'Outcall'],
    'Indian', 'Indian', 'Natural', 'Black', 'Slim'
),
(
    'CAL1017',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'hyderabad' LIMIT 1),
    'VIP Independent Call Girl - Premium Hotel Service',
    'Mehak', 23,
    'Elegant, classy, and highly sensual VIP model. Let us share a romantic and passionate night.',
    '09119151017', '919119151017', true, 'published',
    ARRAY['/image0.png', '/image1.png'],
    ARRAY['★ Exclusive elite service provider', '★ Complete privacy guaranteed'],
    ARRAY['VIP', 'Slim'], ARRAY['Oral', 'Erotic dance', 'Role play'], ARRAY['Men'], ARRAY['Hotel / Motel'],
    'Indian', 'Indian', 'Natural', 'Black', 'Slim'
),
(
    'CAL1018',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'mumbai' LIMIT 1),
    'College student call girl offering sweet home visits',
    'Nisha', 20,
    'Young and energetic college girl. Ready to visit you at home or hotel for relaxing moments.',
    '09119151018', '919119151018', false, 'published',
    ARRAY['/hero-anime.png', '/image1.png'],
    ARRAY['★ Zero advance payment', '★ 100% safe independent profile'],
    ARRAY['Local', 'Slim'], ARRAY['Oral', 'French kiss', 'Deep kiss'], ARRAY['Men'], ARRAY['Outcall', 'Incall'],
    'Indian', 'Indian', 'Natural', 'Black', 'Slim'
),
(
    'CAL1019',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'delhi' LIMIT 1),
    'Stunning high class escort model for hotel meetings',
    'Renu', 25,
    'Glamorous VIP model. Passionate companion for corporate clients and elite visitors.',
    '09119151019', '919119151019', true, 'published',
    ARRAY['/image0.png', '/image1.png'],
    ARRAY['★ Premium high profile model', '★ 5-star hotel visits only'],
    ARRAY['VIP', 'Foreigner'], ARRAY['Oral', 'Role play', 'Striptease'], ARRAY['Men'], ARRAY['Hotel / Motel'],
    'Ukrainian', 'Ukrainian', 'Natural', 'Blonde', 'Slim'
),
(
    'CAL1020',
    (SELECT id FROM public.categories WHERE slug = 'call-girls' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'pune' LIMIT 1),
    'Friendly local girl for safe outcall and home service',
    'Kiran', 22,
    'Passionate and caring companion. Safe home and hotel visits at very reasonable prices.',
    '09119151020', '919119151020', false, 'published',
    ARRAY['/image1.png', '/hero-anime.png'],
    ARRAY['★ Direct genuine service', '★ Budget friendly rates'],
    ARRAY['Local', 'Average'], ARRAY['Oral', 'French kiss', 'Body massage'], ARRAY['Men'], ARRAY['Outcall', 'Hotel / Motel'],
    'Indian', 'Indian', 'Natural', 'Black', 'Average'
),

-- --- MASSAGE (3 listings) ---
(
    'MAS1001',
    (SELECT id FROM public.categories WHERE slug = 'massage' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'bangalore' LIMIT 1),
    'Sensual Erotic Full Body Massage by professional girl',
    'Sonia', 24,
    'Relaxing and stimulating body-to-body massage service. Let your tension melt away under my expert hands.',
    '09119152001', '919119152001', false, 'published',
    ARRAY['/images/categories/massage.png', '/image0.png'],
    ARRAY['★ Professional massage expert', '★ Sanitized private home/hotel visits'],
    ARRAY['Massage', 'Slim'], ARRAY['Body-to-body massage', 'Nuru massage', 'Erotic massage'], ARRAY['Men', 'Women'], ARRAY['Outcall', 'Incall'],
    'Indian', 'Indian', 'Natural', 'Black', 'Slim'
),
(
    'MAS1002',
    (SELECT id FROM public.categories WHERE slug = 'massage' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'mumbai' LIMIT 1),
    'VIP Nuru Massage and Full Body Relaxation Service',
    'Tanya', 23,
    'Top class Nuru massage using premium essential oils. Body sliding techniques to maximize your pleasure.',
    '09119152002', '919119152002', true, 'published',
    ARRAY['/image0.png', '/image1.png'],
    ARRAY['★ Premium Nuru massage specialist', '★ Luxury high profile relaxation'],
    ARRAY['Massage', 'VIP'], ARRAY['Nuru massage', 'Body-to-body massage', 'Oral'], ARRAY['Men'], ARRAY['Hotel / Motel', 'Outcall'],
    'Thai', 'Thai', 'Natural', 'Black', 'Slim'
),
(
    'MAS1003',
    (SELECT id FROM public.categories WHERE slug = 'massage' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'delhi' LIMIT 1),
    'Budget friendly full body sweet massage service',
    'Pooja', 22,
    'Sweet local girl offering relaxing full body massage. Perfect relief from a busy work day.',
    '09119152003', '919119152003', false, 'published',
    ARRAY['/image1.png', '/hero-anime.png'],
    ARRAY['★ Affordable massage rates', '★ Direct genuine therapist'],
    ARRAY['Massage', 'Local'], ARRAY['Body massage', 'Foot massage', 'French kiss'], ARRAY['Men'], ARRAY['Outcall'],
    'Indian', 'Indian', 'Natural', 'Black', 'Average'
),

-- --- MALE ESCORTS (3 listings) ---
(
    'MAL1001',
    (SELECT id FROM public.categories WHERE slug = 'male-escorts' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'bangalore' LIMIT 1),
    'Handsome athletic call boy gigolo service for ladies',
    'Rahul', 25,
    'Athletic, well-behaved male escort. Providing ultimate satisfaction and companionship for women.',
    '09119153001', '919119153001', true, 'published',
    ARRAY['/images/categories/male-escorts.png', '/image0.png'],
    ARRAY['★ Athletic body builder', '★ 100% confidential ladies service'],
    ARRAY['Male', 'Gigolo'], ARRAY['Oral', 'Sensual massage', 'Role play'], ARRAY['Women', 'Couples'], ARRAY['Outcall', 'Hotel / Motel'],
    'Indian', 'Indian', 'Natural', 'Black', 'Athletic'
),
(
    'MAL1002',
    (SELECT id FROM public.categories WHERE slug = 'male-escorts' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'mumbai' LIMIT 1),
    'Professional male escort / call boy for couples and women',
    'Amit', 26,
    'Tall, charming, and broad-minded male escort. Ready to satisfy all your desires with absolute discretion.',
    '09119153002', '919119153002', false, 'published',
    ARRAY['/image0.png', '/image1.png'],
    ARRAY['★ Respectful and highly passionate', '★ Available for outcalls & travel'],
    ARRAY['Male', 'Couples'], ARRAY['Oral', 'Role play', '69 position'], ARRAY['Women', 'Couples', 'Men'], ARRAY['Hotel / Motel', 'Outcall'],
    'Indian', 'Indian', 'Natural', 'Black', 'Athletic'
),
(
    'MAL1003',
    (SELECT id FROM public.categories WHERE slug = 'male-escorts' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'delhi' LIMIT 1),
    'VIP gigolo companion - Handsome and well groomed boy',
    'Kabir', 24,
    'Elite companion for high profile ladies and couples. Educated, charming, and highly passionate.',
    '09119153003', '919119153003', true, 'published',
    ARRAY['/image1.png', '/hero-anime.png'],
    ARRAY['★ Well-educated VIP companion', '★ High quality sensual massage'],
    ARRAY['Male', 'VIP'], ARRAY['Sensual massage', 'Oral', 'French kiss'], ARRAY['Women', 'Couples'], ARRAY['Hotel / Motel'],
    'Indian', 'Indian', 'Natural', 'Black', 'Athletic'
),

-- --- TRANSSEXUAL (3 listings) ---
(
    'TRA1001',
    (SELECT id FROM public.categories WHERE slug = 'transsexual' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'bangalore' LIMIT 1),
    'Stunning shemale ladyboy escort offering erotic services',
    'Riya TS', 22,
    'Exotic shemale companion. Fully functional with a gorgeous feminine body. Let us explore something unique.',
    '09119154001', '919119154001', true, 'published',
    ARRAY['/images/categories/transsexual.png', '/image1.png'],
    ARRAY['★ Fully active shemale model', '★ Very friendly and open minded'],
    ARRAY['Trans', 'TS'], ARRAY['Oral', 'Active / Passive', 'Deep kiss'], ARRAY['Men', 'Couples'], ARRAY['Hotel / Motel', 'Outcall'],
    'Indian', 'Indian', 'Natural', 'Black', 'Slim'
),
(
    'TRA1002',
    (SELECT id FROM public.categories WHERE slug = 'transsexual' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'mumbai' LIMIT 1),
    'Independent TS shemale escort available for hotel service',
    'Nisha TS', 23,
    'Young shemale escort. Seductive, passionate, and ready to fulfill your fantasies in a secure setup.',
    '09119154002', '919119154002', false, 'published',
    ARRAY['/image0.png', '/hero-anime.png'],
    ARRAY['★ Genuine TS profile and pictures', '★ Outcalls to reputable hotels'],
    ARRAY['Trans', 'Local'], ARRAY['Oral', '69 position', 'Role play'], ARRAY['Men'], ARRAY['Hotel / Motel', 'Outcall'],
    'Indian', 'Indian', 'Natural', 'Black', 'Average'
),
(
    'TRA1003',
    (SELECT id FROM public.categories WHERE slug = 'transsexual' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'delhi' LIMIT 1),
    'VIP shemale companion - Beautiful TS model call girl',
    'Sonia TS', 24,
    'Elegant high class shemale model. Beautiful face, slim body, and very passionate companion.',
    '09119154003', '919119154003', true, 'published',
    ARRAY['/image1.png', '/image0.png'],
    ARRAY['★ Elite high-profile shemale model', '★ 100% privacy and security assured'],
    ARRAY['Trans', 'VIP'], ARRAY['Oral', 'French kiss', 'Body massage'], ARRAY['Men', 'Couples'], ARRAY['Hotel / Motel'],
    'Indian', 'Indian', 'Natural', 'Black', 'Slim'
),

-- --- ADULT MEETINGS (3 listings) ---
(
    'ADU1001',
    (SELECT id FROM public.categories WHERE slug = 'adult-meetings' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'bangalore' LIMIT 1),
    'Sensual swinger couple looking to meet open minded partners',
    'S & M Couple', 28,
    'Friendly swinger couple. Safe and respectful environment. Let us meet over drinks first.',
    '09119155001', '919119155001', false, 'published',
    ARRAY['/images/categories/adult-meetings.png', '/image0.png'],
    ARRAY['★ Swinger couple matching profile', '★ Safe and clean outcalls only'],
    ARRAY['Meeting', 'Swinger'], ARRAY['Role play', 'French kiss', 'Group sex'], ARRAY['Couples', 'Women', 'Men'], ARRAY['Outcall', 'Hotel / Motel'],
    'Indian', 'Indian', 'Natural', 'Black', 'Average'
),
(
    'ADU1002',
    (SELECT id FROM public.categories WHERE slug = 'adult-meetings' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'mumbai' LIMIT 1),
    'VIP adult meetings and swinger matches in luxury setup',
    'Rohan & Priya', 29,
    'High profile couple seeking like-minded partners for mutual pleasure and fun times.',
    '09119155002', '919119155002', true, 'published',
    ARRAY['/image1.png', '/image0.png'],
    ARRAY['★ Luxury VIP swinger meeting', '★ Strict vetting and privacy'],
    ARRAY['Meeting', 'VIP'], ARRAY['Oral', 'Sensual massage', 'Role play'], ARRAY['Couples'], ARRAY['Hotel / Motel'],
    'Indian', 'Indian', 'Natural', 'Black', 'Average'
),
(
    'ADU1003',
    (SELECT id FROM public.categories WHERE slug = 'adult-meetings' LIMIT 1),
    (SELECT id FROM public.cities WHERE slug = 'delhi' LIMIT 1),
    'Independent housewife seeking secret dynamic companionship',
    'Rita', 32,
    'Respectable housewife looking for temporary, secret, and exciting companionship. No strings attached.',
    '09119155003', '919119155003', false, 'published',
    ARRAY['/hero-anime.png', '/image1.png'],
    ARRAY['★ Completely private meetings', '★ Discrete home outcall service'],
    ARRAY['Meeting', 'Housewife'], ARRAY['Oral', 'French kiss', 'Deep massage'], ARRAY['Men'], ARRAY['Outcall'],
    'Indian', 'Indian', 'Natural', 'Black', 'Average'
)
ON CONFLICT (ad_id) DO NOTHING;


-- ----------------------------------------------------
-- 9. CATEGORY CLICKS TRACKING UPDATES
-- ----------------------------------------------------
-- Add clicks column to categories if it does not exist
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS clicks INT DEFAULT 0 NOT NULL;

-- Function to increment category clicks safely
CREATE OR REPLACE FUNCTION public.increment_category_clicks(cat_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.categories
    SET clicks = clicks + 1
    WHERE id = cat_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;



