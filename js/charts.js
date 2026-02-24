function renderCharts(kelasData) {

  if (!Array.isArray(kelasData)) {
    console.error("kelasData bukan array");
    return;
  }

  cachedKelasData = kelasData;

  const kelasInf = kelasData.filter(k => k.totalInformatika > 0);
  const kelasNonInf = kelasData.filter(k => k.totalInformatika === 0);

  /* ================= PIE INFORMATIKA ================= */

  pieInfChart?.destroy();

  pieInfChart = new Chart(pieInf, {
    type: "pie",
    data: {
      labels: kelasInf.map(k => k.kelas),
      datasets: [{
        data: kelasInf.map(k => k.totalInformatika)
      }]
    },
    options: {
      responsive: true
    }
  });

  /* ================= PIE NON INFORMATIKA ================= */

  pieNonInfChart?.destroy();

  pieNonInfChart = new Chart(pieNonInf, {
    type: "pie",
    data: {
      labels: kelasNonInf.map(k => k.kelas),
      datasets: [{
        data: kelasNonInf.map(k => k.total)
      }]
    },
    options: {
      responsive: true
    }
  });

  /* ================= BAR CHART ================= */

  renderBarChart();
}

function renderBarChart() {

  if (!cachedKelasData.length) return;

  let kelasInf = cachedKelasData.filter(k => k.totalInformatika > 0);

  kelasInf = filterByTingkat(kelasInf, currentTingkat);

  const dataset = buildSubmissionDataset(kelasInf, currentMode);

  const labels = dataset.map(d => d.kelas);
  const sudah = dataset.map(d => d.sudah);
  const belum = dataset.map(d => d.belum);

  if (!barChart) {
    barChart = new Chart(barKelas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Sudah Kumpul",
            data: sudah,
            backgroundColor: "rgba(34,197,94,0.95)", // hijau sedikit soft
            stack: "total",
            barPercentage: 0.7,
            categoryPercentage: 0.7,
          },
          {
            label: "Belum Kumpul",
            data: belum,
            backgroundColor: "rgba(239,68,68,0.7)", // merah sedikit soft
            stack: "total",
            barPercentage: 0.7,
            categoryPercentage: 0.7,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 600,
          easing: 'easeOutQuart'
        },
        scales: {
          x: { 
            ticks: {
              autoSkip: true,
              maxRotation: 0,
              minRotation: 0
            },
            stacked: true,
            grid: { display: false }
          },
          y: { 
            stacked: true,
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.05)" }
          }
        },
        plugins: {
          legend: {
            labels: {
              boxWidth: 14
            }
          }
        }
      },
      plugins: [percentagePlugin]
    });
  } else {
    // 🔥 UPDATE DATA ONLY (SMOOTH TRANSITION)
    barChart.data.labels = labels;
    barChart.data.datasets[0].data = sudah;
    barChart.data.datasets[1].data = belum;
    barChart.update();
  }
}

const percentagePlugin = {
  id: 'percentagePlugin',
  afterDatasetsDraw(chart) {

    const { ctx } = chart;

    const sudahDataset = chart.data.datasets[0];
    const belumDataset = chart.data.datasets[1];

    const meta = chart.getDatasetMeta(0);

    meta.data.forEach((bar, index) => {

      const sudah = sudahDataset.data[index];
      const belum = belumDataset.data[index];
      const total = sudah + belum;

      if (!total || sudah === 0) return;

      const percent = Math.round((sudah / total) * 100);

      const x = bar.x;
      const y = bar.y + (bar.height / 2); // 🔥 tengah segment hijau

      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(percent + "%", x, y);
      ctx.restore();

    });
  }
};