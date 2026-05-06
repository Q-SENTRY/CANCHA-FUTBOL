const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const mw = [authMiddleware, adminOnly];

router.get('/', ...mw, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM inventario ORDER BY categoria, nombre');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', ...mw, async (req, res) => {
  const { nombre, categoria, cantidad, cantidad_minima } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Nombre es requerido' });
  try {
    const [r] = await db.query(
      'INSERT INTO inventario (nombre, categoria, cantidad, cantidad_minima) VALUES (?,?,?,?)',
      [nombre, categoria || 'Equipamiento', cantidad || 0, cantidad_minima || 1]
    );
    res.status(201).json({ success: true, id: r.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', ...mw, async (req, res) => {
  const { nombre, categoria, cantidad, cantidad_minima } = req.body;
  try {
    await db.query(
      'UPDATE inventario SET nombre=?, categoria=?, cantidad=?, cantidad_minima=? WHERE id=?',
      [nombre, categoria, cantidad, cantidad_minima, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', ...mw, async (req, res) => {
  try {
    await db.query('DELETE FROM inventario WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
