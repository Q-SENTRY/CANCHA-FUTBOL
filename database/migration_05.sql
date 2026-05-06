-- migration_05: Índices de rendimiento + CASCADE en foreign keys
-- Ejecutar: mysql -u root -p canchafutbol < database/migration_05.sql

USE canchafutbol;

-- ── Índices para consultas frecuentes ────────────────────────────────────────
ALTER TABLE reservas
  ADD INDEX IF NOT EXISTS idx_reservas_fecha_estado (fecha, estado),
  ADD INDEX IF NOT EXISTS idx_reservas_cliente      (cliente_id),
  ADD INDEX IF NOT EXISTS idx_reservas_cancha       (cancha_id);

ALTER TABLE pagos
  ADD INDEX IF NOT EXISTS idx_pagos_fecha_estado (fecha, estado),
  ADD INDEX IF NOT EXISTS idx_pagos_cliente      (cliente_id),
  ADD INDEX IF NOT EXISTS idx_pagos_reserva      (reserva_id);

ALTER TABLE movimientos_caja
  ADD INDEX IF NOT EXISTS idx_caja_fecha (fecha);

ALTER TABLE mantenimiento
  ADD INDEX IF NOT EXISTS idx_mant_estado (estado);

-- ── CASCADE DELETE: pagos → reservas ─────────────────────────────────────────
-- MySQL requiere drop + recrear FK para agregar CASCADE
ALTER TABLE pagos DROP FOREIGN KEY IF EXISTS pagos_ibfk_1;
ALTER TABLE pagos
  ADD CONSTRAINT fk_pagos_reserva
  FOREIGN KEY (reserva_id) REFERENCES reservas(id)
  ON DELETE CASCADE;

-- ── CASCADE DELETE: reservas → usuario/cancha (SET NULL al borrar usuario) ───
ALTER TABLE reservas DROP FOREIGN KEY IF EXISTS reservas_ibfk_1;
ALTER TABLE reservas DROP FOREIGN KEY IF EXISTS reservas_ibfk_2;

ALTER TABLE reservas
  ADD CONSTRAINT fk_reservas_cliente
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id)
  ON DELETE CASCADE;

ALTER TABLE reservas
  ADD CONSTRAINT fk_reservas_cancha
  FOREIGN KEY (cancha_id) REFERENCES canchas(id)
  ON DELETE RESTRICT;
