console.log("reportes.js cargado correctamente");

let chartIngresosDestino = null;
let chartReservasVueloMes = null;
let chartSectorGeografico = null;

function renderReportes() {
  if (typeof Chart === "undefined") {
    console.error("Chart.js no está cargado.");
    return;
  }

  const reservas = typeof reservasData !== "undefined" ? reservasData : [];
  const clientes = typeof clientesData !== "undefined" ? clientesData : [];
  const tiquetes = typeof tiquetesData !== "undefined" ? tiquetesData : [];

  const reservasEnriquecidas = reservas.map((reserva, index) => {
    const fechaReserva = new Date(reserva.fechaSalida);
    fechaReserva.setDate(fechaReserva.getDate() - (index + 2));

    let fechaConfirmacion = null;
    if (reserva.estado === "confirmada") {
      fechaConfirmacion = new Date(fechaReserva);
      fechaConfirmacion.setDate(fechaConfirmacion.getDate() + (index % 3) + 1);
    }

    let causaCancelacion = "No aplica";
    if (reserva.estado === "cancelada") {
      const causas = [
        "Cambio de plan del cliente",
        "Pago no completado",
        "No disponibilidad",
        "Solicitud del cliente"
      ];
      causaCancelacion = causas[index % causas.length];
    }

    return {
      ...reserva,
      fechaReservaGenerada: fechaReserva,
      fechaConfirmacionGenerada: fechaConfirmacion,
      causaCancelacion
    };
  });

  actualizarKPIs(reservasEnriquecidas, clientes);
  renderChartIngresosMensualesPorDestino(reservasEnriquecidas);
  renderChartReservasPorVueloYMes(tiquetes);
  renderChartDestinosPorSector(reservasEnriquecidas);
  renderTablaClientesFrecuentes(reservasEnriquecidas, clientes);
  renderTablaCoberturaDestinos(tiquetes);
  renderTablaHistorialReservas(reservasEnriquecidas);
  renderTablaCanceladas(reservasEnriquecidas);
  renderTablaTiempoConfirmacion(reservasEnriquecidas);
}

function actualizarKPIs(reservas, clientes) {
  const ingresosTotales = reservas.reduce((acc, r) => acc + (r.total || 0), 0);
  const reservasTotales = reservas.length;
  const canceladas = reservas.filter(r => r.estado === "cancelada").length;

  const mapaClientes = {};
  reservas.forEach(r => {
    mapaClientes[r.cliente] = (mapaClientes[r.cliente] || 0) + 1;
  });
  const clientesFrecuentes = Object.values(mapaClientes).filter(cantidad => cantidad >= 2).length;

  const elIngresos = document.getElementById("kpi-ingresos-totales");
  const elReservas = document.getElementById("kpi-reservas-totales");
  const elFrecuentes = document.getElementById("kpi-clientes-frecuentes");
  const elCanceladas = document.getElementById("kpi-canceladas");

  if (elIngresos) elIngresos.textContent = "$" + ingresosTotales.toLocaleString("es-CO");
  if (elReservas) elReservas.textContent = reservasTotales;
  if (elFrecuentes) elFrecuentes.textContent = clientesFrecuentes;
  if (elCanceladas) elCanceladas.textContent = canceladas;
}

function obtenerMes(fecha) {
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const d = new Date(fecha);
  return meses[d.getMonth()];
}

function limpiarDestino(destino) {
  return destino.split(",")[0].trim();
}

