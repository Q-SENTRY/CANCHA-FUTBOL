const express    = require('express');
const router     = express.Router();
const db         = require('../config/db');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const { logAudit } = require('../middleware/audit');

const recoveryTokens = new Map();

function issueToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '24h' }
  );
}

function passwordValida(pass) {
  return pass.length >= 8 &&
    /[A-Z]/.test(pass) &&
    /[a-z]/.test(pass) &&
    /[0-9]/.test(pass);
}

// ──────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Campos requeridos' });

  try {
    const [rows] = await db.query(
      `SELECT id, nombre, email, rol, password AS hashed, puntos, nivel, activo, eliminado
       FROM usuarios WHERE email = ?`,
      [email.toLowerCase().trim()]
    );
    if (!rows.length) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const u = rows[0];
    if (u.eliminado) return res.status(401).json({ error: 'Esta cuenta ha sido eliminada' });
    if (!u.activo)   return res.status(401).json({ error: 'Cuenta bloqueada. Contacta al administrador' });

    // Lazy bcrypt migration: if stored as plaintext, compare and rehash
    let valid = false;
    if (u.hashed && u.hashed.startsWith('$2')) {
      valid = await bcrypt.compare(password, u.hashed);
    } else {
      valid = u.hashed === password;
      if (valid) {
        const newHash = await bcrypt.hash(password, 12);
        await db.query('UPDATE usuarios SET password = ? WHERE id = ?', [newHash, u.id]);
      }
    }

    if (!valid) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const { hashed, activo, eliminado, ...safe } = u;
    const token = issueToken(safe);
    logAudit({ accion: 'login', usuario_id: safe.id, usuario_email: safe.email, rol: safe.rol, ip: req.ip });
    res.json({ success: true, token, user: safe });
  } catch (e) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ──────────────────────────────────────
// POST /api/auth/register
// ──────────────────────────────────────
router.post('/register', async (req, res) => {
  const { nombre, email, password, telefono } = req.body;
  if (!nombre || !email || !password)
    return res.status(400).json({ error: 'Nombre, correo y contraseña son requeridos' });
  if (!passwordValida(password))
    return res.status(400).json({
      error: 'La contraseña debe tener al menos 8 caracteres, con mayúsculas, minúsculas y números'
    });

  try {
    const [existing] = await db.query(
      'SELECT id FROM usuarios WHERE email = ? AND eliminado = 0',
      [email.toLowerCase().trim()]
    );
    if (existing.length) return res.status(409).json({ error: 'Este correo ya está registrado' });

    const hashed = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      `INSERT INTO usuarios (nombre, email, password, rol, telefono, puntos, nivel, activo, eliminado)
       VALUES (?, ?, ?, 'cliente', ?, 0, 'Bronce', 1, 0)`,
      [nombre.trim(), email.toLowerCase().trim(), hashed, telefono || null]
    );
    const user = {
      id: result.insertId, nombre: nombre.trim(),
      email: email.toLowerCase().trim(), rol: 'cliente', puntos: 0, nivel: 'Bronce'
    };
    const token = issueToken(user);
    logAudit({ accion: 'registro', usuario_id: user.id, usuario_email: user.email, rol: 'cliente', ip: req.ip });
    res.status(201).json({ success: true, token, user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ──────────────────────────────────────
// POST /api/auth/recuperar
// ──────────────────────────────────────
router.post('/recuperar', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'El correo es requerido' });

  try {
    const [rows] = await db.query(
      'SELECT id, nombre FROM usuarios WHERE email = ? AND activo = 1 AND eliminado = 0',
      [email.toLowerCase().trim()]
    );
    if (!rows.length)
      return res.status(404).json({ error: 'No existe una cuenta activa con ese correo' });

    const usuario = rows[0];
    const token   = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await db.query(
      `INSERT INTO tokens_recuperacion (usuario_id, token, expira_en, usado)
       VALUES (?, ?, ?, 0)
       ON DUPLICATE KEY UPDATE token = VALUES(token), expira_en = VALUES(expira_en), usado = 0`,
      [usuario.id, token, expires]
    );
    recoveryTokens.set(email, { token, userId: usuario.id, expires: expires.getTime() });

    const resp = {
      success: true,
      mensaje: `Código enviado al correo ${email}`,
      nombre: usuario.nombre
    };
    // Exponer el token solo en entornos de desarrollo (sin servidor de correo real)
    if (process.env.NODE_ENV !== 'production') resp.token_demo = token;
    res.json(resp);
  } catch (e) {
    res.status(500).json({ error: 'Error generando token' });
  }
});

// ──────────────────────────────────────
// POST /api/auth/reset
// ──────────────────────────────────────
router.post('/reset', async (req, res) => {
  const { email, token, nueva_password } = req.body;
  if (!email || !token || !nueva_password)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  if (!passwordValida(nueva_password))
    return res.status(400).json({
      error: 'La contraseña debe tener al menos 8 caracteres, con mayúsculas, minúsculas y números'
    });

  try {
    const [tokens] = await db.query(
      `SELECT tr.id, tr.usuario_id, tr.expira_en
       FROM tokens_recuperacion tr
       JOIN usuarios u ON tr.usuario_id = u.id
       WHERE u.email = ? AND tr.token = ? AND tr.usado = 0
       ORDER BY tr.creado_en DESC LIMIT 1`,
      [email.toLowerCase().trim(), token]
    );

    const memToken = recoveryTokens.get(email);
    const validMem = memToken && memToken.token === token && Date.now() < memToken.expires;

    if (!tokens.length && !validMem)
      return res.status(400).json({ error: 'Código inválido o expirado' });

    const hashed = await bcrypt.hash(nueva_password, 12);

    if (tokens.length) {
      const t = tokens[0];
      if (new Date(t.expira_en) < new Date())
        return res.status(400).json({ error: 'El código ha expirado. Solicita uno nuevo' });
      await db.query('UPDATE tokens_recuperacion SET usado = 1 WHERE id = ?', [t.id]);
      await db.query('UPDATE usuarios SET password = ? WHERE id = ?', [hashed, t.usuario_id]);
    } else {
      await db.query('UPDATE usuarios SET password = ? WHERE id = ?', [hashed, memToken.userId]);
    }

    recoveryTokens.delete(email);
    res.json({ success: true, mensaje: 'Contraseña actualizada correctamente' });
  } catch (e) {
    res.status(500).json({ error: 'Error al restablecer contraseña' });
  }
});

module.exports = router;
