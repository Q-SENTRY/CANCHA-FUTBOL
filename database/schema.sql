CREATE DATABASE IF NOT EXISTS canchafutbol
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_spanish_ci;

USE canchafutbol;

CREATE TABLE IF NOT EXISTS usuarios (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(100) NOT NULL,
  email      VARCHAR(100) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  rol        ENUM('admin','cliente') DEFAULT 'cliente',
  telefono   VARCHAR(20),
  puntos     INT DEFAULT 0,
  nivel      ENUM('Bronce','Plata','Oro','Diamante') DEFAULT 'Bronce',
  activo     TINYINT DEFAULT 1,
  eliminado  TINYINT DEFAULT 0,
  creado_en  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS canchas (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  tipo          VARCHAR(100),
  superficie    VARCHAR(50),
  dimensiones   VARCHAR(50),
  precio_hora   INT NOT NULL,
  estado        ENUM('disponible','ocupada','mantenimiento') DEFAULT 'disponible',
  descripcion   TEXT
);

CREATE TABLE IF NOT EXISTS reservas (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id      INT NOT NULL,
  cancha_id       INT NOT NULL,
  fecha           DATE NOT NULL,
  hora_inicio     TIME NOT NULL,
  duracion_horas  INT DEFAULT 1,
  total           INT NOT NULL,
  tipo            ENUM('partido_libre','recurrente','torneo','entrenamiento') DEFAULT 'partido_libre',
  metodo_pago     ENUM('efectivo','nequi','daviplata','pse','tarjeta') DEFAULT 'efectivo',
  estado          ENUM('confirmada','pendiente','cancelada') DEFAULT 'pendiente',
  creado_en       DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
  FOREIGN KEY (cancha_id)  REFERENCES canchas(id)
);

CREATE TABLE IF NOT EXISTS pagos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  reserva_id  INT,
  cliente_id  INT NOT NULL,
  concepto    VARCHAR(200),
  metodo      ENUM('efectivo','nequi','daviplata','pse','tarjeta') NOT NULL,
  monto       INT NOT NULL,
  estado      ENUM('aprobado','pendiente','rechazado') DEFAULT 'pendiente',
  fecha       DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reserva_id) REFERENCES reservas(id),
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS torneos (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  nombre              VARCHAR(100) NOT NULL,
  tipo                ENUM('liga','copa','eliminatoria') DEFAULT 'liga',
  estado              ENUM('activo','finalizado','pendiente') DEFAULT 'activo',
  fecha_inicio        DATE,
  fecha_fin           DATE,
  precio_inscripcion  INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS mantenimiento (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  cancha_id       INT,
  descripcion     VARCHAR(200) NOT NULL,
  responsable     VARCHAR(100),
  estado          ENUM('pendiente','en_proceso','completado','urgente') DEFAULT 'pendiente',
  programado_para DATETIME,
  completado_en   DATETIME,
  FOREIGN KEY (cancha_id) REFERENCES canchas(id)
);

CREATE TABLE IF NOT EXISTS inventario (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  nombre           VARCHAR(100) NOT NULL,
  categoria        VARCHAR(50),
  cantidad         INT DEFAULT 0,
  cantidad_minima  INT DEFAULT 5,
  unidad           VARCHAR(20) DEFAULT 'unidad'
);

CREATE TABLE IF NOT EXISTS tokens_recuperacion (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT NOT NULL,
  token       VARCHAR(6)  NOT NULL,
  expira_en   DATETIME    NOT NULL,
  usado       TINYINT     DEFAULT 0,
  creado_en   DATETIME    DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY  uq_usuario (usuario_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS config_negocio (
  clave          VARCHAR(60)  NOT NULL PRIMARY KEY,
  valor          VARCHAR(500) NOT NULL DEFAULT '',
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movimientos_caja (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  fecha       DATE     NOT NULL DEFAULT (CURDATE()),
  hora        TIME     NOT NULL DEFAULT (CURTIME()),
  concepto    VARCHAR(200) NOT NULL,
  tipo        ENUM('apertura','ingreso','egreso','cierre') NOT NULL,
  monto       INT      NOT NULL,
  usuario_id  INT,
  creado_en   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS membresias (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id           INT NOT NULL,
  tipo                 ENUM('plata','oro') NOT NULL,
  precio               INT NOT NULL,
  reservas_incluidas   INT DEFAULT 2,
  fecha_inicio         DATE,
  fecha_vencimiento    DATE,
  activa               TINYINT DEFAULT 1,
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id)
);
