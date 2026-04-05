-- NE India Travel Platform — Database Schema
-- Run this against your Supabase PostgreSQL database

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'tourist' CHECK (role IN ('tourist', 'operator', 'homestay_owner', 'admin')),
  name TEXT,
  bio TEXT,
  avatar_url TEXT,
  bank_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LISTINGS TABLE (Homestays)
-- ============================================
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  location_geojson JSONB,
  state TEXT NOT NULL,
  rooms INTEGER NOT NULL DEFAULT 1,
  price_per_night INTEGER NOT NULL,
  max_guests INTEGER NOT NULL DEFAULT 2,
  amenities TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  bank_details JSONB,
  status TEXT NOT NULL DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'approved', 'rejected')),
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listings_owner ON listings(owner_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_state ON listings(state);
CREATE INDEX idx_listings_slug ON listings(slug);

-- ============================================
-- PACKAGES TABLE (Tour Packages)
-- ============================================
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  homestay_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  itinerary TEXT,
  photos TEXT[] DEFAULT '{}',
  total_price INTEGER NOT NULL,
  duration_days INTEGER NOT NULL,
  max_group_size INTEGER NOT NULL DEFAULT 10,
  includes_guide BOOLEAN DEFAULT false,
  includes_transport BOOLEAN DEFAULT false,
  includes_permits BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'approved', 'rejected')),
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_packages_operator ON packages(operator_id);
CREATE INDEX idx_packages_homestay ON packages(homestay_id);
CREATE INDEX idx_packages_status ON packages(status);
CREATE INDEX idx_packages_slug ON packages(slug);

-- ============================================
-- AVAILABILITY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_blocked BOOLEAN DEFAULT false,
  booking_id UUID,
  UNIQUE(listing_id, date)
);

CREATE INDEX idx_availability_listing ON availability(listing_id);
CREATE INDEX idx_availability_date ON availability(date);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tourist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
  homestay_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  operator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  dates_start DATE NOT NULL,
  dates_end DATE NOT NULL,
  group_size INTEGER NOT NULL DEFAULT 1,
  total_amount INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL DEFAULT 200,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'cancelled', 'completed')),
  payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'paid', 'failed')),
  razorpay_order_id TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_tourist ON bookings(tourist_id);
CREATE INDEX idx_bookings_operator ON bookings(operator_id);
CREATE INDEX idx_bookings_homestay ON bookings(homestay_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  tourist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('listing', 'package')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_target ON reviews(target_id, target_type);
CREATE INDEX idx_reviews_tourist ON reviews(tourist_id);

-- ============================================
-- PERMITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS permits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tourist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  state TEXT NOT NULL,
  permit_type TEXT NOT NULL,
  application_ref TEXT,
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'processing', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_permits_tourist ON permits(tourist_id);

-- ============================================
-- FESTIVAL ALERTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS festival_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  festival_name TEXT NOT NULL,
  state TEXT NOT NULL,
  date DATE NOT NULL,
  sanity_article_id TEXT
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE festival_alerts ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- ---- USERS POLICIES ----
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT USING (id = auth.uid() OR get_user_role() = 'admin');

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Anyone can insert users (signup)"
  ON users FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view basic user info"
  ON users FOR SELECT USING (true);

-- ---- LISTINGS POLICIES ----
CREATE POLICY "Anyone can view approved listings"
  ON listings FOR SELECT USING (status = 'approved' OR owner_id = auth.uid() OR get_user_role() = 'admin');

CREATE POLICY "Owners can create listings"
  ON listings FOR INSERT WITH CHECK (owner_id = auth.uid() AND get_user_role() = 'homestay_owner');

CREATE POLICY "Owners can update own listings"
  ON listings FOR UPDATE USING (owner_id = auth.uid() OR get_user_role() = 'admin');

CREATE POLICY "Owners can delete own listings"
  ON listings FOR DELETE USING (owner_id = auth.uid() OR get_user_role() = 'admin');

-- ---- PACKAGES POLICIES ----
CREATE POLICY "Anyone can view approved packages"
  ON packages FOR SELECT USING (status = 'approved' OR operator_id = auth.uid() OR get_user_role() = 'admin');

CREATE POLICY "Operators can create packages"
  ON packages FOR INSERT WITH CHECK (operator_id = auth.uid() AND get_user_role() = 'operator');

CREATE POLICY "Operators can update own packages"
  ON packages FOR UPDATE USING (operator_id = auth.uid() OR get_user_role() = 'admin');

CREATE POLICY "Operators can delete own packages"
  ON packages FOR DELETE USING (operator_id = auth.uid() OR get_user_role() = 'admin');

-- ---- AVAILABILITY POLICIES ----
CREATE POLICY "Anyone can view availability"
  ON availability FOR SELECT USING (true);

CREATE POLICY "Owners can manage availability"
  ON availability FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND owner_id = auth.uid())
    OR get_user_role() = 'admin'
  );

CREATE POLICY "Owners can update availability"
  ON availability FOR UPDATE USING (
    EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND owner_id = auth.uid())
    OR get_user_role() = 'admin'
  );

CREATE POLICY "Owners can delete availability"
  ON availability FOR DELETE USING (
    EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND owner_id = auth.uid())
    OR get_user_role() = 'admin'
  );

-- ---- BOOKINGS POLICIES ----
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT USING (
    tourist_id = auth.uid()
    OR operator_id = auth.uid()
    OR homestay_id IN (SELECT id FROM listings WHERE owner_id = auth.uid())
    OR get_user_role() = 'admin'
  );

CREATE POLICY "Tourists can create bookings"
  ON bookings FOR INSERT WITH CHECK (tourist_id = auth.uid());

CREATE POLICY "Relevant users can update bookings"
  ON bookings FOR UPDATE USING (
    tourist_id = auth.uid()
    OR operator_id = auth.uid()
    OR homestay_id IN (SELECT id FROM listings WHERE owner_id = auth.uid())
    OR get_user_role() = 'admin'
  );

-- ---- REVIEWS POLICIES ----
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Tourists can create reviews"
  ON reviews FOR INSERT WITH CHECK (tourist_id = auth.uid());

CREATE POLICY "Tourists can update own reviews"
  ON reviews FOR UPDATE USING (tourist_id = auth.uid());

-- ---- PERMITS POLICIES ----
CREATE POLICY "Users can view own permits"
  ON permits FOR SELECT USING (tourist_id = auth.uid() OR get_user_role() = 'admin');

CREATE POLICY "Tourists can create permits"
  ON permits FOR INSERT WITH CHECK (tourist_id = auth.uid());

CREATE POLICY "Users can update own permits"
  ON permits FOR UPDATE USING (tourist_id = auth.uid() OR get_user_role() = 'admin');

-- ---- FESTIVAL ALERTS POLICIES ----
CREATE POLICY "Anyone can view festival alerts"
  ON festival_alerts FOR SELECT USING (true);

CREATE POLICY "Admins can manage festival alerts"
  ON festival_alerts FOR ALL USING (get_user_role() = 'admin');
