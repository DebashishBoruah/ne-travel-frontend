-- ============================================
-- CONTENT TABLES (Replaces Sanity CMS)
-- ============================================

-- 1. Destinations
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  state TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  hero_image TEXT,
  description TEXT,
  cultural_context TEXT,
  tribal_history TEXT,
  best_season TEXT,
  permit_required BOOLEAN DEFAULT false,
  map_coordinates JSONB, -- { lat: number, lng: number }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_destinations_state ON destinations(state);
CREATE INDEX idx_destinations_slug ON destinations(slug);

-- 2. Festivals
CREATE TABLE IF NOT EXISTS festivals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  slug TEXT UNIQUE NOT NULL,
  hero_image TEXT,
  description TEXT,
  cultural_significance TEXT,
  how_to_attend TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_festivals_month ON festivals(month);
CREATE INDEX idx_festivals_state ON festivals(state);
CREATE INDEX idx_festivals_slug ON festivals(slug);

-- 3. Articles
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('destination', 'festival', 'culture', 'permit')),
  body TEXT NOT NULL,
  author TEXT,
  hero_image TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_slug ON articles(slug);

-- 4. Permit Guides
CREATE TABLE IF NOT EXISTS permit_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state TEXT NOT NULL,
  permit_type TEXT,
  who_needs_it TEXT,
  how_to_apply TEXT,
  documents_required TEXT[] DEFAULT '{}',
  processing_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_permit_guides_state ON permit_guides(state);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permit_guides ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view destinations" ON destinations FOR SELECT USING (true);
CREATE POLICY "Public can view festivals" ON festivals FOR SELECT USING (true);
CREATE POLICY "Public can view articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Public can view permit guides" ON permit_guides FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "Admins can manage destinations" ON destinations FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admins can manage festivals" ON festivals FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admins can manage articles" ON articles FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admins can manage permit guides" ON permit_guides FOR ALL USING (get_user_role() = 'admin');
