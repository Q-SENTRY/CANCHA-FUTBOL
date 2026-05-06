require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const os        = require('os');
const QRCode    = require('qrcode');
const rateLimit = require('express-rate-limit');

function getLocalIP() {
  for (const ifaces of Object.values(os.networkInterfaces())) {
    for (const i of ifaces) {
      if (i.family === 'IPv4' && !i.internal) return i.address;
    }
  }
  return 'localhost';
}

const app  = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(cors({
  origin: (origin, cb) => {
    // Permitir localhost, red local (192.168.x.x / 10.x.x.x) y sin origen (apps móviles)
    if (!origin) return cb(null, true);
    const local = /^http:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+)(:\d+)?$/.test(origin);
    const env   = origin === (process.env.FRONTEND_URL || '');
    cb(null, local || env);
  },
  credentials: true
}));

// Limiter general para todas las rutas de auth (registro, recuperar, reset)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Demasiados intentos. Espera 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
});
// Limiter estricto solo para login — 5 intentos por IP cada 15 min
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos de acceso. Espera 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/auth', authLimiter);
app.use('/api/auth/login', loginLimiter);

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.use('/api/auth',          require('./routes/auth.routes'));
app.use('/api/reservas',      require('./routes/reservas.routes'));
app.use('/api/canchas',       require('./routes/canchas.routes'));
app.use('/api/clientes',      require('./routes/clientes.routes'));
app.use('/api/pagos',         require('./routes/pagos.routes'));
app.use('/api/inventario',    require('./routes/inventario.routes'));
app.use('/api/torneos',       require('./routes/torneos.routes'));
app.use('/api/mantenimiento', require('./routes/mantenimiento.routes'));
app.use('/api/notificaciones',require('./routes/notificaciones.routes'));
app.use('/api/auditoria',    require('./routes/auditoria.routes'));
app.use('/api/caja',         require('./routes/caja.routes'));
app.use('/api/config',       require('./routes/config.routes'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// ── Página de instalación PWA con QR ──────────────────────────────────────
app.get('/install', async (req, res) => {
  const ip      = getLocalIP();
  const baseUrl = process.env.TUNNEL_URL || `http://${ip}:${PORT}`;
  const url     = `${baseUrl}/cliente/portal.html`;
  const esTunel = !!process.env.TUNNEL_URL;
  const qr  = await QRCode.toDataURL(url, {
    width: 260, margin: 2,
    color: { dark: '#22c55e', light: '#111827' }
  });
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Instalar App — Canchas El Campeón</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#0f1117;color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
  .wrap{max-width:440px;width:100%}
  .logo{display:flex;align-items:center;gap:10px;justify-content:center;margin-bottom:28px}
  .logo-icon{width:44px;height:44px;background:#22c55e;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px}
  .logo-text strong{display:block;font-size:16px;font-weight:800}
  .logo-text span{font-size:12px;color:#64748b}
  .card{background:#1a1f2e;border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:28px;margin-bottom:16px}
  h2{font-size:18px;font-weight:700;margin-bottom:4px}
  .sub{font-size:13px;color:#64748b;margin-bottom:20px}
  .qr-wrap{background:#111827;border:2px solid #22c55e;border-radius:16px;padding:16px;display:inline-flex;align-items:center;justify-content:center;width:100%;margin-bottom:16px}
  .qr-wrap img{width:260px;height:260px;display:block;border-radius:8px}
  .url-box{background:#0f1117;border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px 14px;display:flex;align-items:center;gap:10px;margin-bottom:20px}
  .url-box code{font-size:13px;color:#22c55e;word-break:break-all;flex:1}
  .copy-btn{background:#22c55e;color:#000;border:none;border-radius:8px;padding:7px 12px;font-size:12px;font-weight:700;cursor:pointer;flex-shrink:0}
  .steps{display:flex;flex-direction:column;gap:12px}
  .step{display:flex;align-items:flex-start;gap:12px}
  .step-num{width:28px;height:28px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.3);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#22c55e;flex-shrink:0;margin-top:1px}
  .step-text strong{display:block;font-size:13px;font-weight:700;margin-bottom:2px}
  .step-text span{font-size:12px;color:#64748b;line-height:1.5}
  .divider{border:none;border-top:1px solid rgba(255,255,255,0.07);margin:16px 0}
  .ios-note{background:rgba(59,130,246,.07);border:1px solid rgba(59,130,246,.2);border-radius:12px;padding:14px}
  .ios-note .ttl{font-size:12px;font-weight:700;color:#60a5fa;margin-bottom:8px}
  .ios-note .ios-steps{font-size:12px;color:#94a3b8;line-height:2}
  .badge{display:inline-block;background:rgba(34,197,94,.1);color:#22c55e;border:1px solid rgba(34,197,94,.25);border-radius:20px;padding:3px 10px;font-size:11px;font-weight:700;margin-bottom:16px}
</style>
</head>
<body>
<div class="wrap">
  <div class="logo">
    <div class="logo-icon">⚽</div>
    <div class="logo-text">
      <strong>Canchas El Campeón</strong>
      <span>Portal de reservas</span>
    </div>
  </div>

  <div class="card">
    <div class="badge">${esTunel ? '🌐 Acceso público — cualquier red' : '📶 Solo red WiFi local'}</div>
    <h2>Escanea con tu cámara</h2>
    <p class="sub">${esTunel ? 'Funciona desde cualquier celular, en cualquier lugar' : 'Apunta la cámara del celular al código QR'}</p>
    <div class="qr-wrap">
      <img src="${qr}" alt="QR Code">
    </div>
    <p style="font-size:11px;color:#475569;text-align:center;margin-bottom:14px">O escribe la dirección manualmente:</p>
    <div class="url-box">
      <code id="urlText">${url}</code>
      <button class="copy-btn" onclick="copiar()">Copiar</button>
    </div>
  </div>

  <div class="card">
    <h2 style="margin-bottom:16px">Pasos para instalar</h2>
    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-text">
          <strong>Abre Chrome en tu celular</strong>
          <span>Asegúrate de estar conectado al mismo WiFi</span>
        </div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-text">
          <strong>Escanea el QR o escribe la URL</strong>
          <span>Usa la cámara o escribe la dirección en Chrome</span>
        </div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-text">
          <strong>Toca "Instalar" en el banner verde</strong>
          <span>Aparece automáticamente en la parte inferior de la pantalla</span>
        </div>
      </div>
      <div class="step">
        <div class="step-num">4</div>
        <div class="step-text">
          <strong>¡Listo! Busca el ícono en tu pantalla de inicio</strong>
          <span>La app se abre sin barra del navegador, igual que una app nativa</span>
        </div>
      </div>
    </div>

    <hr class="divider">

    <div class="ios-note">
      <div class="ttl">🍎 En iPhone (Safari)</div>
      <div class="ios-steps">
        1. Abre Safari (no Chrome)<br>
        2. Entra a la misma URL<br>
        3. Toca el botón compartir <strong style="color:#e2e8f0">⬆</strong><br>
        4. Selecciona <strong style="color:#e2e8f0">"Añadir a pantalla de inicio"</strong><br>
        5. Toca <strong style="color:#e2e8f0">"Agregar"</strong>
      </div>
    </div>
  </div>

  <p style="text-align:center;font-size:11px;color:#334155">
    Esta página solo es accesible desde la red local WiFi
  </p>
</div>
<script>
  function copiar() {
    navigator.clipboard.writeText(document.getElementById('urlText').textContent)
      .then(() => { const b = document.querySelector('.copy-btn'); b.textContent='✓ Copiado'; setTimeout(()=>b.textContent='Copiar',2000); });
  }
</script>
</body>
</html>`);
});

// Error handler global — siempre devuelve JSON
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Error interno del servidor' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log(`\n✅ Sistema de Canchas corriendo`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Red:     http://${ip}:${PORT}`);
  console.log(`   Instalar PWA: http://${ip}:${PORT}/install\n`);
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚠️  Puerto ${PORT} ocupado. Liberando...`);
    const { execSync } = require('child_process');
    try {
      // Windows
      const pid = execSync(`netstat -ano | findstr :${PORT} | findstr LISTENING`)
        .toString().trim().split(/\s+/).pop();
      if (pid) { execSync(`taskkill /PID ${pid} /F`); console.log(`   Proceso ${pid} cerrado.`); }
    } catch { /* ya fue liberado */ }
    setTimeout(() => server.listen(PORT, '0.0.0.0'), 1000);
  } else {
    throw err;
  }
});
