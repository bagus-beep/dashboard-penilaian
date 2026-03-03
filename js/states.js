/**
 * ========================================
 * STATES - Application State Management
 * ========================================
 */

// Centralized state object
const STATE = {
  // Chart instances
  charts: {
    pieInf: null,
    pieNonInf: null,
    bar: null,
    line: null
  },
  
  // DataTable instance
  table: null,
  
  // Current filter states
  filters: {
    tingkat: "all",
    mode: 0  // 0=Individu, 1=Kelompok, 2=Total
  },
  
  // Cached data
  cachedKelasData: []
};

// Setter shortcuts with validation
const setFilters = (key, value) => {
  if (key in STATE.filters) {
    STATE.filters[key] = value;
  }
};

const setCachedData = (data) => {
  STATE.cachedKelasData = Array.isArray(data) ? data : [];
};

// ========================================
// UI INITIALIZATION
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initSegmentedControl();
  initMobileMenu();
});

/**
 * Initialize dark mode from localStorage
 */
function initTheme() {
  initThemeState(); // Use centralized theme utility
  
  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }
}

/**
 * Toggle dark/light theme and update all charts
 * Uses centralized theme utilities for DRY principle
 */
function toggleTheme() {
  toggleThemeState(); // Use centralized theme toggle
  
  // Update all charts with new theme
  updateAllCharts();
}

/**
 * Update all charts when theme changes
 * Centralized function - single source of truth for chart theme updates
 */
function updateAllCharts() {
  updatePieChartTheme(STATE.charts.pieInf);
  updatePieChartTheme(STATE.charts.pieNonInf);
  updateChartTheme();
}

function updatePieChartTheme(chart) {
  if (!chart) return;

  const pieColors = getPieChartColors();
  const themeColors = getThemeColors();

  // Update data colors
  chart.data.datasets[0].backgroundColor = pieColors;
  chart.data.datasets[0].borderColor = themeColors.border;
  
  // Update legend and tooltip colors
  chart.options.plugins.legend.labels.color = themeColors.legendColor;
  chart.options.plugins.tooltip.backgroundColor = themeColors.tooltipBg;
  chart.options.plugins.tooltip.titleColor = themeColors.tooltipTitle;
  chart.options.plugins.tooltip.bodyColor = themeColors.tooltipBody;
  
  // For generateLabels, we need to get fresh colors on each legend render
  // So we need to re-create the chart to fix the closure issue
  
  // Simple fix: just update the chart with animation
  chart.update();
}

/**
 * Initialize segmented control indicator
 */
function initSegmentedControl() {
  const indicator = document.getElementById("indicator");
  if (indicator) {
    moveIndicator(STATE.filters.mode);
  }
  
  // Initialize button states
  updateModeButtons(STATE.filters.mode);
}

/**
 * Initialize mobile menu toggle
 */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// ========================================
// FILTER FUNCTIONS
// ========================================

/**
 * Set submission mode (Individu/Kelompok/Total)
 */
function setMode(modeIndex) {
  if (modeIndex < 0 || modeIndex > 2) return;
  
  STATE.filters.mode = modeIndex;
  moveIndicator(modeIndex);
  updateModeButtons(modeIndex);
  renderBarChart();
}

/**
 * Move segmented control indicator
 */
function moveIndicator(index) {
  const indicator = document.getElementById("indicator");
  if (!indicator) return;
  
  indicator.style.width = `${100 / 3}%`;
  indicator.style.transform = `translateX(${index * 100}%)`;
}

/**
 * Update mode toggle button active states
 */
function updateModeButtons(activeIndex) {
  const buttons = document.querySelectorAll('.mode-toggle-btn');
  buttons.forEach((btn, idx) => {
    if (idx === activeIndex) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/**
 * Set tingkat filter
 */
function setTingkat(value) {
  STATE.filters.tingkat = value;
  renderBarChart();
  if (STATE.table) {
    STATE.table.ajax.reload(null, true);
  }
}

// ========================================
// DATA TRANSFORMATION
// ========================================

/**
 * Build submission dataset based on mode
 */
function buildSubmissionDataset(kelasInf, mode = 0) {
  if (!Array.isArray(kelasInf)) return [];
  
  const modeMap = {
    0: 'individuSudah',
    1: 'kelompokSudah',
    2: 'totalSudah'
  };
  
  return kelasInf.map(k => {
    const dataKey = modeMap[mode] || 'individuSudah';
    const sudah = k[dataKey] || 0;
    
    return {
      kelas: k.kelas,
      sudah,
      belum: (k.totalInformatika || 0) - sudah
    };
  });
}

/**
 * Filter data by tingkat
 */
function filterByTingkat(data, tingkat) {
  if (!Array.isArray(data)) return [];
  if (tingkat === "all") return data;
  
  return data.filter(k => 
    k.kelas && k.kelas.toLowerCase().startsWith(tingkat.toLowerCase())
  );
}

/**
 * Update bar chart colors based on current theme
 * Uses centralized theme utilities for DRY principle
 */
function updateChartTheme() {
  const colors = getChartColors();
  const themeColors = getThemeColors();
  const chart = STATE.charts.bar;
  
  if (chart && chart.data.datasets) {
    chart.data.datasets[0].backgroundColor = colors.hijau;
    chart.data.datasets[0].borderColor = colors.hijauBorder;
    chart.data.datasets[1].backgroundColor = colors.merah;
    chart.data.datasets[1].borderColor = colors.merahBorder;
    chart.options.scales.y.grid.color = colors.gridY;
    chart.options.scales.y.ticks.color = colors.text;
    chart.options.scales.x.ticks.color = colors.text;
    chart.options.plugins.legend.labels.color = colors.text;
    chart.options.plugins.tooltip.backgroundColor = themeColors.tooltipBg;
    chart.options.plugins.tooltip.titleColor = themeColors.tooltipTitle;
    chart.options.plugins.tooltip.bodyColor = themeColors.tooltipBody;
    chart.update('none');
  }
}

// ========================================
// BACKWARD COMPATIBILITY
// ========================================

// Alias for format function
const format = formatNumber;

// Expose chart instances to window for backward compatibility
Object.defineProperty(window, 'pieInfChart', {
  get: () => STATE.charts.pieInf,
  set: (val) => { STATE.charts.pieInf = val; },
  configurable: true
});

Object.defineProperty(window, 'pieNonInfChart', {
  get: () => STATE.charts.pieNonInf,
  set: (val) => { STATE.charts.pieNonInf = val; },
  configurable: true
});

Object.defineProperty(window, 'barChart', {
  get: () => STATE.charts.bar,
  set: (val) => { STATE.charts.bar = val; },
  configurable: true
});

Object.defineProperty(window, 'table', {
  get: () => STATE.table,
  set: (val) => { STATE.table = val; },
  configurable: true
});
