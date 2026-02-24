function renderStats(summary) {

  if (!summary) {
    console.error("Summary tidak tersedia");
    return;
  }

  const total = summary.totalSiswa || 0;
  const inf = summary.totalInformatika || 0;
  const nonInf = total - inf;

  document.getElementById("statTotal").textContent = format(total);
  document.getElementById("statInf").textContent = format(inf);
  document.getElementById("statNonInf").textContent = format(nonInf);
}
