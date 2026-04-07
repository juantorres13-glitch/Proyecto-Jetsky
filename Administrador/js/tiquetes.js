console.log("¡El archivo tiquetes.js cargó firme!");

// 1. Base de datos simulada de tiquetes
let tiquetesData = [
  { id: "1", numeroTiquete: "BOG-CTG-2024-001", cliente: "Juan Pérez", origen: "Bogotá (BOG)", destino: "Cartagena (CTG)", fechaVuelo: "2026-04-15", horaVuelo: "08:30", aerolinea: "JetSky", clase: "economica", precio: 450000, puerta: "A12", asiento: "15A" },
  { id: "2", numeroTiquete: "MDE-SAN-2024-002", cliente: "María García", origen: "Medellín (MDE)", destino: "San Andrés (ADZ)", fechaVuelo: "2026-05-10", horaVuelo: "10:45", aerolinea: "JetSky", clase: "ejecutiva", precio: 1200000, puerta: "B08", asiento: "5C" },
  { id: "3", numeroTiquete: "CLO-MIA-2024-004", cliente: "Ana Martínez", origen: "Cali (CLO)", destino: "Miami (MIA)", fechaVuelo: "2026-04-22", horaVuelo: "06:15", aerolinea: "JetSky", clase: "primera", precio: 2800000, puerta: "D04", asiento: "2A" }
];

