console.log("clientes.js cargado correctamente");

let clientesData = [
  {
    id: "1",
    nombre: "Juan Pérez",
    email: "juan.perez@email.com",
    telefono: "+57 312 345 6789",
    direccion: "Calle 123 #45-67, Bogotá",
    fechaRegistro: "2024-01-15",
    reservasActivas: 2,
    totalGastado: 8500000,
    nivel: "vip"
  },
  {
    id: "2",
    nombre: "María García",
    email: "maria.garcia@email.com",
    telefono: "+57 301 234 5678",
    direccion: "Carrera 45 #12-34, Medellín",
    fechaRegistro: "2024-02-20",
    reservasActivas: 1,
    totalGastado: 4800000,
    nivel: "frecuente"
  },
  {
    id: "3",
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@email.com",
    telefono: "+57 315 678 9012",
    direccion: "Avenida 68 #23-45, Cali",
    fechaRegistro: "2024-03-05",
    reservasActivas: 1,
    totalGastado: 6200000,
    nivel: "frecuente"
  }
];

function obtenerElementosModalCliente() {
  const elementos = {
    modal: document.getElementById("modal-cliente"),
    titulo: document.getElementById("modal-titulo"),
    btnGuardar: document.getElementById("btn-guardar"),
    form: document.getElementById("form-cliente"),
    inputId: document.getElementById("cliente-id"),
    inputNombre: document.getElementById("cliente-nombre"),
    inputEmail: document.getElementById("cliente-email"),
    inputTelefono: document.getElementById("cliente-telefono"),
    inputDireccion: document.getElementById("cliente-direccion"),
    inputNivel: document.getElementById("cliente-nivel")
  };

  const faltantes = Object.entries(elementos)
    .filter(([, valor]) => !valor)
    .map(([clave]) => clave);

  if (faltantes.length > 0) {
    console.error("Faltan elementos del modal:", faltantes);
    return null;
  }

  return elementos;
}

function inicializarClientes() {
  const btnNuevo = document.getElementById("btn-nuevo-cliente");
  const btnCerrar = document.getElementById("btn-cerrar-modal");
  const btnCancelar = document.getElementById("btn-cancelar-modal");
  const buscador = document.getElementById("search-clientes");
  const form = document.getElementById("form-cliente");
  const modal = document.getElementById("modal-cliente");
  const grid = document.getElementById("clientes-grid");

  renderClientes();

  if (btnNuevo) {
    btnNuevo.onclick = () => abrirModalCliente();
  }

  if (btnCerrar) {
    btnCerrar.onclick = cerrarModalCliente;
  }

  if (btnCancelar) {
    btnCancelar.onclick = cerrarModalCliente;
  }

  if (buscador) {
    buscador.oninput = filtrarClientes;
  }

  if (form) {
    form.onsubmit = guardarCliente;
  }

  if (modal) {
    modal.onclick = function (e) {
      if (e.target === modal) {
        cerrarModalCliente();
      }
    };
  }

  if (grid) {
    grid.onclick = function (e) {
      const btnEditar = e.target.closest("[data-editar]");
      const btnEliminar = e.target.closest("[data-eliminar]");

      if (btnEditar) {
        abrirModalCliente(btnEditar.dataset.editar);
      }

      if (btnEliminar) {
        eliminarCliente(btnEliminar.dataset.eliminar);
      }
    };
  }
}

function renderClientes(datos = clientesData) {
  const grid = document.getElementById("clientes-grid");
  if (!grid) return;

  grid.innerHTML = "";

  datos.forEach((cliente) => {
    let badgeClass = "badge-nuevo";
    let badgeText = "Nuevo";

    if (cliente.nivel === "vip") {
      badgeClass = "badge-vip";
      badgeText = "VIP";
    } else if (cliente.nivel === "frecuente") {
      badgeClass = "badge-frecuente";
      badgeText = "Frecuente";
    }

    const initial = cliente.nombre.charAt(0).toUpperCase();
    const gastadoMillones = (cliente.totalGastado / 1000000).toFixed(1);

    grid.insertAdjacentHTML("beforeend", `
      <div class="customer-card">
        <div class="card-header bg-blue-light">
          <div class="avatar">${initial}</div>
          <div>
            <h3 class="customer-name">${cliente.nombre}</h3>
            <span class="badge ${badgeClass}">${badgeText}</span>
          </div>
        </div>

        <div class="card-body">
          <div class="info-row"><span>${cliente.email}</span></div>
          <div class="info-row"><span>${cliente.telefono}</span></div>
          <div class="info-row"><span class="truncate">${cliente.direccion || "Sin dirección"}</span></div>
          <div class="info-row"><span>Desde ${cliente.fechaRegistro}</span></div>

          <div class="card-stats-grid">
            <div class="stat-box bg-orange-light">
              <p class="stat-box-label text-orange">Reservas Activas</p>
              <p class="stat-box-value text-orange-dark">${cliente.reservasActivas}</p>
            </div>
            <div class="stat-box bg-green-light">
              <p class="stat-box-label text-green">Total Gastado</p>
              <p class="stat-box-value text-green-dark">$${gastadoMillones}M</p>
            </div>
          </div>

          <div class="card-actions">
            <button type="button" class="btn btn-outline flex-1 justify-center" data-editar="${cliente.id}">
              Editar
            </button>
            <button type="button" class="btn btn-outline btn-icon text-red" data-eliminar="${cliente.id}">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    `);
  });

  actualizarEstadisticas();
}

