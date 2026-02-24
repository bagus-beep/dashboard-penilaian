async function loadSummary() {
  try {

    const data = await apiFetch("dashboard_summary");

    renderStats(data.summary);
    renderCharts(data.kelas);

  } catch (e) {
    console.error("Summary error:", e.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {

  loadSummary();   // summary load
  renderTable();   // table init sekali

  // refresh summary saja tiap 15 detik
  setInterval(loadSummary, 15000);

});