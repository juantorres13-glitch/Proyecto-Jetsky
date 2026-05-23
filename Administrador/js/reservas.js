console.log("reservas.js cargado correctamente");

let reservasData = [
  {
    id: "1",
    cliente: "Juan Pérez",
    destino: "Cartagena, Colombia",
    fechaSalida: "2026-04-15",
    fechaRegreso: "2026-04-20",
    pasajeros: 2,
    estado: "confirmada",
    total: 2500000,
    imagen: "https://images.unsplash.com/photo-1561139943-2d33f2abb3ad?w=400"
  },
  {
    id: "2",
    cliente: "María García",
    destino: "San Andrés, Colombia",
    fechaSalida: "2026-05-10",
    fechaRegreso: "2026-05-17",
    pasajeros: 4,
    estado: "pendiente",
    total: 4800000,
    imagen: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400"
  },
  {
    id: "3",
    cliente: "Carlos Rodríguez",
    destino: "Cancún, México",
    fechaSalida: "2026-06-01",
    fechaRegreso: "2026-06-08",
    pasajeros: 2,
    estado: "confirmada",
    total: 6200000,
    imagen: "https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=400"
  }
];

function obtenerElementosModalReserva() {
  const elementos = {
    modal: document.getElementById("modal-reserva"),
    titulo: document.getElementById("modal-reserva-titulo"),
    btnGuardar: document.getElementById("btn-guardar-reserva"),
    form: document.getElementById("form-reserva"),
    inputId: document.getElementById("reserva-id"),
    inputCliente: document.getElementById("reserva-cliente"),
    inputDestino: document.getElementById("reserva-destino"),
    inputSalida: document.getElementById("reserva-salida"),
    inputRegreso: document.getElementById("reserva-regreso"),
    inputPasajeros: document.getElementById("reserva-pasajeros"),
    inputEstado: document.getElementById("reserva-estado"),
    inputTotal: document.getElementById("reserva-total"),
    inputImagen: document.getElementById("reserva-imagen")
  };

  const faltantes = Object.entries(elementos)
    .filter(([, valor]) => !valor)
    .map(([clave]) => clave);

  if (faltantes.length > 0) {
    console.error("Faltan elementos del modal de reservas:", faltantes);
    return null;
  }

  return elementos;
}

function inicializarReservas() {
  renderReservas();

  const btnNueva = document.getElementById("btn-nueva-reserva");
  const btnCerrar = document.getElementById("btn-cerrar-modal-reserva");
  const btnCancelar = document.getElementById("btn-cancelar-modal-reserva");
  const buscador = document.getElementById("search-reservas");
  const form = document.getElementById("form-reserva");
  const modal = document.getElementById("modal-reserva");
  const grid = document.getElementById("reservas-grid");

  if (btnNueva) btnNueva.onclick = () => abrirModalReserva();
  if (btnCerrar) btnCerrar.onclick = cerrarModalReserva;
  if (btnCancelar) btnCancelar.onclick = cerrarModalReserva;
  if (buscador) buscador.oninput = filtrarReservas;
  if (form) form.onsubmit = guardarReserva;

  if (modal) {
    modal.onclick = function (e) {
      if (e.target === modal) cerrarModalReserva();
    };
  }

  if (grid) {
    grid.onclick = function (e) {
      const btnEditar = e.target.closest("[data-editar]");
      const btnEliminar = e.target.closest("[data-eliminar]");

      if (btnEditar) abrirModalReserva(btnEditar.dataset.editar);
      if (btnEliminar) eliminarReserva(btnEliminar.dataset.eliminar);
    };
  }
}

function renderReservas(datos = reservasData) {
  const grid = document.getElementById("reservas-grid");
  if (!grid) return;

  grid.innerHTML = "";

  datos.forEach((reserva) => {
    let badgeClass = "badge-pendiente";
    let badgeText = "Pendiente";

    if (reserva.estado === "confirmada") {
      badgeClass = "badge-confirmada";
      badgeText = "Confirmada";
    } else if (reserva.estado === "cancelada") {
      badgeClass = "badge-cancelada";
      badgeText = "Cancelada";
    }

    const totalPlata = reserva.total.toLocaleString("es-CO");
    const imagen = reserva.imagen || "https://picsum.photos/400/220";

    grid.insertAdjacentHTML("beforeend", `
      <div class="customer-card">
        <div class="reserva-img-container">
          <img src="${imagen}" alt="${reserva.destino}" class="reserva-img">
          <div class="reserva-badge-pos">
            <span class="badge ${badgeClass}">${badgeText}</span>
          </div>
          <div class="reserva-gradient">
            <h3 class="reserva-title">${reserva.destino}</h3>
          </div>
        </div>

        <div class="card-body">
          <div class="info-row"><span><strong>Cliente:</strong> ${reserva.cliente}</span></div>
          <div class="info-row"><span><strong>Salida:</strong> ${reserva.fechaSalida}</span></div>
          <div class="info-row"><span><strong>Regreso:</strong> ${reserva.fechaRegreso}</span></div>
          <div class="info-row"><span><strong>Pasajeros:</strong> ${reserva.pasajeros}</span></div>
          <div class="info-row"><span><strong>Total:</strong> $${totalPlata}</span></div>

          <div class="card-actions">
            <button type="button" class="btn btn-outline flex-1 justify-center" data-editar="${reserva.id}">
              Editar
            </button>
            <button type="button" class="btn btn-outline btn-icon text-red" data-eliminar="${reserva.id}">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    `);
  });

  actualizarEstadisticasReservas();
}

