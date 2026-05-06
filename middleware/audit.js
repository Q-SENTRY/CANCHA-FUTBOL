const fs   = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../logs/audit.log');
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB — rotate when exceeded

function escribirAudit(entry) {
  try {
    const line = JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n';

    // Simple rotation: if file > 5 MB, rename to .old and start fresh
    if (fs.existsSync(LOG_FILE)) {
      const { size } = fs.statSync(LOG_FILE);
      if (size > MAX_BYTES) {
        fs.renameSync(LOG_FILE, LOG_FILE + '.old');
      }
    }

    fs.appendFileSync(LOG_FILE, line, 'utf8');
  } catch {
    // Audit failure must never crash the app
  }
}

/**
 * logAudit({ accion, usuario_id, usuario_email, rol, detalle, ip })
 * Llamar manualmente en los puntos clave de cada ruta.
 */
function logAudit(data) {
  escribirAudit(data);
}

/**
 * Express middleware: extrae datos de req para facilitar el log
 * Uso: router.post('/login', auditMiddleware('login'), handler)
 */
function auditMiddleware(accion) {
  return (req, res, next) => {
    const orig = res.json.bind(res);
    res.json = function (body) {
      const user = req.user || {};
      if (res.statusCode < 400) {
        logAudit({
          accion,
          usuario_id:    user.id    || req.body?.cliente_id || null,
          usuario_email: user.email || req.body?.email      || null,
          rol:           user.rol   || null,
          ip:            req.ip     || req.headers['x-forwarded-for'] || null,
          detalle:       body?.id ? `id=${body.id}` : null,
        });
      }
      return orig(body);
    };
    next();
  };
}

/**
 * Leer las últimas N entradas del log (para el endpoint admin)
 */
function leerUltimas(n = 200) {
  try {
    if (!fs.existsSync(LOG_FILE)) return [];
    const lines = fs.readFileSync(LOG_FILE, 'utf8')
      .split('\n')
      .filter(Boolean)
      .slice(-n)
      .reverse()
      .map(l => JSON.parse(l));
    return lines;
  } catch {
    return [];
  }
}

module.exports = { logAudit, auditMiddleware, leerUltimas };
