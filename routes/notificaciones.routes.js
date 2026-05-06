const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.use(authMiddleware, adminOnly);

router.get('/', async (req, res) => {
  const notifs = [];

  // ── Reservas pendientes de confirmación ─────────────────────────────────
  try {
    const [rows] = await db.query(`
      SELECT r.id, r.hora_inicio, r.fecha, r.creado_en,
             u.nombre AS cliente, c.nombre AS cancha
      FROM reservas r
      JOIN usuarios u ON r.cliente_id = u.id
      JOIN canchas  c ON r.cancha_id  = c.id
      WHERE r.estado = 'pendiente'
      ORDER BY r.creado_en DESC
      LIMIT 10
    `);
    rows.forEach(r => {
      const min = Math.round((Date.now() - new Date(r.creado_en)) / 60000);
      notifs.push({
        tipo: 'warning', color: 'gold',
        titulo:  '⏳ Reserva pendiente de confirmación',
        mensaje: `${r.cliente} · ${r.cancha} · ${String(r.hora_inicio).substring(0, 5)} · ${r.fecha}`,
        tiempo:  min < 60 ? `Hace ${min} min` : `Hace ${Math.round(min / 60)}h`,
        leida: false, ref: `pendiente_${r.id}`
      });
    });
  } catch (_) {}

  // ── Reservas confirmadas hoy ─────────────────────────────────────────────
  try {
    const [rows] = await db.query(`
      SELECT r.id, r.hora_inicio, r.fecha, r.creado_en,
             u.nombre AS cliente, c.nombre AS cancha
      FROM reservas r
      JOIN usuarios u ON r.cliente_id = u.id
      JOIN canchas  c ON r.cancha_id  = c.id
      WHERE r.estado = 'confirmada'
        AND r.fecha  = CURDATE()
      ORDER BY r.hora_inicio
      LIMIT 10
    `);
    rows.forEach(r => {
      const min = Math.round((Date.now() - new Date(r.creado_en)) / 60000);
      notifs.push({
        tipo: 'success', color: 'green',
        titulo:  '✅ Reserva confirmada',
        mensaje: `${r.cliente} · ${r.cancha} · ${String(r.hora_inicio).substring(0, 5)}`,
        tiempo:  min < 1440 ? (min < 60 ? `Hace ${min} min` : `Hace ${Math.round(min / 60)}h`) : 'Hoy',
        leida: false, ref: `confirmada_${r.id}`
      });
    });
  } catch (_) {}

  // ── Reservas canceladas (hoy y futuras) ──────────────────────────────────
  try {
    const [rows] = await db.query(`
      SELECT r.id, r.hora_inicio, r.fecha, r.creado_en,
             u.nombre AS cliente, c.nombre AS cancha
      FROM reservas r
      JOIN usuarios u ON r.cliente_id = u.id
      JOIN canchas  c ON r.cancha_id  = c.id
      WHERE r.estado = 'cancelada'
        AND r.fecha  >= CURDATE()
      ORDER BY r.fecha, r.hora_inicio
      LIMIT 10
    `);
    rows.forEach(r => {
      const esFutura = r.fecha > new Date().toISOString().slice(0, 10);
      notifs.push({
        tipo: 'danger', color: 'red',
        titulo:  '❌ Reserva cancelada',
        mensaje: `${r.cliente} · ${r.cancha} · ${String(r.hora_inicio).substring(0, 5)} · ${r.fecha}`,
        tiempo:  esFutura ? `Para ${r.fecha}` : 'Hoy',
        leida: false, ref: `cancelada_${r.id}`
      });
    });
  } catch (_) {}

  // ── Stock bajo en inventario ─────────────────────────────────────────────
  try {
    const [rows] = await db.query(`
      SELECT nombre, cantidad, cantidad_minima
      FROM inventario
      WHERE cantidad < cantidad_minima
      ORDER BY (cantidad_minima - cantidad) DESC
    `);
    rows.forEach(i => {
      notifs.push({
        tipo: 'danger', color: 'orange',
        titulo:  `📦 Stock bajo — ${i.nombre}`,
        mensaje: `Quedan ${i.cantidad} unidades (mínimo: ${i.cantidad_minima})`,
        tiempo: 'Ahora', leida: false, ref: `inv_${i.nombre}`
      });
    });
  } catch (_) {}

  // ── Nuevos clientes (últimas 48 h) ───────────────────────────────────────
  try {
    const [rows] = await db.query(`
      SELECT nombre, email, creado_en
      FROM usuarios
      WHERE rol = 'cliente' AND eliminado = 0
        AND creado_en >= NOW() - INTERVAL 48 HOUR
      ORDER BY creado_en DESC
    `);
    rows.forEach(u => {
      const min = Math.round((Date.now() - new Date(u.creado_en)) / 60000);
      notifs.push({
        tipo: 'info', color: 'blue',
        titulo:  '👤 Nuevo cliente registrado',
        mensaje: `${u.nombre} (${u.email})`,
        tiempo:  min < 60 ? `Hace ${min} min` : min < 1440 ? `Hace ${Math.round(min / 60)}h` : 'Ayer',
        leida: false, ref: `cliente_${u.email}`
      });
    });
  } catch (_) {}

  // ── Tareas de mantenimiento urgentes o pendientes ────────────────────────
  try {
    const [rows] = await db.query(`
      SELECT m.descripcion, m.estado, m.responsable, c.nombre AS cancha
      FROM mantenimiento m
      LEFT JOIN canchas c ON m.cancha_id = c.id
      WHERE m.estado IN ('urgente', 'pendiente')
      ORDER BY m.estado = 'urgente' DESC, m.id DESC
      LIMIT 5
    `);
    rows.forEach(m => {
      const urgente = m.estado === 'urgente';
      notifs.push({
        tipo:  urgente ? 'danger' : 'warning',
        color: urgente ? 'red'    : 'orange',
        titulo:  `${urgente ? '🚨 Urgente' : '🔧 Pendiente'} — ${m.cancha || 'General'}`,
        mensaje: `${m.descripcion}${m.responsable ? ` · Resp: ${m.responsable}` : ''}`,
        tiempo: 'Hoy', leida: false, ref: `mant_${m.descripcion}`
      });
    });
  } catch (_) {}

  // ── Pagos pendientes de aprobación ──────────────────────────────────────
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.monto, p.metodo, p.fecha, u.nombre AS cliente
      FROM pagos p
      JOIN usuarios u ON p.cliente_id = u.id
      WHERE p.estado = 'pendiente'
      ORDER BY p.fecha DESC
      LIMIT 10
    `);
    rows.forEach(p => {
      const min = Math.round((Date.now() - new Date(p.fecha)) / 60000);
      notifs.push({
        tipo: 'warning', color: 'gold',
        titulo:  '💳 Pago pendiente de aprobación',
        mensaje: `${p.cliente} · $${Number(p.monto).toLocaleString('es-CO')} · ${p.metodo}`,
        tiempo:  min < 60 ? `Hace ${min} min` : `Hace ${Math.round(min / 60)}h`,
        leida: false, ref: `pago_${p.id}`
      });
    });
  } catch (_) {}

  // ── Pagos aprobados/rechazados (últimas 24 h) ────────────────────────────
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.monto, p.estado, p.fecha, u.nombre AS cliente
      FROM pagos p
      JOIN usuarios u ON p.cliente_id = u.id
      WHERE p.estado IN ('aprobado','rechazado')
        AND p.fecha >= NOW() - INTERVAL 24 HOUR
      ORDER BY p.fecha DESC
      LIMIT 10
    `);
    rows.forEach(p => {
      const min = Math.round((Date.now() - new Date(p.fecha)) / 60000);
      const aprobado = p.estado === 'aprobado';
      notifs.push({
        tipo:  aprobado ? 'success' : 'danger',
        color: aprobado ? 'green'   : 'red',
        titulo:  aprobado ? '✅ Pago aprobado' : '❌ Pago rechazado',
        mensaje: `${p.cliente} · $${Number(p.monto).toLocaleString('es-CO')}`,
        tiempo:  min < 60 ? `Hace ${min} min` : `Hace ${Math.round(min / 60)}h`,
        leida: true, ref: `pago_res_${p.id}`
      });
    });
  } catch (_) {}

  // ── Clientes bloqueados (últimas 48 h) ───────────────────────────────────
  try {
    const [rows] = await db.query(`
      SELECT nombre, email, creado_en
      FROM usuarios
      WHERE rol = 'cliente' AND activo = 0 AND eliminado = 0
        AND creado_en >= NOW() - INTERVAL 48 HOUR
      ORDER BY creado_en DESC
    `);
    rows.forEach(u => {
      notifs.push({
        tipo: 'warning', color: 'orange',
        titulo:  '🔒 Cliente bloqueado',
        mensaje: `${u.nombre} (${u.email})`,
        tiempo: 'Reciente', leida: false, ref: `bloqueado_${u.email}`
      });
    });
  } catch (_) {}

  // ── Clientes eliminados (últimas 48 h) ───────────────────────────────────
  try {
    const [rows] = await db.query(`
      SELECT nombre, email
      FROM usuarios
      WHERE rol = 'cliente' AND eliminado = 1
        AND creado_en >= NOW() - INTERVAL 48 HOUR
      ORDER BY creado_en DESC
    `);
    rows.forEach(u => {
      notifs.push({
        tipo: 'danger', color: 'red',
        titulo:  '🗑️ Cliente eliminado',
        mensaje: `${u.nombre} (${u.email})`,
        tiempo: 'Reciente', leida: false, ref: `eliminado_${u.email}`
      });
    });
  } catch (_) {}

  // ── Resumen del día ──────────────────────────────────────────────────────
  try {
    const [rows] = await db.query(`
      SELECT COUNT(*) AS total, COALESCE(SUM(total), 0) AS ingresos
      FROM reservas
      WHERE fecha = CURDATE() AND estado = 'confirmada'
    `);
    if (rows[0].total > 0) {
      notifs.push({
        tipo: 'success', color: 'green',
        titulo:  `📊 ${rows[0].total} reserva${rows[0].total > 1 ? 's' : ''} confirmada${rows[0].total > 1 ? 's' : ''} hoy`,
        mensaje: `Ingresos del día: $${Number(rows[0].ingresos).toLocaleString('es-CO')}`,
        tiempo: 'Hoy', leida: true, ref: 'resumen_hoy'
      });
    }
  } catch (_) {}

  res.json(notifs);
});

module.exports = router;
