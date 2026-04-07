console.log("¡El archivo ubicacion.js está rodando, mi pez!");

// 1. Base de datos simulada
let ubicacionesData = [
  { id: "1", nombre: "Oficina Principal Bogotá", tipo: "Oficina Principal", direccion: "Calle 100 #8A-55, Torre Colpatria", ciudad: "Bogotá", pais: "Colombia", telefono: "+57 1 234 5678", email: "bogota@agencia.com", horario: "Lun-Vie: 8:00 AM - 6:00 PM", coordenadas: { lat: 4.6097, lng: -74.0817 }, imagen: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400", empleados: 25 },
  { id: "2", nombre: "Sucursal Medellín", tipo: "Sucursal", direccion: "Carrera 43A #1-50, El Poblado", ciudad: "Medellín", pais: "Colombia", telefono: "+57 4 567 8901", email: "medellin@agencia.com", horario: "Lun-Sáb: 9:00 AM - 7:00 PM", coordenadas: { lat: 6.2442, lng: -75.5812 }, imagen: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400", empleados: 15 },
  { id: "3", nombre: "Punto de Atención Cartagena", tipo: "Punto de Atención", direccion: "Centro Histórico, Plaza de los Coches", ciudad: "Cartagena", pais: "Colombia", telefono: "+57 5 890 1234", email: "cartagena@agencia.com", horario: "Lun-Dom: 10:00 AM - 8:00 PM", coordenadas: { lat: 10.4236, lng: -75.5353 }, imagen: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400", empleados: 8 }
];

// 2. Función pa pintar las ubicaciones
function renderUbicaciones(datos = ubicacionesData) {
  const grid = document.getElementById('ubicacion-grid');
  if (!grid) return;

  grid.innerHTML = '';

  datos.forEach(ubi => {
    // Definir estilos del badge (la etiqueta de arriba a la derecha)
    let badgeStyle = '';
    let badgeIcon = '';
    if (ubi.tipo === 'Oficina Principal') { 
      badgeStyle = 'background: linear-gradient(to right, #3b82f6, #2563eb); color: white; border: none;';
      badgeIcon = '<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10v12h16V10M2 10l10-7 10 7M10 22v-8h4v8"/></svg>';
    } else if (ubi.tipo === 'Sucursal') { 
      badgeStyle = 'background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;';
      badgeIcon = '<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>';
    } else { 
      badgeStyle = 'background: #ffedd5; color: #9a3412; border: 1px solid #fed7aa;';
      badgeIcon = '<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
    }

    const cardHTML = `
      <div class="customer-card" style="padding:0; display:flex; flex-direction:column;">
        
        <div class="reserva-img-container" style="height: 10rem;">
          <img src="${ubi.imagen}" class="reserva-img" alt="${ubi.nombre}">
          <div class="reserva-badge-pos">
            <span class="badge flex items-center" style="display:inline-flex; align-items:center; gap:0.25rem; ${badgeStyle}">
              ${badgeIcon} ${ubi.tipo}
            </span>
          </div>
          <div class="reserva-gradient">
            <h3 style="color:white; font-size:1.125rem; font-weight:600; text-shadow:1px 1px 2px rgba(0,0,0,0.5);">${ubi.nombre}</h3>
            <p style="color:rgba(255,255,255,0.9); font-size:0.875rem;">${ubi.ciudad}, ${ubi.pais}</p>
          </div>
        </div>

        <div style="padding: 1rem; display:flex; flex-direction:column; flex:1; gap: 0.75rem;">
          
          <div class="info-row">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 0-16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span class="truncate">${ubi.direccion}</span>
          </div>

          ${ubi.telefono ? `
          <div class="info-row">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>${ubi.telefono}</span>
          </div>` : ''}

          ${ubi.email ? `
          <div class="info-row">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <span class="truncate">${ubi.email}</span>
          </div>` : ''}

          ${ubi.horario ? `
          <div class="info-row">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span style="font-size:0.875rem;">${ubi.horario}</span>
          </div>` : ''}

          <div style="margin-top:auto; pt-3;">
            <div style="border-top:1px solid var(--border-light); padding-top:0.75rem; display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
              <div style="background:#eff6ff; padding:0.5rem; border-radius:0.25rem; text-align:center;">
                <p style="font-size:0.75rem; color:#2563eb; margin-bottom:0.25rem;">Empleados</p>
                <p style="font-size:1.125rem; color:#1d4ed8;">${ubi.empleados}</p>
              </div>
              <div style="background:#f0fdf4; padding:0.5rem; border-radius:0.25rem; text-align:center;">
                <p style="font-size:0.75rem; color:#16a34a; margin-bottom:0.25rem;">Coordenadas</p>
                <p style="font-size:0.75rem; color:#15803d; margin-top: 0.5rem;">
                  ${parseFloat(ubi.coordenadas.lat).toFixed(2)}, ${parseFloat(ubi.coordenadas.lng).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div class="card-actions" style="margin-top:0.5rem;">
            <button class="btn btn-outline flex-1 justify-center" onclick="abrirModalUbicacion('${ubi.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg> Editar
            </button>
            <button class="btn btn-outline btn-icon text-red" onclick="eliminarUbicacion('${ubi.id}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
    grid.innerHTML += cardHTML;
  });

  actualizarEstadisticasUbicacion();
}

// 3. Funciones del Modal
function abrirModalUbicacion(id = null) {
  const modal = document.getElementById('modal-ubicacion');
  const form = document.getElementById('form-ubicacion');
  if(!modal || !form) return;

  form.reset();

  if (id) {
    const ubi = ubicacionesData.find(u => u.id === id);
    document.getElementById('modal-ubi-titulo').textContent = 'Editar Ubicación';
    document.getElementById('btn-ubi-guardar').textContent = 'Actualizar';
    
    document.getElementById('ubi-id').value = ubi.id;
    document.getElementById('ubi-nombre').value = ubi.nombre;
    document.getElementById('ubi-tipo').value = ubi.tipo;
    document.getElementById('ubi-ciudad').value = ubi.ciudad;
    document.getElementById('ubi-direccion').value = ubi.direccion;
    document.getElementById('ubi-pais').value = ubi.pais;
    document.getElementById('ubi-telefono').value = ubi.telefono;
    document.getElementById('ubi-email').value = ubi.email;
    document.getElementById('ubi-horario').value = ubi.horario;
    document.getElementById('ubi-lat').value = ubi.coordenadas.lat;
    document.getElementById('ubi-lng').value = ubi.coordenadas.lng;
  } else {
    document.getElementById('modal-ubi-titulo').textContent = 'Nueva Ubicación';
    document.getElementById('btn-ubi-guardar').textContent = 'Crear';
    document.getElementById('ubi-id').value = '';
    document.getElementById('ubi-pais').value = 'Colombia'; // Default
  }

  modal.classList.add('active');
}

function cerrarModalUbicacion() {
  document.getElementById('modal-ubicacion').classList.remove('active');
}

function guardarUbicacion(event) {
  event.preventDefault();

  const id = document.getElementById('ubi-id').value;
  const nombre = document.getElementById('ubi-nombre').value;
  const tipo = document.getElementById('ubi-tipo').value;
  const ciudad = document.getElementById('ubi-ciudad').value;
  const direccion = document.getElementById('ubi-direccion').value;
  const pais = document.getElementById('ubi-pais').value;
  const telefono = document.getElementById('ubi-telefono').value;
  const email = document.getElementById('ubi-email').value;
  const horario = document.getElementById('ubi-horario').value;
  const lat = parseFloat(document.getElementById('ubi-lat').value) || 0;
  const lng = parseFloat(document.getElementById('ubi-lng').value) || 0;

  if (id) {
    const index = ubicacionesData.findIndex(u => u.id === id);
    ubicacionesData[index] = { ...ubicacionesData[index], nombre, tipo, ciudad, direccion, pais, telefono, email, horario, coordenadas: {lat, lng} };
  } else {
    const nuevaUbi = {
      id: Date.now().toString(),
      nombre, tipo, ciudad, direccion, pais, telefono, email, horario, coordenadas: {lat, lng},
      imagen: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400", // Foto genérica
      empleados: 0 // Default pa los nuevos
    };
    ubicacionesData.push(nuevaUbi);
  }

  cerrarModalUbicacion();
  renderUbicaciones();
}

function eliminarUbicacion(id) {
  if (window.confirm("¿Seguro que quiere mandar esta ubicación a mejor vida?")) {
    ubicacionesData = ubicacionesData.filter(u => u.id !== id);
    renderUbicaciones();
  }
}

// 4. Buscador y Stats
function actualizarEstadisticasUbicacion() {
  document.getElementById('stat-ubi-total').textContent = ubicacionesData.length;
  document.getElementById('stat-ubi-oficinas').textContent = ubicacionesData.filter(u => u.tipo === 'Oficina Principal').length;
  document.getElementById('stat-ubi-sucursales').textContent = ubicacionesData.filter(u => u.tipo === 'Sucursal').length;
  document.getElementById('stat-ubi-puntos').textContent = ubicacionesData.filter(u => u.tipo === 'Punto de Atención').length;
}

function filtrarUbicaciones() {
  const texto = document.getElementById('search-ubicacion').value.toLowerCase();
  const filtrados = ubicacionesData.filter(u => 
    u.nombre.toLowerCase().includes(texto) || 
    u.ciudad.toLowerCase().includes(texto) || 
    u.direccion.toLowerCase().includes(texto)
  );
  renderUbicaciones(filtrados);
}