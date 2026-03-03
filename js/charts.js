/**
 * ========================================
 * CHARTS - Chart Rendering Utilities
 * ========================================
 */

// Theme colors are now managed centrally via getPieChartColors() and getThemeColors() in config.js

/**
 * Show skeleton loaders for charts
 */
function showChartSkeletons() {
  // Show pie chart skeletons by ID
  const pieInfSkeleton = document.getElementById('skeleton-pieInf');
  const pieNonInfSkeleton = document.getElementById('skeleton-pieNonInf');
  
  if (pieInfSkeleton) pieInfSkeleton.style.display = 'flex';
  if (pieNonInfSkeleton) pieNonInfSkeleton.style.display = 'flex';
  
  // Hide canvas elements while skeleton is shown
  const canvasPieInf = document.getElementById('pieInf');
  const canvasPieNonInf = document.getElementById('pieNonInf');
  const canvasBarKelas = document.getElementById('barKelas');
  
  if (canvasPieInf) canvasPieInf.style.display = 'none';
  if (canvasPieNonInf) canvasPieNonInf.style.display = 'none';
  if (canvasBarKelas) canvasBarKelas.style.display = 'none';
  
  // Show bar chart skeleton
  const barSkeleton = document.getElementById('skeleton-barKelas');
  if (barSkeleton) barSkeleton.style.display = 'flex';
}

/**
 * Hide skeleton loaders for charts
 * Uses same delay as stats (CONFIG.ANIMATION.SKELETON = 2500ms) for consistent UX
 */
function hideChartSkeletons() {
  // Hide pie chart skeletons
  const pieInfSkeleton = document.getElementById('skeleton-pieInf');
  const pieNonInfSkeleton = document.getElementById('skeleton-pieNonInf');
  
  if (pieInfSkeleton) pieInfSkeleton.style.display = 'none';
  if (pieNonInfSkeleton) pieNonInfSkeleton.style.display = 'none';
  
  // Show canvas elements after skeleton is hidden
  const canvasPieInf = document.getElementById('pieInf');
  const canvasPieNonInf = document.getElementById('pieNonInf');
  const canvasBarKelas = document.getElementById('barKelas');
  
  if (canvasPieInf) canvasPieInf.style.display = 'block';
  if (canvasPieNonInf) canvasPieNonInf.style.display = 'block';
  if (canvasBarKelas) canvasBarKelas.style.display = 'block';
  
  // Hide bar chart skeleton
  const barSkeleton = document.getElementById('skeleton-barKelas');
  if (barSkeleton) barSkeleton.style.display = 'none';
}

/**
 * Render all charts
 * Called AFTER data is successfully fetched
 */
function renderCharts(kelasData) {
  if (!Array.isArray(kelasData)) {
    console.error("kelasData bukan array");
    hideChartSkeletons();
    return;
  }

  // Store data
  setCachedData(kelasData);

  const kelasInf = kelasData.filter(k => k.totalInformatika > 0);
  const kelasNonInf = kelasData.filter(k => k.totalInformatika === 0);

  // Render charts first (without showing them)
  renderPieCharts(kelasInf, kelasNonInf);
  renderBarChart();
  
  // Hide skeletons after same delay as stats (2500ms) for consistent UX
  setTimeout(() => {
    hideChartSkeletons();
  }, CONFIG.ANIMATION.SKELETON);
}

/**
 * Render both Pie Charts with improved legend
 * Uses centralized theme utilities (DRY principle)
 */
function buildPieOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        bottom: 10
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 10,
          boxHeight: 10,
          // Get theme colors dynamically on each render
          color: getThemeColors().legendColor,
          font: {
            size: 12,
            family: "'Plus Jakarta Sans', sans-serif",
            weight: '500'
          }
        }
      },
      tooltip: {
        // Get theme colors dynamically
        backgroundColor: getThemeColors().tooltipBg,
        titleColor: getThemeColors().tooltipTitle,
        bodyColor: getThemeColors().tooltipBody,
        borderColor: getThemeColors().borderLight,
        borderWidth: 1,
        padding: 12
      }
    }
  };
}

function renderPieCharts(kelasInf, kelasNonInf) {
  const pieColors = getPieChartColors();
  const themeColors = getThemeColors();
  const options = buildPieOptions();

  createOrUpdatePieChart(
    "pieInf",
    "pieInf",
    kelasInf.map(k => k.kelas),
    kelasInf.map(k => k.totalInformatika),
    pieColors,
    themeColors,
    options
  );

  createOrUpdatePieChart(
    "pieNonInf",
    "pieNonInf",
    kelasNonInf.map(k => k.kelas),
    kelasNonInf.map(k => k.total),
    pieColors,
    themeColors,
    options
  );
}

