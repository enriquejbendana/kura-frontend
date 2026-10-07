-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de Farmacias
CREATE TABLE pharmacies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT
);

-- 2. Tabla de Principios Activos
CREATE TABLE active_principles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  uses TEXT,
  warnings TEXT
);

-- 3. Tabla de Productos
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  commercial_name TEXT NOT NULL,
  laboratory TEXT,
  composition TEXT,
  details TEXT,
  image_url TEXT,
  active_principle_id TEXT REFERENCES active_principles(id)
);

-- 4. Tabla de Precios (Relación Producto-Farmacia)
CREATE TABLE product_prices (
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  pharmacy_id TEXT REFERENCES pharmacies(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL,
  PRIMARY KEY (product_id, pharmacy_id)
);

-- 5. Tabla de Alianzas y Descuentos
CREATE TABLE discounts (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  bank TEXT NOT NULL,
  bank_color TEXT,
  bank_highlight TEXT,
  pharmacy_id TEXT REFERENCES pharmacies(id),
  pharmacy_color TEXT,
  discount TEXT NOT NULL,
  type TEXT,
  day_ids INTEGER[]
);

-- Habilitar RLS (Seguridad a Nivel de Fila)
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_principles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública (Cualquiera puede leer)
CREATE POLICY "Lectura pública de farmacias" ON pharmacies FOR SELECT USING (true);
CREATE POLICY "Lectura pública de principios" ON active_principles FOR SELECT USING (true);
CREATE POLICY "Lectura pública de productos" ON products FOR SELECT USING (true);
CREATE POLICY "Lectura pública de precios" ON product_prices FOR SELECT USING (true);
CREATE POLICY "Lectura pública de descuentos" ON discounts FOR SELECT USING (true);

-- Políticas de inserción/actualización pública (SOLO PARA LA MIGRACIÓN INICIAL)
-- IMPORTANTE: Una vez terminada la migración de hoy, desactivaremos estas políticas de escritura.
CREATE POLICY "Insert público farmacias" ON pharmacies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Insert público principios" ON active_principles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Insert público productos" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Insert público precios" ON product_prices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Insert público descuentos" ON discounts FOR ALL USING (true) WITH CHECK (true);
