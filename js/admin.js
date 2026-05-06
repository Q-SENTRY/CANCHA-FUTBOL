// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DATOS DE RESPALDO (sin backend)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CANCHAS_DATA = [
  { id:1, nombre:'Cancha 1', tipo:'Fútbol 11', superficie:'Natural',   dimensiones:'100×65m', precio_hora:160000, estado:'ocupada' },
  { id:2, nombre:'Cancha 2', tipo:'Fútbol 5',  superficie:'Sintética', dimensiones:'30×20m',  precio_hora:90000,  estado:'disponible' },
  { id:3, nombre:'Cancha 3', tipo:'Fútbol 5',  superficie:'Sintética', dimensiones:'30×20m',  precio_hora:90000,  estado:'ocupada' },
  { id:4, nombre:'Cancha 4', tipo:'Fútbol 7',  superficie:'Sintética', dimensiones:'50×32m',  precio_hora:110000, estado:'disponible' },
  { id:5, nombre:'Cancha 5', tipo:'Fútbol 7',  superficie:'Sintética', dimensiones:'50×32m',  precio_hora:110000, estado:'mantenimiento' },
];

const RESERVAS_DATA = [
  { id:1, cliente_nombre:'Carlos Mendoza', cancha_nombre:'Cancha 3', cancha_tipo:'Fútbol 5', fecha:fechaHoyInput(), hora_inicio:'08:00:00', duracion_horas:1, total:90000,  estado:'confirmada', metodo_pago:'nequi' },
  { id:2, cliente_nombre:'Laura Gómez',    cancha_nombre:'Cancha 1', cancha_tipo:'Fútbol 11',fecha:fechaHoyInput(), hora_inicio:'10:00:00', duracion_horas:2, total:320000, estado:'pendiente',  metodo_pago:'daviplata' },
  { id:3, cliente_nombre:'Juan Pérez',     cancha_nombre:'Cancha 5', cancha_tipo:'Fútbol 7', fecha:fechaHoyInput(), hora_inicio:'14:00:00', duracion_horas:1, total:110000, estado:'confirmada', metodo_pago:'efectivo' },
  { id:4, cliente_nombre:'Andrés Torres',  cancha_nombre:'Cancha 2', cancha_tipo:'Fútbol 5', fecha:fechaHoyInput(), hora_inicio:'16:00:00', duracion_horas:1, total:90000,  estado:'cancelada',  metodo_pago:'efectivo' },
  { id:5, cliente_nombre:'Sofía Ruiz',     cancha_nombre:'Cancha 4', cancha_tipo:'Fútbol 7', fecha:fechaHoyInput(), hora_inicio:'18:00:00', duracion_horas:1, total:110000, estado:'confirmada', metodo_pago:'tarjeta' },
];

const CLIENTES_DATA = [
  { id:2, nombre:'Carlos Mendoza', telefono:'311 234 5678', total_reservas:48, total_gastado:3840000, puntos:920, nivel:'Diamante' },
  { id:3, nombre:'Sofía Ruiz',     telefono:'300 987 6543', total_reservas:41, total_gastado:3280000, puntos:810, nivel:'Diamante' },
  { id:4, nombre:'Juan Pérez',     telefono:'315 456 7890', total_reservas:37, total_gastado:2960000, puntos:740, nivel:'Oro' },
  { id:6, nombre:'Andrés Torres',  telefono:'320 111 2233', total_reservas:31, total_gastado:2480000, puntos:620, nivel:'Oro' },
  { id:5, nombre:'Laura Gómez',    telefono:'314 555 8899', total_reservas:28, total_gastado:2240000, puntos:560, nivel:'Oro' },
];

const INVENTARIO_DATA = [
  { id:1, nombre:'Balones Fútbol 11', categoria:'Equipamiento',    cantidad:18, cantidad_minima:10 },
  { id:2, nombre:'Balones Fútbol 5',  categoria:'Equipamiento',    cantidad:12, cantidad_minima:8 },
  { id:3, nombre:'Chalecos Peto',     categoria:'Equipamiento',    cantidad:6,  cantidad_minima:20 },
  { id:4, nombre:'Conos Demarcación', categoria:'Equipamiento',    cantidad:84, cantidad_minima:30 },
  { id:5, nombre:'Redes de Arco',     categoria:'Infraestructura', cantidad:8,  cantidad_minima:4 },
  { id:6, nombre:'Botiquín Aux.',     categoria:'Seguridad',       cantidad:2,  cantidad_minima:4 },
  { id:7, nombre:'Guantes Portero',   categoria:'Equipamiento',    cantidad:10, cantidad_minima:6 },
  { id:8, nombre:'Pintura Líneas',    categoria:'Mantenimiento',   cantidad:3,  cantidad_minima:6 },
  { id:9, nombre:'Tableros Tácticos', categoria:'Equipamiento',    cantidad:5,  cantidad_minima:2 },
];

const CHECKLIST_DATA = [
  { desc:'Regar y revisar césped natural',   resp:'Miguel R.',   estado:'done',    cancha:'Cancha 1', hora:'06:30' },
  { desc:'Limpiar arcos y redes',            resp:'Miguel R.',   estado:'done',    cancha:'Todas',    hora:'07:00' },
  { desc:'Revisar iluminación nocturna',     resp:'Miguel R.',   estado:'done',    cancha:'C2–C5',    hora:'07:15' },
  { desc:'Pintar líneas del campo',          resp:'Carlos P.',   estado:'pending', cancha:'Cancha 5', hora:'14:00' },
  { desc:'Revisar sistema de drenaje',       resp:'Carlos P.',   estado:'pending', cancha:'Cancha 1', hora:'15:00' },
  { desc:'Limpiar vestuarios y baños',       resp:'Sin asignar', estado:'open',    cancha:'General',  hora:'—' },
  { desc:'Revisar grama sintética costuras', resp:'Urgente',     estado:'urgent',  cancha:'Cancha 3', hora:'—' },
  { desc:'Calibrar marcador electrónico',    resp:'Carlos P.',   estado:'open',    cancha:'Cancha 1', hora:'17:00' },
];

const PAGOS_DATA = [
  { id:4821, cliente_nombre:'Carlos M.',  concepto:'Reserva C3 1h',    metodo:'nequi',     monto:80000,  estado:'aprobado' },
  { id:4820, cliente_nombre:'Los Lobos',  concepto:'Torneo cuota',      metodo:'pse',       monto:250000, estado:'aprobado' },
  { id:4819, cliente_nombre:'Sofía R.',   concepto:'Membresía mes',     metodo:'tarjeta',   monto:180000, estado:'aprobado' },
  { id:4818, cliente_nombre:'Juan P.',    concepto:'Reserva C5 1h',     metodo:'efectivo',  monto:95000,  estado:'aprobado' },
  { id:4817, cliente_nombre:'Laura G.',   concepto:'Reserva C1 2h',     metodo:'daviplata', monto:220000, estado:'pendiente' },
];

