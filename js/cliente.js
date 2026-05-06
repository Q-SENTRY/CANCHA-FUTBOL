// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DATOS DE RESPALDO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CANCHAS_CLI = [
  { id:1, nombre:'Cancha 1', tipo:'Fútbol 11', superficie:'Natural',   dimensiones:'100×65m', precio_hora:160000, estado:'ocupada' },
  { id:2, nombre:'Cancha 2', tipo:'Fútbol 5',  superficie:'Sintética', dimensiones:'30×20m',  precio_hora:90000,  estado:'disponible' },
  { id:3, nombre:'Cancha 3', tipo:'Fútbol 5',  superficie:'Sintética', dimensiones:'30×20m',  precio_hora:90000,  estado:'ocupada' },
  { id:4, nombre:'Cancha 4', tipo:'Fútbol 7',  superficie:'Sintética', dimensiones:'50×32m',  precio_hora:110000, estado:'disponible' },
  { id:5, nombre:'Cancha 5', tipo:'Fútbol 7',  superficie:'Sintética', dimensiones:'50×32m',  precio_hora:110000, estado:'mantenimiento' },
];


const NIVELES = [
  { nombre:'Bronce',   min:0,   max:200, color:'#cd7f32', descuento:0,   beneficio:'Acceso básico al sistema' },
  { nombre:'Plata',    min:201, max:500, color:'#c0c0c0', descuento:5,   beneficio:'5% descuento en reservas' },
  { nombre:'Oro',      min:501, max:799, color:'#f5b800', descuento:10,  beneficio:'10% descuento + reserva prioritaria' },
  { nombre:'Diamante', min:800, max:9999,color:'#22d3ee', descuento:15,  beneficio:'15% descuento + 1 hora gratis al mes' },
];

// Estado de reserva (wizard)
const RESERVA_STATE = { canchaId: null, canchaObj: null, fecha: '', hora: '', horaFin: '', duracion: 1, metodo: null, paymentToken: null };

// Mis reservas (en memoria)
let MIS_RESERVAS = [];

