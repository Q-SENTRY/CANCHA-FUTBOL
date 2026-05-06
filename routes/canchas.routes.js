const express    = require('express');
const router     = express.Router();
const db         = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// GET /api/canchas — público (el portal cliente necesita ver las canchas)
// Auto-sincroniza estados según reservas confirmadas activas en este momento
router.get('/', async (req, res) => {
  try {
    // Marcar 'ocupada' si hay reserva confirmada activa ahora mismo
    await db.query(`
      UPDATE canchas c
      JOIN reservas r ON r.cancha_id = c.id
        AND r.fecha    = CURDATE()
        AND r.estado   = 'confirmada'
        AND r.hora_inicio <= CURTIME()
        AND ADDTIME(r.hora_inicio, SEC_TO_TIME(r.duracion_horas * 3600)) > CURTIME()
      SET c.estado = 'ocupada'
      WHERE c.estado != 'mantenimiento'
    `);
    // Liberar 'ocupada' cuando ya no hay reserva activa
    await db.query(`
      UPDATE canchas
      SET estado = 'disponible'
      WHERE estado = 'ocupada'
        AND id NOT IN (
          SELECT DISTINCT cancha_id FROM reservas
          WHERE fecha  = CURDATE()
            AND estado = 'confirmada'
            AND hora_inicio <= CURTIME()
            AND ADDTIME(hora_inicio, SEC_TO_TIME(duracion_horas * 3600)) > CURTIME()
        )
    `);
    const [rows] = await db.query('SELECT * FROM canchas ORDER BY id');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/canchas
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  const { nombre, tipo, superficie, dimensiones, precio_hora, estado, descripcion } = req.body;
  if (!nombre || !precio_hora) return res.status(400).json({ error: 'Nombre y precio son requeridos' });
  if (isNaN(precio_hora) || Number(precio_hora) <= 0)
    return res.status(400).json({ error: 'Precio por hora debe ser un número positivo' });
  const estadosValidos = ['disponible','ocupada','mantenimiento'];
  if (estado && !estadosValidos.includes(estado))
    return res.status(400).json({ error: 'Estado inválido' });
  try {
    const [r] = await db.query(
      `INSERT INTO canchas (nombre, tipo, superficie, dimensiones, precio_hora, estado, descripcion)
       VALUES (?,?,?,?,?,?,?)`,
      [nombre, tipo || 'Fútbol 5', superficie || 'Sintética', dimensiones || '—',
       precio_hora, estado || 'disponible', descripcion || null]
    );
    logAudit({ accion: 'crear_cancha', usuario_id: req.user.id, usuario_email: req.user.email, detalle: `cancha_id=${r.insertId} nombre="${nombre}"`, ip: req.ip });
    res.status(201).json({ success: true, id: r.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/canchas/:id
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  const { nombre, tipo, superficie, dimensiones, precio_hora, estado, descripcion } = req.body;
  if (precio_hora !== undefined && (isNaN(precio_hora) || Number(precio_hora) <= 0))
    return res.status(400).json({ error: 'Precio por hora debe ser un número positivo' });
  const estadosValidos = ['disponible','ocupada','mantenimiento'];
  if (estado && !estadosValidos.includes(estado))
    return res.status(400).json({ error: 'Estado inválido' });
  try {
    await db.query(
      `UPDATE canchas SET nombre=?,tipo=?,superficie=?,dimensiones=?,precio_hora=?,estado=?,descripcion=?
       WHERE id=?`,
      [nombre, tipo, superficie, dimensiones, precio_hora, estado, descripcion, req.params.id]
    );
    logAudit({ accion: 'editar_cancha', usuario_id: req.user.id, usuario_email: req.user.email, detalle: `cancha_id=${req.params.id}`, ip: req.ip });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PATCH /api/canchas/:id/estado
router.patch('/:id/estado', authMiddleware, adminOnly, async (req, res) => {
  const { estado } = req.body;
  const validos = ['disponible', 'ocupada', 'mantenimiento'];
  if (!validos.includes(estado)) return res.status(400).json({ error: 'Estado inválido' });
  try {
    await db.query('UPDATE canchas SET estado=? WHERE id=?', [estado, req.params.id]);
    logAudit({ accion: 'cambio_estado_cancha', usuario_id: req.user.id, usuario_email: req.user.email, detalle: `cancha_id=${req.params.id} estado=${estado}`, ip: req.ip });
    res.json({ success: true, estado });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/canchas/:id — protegido contra borrado en cascada
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    // Bloquear si hay reservas activas o pendientes asociadas
    const [activas] = await db.query(
      `SELECT COUNT(*) AS total FROM reservas
       WHERE cancha_id = ? AND estado IN ('pendiente','confirmada')`,
      [req.params.id]
    );
    if (activas[0].total > 0) {
      return res.status(409).json({
        error: `No se puede eliminar: hay ${activas[0].total} reserva(s) activa(s) o pendiente(s) en esta cancha`
      });
    }
    await db.query('DELETE FROM canchas WHERE id=?', [req.params.id]);
    logAudit({ accion: 'eliminar_cancha', usuario_id: req.user.id, usuario_email: req.user.email, detalle: `cancha_id=${req.params.id}`, ip: req.ip });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
