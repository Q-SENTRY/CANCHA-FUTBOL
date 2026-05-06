/**
 * Integration tests — end-to-end flow
 * Run: node tests/integration.js
 * Requirements: server must be running on http://localhost:3000
 */

const BASE = 'http://localhost:3000/api';

let passed = 0;
let failed = 0;

// ── helpers ────────────────────────────────────────────────────────────────

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  return { status: res.status, data };
}

function ok(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

function section(title) {
  console.log(`\n── ${title} ${'─'.repeat(50 - title.length)}`);
}

// ── test data ──────────────────────────────────────────────────────────────

const TEST_EMAIL    = `test_${Date.now()}@integration.co`;
const TEST_PASS     = 'testpass123';
const NEW_PASS      = 'newpass456';
let   TEST_USER_ID  = null;
let   RECOVERY_TOKEN = null;

// ══════════════════════════════════════════════════════════════════════════
// 1. REGISTRO
// ══════════════════════════════════════════════════════════════════════════
async function testRegistro() {
  section('1. REGISTRO DE USUARIO');

  // 1a. registro exitoso
  let r = await req('POST', '/auth/register', {
    nombre: 'Usuario Test', email: TEST_EMAIL, password: TEST_PASS, telefono: '3001112233'
  });
  ok('Registro exitoso (201)',            r.status === 201);
  ok('Responde success:true',             r.data.success === true);
  ok('Rol asignado es cliente',           r.data.user?.rol === 'cliente');
  ok('Puntos iniciales en 0',             r.data.user?.puntos === 0);
  ok('Nivel inicial Bronce',              r.data.user?.nivel === 'Bronce');
  TEST_USER_ID = r.data.user?.id;

  // 1b. email duplicado
  r = await req('POST', '/auth/register', {
    nombre: 'Duplicado', email: TEST_EMAIL, password: TEST_PASS
  });
  ok('Rechaza email duplicado (409)',      r.status === 409);

  // 1c. contraseña muy corta
  r = await req('POST', '/auth/register', {
    nombre: 'Corto', email: `corto_${Date.now()}@test.co`, password: '123'
  });
  ok('Rechaza contraseña < 6 chars (400)', r.status === 400);

  // 1d. campos requeridos faltantes
  r = await req('POST', '/auth/register', { email: 'sin@nombre.co' });
  ok('Rechaza registro sin nombre (400)',  r.status === 400);
}

// ══════════════════════════════════════════════════════════════════════════
// 2. LOGIN
// ══════════════════════════════════════════════════════════════════════════
async function testLogin() {
  section('2. LOGIN');

  // 2a. login exitoso con usuario recién registrado
  let r = await req('POST', '/auth/login', { email: TEST_EMAIL, password: TEST_PASS });
  ok('Login exitoso (200)',               r.status === 200);
  ok('Devuelve datos de usuario',         r.data.user?.email === TEST_EMAIL);
  ok('Rol es cliente',                    r.data.user?.rol   === 'cliente');
  ok('No expone password',               !r.data.user?.password);

  // 2b. login con admin
  r = await req('POST', '/auth/login', { email: 'admin@canchas.co', password: 'admin123' });
  ok('Login admin exitoso',               r.status === 200);
  ok('Rol es admin',                      r.data.user?.rol === 'admin');

  // 2c. credenciales incorrectas
  r = await req('POST', '/auth/login', { email: TEST_EMAIL, password: 'wrongpass' });
  ok('Rechaza contraseña incorrecta (401)', r.status === 401);

  // 2d. usuario inexistente
  r = await req('POST', '/auth/login', { email: 'noexiste@test.co', password: 'algo' });
  ok('Rechaza usuario inexistente (401)',  r.status === 401);
}

// ══════════════════════════════════════════════════════════════════════════
// 3. RECUPERACIÓN DE CONTRASEÑA
// ══════════════════════════════════════════════════════════════════════════
async function testRecuperacion() {
  section('3. RECUPERACIÓN DE CONTRASEÑA');

  // 3a. solicitar token
  let r = await req('POST', '/auth/recuperar', { email: TEST_EMAIL });
  ok('Genera token (200)',                r.status === 200);
  ok('Devuelve token_demo',              !!r.data.token_demo);
  ok('Token tiene 6 dígitos',            /^\d{6}$/.test(r.data.token_demo));
  RECOVERY_TOKEN = r.data.token_demo;

  // 3b. email inexistente
  r = await req('POST', '/auth/recuperar', { email: 'noexiste@x.co' });
  ok('Rechaza email sin cuenta (404)',    r.status === 404);

  // 3c. token inválido
  r = await req('POST', '/auth/reset', {
    email: TEST_EMAIL, token: '000000', nueva_password: NEW_PASS
  });
  ok('Rechaza token inválido (400)',      r.status === 400);

  // 3d. contraseña corta en reset
  r = await req('POST', '/auth/reset', {
    email: TEST_EMAIL, token: RECOVERY_TOKEN, nueva_password: '123'
  });
  ok('Rechaza nueva contraseña < 6 (400)', r.status === 400);

  // 3e. reset exitoso
  r = await req('POST', '/auth/reset', {
    email: TEST_EMAIL, token: RECOVERY_TOKEN, nueva_password: NEW_PASS
  });
  ok('Reset exitoso (200)',              r.status === 200);
  ok('Responde success:true',            r.data.success === true);

  // 3f. login con nueva contraseña
  r = await req('POST', '/auth/login', { email: TEST_EMAIL, password: NEW_PASS });
  ok('Login con nueva contraseña (200)', r.status === 200);

  // 3g. login con contraseña vieja rechazado
  r = await req('POST', '/auth/login', { email: TEST_EMAIL, password: TEST_PASS });
  ok('Contraseña vieja ya no funciona (401)', r.status === 401);

  // 3h. token no puede reutilizarse
  r = await req('POST', '/auth/reset', {
    email: TEST_EMAIL, token: RECOVERY_TOKEN, nueva_password: 'otromas'
  });
  ok('Token reutilizado rechazado (400)', r.status === 400);
}

// ══════════════════════════════════════════════════════════════════════════
// 4. GESTIÓN DE CLIENTES (admin)
// ══════════════════════════════════════════════════════════════════════════
async function testClientes() {
  section('4. GESTIÓN DE CLIENTES');

  // 4a. listar clientes
  let r = await req('GET', '/clientes');
  ok('Lista clientes (200)',              r.status === 200);
  ok('Responde un array',                Array.isArray(r.data));
  const clienteTest = r.data.find(c => c.id === TEST_USER_ID);
  ok('Usuario registrado aparece en lista', !!clienteTest);

  // 4b. obtener cliente por ID
  r = await req('GET', `/clientes/${TEST_USER_ID}`);
  ok('Obtiene cliente por ID (200)',      r.status === 200);
  ok('Email coincide',                   r.data.email === TEST_EMAIL);

  // 4c. bloquear cliente
  r = await req('PATCH', `/clientes/${TEST_USER_ID}/estado`, { activo: 0 });
  ok('Bloquea cliente (200)',             r.status === 200);
  ok('activo queda en 0',                r.data.activo === 0);

  // 4d. login con cuenta bloqueada
  r = await req('POST', '/auth/login', { email: TEST_EMAIL, password: NEW_PASS });
  ok('Cuenta bloqueada no puede loguearse (401)', r.status === 401);
  ok('Mensaje indica cuenta bloqueada',  r.data.error?.includes('bloqueada') || r.data.error?.includes('Bloqueada'));

  // 4e. desbloquear cliente
  r = await req('PATCH', `/clientes/${TEST_USER_ID}/estado`, { activo: 1 });
  ok('Desbloquea cliente (200)',          r.status === 200);
  ok('activo queda en 1',                r.data.activo === 1);

  // 4f. login restaurado
  r = await req('POST', '/auth/login', { email: TEST_EMAIL, password: NEW_PASS });
  ok('Login restaurado tras desbloqueo (200)', r.status === 200);

  // 4g. no se puede bloquear admin
  const adminId = 1;
  r = await req('PATCH', `/clientes/${adminId}/estado`, { activo: 0 });
  ok('No permite bloquear admin (403)',   r.status === 403);

  // 4h. eliminar cliente (soft-delete)
  r = await req('DELETE', `/clientes/${TEST_USER_ID}`);
  ok('Elimina cliente (200)',             r.status === 200);
  ok('Responde success:true',            r.data.success === true);

  // 4i. cliente eliminado no aparece en lista
  r = await req('GET', '/clientes');
  const eliminado = r.data.find(c => c.id === TEST_USER_ID);
  ok('Cliente eliminado no aparece en lista', !eliminado);

  // 4j. cliente eliminado no puede loguearse
  r = await req('POST', '/auth/login', { email: TEST_EMAIL, password: NEW_PASS });
  ok('Cuenta eliminada no puede loguearse (401)', r.status === 401);

  // 4k. no se puede eliminar admin
  r = await req('DELETE', `/clientes/${adminId}`);
  ok('No permite eliminar admin (403)',   r.status === 403);
}

// ══════════════════════════════════════════════════════════════════════════
// 5. RESERVAS
// ══════════════════════════════════════════════════════════════════════════
async function testReservas() {
  section('5. RESERVAS');

  // Usar cliente existente de seed
  let r = await req('GET', '/canchas');
  ok('Lista canchas (200)',               r.status === 200);
  ok('Hay al menos una cancha',          Array.isArray(r.data) && r.data.length > 0);

  r = await req('GET', '/reservas/hoy');
  ok('Lista reservas de hoy (200)',       r.status === 200 || r.status === 404);
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════
async function main() {
  console.log('═'.repeat(60));
  console.log('  PRUEBAS DE INTEGRACIÓN — Sistema de Canchas de Fútbol');
  console.log(`  ${new Date().toLocaleString('es-CO')}`);
  console.log('═'.repeat(60));

  // Verificar que el servidor está activo
  try {
    await fetch(`${BASE}/canchas`);
  } catch {
    console.error('\n❌ No se puede conectar al servidor en ' + BASE);
    console.error('   Inicia el servidor con: node server.js\n');
    process.exit(1);
  }

  await testRegistro();
  await testLogin();
  await testRecuperacion();
  await testClientes();
  await testReservas();

  console.log('\n' + '═'.repeat(60));
  console.log(`  RESULTADO: ${passed} pasaron  /  ${failed} fallaron`);
  console.log('═'.repeat(60) + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
