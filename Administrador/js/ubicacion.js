console.log("cuentas.js cargado correctamente");

let cuentasData = [
  {
    id: "1",
    nombre: "Cliente JetSky",
    email: "cliente.cliente00@gmail.com",
    rol: "cliente",
    estado: "activa",
    telefono: "",
    password: "12345678"
  },
  {
    id: "2",
    nombre: "Operario JetSky",
    email: "asesor.asesor00@gmail.com",
    rol: "operario",
    estado: "activa",
    telefono: "",
    password: "12345678"
  },
  {
    id: "3",
    nombre: "Administrador JetSky",
    email: "admin.admin00@gmail.com",
    rol: "administrador",
    estado: "activa",
    telefono: "",
    password: "12345678"
  }
];

function obtenerElementosModalCuenta() {
  const elementos = {
    modal: document.getElementById("modal-cuenta"),
    titulo: document.getElementById("modal-cuenta-titulo"),
    btnGuardar: document.getElementById("btn-guardar-cuenta"),
    form: document.getElementById("form-cuenta"),
    inputId: document.getElementById("cuenta-id"),
    inputNombre: document.getElementById("cuenta-nombre"),
    inputEmail: document.getElementById("cuenta-email"),
    inputRol: document.getElementById("cuenta-rol"),
    inputEstado: document.getElementById("cuenta-estado"),
    inputTelefono: document.getElementById("cuenta-telefono"),
    inputPassword: document.getElementById("cuenta-password")
  };

  const faltantes = Object.entries(elementos)
    .filter(([, valor]) => !valor)
    .map(([clave]) => clave);

  if (faltantes.length > 0) {
    console.error("Faltan elementos del modal de cuentas:", faltantes);
    return null;
  }

  return elementos;
}

function inicializarCuentas() {
  renderCuentas();

  const btnNueva = document.getElementById("btn-nueva-cuenta");
  const btnCerrar = document.getElementById("btn-cerrar-modal-cuenta");
  const btnCancelar = document.getElementById("btn-cancelar-modal-cuenta");
  const buscador = document.getElementById("search-cuentas");
  const form = document.getElementById("form-cuenta");
  const modal = document.getElementById("modal-cuenta");
  const grid = document.getElementById("cuentas-grid");

  if (btnNueva) btnNueva.onclick = () => abrirModalCuenta();
  if (btnCerrar) btnCerrar.onclick = cerrarModalCuenta;
  if (btnCancelar) btnCancelar.onclick = cerrarModalCuenta;
  if (buscador) buscador.oninput = filtrarCuentas;
  if (form) form.onsubmit = guardarCuenta;

  if (modal) {
    modal.onclick = function (e) {
      if (e.target === modal) cerrarModalCuenta();
    };
  }

  if (grid) {
    grid.onclick = function (e) {
      const btnEditar = e.target.closest("[data-editar]");
      const btnEliminar = e.target.closest("[data-eliminar]");

      if (btnEditar) abrirModalCuenta(btnEditar.dataset.editar);
      if (btnEliminar) eliminarCuenta(btnEliminar.dataset.eliminar);
    };
  }
}

function renderCuentas(datos = cuentasData) {
  const grid = document.getElementById("cuentas-grid");
  if (!grid) return;

  grid.innerHTML = "";

  datos.forEach((cuenta) => {
    let badgeClass = "badge-nuevo";
    let badgeTexto = "Cliente";

    if (cuenta.rol === "operario") {
      badgeClass = "badge-frecuente";
      badgeTexto = "Operario";
    } else if (cuenta.rol === "administrador") {
      badgeClass = "badge-vip";
      badgeTexto = "Administrador";
    }

    const estadoColor = cuenta.estado === "activa" ? "text-green" : "text-red";

    grid.insertAdjacentHTML("beforeend", `
      <div class="customer-card">
        <div class="card-header bg-blue-light">
          <div>
            <h3 class="customer-name">${cuenta.nombre}</h3>
            <span class="badge ${badgeClass}">${badgeTexto}</span>
          </div>
        </div>

        <div class="card-body">
          <div class="info-row"><span><strong>Correo:</strong> ${cuenta.email}</span></div>
          <div class="info-row"><span><strong>Teléfono:</strong> ${cuenta.telefono || "Sin teléfono"}</span></div>
          <div class="info-row"><span><strong>Estado:</strong> <span class="${estadoColor}">${cuenta.estado}</span></span></div>
          <div class="info-row"><span><strong>Contraseña:</strong> ${cuenta.password}</span></div>

          <div class="card-actions">
            <button type="button" class="btn btn-outline flex-1 justify-center" data-editar="${cuenta.id}">
              Editar
            </button>
            <button type="button" class="btn btn-outline btn-icon text-red" data-eliminar="${cuenta.id}">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    `);
  });

  actualizarEstadisticasCuentas();
}

