console.log("tiquetes.js cargado correctamente");

let tiquetesData = [
  {
    id: "1",
    numeroTiquete: "BOG-CTG-2024-001",
    cliente: "Juan Pérez",
    origen: "Bogotá (BOG)",
    destino: "Cartagena (CTG)",
    fechaVuelo: "2026-04-15",
    horaVuelo: "08:30",
    aerolinea: "JetSky",
    clase: "economica",
    precio: 450000,
    puerta: "A12",
    asiento: "15A"
  },
  {
    id: "2",
    numeroTiquete: "MDE-SAN-2024-002",
    cliente: "María García",
    origen: "Medellín (MDE)",
    destino: "San Andrés (ADZ)",
    fechaVuelo: "2026-05-10",
    horaVuelo: "10:45",
    aerolinea: "JetSky",
    clase: "ejecutiva",
    precio: 1200000,
    puerta: "B08",
    asiento: "5C"
  },
  {
    id: "3",
    numeroTiquete: "CLO-MIA-2024-004",
    cliente: "Ana Martínez",
    origen: "Cali (CLO)",
    destino: "Miami (MIA)",
    fechaVuelo: "2026-04-22",
    horaVuelo: "06:15",
    aerolinea: "JetSky",
    clase: "primera",
    precio: 2800000,
    puerta: "D04",
    asiento: "2A"
  }
];

function obtenerElementosModalTiquete() {
  const elementos = {
    modal: document.getElementById("modal-tiquete"),
    titulo: document.getElementById("modal-tiquete-titulo"),
    btnGuardar: document.getElementById("btn-guardar-tiquete"),
    form: document.getElementById("form-tiquete"),
    inputId: document.getElementById("tiquete-id"),
    inputNumero: document.getElementById("tiquete-numero"),
    inputCliente: document.getElementById("tiquete-cliente"),
    inputOrigen: document.getElementById("tiquete-origen"),
    inputDestino: document.getElementById("tiquete-destino"),
    inputFecha: document.getElementById("tiquete-fecha"),
    inputHora: document.getElementById("tiquete-hora"),
    inputClase: document.getElementById("tiquete-clase"),
    inputPrecio: document.getElementById("tiquete-precio"),
    inputPuerta: document.getElementById("tiquete-puerta"),
    inputAsiento: document.getElementById("tiquete-asiento")
  };

  const faltantes = Object.entries(elementos)
    .filter(([, valor]) => !valor)
    .map(([clave]) => clave);

  if (faltantes.length > 0) {
    console.error("Faltan elementos del modal de tiquetes:", faltantes);
    return null;
  }

  return elementos;
}

function inicializarTiquetes() {
  renderTiquetes();

  const btnNuevo = document.getElementById("btn-nuevo-tiquete");
  const btnCerrar = document.getElementById("btn-cerrar-modal-tiquete");
  const btnCancelar = document.getElementById("btn-cancelar-modal-tiquete");
  const buscador = document.getElementById("search-tiquetes");
  const form = document.getElementById("form-tiquete");
  const modal = document.getElementById("modal-tiquete");
  const grid = document.getElementById("tiquetes-grid");

  if (btnNuevo) btnNuevo.onclick = () => abrirModalTiquete();
  if (btnCerrar) btnCerrar.onclick = cerrarModalTiquete;
  if (btnCancelar) btnCancelar.onclick = cerrarModalTiquete;
  if (buscador) buscador.oninput = filtrarTiquetes;
  if (form) form.onsubmit = guardarTiquete;

  if (modal) {
    modal.onclick = function (e) {
      if (e.target === modal) cerrarModalTiquete();
    };
  }

  if (grid) {
    grid.onclick = function (e) {
      const btnEditar = e.target.closest("[data-editar]");
      const btnEliminar = e.target.closest("[data-eliminar]");

      if (btnEditar) abrirModalTiquete(btnEditar.dataset.editar);
      if (btnEliminar) eliminarTiquete(btnEliminar.dataset.eliminar);
    };
  }
}

function renderTiquetes(datos = tiquetesData) {
  const grid = document.getElementById("tiquetes-grid");
  if (!grid) return;

  grid.innerHTML = "";

  datos.forEach((tiquete) => {
    let badgeText = "Económica";
    let badgeStyle = "background:#dbeafe; color:#1e40af;";
    let headerColor = "linear-gradient(to right, #2563eb, #4f46e5)";

    if (tiquete.clase === "ejecutiva") {
      badgeText = "Ejecutiva";
      badgeStyle = "background:#f3e8ff; color:#6b21a8;";
      headerColor = "linear-gradient(to right, #7c3aed, #6d28d9)";
    } else if (tiquete.clase === "primera") {
      badgeText = "Primera";
      badgeStyle = "background:#fef3c7; color:#b45309;";
      headerColor = "linear-gradient(to right, #f59e0b, #d97706)";
    }

    const precio = tiquete.precio.toLocaleString("es-CO");

    grid.insertAdjacentHTML("beforeend", `
      <div class="customer-card">
        <div class="card-header" style="background:${headerColor}; color:white;">
          <div>
            <h3 class="customer-name" style="color:white;">${tiquete.destino}</h3>
            <span class="badge" style="${badgeStyle}">${badgeText}</span>
          </div>
        </div>

        <div class="card-body">
          <div class="info-row"><span><strong>Aerolínea:</strong> ${tiquete.aerolinea}</span></div>
          <div class="info-row"><span><strong>Número:</strong> ${tiquete.numeroTiquete}</span></div>
          <div class="info-row"><span><strong>Cliente:</strong> ${tiquete.cliente}</span></div>
          <div class="info-row"><span><strong>Origen:</strong> ${tiquete.origen}</span></div>
          <div class="info-row"><span><strong>Destino:</strong> ${tiquete.destino}</span></div>
          <div class="info-row"><span><strong>Fecha:</strong> ${tiquete.fechaVuelo}</span></div>
          <div class="info-row"><span><strong>Hora:</strong> ${tiquete.horaVuelo}</span></div>
          <div class="info-row"><span><strong>Puerta:</strong> ${tiquete.puerta}</span></div>
          <div class="info-row"><span><strong>Asiento:</strong> ${tiquete.asiento}</span></div>
          <div class="info-row"><span><strong>Precio:</strong> $${precio}</span></div>

          <div class="card-actions">
            <button type="button" class="btn btn-outline flex-1 justify-center" data-editar="${tiquete.id}">
              Editar
            </button>
            <button type="button" class="btn btn-outline btn-icon text-red" data-eliminar="${tiquete.id}">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    `);
  });

  actualizarEstadisticasTiquetes();
}

