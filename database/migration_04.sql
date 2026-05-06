USE canchafutbol;

-- Columna faltante en reservas (migration_01 fue aplicada parcialmente)
ALTER TABLE reservas
  ADD COLUMN IF NOT EXISTS actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