// 2. Función pa' dibujar los pases de abordar
function renderTiquetes(datos = tiquetesData) {
  const grid = document.getElementById('tiquetes-grid');
  if (!grid) return; // Por si el usuario no está en la pestaña

  grid.innerHTML = ''; // Limpiamos el grid antes de pintar

  datos.forEach(tiquete => {
    // Definimos los estilos y etiquetas según la clase de vuelo
    let badgeStyle = '';
    let badgeText = '';
    let headerColor = 'linear-gradient(to right, #2563eb, #4f46e5)'; // Azul por defecto

    if (tiquete.clase === 'economica') { 
      badgeStyle = 'background:#dbeafe; color:#1e40af;'; 
      badgeText = 'Económica'; 
    }
    if (tiquete.clase === 'ejecutiva') { 
      badgeStyle = 'background:#f3e8ff; color:#6b21a8;'; 
      badgeText = 'Ejecutiva'; 
      headerColor = 'linear-gradient(to right, #7c3aed, #6d28d9)'; // Moradito
    }
    if (tiquete.clase === 'primera') { 
      badgeStyle = 'background:#fef3c7; color:#b45309;'; 
      badgeText = 'Primera Clase'; 
      headerColor = 'linear-gradient(to right, #f59e0b, #d97706)'; // Naranja
    }

    const precioK = (tiquete.precio / 1000).toFixed(0);

    // Acá armamos la tarjeta con diseño de Boarding Pass
    const cardHTML = `
      <div class="customer-card" style="padding:0;">
        <div style="background: ${headerColor}; color: white; padding: 1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <p style="font-size:0.75rem; opacity:0.8; letter-spacing:0.05em;">BOARDING PASS</p>
              <p style="font-size:1.25rem; font-weight:bold;">${tiquete.aerolinea}</p>
            </div>
            <span class="badge" style="${badgeStyle}">${badgeText}</span>
          </div>
          <p style="font-size:0.75rem; opacity:0.9; margin-top:0.5rem;">Nº ${tiquete.numeroTiquete}</p>
        </div>

        <div style="padding: 1rem; border-bottom: 1px dashed var(--border-light); background: #f9fafb;">
          <p style="font-size:0.75rem; color:var(--text-muted);">PASAJERO</p>
          <p style="font-size:1.125rem;">${tiquete.cliente}</p>
        </div>

        <div style="padding: 1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <div>
              <p style="font-size:0.75rem; color:var(--text-muted);">ORIGEN</p>
              <p style="font-weight:600;">${tiquete.origen}</p>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" style="transform: rotate(90deg); opacity: 0.5;"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 4-3 3-3.5-.5L1 16l4.5 2L10 21l1.5-1.5-.5-3.5 3-3 4 6l1.2-.7c.4-.2.7-.6.6-1.1Z"/></svg>
            <div style="text-align:right;">
              <p style="font-size:0.75rem; color:var(--text-muted);">DESTINO</p>
              <p style="font-weight:600;">${tiquete.destino}</p>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
            <div style="background:#eff6ff; padding:0.75rem; border-radius:0.5rem;">
              <div style="display:flex; align-items:center; gap:0.25rem; margin-bottom:0.25rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                <p style="font-size:0.75rem; color:#4b5563;">FECHA</p>
              </div>
              <p style="font-weight:600; font-size:0.875rem;">${tiquete.fechaVuelo}</p>
            </div>
            <div style="background:#eff6ff; padding:0.75rem; border-radius:0.5rem;">
              <div style="display:flex; align-items:center; gap:0.25rem; margin-bottom:0.25rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <p style="font-size:0.75rem; color:#4b5563;">HORA</p>
              </div>
              <p style="font-weight:600; font-size:0.875rem;">${tiquete.horaVuelo}</p>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.5rem; margin-bottom:1rem; text-align:center;">
            <div style="background:#f9fafb; padding:0.5rem; border-radius:0.5rem;">
              <p style="font-size:0.75rem; color:var(--text-muted);">PUERTA</p>
              <p style="font-weight:bold; color:#2563eb; font-size:1.125rem;">${tiquete.puerta}</p>
            </div>
            <div style="background:#f9fafb; padding:0.5rem; border-radius:0.5rem;">
              <p style="font-size:0.75rem; color:var(--text-muted);">ASIENTO</p>
              <p style="font-weight:bold; color:#2563eb; font-size:1.125rem;">${tiquete.asiento}</p>
            </div>
            <div style="background:#fff7ed; padding:0.5rem; border-radius:0.5rem;">
              <p style="font-size:0.75rem; color:#ea580c;">PRECIO</p>
              <p style="font-weight:bold; color:#ea580c;">$${precioK}K</p>
            </div>
          </div>

          <div class="card-actions" style="border-top:1px dashed var(--border-light); padding-top:1rem;">
            <button class="btn btn-outline flex-1 justify-center" onclick="descargarTiquete('${tiquete.numeroTiquete}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x1="12" y1="15" y2="3"/></svg>
              Descargar
            </button>
            <button class="btn btn-outline btn-icon" onclick="abrirModalTiquete('${tiquete.id}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            </button>
            <button class="btn btn-outline btn-icon text-red" onclick="eliminarTiquete('${tiquete.id}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
    grid.innerHTML += cardHTML;
  });

  actualizarEstadisticasTiquetes();
}

// 3. Lógica del Modal
function abrirModalTiquete(id = null) {
  const modal = document.getElementById('modal-tiquete');
  const form = document.getElementById('form-tiquete');
  if(!modal || !form) return;

  form.reset();

  if (id) {
    const tiq = tiquetesData.find(t => t.id === id);
    document.getElementById('modal-tiq-titulo').textContent = 'Editar Tiquete';
    document.getElementById('btn-tiq-guardar').textContent = 'Actualizar';
    
    document.getElementById('tiq-id').value = tiq.id;
    document.getElementById('tiq-numero').value = tiq.numeroTiquete;
    document.getElementById('tiq-cliente').value = tiq.cliente;
    document.getElementById('tiq-origen').value = tiq.origen;
    document.getElementById('tiq-destino').value = tiq.destino;
    document.getElementById('tiq-fecha').value = tiq.fechaVuelo;
    document.getElementById('tiq-hora').value = tiq.horaVuelo;
    document.getElementById('tiq-aerolinea').value = tiq.aerolinea;
    document.getElementById('tiq-clase').value = tiq.clase;
    document.getElementById('tiq-puerta').value = tiq.puerta;
    document.getElementById('tiq-asiento').value = tiq.asiento;
    document.getElementById('tiq-precio').value = tiq.precio;
  } else {
    document.getElementById('modal-tiq-titulo').textContent = 'Nuevo Tiquete';
    document.getElementById('btn-tiq-guardar').textContent = 'Crear';
    document.getElementById('tiq-id').value = '';
  }

  modal.classList.add('active');
}

function cerrarModalTiquete() {
  document.getElementById('modal-tiquete').classList.remove('active');
}

function guardarTiquete(event) {
  event.preventDefault();

  const id = document.getElementById('tiq-id').value;
  const numeroTiquete = document.getElementById('tiq-numero').value;
  const cliente = document.getElementById('tiq-cliente').value;
  const origen = document.getElementById('tiq-origen').value;
  const destino = document.getElementById('tiq-destino').value;
  const fechaVuelo = document.getElementById('tiq-fecha').value;
  const horaVuelo = document.getElementById('tiq-hora').value;
  const aerolinea = document.getElementById('tiq-aerolinea').value;
  const clase = document.getElementById('tiq-clase').value;
  const puerta = document.getElementById('tiq-puerta').value;
  const asiento = document.getElementById('tiq-asiento').value;
  const precio = parseFloat(document.getElementById('tiq-precio').value);

  if (id) {
    const index = tiquetesData.findIndex(t => t.id === id);
    tiquetesData[index] = { ...tiquetesData[index], numeroTiquete, cliente, origen, destino, fechaVuelo, horaVuelo, aerolinea, clase, puerta, asiento, precio };
  } else {
    const nuevoTiquete = {
      id: Date.now().toString(),
      numeroTiquete, cliente, origen, destino, fechaVuelo, horaVuelo, aerolinea, clase, puerta, asiento, precio
    };
    tiquetesData.push(nuevoTiquete);
  }

  cerrarModalTiquete();
  renderTiquetes();
}

function eliminarTiquete(id) {
  if (window.confirm("¿Seguro que quiere cancelar y eliminar este tiquete?")) {
    tiquetesData = tiquetesData.filter(t => t.id !== id);
    renderTiquetes();
  }
}

function descargarTiquete(numero) {
  alert(`Descargando el tiquete ${numero} en PDF... ¡Melo!`);
}

function actualizarEstadisticasTiquetes() {
  document.getElementById('stat-tiq-total').textContent = tiquetesData.length;
  document.getElementById('stat-tiq-eco').textContent = tiquetesData.filter(t => t.clase === 'economica').length;
  document.getElementById('stat-tiq-eje').textContent = tiquetesData.filter(t => t.clase === 'ejecutiva').length;
  document.getElementById('stat-tiq-pri').textContent = tiquetesData.filter(t => t.clase === 'primera').length;
}

function filtrarTiquetes() {
  const texto = document.getElementById('search-tiquetes').value.toLowerCase();
  const filtrados = tiquetesData.filter(t => 
    t.numeroTiquete.toLowerCase().includes(texto) || 
    t.cliente.toLowerCase().includes(texto) || 
    t.destino.toLowerCase().includes(texto) ||
    t.aerolinea.toLowerCase().includes(texto)
  );
  renderTiquetes(filtrados);
}