function obtenerSectorGeografico(destino) {
  const destinoLimpio = limpiarDestino(destino).toLowerCase();

  const mapa = {
    "cartagena": { pais: "Colombia", departamento: "Bolívar", ciudad: "Cartagena", sector: "Caribe" },
    "san andrés": { pais: "Colombia", departamento: "San Andrés", ciudad: "San Andrés", sector: "Insular" },
    "santa marta": { pais: "Colombia", departamento: "Magdalena", ciudad: "Santa Marta", sector: "Caribe" },
    "eje cafetero": { pais: "Colombia", departamento: "Quindío", ciudad: "Armenia", sector: "Andina" },
    "cancún": { pais: "México", departamento: "Quintana Roo", ciudad: "Cancún", sector: "Internacional" },
    "miami": { pais: "Estados Unidos", departamento: "Florida", ciudad: "Miami", sector: "Internacional" }
  };

  return mapa[destinoLimpio] || {
    pais: "No definido",
    departamento: "No definido",
    ciudad: limpiarDestino(destino),
    sector: "Otros"
  };
}

function renderChartIngresosMensualesPorDestino(reservas) {
  const ctx = document.getElementById("chart-ingresos-destino");
  if (!ctx) return;

  const agrupado = {};

  reservas.forEach(r => {
    const mes = obtenerMes(r.fechaSalida);
    const destino = limpiarDestino(r.destino);
    const clave = `${mes} - ${destino}`;

    agrupado[clave] = (agrupado[clave] || 0) + r.total;
  });

  const labels = Object.keys(agrupado);
  const data = Object.values(agrupado);

  if (chartIngresosDestino) chartIngresosDestino.destroy();

  chartIngresosDestino = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Ingresos",
        data,
        backgroundColor: "#0a68bd",
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => "$" + Number(value).toLocaleString("es-CO")
          }
        }
      }
    }
  });
}

function renderChartReservasPorVueloYMes(tiquetes) {
  const ctx = document.getElementById("chart-reservas-vuelo-mes");
  if (!ctx) return;

  const agrupado = {};

  tiquetes.forEach(t => {
    const mes = obtenerMes(t.fechaVuelo);
    const clave = `${mes} - ${t.numeroTiquete}`;
    agrupado[clave] = (agrupado[clave] || 0) + 1;
  });

  const labels = Object.keys(agrupado);
  const data = Object.values(agrupado);

  if (chartReservasVueloMes) chartReservasVueloMes.destroy();

  chartReservasVueloMes = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Reservas",
        data,
        borderColor: "#f97316",
        backgroundColor: "#f97316",
        borderWidth: 3,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#f97316",
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });
}

