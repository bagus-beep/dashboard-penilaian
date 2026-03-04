// ========================================
// UI COMPONENTS - Reusable Template Builders
// ========================================

/**
 * Stat Card Component
 */
export const StatCard = {
  render: (config) => `
    <div class="group relative bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-${config.color}-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${config.color}-400/20 to-${config.colorEnd}-400/20 dark:from-${config.color}-500/30 dark:to-${config.colorEnd}-500/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div class="flex items-start justify-between relative z-10">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-${config.color}-500 to-${config.colorEnd}-600 flex items-center justify-center">
              <i class="fas fa-${config.icon} text-white text-xs"></i>
            </div>
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">${config.label}</span>
          </div>
          <div id="${config.id}" class="text-4xl sm:text-5xl font-extrabold text-slate-800 dark:text-white">
            <span class="skeleton-stat h-12 w-24 rounded-xl block"></span>
          </div>
          <div class="flex items-center gap-1 mt-2 text-${config.color}-600 dark:text-${config.color}-400 text-xs font-medium">
            <i class="fas fa-${config.footerIcon}"></i>
            <span>${config.footer}</span>
          </div>
        </div>
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-${config.color}-500 to-${config.colorEnd}-600 flex items-center justify-center shadow-lg shadow-${config.color}-500/25 group-hover:scale-110 transition-transform">
          <i class="fas fa-${config.bigIcon} text-white text-2xl"></i>
        </div>
      </div>
    </div>
  `
};

/**
 * Pie Chart Component
 */
export const PieChart = {
  render: (config) => `
    <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl transition-all duration-300">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-${config.color}-500 to-${config.colorEnd}-600 flex items-center justify-center shadow-lg dark:shadow-${config.color}-500/20">
          <i class="fas fa-${config.icon} text-white"></i>
        </div>
        <div>
          <h3 class="font-bold text-slate-800 dark:text-white">${config.title}</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">${config.subtitle}</p>
        </div>
      </div>
      <div class="pie-chart-container h-[380px] sm:h-[420px]">
        <div id="skeleton-${config.id}" class="chart-skeleton skeleton-pie">
          <div class="skeleton-circle"></div>
        </div>
        <canvas id="${config.id}" style="display: none;"></canvas>
      </div>
    </div>
  `
};

/**
 * Filter Select Component
 */
export const FilterSelect = {
  render: (config) => `
    <select id="${config.id}" onchange="${config.onchange}" class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border-0 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-${config.color}-500">
      ${config.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
    </select>
  `
};

/**
 * Mode Toggle Component
 */
export const ModeToggle = {
  render: (config) => `
    <div class="relative bg-slate-100 dark:bg-slate-700 rounded-full p-1 flex">
      <div id="indicator" class="segment-indicator"></div>
      ${config.buttons.map((btn, idx) => `
        <button type="button" class="mode-toggle-btn ${idx === 0 ? 'active' : ''} px-4 py-1.5 rounded-full text-xs font-medium text-slate-700 dark:text-slate-200" onclick="${btn.onclick}">
          <i class="fas fa-${btn.icon} mr-1"></i>${btn.label}
        </button>
      `).join('')}
    </div>
  `
};

/**
 * Table Skeleton Component
 */
export const TableSkeleton = {
  render: () => `
    <div id="tableSiswaSkeleton" class="table-skeleton">
      <div class="skeleton-row header">
        ${[1,2,3,4,5].map(() => '<div class="skeleton-cell"></div>').join('')}
      </div>
      ${[1,2,3,4,5].map(() => `
        <div class="skeleton-row">
          ${[1,2,3,4,5].map(() => '<div class="skeleton-cell"></div>').join('')}
        </div>
      `).join('')}
    </div>
  `
};

/**
 * Mobile Search Component
 */
export const MobileSearch = {
  render: (config) => `
    <div class="mb-4">
      <div class="relative">
        <input type="text" id="${config.id}" placeholder="${config.placeholder}" class="w-full px-4 py-3 pl-11 rounded-xl bg-slate-100 dark:bg-slate-700 border-0 text-sm font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-${config.color}-500 focus:outline-none transition-all"/>
        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          <i class="fas fa-search"></i>
        </div>
        <button id="${config.clearId}" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hidden">
          <i class="fas fa-times-circle"></i>
        </button>
      </div>
    </div>
  `
};

