USE canchafutbol;

INSERT INTO usuarios (nombre, email, password, rol, telefono, puntos, nivel) VALUES
('Daniel Aldana',  'admin@canchas.co',    'admin123',   'admin',   '310 000 0001', 0,   'Bronce'),
('Carlos Mendoza', 'cliente@correo.co',   'cliente123', 'cliente', '311 234 5678', 920, 'Diamante'),
('Sofía Ruiz',     'sofia@correo.co',     'cliente123', 'cliente', '300 987 6543', 810, 'Diamante'),
('Juan Pérez',     'juan@correo.co',      'cliente123', 'cliente', '315 456 7890', 740, 'Oro'),
('Laura Gómez',    'laura@correo.co',     'cliente123', 'cliente', '314 555 8899', 560, 'Oro'),
('Andrés Torres',  'andres@correo.co',    'cliente123', 'cliente', '320 111 2233', 620, 'Oro');

INSERT INTO canchas (nombre, tipo, superficie, dimensiones, precio_hora, estado) VALUES
('Cancha 1', 'Fútbol 11', 'Natural',   '100×65m', 160000, 'ocupada'),
('Cancha 2', 'Fútbol 5',  'Sintética', '30×20m',  90000,  'disponible'),
('Cancha 3', 'Fútbol 5',  'Sintética', '30×20m',  90000,  'ocupada'),
('Cancha 4', 'Fútbol 7',  'Sintética', '50×32m',  110000, 'disponible'),
('Cancha 5', 'Fútbol 7',  'Sintética', '50×32m',  110000, 'mantenimiento');

INSERT INTO reservas (cliente_id, cancha_id, fecha, hora_inicio, duracion_horas, total, tipo, metodo_pago, estado) VALUES
(2, 3, CURDATE(), '08:00:00', 1, 90000,  'partido_libre', 'nequi',     'confirmada'),
(3, 1, CURDATE(), '10:00:00', 2, 320000, 'partido_libre', 'daviplata', 'pendiente'),
(4, 5, CURDATE(), '14:00:00', 1, 110000, 'partido_libre', 'efectivo',  'confirmada'),
(5, 2, CURDATE(), '16:00:00', 1, 90000,  'partido_libre', 'efectivo',  'cancelada'),
(3, 4, CURDATE(), '18:00:00', 1, 110000, 'partido_libre', 'tarjeta',   'confirmada');

INSERT INTO pagos (reserva_id, cliente_id, concepto, metodo, monto, estado) VALUES
(1, 2, 'Reserva Cancha 3 - 1h', 'nequi',     90000,  'aprobado'),
(3, 4, 'Reserva Cancha 5 - 1h', 'efectivo',  110000, 'aprobado'),
(5, 3, 'Reserva Cancha 4 - 1h', 'tarjeta',   110000, 'aprobado'),
(NULL, 2, 'Cuota torneo Liga Barrial', 'pse', 250000, 'aprobado');

INSERT INTO torneos (nombre, tipo, estado, fecha_inicio, fecha_fin, precio_inscripcion) VALUES
('Liga Barrial Marzo',  'liga',        'activo',   '2026-03-01', '2026-03-31', 250000),
('Copa Empresarial',    'copa',        'activo',   '2026-03-15', '2026-04-15', 300000),
('Torneo F5 Abril',     'eliminatoria','pendiente','2026-04-01', '2026-04-30', 150000);

INSERT INTO mantenimiento (cancha_id, descripcion, responsable, estado, programado_para) VALUES
(1, 'Regar y revisar césped natural',    'Miguel Rodríguez', 'completado', '2026-03-17 06:30:00'),
(5, 'Pintar líneas del campo',           'Carlos Pineda',    'en_proceso', '2026-03-17 14:00:00'),
(3, 'Revisar grama sintética costuras',  'Carlos Pineda',    'urgente',    '2026-03-17 09:00:00'),
(1, 'Revisar sistema de drenaje',        'Miguel Rodríguez', 'pendiente',  '2026-03-17 15:00:00');

INSERT INTO inventario (nombre, categoria, cantidad, cantidad_minima, unidad) VALUES
('Balones Fútbol 11',       'Equipamiento',    18, 10, 'unidad'),
('Balones Fútbol 5',        'Equipamiento',    12, 8,  'unidad'),
('Chalecos Peto',           'Equipamiento',    6,  20, 'unidad'),
('Conos Demarcación',       'Equipamiento',    84, 30, 'unidad'),
('Redes de Arco',           'Infraestructura', 8,  4,  'unidad'),
('Botiquín Primeros Aux.',  'Seguridad',       2,  4,  'unidad'),
('Guantes de Portero',      'Equipamiento',    10, 6,  'unidad'),
('Pintura Líneas',          'Mantenimiento',   3,  6,  'galón'),
('Tableros Tácticos',       'Equipamiento',    5,  2,  'unidad');

INSERT INTO membresias (cliente_id, tipo, precio, reservas_incluidas, fecha_inicio, fecha_vencimiento, activa) VALUES
(2, 'oro',   180000, 4, '2026-03-01', '2026-03-31', 1),
(3, 'plata',  90000, 2, '2026-03-01', '2026-03-31', 1);