function renderChartDestinosPorSector(reservas) {
  const ctx = document.getElementById("chart-sector-geografico");
  if (!ctx) return;

  const agrupado = {};

  reservas.forEach(r => {
    const meta = obtenerSectorGeografico(r.destino);
    agrupado[meta.sector] = (agrupado[meta.sector] || 0) + 1;
  });

  const labels = Object.keys(agrupado);
  const data = Object.values(agrupado);

  if (chartSectorGeografico) chartSectorGeografico.destroy();

  chartSectorGeografico = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ["#0a68bd", "#f97316", "#22c55e", "#a855f7", "#ef4444"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "60%",
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

function renderTablaClientesFrecuentes(reservas, clientes) {
  const contenedor = document.getElementById("tabla-clientes-frecuentes");
  if (!contenedor) return;

  const conteo = {};

  reservas.forEach(r => {
    if (!conteo[r.cliente]) {
      conteo[r.cliente] = { cliente: r.cliente, reservas: 0, total: 0 };
    }
    conteo[r.cliente].reservas += 1;
    conteo[r.cliente].total += r.total || 0;
  });

  const ranking = Object.values(conteo)
    .sort((a, b) => b.reservas - a.reservas || b.total - a.total);

  contenedor.innerHTML = crearTabla(
    ["Cliente", "Reservas", "Total generado"],
    ranking.map(item => [
      item.cliente,
      item.reservas,
      "$" + item.total.toLocaleString("es-CO")
    ])
  );
}

function renderTablaCoberturaDestinos(tiquetes) {
  const contenedor = document.getElementById("tabla-cobertura-destinos");
  if (!contenedor) return;

  const filas = tiquetes.map(t => {
    const meta = obtenerSectorGeografico(t.destino);
    return [
      t.numeroTiquete,
      meta.pais,
      meta.departamento,
      meta.ciudad,
      t.destino
    ];
  });

  contenedor.innerHTML = crearTabla(
    ["Vuelo", "País", "Departamento", "Ciudad", "Destino"],
    filas
  );
}

function renderTablaHistorialReservas(reservas) {
  const contenedor = document.getElementById("tabla-historial-clientes");
  if (!contenedor) return;

  const filas = reservas
    .slice()
    .sort((a, b) => new Date(b.fechaSalida) - new Date(a.fechaSalida))
    .map(r => [
      r.cliente,
      r.destino,
      r.fechaSalida,
      r.estado,
      "$" + (r.total || 0).toLocaleString("es-CO")
    ]);

  contenedor.innerHTML = crearTabla(
    ["Cliente", "Destino", "Fecha salida", "Estado", "Total"],
    filas
  );
}

function renderTablaCanceladas(reservas) {
  const contenedor = document.getElementById("tabla-canceladas");
  if (!contenedor) return;

  const canceladas = reservas.filter(r => r.estado === "cancelada");

  if (canceladas.length === 0) {
    contenedor.innerHTML = `<p class="text-muted">No hay reservas canceladas registradas actualmente.</p>`;
    return;
  }

  const filas = canceladas.map(r => [
    r.cliente,
    r.destino,
    r.fechaSalida,
    r.causaCancelacion
  ]);

  contenedor.innerHTML = crearTabla(
    ["Cliente", "Destino", "Fecha", "Causa"],
    filas
  );
}

function renderTablaTiempoConfirmacion(reservas) {
  const contenedor = document.getElementById("tabla-tiempo-confirmacion");
  if (!contenedor) return;

  const confirmadas = reservas.filter(r => r.estado === "confirmada" && r.fechaConfirmacionGenerada);

  if (confirmadas.length === 0) {
    contenedor.innerHTML = `<p class="text-muted">No hay datos suficientes para calcular el tiempo promedio.</p>`;
    return;
  }

  const filas = confirmadas.map(r => {
    const diferenciaMs = r.fechaConfirmacionGenerada - r.fechaReservaGenerada;
    const dias = Math.round(diferenciaMs / (1000 * 60 * 60 * 24));

    return [
      r.cliente,
      r.destino,
      formatearFecha(r.fechaReservaGenerada),
      formatearFecha(r.fechaConfirmacionGenerada),
      dias + " día(s)"
    ];
  });

  const promedioDias = Math.round(
    confirmadas.reduce((acc, r) => {
      const diferenciaMs = r.fechaConfirmacionGenerada - r.fechaReservaGenerada;
      return acc + (diferenciaMs / (1000 * 60 * 60 * 24));
    }, 0) / confirmadas.length
  );

  contenedor.innerHTML = `
    <div class="info-row" style="margin-bottom: 1rem;">
      <span><strong>Promedio general:</strong> ${promedioDias} día(s)</span>
    </div>
    ${crearTabla(
      ["Cliente", "Destino", "Reserva", "Confirmación", "Tiempo"],
      filas
    )}
  `;
}

function formatearFecha(fecha) {
  const d = new Date(fecha);
  return d.toISOString().split("T")[0];
}

function crearTabla(headers, rows) {
  if (!rows.length) {
    return `<p class="text-muted">No hay datos disponibles.</p>`;
  }

  const thead = `
    <thead>
      <tr>
        ${headers.map(h => `<th style="text-align:left; padding:0.75rem; border-bottom:1px solid #e5e7eb;">${h}</th>`).join("")}
      </tr>
    </thead>
  `;

  const tbody = `
    <tbody>
      ${rows.map(row => `
        <tr>
          ${row.map(cell => `<td style="padding:0.75rem; border-bottom:1px solid #f1f5f9;">${cell}</td>`).join("")}
        </tr>
      `).join("")}
    </tbody>
  `;

  return `
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:0.95rem;">
        ${thead}
        ${tbody}
      </table>
    </div>
  `;
}