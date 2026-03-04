/**
 * ========================================
 * APP - Main Application Entry Point
 * ========================================
 * 
 * This is the main entry point that imports and initializes all modules.
 * Uses ES6 modules for better code organization and maintainability.
 * 
 * Module dependency order:
 * 1. config.js - Base configuration and utilities
 * 2. apis.js - API client (depends on config)
 * 3. states.js - State management (depends on config)
 * 4. charts.js - Chart rendering (depends on config, states)
 * 5. stats.js - Statistics rendering (depends on config)
 * 6. tables.js - Table/Card rendering (depends on apis, states, dashboards)
 * 7. dashboards.js - Main controller (depends on all)
 */

// Import all modules in dependency order
import { CONFIG } from './config.js';
import { API, apiFetch } from './apis.js';
import { STATE, setFilters, setCachedData } from './states.js';
import { 
  showChartSkeletons, 
  hideChartSkeletons, 
  renderCharts, 
  renderBarChart 
} from './charts.js';
import { 
  clearStatSkeletons, 
  renderStats, 
  resetStatSkeletons 
} from './stats.js';
import { 
  initView, 
  renderTable, 
  STATUS_CONFIG,
  CARD_LIST_STATE 
} from './tables.js';
import { 
  Toast, 
  handleApiError,
  loadDashboard,
  loadSummary 
} from './dashboards.js';

// Import Page Builders
import { DashboardPage } from './pages/dashboard/index.js';

// Re-export all key functions for global access
window.CONFIG = CONFIG;
window.API = API;
window.apiFetch = apiFetch;
window.STATE = STATE;
window.setFilters = setFilters;
window.setCachedData = setCachedData;
window.showChartSkeletons = showChartSkeletons;
window.hideChartSkeletons = hideChartSkeletons;
window.renderCharts = renderCharts;
window.renderBarChart = renderBarChart;
window.clearStatSkeletons = clearStatSkeletons;
window.renderStats = renderStats;
window.resetStatSkeletons = resetStatSkeletons;
window.initView = initView;
window.renderTable = renderTable;
window.STATUS_CONFIG = STATUS_CONFIG;
window.CARD_LIST_STATE = CARD_LIST_STATE;
window.Toast = Toast;
window.handleApiError = handleApiError;
window.loadDashboard = loadDashboard;
window.loadSummary = loadSummary;

// ========================================
// ROUTER - Dynamic Page Loading
// ========================================

/**
 * Page Templates Registry
 */
const PageTemplates = {
  dashboard: () => DashboardPage.render()
};

/**
 * Router - Handle dynamic page loading
 */
const Router = {
  getPage() {
    const app = document.getElementById('app');
    return app?.dataset.page || 'dashboard';
  },

  async loadPage(pageName) {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;

    const template = PageTemplates[pageName];
    
    if (template) {
      appContent.innerHTML = template();
      await this.initPage(pageName);
    } else {
      appContent.innerHTML = PageTemplates.dashboard();
      await this.initPage('dashboard');
    }
  },

  async initPage(pageName) {
    switch (pageName) {
      case 'dashboard':
        if (typeof loadDashboard === 'function') {
          loadDashboard();
        }
        break;
      default:
        console.warn(`No initialization for page: ${pageName}`);
    }
  },

  navigate(pageName) {
    const app = document.getElementById('app');
    if (app) {
      app.dataset.page = pageName;
      this.loadPage(pageName);
    }
  }
};

window.Router = Router;

// ========================================
// APPLICATION INITIALIZATION
// ========================================

console.log('Dashboard Penilaian - Modular JavaScript Initialized');
console.log('API URL:', CONFIG.API_URL);

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const currentPage = Router.getPage();
  await Router.loadPage(currentPage);
});

