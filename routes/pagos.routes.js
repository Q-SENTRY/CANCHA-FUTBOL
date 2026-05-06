const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const mw = [authMiddleware, adminOnly];

router.get('/', ...mw, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, u.nombre AS cliente_nombre
      FROM pagos p
      JOIN usuarios u ON p.cliente_id = u.id
      ORDER BY p.fecha DESC
      LIMIT 50
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Ruta específica ANTES del parámetro genérico /:id para evitar ambigüedad
router.get('/resumen-hoy', ...mw, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        SUM(CASE WHEN metodo='efectivo'   THEN monto ELSE 0 END) AS efectivo,
        SUM(CASE WHEN metodo='nequi'      THEN monto ELSE 0 END) AS nequi,
        SUM(CASE WHEN metodo='daviplata'  THEN monto ELSE 0 END) AS daviplata,
        SUM(CASE WHEN metodo='pse'        THEN monto ELSE 0 END) AS pse,
        SUM(CASE WHEN metodo='tarjeta'    THEN monto ELSE 0 END) AS tarjeta,
        SUM(monto) AS total
      FROM pagos
      WHERE DATE(fecha) = CURDATE() AND estado = 'aprobado'
    `);
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.patch('/:id/estado', ...mw, async (req, res) => {
  const { estado } = req.body;
  const validos = ['pendiente', 'aprobado', 'rechazado'];
  if (!validos.includes(estado)) return res.status(400).json({ error: 'Estado inválido' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query('UPDATE pagos SET estado = ? WHERE id = ?', [estado, req.params.id]);

    if (estado === 'aprobado') {
      const [[pago]] = await conn.query('SELECT reserva_id FROM pagos WHERE id = ?', [req.params.id]);
      if (pago?.reserva_id) {
        await conn.query(
          "UPDATE reservas SET estado = 'confirmada' WHERE id = ? AND estado = 'pendiente'",
          [pago.reserva_id]
        );
      }
    }

    if (estado === 'rechazado') {
      const [[pago]] = await conn.query('SELECT reserva_id FROM pagos WHERE id = ?', [req.params.id]);
      if (pago?.reserva_id) {
        await conn.query(
          "UPDATE reservas SET estado = 'cancelada' WHERE id = ? AND estado = 'pendiente'",
          [pago.reserva_id]
        );
      }
    }

    await conn.commit();
    res.json({ success: true, estado });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