function abrirModalCuenta(id = null) {
  const refs = obtenerElementosModalCuenta();
  if (!refs) return;

  const {
    modal,
    titulo,
    btnGuardar,
    form,
    inputId,
    inputNombre,
    inputEmail,
    inputRol,
    inputEstado,
    inputTelefono,
    inputPassword
  } = refs;

  form.reset();
  inputId.value = "";

  if (id) {
    const cuenta = cuentasData.find((c) => c.id === id);
    if (!cuenta) return;

    titulo.textContent = "Editar Cuenta";
    btnGuardar.textContent = "Actualizar";
    inputId.value = cuenta.id;
    inputNombre.value = cuenta.nombre;
    inputEmail.value = cuenta.email;
    inputRol.value = cuenta.rol;
    inputEstado.value = cuenta.estado;
    inputTelefono.value = cuenta.telefono || "";
    inputPassword.value = cuenta.password;
  } else {
    titulo.textContent = "Nueva Cuenta";
    btnGuardar.textContent = "Guardar Cuenta";
  }

  modal.classList.add("active");
}

function cerrarModalCuenta() {
  const modal = document.getElementById("modal-cuenta");
  if (modal) modal.classList.remove("active");
}

function guardarCuenta(event) {
  event.preventDefault();

  const refs = obtenerElementosModalCuenta();
  if (!refs) return;

  const {
    inputId,
    inputNombre,
    inputEmail,
    inputRol,
    inputEstado,
    inputTelefono,
    inputPassword
  } = refs;

  const id = inputId.value.trim();
  const nombre = inputNombre.value.trim();
  const email = inputEmail.value.trim().toLowerCase();
  const rol = inputRol.value;
  const estado = inputEstado.value;
  const telefono = inputTelefono.value.trim();
  const password = inputPassword.value.trim();

  if (!nombre || !email || !rol || !estado || !password) {
    alert("Completa todos los campos obligatorios.");
    return;
  }

  const emailDuplicado = cuentasData.some((c) => c.email === email && c.id !== id);
  if (emailDuplicado) {
    alert("Ya existe una cuenta con ese correo.");
    return;
  }

  if (id) {
    const index = cuentasData.findIndex((c) => c.id === id);
    if (index !== -1) {
      cuentasData[index] = {
        ...cuentasData[index],
        nombre,
        email,
        rol,
        estado,
        telefono,
        password
      };
    }
  } else {
    cuentasData.push({
      id: Date.now().toString(),
      nombre,
      email,
      rol,
      estado,
      telefono,
      password
    });
  }

  cerrarModalCuenta();
  renderCuentas();
}

function eliminarCuenta(id) {
  if (!window.confirm("¿Seguro que quieres eliminar esta cuenta?")) return;
  cuentasData = cuentasData.filter((c) => c.id !== id);
  renderCuentas();
}

function actualizarEstadisticasCuentas() {
  const total = document.getElementById("stat-total-cuentas");
  const clientes = document.getElementById("stat-clientes");
  const operarios = document.getElementById("stat-operarios");
  const administradores = document.getElementById("stat-administradores");

  if (total) total.textContent = cuentasData.length;
  if (clientes) clientes.textContent = cuentasData.filter(c => c.rol === "cliente").length;
  if (operarios) operarios.textContent = cuentasData.filter(c => c.rol === "operario").length;
  if (administradores) administradores.textContent = cuentasData.filter(c => c.rol === "administrador").length;
}

function filtrarCuentas() {
  const input = document.getElementById("search-cuentas");
  if (!input) return;

  const texto = input.value.toLowerCase();

  const filtradas = cuentasData.filter((c) =>
    c.nombre.toLowerCase().includes(texto) ||
    c.email.toLowerCase().includes(texto) ||
    c.rol.toLowerCase().includes(texto)
  );

  renderCuentas(filtradas);
}