/**
 * ========================================
 * TABLES - DataTable & Card List Rendering
 * ========================================
 */

import { CONFIG } from './config.js';
import { apiFetch } from './apis.js';
import { STATE } from './states.js';

// Status badge configuration
export const STATUS_CONFIG = {
  colors: {
    sudah: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      darkBg: 'dark:bg-green-900',
      darkText: 'dark:text-green-300'
    },
    belum: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      darkBg: 'dark:bg-red-900',
      darkText: 'dark:text-red-300'
    }
  },
  defaultLabels: {
    sudah: 'Sudah',
    belum: 'Belum'
  }
};

// Card list state - export for use in other modules
export const CARD_LIST_STATE = {
  data: [],
  page: 0,
  pageSize: 20,
  isLoading: false,
  hasMore: true,
  totalRecords: 0,
  searchQuery: ''
};

/**
 * Initialize mobile search functionality
 */
function initMobileSearch() {
  const searchInput = document.getElementById('mobileSearchInput');
  const clearButton = document.getElementById('clearMobileSearch');
  
  if (!searchInput) return;
  
  // Debounced search
  let searchTimeout;
  searchInput.addEventListener('input', function(e) {
    const value = e.target.value.trim();
    
    // Show/hide clear button
    if (clearButton) {
      clearButton.classList.toggle('hidden', value.length === 0);
    }
    
    // Debounce search
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      CARD_LIST_STATE.searchQuery = value;
      resetCardList();
      const tingkat = document.getElementById('filterTingkatTable')?.value || 'all';
      loadCardList(tingkat);
    }, CONFIG.UI.TABLE_SEARCH_DELAY);
  });
  
  // Clear button handler
  if (clearButton) {
    clearButton.addEventListener('click', function() {
      searchInput.value = '';
      CARD_LIST_STATE.searchQuery = '';
      clearButton.classList.add('hidden');
      resetCardList();
      const tingkat = document.getElementById('filterTingkatTable')?.value || 'all';
      loadCardList(tingkat);
    });
  }
}

/**
 * Create status badge HTML (DRY)
 */
function createStatusBadge(status) {
  const isSudah = String(status).toLowerCase() === "sudah";
  const config = isSudah ? STATUS_CONFIG.colors.sudah : STATUS_CONFIG.colors.belum;
  const label = isSudah ? STATUS_CONFIG.defaultLabels.sudah : STATUS_CONFIG.defaultLabels.belum;

  return `
    <span class="px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text} ${config.darkBg} ${config.darkText}">
      ${label}
    </span>
  `;
}

/**
 * Check if current view is mobile
 */
function isMobileView() {
  return window.innerWidth < 768;
}

/**
 * Show table skeleton
 */
function showTableSkeleton() {
  const skeleton = document.getElementById('tableSiswaSkeleton');
  const table = document.getElementById('tableSiswa');
  if (skeleton) skeleton.style.display = 'flex';
  if (table) table.style.display = 'none';
}

/**
 * Hide table skeleton and show table
 */
function hideTableSkeleton() {
  const skeleton = document.getElementById('tableSiswaSkeleton');
  const table = document.getElementById('tableSiswa');
  if (skeleton) skeleton.style.display = 'none';
  if (table) table.style.display = 'table';
}

/**
 * Render DataTable (Desktop/Tablet)
 */
export function renderTable() {
  const tableElement = $("#tableSiswa");
  if (!tableElement.length) return;

  // Show skeleton initially
  showTableSkeleton();

  // Destroy existing table
  if (STATE.table) {
    STATE.table.destroy();
  }

  STATE.table = tableElement.DataTable({
    serverSide: true,
    processing: true,
    searching: true,
    responsive: true,
    deferRender: true,
    searchDelay: CONFIG.UI.TABLE_SEARCH_DELAY,
    lengthMenu: [10, 25, 50, 100],
    pageLength: CONFIG.UI.TABLE_PAGE_LENGTH,
    order: [[2, "asc"]],

    ajax: async function(dtParams, callback) {
      try {
        const response = await apiFetch("dashboard_table", {
          draw: dtParams.draw,
          start: dtParams.start,
          length: dtParams.length,
          search: dtParams.search.value,
          tingkat: $("#filterTingkatTable").val()
        });

        callback({
          draw: response.draw,
          recordsTotal: response.recordsTotal,
          recordsFiltered: response.recordsFiltered,
          data: response.data
        });

        // Hide skeleton after data loads
        hideTableSkeleton();

      } catch (error) {
        console.error("Table load error:", error);
        handleApiError(error, 'memuat tabel');
        callback({ data: [], recordsTotal: 0, recordsFiltered: 0 });
        hideTableSkeleton();
      }
    },

    columns: [
      { 
        data: "nis", 
        title: "NIS",
        width: "120px"
      },
      { 
        data: "nama", 
        title: "Nama",
        width: "auto"
      },
      { 
        data: "kelas", 
        title: "Kelas",
        width: "120px"
      },
      {
        data: "individu",
        title: "Individu",
        width: "100px",
        render: createStatusBadge
      },
      {
        data: "kelompok",
        title: "Kelompok",
        width: "100px",
        render: createStatusBadge
      }
    ],

    // Custom styling callbacks
    createdRow: function(row, data, dataIndex) {
      $(row).addClass('hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors');
    }
  });

  // Attach filter listener
  $("#filterTingkatTable").on("change", function() {
    const tingkat = $(this).val();
    
    if (isMobileView()) {
      // Reset and reload card list
      resetCardList();
      loadCardList(tingkat);
    } else {
      // Show skeleton before reload
      showTableSkeleton();
      // Reload DataTable
      if (STATE.table) {
        STATE.table.ajax.reload(null, true);
      }
    }
  });
}

