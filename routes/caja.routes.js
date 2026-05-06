const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.use(authMiddleware, adminOnly);

// GET /api/caja?fecha=YYYY-MM-DD  (default: today)
router.get('/', async (req, res) => {
  const fecha = req.query.fecha || new Date().toISOString().slice(0, 10);
  try {
    const [rows] = await db.query(
      `SELECT id, TIME_FORMAT(hora,'%H:%i') AS hora, concepto, tipo, monto
       FROM movimientos_caja
       WHERE fecha = ?
       ORDER BY hora, id`,
      [fecha]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/caja — registrar movimiento
router.post('/', async (req, res) => {
  const { concepto, tipo, monto } = req.body;
  const tipos = ['apertura', 'ingreso', 'egreso', 'cierre'];
  if (!concepto || !tipo || monto == null) return res.status(400).json({ error: 'Campos requeridos: concepto, tipo, monto' });
  if (!tipos.includes(tipo)) return res.status(400).json({ error: 'Tipo inválido' });
  try {
    const [r] = await db.query(
      `INSERT INTO movimientos_caja (concepto, tipo, monto, usuario_id) VALUES (?,?,?,?)`,
      [concepto, tipo, monto, req.user.id]
    );
    res.json({ success: true, id: r.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/caja/resumen — total ingresos/egresos de hoy
router.get('/resumen', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        SUM(CASE WHEN tipo IN ('apertura','ingreso') THEN monto ELSE 0 END) AS entradas,
        SUM(CASE WHEN tipo = 'egreso'                THEN ABS(monto) ELSE 0 END) AS salidas
      FROM movimientos_caja
      WHERE fecha = CURDATE()
    `);
    const { entradas, salidas } = rows[0];
    res.json({ entradas: entradas || 0, salidas: salidas || 0, total: (entradas || 0) - (salidas || 0) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
