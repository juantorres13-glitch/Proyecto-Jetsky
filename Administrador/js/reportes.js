console.log("¡El archivo reportes.js está listo para graficar, mijo!");

// Variables globales para los gráficos (para poder destruirlos si recargamos la pestaña)
let chartVentas = null;
let chartIngresos = null;
let chartDestinos = null;

// Datos quemados sacados del archivo React
const datosMensuales = [
  { mes: "Ene", ventas: 65, ingresos: 32.5 },
  { mes: "Feb", ventas: 78, ingresos: 39.0 },
  { mes: "Mar", ventas: 90, ingresos: 45.0 },
  { mes: "Abr", ventas: 81, ingresos: 40.5 },
  { mes: "May", ventas: 95, ingresos: 47.5 },
  { mes: "Jun", ventas: 110, ingresos: 55.0 }
];

const destinosData = [
  { nombre: "Cartagena", valor: 35, color: "#FF6B6B" },
  { nombre: "San Andrés", valor: 25, color: "#4ECDC4" },
  { nombre: "Eje Cafetero", valor: 20, color: "#45B7D1" },
  { nombre: "Santa Marta", valor: 15, color: "#FFA07A" },
  { nombre: "Otros", valor: 5, color: "#98D8C8" }
];

function renderReportes() {
  // Verificamos si la librería de gráficos cargó
  if (typeof Chart === 'undefined') {
    console.error("¡Pilas! No se ha cargado la librería Chart.js en el admin.html");
    return;
  }

  // 1. Gráfica de Barras (Ventas)
  const ctxVentas = document.getElementById('ventasChart');
  if (ctxVentas) {
    if (chartVentas) chartVentas.destroy(); // Limpiamos el viejo
    chartVentas = new Chart(ctxVentas, {
      type: 'bar',
      data: {
        labels: datosMensuales.map(d => d.mes),
        datasets: [{
          label: 'Reservas',
          data: datosMensuales.map(d => d.ventas),
          backgroundColor: '#f97316', // Color naranjita
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { borderDash: [4, 4] } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 2. Gráfica de Líneas (Ingresos)
  const ctxIngresos = document.getElementById('ingresosChart');
  if (ctxIngresos) {
    if (chartIngresos) chartIngresos.destroy();
    chartIngresos = new Chart(ctxIngresos, {
      type: 'line',
      data: {
        labels: datosMensuales.map(d => d.mes),
        datasets: [{
          label: 'Ingresos (Millones)',
          data: datosMensuales.map(d => d.ingresos),
          borderColor: '#3b82f6', // Color azul
          backgroundColor: '#3b82f6',
          tension: 0.3, // Curvita suave
          borderWidth: 2,
          pointBackgroundColor: 'white',
          pointBorderWidth: 2,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { 
            beginAtZero: true, 
            grid: { borderDash: [4, 4] },
            ticks: { callback: function(value) { return '$' + value + 'M'; } }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 3. Gráfica de Pastel (Destinos)
  const ctxDestinos = document.getElementById('destinosChart');
  if (ctxDestinos) {
    if (chartDestinos) chartDestinos.destroy();
    chartDestinos = new Chart(ctxDestinos, {
      type: 'doughnut', // Queda más bonito hueco en el centro
      data: {
        labels: destinosData.map(d => d.nombre),
        datasets: [{
          data: destinosData.map(d => d.valor),
          backgroundColor: destinosData.map(d => d.color),
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: { legend: { display: false } } // Apagamos la leyenda por defecto
      }
    });

    // Inyectamos nuestra leyenda personalizada al ladito para que quede como el diseño
    const leyendaContenedor = document.getElementById('destinos-leyenda');
    if (leyendaContenedor) {
      leyendaContenedor.innerHTML = destinosData.map(d => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background: var(--bg-app); border-radius: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 1rem; height: 1rem; border-radius: 0.25rem; background-color: ${d.color};"></div>
            <span>${d.nombre}</span>
          </div>
          <span style="color: var(--text-muted); font-weight: 500;">${d.valor}%</span>
        </div>
      `).join('');
    }
  }
}

function exportarPDF() {
  alert("Generando PDF de los reportes... (Esta función requiere una librería extra como jsPDF, pero ahí quedó el botón melo)");
}