const MOVIMIENTOS_CAJA = [
  { hora:'07:00', concepto:'Apertura de caja',       tipo:'apertura', monto:200000 },
  { hora:'08:05', concepto:'Reserva C3 – Carlos M.', tipo:'ingreso',  monto:80000 },
  { hora:'09:30', concepto:'Pago torneo – Los Lobos',tipo:'ingreso',  monto:250000 },
  { hora:'10:15', concepto:'Compra balones (2 uds)',  tipo:'egreso',   monto:-80000 },
  { hora:'11:00', concepto:'Reserva C1 – Laura G.',  tipo:'ingreso',  monto:220000 },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INIT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let canchasActuales  = [];
let reservasActuales = [];
let todasReservas    = [];
let clientesActuales = [];
let inventarioActual = [];

document.addEventListener('DOMContentLoaded', async () => {
  verificarSesion('admin');

  // Poblar header
  const nombre = getNombre();
  document.getElementById('headerNombre').textContent = nombre;
  document.getElementById('headerAvatar').textContent = initiales(nombre);
  document.getElementById('heroNombre').textContent = nombre;
  document.getElementById('heroBadge').textContent = fechaHoyTexto().charAt(0).toUpperCase() + fechaHoyTexto().slice(1);
  document.getElementById('cfgNombre').textContent = nombre;
  document.getElementById('cfgAvatar').textContent = initiales(nombre);
  document.getElementById('cfgEmail').value = getEmail();
  const cfgNombreInput = document.getElementById('cfgNombreInput');
  if (cfgNombreInput) cfgNombreInput.value = nombre;
  document.getElementById('cajaSub').textContent = fechaHoyTexto();
  document.getElementById('maintFecha').textContent = fechaHoyTexto();

  // Cargar datos
  await cargarTodo();

  // Renderizar secciones iniciales
  renderInicio();
  renderChecklist();
  renderCharts();
  renderTimeline();
  renderCaja();

  // Notificaciones en tiempo real (polling cada 60s)
  iniciarPollingNotificaciones();
});

async function cargarTodo() {
  const [canchas, reservas, todas, clientes, inventario, torneos, mant] = await Promise.all([
    apiFetch('/canchas'),
    apiFetch('/reservas/hoy'),
    apiFetch('/reservas'),
    apiFetch('/clientes'),
    apiFetch('/inventario'),
    apiFetch('/torneos'),
    apiFetch('/mantenimiento'),
  ]);
  if (Array.isArray(canchas))    canchasActuales  = canchas;
  if (Array.isArray(reservas))   reservasActuales = reservas;
  if (Array.isArray(todas))      todasReservas    = todas;
  if (Array.isArray(clientes))   clientesActuales = clientes;
  if (Array.isArray(inventario)) inventarioActual = inventario;
  if (torneos)    torneosActuales  = torneos;
  if (mant) {
    CHECKLIST_DATA.length = 0;
    const estadoMap = { urgente:'urgent', completado:'done', en_proceso:'pending' };
    mant.forEach(t => {
      const canchaNombre = t.cancha_id
        ? (canchasActuales.find(c => c.id === t.cancha_id)?.nombre || `Cancha ${t.cancha_id}`)
        : 'General';
      const hora = t.programado_para
        ? new Date(t.programado_para).toISOString().slice(11, 16)
        : '—';
      CHECKLIST_DATA.push({
        id:     t.id,
        desc:   t.descripcion,
        resp:   t.responsable || 'Sin asignar',
        estado: estadoMap[t.estado] || 'open',
        cancha: canchaNombre,
        hora,
      });
    });
  }

  // Badges sidebar
  document.getElementById('badgeReservas').textContent = reservasActuales.length;
  document.getElementById('badgeClientes').textContent = clientesActuales.length;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NAVEGACIÓN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function goTo(id) {
  closeSidebar();
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const sec = document.getElementById('sec-' + id);
  if (sec) sec.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.getAttribute('onclick') && n.getAttribute('onclick').includes("'" + id + "'"))
      n.classList.add('active');
  });

  // Render dinámico por sección
  if (id === 'inicio')         renderInicio();
  if (id === 'canchas')        renderCanchas();
  if (id === 'clientes')       renderClientes();
  if (id === 'inventario')     renderInventario();
  if (id === 'pagos')          renderPagos();
  if (id === 'finanzas')       renderCharts();
  if (id === 'notificaciones') cargarNotificaciones();
  if (id === 'torneos')        renderTorneos();
  if (id === 'mantenimiento')   renderChecklist();
  if (id === 'caja')            renderCaja();
  if (id === 'configuracion')   cargarConfigNegocio();

  // Reservas: polling en tiempo real
  if (id === 'reservas') {
    _iniciarPollingReservas();
  } else {
    _detenerPollingReservas();
  }

  // Reportes: polling en tiempo real
  if (id === 'reportes') {
    _iniciarPollingReportes();
  } else {
    _detenerPollingReportes();
  }

  // Caja: polling en tiempo real
  if (id === 'caja') {
    _iniciarPollingCaja();
  } else {
    _detenerPollingCaja();
  }

  // Canchas: polling en tiempo real (auto-sync de estados)
  if (id === 'canchas') {
    _iniciarPollingCanchas();
  } else {
    _detenerPollingCanchas();
  }

  // Clientes: polling para ver nuevos registros al instante
  if (id === 'clientes') {
    _iniciarPollingClientes();
  } else {
    _detenerPollingClientes();
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INICIO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderInicio() {
  const conf = reservasActuales.filter(r => r.estado === 'confirmada').length;
  const pend = reservasActuales.filter(r => r.estado === 'pendiente').length;
  const canc = reservasActuales.filter(r => r.estado === 'cancelada').length;
  const total = reservasActuales.length;
  const ingresos = reservasActuales.filter(r => r.estado !== 'cancelada').reduce((s,r) => s + r.total, 0);
  const mant = canchasActuales.filter(c => c.estado === 'mantenimiento').length;

  set('statReservas', total);
  set('heroReservas', total);
  set('heroIngresos', formatCOP(ingresos).replace('.000','K'));
  const noDisp = canchasActuales.filter(c => c.estado !== 'disponible').length;
  set('heroOcupacion', Math.round((noDisp / Math.max(canchasActuales.length, 1)) * 100) + '%');
  set('statIngresos', formatCOP(ingresos));
  set('statIngresosSub', conf + ' confirmadas');
  set('statReservasSub', pend + ' pendientes de confirmar');
  set('statClientes', clientesActuales.length);
  set('statMant', mant);
  set('statMantSub', mant === 0 ? 'todas disponibles' : 'cancha(s) en mantenimiento');

  // Caja
  set('cajaIngresos', formatCOP(ingresos));
  set('cajaTotal', formatCOP(ingresos));

  // Tabla inicio
  const html = buildTablaReservas(reservasActuales.slice(0, 5));
  document.getElementById('tablaReservasHome').innerHTML = html;

  // Estado canchas inicio
  const listHtml = canchasActuales.map(c => {
    const col = { disponible:'var(--green-bright)', ocupada:'var(--red)', mantenimiento:'var(--orange)' }[c.estado];
    const lbl = { disponible:'Disponible', ocupada:'Ocupada', mantenimiento:'Mantenimiento' }[c.estado];
    return `<div style="display:flex;align-items:center;gap:12px;padding:12px 20px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .15s" onmouseover="this.style.background='var(--surface-hover)'" onmouseout="this.style.background=''">
      <div style="width:36px;height:36px;border-radius:9px;background:linear-gradient(135deg,var(--green-deep),var(--green-mid));display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue';font-size:14px;color:var(--green-neon)">C${c.id}</div>
      <div style="flex:1"><strong style="font-size:13px;font-weight:600">${safeText(c.nombre)} — ${safeText(c.tipo)}</strong><br><span style="font-size:11px;color:var(--text-muted)">${safeText(c.superficie)} · ${safeText(c.dimensiones)}</span></div>
      <div style="width:9px;height:9px;border-radius:50%;background:${col};box-shadow:0 0 8px ${col}66"></div>
    </div>`;
  }).join('');
  document.getElementById('estadoCanchasHome').innerHTML = listHtml;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CANCHAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderCanchas() {
  const grid = document.getElementById('canchasGrid');
  if (!grid) return;

  const statusMap = {
    disponible:   { cls:'free',  lbl:'Disponible',   top:'green'  },
    ocupada:      { cls:'busy',  lbl:'Ocupada',       top:'red'    },
    mantenimiento:{ cls:'maint', lbl:'Mantenimiento', top:'yellow' },
  };

  const ahora   = new Date();
  const nowMins = ahora.getHours() * 60 + ahora.getMinutes();

  const toMins = hora => {
    const [h, m] = (hora || '00:00').split(':').map(Number);
    return h * 60 + m;
  };
  const toHHMM = mins =>
    `${String(Math.floor(mins / 60)).padStart(2,'0')}:${String(mins % 60).padStart(2,'0')}`;

  grid.innerHTML = canchasActuales.map(c => {
    const s = statusMap[c.estado] || statusMap['disponible'];

    // Reservas de hoy no canceladas para esta cancha, ordenadas por hora
    const resHoy = reservasActuales
      .filter(r => r.cancha_id === c.id && r.estado !== 'cancelada')
      .map(r => {
        const inicioMin = toMins(r.hora_inicio);
        const finMin    = inicioMin + (r.duracion_horas || 1) * 60;
        return { ...r, inicioMin, finMin };
      })
      .sort((a, b) => a.inicioMin - b.inicioMin);

    const activa   = resHoy.find(r => r.inicioMin <= nowMins && nowMins < r.finMin);
    const proximas = resHoy.filter(r => r.inicioMin > nowMins);

    // ── Bloque reserva activa ────────────────────────────────────────────────
    let bloqueActiva = '';
    if (activa) {
      const minRest = activa.finMin - nowMins;
      const resto   = minRest >= 60
        ? `${Math.floor(minRest / 60)}h ${minRest % 60}m restantes`
        : `${minRest} min restantes`;
      bloqueActiva = `
        <div style="background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.25);border-radius:8px;padding:8px 10px">
          <div style="display:flex;align-items:center;gap:7px;font-size:12px;margin-bottom:2px">
            <div style="width:7px;height:7px;border-radius:50%;background:var(--red);flex-shrink:0;animation:pulse 1.5s infinite"></div>
            <strong>${safeText(activa.cliente_nombre || 'Cliente')}</strong>
            <span style="color:var(--text-muted);margin-left:auto">hasta ${toHHMM(activa.finMin)}</span>
          </div>
          <div style="font-size:11px;color:var(--text-muted);padding-left:14px">⏱ ${resto}</div>
        </div>`;
    }

    // ── Bloque próximas reservas ─────────────────────────────────────────────
    let bloqueProximas = '';
    if (proximas.length) {
      const filas = proximas.slice(0, 3).map(r => `
        <div style="display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid var(--border);font-size:11px">
          <span style="font-family:'Bebas Neue';font-size:13px;color:var(--green-bright);flex-shrink:0">${toHHMM(r.inicioMin)}</span>
          <span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${safeText(r.cliente_nombre || '—')}</span>
          <span style="color:var(--text-muted);flex-shrink:0">${r.duracion_horas}h</span>
          <span class="pill ${r.estado === 'confirmada' ? 'confirmed' : 'pending'}" style="font-size:9px;padding:1px 6px;flex-shrink:0">${r.estado === 'confirmada' ? 'Conf.' : 'Pend.'}</span>
        </div>`).join('');
      bloqueProximas = `
        <div style="font-size:10px;font-weight:700;color:var(--text-muted);letter-spacing:.5px;margin-bottom:2px">PRÓXIMAS HOY</div>
        ${filas}`;
    } else if (!activa) {
      bloqueProximas = `<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:4px 0">Sin reservas hoy</div>`;
    }

    return `<div class="court-card">
      <div class="court-top ${s.top}"><div class="court-field"></div></div>
      <div class="court-body">
        <strong>${safeText(c.nombre)} — ${safeText(c.tipo)}</strong>
        <span>${safeText(c.superficie)} · ${safeText(c.dimensiones)}</span>
      </div>
      <div class="court-footer">
        <span class="court-status ${s.cls}">${s.lbl}</span>
        <span class="court-price">${formatCOP(c.precio_hora)}/h</span>
      </div>
      <div style="padding:10px 14px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:6px">
        ${bloqueActiva}
        ${bloqueProximas}
      </div>
      <div style="padding:10px 14px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:8px">
        <select class="input-field" style="font-size:11px;padding:5px 8px;height:auto" onchange="cambiarEstadoCancha(${c.id},this.value)">
          <option value="disponible"${c.estado==='disponible'?' selected':''}>● Disponible</option>
          <option value="ocupada"${c.estado==='ocupada'?' selected':''}>● Ocupada</option>
          <option value="mantenimiento"${c.estado==='mantenimiento'?' selected':''}>● Mantenimiento</option>
        </select>
        <div style="display:flex;gap:6px">
          <button class="btn btn-secondary btn-sm" style="flex:1;justify-content:center" onclick="abrirModalCancha(${c.id})">✏️ Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarCancha(${c.id})">🗑️</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderTimeline() {
  const el = document.getElementById('timelineChart');
  if (!el) return;

  const horaNums = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];
  const total    = canchasActuales.length || 5;

  // Contar cuántas reservas activas cubren cada hora del día
  const activas = reservasActuales.filter(r => r.estado !== 'cancelada');
  const occ = horaNums.map(h => {
    return activas.filter(r => {
      const hI = parseInt((r.hora_inicio || '00:00').split(':')[0]);
      return h >= hI && h < hI + (r.duracion_horas || 1);
    }).length;
  });

  const maxOcc = Math.max(...occ, 1);
  const nowH   = new Date().getHours();

  el.innerHTML = horaNums.map((h, i) => {
    const cnt = occ[i];
    const pct = Math.round((cnt / total) * 100);
    const col = pct > 80 ? 'var(--red)' : pct > 50 ? 'var(--gold)' : 'var(--green-bright)';
    const isNow = h === nowH;
    return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
      <div style="font-size:10px;color:${cnt > 0 ? col : 'var(--text-muted)'};font-weight:700">${cnt}/${total}</div>
      <div style="flex:1;width:100%;background:rgba(255,255,255,.05);border-radius:5px;display:flex;align-items:flex-end;min-height:80px;${isNow ? 'box-shadow:0 0 0 1px var(--green-neon)' : ''}">
        <div style="width:100%;height:${cnt > 0 ? Math.max(pct, 6) : 0}%;background:${col};border-radius:5px;opacity:.85;transition:height .4s ease"></div>
      </div>
      <div style="font-size:10px;color:${isNow ? 'var(--green-bright)' : 'var(--text-muted)'};font-weight:${isNow ? '700' : '400'}">${String(h).padStart(2,'0')}h</div>
    </div>`;
  }).join('');
}

// Tabla compacta usada en la sección Inicio
function buildTablaReservas(list) {
  if (!list.length) return '<div style="padding:20px;text-align:center;color:var(--text-muted)">Sin reservas</div>';
  const rows = list.map(r => `<tr>
    <td><b>${safeText(r.cliente_nombre||'—')}</b></td>
    <td>${safeText(r.cancha_nombre||'—')}</td>
    <td>${formatHora(r.hora_inicio)} · ${r.duracion_horas}h</td>
    <td style="color:var(--gold)">${formatCOP(r.total)}</td>
    <td><span class="pill ${r.estado==='confirmada'?'confirmed':r.estado==='pendiente'?'pending':'cancelled'}">${estadoLabel(r.estado)}</span></td>
  </tr>`).join('');
  return `<table><thead><tr><th>Cliente</th><th>Cancha</th><th>Horario</th><th>Total</th><th>Estado</th></tr></thead><tbody>${rows}</tbody></table>`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RESERVAS — tiempo real
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _resTimer = null;
let _tabReservas = 'hoy';

function _iniciarPollingReservas() {
  _detenerPollingReservas();
  poblarSelectClientes();
  poblarSelectCanchas();
  document.getElementById('nrFecha').value = fechaHoyInput();
  cargarTodo().then(() => { renderReservas(_tabReservas); renderTimeline(); });
  _resTimer = setInterval(async () => {
    await cargarTodo();
    renderReservas(_tabReservas);
    renderTimeline();
  }, 15000);
}

function _detenerPollingReservas() {
  if (_resTimer) { clearInterval(_resTimer); _resTimer = null; }
}

function setTabReservas(tab, el) {
  _tabReservas = tab;
  document.querySelectorAll('.res-tab').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  renderReservas(tab);
}

function _listaParaTab(tab) {
  const hoy = fechaHoyInput();
  switch (tab) {
    case 'hoy':        return reservasActuales;
    case 'pendientes': return todasReservas.filter(r => r.estado === 'pendiente');
    case 'proximas':   return todasReservas.filter(r => r.fecha > hoy && r.estado !== 'cancelada');
    default:           return todasReservas;
  }
}

function renderReservas(tab) {
  tab = tab || _tabReservas;

  // KPIs
  const conf = reservasActuales.filter(r => r.estado === 'confirmada').length;
  const pend = reservasActuales.filter(r => r.estado === 'pendiente').length;
  const canc = reservasActuales.filter(r => r.estado === 'cancelada').length;
  const ingresos = reservasActuales.filter(r => r.estado !== 'cancelada').reduce((s,r) => s + (r.total||0), 0);
  set('resKpiConf',     conf);
  set('resKpiPend',     pend);
  set('resKpiCanc',     canc);
  set('resKpiIngresos', formatCOP(ingresos));

  // También actualizar KPIs del inicio y la barra lateral
  renderInicio();

  // Timestamp
  const ts = document.getElementById('resTimestamp');
  if (ts) ts.textContent = 'Actualizado: ' + new Date().toLocaleTimeString('es-CO', {hour:'2-digit',minute:'2-digit',second:'2-digit'});

  // Filtrar
  const q = (document.getElementById('buscarReserva')?.value || '').toLowerCase();
  let lista = _listaParaTab(tab);
  if (q) lista = lista.filter(r =>
    (r.cliente_nombre||'').toLowerCase().includes(q) ||
    (r.cancha_nombre||'').toLowerCase().includes(q)
  );

  const el = document.getElementById('listaReservas');
  if (!lista.length) {
    el.innerHTML = '<div style="padding:32px;text-align:center;color:var(--text-muted)">Sin reservas en esta vista</div>';
    return;
  }

  el.innerHTML = lista.map(r => {
    const estadoClass = r.estado==='confirmada'?'confirmed':r.estado==='pendiente'?'pending':'cancelled';
    const tipoLabel = { partido_libre:'Partido libre', recurrente:'Recurrente', torneo:'Torneo', entrenamiento:'Entrenamiento' };
    return `
    <div class="res-card" style="display:flex;align-items:center;gap:14px;padding:14px 16px;border-bottom:1px solid var(--border);flex-wrap:wrap">
      <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--green-dark),var(--green-bright));display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue';font-size:16px;flex-shrink:0">
        ${initiales(r.cliente_nombre||'?')}
      </div>
      <div style="flex:1;min-width:140px">
        <div style="font-weight:600;font-size:14px">${safeText(r.cliente_nombre||'—')}</div>
        <div style="font-size:11px;color:var(--text-muted)">${safeText(r.cancha_nombre||'—')} · ${tipoLabel[r.tipo]||r.tipo||''}</div>
      </div>
      <div style="text-align:center;min-width:80px">
        <div style="font-size:13px;font-weight:600">${formatHora(r.hora_inicio)}</div>
        <div style="font-size:11px;color:var(--text-muted)">${r.fecha||''} · ${r.duracion_horas}h</div>
      </div>
      <div style="text-align:right;min-width:90px">
        <div style="color:var(--gold);font-weight:700;font-size:14px">${formatCOP(r.total)}</div>
        <div style="font-size:11px;color:var(--text-muted)">${r.metodo_pago||'efectivo'}</div>
      </div>
      <div style="min-width:90px;text-align:center">
        <span class="pill ${estadoClass}">${estadoLabel(r.estado)}</span>
      </div>
      <div style="display:flex;gap:6px;flex-shrink:0">
        ${r.estado==='pendiente'?`<button class="btn btn-primary btn-sm" onclick="confirmarEstado(${r.id},'confirmada')" title="Confirmar">✓</button>`:''}
        ${r.estado!=='cancelada'?`<button class="btn btn-danger btn-sm" onclick="confirmarEstado(${r.id},'cancelada')" title="Cancelar">✕</button>`:''}
      </div>
    </div>`;
  }).join('');
}

function filtrarReservas() {
  renderReservas(_tabReservas);
}

async function confirmarEstado(id, estado) {
  const res = await apiFetch(`/reservas/${id}`, { method:'PUT', body: JSON.stringify({ estado }) });
  if (!res || res.error) { showToast(res?.error || 'Error al actualizar reserva', 'error'); return; }
  const [hoy, todas] = await Promise.all([apiFetch('/reservas/hoy'), apiFetch('/reservas')]);
  if (hoy)   reservasActuales = hoy;
  if (todas) todasReservas    = todas;
  renderReservas(_tabReservas);
  renderTimeline();
  renderInicio();
  if (_seccionActiva() === 'reportes') renderReportes();
  cargarNotificaciones();
  showToast(`Reserva ${estadoLabel(estado)}`, 'success');
}

function calcularTotal() {
  const sel = document.getElementById('nrCancha');
  const opt = sel.options[sel.selectedIndex];
  const precio = parseInt(opt?.dataset?.precio || 0);
  const dur = parseInt(document.getElementById('nrDuracion').value || 1);
  document.getElementById('totalEstimado').textContent = formatCOP(precio * dur);
}

async function verificarDisponibilidad() {
  const canchaId = document.getElementById('nrCancha').value;
  const fecha    = document.getElementById('nrFecha').value;
  const hora     = document.getElementById('nrHora').value;
  const dur      = document.getElementById('nrDuracion').value;
  const el = document.getElementById('disponibilidadMsg');
  if (!canchaId || !fecha || !hora) { el.innerHTML = ''; return; }

  el.innerHTML = '<div class="avail-checking"><div class="spinner"></div>Verificando disponibilidad…</div>';
  const data = await apiFetch(`/reservas/disponibilidad?cancha_id=${canchaId}&fecha=${fecha}&hora_inicio=${hora}:00&duracion=${dur}`);
  if (data === null) {
    const ocupado = todasReservas.some(r =>
      r.cancha_id == canchaId && r.fecha === fecha && r.hora_inicio.startsWith(hora) && r.estado !== 'cancelada'
    );
    el.innerHTML = ocupado
      ? '<div class="avail-no">✗ Horario no disponible</div>'
      : '<div class="avail-ok">✓ Horario disponible</div>';
  } else {
    el.innerHTML = data.disponible
      ? '<div class="avail-ok">✓ Horario disponible</div>'
      : '<div class="avail-no">✗ Horario no disponible</div>';
  }
}

async function confirmarReserva() {
  const clienteId = document.getElementById('nrCliente').value;
  const canchaId  = document.getElementById('nrCancha').value;
  const fecha     = document.getElementById('nrFecha').value;
  const hora      = document.getElementById('nrHora').value;
  const duracion  = parseInt(document.getElementById('nrDuracion').value);
  const tipo      = document.getElementById('nrTipo').value;
  const metodo    = document.getElementById('nrMetodo').value;

  if (!clienteId || !canchaId || !fecha) {
    showToast('Completa todos los campos requeridos', 'error'); return;
  }

  const sel    = document.getElementById('nrCancha');
  const precio = parseInt(sel.options[sel.selectedIndex].dataset.precio || 0);
  const total  = precio * duracion;

  const btn = document.getElementById('btnConfirmarReserva');
  btn.disabled = true; btn.textContent = 'Guardando…';

  const body = { cliente_id: clienteId, cancha_id: canchaId, fecha, hora_inicio: hora + ':00', duracion_horas: duracion, total, tipo, metodo_pago: metodo };
  const data = await apiFetch('/reservas', { method:'POST', body: JSON.stringify(body) });

  btn.disabled = false; btn.textContent = 'Confirmar Reserva';

  if (!data || data.error) {
    showToast(data?.error || 'Error al guardar la reserva', 'error'); return;
  }

  // Re-fetch so arrays stay in sync
  const [hoy, todas] = await Promise.all([apiFetch('/reservas/hoy'), apiFetch('/reservas')]);
  if (hoy)  reservasActuales = hoy;
  if (todas) todasReservas   = todas;

  // Reset form
  document.getElementById('nrCliente').value = '';
  document.getElementById('nrCancha').value  = '';
  document.getElementById('nrFecha').value   = fechaHoyInput();
  document.getElementById('nrHora').value    = '08:00';
  document.getElementById('nrDuracion').value = '1';
  document.getElementById('nrTipo').value    = 'partido_libre';
  document.getElementById('nrMetodo').value  = 'efectivo';
  document.getElementById('disponibilidadMsg').innerHTML = '';
  document.getElementById('totalEstimado').textContent   = '$0';

  renderReservas(_tabReservas);
  if (_seccionActiva() === 'reportes') renderReportes();
  showToast('Reserva registrada · ' + formatCOP(total), 'success');
}

function poblarSelectClientes() {
  const sel = document.getElementById('nrCliente');
  sel.innerHTML = '<option value="">— Seleccionar cliente —</option>';
  clientesActuales.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id; opt.textContent = c.nombre;
    sel.appendChild(opt);
  });
}

function poblarSelectCanchas() {
  const sel = document.getElementById('nrCancha');
  sel.innerHTML = '<option value="" data-precio="0">— Seleccionar cancha —</option>';
  canchasActuales.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.dataset.precio = c.precio_hora || 0;
    opt.textContent = `${c.nombre} — ${c.tipo} (${formatCOP(c.precio_hora||0)}/h)`;
    sel.appendChild(opt);
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLIENTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderClientes() {
  const total = clientesActuales.length;
  const pts   = clientesActuales.reduce((s,c) => s + (c.puntos||0), 0);
  const vip   = clientesActuales.filter(c => c.nivel === 'Oro' || c.nivel === 'Diamante').length;
  const diam  = clientesActuales.filter(c => c.nivel === 'Diamante').length;

  set('cliTotal',    total);
  set('cliPts',      (pts/1000).toFixed(1) + 'K');
  set('cliVip',      vip);
  set('cliDiamante', diam);

  // Ranking
  const cols = ['linear-gradient(135deg,#1a7a36,#22c55e)','linear-gradient(135deg,#1d4ed8,#3b82f6)','linear-gradient(135deg,#7c3aed,#a78bfa)','linear-gradient(135deg,#b45309,#f59e0b)','linear-gradient(135deg,#065f46,#34d399)'];
  document.getElementById('rankingClientes').innerHTML = clientesActuales.slice(0,5).map((c,i) => `
    <div class="client-row">
      <span style="font-family:'Bebas Neue';font-size:20px;color:${i===0?'var(--gold)':'var(--text-muted)'};width:24px">${i+1}</span>
      <div class="client-avatar" style="background:${cols[i%cols.length]}">${initiales(c.nombre)}</div>
      <div class="client-info"><strong>${safeText(c.nombre)}</strong><span>${c.total_reservas} reservas · ${c.nivel}</span></div>
      <div style="text-align:right"><div class="client-pts">${c.puntos}</div><div class="pts-label">puntos</div></div>
    </div>`).join('');

  renderTablaClientes(clientesActuales);
}

function renderTablaClientes(lista) {
  const nivelBadge = n => `<span class="nivel-badge ${n}">${n}</span>`;
  document.getElementById('tablaClientes').innerHTML = `<table>
    <thead><tr><th>Cliente</th><th>Teléfono</th><th>Reservas</th><th>Total gastado</th><th>Puntos</th><th>Nivel</th><th>Estado</th><th>Acciones</th></tr></thead>
    <tbody>${lista.map(c => {
      const bloqueado = c.activo === 0 || c.activo === false;
      return `<tr style="${bloqueado ? 'opacity:.55' : ''}">
        <td><b>${safeText(c.nombre)}</b>${bloqueado ? ' <span style="color:#ef4444;font-size:11px">[Bloqueado]</span>' : ''}</td>
        <td>${c.telefono || '—'}</td>
        <td>${c.total_reservas || 0}</td>
        <td style="color:var(--gold)">${formatCOP(c.total_gastado || 0)}</td>
        <td style="color:var(--gold)">${c.puntos || 0} ⭐</td>
        <td>${nivelBadge(c.nivel || 'Bronce')}</td>
        <td><span style="color:${bloqueado ? '#ef4444' : 'var(--green)'}">● ${bloqueado ? 'Bloqueado' : 'Activo'}</span></td>
        <td style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn" style="font-size:11px;padding:4px 10px;background:${bloqueado ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)'};color:${bloqueado ? 'var(--green)' : '#ef4444'};border:1px solid ${bloqueado ? 'var(--green)' : '#ef4444'}"
            onclick="toggleClienteEstado(${c.id}, ${bloqueado ? 1 : 0})">
            ${bloqueado ? 'Desbloquear' : 'Bloquear'}
          </button>
          <button class="btn" style="font-size:11px;padding:4px 10px;background:rgba(239,68,68,.15);color:#ef4444;border:1px solid #ef4444"
            onclick="eliminarCliente(${c.id})">
            Eliminar
          </button>
        </td>
      </tr>`;
    }).join('')}</tbody>
  </table>`;
}

async function toggleClienteEstado(id, nuevoActivo) {
  const accion = nuevoActivo === 1 ? 'desbloquear' : 'bloquear';
  if (!confirm(`¿Deseas ${accion} este cliente?`)) return;
  try {
    const res = await apiFetch(`/clientes/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ activo: nuevoActivo })
    });
    if (res && res.success) {
      const c = clientesActuales.find(c => c.id === id);
      if (c) c.activo = nuevoActivo;
      renderClientes();
      showToast(`Cliente ${nuevoActivo === 1 ? 'desbloqueado' : 'bloqueado'} correctamente`);
    } else {
      showToast((res && res.error) || 'Error al cambiar estado', 'error');
    }
  } catch {
    showToast('Error de conexión', 'error');
  }
}

async function eliminarCliente(id) {
  const cliente = clientesActuales.find(c => c.id === id);
  const nombre  = cliente?.nombre || 'este cliente';
  if (!confirm(`¿Eliminar al cliente "${nombre}"?\nEsta acción no se puede deshacer.`)) return;
  try {
    const res = await apiFetch(`/clientes/${id}`, { method: 'DELETE' });
    if (res && res.success) {
      clientesActuales = clientesActuales.filter(c => c.id !== id);
      renderClientes();
      showToast(`Cliente "${nombre}" eliminado del sistema`);
    } else {
      showToast((res && res.error) || 'Error al eliminar', 'error');
    }
  } catch {
    showToast('Error de conexión', 'error');
  }
}

function filtrarClientes() {
  const q = document.getElementById('buscarCliente').value.toLowerCase();
  renderTablaClientes(clientesActuales.filter(c => c.nombre.toLowerCase().includes(q)));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INVENTARIO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const INV_ICONS = { 'Balones Fútbol 11':'⚽','Balones Fútbol 5':'⚽','Chalecos Peto':'🦺','Conos Demarcación':'🔶','Redes de Arco':'🥅','Botiquín Aux.':'🩺','Guantes Portero':'🧤','Pintura Líneas':'🪣','Tableros Tácticos':'📋' };

function renderInventario() {
  const bajo = inventarioActual.filter(i => i.cantidad < i.cantidad_minima).length;
  const ok   = inventarioActual.length - bajo;
  set('invTotal', inventarioActual.reduce((s,i) => s + i.cantidad, 0));
  set('invBajo', bajo);
  set('invOk',   ok);

  document.getElementById('invGrid').innerHTML = inventarioActual.map(i => {
    const isLow = i.cantidad < i.cantidad_minima;
    const icon  = INV_ICONS[i.nombre] || '📦';
    return `<div class="inv-item ${isLow ? 'low' : 'ok'}">
      <div class="inv-icon">${icon}</div>
      <div class="inv-info"><strong>${safeText(i.nombre)}</strong><span>${safeText(i.categoria)}</span></div>
      <div class="inv-count">${i.cantidad}</div>
    </div>`;
  }).join('');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _pagosActuales = [];

async function renderPagos() {
  const metMap = { efectivo:'💵', nequi:'📱', daviplata:'📱', pse:'🏦', tarjeta:'💳' };
  const apiPagos = await apiFetch('/pagos');
  _pagosActuales = Array.isArray(apiPagos) ? apiPagos : [];

  const rows = _pagosActuales.map(p => {
    const esAprobado  = p.estado === 'aprobado';
    const esRechazado = p.estado === 'rechazado';
    const estadoCls   = esAprobado ? 'confirmed' : esRechazado ? 'cancelled' : 'pending';
    return `<tr>
    <td style="color:var(--text-muted)">#${p.id}</td>
    <td><b>${safeText(p.cliente_nombre)}</b></td>
    <td>${safeText(p.concepto)}</td>
    <td>${metMap[p.metodo] || ''} ${safeText(p.metodo)}</td>
    <td style="color:var(--gold)">${formatCOP(p.monto)}</td>
    <td><span class="pill ${estadoCls}">${p.estado}</span></td>
    <td style="display:flex;gap:5px">
      ${!esAprobado  ? `<button class="btn btn-primary btn-sm" style="font-size:11px;padding:3px 8px" onclick="cambiarEstadoPago(${p.id},'aprobado')">✓ Aprobar</button>` : ''}
      ${!esRechazado ? `<button class="btn btn-danger  btn-sm" style="font-size:11px;padding:3px 8px" onclick="cambiarEstadoPago(${p.id},'rechazado')">✕</button>` : ''}
    </td>
  </tr>`;
  }).join('');
  document.getElementById('tablaPagos').innerHTML = `<table><thead><tr><th>ID</th><th>Cliente</th><th>Concepto</th><th>Método</th><th>Monto</th><th>Estado</th><th>Acción</th></tr></thead><tbody>${rows}</tbody></table>`;

  const resumen = await apiFetch('/pagos/resumen-hoy');
  const ef  = resumen?.efectivo  || 0;
  const ne  = resumen?.nequi     || 0;
  const da  = resumen?.daviplata || 0;
  const ps  = resumen?.pse       || 0;
  const ta  = resumen?.tarjeta   || 0;
  set('pEfectivo', formatCOP(ef));
  set('pNequi',    formatCOP(ne + da));
  set('pPse',      formatCOP(ps));
  set('pTarjeta',  formatCOP(ta));
  set('pmEfectivo', formatCOP(ef));
  set('pmNequi',    formatCOP(ne));
  set('pmDaviplata',formatCOP(da));
  set('pmPse',      formatCOP(ps));
  set('pmTarjeta',  formatCOP(ta));
}

async function cambiarEstadoPago(id, estado) {
  const res = await apiFetch(`/pagos/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estado })
  });
  if (res && res.success) {
    const p = _pagosActuales.find(x => x.id === id);
    if (p) p.estado = estado;
    const etiqueta = estado === 'aprobado' ? 'Aprobado' : 'Rechazado';
    showToast(`Pago #${id} — ${etiqueta}`, estado === 'aprobado' ? 'success' : 'info');
    await renderPagos();
  } else {
    showToast(res?.error || 'Error al actualizar pago', 'error');
  }
}