function abrirModalTiquete(id = null) {
  const refs = obtenerElementosModalTiquete();
  if (!refs) return;

  const {
    modal,
    titulo,
    btnGuardar,
    form,
    inputId,
    inputNumero,
    inputCliente,
    inputOrigen,
    inputDestino,
    inputFecha,
    inputHora,
    inputClase,
    inputPrecio,
    inputPuerta,
    inputAsiento
  } = refs;

  form.reset();
  inputId.value = "";

  if (id) {
    const tiquete = tiquetesData.find((t) => t.id === id);
    if (!tiquete) return;

    titulo.textContent = "Editar Tiquete";
    btnGuardar.textContent = "Actualizar";
    inputId.value = tiquete.id;
    inputNumero.value = tiquete.numeroTiquete;
    inputCliente.value = tiquete.cliente;
    inputOrigen.value = tiquete.origen;
    inputDestino.value = tiquete.destino;
    inputFecha.value = tiquete.fechaVuelo;
    inputHora.value = tiquete.horaVuelo;
    inputClase.value = tiquete.clase;
    inputPrecio.value = tiquete.precio;
    inputPuerta.value = tiquete.puerta;
    inputAsiento.value = tiquete.asiento;
  } else {
    titulo.textContent = "Nuevo Tiquete";
    btnGuardar.textContent = "Guardar Tiquete";
  }

  modal.classList.add("active");
}

function cerrarModalTiquete() {
  const modal = document.getElementById("modal-tiquete");
  if (modal) modal.classList.remove("active");
}

function guardarTiquete(event) {
  event.preventDefault();

  const refs = obtenerElementosModalTiquete();
  if (!refs) return;

  const {
    inputId,
    inputNumero,
    inputCliente,
    inputOrigen,
    inputDestino,
    inputFecha,
    inputHora,
    inputClase,
    inputPrecio,
    inputPuerta,
    inputAsiento
  } = refs;

  const id = inputId.value.trim();
  const numeroTiquete = inputNumero.value.trim();
  const cliente = inputCliente.value.trim();
  const origen = inputOrigen.value.trim();
  const destino = inputDestino.value.trim();
  const fechaVuelo = inputFecha.value;
  const horaVuelo = inputHora.value;
  const aerolinea = "JetSky";
  const clase = inputClase.value;
  const precio = parseInt(inputPrecio.value, 10);
  const puerta = inputPuerta.value.trim();
  const asiento = inputAsiento.value.trim();

  if (!numeroTiquete || !cliente || !origen || !destino || !fechaVuelo || !horaVuelo || !precio || !puerta || !asiento) {
    alert("Completa todos los campos obligatorios.");
    return;
  }

  if (id) {
    const index = tiquetesData.findIndex((t) => t.id === id);
    if (index !== -1) {
      tiquetesData[index] = {
        ...tiquetesData[index],
        numeroTiquete,
        cliente,
        origen,
        destino,
        fechaVuelo,
        horaVuelo,
        aerolinea,
        clase,
        precio,
        puerta,
        asiento
      };
    }
  } else {
    tiquetesData.push({
      id: Date.now().toString(),
      numeroTiquete,
      cliente,
      origen,
      destino,
      fechaVuelo,
      horaVuelo,
      aerolinea,
      clase,
      precio,
      puerta,
      asiento
    });
  }

  cerrarModalTiquete();
  renderTiquetes();
}

function eliminarTiquete(id) {
  if (!window.confirm("¿Seguro que quieres eliminar este tiquete?")) return;
  tiquetesData = tiquetesData.filter((t) => t.id !== id);
  renderTiquetes();
}

function actualizarEstadisticasTiquetes() {
  const total = document.getElementById("stat-total-tiquetes");
  const economica = document.getElementById("stat-economica");
  const ejecutiva = document.getElementById("stat-ejecutiva");
  const primera = document.getElementById("stat-primera");

  if (total) total.textContent = tiquetesData.length;
  if (economica) economica.textContent = tiquetesData.filter(t => t.clase === "economica").length;
  if (ejecutiva) ejecutiva.textContent = tiquetesData.filter(t => t.clase === "ejecutiva").length;
  if (primera) primera.textContent = tiquetesData.filter(t => t.clase === "primera").length;
}

function filtrarTiquetes() {
  const input = document.getElementById("search-tiquetes");
  if (!input) return;

  const texto = input.value.toLowerCase();
  const filtrados = tiquetesData.filter((t) =>
    t.cliente.toLowerCase().includes(texto) ||
    t.origen.toLowerCase().includes(texto) ||
    t.destino.toLowerCase().includes(texto)
  );

  renderTiquetes(filtrados);
}