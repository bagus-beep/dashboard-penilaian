/**
 * ========================================
 * STATS - Statistics Rendering
 * ========================================
 */

import { CONFIG, formatNumber } from './config.js';

// Track if skeleton has been cleared
let statSkeletonCleared = false;

/**
 * Clear stat skeletons and prepare for animation
 * Uses the same delay as charts (CONFIG.ANIMATION.SKELETON = 2500ms) for consistency
 */
export function clearStatSkeletons() {
  if (statSkeletonCleared) return;
  
  const statTotal = document.getElementById("statTotal");
  const statInf = document.getElementById("statInf");
  const statNonInf = document.getElementById("statNonInf");
  
  // Replace skeleton with span that will be animated
  if (statTotal) {
    statTotal.innerHTML = '<span class="stat-number">0</span>';
  }
  if (statInf) {
    statInf.innerHTML = '<span class="stat-number">0</span>';
  }
  if (statNonInf) {
    statNonInf.innerHTML = '<span class="stat-number">0</span>';
  }
  
  statSkeletonCleared = true;
}

/**
 * Render statistics cards with animation
 * Note: Called AFTER data is successfully fetched
 */
export function renderStats(summary) {
  if (!summary) {
    console.error("Summary tidak tersedia");
    return;
  }

  const total = summary.totalSiswa || 0;
  const inf = summary.totalInformatika || 0;
  const nonInf = total - inf;

  // Get elements
  const statTotal = document.getElementById("statTotal");
  const statInf = document.getElementById("statInf");
  const statNonInf = document.getElementById("statNonInf");

  // Guard against missing elements
  if (!statTotal || !statInf || !statNonInf) {
    console.warn("Stat elements not found in DOM");
    return;
  }

  // Clear skeleton after same delay as charts (2500ms) for consistent UX
  // This ensures stats and charts skeletons disappear at the same time
  setTimeout(() => {
    clearStatSkeletons();
    
    // Animate numbers with count-up effect (staggered for visual interest)
    animateCount(statTotal, 0, total, 1000);
    
    setTimeout(() => {
      animateCount(statInf, 0, inf, 1000);
    }, 150);

    setTimeout(() => {
      animateCount(statNonInf, 0, nonInf, 1000);
    }, 300);
  }, CONFIG.ANIMATION.SKELETON);
}

/**
 * Reset stat skeleton for refresh
 */
export function resetStatSkeletons() {
  statSkeletonCleared = false;
  
  const statTotal = document.getElementById("statTotal");
  const statInf = document.getElementById("statInf");
  const statNonInf = document.getElementById("statNonInf");
  
  if (statTotal) {
    statTotal.innerHTML = '<span class="skeleton h-12 w-24 rounded-xl block"></span>';
  }
  if (statInf) {
    statInf.innerHTML = '<span class="skeleton h-12 w-24 rounded-xl block"></span>';
  }
  if (statNonInf) {
    statNonInf.innerHTML = '<span class="skeleton h-12 w-24 rounded-xl block"></span>';
  }
}

/**
 * Animate number count-up with easing
 */
function animateCount(element, start, end, duration) {
  if (!element) return;
  
  const startTimestamp = performance.now();
  
  function step(timestamp) {
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // Ease-out cubic for smooth deceleration
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    const current = Math.floor(start + (end - start) * easeOut);
    
    // Format and set the number
    element.textContent = formatNumber(current);
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }
  
  window.requestAnimationFrame(step);
}

// Make functions available globally for backward compatibility
window.clearStatSkeletons = clearStatSkeletons;
window.renderStats = renderStats;
window.resetStatSkeletons = resetStatSkeletons;
