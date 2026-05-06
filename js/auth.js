const API = (window.location.port === '3000' || window.location.hostname === 'localhost')
  ? `${window.location.protocol}//${window.location.host}/api`
  : `${window.location.protocol}//${window.location.host}/api`;

// ── Tema claro / oscuro ──────────────────────────────────────────────────
function applyTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  _updateThemeBtn(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  _updateThemeBtn(next);
}

function _updateThemeBtn(theme) {
  document.querySelectorAll('.theme-btn, .theme-btn-login').forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.title       = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  });
}

async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok && data.success) {
    guardarSesion(data.user, data.token);
    return { success: true, user: data.user };
  }
  throw new Error(data.error || 'Credenciales incorrectas');
}

function guardarSesion(user, token) {
  localStorage.setItem('rol',      user.rol);
  localStorage.setItem('nombre',   user.nombre);
  localStorage.setItem('email',    user.email);
  localStorage.setItem('userId',   user.id);
  localStorage.setItem('puntos',   user.puntos   || 0);
  localStorage.setItem('nivel',    user.nivel    || 'Bronce');
  localStorage.setItem('telefono', user.telefono || '');
  if (token) localStorage.setItem('token', token);
}

function logout() {
  // Preservar preferencias de usuario antes de limpiar sesión
  const theme         = localStorage.getItem('theme');
  const notifsLeidas  = localStorage.getItem('notifsLeidas');
  localStorage.clear();
  if (theme)        localStorage.setItem('theme', theme);
  if (notifsLeidas) localStorage.setItem('notifsLeidas', notifsLeidas);
  const base = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/cliente/')
    ? '../index.html' : 'index.html';
  window.location.href = base;
}

function verificarSesion(rolRequerido) {
  const rol = localStorage.getItem('rol');
  if (!rol || rol !== rolRequerido) {
    const base = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/cliente/')
      ? '../index.html' : 'index.html';
    window.location.href = base;
  }
}

function getNombre() { return localStorage.getItem('nombre') || 'Usuario'; }
function getEmail()  { return localStorage.getItem('email')  || ''; }
function getRol()    { return localStorage.getItem('rol')    || ''; }
function getUserId() { return parseInt(localStorage.getItem('userId')) || 0; }
function getPuntos() { return parseInt(localStorage.getItem('puntos')) || 0; }
function getNivel()  { return localStorage.getItem('nivel')  || 'Bronce'; }

function initiales(nombre) {
  return nombre.split(' ').slice(0,2).map(p => p[0]).join('').toUpperCase();
}

function formatCOP(valor) {
  if (!valor && valor !== 0) return '$0';
  return '$' + Math.round(valor).toLocaleString('es-CO');
}

function formatFecha(fecha) {
  if (!fecha) return '—';
  // Normalizar: objeto Date, ISO string, o 'YYYY-MM-DD'
  const str = typeof fecha === 'string' ? fecha.slice(0, 10) : new Date(fecha).toISOString().slice(0, 10);
  const d = new Date(str + 'T00:00:00');
  if (isNaN(d.getTime())) return String(fecha).slice(0, 10);
  return d.toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' });
}

function formatHora(hora) {
  if (!hora) return '';
  return hora.substring(0, 5);
}

function fechaHoyInput() {
  return new Date().toISOString().split('T')[0];
}

function fechaHoyTexto() {
  return new Date().toLocaleDateString('es-CO', {
    weekday:'long', year:'numeric', month:'long', day:'numeric'
  });
}

async function apiFetch(endpoint, options = {}) {
  try {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API}${endpoint}`, { ...options, headers });
    if (res.status === 401) { logout(); return null; }
    return await res.json();
  } catch (e) {
    console.warn(`API no disponible (${endpoint}):`, e.message);
    return null;
  }
}

async function registerUser(nombre, email, password, telefono) {
  const res  = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, password, telefono })
  });
  let data;
  try { data = await res.json(); } catch { throw new Error('Error de conexión. Reinicia el servidor e intenta de nuevo.'); }
  if (!res.ok) throw new Error(data.error || 'Error al registrar');
  guardarSesion(data.user, data.token);
  return data;
}

async function recoverPassword(email) {
  const res  = await fetch(`${API}/auth/recuperar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al enviar código');
  return data;
}

async function resetPassword(email, token, nueva_password) {
  const res  = await fetch(`${API}/auth/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token, nueva_password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al restablecer contraseña');
  return data;
}

// ── Sidebar móvil ───────────────────────────────────────────────────────
function toggleSidebar() {
  const aside   = document.querySelector('aside');
  const overlay = document.getElementById('sidebarOverlay');
  const isOpen  = aside?.classList.toggle('open');
  overlay?.classList.toggle('show', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeSidebar() {
  document.querySelector('aside')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('show');
  document.body.style.overflow = '';
}

function showToast(msg, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.innerHTML = '<span class="toast-icon"></span><span class="toast-msg"></span>';
    document.body.appendChild(toast);
  }
  const icons = { success:'✅', error:'❌', info:'ℹ️' };
  toast.className = type;
  toast.querySelector('.toast-icon').textContent = icons[type] || '✅';
  toast.querySelector('.toast-msg').textContent  = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

function safeText(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
