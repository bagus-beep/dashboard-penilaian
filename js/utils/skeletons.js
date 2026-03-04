// ========================================
// SKELETON - Shared Skeleton Utilities
// ========================================

/**
 * Show skeleton by ID
 */
export function showSkeleton(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'flex';
}

/**
 * Hide skeleton by ID
 */
export function hideSkeleton(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

/**
 * Show element by ID
 */
export function showElement(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'block';
}

/**
 * Hide element by ID
 */
export function hideElement(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

/**
 * Set element HTML
 */
export function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

/**
 * Chart Skeleton - Show all chart skeletons
 */
export const ChartSkeletons = {
  show: () => {
    showSkeleton('skeleton-pieInf');
    showSkeleton('skeleton-pieNonInf');
    hideElement('pieInf');
    hideElement('pieNonInf');
    hideElement('barKelas');
    showSkeleton('skeleton-barKelas');
  },
  hide: () => {
    hideSkeleton('skeleton-pieInf');
    hideSkeleton('skeleton-pieNonInf');
    showElement('pieInf');
    showElement('pieNonInf');
    showElement('barKelas');
    hideSkeleton('skeleton-barKelas');
  }
};

/**
 * Stat Skeleton - Show stat skeletons
 */
export const StatSkeletons = {
  show: (ids) => {
    ids.forEach(id => setHTML(id, '<span class="skeleton-stat h-12 w-24 rounded-xl block"></span>'));
  },
  clear: (ids) => {
    ids.forEach(id => setHTML(id, '<span class="stat-number">0</span>'));
  },
  reset: (ids) => {
    ids.forEach(id => setHTML(id, '<span class="skeleton h-12 w-24 rounded-xl block"></span>'));
  }
};

/**
 * Table Skeleton - Show/hide table skeleton
 */
export const TableSkeletons = {
  show: () => {
    showSkeleton('tableSiswaSkeleton');
    hideElement('tableSiswa');
  },
  hide: () => {
    hideSkeleton('tableSiswaSkeleton');
    showElement('tableSiswa');
  }
};

/**
 * Card List Skeleton - For mobile view
 */
export const CardListSkeletons = {
  show: (containerSelector) => {
    const container = document.querySelector(containerSelector);
    if (container) {
      container.innerHTML = `
        ${[1,2,3].map(() => `
          <div class="card-skeleton">
            <div class="card-skeleton-header">
              <div class="skeleton-stat skeleton-name"></div>
              <div class="skeleton-stat skeleton-nis"></div>
            <div class="card-skeleton-status">
              <div class="skeleton-stat skeleton-badge"></div>
              <div class="skeleton-stat skeleton-badge"></div>
          </div>
        `).join('')}
      `;
    }
  },
  showLoadMore: (containerSelector) => {
    const container = document.querySelector(containerSelector);
    if (container) {
      container.insertAdjacentHTML('beforeend', `
        ${[1,2].map(() => `
          <div class="card-skeleton load-more-skeleton">
            <div class="card-skeleton-header">
              <div class="skeleton-stat skeleton-name"></div>
              <div class="skeleton-stat skeleton-nis"></div>
            <div class="card-skeleton-status">
              <div class="skeleton-stat skeleton-badge"></div>
              <div class="skeleton-stat skeleton-badge"></div>
          </div>
        `).join('')}
      `);
    }
  },
  removeLoadMore: () => {
    document.querySelectorAll('.load-more-skeleton').forEach(el => el.remove());
  }
};
