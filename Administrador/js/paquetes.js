console.log("paquetes.js cargado correctamente");

let paquetesData = [
  {
    id: "1",
    nombre: "Escapada Caribeña",
    destino: "Cartagena y San Andrés",
    duracion: 7,
    descripcion: "Disfruta de las mejores playas del Caribe colombiano con este increíble paquete todo incluido.",
    incluye: ["Vuelos ida y vuelta", "Hotel 5 estrellas", "Desayuno y cena", "Tours guiados"],
    precio: 3500000,
    disponibilidad: 15,
    rating: 4.8
  },
  {
    id: "2",
    nombre: "Aventura en la Sierra",
    destino: "Santa Marta y Tayrona",
    duracion: 5,
    descripcion: "Explora la naturaleza y cultura de la Sierra Nevada en un viaje inolvidable.",
    incluye: ["Transporte terrestre", "Hospedaje", "Guía turístico", "Entradas a parques"],
    precio: 1800000,
    disponibilidad: 8,
    rating: 4.6
  },
  {
    id: "3",
    nombre: "Descanso Total",
    destino: "Eje Cafetero",
    duracion: 4,
    descripcion: "Relájate en las fincas cafeteras más hermosas de Colombia.",
    incluye: ["Alojamiento rural", "3 comidas", "Tour del café", "Actividades ecológicas"],
    precio: 1200000,
    disponibilidad: 20,
    rating: 4.9
  }
];

function obtenerElementosModalPaquete() {
  const elementos = {
    modal: document.getElementById("modal-paquete"),
    titulo: document.getElementById("modal-paquete-titulo"),
    btnGuardar: document.getElementById("btn-guardar-paquete"),
    form: document.getElementById("form-paquete"),
    inputId: document.getElementById("paquete-id"),
    inputNombre: document.getElementById("paquete-nombre"),
    inputDestino: document.getElementById("paquete-destino"),
    inputDuracion: document.getElementById("paquete-duracion"),
    inputPrecio: document.getElementById("paquete-precio"),
    inputDisponibilidad: document.getElementById("paquete-disponibilidad"),
    inputRating: document.getElementById("paquete-rating"),
    inputDescripcion: document.getElementById("paquete-descripcion"),
    inputIncluye: document.getElementById("paquete-incluye")
  };

  const faltantes = Object.entries(elementos)
    .filter(([, valor]) => !valor)
    .map(([clave]) => clave);

  if (faltantes.length > 0) {
    console.error("Faltan elementos del modal de paquetes:", faltantes);
    return null;
  }

  return elementos;
}

function inicializarPaquetes() {
  renderPaquetes();

  const btnNuevo = document.getElementById("btn-nuevo-paquete");
  const btnCerrar = document.getElementById("btn-cerrar-modal-paquete");
  const btnCancelar = document.getElementById("btn-cancelar-modal-paquete");
  const buscador = document.getElementById("search-paquetes");
  const form = document.getElementById("form-paquete");
  const modal = document.getElementById("modal-paquete");
  const grid = document.getElementById("paquetes-grid");

  if (btnNuevo) btnNuevo.onclick = () => abrirModalPaquete();
  if (btnCerrar) btnCerrar.onclick = cerrarModalPaquete;
  if (btnCancelar) btnCancelar.onclick = cerrarModalPaquete;
  if (buscador) buscador.oninput = filtrarPaquetes;
  if (form) form.onsubmit = guardarPaquete;

  if (modal) {
    modal.onclick = function (e) {
      if (e.target === modal) cerrarModalPaquete();
    };
  }

  if (grid) {
    grid.onclick = function (e) {
      const btnEditar = e.target.closest("[data-editar]");
      const btnEliminar = e.target.closest("[data-eliminar]");

      if (btnEditar) abrirModalPaquete(btnEditar.dataset.editar);
      if (btnEliminar) eliminarPaquete(btnEliminar.dataset.eliminar);
    };
  }
}

function renderPaquetes(datos = paquetesData) {
  const grid = document.getElementById("paquetes-grid");
  if (!grid) return;

  grid.innerHTML = "";

  datos.forEach((paquete) => {
    const precioPlata = paquete.precio.toLocaleString("es-CO");
    const incluyeHTML = paquete.incluye
      .map(item => `<span class="badge badge-nuevo">${item}</span>`)
      .join(" ");

    grid.insertAdjacentHTML("beforeend", `
      <div class="customer-card">
        <div class="card-header bg-blue-light">
          <div>
            <h3 class="customer-name">${paquete.nombre}</h3>
            <p class="page-subtitle">${paquete.destino}</p>
          </div>
        </div>

        <div class="card-body">
          <div class="info-row"><span><strong>Duración:</strong> ${paquete.duracion} días</span></div>
          <div class="info-row"><span><strong>Precio:</strong> $${precioPlata}</span></div>
          <div class="info-row"><span><strong>Disponibilidad:</strong> ${paquete.disponibilidad}</span></div>
          <div class="info-row"><span><strong>Rating:</strong> ${paquete.rating || 0}</span></div>

          <div class="info-row">
            <span><strong>Descripción:</strong> ${paquete.descripcion}</span>
          </div>

          <div>
            <p class="form-label" style="margin-bottom: 0.5rem;">Incluye:</p>
            <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
              ${incluyeHTML}
            </div>
          </div>

          <div class="card-actions">
            <button type="button" class="btn btn-outline flex-1 justify-center" data-editar="${paquete.id}">
              Editar
            </button>
            <button type="button" class="btn btn-outline btn-icon text-red" data-eliminar="${paquete.id}">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    `);
  });

  actualizarEstadisticasPaquetes();
}

