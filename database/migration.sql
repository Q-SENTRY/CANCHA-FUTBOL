USE canchafutbol;

-- Soft-delete flag (preserva historial de reservas)
ALTER TABLE usuarios
  ADD COLUMN eliminado TINYINT DEFAULT 0 COMMENT '0=existe, 1=eliminado suave';

-- Tabla de tokens de recuperación de contraseña
CREATE TABLE IF NOT EXISTS tokens_recuperacion (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  token      VARCHAR(6)  NOT NULL,
  expira_en  DATETIME    NOT NULL,
  usado      TINYINT     DEFAULT 0,
  creado_en  DATETIME    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Asegura que activo=1 en todos los registros existentes
UPDATE usuarios SET eliminado = 0 WHERE eliminado IS NULL;

-- Timestamp de último cambio de estado en reservas (para notificaciones de confirmación/cancelación)
ALTER TABLE reservas
  ADD COLUMN actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Configuración general del negocio (clave-valor)
CREATE TABLE IF NOT EXISTS config_negocio (
  clave     VARCHAR(60)  NOT NULL PRIMARY KEY,
  valor     VARCHAR(500) NOT NULL DEFAULT '',
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO config_negocio (clave, valor) VALUES
  ('nombre',   'Canchas El Campeón'),
  ('nit',      '900.123.456-7'),
  ('ciudad',   'Bogotá, D.C.'),
  ('telefono', '601 234 5678'),
  ('direccion','Cra 7 # 45-23, Localidad de Usaquén'),
  ('horario',  '06:00 – 23:00 (todos los días)');

-- Movimientos de caja diarios (apertura, ingresos manuales, egresos, cierre)
CREATE TABLE IF NOT EXISTS movimientos_caja (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  fecha      DATE     NOT NULL DEFAULT (CURDATE()),
  hora       TIME     NOT NULL DEFAULT (CURTIME()),
  concepto   VARCHAR(200) NOT NULL,
  tipo       ENUM('apertura','ingreso','egreso','cierre') NOT NULL,
  monto      INT      NOT NULL,
  usuario_id INT,
  creado_en  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);
