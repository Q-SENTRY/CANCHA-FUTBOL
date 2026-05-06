const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const mw = [authMiddleware, adminOnly];

router.get('/', ...mw, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM mantenimiento ORDER BY id DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', ...mw, async (req, res) => {
  const { descripcion, responsable, cancha_id, programado_para, estado } = req.body;
  if (!descripcion) return res.status(400).json({ error: 'Descripción es requerida' });
  try {
    const [r] = await db.query(
      `INSERT INTO mantenimiento (descripcion, responsable, cancha_id, programado_para, estado)
       VALUES (?,?,?,?,?)`,
      [descripcion, responsable || null, cancha_id || null,
       programado_para || null, estado || 'pendiente']
    );
    res.status(201).json({ success: true, id: r.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', ...mw, async (req, res) => {
  const { descripcion, responsable, cancha_id, programado_para, estado } = req.body;
  try {
    await db.query(
      `UPDATE mantenimiento SET descripcion=?, responsable=?, cancha_id=?, programado_para=?, estado=?
       WHERE id=?`,
      [descripcion, responsable || null, cancha_id || null,
       programado_para || null, estado || 'pendiente', req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.patch('/:id/estado', ...mw, async (req, res) => {
  const { estado } = req.body;
  const validos = ['pendiente', 'en_proceso', 'completado', 'urgente'];
  if (!validos.includes(estado)) return res.status(400).json({ error: 'Estado inválido' });
  try {
    await db.query('UPDATE mantenimiento SET estado=? WHERE id=?', [estado, req.params.id]);
    res.json({ success: true, estado });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', ...mw, async (req, res) => {
  try {
    await db.query('DELETE FROM mantenimiento WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
