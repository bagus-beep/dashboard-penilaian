// ========================================
// CHART PLUGINS - Custom Chart.js Plugins
// ========================================

import { getThemeColors } from '../config.js';

/**
 * Percentage label plugin - shows % on bar chart
 */
export const percentagePlugin = {
  id: 'percentagePlugin',
  afterDatasetsDraw(chart) {
    const ctx = chart.ctx;
    const sudahDataset = chart.data.datasets[0];
    const meta = chart.getDatasetMeta(0);
    const theme = getThemeColors();
    const textColor = theme.isDark ? '#ffffff' : '#1e293b';

    meta.data.forEach((bar, index) => {
      const sudah = sudahDataset.data[index];
      const total = sudah + (chart.data.datasets[1]?.data[index] || 0);
      if (!total || sudah === 0) return;

      const percent = Math.round((sudah / total) * 100);
      ctx.save();
      ctx.fillStyle = textColor;
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(percent + "%", bar.x, bar.y + (bar.height / 2));
      ctx.restore();
    });
  }
};
