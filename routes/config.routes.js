const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// GET /api/config — cualquier usuario autenticado (cliente necesita el teléfono de contacto)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT clave, valor FROM config_negocio');
    const obj = {};
    rows.forEach(r => { obj[r.clave] = r.valor; });
    res.json(obj);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/config — solo admin
router.put('/', authMiddleware, adminOnly, async (req, res) => {
  const permitidos = ['nombre', 'nit', 'ciudad', 'telefono', 'direccion', 'horario'];
  const entries = Object.entries(req.body).filter(([k]) => permitidos.includes(k));
  if (!entries.length) return res.status(400).json({ error: 'Sin campos válidos' });
  try {
    await Promise.all(
      entries.map(([clave, valor]) =>
        db.query('INSERT INTO config_negocio (clave, valor) VALUES (?,?) ON DUPLICATE KEY UPDATE valor=?',
          [clave, String(valor), String(valor)])
      )
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