let canchasActuales = [...CANCHAS_CLI];
let clienteInfo = { puntos: getPuntos(), nivel: getNivel() };
let _cfgTelefono  = '311 234 5678'; // se sobreescribe con el valor real de config_negocio

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INIT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.addEventListener('DOMContentLoaded', async () => {
  verificarSesion('cliente');

  const nombre = getNombre();
  clienteInfo.puntos = getPuntos();
  clienteInfo.nivel  = getNivel();

  // Header
  document.getElementById('headerNombre').textContent = nombre;
  document.getElementById('headerAvatar').textContent = initiales(nombre);
  document.getElementById('headerNivel').innerHTML = `<span class="nivel-badge ${clienteInfo.nivel}">${nivelIcon(clienteInfo.nivel)} ${clienteInfo.nivel}</span>`;

  // Hero
  document.getElementById('heroTitle').innerHTML = `Bienvenido,<br>${safeText(nombre.split(' ')[0])}`;
  document.getElementById('heroBadge').textContent = fechaHoyTexto().charAt(0).toUpperCase() + fechaHoyTexto().slice(1);
  document.getElementById('heroPuntos').textContent = clienteInfo.puntos;
  document.getElementById('heroNivel').textContent  = clienteInfo.nivel;

  // Sidebar puntos
  document.getElementById('sidebarPuntos').textContent = clienteInfo.puntos;
  document.getElementById('sidebarNivel').innerHTML = `<span class="nivel-badge ${clienteInfo.nivel}">${nivelIcon(clienteInfo.nivel)} ${clienteInfo.nivel}</span>`;
  const niv = getNivelObj(clienteInfo.nivel);
  document.getElementById('sidebarBeneficio').textContent = niv ? niv.beneficio : '';

  // Cargar config del negocio (teléfono para métodos de pago)
  const cfg = await apiFetch('/config');
  if (cfg && cfg.telefono) _cfgTelefono = cfg.telefono;

  // Cargar canchas
  const canchas = await apiFetch('/canchas');
  if (canchas) canchasActuales = canchas;

  // Cargar mis reservas
  const misR = await apiFetch(`/reservas/cliente/${getUserId()}`);
  if (Array.isArray(misR)) MIS_RESERVAS = misR;

  renderInicioCli();
  renderCanchaCards();
  document.getElementById('rFecha').value = fechaHoyInput();
  document.getElementById('rFecha').min   = fechaHoyInput();
  _iniciarPollingCliente();
  window.addEventListener('beforeunload', _detenerPollingCliente);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// POLLING TIEMPO REAL (60s)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let _pollingCli = null;

function _seccionActivaCli() {
  const sec = document.querySelector('.section.active');
  return sec ? sec.id.replace('sec-', '') : 'inicio';
}

function _iniciarPollingCliente() {
  _detenerPollingCliente();

  async function tick() {
    if (!document.hidden) {
      const seccion = _seccionActivaCli();

      const perfil = await apiFetch(`/clientes/${getUserId()}`);
      if (perfil && !perfil.error) {
        const ptsNuevos = perfil.puntos ?? clienteInfo.puntos;
        const nivNuevo  = perfil.nivel  ?? clienteInfo.nivel;
        if (ptsNuevos !== clienteInfo.puntos || nivNuevo !== clienteInfo.nivel) {
          clienteInfo.puntos = ptsNuevos;
          clienteInfo.nivel  = nivNuevo;
          localStorage.setItem('puntos', ptsNuevos);
          localStorage.setItem('nivel',  nivNuevo);
          document.getElementById('sidebarPuntos').textContent = ptsNuevos;
          document.getElementById('sidebarNivel').innerHTML    = `<span class="nivel-badge ${nivNuevo}">${nivelIcon(nivNuevo)} ${nivNuevo}</span>`;
          const nivelObj = getNivelObj(nivNuevo);
          document.getElementById('sidebarBeneficio').textContent = nivelObj ? nivelObj.beneficio : '';
          document.getElementById('headerNivel').innerHTML = `<span class="nivel-badge ${nivNuevo}">${nivelIcon(nivNuevo)} ${nivNuevo}</span>`;
        }
        if (seccion === 'puntos')  renderPuntos();
        if (seccion === 'perfil')  renderPerfil();
      }

      const canchas = await apiFetch('/canchas');
      if (canchas && Array.isArray(canchas)) {
        canchasActuales = canchas;
        renderCanchaCards();
        if (seccion === 'inicio' || seccion === 'reservar') renderInicioCli();
      }

      const misR = await apiFetch(`/reservas/cliente/${getUserId()}`);
      if (misR && Array.isArray(misR)) {
        MIS_RESERVAS = misR;
        renderInicioCli();
        if (seccion === 'misreservas') renderMisReservas();
      }
    }

    // 5s si hay reservas pendientes (espera confirmación), 15s si no
    const hasPending = MIS_RESERVAS.some(r => r.estado === 'pendiente');
    _pollingCli = setTimeout(tick, hasPending ? 5000 : 15000);
  }

  _pollingCli = setTimeout(tick, 5000);
}

function _detenerPollingCliente() {
  if (_pollingCli) { clearTimeout(_pollingCli); _pollingCli = null; }
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
  if (id === 'misreservas') renderMisReservas();
  if (id === 'puntos')      renderPuntos();
  if (id === 'perfil')      renderPerfil();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INICIO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderInicioCli() {
  const total = MIS_RESERVAS.length;
  const pts   = clienteInfo.puntos;

  document.getElementById('heroMisReservas').textContent = total;
  document.getElementById('statPuntos').textContent      = pts;
  document.getElementById('statNivelSub').textContent    = 'Nivel ' + clienteInfo.nivel;

  // Próxima reserva
  const hoy = fechaHoyInput();
  const proxima = MIS_RESERVAS.find(r => r.fecha >= hoy && r.estado !== 'cancelada');
  if (proxima) {
    document.getElementById('proximaReservaCard').textContent = proxima.cancha_nombre;
    document.getElementById('proximaFecha').textContent = formatFecha(proxima.fecha) + ' · ' + formatHora(proxima.hora_inicio);
  } else {
    document.getElementById('proximaReservaCard').textContent = '—';
    document.getElementById('proximaFecha').textContent = 'Sin reservas próximas';
  }

  // Canchas hoy
  const statusMap = { disponible:{ cls:'free', lbl:'ok', txt:'Disponible' }, ocupada:{ cls:'busy', lbl:'busy', txt:'Ocupada' }, mantenimiento:{ cls:'maint', lbl:'maint', txt:'Mantenimiento' } };
  document.getElementById('canchasInicio').innerHTML = canchasActuales.map(c => {
    const s = statusMap[c.estado];
    const topCls = { disponible:'green', ocupada:'red', mantenimiento:'yellow' }[c.estado];
    const canReservar = c.estado === 'disponible';
    return `<div class="court-card">
      <div class="court-top ${topCls}"><div class="court-field"></div></div>
      <div class="court-body"><strong>${safeText(c.nombre)} — ${safeText(c.tipo)}</strong><span>${safeText(c.superficie)} · ${safeText(c.dimensiones)}</span></div>
      <div class="court-footer">
        <span class="court-status ${s.cls}">${s.txt}</span>
        <div style="display:flex;align-items:center;gap:10px">
          <span class="court-price">${formatCOP(c.precio_hora)}/h</span>
          ${canReservar ? `<button class="btn btn-primary btn-sm" onclick="reservarDirecto(${c.id})">Reservar</button>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');
}

function reservarDirecto(canchaId) {
  RESERVA_STATE.canchaId  = canchaId;
  RESERVA_STATE.canchaObj = canchasActuales.find(c => c.id === canchaId);
  goTo('reservar');
  irPaso1();
  // Las cards ya están en el DOM — seleccionar directamente
  selCancha(canchaId);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WIZARD DE RESERVA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderCanchaCards() {
  const statusMap = { disponible:{ lbl:'ok', txt:'✓ Disponible' }, ocupada:{ lbl:'busy', txt:'✗ Ocupada' }, mantenimiento:{ lbl:'maint', txt:'⚠ Mantenimiento' } };
  const motivo    = { ocupada:'Esta cancha está ocupada en este momento', mantenimiento:'Esta cancha está en mantenimiento' };
  document.getElementById('canchaCards').innerHTML = canchasActuales.map(c => {
    const s = statusMap[c.estado];
    const disabled = c.estado !== 'disponible';
    const clickAttr = disabled
      ? `onclick="showToast('${motivo[c.estado] || 'No disponible'}', 'info')" style="cursor:not-allowed"`
      : `onclick="selCancha(${c.id})"`;
    return `<div class="cancha-select-card${disabled ? ' disabled' : ''}" data-id="${c.id}" ${clickAttr} title="${disabled ? (motivo[c.estado] || '') : ''}">
      <div class="c-icon">⚽</div>
      <div class="c-name">${safeText(c.nombre)}</div>
      <div class="c-type">${safeText(c.tipo)} · ${safeText(c.superficie)}</div>
      <div class="c-price">${formatCOP(c.precio_hora)}/h</div>
      <div class="c-status ${s.lbl}">${s.txt}</div>
    </div>`;
  }).join('');

  if (RESERVA_STATE.canchaId) {
    const card = document.querySelector(`.cancha-select-card[data-id="${RESERVA_STATE.canchaId}"]`);
    if (card) { card.classList.add('selected'); document.getElementById('btnPaso2').disabled = false; }
  }
}

function selCancha(id) {
  RESERVA_STATE.canchaId  = id;
  RESERVA_STATE.canchaObj = canchasActuales.find(c => c.id === id);
  document.querySelectorAll('.cancha-select-card').forEach(el => el.classList.remove('selected'));
  document.querySelector(`.cancha-select-card[data-id="${id}"]`).classList.add('selected');
  document.getElementById('btnPaso2').disabled = false;
}

function setStep(n) {
  [1,2,3].forEach(i => {
    const el = document.getElementById(`step${i}El`);
    el.classList.remove('active','done');
    if (i < n)  el.classList.add('done');
    if (i === n) el.classList.add('active');
  });
}

function irPaso1() {
  setStep(1);
  show('paso1'); hide('paso2'); hide('paso3'); hide('pasoExito');
}

function irPaso2() {
  if (!RESERVA_STATE.canchaId) { showToast('Selecciona una cancha primero', 'error'); return; }
  setStep(2);
  const c = RESERVA_STATE.canchaObj;
  document.getElementById('p2CanchaName').textContent = `${c.nombre} — ${c.tipo}`;
  document.getElementById('p2CanchaInfo').textContent = `${c.superficie} · ${c.dimensiones}`;
  document.getElementById('p2Precio').textContent     = formatCOP(c.precio_hora);

  const hoy = fechaHoyInput();
  const fechaEl = document.getElementById('rFecha');
  fechaEl.min   = hoy;
  if (!fechaEl.value || fechaEl.value < hoy) fechaEl.value = hoy;
  RESERVA_STATE.fecha = fechaEl.value;
  inicializarHoras(fechaEl.value);

  // Restaurar método si ya fue seleccionado
  if (RESERVA_STATE.metodo) {
    const card = document.querySelector(`.metodo-card[data-m="${RESERVA_STATE.metodo}"]`);
    if (card) card.classList.add('selected');
  }

  show('paso2'); hide('paso1'); hide('paso3'); hide('pasoExito');
}

async function irPaso3() {
  const fecha  = document.getElementById('rFecha').value;
  const hora   = document.getElementById('rHora').value;
  const horaFin = document.getElementById('rHoraFin').value;

  RESERVA_STATE.fecha = fecha;

  // Validar fecha
  if (!fecha || fecha < fechaHoyInput()) {
    document.getElementById('fechaError').textContent = '⚠ Selecciona una fecha válida (hoy o posterior).';
    showToast('Fecha inválida', 'error'); return;
  }
  // Validar hora pasada si es hoy
  if (fecha === fechaHoyInput()) {
    const ahora = new Date();
    const horaNum = parseInt(hora.split(':')[0]);
    if (horaNum <= ahora.getHours()) {
      document.getElementById('horaError').textContent = '⚠ La hora de inicio ya pasó. Elige una hora futura.';
      showToast('Hora inválida', 'error'); return;
    }
  }
  document.getElementById('horaError').textContent = '';

  // Validar duración
  const duracion = RESERVA_STATE.duracion;
  if (!duracion || duracion < 1) {
    showToast('Selecciona hora de inicio y finalización', 'error'); return;
  }

  // Validar método de pago
  if (!RESERVA_STATE.metodo) {
    document.getElementById('metodoError').textContent = 'Selecciona un método de pago.';
    showToast('Selecciona un método de pago', 'error'); return;
  }
  if (!validarPago()) return;

  setStep(3);
  const c    = RESERVA_STATE.canchaObj;
  const desc = getDescuento();
  const total = Math.round(c.precio_hora * duracion * (1 - desc / 100));
  const pts   = Math.floor(total / 10000);

  const metodoLabels = { efectivo:'💵 Efectivo', nequi:'📱 Nequi', daviplata:'📱 Daviplata', pse:'🏦 PSE', tarjeta:'💳 Tarjeta' };
  document.getElementById('r3Cancha').textContent   = c.nombre;
  document.getElementById('r3Tipo').textContent     = c.tipo;
  document.getElementById('r3Fecha').textContent    = formatFecha(fecha);
  document.getElementById('r3Hora').textContent     = `${hora} – ${horaFin}`;
  document.getElementById('r3Duracion').textContent = duracion + ' hora' + (duracion > 1 ? 's' : '');
  document.getElementById('r3Metodo').textContent   = metodoLabels[RESERVA_STATE.metodo];
  document.getElementById('r3Total').textContent    = formatCOP(total);
  document.getElementById('r3Puntos').textContent   = '+' + pts;

  const refEl = document.getElementById('r3PagoRef');
  if (refEl) refEl.textContent = RESERVA_STATE.paymentToken || '—';

  const descInfo = document.getElementById('descuentoInfo');
  if (desc > 0) {
    const ahorro = Math.round(c.precio_hora * duracion * desc / 100);
    descInfo.style.display = 'block';
    descInfo.textContent   = `🎉 Descuento ${clienteInfo.nivel}: ${desc}% aplicado — Ahorras ${formatCOP(ahorro)}`;
  } else {
    descInfo.style.display = 'none';
  }

  show('paso3'); hide('paso1'); hide('paso2'); hide('pasoExito');
}

async function confirmarReservaCliente() {
  const c = RESERVA_STATE.canchaObj;

  // No se envía total — el servidor lo calcula con el precio real y el nivel real del usuario
  const body = {
    cliente_id:     getUserId(),
    cancha_id:      RESERVA_STATE.canchaId,
    fecha:          RESERVA_STATE.fecha,
    hora_inicio:    RESERVA_STATE.hora + ':00',
    duracion_horas: RESERVA_STATE.duracion,
    tipo:           'partido_libre',
    metodo_pago:    RESERVA_STATE.metodo,
  };

  const btn = document.getElementById('btnConfirmarReserva');
  if (btn) { btn.disabled = true; btn.textContent = 'Procesando…'; }

  const data = await apiFetch('/reservas', { method:'POST', body: JSON.stringify(body) });

  if (btn) { btn.disabled = false; btn.textContent = '⚽ Confirmar Reserva'; }

  if (!data || data.error) {
    showToast(data?.error || 'Error al guardar la reserva. Intenta de nuevo.', 'error');
    return;
  }

  // Usar valores autorizados devueltos por el servidor
  const totalReal  = data.total;
  const ptsGanados = data.puntosGanados;
  const nivelReal  = data.nivel;

  clienteInfo.puntos += ptsGanados;
  localStorage.setItem('puntos', clienteInfo.puntos);

  // Actualizar nivel si el servidor reporta uno distinto al actual
  if (nivelReal && nivelReal !== clienteInfo.nivel) {
    clienteInfo.nivel = nivelReal;
    localStorage.setItem('nivel', nivelReal);
    document.getElementById('headerNivel').innerHTML = `<span class="nivel-badge ${nivelReal}">${nivelIcon(nivelReal)} ${nivelReal}</span>`;
    document.getElementById('sidebarNivel').innerHTML = `<span class="nivel-badge ${nivelReal}">${nivelIcon(nivelReal)} ${nivelReal}</span>`;
    const nivelObj = getNivelObj(nivelReal);
    document.getElementById('sidebarBeneficio').textContent = nivelObj ? nivelObj.beneficio : '';
  }

  document.getElementById('sidebarPuntos').textContent = clienteInfo.puntos;

  const nueva = {
    id: data.id,
    cancha_nombre: c.nombre, cancha_tipo: c.tipo,
    fecha: RESERVA_STATE.fecha, hora_inicio: RESERVA_STATE.hora + ':00',
    duracion_horas: RESERVA_STATE.duracion, total: totalReal, estado:'pendiente',
    metodo_pago: RESERVA_STATE.metodo,
  };
  MIS_RESERVAS.unshift(nueva);

  // Mostrar éxito con valores del servidor
  const descuento = data.descuento || 0;
  const numId = '#' + String(data.id).padStart(4, '0');
  document.getElementById('numReserva').textContent = numId;
  document.getElementById('exitoDetalle').innerHTML =
    `${safeText(c.nombre)} · ${safeText(c.tipo)}<br>`
    + `${formatFecha(RESERVA_STATE.fecha)} · ${RESERVA_STATE.hora} – ${RESERVA_STATE.horaFin}<br>`
    + `${RESERVA_STATE.duracion}h · ${formatCOP(totalReal)}`
    + (descuento > 0 ? ` <span style="color:var(--green-bright)">(${descuento}% desc.)</span>` : '')
    + `<br><span style="color:var(--gold)">+${ptsGanados} puntos ganados ⭐</span>`;

  setStep(3);
  hide('paso3'); show('pasoExito');
  renderInicioCli();
}

function nuevaReserva() {
  RESERVA_STATE.canchaId = null; RESERVA_STATE.canchaObj = null;
  document.querySelectorAll('.cancha-select-card').forEach(el => el.classList.remove('selected'));
  document.getElementById('btnPaso2').disabled = true;
  irPaso1();
}

function calcularResumen() {} // legacy — se usa calcularDuracion()

// ── Horas disponibles ────────────────────────────────────────────────────
function inicializarHoras(fecha) {
  const ahora   = new Date();
  const esHoy   = fecha === fechaHoyInput();
  const horaMin = esHoy ? ahora.getHours() + 1 : 8; // al menos 1h desde ahora

  const rHora = document.getElementById('rHora');
  rHora.innerHTML = '';
  for (let h = Math.max(8, horaMin); h <= 22; h++) {
    const v = String(h).padStart(2,'0') + ':00';
    rHora.innerHTML += `<option value="${v}">${v}</option>`;
  }
  if (!rHora.options.length) {
    rHora.innerHTML = '<option value="" disabled selected>Sin horas disponibles hoy</option>';
    document.getElementById('horaError').textContent = '⚠ No hay horas disponibles para hoy. Elige otro día.';
  } else {
    document.getElementById('horaError').textContent = '';
  }
  actualizarHorasFin();
}

function actualizarHorasFin() {
  const rHora   = document.getElementById('rHora');
  const rHoraFin = document.getElementById('rHoraFin');
  if (!rHora.value) return;
  const hI = parseInt(rHora.value.split(':')[0]);
  rHoraFin.innerHTML = '';
  for (let h = hI + 1; h <= 23; h++) {
    const v = String(h).padStart(2,'0') + ':00';
    rHoraFin.innerHTML += `<option value="${v}">${v}</option>`;
  }
  calcularDuracion();
}

function calcularDuracion() {
  const hora    = document.getElementById('rHora')?.value;
  const horaFin = document.getElementById('rHoraFin')?.value;
  if (!hora || !horaFin) return;

  const hI  = parseInt(hora.split(':')[0]);
  const hF  = parseInt(horaFin.split(':')[0]);
  const dur = hF - hI;

  RESERVA_STATE.hora    = hora;
  RESERVA_STATE.horaFin = horaFin;
  RESERVA_STATE.duracion = dur;

  const c = RESERVA_STATE.canchaObj;
  const chip = document.getElementById('duracionChip');
  if (c && dur > 0) {
    const desc  = getDescuento();
    const total = Math.round(c.precio_hora * dur * (1 - desc / 100));
    chip.style.display = 'flex';
    document.getElementById('duracionTexto').textContent = `${dur} hora${dur > 1 ? 's' : ''} · ${hora} – ${horaFin}`;
    document.getElementById('duracionPrecio').textContent = formatCOP(total);
    onFechaHoraChange();
  } else {
    chip.style.display = 'none';
  }
}

// ── Eventos fecha/hora ───────────────────────────────────────────────────
function onFechaCambio() {
  const fecha  = document.getElementById('rFecha').value;
  const hoy    = fechaHoyInput();
  const errEl  = document.getElementById('fechaError');
  if (!fecha) return;
  if (fecha < hoy) {
    errEl.textContent = '⚠ No puedes reservar en fechas pasadas.';
    document.getElementById('rFecha').value = hoy;
    RESERVA_STATE.fecha = hoy;
    inicializarHoras(hoy);
    return;
  }
  errEl.textContent = '';
  RESERVA_STATE.fecha = fecha;
  inicializarHoras(fecha);
  onFechaHoraChange();
}

function onHoraInicioCambio() {
  document.getElementById('horaError').textContent = '';
  actualizarHorasFin();
  onFechaHoraChange();
}

function onHoraFinCambio() {
  calcularDuracion();
}

async function onFechaHoraChange() {
  const canchaId = RESERVA_STATE.canchaId;
  const fecha    = document.getElementById('rFecha')?.value;
  const hora     = document.getElementById('rHora')?.value;
  const dur      = RESERVA_STATE.duracion;
  const el       = document.getElementById('disponMsg');
  if (!canchaId || !fecha || !hora || dur < 1) return;

  el.innerHTML = '<div class="avail-checking"><div class="spinner"></div>Verificando disponibilidad...</div>';
  const data = await apiFetch(`/reservas/disponibilidad?cancha_id=${canchaId}&fecha=${fecha}&hora_inicio=${hora}:00&duracion=${dur}`);
  const libre = !data || data.disponible;
  el.innerHTML = libre
    ? '<div class="avail-ok">✓ Horario disponible</div>'
    : '<div class="avail-no">✗ Este horario ya está ocupado. Elige otro.</div>';
  const btn3 = document.getElementById('btnPaso3');
  if (btn3) btn3.disabled = !libre;
}

// ── Métodos de pago ──────────────────────────────────────────────────────
function selMetodo(m) {
  RESERVA_STATE.metodo       = m;
  RESERVA_STATE.paymentToken = null;
  document.querySelectorAll('.metodo-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`.metodo-card[data-m="${m}"]`).classList.add('selected');
  document.getElementById('metodoError').textContent = '';
  renderPagoFlow(m);
}

function renderPagoFlow(m) {
  const el  = document.getElementById('pagoFlow');
  const c   = RESERVA_STATE.canchaObj;
  const dur = RESERVA_STATE.duracion || 1;
  const total = c ? Math.round(c.precio_hora * dur * (1 - getDescuento() / 100)) : 0;

  if (m === 'efectivo') {
    el.innerHTML = `
      <div class="pago-flow-box">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
          <span style="font-size:28px">💵</span>
          <div><div style="font-size:14px;font-weight:700">Pago en efectivo</div>
          <div style="font-size:12px;color:var(--text-muted)">Cancela al llegar al establecimiento</div></div>
        </div>
        <div style="background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.15);border-radius:10px;padding:14px;font-size:13px;line-height:2">
          ✅ Presenta el <b>número de reserva</b> en caja antes de tu hora de inicio.<br>
          📍 Llega <b>15 minutos antes</b> para completar el pago.<br>
          ⚠️ La reserva se libera automáticamente si no pagas en <b>30 minutos</b>.
        </div>
      </div>`;
    RESERVA_STATE.paymentToken = 'EFECTIVO';

  } else if (m === 'nequi' || m === 'daviplata') {
    const nombre = m === 'nequi' ? 'Nequi' : 'Daviplata';
    el.innerHTML = `
      <div class="pago-flow-box">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <span style="font-size:28px">📱</span>
          <div><div style="font-size:14px;font-weight:700">Pago por ${nombre}</div>
          <div style="font-size:12px;color:var(--text-muted)">Transfiere al número registrado</div></div>
        </div>
        <div style="background:rgba(245,184,0,.08);border:1px solid rgba(245,184,0,.2);border-radius:10px;padding:16px;margin-bottom:16px;text-align:center">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">Número ${nombre}</div>
          <div style="font-family:'Bebas Neue';font-size:30px;color:var(--gold);letter-spacing:4px">${_cfgTelefono}</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:6px">Monto exacto: <b style="color:var(--text-main);font-size:15px">${formatCOP(total)}</b></div>
        </div>
        <div>
          <label>Número de referencia de la transferencia</label>
          <input class="input-field" id="refTransferencia" placeholder="Ej: 1234567890" maxlength="20" inputmode="numeric">
          <div class="field-error" id="refError"></div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px">Es el número que ${nombre} te envió al confirmar la transacción.</div>
        </div>
      </div>`;

  } else if (m === 'pse') {
    const bancos = ['Bancolombia','Banco de Bogotá','Davivienda','BBVA Colombia','Banco Popular','Banco Colpatria','Banco de Occidente','Itaú','Scotiabank','Banco Caja Social'];
    el.innerHTML = `
      <div class="pago-flow-box">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <span style="font-size:28px">🏦</span>
          <div><div style="font-size:14px;font-weight:700">Pago PSE</div>
          <div style="font-size:12px;color:var(--text-muted)">Débito bancario en línea</div></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div>
            <label>Banco</label>
            <select class="input-field" id="pseBanco">
              <option value="">— Selecciona tu banco —</option>
              ${bancos.map(b => `<option>${b}</option>`).join('')}
            </select>
            <div class="field-error" id="pseError"></div>
          </div>
          <div>
            <label>Tipo de persona</label>
            <select class="input-field" id="pseTipo">
              <option value="natural">Persona Natural</option>
              <option value="juridica">Persona Jurídica</option>
            </select>
          </div>
        </div>
        <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:16px" id="btnPSE" onclick="simularPSE()">
          🏦 Continuar con mi banco — ${formatCOP(total)}
        </button>
        <div class="security-note">
          🔒 Serás redirigido a la pasarela segura <b>ACH Colombia (PSE)</b>. Tu información bancaria <b>nunca pasa por nuestros servidores</b>.
        </div>
      </div>`;

  } else if (m === 'tarjeta') {
    el.innerHTML = `
      <div class="pago-flow-box">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <span style="font-size:28px">💳</span>
          <div><div style="font-size:14px;font-weight:700">Tarjeta de crédito / débito</div>
          <div style="font-size:12px;color:var(--text-muted)">Visa · Mastercard · Amex</div></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px">
          <div>
            <label>Número de tarjeta</label>
            <div class="card-input-wrap">
              <input class="input-field" id="cardNum" placeholder="0000 0000 0000 0000"
                maxlength="19" inputmode="numeric" autocomplete="cc-number"
                oninput="formatCardNum(this)">
              <span class="card-brand" id="cardBrand"></span>
            </div>
            <div class="field-error" id="cardNumError"></div>
          </div>
          <div>
            <label>Nombre del titular</label>
            <input class="input-field" id="cardName" placeholder="Como aparece en la tarjeta"
              autocomplete="cc-name" oninput="this.value=this.value.toUpperCase()">
            <div class="field-error" id="cardNameError"></div>
          </div>
          <div class="form-grid" style="grid-template-columns:1fr 1fr;gap:14px">
            <div>
              <label>Vencimiento (MM/AA)</label>
              <input class="input-field" id="cardExp" placeholder="MM/AA" maxlength="5"
                inputmode="numeric" autocomplete="cc-exp" oninput="formatCardExp(this)">
              <div class="field-error" id="cardExpError"></div>
            </div>
            <div>
              <label>CVV</label>
              <input class="input-field" type="password" id="cardCvv" placeholder="•••"
                maxlength="4" inputmode="numeric" autocomplete="cc-csc">
              <div class="field-error" id="cardCvvError"></div>
            </div>
          </div>
        </div>
        <div class="security-note">
          🔒 Cifrado <b>TLS 1.3</b> extremo a extremo. Los datos de tu tarjeta son procesados por una pasarela <b>PCI-DSS nivel 1</b> certificada y <b>nunca se almacenan</b> en nuestros servidores.
        </div>
      </div>`;
  }
}

// ── PSE simulado ─────────────────────────────────────────────────────────
function simularPSE() {
  const banco = document.getElementById('pseBanco')?.value;
  const errEl = document.getElementById('pseError');
  if (!banco) { errEl.textContent = 'Selecciona tu banco.'; return; }
  errEl.textContent = '';
  const btn = document.getElementById('btnPSE');
  btn.disabled = true;
  btn.textContent = `⏳ Conectando con ${banco}...`;
  setTimeout(() => {
    RESERVA_STATE.paymentToken = 'PSE-' + Date.now();
    btn.textContent      = `✅ Autorizado con ${banco}`;
    btn.style.background = 'var(--green-bright)';
    btn.style.color      = '#000';
    showToast(`Pago PSE autorizado — ${banco}`, 'success');
  }, 2200);
}

// ── Validación de pago ───────────────────────────────────────────────────
function validarPago() {
  const m = RESERVA_STATE.metodo;
  if (m === 'efectivo') return true;

  if (m === 'nequi' || m === 'daviplata') {
    const ref = document.getElementById('refTransferencia')?.value.trim();
    const errEl = document.getElementById('refError');
    if (!ref || ref.length < 5) {
      errEl.textContent = 'Ingresa el número de referencia de la transferencia.';
      showToast('Ingresa la referencia de la transferencia', 'error'); return false;
    }
    errEl.textContent = '';
    RESERVA_STATE.paymentToken = ref;
    return true;
  }

  if (m === 'pse') {
    if (!RESERVA_STATE.paymentToken) {
      showToast('Completa la autorización PSE primero', 'error'); return false;
    }
    return true;
  }

  if (m === 'tarjeta') return validarTarjeta();
  return true;
}

function validarTarjeta() {
  let ok = true;

  const numRaw = document.getElementById('cardNum')?.value.replace(/\s/g, '');
  const errNum = document.getElementById('cardNumError');
  if (!numRaw || numRaw.length < 13) {
    errNum.textContent = 'Número de tarjeta incompleto.'; ok = false;
  } else if (!luhnCheck(numRaw)) {
    errNum.textContent = 'Número de tarjeta inválido.'; ok = false;
  } else {
    errNum.textContent = '';
    RESERVA_STATE.paymentToken = '**** **** **** ' + numRaw.slice(-4);
  }

  const name = document.getElementById('cardName')?.value.trim();
  const errName = document.getElementById('cardNameError');
  if (!name || name.length < 3) {
    errName.textContent = 'Ingresa el nombre del titular.'; ok = false;
  } else { errName.textContent = ''; }

  const exp   = document.getElementById('cardExp')?.value;
  const errExp = document.getElementById('cardExpError');
  if (!exp || exp.length < 5) {
    errExp.textContent = 'Ingresa la fecha de vencimiento (MM/AA).'; ok = false;
  } else {
    const [mm, yy] = exp.split('/').map(Number);
    const hoy = new Date();
    const expDate = new Date(2000 + yy, mm - 1, 1);
    if (mm < 1 || mm > 12 || expDate < new Date(hoy.getFullYear(), hoy.getMonth(), 1)) {
      errExp.textContent = 'La tarjeta está vencida.'; ok = false;
    } else { errExp.textContent = ''; }
  }

  const cvv = document.getElementById('cardCvv')?.value;
  const errCvv = document.getElementById('cardCvvError');
  if (!cvv || cvv.length < 3) {
    errCvv.textContent = 'CVV inválido (mínimo 3 dígitos).'; ok = false;
  } else { errCvv.textContent = ''; }

  return ok;
}

// ── Utilidades de tarjeta ─────────────────────────────────────────────────
function formatCardNum(input) {
  const raw = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = raw.replace(/(.{4})/g, '$1 ').trim();
  const brand = document.getElementById('cardBrand');
  if (brand) {
    if      (raw.startsWith('4'))                       brand.textContent = 'VISA';
    else if (raw.match(/^5[1-5]/))                      brand.textContent = 'MC';
    else if (raw.startsWith('34') || raw.startsWith('37')) brand.textContent = 'AMEX';
    else brand.textContent = '';
  }
  // Validación en vivo
  const errEl = document.getElementById('cardNumError');
  if (errEl && raw.length === 16) {
    errEl.textContent = luhnCheck(raw) ? '' : 'Número de tarjeta inválido.';
  }
}

function formatCardExp(input) {
  const raw = input.value.replace(/\D/g, '').substring(0, 4);
  input.value = raw.length >= 3 ? raw.substring(0,2) + '/' + raw.substring(2) : raw;
}

function luhnCheck(num) {
  const digits = num.split('').reverse().map(Number);
  let sum = 0;
  digits.forEach((d, i) => {
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  });
  return sum % 10 === 0;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MIS RESERVAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderMisReservas(filtro = 'todas') {
  const hoy = fechaHoyInput();
  let lista = [...MIS_RESERVAS];
  if (filtro === 'proximas')   lista = lista.filter(r => r.fecha >= hoy && r.estado !== 'cancelada');
  if (filtro === 'pasadas')    lista = lista.filter(r => r.fecha < hoy  && r.estado !== 'cancelada');
  if (filtro === 'canceladas') lista = lista.filter(r => r.estado === 'cancelada');

  const conf = MIS_RESERVAS.filter(r => r.estado === 'confirmada').length;
  const pend = MIS_RESERVAS.filter(r => r.estado === 'pendiente').length;
  document.getElementById('mrConf').textContent  = conf;
  document.getElementById('mrPend').textContent  = pend;
  document.getElementById('mrTotal').textContent = MIS_RESERVAS.length;

  if (!lista.length) {
    document.getElementById('tablaMisReservas').innerHTML = '<div style="padding:32px;text-align:center;color:var(--text-muted)">No hay reservas en esta categoría</div>';
    return;
  }

  const rows = lista.map(r => {
    const esFutura = r.fecha >= hoy && r.estado !== 'cancelada';
    return `<tr>
      <td><b>${safeText(r.cancha_nombre)}</b><br><span style="font-size:11px;color:var(--text-muted)">${safeText(r.cancha_tipo)}</span></td>
      <td>${formatFecha(r.fecha)}</td>
      <td>${formatHora(r.hora_inicio)}<br><span style="font-size:11px;color:var(--text-muted)">${r.duracion_horas}h</span></td>
      <td style="color:var(--gold)">${formatCOP(r.total)}</td>
      <td><span class="pill ${r.estado==='confirmada'?'confirmed':r.estado==='pendiente'?'pending':'cancelled'}">${estadoLbl(r.estado)}</span></td>
      <td>${esFutura ? `<button class="btn btn-danger btn-sm" onclick="cancelarReserva(${r.id})">Cancelar</button>` : ''}</td>
    </tr>`;
  }).join('');
  document.getElementById('tablaMisReservas').innerHTML = `<table><thead><tr><th>Cancha</th><th>Fecha</th><th>Horario</th><th>Total</th><th>Estado</th><th>Acción</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function filtrarMisReservas(filtro, el) {
  el.closest('.tabs').querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderMisReservas(filtro);
}

async function cancelarReserva(id) {
  if (!confirm('¿Confirmas la cancelación de esta reserva?')) return;
  const res = await apiFetch(`/reservas/${id}`, { method:'DELETE' });
  if (!res || res.error) {
    showToast(res?.error || 'Error al cancelar. Intenta de nuevo.', 'error');
    return;
  }
  const r = MIS_RESERVAS.find(x => x.id === id);
  if (r) r.estado = 'cancelada';
  renderMisReservas();
  renderInicioCli();
  showToast('Reserva cancelada', 'info');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PUNTOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderPuntos() {
  const pts  = clienteInfo.puntos;
  const niv  = getNivelObj(clienteInfo.nivel);
  const next = NIVELES.find(n => n.min > pts);

  document.getElementById('puntosGrandes').textContent = pts;
  document.getElementById('nivelActual').innerHTML = `<span class="nivel-badge ${clienteInfo.nivel}" style="font-size:14px">${nivelIcon(clienteInfo.nivel)} ${clienteInfo.nivel}</span>`;

  if (next) {
    const pct = Math.min(100, Math.round(((pts - (niv?.min || 0)) / (next.min - (niv?.min || 0))) * 100));
    document.getElementById('proximoNivelLabel').textContent = `Próximo nivel: ${next.nombre} (${next.min} pts)`;
    document.getElementById('baraNivel').style.width = pct + '%';
    document.getElementById('ptsParaNivel').textContent = `Faltan ${Math.max(0, next.min - pts)} puntos para ${next.nombre}`;
  } else {
    document.getElementById('proximoNivelLabel').textContent = '🏆 ¡Nivel máximo alcanzado!';
    document.getElementById('baraNivel').style.width = '100%';
    document.getElementById('ptsParaNivel').textContent = 'Estás en el nivel más alto';
  }

  // Beneficios
  const iconMap = { Bronce:'🥉', Plata:'🥈', Oro:'🥇', Diamante:'💎' };
  document.getElementById('beneficiosNivel').innerHTML = NIVELES.map(n => {
    const activo = n.nombre === clienteInfo.nivel;
    return `<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;background:${activo ? 'rgba(34,197,94,.08)' : 'var(--dark-input)'};border:1px solid ${activo ? 'rgba(34,197,94,.2)' : 'var(--border)'};margin-bottom:8px">
      <span style="font-size:20px">${iconMap[n.nombre]}</span>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:700">${n.nombre} <span style="font-size:11px;color:var(--text-muted)">${n.min}–${n.max === 9999 ? '∞' : n.max} pts</span></div>
        <div style="font-size:12px;color:var(--text-muted)">${n.beneficio}</div>
      </div>
      ${activo ? '<span class="pill confirmed">Tu nivel</span>' : ''}
    </div>`;
  }).join('');

  // Historial — load from API, fall back to static only when offline
  const uid = getUserId();
  const histEl = document.getElementById('historialPuntos');
  histEl.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-muted)">Cargando…</div>';
  apiFetch(`/clientes/${uid}/historial`).then(apiHist => {
    const lista = Array.isArray(apiHist) ? apiHist : [];
    if (!lista.length) {
      histEl.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-muted)">Sin movimientos registrados</div>';
      return;
    }
    histEl.innerHTML = lista.map(h => `
      <div class="maint-item">
        <div style="width:36px;height:36px;border-radius:9px;background:${h.puntos > 0 ? 'rgba(34,197,94,.12)' : 'rgba(248,113,113,.12)'};display:flex;align-items:center;justify-content:center;font-size:16px">${h.puntos > 0 ? '⭐' : '↩'}</div>
        <div class="maint-info"><strong>${safeText(h.concepto)}</strong><span>${formatFecha(h.fecha)}</span></div>
        <div style="font-family:'Bebas Neue';font-size:20px;color:${h.puntos > 0 ? 'var(--gold)' : 'var(--red)'}">${h.puntos > 0 ? '+' : ''}${h.puntos}</div>
      </div>`).join('');
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PERFIL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderPerfil() {
  const nombre = getNombre();
  const email  = getEmail();
  const pts    = clienteInfo.puntos;
  const nivel  = clienteInfo.nivel;

  const telefono = localStorage.getItem('telefono') || '';

  document.getElementById('perfilAvatar').textContent        = initiales(nombre);
  document.getElementById('perfilNombreDisplay').textContent = nombre;
  document.getElementById('perfilEmailDisplay').textContent  = email;
  document.getElementById('perfilNivelDisplay').innerHTML    = `<span class="nivel-badge ${nivel}">${nivelIcon(nivel)} ${nivel}</span>`;
  document.getElementById('perfilNombre').value              = nombre;
  document.getElementById('perfilEmail').value               = email;
  document.getElementById('perfilTelefono').value            = telefono;

  const total = MIS_RESERVAS.length;
  const gasto = MIS_RESERVAS.filter(r => r.estado !== 'cancelada').reduce((s,r) => s + r.total, 0);
  const comp  = MIS_RESERVAS.filter(r => r.estado === 'confirmada').length;
  const pct   = total > 0 ? Math.round((comp / total) * 100) : 0;

  document.getElementById('statMisReservas').textContent   = total;
  document.getElementById('statMiGasto').textContent       = formatCOP(gasto);
  document.getElementById('pctCompletadas').textContent    = pct + '%';
  document.getElementById('barCompletadas').style.width    = pct + '%';

  const canchaCount = {};
  MIS_RESERVAS.filter(r => r.estado !== 'cancelada').forEach(r => {
    canchaCount[r.cancha_nombre] = (canchaCount[r.cancha_nombre] || 0) + 1;
  });
  const fav = Object.entries(canchaCount).sort((a,b) => b[1]-a[1])[0];
  document.getElementById('canchaFavorita').textContent = fav ? `${fav[0]} (${fav[1]} reservas)` : '—';
}

async function guardarPerfil() {
  const nombre   = document.getElementById('perfilNombre').value;
  const telefono = document.getElementById('perfilTelefono').value;
  const password = document.getElementById('perfilPassword').value;
  if (!nombre) { showToast('El nombre es requerido', 'error'); return; }

  const body = { nombre, telefono };
  if (password) body.password = password;

  const res = await apiFetch(`/clientes/${getUserId()}`, { method:'PUT', body: JSON.stringify(body) });
  if (!res || res.error) {
    showToast(res?.error || 'Error al actualizar perfil. Intenta de nuevo.', 'error');
    return;
  }
  localStorage.setItem('nombre',   nombre);
  localStorage.setItem('telefono', telefono);
  document.getElementById('headerNombre').textContent        = nombre;
  document.getElementById('headerAvatar').textContent        = initiales(nombre);
  document.getElementById('perfilNombreDisplay').textContent = nombre;
  document.getElementById('perfilAvatar').textContent        = initiales(nombre);
  document.getElementById('heroTitle').innerHTML = `Bienvenido,<br>${safeText(nombre.split(' ')[0])}`;
  if (document.getElementById('perfilPassword')) document.getElementById('perfilPassword').value = '';
  showToast('Perfil actualizado correctamente', 'success');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function getNivelObj(nivel) {
  return NIVELES.find(n => n.nombre === nivel);
}

function getDescuento() {
  const niv = getNivelObj(clienteInfo.nivel);
  return niv ? niv.descuento : 0;
}

function nivelIcon(nivel) {
  return { Bronce:'🥉', Plata:'🥈', Oro:'🥇', Diamante:'💎' }[nivel] || '🥉';
}

function estadoLbl(e) {
  return { confirmada:'Confirmada', pendiente:'Pendiente', cancelada:'Cancelada' }[e] || e;
}

function addHours(hora, h) {
  const [hh, mm] = hora.split(':').map(Number);
  return String((hh + h) % 24).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
}

function show(id) { const el = document.getElementById(id); if (el) el.style.display = ''; }
function hide(id) { const el = document.getElementById(id); if (el) el.style.display = 'none'; }