function abrirModalCliente(id = null) {
  const refs = obtenerElementosModalCliente();
  if (!refs) return;

  const {
    modal,
    titulo,
    btnGuardar,
    form,
    inputId,
    inputNombre,
    inputEmail,
    inputTelefono,
    inputDireccion,
    inputNivel
  } = refs;

  form.reset();
  inputId.value = "";

  if (id) {
    const cliente = clientesData.find((c) => c.id === id);
    if (!cliente) return;

    titulo.textContent = "Editar Cliente";
    btnGuardar.textContent = "Actualizar";
    inputId.value = cliente.id;
    inputNombre.value = cliente.nombre;
    inputEmail.value = cliente.email;
    inputTelefono.value = cliente.telefono;
    inputDireccion.value = cliente.direccion || "";
    inputNivel.value = cliente.nivel;
  } else {
    titulo.textContent = "Nuevo Cliente";
    btnGuardar.textContent = "Crear Cliente";
  }

  modal.classList.add("active");
}

function cerrarModalCliente() {
  const modal = document.getElementById("modal-cliente");
  if (modal) modal.classList.remove("active");
}

function guardarCliente(event) {
  event.preventDefault();

  const refs = obtenerElementosModalCliente();
  if (!refs) return;

  const {
    inputId,
    inputNombre,
    inputEmail,
    inputTelefono,
    inputDireccion,
    inputNivel
  } = refs;

  const id = inputId.value.trim();
  const nombre = inputNombre.value.trim();
  const email = inputEmail.value.trim();
  const telefono = inputTelefono.value.trim();
  const direccion = inputDireccion.value.trim();
  const nivel = inputNivel.value;

  if (!nombre || !email || !telefono) {
    alert("Completa los campos obligatorios.");
    return;
  }

  if (id) {
    const index = clientesData.findIndex((c) => c.id === id);
    if (index !== -1) {
      clientesData[index] = {
        ...clientesData[index],
        nombre,
        email,
        telefono,
        direccion,
        nivel
      };
    }
  } else {
    clientesData.push({
      id: Date.now().toString(),
      nombre,
      email,
      telefono,
      direccion,
      nivel,
      fechaRegistro: new Date().toISOString().split("T")[0],
      reservasActivas: 0,
      totalGastado: 0
    });
  }

  cerrarModalCliente();
  renderClientes();
}

function eliminarCliente(id) {
  if (!window.confirm("¿Seguro que quieres eliminar este cliente?")) return;
  clientesData = clientesData.filter((c) => c.id !== id);
  renderClientes();
}

function actualizarEstadisticas() {
  const statTotal = document.getElementById("stat-total");
  const statNuevos = document.getElementById("stat-nuevos");
  const statFrecuentes = document.getElementById("stat-frecuentes");
  const statVip = document.getElementById("stat-vip");

  if (statTotal) statTotal.textContent = clientesData.length;
  if (statNuevos) statNuevos.textContent = clientesData.filter((c) => c.nivel === "nuevo").length;
  if (statFrecuentes) statFrecuentes.textContent = clientesData.filter((c) => c.nivel === "frecuente").length;
  if (statVip) statVip.textContent = clientesData.filter((c) => c.nivel === "vip").length;
}

function filtrarClientes() {
  const input = document.getElementById("search-clientes");
  if (!input) return;

  const texto = input.value.toLowerCase();
  const filtrados = clientesData.filter((c) =>
    c.nombre.toLowerCase().includes(texto) ||
    c.email.toLowerCase().includes(texto) ||
    c.telefono.toLowerCase().includes(texto)
  );

  renderClientes(filtrados);
}