/**
 * Show card list skeleton (mobile) - for initial load
 */
function showCardListSkeleton() {
  const container = document.querySelector('.card-list-container');
  if (container) {
    container.innerHTML = `
      <div class="card-skeleton">
        <div class="card-skeleton-header">
          <div class="skeleton-stat skeleton-name"></div>

        </div>
        <div class="card-skeleton-status">
          <div class="skeleton-stat skeleton-badge"></div>
          <div class="skeleton-stat skeleton-badge"></div>
        </div>
      </div>
      <div class="card-skeleton">
        <div class="card-skeleton-header">
          <div class="skeleton-stat skeleton-name"></div>
          <div class="skeleton-stat skeleton-nis"></div>
        </div>
        <div class="card-skeleton-status">
          <div class="skeleton-stat skeleton-badge"></div>
          <div class="skeleton-stat skeleton-badge"></div>
        </div>
      </div>
      <div class="card-skeleton">
        <div class="card-skeleton-header">
          <div class="skeleton-stat skeleton-name"></div>
          <div class="skeleton-stat skeleton-nis"></div>
        </div>
        <div class="card-skeleton-status">
          <div class="skeleton-stat skeleton-badge"></div>
          <div class="skeleton-stat skeleton-badge"></div>
        </div>
      </div>
    `;
  }
}

/**
 * Show skeleton for load more (infinite scroll)
 */
