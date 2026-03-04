// ========================================
// CHART OPTIONS - Reusable Chart Configurations
// ========================================

import { CONFIG, getThemeColors } from '../config.js';

/**
 * Base chart options
 */
export const BaseOptions = {
  responsive: true,
  maintainAspectRatio: false
};

/**
 * Pie chart options builder
 */
export function buildPieOptions() {
  const theme = getThemeColors();
  return {
    ...BaseOptions,
    layout: { padding: { top: 10, bottom: 10 } },
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
          color: theme.legendColor,
          font: { size: 12, family: "'Plus Jakarta Sans', sans-serif", weight: '500' }
        }
      },
      tooltip: {
        backgroundColor: theme.tooltipBg,
        titleColor: theme.tooltipTitle,
        bodyColor: theme.tooltipBody,
        borderColor: theme.borderLight,
        borderWidth: 1,
        padding: 12
      }
    }
  };
}

/**
 * Bar chart options builder
 */
export function getBarChartOptions(colors) {
  const theme = getThemeColors();
  return {
    ...BaseOptions,
    animation: { duration: CONFIG.ANIMATION.CHART_DURATION, easing: 'easeOutQuart' },
    scales: {
      x: {
        ticks: { autoSkip: true, maxRotation: 0, minRotation: 0, color: colors.text },
        stacked: true,
        grid: { display: false }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: { color: colors.gridY },
        ticks: { color: colors.text }
      }
    },
    plugins: {
      legend: {
        labels: {
          boxWidth: 14,
          usePointStyle: true,
          pointStyle: 'rect',
          color: colors.text,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: theme.tooltipBg,
        titleColor: theme.tooltipTitle,
        bodyColor: theme.tooltipBody,
        borderColor: theme.borderLight,
        borderWidth: 1,
        padding: 12,
        callbacks: {
          afterBody: (context) => {
            const idx = context[0].dataIndex;
            const s = context[0].dataset.data[idx];
            const b = context[1]?.data[idx] || 0;
            const total = s + b;
            const percent = total > 0 ? Math.round((s / total) * 100) : 0;
            return `Progress: ${percent}%`;
          }
        }
      }
    }
  };
}
