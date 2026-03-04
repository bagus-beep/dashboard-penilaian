// ========================================
// DASHBOARD PAGE - Dashboard Page Builder
// ========================================

import { StatCard, PieChart, FilterSelect, ModeToggle, TableSkeleton, MobileSearch } from './components.js';

/**
 * Dashboard Page Builder
 * Combines components into full dashboard page
 */
export const DashboardPage = {
  /**
   * Build Stat Cards Section
   */
  buildStatCards: () => {
    const stats = [
      { id: 'statTotal', label: 'Total Siswa', icon: 'users', color: 'violet', colorEnd: 'indigo', footer: 'Aktif Tahun Ini', footerIcon: 'arrow-trend-up', bigIcon: 'user-graduate' },
      { id: 'statInf', label: 'Informatika', icon: 'laptop-code', color: 'purple', colorEnd: 'pink', footer: 'Jurusan Teknik', footerIcon: 'check-circle', bigIcon: 'code' },
      { id: 'statNonInf', label: 'Non Informatika', icon: 'user', color: 'emerald', colorEnd: 'teal', footer: 'Jurusan Lain', footerIcon: 'building-columns', bigIcon: 'users-viewfinder' }
    ];
    return stats.map(config => StatCard.render(config)).join('');
  },

  /**
   * Build Charts Section
   */
  buildCharts: () => {
    const pieCharts = [
      { id: 'pieInf', title: 'Distribusi Informatika', subtitle: 'Rasio siswa per tingkat kelas', icon: 'chart-pie', color: 'violet', colorEnd: 'indigo' },
      { id: 'pieNonInf', title: 'Distribusi Non Informatika', subtitle: 'Rasio siswa non-Informatika', icon: 'chart-simple', color: 'emerald', colorEnd: 'teal' }
    ];

    const filterOptions = [
      { value: 'all', label: 'Semua Tingkat' },
      { value: 'x - ', label: 'Kelas X' },
      { value: 'xi - ', label: 'Kelas XI' },
      { value: 'xii - ', label: 'Kelas XII' }
    ];

    const modeButtons = [
      { onclick: 'setMode(0)', icon: 'user', label: 'Individu' },
      { onclick: 'setMode(1)', icon: 'users', label: 'Kelompok' },
      { onclick: 'setMode(2)', icon: 'layer-group', label: 'Total' }
    ];

    return `
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        ${pieCharts.map(c => PieChart.render(c)).join('')}
        
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl transition-all duration-300 lg:col-span-2">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg dark:shadow-pink-500/20">
                <i class="fas fa-chart-column text-white"></i>
              </div>
              <div>
                <h3 class="font-bold text-slate-800 dark:text-white">Progres Tugas per Kelas</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Status pengumpulan tugas</p>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              ${FilterSelect.render({ id: 'filterTingkat', onchange: 'setTingkat(this.value)', color: 'purple', options: filterOptions })}
              ${ModeToggle.render({ buttons: modeButtons })}
            </div>
          </div>
          <div class="bar-chart-container h-72 sm:h-80 lg:h-96">
            <div id="skeleton-barKelas" class="chart-skeleton skeleton-bar">
              <div class="skeleton-bars">
                ${[1,2,3,4,5].map(() => '<div class="skeleton-bar-item"></div>').join('')}
              </div>
            </div>
            <canvas id="barKelas" style="display: none;"></canvas>
          </div>
        </div>
      </section>
    `;
  },

  /**
   * Build Table Section
   */
  buildTable: () => {
    const tableFilterOptions = [
      { value: 'all', label: 'Semua Tingkat' },
      { value: 'x', label: 'Kelas X' },
      { value: 'xi', label: 'Kelas XI' },
      { value: 'xii', label: 'Kelas XII' }
    ];

    return `
      <section class="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl transition-all duration-300">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg dark:shadow-amber-500/20">
              <i class="fas fa-table-list text-white"></i>
            </div>
            <div>
              <h3 class="font-bold text-slate-800 dark:text-white">Detail Tugas Siswa</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Data lengkap pengumpulan tugas</p>
            </div>
          </div>
          ${FilterSelect.render({ id: 'filterTingkatTable', onchange: '', color: 'amber', options: tableFilterOptions })}
        </div>

        <!-- Desktop Table View -->
        <div class="table-view hidden md:block overflow-x-auto">
          ${TableSkeleton.render()}
          <table id="tableSiswa" class="w-full text-sm" style="display: none;"></table>
        </div>

        <!-- Mobile Card View -->
        <div id="cardListView" class="card-list-view md:hidden">
          ${MobileSearch.render({ id: 'mobileSearchInput', clearId: 'clearMobileSearch', placeholder: 'Cari nama atau NIS...', color: 'amber' })}
          <div class="card-list-container"></div>
          <div class="card-list-loader hidden flex items-center justify-center py-8">
            <div class="loading-spinner"></div>
          </div>
          <div class="card-list-end hidden flex items-center justify-center py-4 text-sm text-slate-500 dark:text-slate-400">
            <i class="fas fa-check-circle mr-2"></i>
            <span>Semua data telah dimuat</span>
          </div>
        </div>
      </section>
    `;
  },

  /**
   * Build Complete Dashboard Page
   */
  render: () => `
    <section class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      ${DashboardPage.buildStatCards()}
    </section>
    ${DashboardPage.buildCharts()}
    ${DashboardPage.buildTable()}
  `
};