function abrirModalPaquete(id = null) {
  const refs = obtenerElementosModalPaquete();
  if (!refs) return;

  const {
    modal,
    titulo,
    btnGuardar,
    form,
    inputId,
    inputNombre,
    inputDestino,
    inputDuracion,
    inputPrecio,
    inputDisponibilidad,
    inputRating,
    inputDescripcion,
    inputIncluye
  } = refs;

  form.reset();
  inputId.value = "";

  if (id) {
    const paquete = paquetesData.find((p) => p.id === id);
    if (!paquete) return;

    titulo.textContent = "Editar Paquete";
    btnGuardar.textContent = "Actualizar";
    inputId.value = paquete.id;
    inputNombre.value = paquete.nombre;
    inputDestino.value = paquete.destino;
    inputDuracion.value = paquete.duracion;
    inputPrecio.value = paquete.precio;
    inputDisponibilidad.value = paquete.disponibilidad;
    inputRating.value = paquete.rating;
    inputDescripcion.value = paquete.descripcion;
    inputIncluye.value = paquete.incluye.join(", ");
  } else {
    titulo.textContent = "Nuevo Paquete";
    btnGuardar.textContent = "Guardar Paquete";
  }

  modal.classList.add("active");
}

function cerrarModalPaquete() {
  const modal = document.getElementById("modal-paquete");
  if (modal) modal.classList.remove("active");
}

function guardarPaquete(event) {
  event.preventDefault();

  const refs = obtenerElementosModalPaquete();
  if (!refs) return;

  const {
    inputId,
    inputNombre,
    inputDestino,
    inputDuracion,
    inputPrecio,
    inputDisponibilidad,
    inputRating,
    inputDescripcion,
    inputIncluye
  } = refs;

  const id = inputId.value.trim();
  const nombre = inputNombre.value.trim();
  const destino = inputDestino.value.trim();
  const duracion = parseInt(inputDuracion.value, 10);
  const precio = parseInt(inputPrecio.value, 10);
  const disponibilidad = parseInt(inputDisponibilidad.value, 10);
  const rating = parseFloat(inputRating.value) || 0;
  const descripcion = inputDescripcion.value.trim();
  const incluye = inputIncluye.value
    .split(",")
    .map(item => item.trim())
    .filter(item => item !== "");

  if (!nombre || !destino || !duracion || !precio || !descripcion || incluye.length === 0) {
    alert("Completa todos los campos obligatorios.");
    return;
  }

  if (id) {
    const index = paquetesData.findIndex((p) => p.id === id);
    if (index !== -1) {
      paquetesData[index] = {
        ...paquetesData[index],
        nombre,
        destino,
        duracion,
        descripcion,
        incluye,
        precio,
        disponibilidad,
        rating
      };
    }
  } else {
    paquetesData.push({
      id: Date.now().toString(),
      nombre,
      destino,
      duracion,
      descripcion,
      incluye,
      precio,
      disponibilidad,
      rating
    });
  }

  cerrarModalPaquete();
  renderPaquetes();
}

function eliminarPaquete(id) {
  if (!window.confirm("¿Seguro que quieres eliminar este paquete?")) return;
  paquetesData = paquetesData.filter((p) => p.id !== id);
  renderPaquetes();
}

function actualizarEstadisticasPaquetes() {
  const total = document.getElementById("stat-total-paquetes");
  const disponibles = document.getElementById("stat-disponibles");
  const destinos = document.getElementById("stat-destinos");
  const promedio = document.getElementById("stat-precio-promedio");

  if (total) total.textContent = paquetesData.length;

  if (disponibles) {
    const sumaDisponibles = paquetesData.reduce((acc, p) => acc + p.disponibilidad, 0);
    disponibles.textContent = sumaDisponibles;
  }

  if (destinos) {
    const destinosUnicos = new Set(paquetesData.map(p => p.destino));
    destinos.textContent = destinosUnicos.size;
  }

  if (promedio) {
    const promedioPrecio = paquetesData.length
      ? paquetesData.reduce((acc, p) => acc + p.precio, 0) / paquetesData.length
      : 0;
    promedio.textContent = "$" + Math.round(promedioPrecio).toLocaleString("es-CO");
  }
}

function filtrarPaquetes() {
  const input = document.getElementById("search-paquetes");
  if (!input) return;

  const texto = input.value.toLowerCase();

  const filtrados = paquetesData.filter((p) =>
    p.nombre.toLowerCase().includes(texto) ||
    p.destino.toLowerCase().includes(texto)
  );

  renderPaquetes(filtrados);
}