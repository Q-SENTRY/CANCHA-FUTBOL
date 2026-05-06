const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const mw = [authMiddleware, adminOnly];

router.get('/', ...mw, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM torneos ORDER BY id DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', ...mw, async (req, res) => {
  const { nombre, tipo, fecha_inicio, fecha_fin, precio_inscripcion, estado } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Nombre es requerido' });
  try {
    const [r] = await db.query(
      `INSERT INTO torneos (nombre, tipo, fecha_inicio, fecha_fin, precio_inscripcion, estado)
       VALUES (?,?,?,?,?,?)`,
      [nombre, tipo || 'liga', fecha_inicio || null, fecha_fin || null,
       precio_inscripcion || 0, estado || 'activo']
    );
    res.status(201).json({ success: true, id: r.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', ...mw, async (req, res) => {
  const { nombre, tipo, fecha_inicio, fecha_fin, precio_inscripcion, estado } = req.body;
  try {
    await db.query(
      `UPDATE torneos SET nombre=?, tipo=?, fecha_inicio=?, fecha_fin=?, precio_inscripcion=?, estado=?
       WHERE id=?`,
      [nombre, tipo || 'liga', fecha_inicio || null, fecha_fin || null,
       precio_inscripcion || 0, estado || 'activo', req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', ...mw, async (req, res) => {
  try {
    await db.query('DELETE FROM torneos WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
