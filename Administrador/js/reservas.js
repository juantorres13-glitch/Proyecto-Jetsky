// js/reservas.js
console.log("¡El archivo reservas.js cargó a lo bien!");

// 1. La base de datos "fake" de reservas (con las URLs de las fotos de Unsplash)
let reservasData = [
  { id: "1", cliente: "Juan Pérez", destino: "Cartagena, Colombia", fechaSalida: "2026-04-15", fechaRegreso: "2026-04-20", pasajeros: 2, estado: "confirmada", total: 2500000, imagen: "https://images.unsplash.com/photo-1561139943-2d33f2abb3ad?w=400" },
  { id: "2", cliente: "María García", destino: "San Andrés, Colombia", fechaSalida: "2026-05-10", fechaRegreso: "2026-05-17", pasajeros: 4, estado: "pendiente", total: 4800000, imagen: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400" },
  { id: "3", cliente: "Carlos Rodríguez", destino: "Cancún, México", fechaSalida: "2026-06-01", fechaRegreso: "2026-06-08", pasajeros: 2, estado: "confirmada", total: 6200000, imagen: "https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=400" }
];

// 2. Función pa' dibujar las tarjetas
function renderReservas(datos = reservasData) {
  const grid = document.getElementById('reservas-grid');
  if (!grid) return;

  grid.innerHTML = '';

  datos.forEach(reserva => {
    // Cuadramos las etiquetas según el estado de la reserva
    let badgeClass = '';
    let badgeText = '';
    if (reserva.estado === 'pendiente') { badgeClass = 'badge-pendiente'; badgeText = '⏳ Pendiente'; }
    if (reserva.estado === 'confirmada') { badgeClass = 'badge-confirmada'; badgeText = '✓ Confirmada'; }
    if (reserva.estado === 'cancelada') { badgeClass = 'badge-cancelada'; badgeText = '✕ Cancelada'; }

    const initial = reserva.cliente.charAt(0).toUpperCase();
    // Le metemos formato de plata colombiana
    const totalPlata = reserva.total.toLocaleString('es-CO');

    // Armamos la tarjeta en HTML puro
    const cardHTML = `
      <div class="customer-card" style="padding: 0;">
        <div class="reserva-img-container">
          <img src="${reserva.imagen}" alt="${reserva.destino}" class="reserva-img">
          <div class="reserva-badge-pos">
            <span class="badge ${badgeClass}">${badgeText}</span>
          </div>
          <div class="reserva-gradient">
            <h3 class="reserva-title">${reserva.destino}</h3>
          </div>
        </div>
        
        <div class="card-body">
          <div class="info-row" style="margin-bottom: 0.5rem;">
            <div class="avatar bg-blue" style="width: 32px; height: 32px; font-size: 0.875rem;">${initial}</div>
            <span style="font-weight: 500;">${reserva.cliente}</span>
          </div>

          <div class="dates-box">
            <div class="info-row"><svg class="info-icon text-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg> <span><strong>Salida:</strong> ${reserva.fechaSalida}</span></div>
            <div class="info-row"><svg class="info-icon text-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg> <span><strong>Regreso:</strong> ${reserva.fechaRegreso}</span></div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.75rem;">
            <div class="info-row text-muted">
              <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>${reserva.pasajeros} pasajeros</span>
            </div>
            <div style="text-align: right;">
              <p style="font-size: 0.75rem; color: var(--text-muted);">Total</p>
              <p class="text-orange" style="font-size: 1.125rem; font-weight: 600;">$${totalPlata}</p>
            </div>
          </div>

          <div class="card-actions">
            <button class="btn btn-outline flex-1 justify-center" onclick="abrirModalReserva('${reserva.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg> Editar
            </button>
            <button class="btn btn-outline btn-icon text-red" onclick="eliminarReserva('${reserva.id}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
    grid.innerHTML += cardHTML;
  });

  actualizarEstadisticasReservas();
}

// 3. Funciones del modal
function abrirModalReserva(id = null) {
  const modal = document.getElementById('modal-reserva');
  const form = document.getElementById('form-reserva');
  if(!modal || !form) return;

  form.reset();

  if (id) {
    const res = reservasData.find(r => r.id === id);
    document.getElementById('modal-res-titulo').textContent = 'Editar Reserva';
    document.getElementById('btn-res-guardar').textContent = 'Actualizar';
    
    document.getElementById('res-id').value = res.id;
    document.getElementById('res-cliente').value = res.cliente;
    document.getElementById('res-destino').value = res.destino;
    document.getElementById('res-salida').value = res.fechaSalida;
    document.getElementById('res-regreso').value = res.fechaRegreso;
    document.getElementById('res-pasajeros').value = res.pasajeros;
    document.getElementById('res-estado').value = res.estado;
    document.getElementById('res-total').value = res.total;
  } else {
    document.getElementById('modal-res-titulo').textContent = 'Nueva Reserva';
    document.getElementById('btn-res-guardar').textContent = 'Crear';
    document.getElementById('res-id').value = '';
  }

  modal.classList.add('active');
}

function cerrarModalReserva() {
  document.getElementById('modal-reserva').classList.remove('active');
}

function guardarReserva(event) {
  event.preventDefault();

  const id = document.getElementById('res-id').value;
  const cliente = document.getElementById('res-cliente').value;
  const destino = document.getElementById('res-destino').value;
  const fechaSalida = document.getElementById('res-salida').value;
  const fechaRegreso = document.getElementById('res-regreso').value;
  const pasajeros = parseInt(document.getElementById('res-pasajeros').value);
  const estado = document.getElementById('res-estado').value;
  const total = parseFloat(document.getElementById('res-total').value);

  if (id) {
    const index = reservasData.findIndex(r => r.id === id);
    reservasData[index] = { ...reservasData[index], cliente, destino, fechaSalida, fechaRegreso, pasajeros, estado, total };
  } else {
    const nuevaReserva = {
      id: Date.now().toString(),
      cliente, destino, fechaSalida, fechaRegreso, pasajeros, estado, total,
      imagen: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400" // Foto genérica
    };
    reservasData.push(nuevaReserva);
  }

  cerrarModalReserva();
  renderReservas();
}

function eliminarReserva(id) {
  if (window.confirm("¿Seguro que quiere borrar esta reserva, parce?")) {
    reservasData = reservasData.filter(r => r.id !== id);
    renderReservas();
  }
}

function actualizarEstadisticasReservas() {
  document.getElementById('stat-res-total').textContent = reservasData.length;
  document.getElementById('stat-res-pendientes').textContent = reservasData.filter(r => r.estado === 'pendiente').length;
  document.getElementById('stat-res-confirmadas').textContent = reservasData.filter(r => r.estado === 'confirmada').length;
  document.getElementById('stat-res-canceladas').textContent = reservasData.filter(r => r.estado === 'cancelada').length;
}

function filtrarReservas() {
  const texto = document.getElementById('search-reservas').value.toLowerCase();
  const filtrados = reservasData.filter(r => 
    r.cliente.toLowerCase().includes(texto) || 
    r.destino.toLowerCase().includes(texto)
  );
  renderReservas(filtrados);
}