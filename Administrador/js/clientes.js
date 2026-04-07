// Trampita para saber si el archivo conectó bien. Mírelo en la consola (F12)
console.log("¡El archivo clientes.js cargó melo!");

// 1. Nuestra base de datos simulada
let clientesData = [
  { id: "1", nombre: "Juan Pérez", email: "juan.perez@email.com", telefono: "+57 312 345 6789", direccion: "Calle 123 #45-67, Bogotá", fechaRegistro: "2024-01-15", reservasActivas: 2, totalGastado: 8500000, nivel: "vip" },
  { id: "2", nombre: "María García", email: "maria.garcia@email.com", telefono: "+57 301 234 5678", direccion: "Carrera 45 #12-34, Medellín", fechaRegistro: "2024-02-20", reservasActivas: 1, totalGastado: 4800000, nivel: "frecuente" },
  { id: "3", nombre: "Carlos Rodríguez", email: "carlos.rodriguez@email.com", telefono: "+57 315 678 9012", direccion: "Avenida 68 #23-45, Cali", fechaRegistro: "2024-03-05", reservasActivas: 1, totalGastado: 6200000, nivel: "frecuente" }
];

// 2. Función principal para dibujar las tarjetas en el HTML
function renderClientes(datos = clientesData) {
  const grid = document.getElementById('clientes-grid');
  
  // Si por alguna razón el grid no existe todavía en el HTML, nos salimos para no generar errores
  if (!grid) {
    console.log("Buscando el grid de clientes... no lo encontré.");
    return; 
  }

  grid.innerHTML = ''; // Limpiamos el contenedor

  datos.forEach(cliente => {
    // Definir colores según nivel
    let badgeClass = 'badge-nuevo';
    let badgeText = 'Nuevo';
    if (cliente.nivel === 'vip') { badgeClass = 'badge-vip'; badgeText = 'VIP'; }
    if (cliente.nivel === 'frecuente') { badgeClass = 'badge-frecuente'; badgeText = 'Frecuente'; }

    const initial = cliente.nombre.charAt(0).toUpperCase();
    const gastadoMillones = (cliente.totalGastado / 1000000).toFixed(1);

    // Creamos la tarjeta HTML inyectando las variables
    const cardHTML = `
      <div class="customer-card">
        <div class="card-header bg-blue-light">
          <div class="avatar bg-blue">${initial}</div>
          <div>
            <h3 class="customer-name">${cliente.nombre}</h3>
            <span class="badge ${badgeClass}">${badgeText}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="info-row"><svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg><span>${cliente.email}</span></div>
          <div class="info-row"><svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><span>${cliente.telefono}</span></div>
          <div class="info-row"><svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 0-16 0Z"/><circle cx="12" cy="10" r="3"/></svg><span class="truncate">${cliente.direccion}</span></div>
          <div class="info-row"><svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg><span>Desde ${cliente.fechaRegistro}</span></div>
          
          <div class="card-stats-grid">
            <div class="stat-box bg-orange-light"><p class="stat-box-label text-orange">Reservas Activas</p><p class="stat-box-value text-orange-dark">${cliente.reservasActivas}</p></div>
            <div class="stat-box bg-green-light"><p class="stat-box-label text-green">Total Gastado</p><p class="stat-box-value text-green-dark">$${gastadoMillones}M</p></div>
          </div>

          <div class="card-actions">
            <button class="btn btn-outline flex-1 justify-center" onclick="abrirModalCliente('${cliente.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg> Editar
            </button>
            <button class="btn btn-outline btn-icon text-red" onclick="eliminarCliente('${cliente.id}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
    grid.innerHTML += cardHTML;
  });

  actualizarEstadisticas();
}

// 3. Funciones del Modal
function abrirModalCliente(id = null) {
  const modal = document.getElementById('modal-cliente');
  const titulo = document.getElementById('modal-titulo');
  const btnGuardar = document.getElementById('btn-guardar');
  const form = document.getElementById('form-cliente');

  // Esto nos va a imprimir en consola qué encontró (aparece la etiqueta HTML) y qué no (aparece null)
  console.log("🔍 Buscando el Modal:", modal);
  console.log("🔍 Buscando el Título:", titulo);
  console.log("🔍 Buscando el Botón:", btnGuardar);
  console.log("🔍 Buscando el Formulario:", form);

  if (!modal || !titulo || !btnGuardar || !form) {
    console.error("¡Pilas! Falta algún ID en el HTML. Mire los logs de arriba a ver cuál salió en 'null'.");
    return;
  }

  form.reset(); 

  // ... (de aquí para abajo el código sigue igualito)

  if (id) {
    const cliente = clientesData.find(c => c.id === id);
    titulo.textContent = 'Editar Cliente';
    btnGuardar.textContent = 'Actualizar';
    
    document.getElementById('cliente-id').value = cliente.id;
    document.getElementById('cliente-nombre').value = cliente.nombre;
    document.getElementById('cliente-email').value = cliente.email;
    document.getElementById('cliente-telefono').value = cliente.telefono;
    document.getElementById('cliente-direccion').value = cliente.direccion;
    document.getElementById('cliente-nivel').value = cliente.nivel;
  } else {
    titulo.textContent = 'Nuevo Cliente';
    btnGuardar.textContent = 'Crear Cliente';
    document.getElementById('cliente-id').value = '';
  }

  modal.classList.add('active');
}

function cerrarModalCliente() {
  document.getElementById('modal-cliente').classList.remove('active');
}

// 4. Guardar (Crear o Editar)
function guardarCliente(event) {
  event.preventDefault();

  const id = document.getElementById('cliente-id').value;
  const nombre = document.getElementById('cliente-nombre').value;
  const email = document.getElementById('cliente-email').value;
  const telefono = document.getElementById('cliente-telefono').value;
  const direccion = document.getElementById('cliente-direccion').value;
  const nivel = document.getElementById('cliente-nivel').value;

  if (id) {
    const index = clientesData.findIndex(c => c.id === id);
    clientesData[index] = { ...clientesData[index], nombre, email, telefono, direccion, nivel };
    alert('¡Cliente actualizado melo!');
  } else {
    const nuevoCliente = {
      id: Date.now().toString(),
      nombre, email, telefono, direccion, nivel,
      fechaRegistro: new Date().toISOString().split('T')[0],
      reservasActivas: 0, totalGastado: 0
    };
    clientesData.push(nuevoCliente);
    alert('¡Cliente creado exitosamente!');
  }

  cerrarModalCliente();
  renderClientes();
}

// 5. Eliminar
function eliminarCliente(id) {
  const confirmar = window.confirm("¿Seguro que quiere borrar a este cliente? Después no hay cómo recuperarlo.");
  if (confirmar) {
    clientesData = clientesData.filter(c => c.id !== id);
    renderClientes();
  }
}

// 6. Actualizar las estadísticas de arriba
function actualizarEstadisticas() {
  document.getElementById('stat-total').textContent = clientesData.length;
  document.getElementById('stat-nuevos').textContent = clientesData.filter(c => c.nivel === 'nuevo').length;
  document.getElementById('stat-frecuentes').textContent = clientesData.filter(c => c.nivel === 'frecuente').length;
  document.getElementById('stat-vip').textContent = clientesData.filter(c => c.nivel === 'vip').length;
}

// 7. Buscador
function filtrarClientes() {
  const texto = document.getElementById('search-clientes').value.toLowerCase();
  const filtrados = clientesData.filter(c => 
    c.nombre.toLowerCase().includes(texto) || 
    c.email.toLowerCase().includes(texto) || 
    c.telefono.includes(texto)
  );
  renderClientes(filtrados);
}