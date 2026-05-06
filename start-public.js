/**
 * Inicia el servidor + túnel público (Cloudflare Tunnel)
 * Uso: node start-public.js
 *
 * Cloudflare crea una URL HTTPS temporal que cualquier celular
 * puede acceder sin estar en la misma red WiFi.
 */
require('dotenv').config();

const { spawn } = require('child_process');
const QRCode    = require('qrcode');
const PORT      = process.env.PORT || 3000;

// ── Iniciar servidor Express ──────────────────────────────────────────────
require('./server.js');

// ── Crear túnel después de que el servidor levante ────────────────────────
async function iniciarTunel() {
  await new Promise(r => setTimeout(r, 1500));

  console.log('🔌 Creando túnel público con Cloudflare...\n');

  let { bin } = require('cloudflared');

  const child = spawn(bin, ['tunnel', '--url', `http://localhost:${PORT}`], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let urlEncontrada = false;

  function procesarLinea(linea) {
    if (urlEncontrada) return;
    // Cloudflare imprime la URL en stderr con el patrón trycloudflare.com
    const match = linea.match(/https:\/\/[a-zA-Z0-9\-]+\.trycloudflare\.com/);
    if (!match) return;

    urlEncontrada = true;
    const tunnelUrl  = match[0];
    process.env.TUNNEL_URL = tunnelUrl;

    const installUrl = `${tunnelUrl}/install`;
    const portalUrl  = `${tunnelUrl}/cliente/portal.html`;

    QRCode.toString(portalUrl, { type: 'terminal', small: true })
      .then(qrTerminal => {
        console.log('━'.repeat(56));
        console.log('  🌐  URL PÚBLICA (Cloudflare)');
        console.log(`      ${tunnelUrl}`);
        console.log('');
        console.log('  📱  PÁGINA DE INSTALACIÓN');
        console.log(`      ${installUrl}`);
        console.log('');
        console.log('  ⚽  PORTAL CLIENTE DIRECTO');
        console.log(`      ${portalUrl}`);
        console.log('━'.repeat(56));
        console.log('\n  Escanea para ir directo al portal del cliente:\n');
        console.log(qrTerminal);
        console.log('  ⚠️  Mantén esta ventana abierta mientras uses el túnel');
        console.log('  ⚠️  La URL cambia cada vez que reinicias\n');
      });
  }

  child.stderr.on('data', data => {
    data.toString().split('\n').forEach(procesarLinea);
  });
  child.stdout.on('data', data => {
    data.toString().split('\n').forEach(procesarLinea);
  });

  child.on('error', err => {
    console.error('❌ Error iniciando cloudflared:', err.message);
    console.log('   Asegúrate de haber ejecutado: npm install');
  });

  child.on('close', code => {
    if (code !== 0 && code !== null) {
      console.log('\n⚠️  Túnel cerrado. Reinicia para obtener una nueva URL.');
    }
  });

  // Timeout si no aparece URL en 30 segundos
  setTimeout(() => {
    if (!urlEncontrada) {
      console.error('❌ No se recibió URL del túnel en 30 segundos.');
      console.log('   Verifica tu conexión a internet e intenta de nuevo.');
      child.kill();
    }
  }, 30000);
}

iniciarTunel();
