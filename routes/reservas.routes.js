const express    = require('express');
const router     = express.Router();
const db         = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

// GET /api/reservas — admin only
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, DATE_FORMAT(r.fecha,'%Y-%m-%d') AS fecha,
             u.nombre AS cliente_nombre, c.nombre AS cancha_nombre, c.tipo AS cancha_tipo
      FROM reservas r
      JOIN usuarios u ON r.cliente_id = u.id
      JOIN canchas c ON r.cancha_id = c.id
      ORDER BY r.creado_en DESC
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/reservas/hoy — admin only
router.get('/hoy', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*, DATE_FORMAT(r.fecha,'%Y-%m-%d') AS fecha,
             u.nombre AS cliente_nombre, c.nombre AS cancha_nombre
      FROM reservas r
      JOIN usuarios u ON r.cliente_id = u.id
      JOIN canchas c ON r.cancha_id = c.id
      WHERE r.fecha = CURDATE()
      ORDER BY r.hora_inicio
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/reservas/cliente/:id — auth (own data or admin)
router.get('/cliente/:id', authMiddleware, async (req, res) => {
  if (req.user.rol !== 'admin' && req.user.id !== parseInt(req.params.id))
    return res.status(403).json({ error: 'Acceso denegado' });
  try {
    const [rows] = await db.query(`
      SELECT r.*, DATE_FORMAT(r.fecha,'%Y-%m-%d') AS fecha,
             c.nombre AS cancha_nombre, c.tipo AS cancha_tipo
      FROM reservas r
      JOIN canchas c ON r.cancha_id = c.id
      WHERE r.cliente_id = ?
      ORDER BY r.fecha DESC, r.hora_inicio DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/reservas/disponibilidad — auth
router.get('/disponibilidad', authMiddleware, async (req, res) => {
  const { cancha_id, fecha, hora_inicio, duracion } = req.query;
  try {
    const [rows] = await db.query(`
      SELECT id FROM reservas
      WHERE cancha_id=? AND fecha=? AND estado != 'cancelada'
        AND hora_inicio < ADDTIME(?, SEC_TO_TIME(?*3600))
        AND ADDTIME(hora_inicio, SEC_TO_TIME(duracion_horas*3600)) > ?
    `, [cancha_id, fecha, hora_inicio, duracion || 1, hora_inicio]);
    res.json({ disponible: rows.length === 0 });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Descuento por nivel — fuente única de verdad en el backend
function descuentoPorNivel(nivel) {
  return { Bronce: 0, Plata: 5, Oro: 10, Diamante: 15 }[nivel] || 0;
}

// POST /api/reservas — auth (any logged-in user); atomic double-booking check
router.post('/', authMiddleware, async (req, res) => {
  const { cliente_id, cancha_id, fecha, hora_inicio, duracion_horas, tipo, metodo_pago } = req.body;

  if (!cliente_id || !cancha_id || !fecha || !hora_inicio || !duracion_horas)
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  if (!Number.isInteger(Number(cliente_id)) || !Number.isInteger(Number(cancha_id)))
    return res.status(400).json({ error: 'IDs inválidos' });
  if (isNaN(duracion_horas) || duracion_horas < 1 || duracion_horas > 12)
    return res.status(400).json({ error: 'Duración inválida (1–12 horas)' });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha))
    return res.status(400).json({ error: 'Formato de fecha inválido' });
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(hora_inicio))
    return res.status(400).json({ error: 'Formato de hora inválido' });
  const metodosValidos = ['efectivo','nequi','daviplata','pse','tarjeta'];
  if (metodo_pago && !metodosValidos.includes(metodo_pago))
    return res.status(400).json({ error: 'Método de pago inválido' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Verify cancha exists, is available, and fetch authoritative price
    const [canchaRows] = await conn.query(
      'SELECT estado, precio_hora FROM canchas WHERE id = ? FOR UPDATE', [cancha_id]
    );
    if (!canchaRows.length) {
      await conn.rollback();
      return res.status(404).json({ error: 'Cancha no encontrada' });
    }
    if (canchaRows[0].estado !== 'disponible') {
      await conn.rollback();
      return res.status(409).json({ error: `La cancha está ${canchaRows[0].estado}` });
    }

    // Fetch authoritative nivel from DB — never trust the client for discounts
    const [userRows] = await conn.query('SELECT nivel FROM usuarios WHERE id = ?', [cliente_id]);
    const nivelReal    = userRows.length ? userRows[0].nivel : 'Bronce';
    const descuento    = descuentoPorNivel(nivelReal);
    const precioHora   = canchaRows[0].precio_hora;
    // Total calculado en el servidor — ignora el valor enviado por el cliente
    const totalServidor = Math.round(precioHora * duracion_horas * (1 - descuento / 100));

    // Lock conflicting rows so concurrent requests can't slip through
    const [overlap] = await conn.query(`
      SELECT id FROM reservas
      WHERE cancha_id = ? AND fecha = ? AND estado != 'cancelada'
        AND hora_inicio < ADDTIME(?, SEC_TO_TIME(?*3600))
        AND ADDTIME(hora_inicio, SEC_TO_TIME(duracion_horas*3600)) > ?
      FOR UPDATE
    `, [cancha_id, fecha, hora_inicio, duracion_horas, hora_inicio]);

    if (overlap.length) {
      await conn.rollback();
      return res.status(409).json({ error: 'Horario no disponible para esa cancha' });
    }

    const [result] = await conn.query(
      'INSERT INTO reservas (cliente_id,cancha_id,fecha,hora_inicio,duracion_horas,total,tipo,metodo_pago,estado) VALUES (?,?,?,?,?,?,?,?,?)',
      [cliente_id, cancha_id, fecha, hora_inicio, duracion_horas, totalServidor,
       tipo || 'partido_libre', metodo_pago || 'efectivo', 'pendiente']
    );
    const reservaId = result.insertId;

    await conn.query(
      'INSERT INTO pagos (reserva_id, cliente_id, concepto, metodo, monto, estado) VALUES (?,?,?,?,?,?)',
      [reservaId, cliente_id, `Reserva cancha ${cancha_id} – ${fecha}`,
       metodo_pago || 'efectivo', totalServidor, 'pendiente']
    );

    const ptsGanados = Math.floor(totalServidor / 10000);
    await conn.query('UPDATE usuarios SET puntos = puntos + ? WHERE id = ?', [ptsGanados, cliente_id]);
    await conn.query(`UPDATE usuarios SET nivel = CASE
      WHEN puntos >= 800 THEN 'Diamante'
      WHEN puntos >= 501 THEN 'Oro'
      WHEN puntos >= 201 THEN 'Plata'
      ELSE 'Bronce' END WHERE id = ?`, [cliente_id]);

    await conn.commit();
    logAudit({
      accion: 'crear_reserva', usuario_id: req.user.id, usuario_email: req.user.email,
      detalle: `reserva_id=${reservaId} cancha=${cancha_id} fecha=${fecha} total=${totalServidor} nivel=${nivelReal} desc=${descuento}%`,
      ip: req.ip
    });
    res.json({ success: true, id: reservaId, total: totalServidor, puntosGanados: ptsGanados, descuento, nivel: nivelReal });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
});

// PUT /api/reservas/:id — admin only
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  const { estado } = req.body;
  try {
    await db.query('UPDATE reservas SET estado=? WHERE id=?', [estado, req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/reservas/:id (soft cancel) — own or admin
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [r] = await db.query('SELECT cliente_id FROM reservas WHERE id = ?', [req.params.id]);
    if (!r.length) return res.status(404).json({ error: 'Reserva no encontrada' });
    if (req.user.rol !== 'admin' && req.user.id !== r[0].cliente_id)
      return res.status(403).json({ error: 'Acceso denegado' });
    await db.query("UPDATE reservas SET estado='cancelada' WHERE id=?", [req.params.id]);
    // Rechazar pagos pendientes; los aprobados quedan como rechazado para trazabilidad de reembolso
    await db.query(
      "UPDATE pagos SET estado='rechazado' WHERE reserva_id=? AND estado IN ('pendiente','aprobado')",
      [req.params.id]
    );
    logAudit({ accion: 'cancelar_reserva', usuario_id: req.user.id, usuario_email: req.user.email, detalle: `reserva_id=${req.params.id}`, ip: req.ip });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
