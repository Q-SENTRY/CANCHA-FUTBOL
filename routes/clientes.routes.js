const express    = require('express');
const router     = express.Router();
const db         = require('../config/db');
const bcrypt     = require('bcryptjs');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// GET /api/clientes — admin only
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        u.id, u.nombre, u.email, u.telefono, u.puntos, u.nivel,
        u.activo, u.creado_en,
        COUNT(r.id)              AS total_reservas,
        COALESCE(SUM(r.total),0) AS total_gastado
      FROM usuarios u
      LEFT JOIN reservas r ON u.id = r.cliente_id AND r.estado != 'cancelada'
      WHERE u.rol = 'cliente' AND u.eliminado = 0
      GROUP BY u.id
      ORDER BY total_reservas DESC
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/clientes/:id/historial — own client or admin
router.get('/:id/historial', authMiddleware, async (req, res) => {
  if (req.user.rol !== 'admin' && req.user.id !== parseInt(req.params.id))
    return res.status(403).json({ error: 'Acceso denegado' });
  try {
    const [rows] = await db.query(`
      SELECT
        p.id,
        DATE_FORMAT(p.fecha, '%Y-%m-%d') AS fecha,
        CONCAT('Reserva – ', c.nombre, ' (', r.duracion_horas, 'h)')  AS concepto,
        ROUND(p.monto / 10000)                                          AS puntos,
        'ganado'                                                         AS tipo
      FROM pagos p
      JOIN reservas r ON p.reserva_id = r.id
      JOIN canchas  c ON r.cancha_id  = c.id
      WHERE p.cliente_id = ? AND p.estado IN ('pendiente', 'aprobado')
      ORDER BY p.fecha DESC
      LIMIT 20
    `, [req.params.id]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/clientes/:id — any auth
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nombre, email, telefono, puntos, nivel, activo FROM usuarios WHERE id = ? AND eliminado = 0',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/clientes/:id — own profile or admin
router.put('/:id', authMiddleware, async (req, res) => {
  if (req.user.rol !== 'admin' && req.user.id !== parseInt(req.params.id))
    return res.status(403).json({ error: 'Acceso denegado' });
  const { nombre, telefono, password } = req.body;
  try {
    if (password) {
      const hashed = await bcrypt.hash(password, 12);
      await db.query(
        'UPDATE usuarios SET nombre = ?, telefono = ?, password = ? WHERE id = ?',
        [nombre, telefono, hashed, req.params.id]
      );
    } else {
      await db.query(
        'UPDATE usuarios SET nombre = ?, telefono = ? WHERE id = ?',
        [nombre, telefono, req.params.id]
      );
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PATCH /api/clientes/:id/estado — admin only
router.patch('/:id/estado', authMiddleware, adminOnly, async (req, res) => {
  const { activo } = req.body;
  if (activo === undefined) return res.status(400).json({ error: 'Campo activo requerido' });
  try {
    const [info] = await db.query(
      'SELECT rol FROM usuarios WHERE id = ? AND eliminado = 0', [req.params.id]
    );
    if (!info.length) return res.status(404).json({ error: 'Cliente no encontrado' });
    if (info[0].rol === 'admin') return res.status(403).json({ error: 'No se puede bloquear al administrador' });

    await db.query('UPDATE usuarios SET activo = ? WHERE id = ?', [activo ? 1 : 0, req.params.id]);
    logAudit({ accion: activo ? 'desbloquear_cliente' : 'bloquear_cliente', usuario_id: req.user.id, usuario_email: req.user.email, detalle: `cliente_id=${req.params.id}`, ip: req.ip });
    res.json({ success: true, activo: activo ? 1 : 0 });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/clientes/:id (soft-delete) — admin only
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [info] = await db.query(
      'SELECT rol FROM usuarios WHERE id = ? AND eliminado = 0', [req.params.id]
    );
    if (!info.length) return res.status(404).json({ error: 'Cliente no encontrado' });
    if (info[0].rol === 'admin') return res.status(403).json({ error: 'No se puede eliminar al administrador' });

    await db.query('UPDATE usuarios SET eliminado = 1, activo = 0 WHERE id = ?', [req.params.id]);
    logAudit({ accion: 'eliminar_cliente', usuario_id: req.user.id, usuario_email: req.user.email, detalle: `cliente_id=${req.params.id}`, ip: req.ip });
    res.json({ success: true, mensaje: 'Cliente eliminado del sistema' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
