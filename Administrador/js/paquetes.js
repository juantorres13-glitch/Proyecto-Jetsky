console.log("¡El archivo paquetes.js cargó sin mente!");

// 1. Datos iniciales quemados
let paquetesData = [
  { id: "1", nombre: "Escapada Caribeña", destino: "Cartagena y San Andrés", duracion: 7, descripcion: "Disfruta de las mejores playas del Caribe colombiano con este increíble paquete todo incluido.", incluye: ["Vuelos ida y vuelta", "Hotel 5 estrellas", "Desayuno y cena", "Tours guiados"], precio: 3500000, disponibilidad: 15, rating: 4.8 },
  { id: "2", nombre: "Aventura en la Sierra", destino: "Santa Marta y Tayrona", duracion: 5, descripcion: "Explora la naturaleza y cultura de la Sierra Nevada en un viaje inolvidable.", incluye: ["Transporte terrestre", "Hospedaje", "Guía turístico", "Entradas a parques"], precio: 1800000, disponibilidad: 8, rating: 4.6 },
  { id: "3", nombre: "Descanso Total", destino: "Eje Cafetero", duracion: 4, descripcion: "Relájate en las fincas cafeteras más hermosas de Colombia.", incluye: ["Alojamiento rural", "3 comidas", "Tour del café", "Actividades ecológicas"], precio: 1200000, disponibilidad: 20, rating: 4.9 }
];

// 2. Función pa pintar los paquetes
function renderPaquetes(datos = paquetesData) {
  const grid = document.getElementById('paquetes-grid');
  if (!grid) return;

  grid.innerHTML = '';

  datos.forEach(paquete => {
    // Formato de platica colombiana
    const precioPlata = paquete.precio.toLocaleString('es-CO');

    // Esta magia coge el arreglo de palabras y las vuelve HTML (pildoritas grises)
    const badgesIncluye = paquete.incluye.map(item => 
      `<span class="badge" style="background:#f3f4f6; color:#4b5563; font-weight:normal; border:1px solid #e5e7eb;">${item}</span>`
    ).join('');

    const cardHTML = `
      <div class="customer-card" style="padding:0; display:flex; flex-direction:column;">
        
        <div style="background: linear-gradient(to right, #f97316, #ea580c); color: white; padding: 1rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 0.5rem;">
            <h3 style="font-size:1.125rem; font-weight:500;">${paquete.nombre}</h3>
            
            <div style="display:flex; align-items:center; gap:0.25rem; background:rgba(255,255,255,0.2); padding:0.125rem 0.375rem; border-radius:0.25rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span style="font-size:0.875rem;">${paquete.rating}</span>
            </div>
          </div>
          <p style="font-size:0.875rem; color:#ffedd5;">${paquete.destino}</p>
        </div>

        <div style="padding: 1rem; display:flex; flex-direction:column; flex:1;">
          <p style="font-size:0.875rem; color:var(--text-muted); margin-bottom:1rem; min-height: 2.5rem;">${paquete.descripcion}</p>
          
          <div style="margin-bottom:1rem;">
            <p style="font-size:0.875rem; margin-bottom:0.5rem;">Incluye:</p>
            <div style="display:flex; flex-wrap:wrap; gap:0.375rem;">
              ${badgesIncluye}
            </div>
          </div>

          <div style="margin-top:auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.875rem; color:var(--text-muted); margin-bottom:1rem;">
              <span>${paquete.duracion} días</span>
              <div style="display:flex; align-items:center; gap:0.25rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>${paquete.disponibilidad} disponibles</span>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-light); padding-top:1rem;">
              <div>
                <p style="font-size:1.5rem; color:#ea580c; font-weight:400;">$${precioPlata}</p>
                <p style="font-size:0.75rem; color:var(--text-muted);">por persona</p>
              </div>
              <div style="display:flex; gap:0.5rem;">
                <button class="btn btn-outline btn-icon" onclick="abrirModalPaquete('${paquete.id}')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </button>
                <button class="btn btn-outline btn-icon text-red" onclick="eliminarPaquete('${paquete.id}')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    grid.innerHTML += cardHTML;
  });
}

// 3. Funciones pa que el modal camelle
function abrirModalPaquete(id = null) {
  const modal = document.getElementById('modal-paquete');
  const form = document.getElementById('form-paquete');
  if(!modal || !form) return;

  form.reset();

  if (id) {
    const paq = paquetesData.find(p => p.id === id);
    document.getElementById('modal-paq-titulo').textContent = 'Editar Paquete';
    document.getElementById('btn-paq-guardar').textContent = 'Actualizar';
    
    document.getElementById('paq-id').value = paq.id;
    document.getElementById('paq-nombre').value = paq.nombre;
    document.getElementById('paq-destino').value = paq.destino;
    document.getElementById('paq-duracion').value = paq.duracion;
    document.getElementById('paq-descripcion').value = paq.descripcion;
    document.getElementById('paq-incluye').value = paq.incluye.join(', '); // Lo volvemos texto pa'l input
    document.getElementById('paq-precio').value = paq.precio;
    document.getElementById('paq-disponibilidad').value = paq.disponibilidad;
    document.getElementById('paq-rating').value = paq.rating;
  } else {
    document.getElementById('modal-paq-titulo').textContent = 'Nuevo Paquete';
    document.getElementById('btn-paq-guardar').textContent = 'Crear';
    document.getElementById('paq-id').value = '';
    document.getElementById('paq-rating').value = '5'; // Rating default
  }

  modal.classList.add('active');
}

function cerrarModalPaquete() {
  document.getElementById('modal-paquete').classList.remove('active');
}

function guardarPaquete(event) {
  event.preventDefault();

  const id = document.getElementById('paq-id').value;
  const nombre = document.getElementById('paq-nombre').value;
  const destino = document.getElementById('paq-destino').value;
  const duracion = parseInt(document.getElementById('paq-duracion').value) || 0;
  const descripcion = document.getElementById('paq-descripcion').value;
  // Coge el texto "vuelo, hotel", lo separa por la coma, y le quita los espacios a los lados
  const incluye = document.getElementById('paq-incluye').value.split(',').map(item => item.trim()).filter(item => item !== "");
  const precio = parseFloat(document.getElementById('paq-precio').value);
  const disponibilidad = parseInt(document.getElementById('paq-disponibilidad').value) || 0;
  const rating = parseFloat(document.getElementById('paq-rating').value) || 5;

  if (id) {
    const index = paquetesData.findIndex(p => p.id === id);
    paquetesData[index] = { ...paquetesData[index], nombre, destino, duracion, descripcion, incluye, precio, disponibilidad, rating };
  } else {
    const nuevoPaquete = {
      id: Date.now().toString(),
      nombre, destino, duracion, descripcion, incluye, precio, disponibilidad, rating
    };
    paquetesData.push(nuevoPaquete);
  }

  cerrarModalPaquete();
  renderPaquetes();
}

function eliminarPaquete(id) {
  if (window.confirm("¿Parce, seguro que quiere borrar este paquete?")) {
    paquetesData = paquetesData.filter(p => p.id !== id);
    renderPaquetes();
  }
}

// 4. Buscador
function filtrarPaquetes() {
  const texto = document.getElementById('search-paquetes').value.toLowerCase();
  const filtrados = paquetesData.filter(p => 
    p.nombre.toLowerCase().includes(texto) || 
    p.destino.toLowerCase().includes(texto)
  );
  renderPaquetes(filtrados);
}