function createOrUpdatePieChart(
  key,
  canvasId,
  labels,
  data,
  colors,
  themeColors,
  options
) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  if (!STATE.charts[key]) {
    STATE.charts[key] = new Chart(canvas, {
      type: "pie",
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: themeColors.border
        }]
      },
      options
    });
  } else {
    const chart = STATE.charts[key];

    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].backgroundColor = colors;
    chart.data.datasets[0].borderColor = themeColors.border;

    chart.options = buildPieOptions();
    chart.update();
  }
}

/**
 * Render Bar Chart
 */
function renderBarChart() {
  if (!STATE.cachedKelasData.length) return;

  const canvas = document.getElementById("barKelas");
  if (!canvas) return;

  let kelasInf = STATE.cachedKelasData.filter(k => k.totalInformatika > 0);
  kelasInf = filterByTingkat(kelasInf, STATE.filters.tingkat);

  const dataset = buildSubmissionDataset(kelasInf, STATE.filters.mode);

  const labels = dataset.map(d => d.kelas);
  const sudah = dataset.map(d => d.sudah);
  const belum = dataset.map(d => d.belum);

  const colors = getChartColors();

  // Create new chart if not exists
  if (!STATE.charts.bar) {
    STATE.charts.bar = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Sudah Kumpul",
            data: sudah,
            backgroundColor: colors.hijau,
            borderColor: colors.hijauBorder,
            borderWidth: 1,
            stack: "total",
            barPercentage: 0.7,
            categoryPercentage: 0.7,
          },
          {
            label: "Belum Kumpul",
            data: belum,
            backgroundColor: colors.merah,
            borderColor: colors.merahBorder,
            borderWidth: 1,
            stack: "total",
            barPercentage: 0.7,
            categoryPercentage: 0.7,
          }
        ]
      },
      options: getBarChartOptions(colors),
      plugins: [percentagePlugin]
    });
  } else {
    // Update data only for smooth transition
    STATE.charts.bar.data.labels = labels;
    STATE.charts.bar.data.datasets[0].data = sudah;
    STATE.charts.bar.data.datasets[1].data = belum;
    STATE.charts.bar.update();
  }
}

/**
 * Get bar chart options with theme support
 * Uses centralized theme utilities (DRY principle)
 */
function getBarChartOptions(colors) {
  const themeColors = getThemeColors();
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: CONFIG.ANIMATION.CHART_DURATION,
      easing: 'easeOutQuart'
    },
    scales: {
      x: { 
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          minRotation: 0,
          color: colors.text
        },
        stacked: true,
        grid: { display: false }
      },
      y: { 
        stacked: true,
        beginAtZero: true,
        grid: { color: colors.gridY },
        ticks: {
          color: colors.text
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          boxWidth: 14,
          usePointStyle: true,
          pointStyle: 'rect',
          color: colors.text,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: themeColors.tooltipBg,
        titleColor: themeColors.tooltipTitle,
        bodyColor: themeColors.tooltipBody,
        borderColor: themeColors.borderLight,
        borderWidth: 1,
        padding: 12,
        callbacks: {
          afterBody: function(context) {
            const idx = context[0].dataIndex;
            const s = context[0].dataset.data[idx];
            const b = STATE.charts.bar.data.datasets[1].data[idx];
            const total = s + b;
            const percent = total > 0 ? Math.round((s / total) * 100) : 0;
            return `Progress: ${percent}%`;
          }
        }
      }
    }
  };
}

/**
 * Custom plugin to show percentage on bars
 * Uses centralized theme utilities (DRY principle)
 */
const percentagePlugin = {
  id: 'percentagePlugin',
  afterDatasetsDraw(chart) {
    const ctx = chart.ctx;
    const sudahDataset = chart.data.datasets[0];
    const meta = chart.getDatasetMeta(0);
    const themeColors = getThemeColors();
    const textColor = themeColors.isDark ? '#ffffff' : '#1e293b';

    meta.data.forEach((bar, index) => {
      const sudah = sudahDataset.data[index];
      const total = sudah + (chart.data.datasets[1]?.data[index] || 0);

      if (!total || sudah === 0) return;

      const percent = Math.round((sudah / total) * 100);
      const x = bar.x;
      const y = bar.y + (bar.height / 2);

      ctx.save();
      ctx.fillStyle = textColor;
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(percent + "%", x, y);
      ctx.restore();
    });
  }
};