function exportarCSV() {
  const lista   = _pagosActuales;
  const headers = ['ID','Cliente','Concepto','Método','Monto','Estado'];
  const rows    = lista.map(p => [p.id, p.cliente_nombre, p.concepto, p.metodo, p.monto, p.estado]);
  const csv     = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type:'text/csv;charset=utf-8' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'pagos_' + fechaHoyInput() + '.csv';
  a.click();
  showToast('CSV exportado', 'success');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CAJA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function renderCaja() {
  const el = document.getElementById('movimientosCaja');
  if (!el) return;

  const apiMovs = await apiFetch('/caja');
  const lista   = Array.isArray(apiMovs) ? apiMovs : [];

  const tipoClass = { apertura:'active', ingreso:'confirmed', egreso:'cancelled', cierre:'pending' };
  const rows = lista.map(m => `<tr>
    <td style="color:var(--text-muted)">${safeText(m.hora)}</td>
    <td>${safeText(m.concepto)}</td>
    <td><span class="pill ${tipoClass[m.tipo] || ''}">${safeText(m.tipo.charAt(0).toUpperCase()+m.tipo.slice(1))}</span></td>
    <td style="color:${m.monto < 0 ? 'var(--red)' : 'var(--green-bright)'}">${m.monto > 0 ? '+' : ''}${formatCOP(Math.abs(m.monto))}</td>
  </tr>`).join('');

  el.innerHTML = `<table><thead><tr><th>Hora</th><th>Concepto</th><th>Tipo</th><th>Monto</th></tr></thead><tbody>${rows || '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:20px">Sin movimientos hoy</td></tr>'}</tbody></table>`;

  // Actualizar resumen si hay datos reales
  if (apiMovs) {
    const entradas = lista.filter(m => ['apertura','ingreso'].includes(m.tipo)).reduce((s,m) => s + m.monto, 0);
    const salidas  = lista.filter(m => m.tipo === 'egreso').reduce((s,m) => s + Math.abs(m.monto), 0);
    set('cajaIngresos', formatCOP(entradas));
    set('cajaTotal',    formatCOP(entradas - salidas));
  }
}

async function registrarMovimiento() {
  const tipo     = document.getElementById('cajaTipo').value;
  const concepto = document.getElementById('cajaConcepto').value.trim();
  const montoRaw = parseInt(document.getElementById('cajaMonto').value || 0);
  if (!concepto || !montoRaw) { showToast('Completa todos los campos', 'error'); return; }
  const monto = tipo === 'egreso' ? -Math.abs(montoRaw) : Math.abs(montoRaw);

  const res = await apiFetch('/caja', { method:'POST', body: JSON.stringify({ concepto, tipo, monto }) });
  if (!res || res.error) {
    // fallback: solo en memoria
    MOVIMIENTOS_CAJA.push({ hora: new Date().toTimeString().slice(0,5), concepto, tipo, monto });
    showToast('Sin conexión — movimiento guardado localmente', 'info');
  } else {
    showToast('Movimiento registrado', 'success');
  }

  document.getElementById('cajaConcepto').value = '';
  document.getElementById('cajaMonto').value    = '';
  await renderCaja();
}

async function arqueoParcial() {
  const res = await apiFetch('/caja/resumen');
  if (res) {
    showToast(`Arqueo: Entradas ${formatCOP(res.entradas)} | Salidas ${formatCOP(res.salidas)} | Total ${formatCOP(res.total)}`, 'info');
  } else {
    showToast('Arqueo parcial generado', 'info');
  }
}

async function cerrarCaja() {
  if (!confirm('¿Confirmas el cierre de caja?')) return;
  await apiFetch('/caja', {
    method: 'POST',
    body: JSON.stringify({ concepto: 'Cierre de caja', tipo: 'cierre', monto: 0 })
  });
  showToast('Caja cerrada correctamente', 'success');
  await renderCaja();
}

let _cajaTimer = null;
function _iniciarPollingCaja() {
  _detenerPollingCaja();
  renderCaja();
  _cajaTimer = setInterval(renderCaja, 30000);
}
function _detenerPollingCaja() {
  if (_cajaTimer) { clearInterval(_cajaTimer); _cajaTimer = null; }
}

let _canchasTimer = null;
function _iniciarPollingCanchas() {
  _detenerPollingCanchas();
  _canchasTimer = setInterval(async () => {
    const canchas  = await apiFetch('/canchas');
    const reservas = await apiFetch('/reservas/hoy');
    if (canchas)  canchasActuales  = canchas;
    if (reservas) reservasActuales = reservas;
    renderCanchas();
  }, 15000);
}
function _detenerPollingCanchas() {
  if (_canchasTimer) { clearInterval(_canchasTimer); _canchasTimer = null; }
}

let _clientesTimer = null;
function _iniciarPollingClientes() {
  _detenerPollingClientes();
  // carga inmediata con datos frescos (no cache)
  apiFetch('/clientes').then(data => {
    if (Array.isArray(data)) { clientesActuales = data; renderClientes(); }
  });
  _clientesTimer = setInterval(async () => {
    const data = await apiFetch('/clientes');
    if (Array.isArray(data)) { clientesActuales = data; renderClientes(); }
  }, 8000);
}
function _detenerPollingClientes() {
  if (_clientesTimer) { clearInterval(_clientesTimer); _clientesTimer = null; }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHECKLIST MANTENIMIENTO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderChecklist() {
  const el = document.getElementById('checklistMant');
  if (!el) return;

  // KPIs dinámicos desde CHECKLIST_DATA
  set('maintCompletadas', CHECKLIST_DATA.filter(t => t.estado === 'done').length);
  set('maintPendientes',  CHECKLIST_DATA.filter(t => t.estado === 'pending' || t.estado === 'open').length);
  set('maintUrgentes',    CHECKLIST_DATA.filter(t => t.estado === 'urgent').length);
  set('maintCanchasMant', canchasActuales.filter(c => c.estado === 'mantenimiento').length);

  if (!CHECKLIST_DATA.length) {
    el.innerHTML = '<div style="padding:24px;text-align:center;color:var(--text-muted)">Sin tareas registradas</div>';
    return;
  }

  el.innerHTML = CHECKLIST_DATA.map((item, i) => {
    const isDone = item.estado === 'done';
    const boxClass = isDone ? 'done' : item.estado === 'pending' ? 'pending-c' : '';
    const urgent = item.estado === 'urgent' ? '<span style="color:var(--red);font-size:11px">⚠️ Urgente</span>' : '';
    return `<div class="maint-item">
      <div class="check-box ${boxClass}" onclick="toggleCheck(${i})">${isDone ? '✓' : ''}</div>
      <div class="maint-info">
        <strong>${safeText(item.desc)}</strong>
        <span>${urgent || (item.hora !== '—' ? item.hora + ' · ' : '') + safeText(item.resp)}</span>
      </div>
      <span class="maint-court">${safeText(item.cancha)}</span>
    </div>`;
  }).join('');
}

async function toggleCheck(i) {
  const item       = CHECKLIST_DATA[i];
  const nuevoUI    = item.estado === 'done' ? 'open' : 'done';
  // Mapear estado UI → estado válido en BD
  const uiToDb     = { done:'completado', pending:'en_proceso', urgent:'urgente', open:'pendiente' };
  const estadoDB   = uiToDb[nuevoUI] || 'pendiente';

  item.estado = nuevoUI;
  renderChecklist(); // actualización optimista

  if (item.id) {
    const res = await apiFetch(`/mantenimiento/${item.id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado: estadoDB }),
    });
    if (!res || res.error) {
      // revertir si falla
      item.estado = item.estado === 'done' ? 'open' : 'done';
      renderChecklist();
      showToast('Error al actualizar tarea', 'error');
    }
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CALENDARIO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderCalendario() {
  const grid = document.getElementById('calendarioGrid');
  if (!grid) return;
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  document.getElementById('calMes').textContent = meses[month] + ' ' + year;

  const dias = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  let html = dias.map(d => `<div class="cal-header">${d}</div>`).join('');

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const prevLast = new Date(year, month, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    html += `<div class="cal-day other">${prevLast - firstDay + 1 + i}</div>`;
  }
  const reservasPorDia = {};
  todasReservas.forEach(r => {
    if (!r.fecha || r.estado === 'cancelada') return;
    const d = new Date(r.fecha + 'T00:00:00');
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      reservasPorDia[day] = (reservasPorDia[day] || 0) + 1;
    }
  });
  const totalCanchas = canchasActuales.length || 5;
  for (let d = 1; d <= lastDate; d++) {
    const isToday = d === today;
    const cnt = reservasPorDia[d] || 0;
    const cls = cnt >= totalCanchas ? 'has-event full' : cnt > 0 ? 'has-event partial' : '';
    html += `<div class="cal-day ${isToday ? 'today' : cls}" onclick="selDia(this,${d})">${d}</div>`;
  }
  let after = 1;
  while ((firstDay + lastDate + after - 1) % 7 !== 0) {
    html += `<div class="cal-day other">${after++}</div>`;
  }
  grid.innerHTML = html;
}

function selDia(el, d) {
  document.querySelectorAll('.cal-day.selected').forEach(x => x.classList.remove('selected'));
  el.classList.add('selected');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHARTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function renderCharts() {
  const now        = new Date();
  const curYear    = now.getFullYear();
  const curMonth   = now.getMonth();
  const daysElapsed = now.getDate();
  const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();

  // ── Bar chart anual ───────────────────────────────────────────────────────
  const monthTotals = Array(12).fill(0);
  todasReservas.forEach(r => {
    if (!r.fecha || r.estado === 'cancelada') return;
    const d = new Date(r.fecha + 'T00:00:00');
    if (d.getFullYear() === curYear) monthTotals[d.getMonth()] += (r.total || 0);
  });
  const vals = monthTotals.map((v, i) => {
    const d = new Date(curYear, i, 1);
    return d <= now ? (Math.round(v / 1000) || null) : null;
  });
  renderBar('barFinanzas',
    ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    vals,
    'linear-gradient(180deg,var(--green-bright),var(--green-mid))'
  );

  // ── KPIs del mes actual ───────────────────────────────────────────────────
  const ingresosMes = monthTotals[curMonth];
  const promedioDia = daysElapsed > 0 ? Math.round(ingresosMes / daysElapsed) : 0;

  // Gastos: egresos de hoy desde caja (aproximación; caja guarda por día)
  let gastosMes = 0;
  try {
    const movs = await apiFetch('/caja');
    if (Array.isArray(movs)) {
      movs.forEach(m => { if (m.tipo === 'egreso') gastosMes += Number(m.monto || 0); });
    }
  } catch (_) {}

  const utilidad  = ingresosMes - gastosMes;
  const proyeccion = Math.round(promedioDia * daysInMonth);

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('finKpiIngresos', formatCOP(ingresosMes));
  setEl('finKpiPromedio', formatCOP(promedioDia));
  setEl('finKpiGastos',   formatCOP(gastosMes));
  setEl('finKpiUtilidad', formatCOP(utilidad));

  // ── Ingresos por cancha (mes actual) ─────────────────────────────────────
  const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const ingPC = {}, cntPC = {};
  todasReservas.forEach(r => {
    if (r.estado === 'cancelada') return;
    const d = new Date((r.fecha || '') + 'T00:00:00');
    if (d.getFullYear() !== curYear || d.getMonth() !== curMonth) return;
    const k = r.cancha_nombre || 'Sin asignar';
    ingPC[k] = (ingPC[k] || 0) + (r.total || 0);
    cntPC[k] = (cntPC[k] || 0) + 1;
  });
  const entries = Object.entries(ingPC).sort((a, b) => b[1] - a[1]);
  const maxIng  = Math.max(...entries.map(e => e[1]), 1);
  const colores = ['var(--green-bright)','var(--blue)','var(--cyan)','var(--gold)','var(--orange)'];
  const canEl = document.getElementById('finCanchas');
  const mesEl = document.getElementById('finCanchasMes');
  if (mesEl) mesEl.textContent = MONTH_NAMES[curMonth] + ' ' + curYear;
  if (canEl) {
    canEl.innerHTML = entries.length
      ? entries.map(([nombre, ing], i) => {
          const pct = Math.round((ing / maxIng) * 100);
          const cnt = cntPC[nombre] || 0;
          return `<div class="progress-wrap">
            <div class="progress-label">
              <span>${safeText(nombre)}</span>
              <span style="color:${colores[i % colores.length]}">${formatCOP(ing)}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${pct}%;background:${colores[i % colores.length]}"></div>
            </div>
            <div style="font-size:10px;color:var(--text-muted);text-align:right;margin-top:2px">${cnt} reserva${cnt !== 1 ? 's' : ''}</div>
          </div>`;
        }).join('')
      : '<div style="padding:24px;text-align:center;color:var(--text-muted)">Sin ingresos registrados este mes</div>';
  }

  // ── Proyección del mes ────────────────────────────────────────────────────
  const projEl = document.getElementById('finProyeccion');
  if (projEl) {
    const pctReservas = ingresosMes > 0 ? Math.round((ingresosMes / proyeccion) * 100) : 0;
    projEl.innerHTML = `
      <div style="background:linear-gradient(135deg,rgba(34,197,94,.1),rgba(34,197,94,.04));border:1px solid rgba(34,197,94,.2);border-radius:12px;padding:18px">
        <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1.5px;font-weight:600">Proyección ${MONTH_NAMES[curMonth]} ${curYear}</div>
        <div style="font-family:'Bebas Neue';font-size:42px;color:var(--green-bright);line-height:1.1">${formatCOP(proyeccion)}</div>
        <div style="font-size:12px;color:var(--text-muted)">Basado en promedio diario de ${daysElapsed} día${daysElapsed !== 1 ? 's' : ''}</div>
      </div>
      <div class="progress-wrap">
        <div class="progress-label">
          <span>Avance del mes</span>
          <span style="color:var(--green-bright)">${formatCOP(ingresosMes)} (${pctReservas}%)</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill pf-green" style="width:${Math.min(pctReservas,100)}%"></div>
        </div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);text-align:center;padding-top:4px">
        Días transcurridos: ${daysElapsed} de ${daysInMonth}
      </div>`;
  }
}

function renderBar(id, labels, vals, color) {
  const el = document.getElementById(id);
  if (!el) return;
  const nonNull = vals.filter(v => v !== null && v > 0);
  const max     = nonNull.length ? Math.max(...nonNull) : 1;
  el.innerHTML = labels.map((l, i) => {
    const v = vals[i];
    const h = v ? Math.round((v / max) * 100) : 8;
    const op = v ? 1 : .25;
    return `<div class="bar-wrap">
      <div class="bar-val">${v ? (v >= 1000 ? (v/1000).toFixed(0)+'K' : v) : '—'}</div>
      <div class="bar" style="height:${h}%;background:${color};opacity:${op}"></div>
      <div class="bar-lbl">${l}</div>
    </div>`;
  }).join('');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REPORTES — polling en tiempo real
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _rptTimer = null;

function _seccionActiva() {
  const sec = document.querySelector('.section.active');
  return sec ? sec.id.replace('sec-', '') : '';
}

function _iniciarPollingReportes() {
  _detenerPollingReportes();
  // carga inmediata con datos frescos de la API
  cargarTodo().then(renderReportes);
  // luego refresca automáticamente cada 30 s
  _rptTimer = setInterval(async () => {
    await cargarTodo();
    renderReportes();
  }, 15000);
}

function _detenerPollingReportes() {
  if (_rptTimer) { clearInterval(_rptTimer); _rptTimer = null; }
}

async function renderReportes() {
  // Timestamp de última actualización
  const ts = document.getElementById('rptTimestamp');
  if (ts) ts.textContent = 'Última actualización: ' + new Date().toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit', second:'2-digit' });

  const total   = reservasActuales.length;
  const conf    = reservasActuales.filter(r => r.estado === 'confirmada').length;
  const pend    = reservasActuales.filter(r => r.estado === 'pendiente').length;
  const canc    = reservasActuales.filter(r => r.estado === 'cancelada').length;
  const ingHoy  = reservasActuales.filter(r => r.estado !== 'cancelada').reduce((s, r) => s + r.total, 0);
  const ocupadas = canchasActuales.filter(c => c.estado !== 'disponible').length;
  const pctOcup  = canchasActuales.length ? Math.round((ocupadas / canchasActuales.length) * 100) : 0;
  const pctCanc  = total ? Math.round((canc / total) * 100) : 0;

  // ── KPI cards ────────────────────────────────────────────────────────────
  document.getElementById('rptKpis').innerHTML = `
    <div class="stat-card c-green">
      <span class="sc-icon">🏟️</span>
      <div class="sc-label">Ocupación Canchas</div>
      <div class="sc-val" style="color:var(--green-bright)">${pctOcup}%</div>
      <div class="sc-sub">${ocupadas} de ${canchasActuales.length} activas ahora</div>
    </div>
    <div class="stat-card c-blue">
      <span class="sc-icon">📅</span>
      <div class="sc-label">Reservas Hoy</div>
      <div class="sc-val" style="color:var(--blue)">${total}</div>
      <div class="sc-sub">${conf} confirmadas · ${pend} pendientes</div>
    </div>
    <div class="stat-card c-gold">
      <span class="sc-icon">💰</span>
      <div class="sc-label">Ingresos del Día</div>
      <div class="sc-val" style="color:var(--gold)">${formatCOP(ingHoy)}</div>
      <div class="sc-sub">solo reservas activas</div>
    </div>
    <div class="stat-card ${pctCanc > 15 ? 'c-red' : 'c-green'}">
      <span class="sc-icon">${pctCanc > 15 ? '⚠️' : '✅'}</span>
      <div class="sc-label">Cancelaciones</div>
      <div class="sc-val" style="color:${pctCanc > 15 ? 'var(--red)' : 'var(--green-bright)'}">${pctCanc}%</div>
      <div class="sc-sub">${canc} cancelada${canc !== 1 ? 's' : ''} de ${total}</div>
    </div>`;

  // ── Estado de canchas ─────────────────────────────────────────────────────
  const eMap = {
    disponible:    { bg:'rgba(34,197,94,.08)',   brd:'rgba(34,197,94,.25)',   dot:'var(--green-bright)', lbl:'Disponible',    icon:'✅' },
    ocupada:       { bg:'rgba(248,113,113,.08)', brd:'rgba(248,113,113,.25)', dot:'var(--red)',           lbl:'Ocupada',       icon:'🔴' },
    mantenimiento: { bg:'rgba(245,184,0,.08)',   brd:'rgba(245,184,0,.25)',   dot:'var(--gold)',          lbl:'Mantenimiento', icon:'🔧' },
  };
  document.getElementById('rptCanchas').innerHTML = canchasActuales.map(c => {
    const e = eMap[c.estado] || eMap.disponible;
    const resHoy = reservasActuales.filter(r => (r.cancha_id === c.id || r.cancha_nombre === c.nombre) && r.estado !== 'cancelada').length;
    return `<div style="display:flex;align-items:center;gap:14px;padding:10px 14px;border-radius:10px;background:${e.bg};border:1px solid ${e.brd};margin-bottom:8px">
      <div style="width:42px;height:42px;border-radius:9px;background:rgba(255,255,255,.04);border:1px solid ${e.brd};display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue';font-size:15px;color:${e.dot};flex-shrink:0">C${c.id}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${safeText(c.nombre)} — ${safeText(c.tipo)}</div>
        <div style="font-size:11px;color:var(--text-muted)">${safeText(c.superficie)} · ${safeText(c.dimensiones)}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-size:12px;font-weight:700;color:${e.dot}">${e.icon} ${e.lbl}</div>
        <div style="font-size:11px;color:var(--text-muted)">${resHoy} reserva${resHoy !== 1 ? 's' : ''} hoy · ${formatCOP(c.precio_hora)}/h</div>
      </div>
    </div>`;
  }).join('');

  // ── Gantt de ocupación por hora ───────────────────────────────────────────
  const horas = Array.from({ length: 15 }, (_, i) => i + 8); // 08..22
  const nowH  = new Date().getHours();
  let gantt = `<div style="overflow-x:auto"><div style="min-width:520px">`;

  // Fila de cabecera con horas
  gantt += `<div style="display:grid;grid-template-columns:72px repeat(15,1fr);gap:2px;margin-bottom:6px">
    <div style="font-size:10px;color:var(--text-muted)">Cancha</div>
    ${horas.map(h => `<div style="text-align:center;font-size:9px;color:${h === nowH ? 'var(--green-bright)' : 'var(--text-muted)'};font-weight:${h === nowH ? '700' : '400'}">${String(h).padStart(2,'0')}h</div>`).join('')}
  </div>`;

  // Fila por cada cancha
  canchasActuales.forEach(c => {
    gantt += `<div style="display:grid;grid-template-columns:72px repeat(15,1fr);gap:2px;margin-bottom:4px;align-items:center">
      <div style="font-size:10px;font-weight:600;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:6px">${safeText(c.nombre)}</div>
      ${horas.map(h => {
        const res = reservasActuales.find(r => {
          if (r.estado === 'cancelada') return false;
          if (r.cancha_id !== c.id && r.cancha_nombre !== c.nombre) return false;
          const hI = parseInt(r.hora_inicio?.split(':')[0] || 0);
          return h >= hI && h < hI + (r.duracion_horas || 1);
        });
        const isNow = h === nowH;
        let bg, title;
        if (res) {
          bg    = res.estado === 'confirmada' ? 'var(--green-mid)' : 'rgba(245,184,0,.7)';
          title = `${safeText(res.cliente_nombre || 'Reserva')} · ${safeText(res.estado)}`;
        } else {
          bg    = isNow ? 'var(--surface-hover)' : 'var(--dark-input)';
          title = 'Libre';
        }
        return `<div title="${title}" style="height:26px;background:${bg};border-radius:4px;${isNow ? 'box-shadow:0 0 0 1px var(--green-neon)' : ''};cursor:default"></div>`;
      }).join('')}
    </div>`;
  });

  gantt += `<div style="display:flex;gap:20px;margin-top:10px;font-size:10px;color:var(--text-muted);flex-wrap:wrap">
    <span><span style="display:inline-block;width:12px;height:10px;background:var(--green-mid);border-radius:2px;vertical-align:middle;margin-right:4px"></span>Confirmada</span>
    <span><span style="display:inline-block;width:12px;height:10px;background:rgba(245,184,0,.7);border-radius:2px;vertical-align:middle;margin-right:4px"></span>Pendiente</span>
    <span><span style="display:inline-block;width:12px;height:10px;background:var(--dark-input);border:1px solid var(--border);border-radius:2px;vertical-align:middle;margin-right:4px"></span>Libre</span>
    <span><span style="display:inline-block;width:12px;height:10px;box-shadow:0 0 0 1px var(--green-neon);border-radius:2px;vertical-align:middle;margin-right:4px"></span>Hora actual</span>
  </div></div></div>`;
  document.getElementById('rptGantt').innerHTML = gantt;

  // ── Resumen de reservas ───────────────────────────────────────────────────
  const estadosRes = [
    { lbl:'Confirmadas', val:conf, color:'var(--green-bright)', icon:'✅' },
    { lbl:'Pendientes',  val:pend, color:'var(--gold)',         icon:'⏳' },
    { lbl:'Canceladas',  val:canc, color:'var(--red)',          icon:'❌' },
  ];
  document.getElementById('rptResumen').innerHTML = estadosRes.map(e => {
    const pct = total ? Math.round((e.val / total) * 100) : 0;
    return `<div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
        <span style="font-size:13px">${e.icon} ${e.lbl}</span>
        <span style="font-size:14px;font-weight:700;color:${e.color}">${e.val} <span style="font-size:11px;color:var(--text-muted);font-weight:400">(${pct}%)</span></span>
      </div>
      <div style="height:8px;background:var(--dark-input);border-radius:5px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${e.color};border-radius:5px;transition:width .4s ease"></div>
      </div>
    </div>`;
  }).join('') + `<div style="padding-top:12px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
    <span style="font-size:12px;color:var(--text-muted)">Total reservas hoy</span>
    <span style="font-family:'Bebas Neue';font-size:28px;color:var(--text-main);line-height:1">${total}</span>
  </div>`;

  // ── Pagos del día ─────────────────────────────────────────────────────────
  const resumen = await apiFetch('/pagos/resumen-hoy');
  const ef = resumen?.efectivo  || 0;
  const ne = resumen?.nequi     || 0;
  const da = resumen?.daviplata || 0;
  const ps = resumen?.pse       || 0;
  const ta = resumen?.tarjeta   || 0;
  const totalPag = ef + ne + da + ps + ta || ingHoy;
  const metodos = [
    { lbl:'Efectivo',  val: ef, icon:'💵', col:'var(--green-bright)' },
    { lbl:'Nequi',     val: ne, icon:'📱', col:'var(--blue)' },
    { lbl:'Daviplata', val: da, icon:'📱', col:'var(--orange)' },
    { lbl:'PSE',       val: ps, icon:'🏦', col:'var(--purple)' },
    { lbl:'Tarjeta',   val: ta, icon:'💳', col:'var(--gold)' },
  ];
  const maxPag = Math.max(...metodos.map(m => m.val), 1);
  document.getElementById('rptPagos').innerHTML = metodos.map(m => {
    const pct = Math.round((m.val / maxPag) * 100);
    return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <span style="font-size:18px;width:24px;flex-shrink:0">${m.icon}</span>
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px">
          <span style="font-size:12px">${m.lbl}</span>
          <span style="font-size:12px;font-weight:700;color:${m.col}">${formatCOP(m.val)}</span>
        </div>
        <div style="height:6px;background:var(--dark-input);border-radius:4px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:${m.col};border-radius:4px;transition:width .4s ease"></div>
        </div>
      </div>
    </div>`;
  }).join('');

  // ── Ingresos por cancha ───────────────────────────────────────────────────
  const ingPC = {};
  const cntPC = {};
  reservasActuales.filter(r => r.estado !== 'cancelada').forEach(r => {
    const k = r.cancha_nombre || 'Sin asignar';
    ingPC[k] = (ingPC[k] || 0) + r.total;
    cntPC[k] = (cntPC[k] || 0) + 1;
  });
  const entries = Object.entries(ingPC).sort((a, b) => b[1] - a[1]);
  const maxIng  = Math.max(...entries.map(e => e[1]), 1);
  const colors  = ['var(--green-bright)','var(--blue)','var(--cyan)','var(--gold)','var(--orange)'];

  document.getElementById('rptIngresosCanchas').innerHTML = entries.length
    ? entries.map(([nombre, ing], i) => {
        const pct = Math.round((ing / maxIng) * 100);
        const cnt = cntPC[nombre] || 0;
        return `<div style="display:flex;align-items:center;gap:16px;margin-bottom:12px">
          <div style="width:80px;font-size:12px;color:var(--text-muted);text-align:right;flex-shrink:0">${safeText(nombre)}</div>
          <div style="flex:1;height:24px;background:var(--dark-input);border-radius:6px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${colors[i % colors.length]};border-radius:6px;display:flex;align-items:center;padding-left:10px;transition:width .5s ease">
              ${pct > 18 ? `<span style="font-size:11px;font-weight:700;color:#000">${formatCOP(ing)}</span>` : ''}
            </div>
          </div>
          <div style="width:100px;flex-shrink:0;text-align:right">
            <span style="font-size:13px;font-weight:700;color:${colors[i % colors.length]}">${formatCOP(ing)}</span>
            <span style="font-size:10px;color:var(--text-muted);display:block">${cnt} reserva${cnt !== 1 ? 's' : ''}</span>
          </div>
        </div>`;
      }).join('')
    : '<div style="padding:24px;text-align:center;color:var(--text-muted)">Sin reservas activas hoy — los datos aparecerán cuando haya reservas confirmadas o pendientes.</div>';
}

async function actualizarReportes() {
  await cargarTodo();
  await renderReportes();
  showToast('Datos actualizados', 'success');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFICACIONES (tiempo real)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Persistir notificaciones leídas en localStorage
function _cargarLeidas() {
  try { return new Set(JSON.parse(localStorage.getItem('notifsLeidas') || '[]')); }
  catch { return new Set(); }
}
function _guardarLeidas() {
  localStorage.setItem('notifsLeidas', JSON.stringify([..._notifsLeidas]));
}

let _notifsLeidas = _cargarLeidas();
let _pollingTimer = null;

const COLOR_MAP = {
  red:    'var(--red)',
  gold:   'var(--gold)',
  green:  'var(--green-bright)',
  blue:   'var(--blue)',
  orange: 'var(--orange)',
};

async function cargarNotificaciones() {
  const data = await apiFetch('/notificaciones');
  if (!data) return;

  // Limpiar refs leídas que ya no existen en la respuesta (notificaciones resueltas)
  const refsActuales = new Set(data.map(n => n.ref));
  let cambio = false;
  for (const ref of _notifsLeidas) {
    if (!refsActuales.has(ref)) { _notifsLeidas.delete(ref); cambio = true; }
  }
  if (cambio) _guardarLeidas();

  const noLeidas = data.filter(n => !n.leida && !_notifsLeidas.has(n.ref));
  const total    = noLeidas.length;

  // Badge del sidebar
  const badge = document.getElementById('badgeNotificaciones');
  const dot   = document.querySelector('.notif-dot');
  if (badge) {
    badge.textContent    = total;
    badge.style.display  = total > 0 ? '' : 'none';
  }
  if (dot) dot.style.display = total > 0 ? '' : 'none';

  // Subtítulo
  const sub = document.getElementById('notifSubtitle');
  if (sub) sub.textContent = total > 0
    ? `${total} notificación${total > 1 ? 'es' : ''} sin leer`
    : 'Todo al día ✓';

  // Lista
  const lista = document.getElementById('listaNotificaciones');
  if (!lista) return;

  if (data.length === 0) {
    lista.innerHTML = `<div style="padding:32px;text-align:center;color:var(--text-muted)">
      <div style="font-size:36px;margin-bottom:12px">✅</div>
      <div style="font-size:14px;font-weight:600">Sin notificaciones pendientes</div>
      <div style="font-size:12px;margin-top:4px">El sistema funciona con normalidad</div>
    </div>`;
    return;
  }

  lista.innerHTML = data.map(n => {
    const leida = n.leida || _notifsLeidas.has(n.ref);
    return `<div class="notif-item ${leida ? '' : 'unread'}" data-ref="${safeText(n.ref)}" onclick="leerNotif(this)">
      <div class="notif-dot-color" style="background:${COLOR_MAP[n.color] || 'var(--blue)'}"></div>
      <div class="notif-info">
        <strong>${safeText(n.titulo)}</strong>
        <span>${safeText(n.mensaje)}</span>
      </div>
      <div class="notif-time">${n.tiempo}</div>
    </div>`;
  }).join('');
}

function leerNotif(el) {
  const ref = el.dataset.ref;
  if (ref) { _notifsLeidas.add(ref); _guardarLeidas(); }
  el.classList.remove('unread');
  // Actualizar badge
  const noLeidas = document.querySelectorAll('.notif-item.unread').length;
  const badge = document.getElementById('badgeNotificaciones');
  const dot   = document.querySelector('.notif-dot');
  if (badge) { badge.textContent = noLeidas; badge.style.display = noLeidas > 0 ? '' : 'none'; }
  if (dot)   dot.style.display = noLeidas > 0 ? '' : 'none';
  const sub = document.getElementById('notifSubtitle');
  if (sub) sub.textContent = noLeidas > 0
    ? `${noLeidas} notificación${noLeidas > 1 ? 'es' : ''} sin leer`
    : 'Todo al día ✓';
}

function marcarTodasLeidas() {
  document.querySelectorAll('.notif-item.unread').forEach(el => {
    const ref = el.dataset.ref;
    if (ref) _notifsLeidas.add(ref);
    el.classList.remove('unread');
  });
  _guardarLeidas();
  const badge = document.getElementById('badgeNotificaciones');
  const dot   = document.querySelector('.notif-dot');
  if (badge) { badge.textContent = 0; badge.style.display = 'none'; }
  if (dot)   dot.style.display = 'none';
  const sub = document.getElementById('notifSubtitle');
  if (sub) sub.textContent = 'Todo al día ✓';
  showToast('Todas las notificaciones marcadas como leídas');
}

function iniciarPollingNotificaciones() {
  cargarNotificaciones();
  // Refresca cada 30 segundos para notificar confirmaciones y cancelaciones rápido
  _pollingTimer = setInterval(cargarNotificaciones, 30000);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TABS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function setTab(el, nombre) {
  el.closest('.tabs').querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function estadoLabel(e) {
  return { confirmada:'Confirmada', pendiente:'Pendiente', cancelada:'Cancelada' }[e] || e;
}

async function cargarConfigNegocio() {
  const cfg = await apiFetch('/config');
  if (!cfg) return;
  const map = {
    cfgNegNombre:   cfg.nombre,
    cfgNegNit:      cfg.nit,
    cfgNegCiudad:   cfg.ciudad,
    cfgNegTelefono: cfg.telefono,
    cfgNegDireccion:cfg.direccion,
    cfgNegHorario:  cfg.horario,
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el && val != null) el.value = val;
  });
}

async function guardarConfigNegocio() {
  const get = id => document.getElementById(id)?.value.trim() || '';
  const body = {
    nombre:   get('cfgNegNombre'),
    nit:      get('cfgNegNit'),
    ciudad:   get('cfgNegCiudad'),
    telefono: get('cfgNegTelefono'),
    direccion:get('cfgNegDireccion'),
    horario:  get('cfgNegHorario'),
  };
  const res = await apiFetch('/config', { method:'PUT', body: JSON.stringify(body) });
  if (res && res.success) {
    showToast('Configuración guardada correctamente', 'success');
  } else {
    showToast(res?.error || 'Error al guardar configuración', 'error');
  }
}

async function guardarPerfilAdmin() {
  const nombre   = document.getElementById('cfgNombreInput')?.value.trim();
  const password = document.getElementById('cfgPassword')?.value;
  const uid      = getUserId();

  if (!nombre) { showToast('El nombre no puede estar vacío', 'error'); return; }

  const body = password ? { nombre, password } : { nombre };
  const res  = await apiFetch(`/clientes/${uid}`, { method:'PUT', body: JSON.stringify(body) });

  if (res && res.success) {
    localStorage.setItem('nombre', nombre);
    document.getElementById('cfgNombre').textContent      = nombre;
    document.getElementById('headerNombre').textContent   = nombre;
    document.getElementById('heroNombre').textContent     = nombre;
    document.getElementById('headerAvatar').textContent   = initiales(nombre);
    document.getElementById('cfgAvatar').textContent      = initiales(nombre);
    if (document.getElementById('cfgPassword')) document.getElementById('cfgPassword').value = '';
    showToast('Perfil actualizado correctamente', 'success');
  } else {
    showToast(res?.error || 'Error al actualizar perfil', 'error');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MODAL COMPARTIDO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _modalCb    = null;
let _editingId  = null;

function abrirModal(titulo, bodyHtml, cb) {
  document.getElementById('modalTitulo').textContent = titulo;
  document.getElementById('modalBody').innerHTML = bodyHtml;
  _modalCb = cb;
  document.getElementById('modalOverlay').classList.add('open');
}

function cerrarModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  _modalCb   = null;
  _editingId = null;
}

function _doGuardar() {
  if (_modalCb) _modalCb();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CANCHAS CRUD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function abrirModalCancha(id) {
  _editingId = id || null;
  const c = id ? canchasActuales.find(x => x.id === id) : null;
  const tipoOpts   = ['Fútbol 5','Fútbol 7','Fútbol 11'];
  const supOpts    = ['Sintética','Natural','Parquet'];
  const estadoOpts = ['disponible','ocupada','mantenimiento'];
  const estadoLabels = { disponible:'Disponible', ocupada:'Ocupada', mantenimiento:'Mantenimiento' };

  const html = `
    <div><label>Nombre</label>
      <input class="input-field" id="mNombre" placeholder="Cancha 1" value="${safeText(c?.nombre || '')}">
    </div>
    <div class="form-grid">
      <div><label>Tipo</label>
        <select class="input-field" id="mTipo">
          ${tipoOpts.map(t => `<option${c?.tipo===t?' selected':''}>${t}</option>`).join('')}
        </select>
      </div>
      <div><label>Superficie</label>
        <select class="input-field" id="mSuperficie">
          ${supOpts.map(s => `<option${c?.superficie===s?' selected':''}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-grid">
      <div><label>Dimensiones</label>
        <input class="input-field" id="mDimensiones" placeholder="30×20m" value="${safeText(c?.dimensiones||'')}">
      </div>
      <div><label>Precio/hora (COP)</label>
        <input class="input-field" id="mPrecio" type="number" placeholder="90000" value="${c?.precio_hora||''}">
      </div>
    </div>
    <div><label>Estado</label>
      <select class="input-field" id="mEstadoC">
        ${estadoOpts.map(e => `<option value="${e}"${c?.estado===e?' selected':''}>${estadoLabels[e]}</option>`).join('')}
      </select>
    </div>
    <div><label>Descripción (opcional)</label>
      <input class="input-field" id="mDescripcion" placeholder="Info adicional" value="${safeText(c?.descripcion||'')}">
    </div>`;

  abrirModal(id ? 'Editar Cancha' : 'Nueva Cancha', html, guardarCancha);
}

async function guardarCancha() {
  const nombre      = document.getElementById('mNombre').value.trim();
  const tipo        = document.getElementById('mTipo').value;
  const superficie  = document.getElementById('mSuperficie').value;
  const dimensiones = document.getElementById('mDimensiones').value.trim();
  const precio_hora = parseFloat(document.getElementById('mPrecio').value);
  const estado      = document.getElementById('mEstadoC').value;
  const descripcion = document.getElementById('mDescripcion').value.trim();

  if (!nombre || !precio_hora) { showToast('Nombre y precio son requeridos', 'error'); return; }

  const body = JSON.stringify({ nombre, tipo, superficie, dimensiones, precio_hora, estado, descripcion });

  if (_editingId) {
    const res = await apiFetch(`/canchas/${_editingId}`, { method:'PUT', body });
    if (res && res.success) {
      const idx = canchasActuales.findIndex(c => c.id === _editingId);
      if (idx >= 0) canchasActuales[idx] = { ...canchasActuales[idx], nombre, tipo, superficie, dimensiones, precio_hora, estado, descripcion };
      showToast('Cancha actualizada correctamente', 'success');
      cerrarModal();
      renderCanchas();
      renderInicio();
    } else { showToast(res?.error || 'Error al actualizar', 'error'); }
  } else {
    const res = await apiFetch('/canchas', { method:'POST', body });
    if (res && res.id) {
      canchasActuales.push({ id:res.id, nombre, tipo, superficie, dimensiones, precio_hora, estado, descripcion });
      showToast('Cancha creada correctamente', 'success');
      cerrarModal();
      renderCanchas();
      renderInicio();
    } else { showToast(res?.error || 'Error al crear cancha', 'error'); }
  }
}

async function cambiarEstadoCancha(id, estado) {
  const res = await apiFetch(`/canchas/${id}/estado`, { method:'PATCH', body: JSON.stringify({ estado }) });
  if (res && res.success) {
    const c = canchasActuales.find(x => x.id === id);
    if (c) c.estado = estado;
    renderCanchas();
    renderInicio();
    if (_seccionActiva() === 'reportes') renderReportes();
    const labels = { disponible:'Disponible', ocupada:'Ocupada', mantenimiento:'Mantenimiento' };
    showToast('Estado actualizado: ' + labels[estado], 'success');
  } else {
    showToast(res?.error || 'Error al cambiar estado', 'error');
    renderCanchas();
  }
}

async function eliminarCancha(id) {
  const cancha = canchasActuales.find(c => c.id === id);
  const nombre = cancha?.nombre || 'esta cancha';
  if (!confirm(`¿Eliminar la cancha "${nombre}"?\nEsta acción no se puede deshacer.`)) return;
  const res = await apiFetch(`/canchas/${id}`, { method:'DELETE' });
  if (res && res.success) {
    canchasActuales = canchasActuales.filter(c => c.id !== id);
    renderCanchas();
    renderInicio();
    showToast(`Cancha "${nombre}" eliminada`);
  } else {
    showToast(res?.error || 'Error al eliminar', 'error');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TORNEOS CRUD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let torneosActuales = [];

function renderTorneos() {
  const activos     = torneosActuales.filter(t => t.estado === 'activo').length;
  const pendientes  = torneosActuales.filter(t => t.estado === 'pendiente').length;
  const finalizados = torneosActuales.filter(t => t.estado === 'finalizado').length;
  set('tornActivos',     activos);
  set('tornPendientes',  pendientes);
  set('tornFinalizados', finalizados);

  const el = document.getElementById('torneosListaReal');
  if (!el) return;

  if (!torneosActuales.length) {
    el.innerHTML = `<div class="card-box"><div class="box-body" style="padding:32px;text-align:center;color:var(--text-muted)">
      <div style="font-size:36px;margin-bottom:10px">🏆</div>
      <div style="font-size:14px;font-weight:600">No hay torneos registrados</div>
      <div style="font-size:12px;margin-top:6px">Crea el primer torneo con el botón "＋ Nuevo Torneo"</div>
    </div></div>`;
    return;
  }

  const estadoClass = { activo:'confirmed', pendiente:'pending', finalizado:'cancelled' };
  const estadoLabel = { activo:'Activo', pendiente:'Pendiente', finalizado:'Finalizado' };
  const tipoLabel   = { liga:'Liga', copa:'Copa', eliminatoria:'Eliminatoria' };

  el.innerHTML = `<div class="card-box"><div class="box-head"><h2>📋 Todos los Torneos</h2></div>
    <table>
      <thead><tr><th>Nombre</th><th>Tipo</th><th>Fecha Inicio</th><th>Fecha Fin</th><th>Inscripción</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody>${torneosActuales.map(t => `<tr>
        <td><b>${safeText(t.nombre)}</b></td>
        <td>${tipoLabel[t.tipo] || safeText(t.tipo)}</td>
        <td>${t.fecha_inicio ? formatFecha(t.fecha_inicio.toString().slice(0, 10)) : '—'}</td>
        <td>${t.fecha_fin   ? formatFecha(t.fecha_fin.toString().slice(0, 10))   : '—'}</td>
        <td style="color:var(--gold)">${t.precio_inscripcion > 0 ? formatCOP(t.precio_inscripcion) : 'Gratuito'}</td>
        <td><span class="pill ${estadoClass[t.estado] || 'pending'}">${estadoLabel[t.estado] || safeText(t.estado)}</span></td>
        <td style="display:flex;gap:6px">
          <button class="btn btn-secondary btn-sm" onclick="editarTorneo(${t.id})">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarTorneo(${t.id})">🗑️</button>
        </td>
      </tr>`).join('')}</tbody>
    </table></div>`;
}

async function eliminarTorneo(id) {
  const torneo = torneosActuales.find(t => t.id === id);
  const nombre = torneo?.nombre || 'este torneo';
  if (!confirm(`¿Eliminar el torneo "${nombre}"?\nEsta acción no se puede deshacer.`)) return;
  const res = await apiFetch(`/torneos/${id}`, { method:'DELETE' });
  if (res && res.success) {
    torneosActuales = torneosActuales.filter(t => t.id !== id);
    renderTorneos();
    showToast(`Torneo "${nombre}" eliminado`);
  } else {
    showToast(res?.error || 'Error al eliminar', 'error');
  }
}

function abrirModalTorneo() {
  const hoy = fechaHoyInput();
  const html = `
    <div><label>Nombre del Torneo</label>
      <input class="input-field" id="mNombreTorneo" placeholder="Liga Barrial Abril">
    </div>
    <div class="form-grid">
      <div><label>Tipo</label>
        <select class="input-field" id="mTipoTorneo">
          <option value="liga">Liga</option>
          <option value="copa">Copa</option>
          <option value="eliminatoria">Eliminatoria</option>
        </select>
      </div>
      <div><label>Estado</label>
        <select class="input-field" id="mEstadoTorneo">
          <option value="activo">Activo</option>
          <option value="pendiente">Pendiente</option>
          <option value="finalizado">Finalizado</option>
        </select>
      </div>
    </div>
    <div class="form-grid">
      <div><label>Fecha Inicio</label>
        <input class="input-field" type="date" id="mFechaInicioT" value="${hoy}">
      </div>
      <div><label>Fecha Fin</label>
        <input class="input-field" type="date" id="mFechaFinT">
      </div>
    </div>
    <div><label>Precio Inscripción (COP)</label>
      <input class="input-field" id="mPrecioInscripcion" type="number" min="0" value="0" placeholder="0">
    </div>`;
  abrirModal('Nuevo Torneo', html, guardarTorneo);
}

async function guardarTorneo() {
  const nombre             = document.getElementById('mNombreTorneo').value.trim();
  const tipo               = document.getElementById('mTipoTorneo').value;
  const estado             = document.getElementById('mEstadoTorneo').value;
  const fechaInicio        = document.getElementById('mFechaInicioT').value;
  const fechaFin           = document.getElementById('mFechaFinT').value;
  const precio_inscripcion = parseInt(document.getElementById('mPrecioInscripcion').value) || 0;

  if (!nombre) { showToast('El nombre del torneo es requerido', 'error'); return; }

  const body = JSON.stringify({ nombre, tipo, fecha_inicio: fechaInicio, fecha_fin: fechaFin, precio_inscripcion, estado });
  const res  = await apiFetch('/torneos', { method:'POST', body });

  if (res && res.id) {
    torneosActuales.push({ id:res.id, nombre, tipo, fecha_inicio:fechaInicio, fecha_fin:fechaFin, precio_inscripcion, estado });
    cerrarModal();
    renderTorneos();
    showToast('Torneo "' + nombre + '" creado correctamente', 'success');
  } else {
    showToast(res?.error || 'Error al crear torneo', 'error');
  }
}

function editarTorneo(id) {
  const t = torneosActuales.find(x => x.id === id);
  if (!t) return;
  const fi = t.fecha_inicio ? t.fecha_inicio.toString().slice(0, 10) : '';
  const ff = t.fecha_fin    ? t.fecha_fin.toString().slice(0, 10)    : '';
  const html = `
    <div><label>Nombre del Torneo</label>
      <input class="input-field" id="mNombreTorneo" value="${safeText(t.nombre)}">
    </div>
    <div class="form-grid">
      <div><label>Tipo</label>
        <select class="input-field" id="mTipoTorneo">
          <option value="liga"${t.tipo==='liga'?' selected':''}>Liga</option>
          <option value="copa"${t.tipo==='copa'?' selected':''}>Copa</option>
          <option value="eliminatoria"${t.tipo==='eliminatoria'?' selected':''}>Eliminatoria</option>
        </select>
      </div>
      <div><label>Estado</label>
        <select class="input-field" id="mEstadoTorneo">
          <option value="activo"${t.estado==='activo'?' selected':''}>Activo</option>
          <option value="pendiente"${t.estado==='pendiente'?' selected':''}>Pendiente</option>
          <option value="finalizado"${t.estado==='finalizado'?' selected':''}>Finalizado</option>
        </select>
      </div>
    </div>
    <div class="form-grid">
      <div><label>Fecha Inicio</label>
        <input class="input-field" type="date" id="mFechaInicioT" value="${fi}">
      </div>
      <div><label>Fecha Fin</label>
        <input class="input-field" type="date" id="mFechaFinT" value="${ff}">
      </div>
    </div>
    <div><label>Precio Inscripción (COP)</label>
      <input class="input-field" id="mPrecioInscripcion" type="number" min="0" value="${t.precio_inscripcion || 0}">
    </div>`;
  _editingId = id;
  abrirModal('Editar Torneo', html, actualizarTorneo);
}

async function actualizarTorneo() {
  const nombre             = document.getElementById('mNombreTorneo').value.trim();
  const tipo               = document.getElementById('mTipoTorneo').value;
  const estado             = document.getElementById('mEstadoTorneo').value;
  const fechaInicio        = document.getElementById('mFechaInicioT').value;
  const fechaFin           = document.getElementById('mFechaFinT').value;
  const precio_inscripcion = parseInt(document.getElementById('mPrecioInscripcion').value) || 0;

  if (!nombre) { showToast('El nombre del torneo es requerido', 'error'); return; }

  const body = JSON.stringify({ nombre, tipo, fecha_inicio: fechaInicio, fecha_fin: fechaFin, precio_inscripcion, estado });
  const res  = await apiFetch(`/torneos/${_editingId}`, { method:'PUT', body });

  if (res && res.success) {
    const t = torneosActuales.find(x => x.id === _editingId);
    if (t) Object.assign(t, { nombre, tipo, fecha_inicio: fechaInicio, fecha_fin: fechaFin, precio_inscripcion, estado });
    cerrarModal();
    renderTorneos();
    showToast(`Torneo "${nombre}" actualizado`, 'success');
  } else {
    showToast(res?.error || 'Error al actualizar torneo', 'error');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MANTENIMIENTO CRUD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function abrirModalTarea() {
  const hoy = fechaHoyInput();
  const canchaOpts = canchasActuales.map(c =>
    `<option value="${c.id}">${safeText(c.nombre)} — ${safeText(c.tipo)}</option>`
  ).join('');
  const html = `
    <div><label>Descripción de la tarea</label>
      <input class="input-field" id="mDescMant" placeholder="Ej: Revisar iluminación nocturna">
    </div>
    <div class="form-grid">
      <div><label>Responsable</label>
        <input class="input-field" id="mRespMant" placeholder="Miguel R.">
      </div>
      <div><label>Cancha</label>
        <select class="input-field" id="mCanchaMant">
          <option value="">General / Todas</option>
          ${canchaOpts}
        </select>
      </div>
    </div>
    <div class="form-grid">
      <div><label>Fecha Programada</label>
        <input class="input-field" type="date" id="mFechaMant" value="${hoy}">
      </div>
      <div><label>Hora</label>
        <input class="input-field" type="time" id="mHoraMant">
      </div>
    </div>
    <div><label>Estado</label>
      <select class="input-field" id="mEstadoMant">
        <option value="pendiente">Pendiente</option>
        <option value="urgente">Urgente</option>
        <option value="en_proceso">En proceso</option>
        <option value="completado">Completado</option>
      </select>
    </div>`;
  abrirModal('Nueva Tarea de Mantenimiento', html, guardarTarea);
}

async function guardarTarea() {
  const descripcion = document.getElementById('mDescMant').value.trim();
  const responsable = document.getElementById('mRespMant').value.trim();
  const canchaId    = document.getElementById('mCanchaMant').value || null;
  const fecha       = document.getElementById('mFechaMant').value;
  const hora        = document.getElementById('mHoraMant').value;
  const estadoDB    = document.getElementById('mEstadoMant').value;

  if (!descripcion) { showToast('La descripción es requerida', 'error'); return; }

  const programado_para = fecha ? (hora ? `${fecha} ${hora}:00` : `${fecha} 00:00:00`) : null;
  const body = JSON.stringify({ descripcion, responsable, cancha_id: canchaId, programado_para, estado: estadoDB });
  const res  = await apiFetch('/mantenimiento', { method:'POST', body });

  if (res && res.id) {
    const canchaNombre = canchaId
      ? (canchasActuales.find(c => c.id == canchaId)?.nombre || 'Cancha')
      : 'General';
    const estadoChecklist = estadoDB === 'urgente' ? 'urgent' : estadoDB === 'completado' ? 'done' : estadoDB === 'en_proceso' ? 'pending' : 'open';
    CHECKLIST_DATA.push({ id: res.id, desc:descripcion, resp:responsable || 'Sin asignar', estado:estadoChecklist, cancha:canchaNombre, hora:hora || '—' });
    renderChecklist();
    cerrarModal();
    showToast('Tarea registrada correctamente', 'success');
  } else {
    showToast(res?.error || 'Error al registrar tarea', 'error');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INVENTARIO CRUD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function abrirModalInventario() {
  const html = `
    <div><label>Nombre del Item</label>
      <input class="input-field" id="mNombreInv" placeholder="Ej: Balones Fútbol 5">
    </div>
    <div class="form-grid">
      <div><label>Categoría</label>
        <select class="input-field" id="mCategoriaInv">
          <option value="Equipamiento">Equipamiento</option>
          <option value="Infraestructura">Infraestructura</option>
          <option value="Seguridad">Seguridad</option>
          <option value="Mantenimiento">Mantenimiento</option>
        </select>
      </div>
      <div><label>Cantidad Actual</label>
        <input class="input-field" id="mCantidadInv" type="number" min="0" value="0">
      </div>
    </div>
    <div><label>Cantidad Mínima (alerta stock)</label>
      <input class="input-field" id="mCantMinInv" type="number" min="1" value="1">
    </div>`;
  abrirModal('Registrar Nuevo Item', html, guardarInventario);
}

async function guardarInventario() {
  const nombre          = document.getElementById('mNombreInv').value.trim();
  const categoria       = document.getElementById('mCategoriaInv').value;
  const cantidad        = parseInt(document.getElementById('mCantidadInv').value || 0);
  const cantidad_minima = parseInt(document.getElementById('mCantMinInv').value || 1);

  if (!nombre) { showToast('El nombre del item es requerido', 'error'); return; }

  const body = JSON.stringify({ nombre, categoria, cantidad, cantidad_minima });
  const res  = await apiFetch('/inventario', { method:'POST', body });

  if (res && res.id) {
    inventarioActual.push({ id:res.id, nombre, categoria, cantidad, cantidad_minima });
    renderInventario();
    cerrarModal();
    showToast('Item registrado: ' + nombre, 'success');
  } else {
    showToast(res?.error || 'Error al registrar item', 'error');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REPORTE DIAN — PDF
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function generarReporteDIAN() {
  showToast('Generando reporte DIAN...', 'info');

  // Cargar jsPDF desde CDN si aún no está disponible
  if (!window.jspdf) {
    try {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
      });
    } catch {
      showToast('Error al cargar librería PDF. Verifica tu conexión.', 'error'); return;
    }
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, PH = 297, M = 10, CW = W - M * 2;

  // ── Datos en tiempo real ──────────────────────────────────────────────────
  const [pagosApi, resumen] = await Promise.all([
    apiFetch('/pagos'),
    apiFetch('/pagos/resumen-hoy'),
  ]);

  const ef = resumen?.efectivo   || 620000;
  const ne = resumen?.nequi      || 280000;
  const da = resumen?.daviplata  || 200000;
  const ps = resumen?.pse        || 360000;
  const ta = resumen?.tarjeta    || 240000;
  const totalHoy = ef + ne + da + ps + ta;

  const conf    = reservasActuales.filter(r => r.estado === 'confirmada').length;
  const pend    = reservasActuales.filter(r => r.estado === 'pendiente').length;
  const canc    = reservasActuales.filter(r => r.estado === 'cancelada').length;
  const ingDia  = reservasActuales.filter(r => r.estado !== 'cancelada').reduce((s, r) => s + r.total, 0);
  const avgRes  = Math.round(ingDia / Math.max(reservasActuales.length - canc, 1));

  // ── Datos financieros del mes (sección Finanzas) ──────────────────────────
  const INGRESOS_MES  = 4200000;
  const GASTOS_OP     = 1100000;
  const BASE_GRAV     = INGRESOS_MES - GASTOS_OP;
  const IMP_RENTA     = Math.round(BASE_GRAV * 0.35);
  const ANTICIPO      = Math.round(BASE_GRAV * 0.035);

  const now    = new Date();
  const MESES  = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const mesLbl = MESES[now.getMonth()] + ' ' + now.getFullYear();
  const hoyLbl = now.toLocaleDateString('es-CO', { day:'2-digit', month:'long', year:'numeric' });

  // ── Paleta de colores ─────────────────────────────────────────────────────
  const AZUL    = [0, 56, 147];
  const CELESTE = [235, 243, 255];
  const FILA_ALT = [242, 246, 255];
  const FILA_TOT = [210, 226, 255];
  const BORDE   = [185, 195, 215];

  let y = 0;

  // ── Helpers ───────────────────────────────────────────────────────────────
  function checkPagina(necesita = 9) {
    if (y + necesita > PH - 14) {
      doc.addPage();
      // Cabecera de continuación
      doc.setFillColor(...AZUL);
      doc.rect(0, 0, W, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.text('DIAN · REPORTE DE INGRESOS Y FACTURACIÓN ELECTRÓNICA — CANCHAS DE FÚTBOL S.A.S · NIT: 900.123.456-7', M, 5.5);
      y = 12;
    }
  }

  function seccion(titulo) {
    checkPagina(10);
    doc.setFillColor(...AZUL);
    doc.rect(M, y, CW, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(titulo, M + 3, y + 5);
    y += 7;
  }

  function fila(etiqueta, valor, esTotal = false, sombreado = false) {
    checkPagina(7);
    const H = 6;
    if (esTotal)        { doc.setFillColor(...FILA_TOT); doc.rect(M, y, CW, H, 'F'); }
    else if (sombreado) { doc.setFillColor(...FILA_ALT); doc.rect(M, y, CW, H, 'F'); }
    doc.setDrawColor(...BORDE);
    doc.setLineWidth(0.15);
    doc.rect(M, y, CW, H, 'S');
    doc.setFont('helvetica', esTotal ? 'bold' : 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(esTotal ? 0 : 40, esTotal ? 0 : 40, esTotal ? 0 : 40);
    doc.text(etiqueta, M + 3, y + 4.2);
    doc.text(valor, W - M - 3, y + 4.2, { align: 'right' });
    y += H;
  }

  // ══ PÁGINA 1 — ENCABEZADO ═════════════════════════════════════════════════
  // Franja bandera Colombia
  doc.setFillColor(252, 209, 22); doc.rect(0, 0, W, 4, 'F');
  doc.setFillColor(0,  55, 165);  doc.rect(0, 4, W, 4, 'F');
  doc.setFillColor(206, 17, 38);  doc.rect(0, 8, W, 4, 'F');

  // Barra DIAN
  doc.setFillColor(...AZUL);
  doc.rect(0, 12, W, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('REPÚBLICA DE COLOMBIA', M, 21);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('DIRECCIÓN DE IMPUESTOS Y ADUANAS NACIONALES — DIAN', M, 27);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DIAN', W - M, 21, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text('Resolución No. 012 · E-Facturación Habilitada', W - M, 27, { align: 'right' });

  y = 38;

  // Título del reporte
  doc.setFillColor(...CELESTE);
  doc.setDrawColor(...AZUL);
  doc.setLineWidth(0.5);
  doc.rect(M, y, CW, 14, 'FD');
  doc.setTextColor(...AZUL);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('REPORTE DE INGRESOS Y FACTURACIÓN ELECTRÓNICA', W / 2, y + 6, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Período gravable: ' + mesLbl + '   ·   Fecha de generación: ' + hoyLbl, W / 2, y + 11, { align: 'center' });
  y += 18;

  // ══ 1. DATOS DEL DECLARANTE ═══════════════════════════════════════════════
  seccion('1. DATOS DEL DECLARANTE');
  [
    ['NIT (Número de Identificación Tributaria):',    '900.123.456-7'],
    ['Razón Social:',                                  'CANCHAS DE FÚTBOL S.A.S'],
    ['Código de Actividad Económica (CIIU):',         '9311 — Gestión de instalaciones deportivas'],
    ['Dirección:',                                     'Calle 45 # 23-10, Bogotá D.C., Colombia'],
    ['Teléfono / Email:',                              '+57 311 234 5678 · admin@canchas.co'],
    ['Régimen tributario:',                            'Responsable de IVA — Régimen Ordinario'],
    ['Tipo de contribuyente:',                         'Persona Jurídica — Sociedad por Acciones Simplificada (S.A.S)'],
  ].forEach(([l, v], i) => fila(l, v, false, i % 2 === 0));
  y += 4;

  // ══ 2. INGRESOS BRUTOS ════════════════════════════════════════════════════
  seccion('2. INGRESOS BRUTOS DEL PERÍODO — ' + mesLbl.toUpperCase());
  [
    ['Arrendamiento de canchas deportivas',            formatCOP(3800000)],
    ['Torneos y eventos deportivos',                   formatCOP(1200000)],
    ['Membresías y suscripciones mensuales',           formatCOP(500000)],
    ['Otros servicios complementarios',                formatCOP(400000)],
    ['TOTAL INGRESOS BRUTOS DEL PERÍODO',              formatCOP(5900000)],
  ].forEach(([l, v], i) => fila(l, v, l.startsWith('TOTAL'), i % 2 === 0));
  y += 4;

  // ══ 3. COSTOS Y DEDUCCIONES ═══════════════════════════════════════════════
  seccion('3. COSTOS Y GASTOS DEDUCIBLES');
  [
    ['Nómina, salarios y prestaciones sociales',       formatCOP(600000)],
    ['Servicios públicos (agua, energía, gas)',        formatCOP(300000)],
    ['Mantenimiento, reparaciones y adecuaciones',     formatCOP(200000)],
    ['TOTAL COSTOS Y DEDUCCIONES',                     formatCOP(GASTOS_OP)],
  ].forEach(([l, v], i) => fila(l, v, l.startsWith('TOTAL'), i % 2 === 0));
  y += 4;

  // ══ 4. LIQUIDACIÓN PRIVADA ════════════════════════════════════════════════
  seccion('4. LIQUIDACIÓN PRIVADA — IMPUESTO DE RENTA (Art. 240 E.T.)');
  [
    ['Ingresos netos del período',                     formatCOP(INGRESOS_MES)],
    ['Menos: Total costos y deducciones',              '(' + formatCOP(GASTOS_OP) + ')'],
    ['Base gravable (Renta líquida)',                  formatCOP(BASE_GRAV)],
    ['Tarifa impuesto de renta',                       '35%'],
    ['Impuesto de renta liquidado',                    formatCOP(IMP_RENTA)],
    ['Menos: Anticipo y retención en la fuente (3.5%)','(' + formatCOP(ANTICIPO) + ')'],
    ['SALDO A PAGAR — IMPUESTO DE RENTA',              formatCOP(IMP_RENTA - ANTICIPO)],
  ].forEach(([l, v], i) => fila(l, v, l.startsWith('SALDO'), i % 2 === 0));
  y += 4;

  // ══ 5. IVA ════════════════════════════════════════════════════════════════
  seccion('5. IMPUESTO A LAS VENTAS — IVA (Art. 476 num. 6 E.T.)');
  [
    ['Régimen IVA servicios deportivos:',              'EXCLUIDO (0%)'],
    ['Fundamento legal:',                              'Art. 476 num. 6 E.T. — Servicios deportivos excluidos de IVA'],
    ['IVA generado en servicios gravados:',            formatCOP(0)],
    ['IVA descontable (compras y gastos):',            formatCOP(0)],
    ['SALDO IVA A PAGAR DEL PERÍODO:',                 formatCOP(0)],
  ].forEach(([l, v], i) => fila(l, v, l.startsWith('SALDO'), i % 2 === 0));
  y += 4;

  // ══ 6. FACTURACIÓN ELECTRÓNICA ════════════════════════════════════════════
  seccion('6. FACTURACIÓN ELECTRÓNICA — PLATAFORMA DIAN');
  [
    ['Resolución de habilitación:',                    'No. 18764000001 de 2022'],
    ['Prefijo autorizado:',                            'FE'],
    ['Rango numérico autorizado:',                     'FE-00000001 a FE-00000500'],
    ['Facturas electrónicas emitidas en el período:',  '182'],
    ['Facturas pendientes de validación DIAN:',        '8'],
    ['Estado integración plataforma DIAN:',            'ACTIVO — CONECTADO'],
    ['Porcentaje de cumplimiento:',                    '95.6%'],
  ].forEach(([l, v], i) => fila(l, v, false, i % 2 === 0));
  y += 4;

  // ══ 7. INGRESOS POR CANCHA ════════════════════════════════════════════════
  seccion('7. INGRESOS POR UNIDAD PRODUCTIVA (CANCHA)');
  const canchaRows = [
    ['Cancha 1 — Fútbol 11 (Superficie Natural)',      formatCOP(1420000)],
    ['Cancha 2 — Fútbol 5  (Superficie Sintética)',    formatCOP(920000)],
    ['Cancha 3 — Fútbol 5  (Superficie Sintética)',    formatCOP(880000)],
    ['Cancha 4 — Fútbol 7  (Superficie Sintética)',    formatCOP(640000)],
    ['Cancha 5 — Fútbol 7  (Superficie Sintética)',    formatCOP(340000)],
    ['TOTAL INGRESOS POR CANCHAS',                     formatCOP(4200000)],
  ];
  canchaRows.forEach(([l, v], i) => fila(l, v, l.startsWith('TOTAL'), i % 2 === 0));
  y += 4;

  // ══ 8. MÉTODOS DE PAGO ════════════════════════════════════════════════════
  seccion('8. DETALLE INGRESOS POR MÉTODO DE PAGO — DÍA ACTUAL');
  [
    ['Efectivo (Caja)',                                formatCOP(ef)],
    ['Nequi (Transferencia móvil)',                    formatCOP(ne)],
    ['Daviplata (Transferencia móvil)',                formatCOP(da)],
    ['PSE / Débito bancario en línea',                 formatCOP(ps)],
    ['Tarjeta de crédito / débito (Dataphone)',        formatCOP(ta)],
    ['TOTAL RECAUDADO HOY',                            formatCOP(totalHoy)],
  ].forEach(([l, v], i) => fila(l, v, l.startsWith('TOTAL'), i % 2 === 0));
  y += 4;

  // ══ 9. RESUMEN OPERATIVO ══════════════════════════════════════════════════
  seccion('9. RESUMEN OPERATIVO — RESERVAS DEL DÍA');
  [
    ['Total reservas registradas hoy:',                String(reservasActuales.length)],
    ['Reservas confirmadas:',                          String(conf)],
    ['Reservas pendientes de confirmación:',           String(pend)],
    ['Reservas canceladas:',                           String(canc)],
    ['Ingresos del día (reservas activas):',           formatCOP(ingDia)],
    ['Ingreso promedio por reserva:',                  formatCOP(avgRes)],
    ['Ingreso promedio diario (últimos 30 días):',     '$140.000'],
    ['Proyección de ingresos del mes:',                '$5.800.000'],
  ].forEach(([l, v], i) => fila(l, v, false, i % 2 === 0));
  y += 6;

  // ══ DECLARACIÓN Y FIRMA ═══════════════════════════════════════════════════
  checkPagina(40);
  doc.setFillColor(250, 252, 255);
  doc.setDrawColor(...AZUL);
  doc.setLineWidth(0.4);
  doc.rect(M, y, CW, 36, 'FD');
  doc.setTextColor(...AZUL);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('DECLARACIÓN DEL CONTRIBUYENTE — ART. 434 ESTATUTO TRIBUTARIO', M + 3, y + 6.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(50, 50, 50);
  [
    'Declaro que los datos e informaciones contenidos en el presente reporte son exactos, verídicos y completos,',
    'y han sido obtenidos de los libros oficiales de contabilidad, conforme a las instrucciones de la DIAN.',
    'El incumplimiento de las obligaciones tributarias genera sanciones establecidas en el Estatuto Tributario.',
  ].forEach((t, i) => doc.text(t, M + 3, y + 13 + i * 5.5));

  // Líneas de firma
  const sY = y + 29;
  doc.setDrawColor(120, 120, 120);
  doc.setLineWidth(0.3);
  doc.line(M + 3, sY, M + 73, sY);
  doc.line(W / 2 + 5, sY, W / 2 + 75, sY);
  doc.setFontSize(6.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Firma Representante Legal / Gerente', M + 3, sY + 4);
  doc.text('Firma Contador Público / Revisor Fiscal', W / 2 + 5, sY + 4);
  y += 42;

  // ══ PIE DE PÁGINA EN TODAS LAS PÁGINAS ════════════════════════════════════
  const totalPags = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPags; p++) {
    doc.setPage(p);
    doc.setFillColor(...AZUL);
    doc.rect(0, PH - 12, W, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.text('Sistema de Gestión Canchas de Fútbol · NIT: 900.123.456-7 · Generado: ' + hoyLbl, M, PH - 5.5);
    doc.text('Página ' + p + ' de ' + totalPags, W - M, PH - 5.5, { align: 'right' });
  }

  // ══ GUARDAR ═══════════════════════════════════════════════════════════════
  doc.save('Reporte_DIAN_' + now.getFullYear() + '_' + fechaHoyInput() + '.pdf');
  showToast('Reporte DIAN generado correctamente', 'success');
}