function abrirModalReserva(id = null) {
  const refs = obtenerElementosModalReserva();
  if (!refs) return;

  const {
    modal,
    titulo,
    btnGuardar,
    form,
    inputId,
    inputCliente,
    inputDestino,
    inputSalida,
    inputRegreso,
    inputPasajeros,
    inputEstado,
    inputTotal,
    inputImagen
  } = refs;

  form.reset();
  inputId.value = "";

  if (id) {
    const reserva = reservasData.find((r) => r.id === id);
    if (!reserva) return;

    titulo.textContent = "Editar Reserva";
    btnGuardar.textContent = "Actualizar";
    inputId.value = reserva.id;
    inputCliente.value = reserva.cliente;
    inputDestino.value = reserva.destino;
    inputSalida.value = reserva.fechaSalida;
    inputRegreso.value = reserva.fechaRegreso;
    inputPasajeros.value = reserva.pasajeros;
    inputEstado.value = reserva.estado;
    inputTotal.value = reserva.total;
    inputImagen.value = reserva.imagen || "";
  } else {
    titulo.textContent = "Nueva Reserva";
    btnGuardar.textContent = "Guardar Reserva";
  }

  modal.classList.add("active");
}

function cerrarModalReserva() {
  const modal = document.getElementById("modal-reserva");
  if (modal) modal.classList.remove("active");
}

function guardarReserva(event) {
  event.preventDefault();

  const refs = obtenerElementosModalReserva();
  if (!refs) return;

  const {
    inputId,
    inputCliente,
    inputDestino,
    inputSalida,
    inputRegreso,
    inputPasajeros,
    inputEstado,
    inputTotal,
    inputImagen
  } = refs;

  const id = inputId.value.trim();
  const cliente = inputCliente.value.trim();
  const destino = inputDestino.value.trim();
  const fechaSalida = inputSalida.value;
  const fechaRegreso = inputRegreso.value;
  const pasajeros = parseInt(inputPasajeros.value, 10);
  const estado = inputEstado.value;
  const total = parseInt(inputTotal.value, 10);
  const imagen = inputImagen.value.trim();

  if (!cliente || !destino || !fechaSalida || !fechaRegreso || !pasajeros || !total) {
    alert("Completa todos los campos obligatorios.");
    return;
  }

  if (id) {
    const index = reservasData.findIndex((r) => r.id === id);
    if (index !== -1) {
      reservasData[index] = {
        ...reservasData[index],
        cliente,
        destino,
        fechaSalida,
        fechaRegreso,
        pasajeros,
        estado,
        total,
        imagen
      };
    }
  } else {
    reservasData.push({
      id: Date.now().toString(),
      cliente,
      destino,
      fechaSalida,
      fechaRegreso,
      pasajeros,
      estado,
      total,
      imagen
    });
  }

  cerrarModalReserva();
  renderReservas();
}

function eliminarReserva(id) {
  if (!window.confirm("¿Seguro que quieres eliminar esta reserva?")) return;
  reservasData = reservasData.filter((r) => r.id !== id);
  renderReservas();
}

function actualizarEstadisticasReservas() {
  const total = document.getElementById("stat-total-reservas");
  const pendientes = document.getElementById("stat-pendientes");
  const confirmadas = document.getElementById("stat-confirmadas");
  const ingresos = document.getElementById("stat-ingresos");

  if (total) total.textContent = reservasData.length;
  if (pendientes) pendientes.textContent = reservasData.filter(r => r.estado === "pendiente").length;
  if (confirmadas) confirmadas.textContent = reservasData.filter(r => r.estado === "confirmada").length;
  if (ingresos) {
    const suma = reservasData.reduce((acc, r) => acc + r.total, 0);
    ingresos.textContent = "$" + suma.toLocaleString("es-CO");
  }
}

function filtrarReservas() {
  const input = document.getElementById("search-reservas");
  if (!input) return;

  const texto = input.value.toLowerCase();
  const filtradas = reservasData.filter((r) =>
    r.cliente.toLowerCase().includes(texto) ||
    r.destino.toLowerCase().includes(texto)
  );

  renderReservas(filtradas);
}