function showLoadMoreSkeleton() {
  const container = document.querySelector('.card-list-container');
  if (container) {
    const skeletonHTML = `
      <div class="card-skeleton load-more-skeleton">
        <div class="card-skeleton-header">
          <div class="skeleton-stat skeleton-name"></div>
          <div class="skeleton-stat skeleton-nis"></div>
        </div>
        <div class="card-skeleton-status">
          <div class="skeleton-stat skeleton-badge"></div>
          <div class="skeleton-stat skeleton-badge"></div>
        </div>
      </div>
      <div class="card-skeleton load-more-skeleton">
        <div class="card-skeleton-header">
          <div class="skeleton-stat skeleton-name"></div>
          <div class="skeleton-stat skeleton-nis"></div>
        </div>
        <div class="card-skeleton-status">
          <div class="skeleton-stat skeleton-badge"></div>
          <div class="skeleton-stat skeleton-badge"></div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', skeletonHTML);
  }
}

/**
 * Remove load more skeleton
 */
function removeLoadMoreSkeleton() {
  const skeletons = document.querySelectorAll('.load-more-skeleton');
  skeletons.forEach(skeleton => skeleton.remove());
}

/**
 * Reset card list state
 */
function resetCardList() {
  CARD_LIST_STATE.data = [];
  CARD_LIST_STATE.page = 0;
  CARD_LIST_STATE.hasMore = true;
  CARD_LIST_STATE.isLoading = false;
  
  const container = document.querySelector('.card-list-container');
  const loader = document.querySelector('.card-list-loader');
  const endMsg = document.querySelector('.card-list-end');
  
  if (container) container.innerHTML = '';
  if (loader) loader.style.display = 'none';
  if (endMsg) endMsg.style.display = 'none';
}

/**
 * Load card list data (lazy load)
 */
async function loadCardList(tingkat = 'all') {
  if (CARD_LIST_STATE.isLoading || !CARD_LIST_STATE.hasMore) return;
  
  CARD_LIST_STATE.isLoading = true;
  
  const container = document.querySelector('.card-list-container');
  const loader = document.querySelector('.card-list-loader');
  const endMsg = document.querySelector('.card-list-end');
  
  // Show skeleton on first load
  if (CARD_LIST_STATE.page === 0) {
    showCardListSkeleton();
  } else {
    // Show skeleton for load more (infinite scroll)
    showLoadMoreSkeleton();
  }
  
  if (loader) loader.style.display = 'flex';
  
  try {
    const response = await apiFetch("dashboard_table", {
      draw: 1,
      start: CARD_LIST_STATE.page * CARD_LIST_STATE.pageSize,
      length: CARD_LIST_STATE.pageSize,
      search: CARD_LIST_STATE.searchQuery || '',
      tingkat: tingkat
    });
    
    const newData = response.data || [];
    CARD_LIST_STATE.totalRecords = response.recordsTotal || 0;
    
    // Add new data
    CARD_LIST_STATE.data = [...CARD_LIST_STATE.data, ...newData];
    
    // Check if there are more records
    CARD_LIST_STATE.hasMore = CARD_LIST_STATE.data.length < CARD_LIST_STATE.totalRecords;
    
    // Render cards - APPEND new cards instead of replacing (for infinite scroll)
    if (container) {
      if (CARD_LIST_STATE.page === 1) {
        // First page - set initial HTML
        container.innerHTML = renderCardListHTML(newData, 0);
      } else {
        // Remove skeleton first, then append new cards
        removeLoadMoreSkeleton();
        container.insertAdjacentHTML('beforeend', renderCardListHTML(newData, (CARD_LIST_STATE.page - 1) * CARD_LIST_STATE.pageSize));
      }
    }
    
    // Update state
    CARD_LIST_STATE.page++;
    
    // Hide loader, show end message if no more data
    if (loader) loader.style.display = 'none';
    if (!CARD_LIST_STATE.hasMore && endMsg) {
      endMsg.style.display = 'flex';
    }
    
  } catch (error) {
    console.error("Card list load error:", error);
    handleApiError(error, 'memuat data kartu');
    if (loader) loader.style.display = 'none';
  } finally {
    CARD_LIST_STATE.isLoading = false;
  }
}

/**
 * Render card list HTML
 */
function renderCardListHTML(data, startIndex = 0) {
  if (!data || data.length === 0) return '';
  
  return data.map((student, index) => `
    <div class="student-card" style="animation-delay: ${(startIndex + index) * 30}ms">
      <div class="student-card-header">
        <div class="student-card-info">
          <span class="student-card-name">${student.nama || '-'}</span>
          <span class="student-card-nis">NIS: ${student.nis || '-'}</span>
        </div>
        <span class="student-card-kelas">
          <i class="fas fa-door-open"></i>
          ${student.kelas || '-'}
        </span>
      </div>
      <div class="student-card-status">
        <span class="student-card-status-item ${String(student.individu).toLowerCase() === 'sudah' ? 'sudah' : 'belum'}">
          <i class="fas ${String(student.individu).toLowerCase() === 'sudah' ? 'fa-check-circle' : 'fa-clock'} status-icon"></i>
          Individu: ${student.individu || '-'}
        </span>
        <span class="student-card-status-item ${String(student.kelompok).toLowerCase() === 'sudah' ? 'sudah' : 'belum'}">
          <i class="fas ${String(student.kelompok).toLowerCase() === 'sudah' ? 'fa-check-circle' : 'fa-clock'} status-icon"></i>
          Kelompok: ${student.kelompok || '-'}
        </span>
      </div>
    </div>
  `).join('');
}

/**
 * Initialize infinite scroll for card list
 */
function initInfiniteScroll() {
  const cardListView = document.getElementById('cardListView');
  if (!cardListView) return;
  
  let scrollTimeout;
  
  cardListView.addEventListener('scroll', function() {
    // Debounce scroll event
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const { scrollTop, scrollHeight, clientHeight } = cardListView;
      
      // Load more when near bottom (100px threshold)
      if (scrollHeight - scrollTop - clientHeight < 100) {
        const tingkat = document.getElementById('filterTingkatTable')?.value || 'all';
        loadCardList(tingkat);
      }
    }, 100);
  });
}

/**
 * Initialize view based on screen size
 */
export function initView() {
  const tableView = document.querySelector('.table-view');
  const cardListView = document.getElementById('cardListView');
  
  if (isMobileView()) {
    // Show card list, hide table
    if (tableView) tableView.classList.add('hidden');
    if (cardListView) cardListView.classList.remove('hidden');
    
    // Initialize mobile search
    initMobileSearch();
    
    // Reset and load card list
    resetCardList();
    const tingkat = document.getElementById('filterTingkatTable')?.value || 'all';
    loadCardList(tingkat);
    initInfiniteScroll();
  } else {
    // Show table, hide card list
    if (tableView) tableView.classList.remove('hidden');
    if (cardListView) cardListView.classList.add('hidden');
    
    // Render DataTable
    renderTable();
  }
}

/**
 * Handle window resize
 */
function handleResize() {
  const tableView = document.querySelector('.table-view');
  const cardListView = document.getElementById('cardListView');
  
  const wasMobile = tableView?.classList.contains('hidden') === true;
  const isMobile = isMobileView();
  
  if (wasMobile !== isMobile) {
    // View changed, reinitialize
    initView();
  }
}

// Error handler - import from dashboards.js
function handleApiError(error, context) {
  if (typeof window.handleApiError === 'function') {
    window.handleApiError(error, context);
  } else {
    console.error('API Error:', error, context);
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Initial render based on screen size
  initView();
  
  // Handle resize with debounce
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 250);
  });
});

// Make functions available globally for backward compatibility
window.initView = initView;
window.renderTable = renderTable;
window.resetCardList = resetCardList;
window.loadCardList = loadCardList;
window.showTableSkeleton = showTableSkeleton;
window.hideTableSkeleton = hideTableSkeleton;
window.STATUS_CONFIG = STATUS_CONFIG;
