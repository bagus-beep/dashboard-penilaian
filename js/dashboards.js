/**
 * ========================================
 * DASHBOARD - Main Application Controller
 * ========================================
 */

import { CONFIG } from './config.js';
import { apiFetch } from './apis.js';
import { showChartSkeletons, hideChartSkeletons, renderCharts } from './charts.js';
import { renderStats } from './stats.js';
import { initView } from './tables.js';

// Toast notification system - export for use in other modules
export const Toast = {
  container: null,
  
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 350px;
      `;
      document.body.appendChild(this.container);
    }
  },
  
  show(message, type = 'error', duration = 5000) {
    this.init();
    
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    
    // Icon based on type
    const icons = {
      error: '<i class="fas fa-circle-exclamation"></i>',
      warning: '<i class="fas fa-triangle-exclamation"></i>',
      success: '<i class="fas fa-circle-check"></i>',
      info: '<i class="fas fa-circle-info"></i>'
    };
    
    const colors = {
      error: 'background: linear-gradient(135deg, #ef4444, #dc2626);',
      warning: 'background: linear-gradient(135deg, #f59e0b, #d97706);',
      success: 'background: linear-gradient(135deg, #10b981, #059669);',
      info: 'background: linear-gradient(135deg, #3b82f6, #2563eb);'
    };
    
    toast.style.cssText = colors[type] + `
      color: white;
      padding: 14px 18px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      font-weight: 500;
      animation: slideIn 0.3s ease;
      cursor: pointer;
    `;
    
    toast.innerHTML = `
      <span style="font-size: 18px;">${icons[type]}</span>
      <span style="flex: 1;">${message}</span>
      <span style="opacity: 0.7; cursor: pointer;" onclick="this.parentElement.remove()">
        <i class="fas fa-xmark"></i>
      </span>
    `;
    
    // Add animation keyframes if not exists
    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    toast.onclick = function() {
      this.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => this.remove(), 300);
    };
    
    this.container.appendChild(toast);
    
    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        if (toast.parentElement) {
          toast.style.animation = 'slideOut 0.3s ease';
          setTimeout(() => toast.remove(), 300);
        }
      }, duration);
    }
  },
  
  error(message, duration) {
    if (!duration) duration = 5000;
    this.show(message, 'error', duration);
  },
  
  warning(message, duration) {
    if (!duration) duration = 7000;
    this.show(message, 'warning', duration);
  },
  
  success(message, duration) {
    if (!duration) duration = 4000;
    this.show(message, 'success', duration);
  },
  
  info(message, duration) {
    if (!duration) duration = 4000;
    this.show(message, 'info', duration);
  }
};

// Error handler - export for use in other modules
export function handleApiError(error, context) {
  if (!context) context = '';
  const errorMessage = error.message || error.toString();
  const contextStr = context ? ' (' + context + ')' : '';
  
  console.error('API Error' + contextStr + ':', errorMessage);
  
  // Check for specific error types
  const lowerMessage = errorMessage.toLowerCase();
  
  if (lowerMessage.includes('rate limit') || 
      lowerMessage.includes('too many request')) {
    Toast.warning('Terlalu banyak permintaan. Silakan tunggu sebentar...', 8000);
  } else if (lowerMessage.includes('network') || 
             lowerMessage.includes('fetch')) {
    Toast.error('Koneksi internet bermasalah. Periksa jaringan Anda.', 6000);
  } else if (lowerMessage.includes('expired') ||
             lowerMessage.includes('unauthorized')) {
    Toast.warning('Sesi berakhir. Memuat ulang data...', 4000);
  } else {
    Toast.error('Gagal: ' + errorMessage + contextStr, 5000);
  }
}

// Main initialization
document.addEventListener("DOMContentLoaded", function() {
  loadDashboard();
  
  // Auto-refresh summary every interval
  setInterval(loadSummary, CONFIG.REFRESH_INTERVAL);
});

/**
 * Load complete dashboard data
 */
export async function loadDashboard() {
  try {
    // Show skeleton loaders for charts while fetching data
    showChartSkeletons();
    
    const data = await apiFetch("dashboard_summary");

    // Render stats and charts first (this clears skeletons)
    renderStats(data.summary);
    renderCharts(data.kelas);
    
    // Show success toast AFTER data is rendered and skeletons are cleared
    Toast.success('Data berhasil dimuat!', 2000);
    
    // Initialize table/card view based on screen size
    initView();

  } catch (error) {
    handleApiError(error, 'memuat dashboard');
    showErrorNotification("Gagal memuat data dashboard");
    hideChartSkeletons();
  }
}

/**
 * Load summary data only (for periodic refresh)
 */
export async function loadSummary() {
  try {
    const data = await apiFetch("dashboard_summary");
    renderStats(data.summary);
  } catch (error) {
    // Silently handle summary errors to avoid spam
    handleApiError(error, 'refresh data');
  }
}

/**
 * Show error notification (legacy support)
 */
function showErrorNotification(message) {
  Toast.error(message);
}

// Make functions available globally for backward compatibility
window.Toast = Toast;
window.loadDashboard = loadDashboard;
window.loadSummary = loadSummary;
window.handleApiError = handleApiError;
window.showErrorNotification = showErrorNotification;
