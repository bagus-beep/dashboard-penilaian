let MODE = "individu"; // individu | kelompok | total
let pieInfChart, pieNonInfChart, lineChart, barChart, table, currentTingkat = "all";
const format = n => n.toLocaleString("id-ID");

let currentMode = 0; // 0 = Individu, 1 = Kelompok, 2 = Total
let cachedKelasData = [];

tailwind.config = {
  darkMode: 'class',
}

/* ===== Dark Mode ===== */
const toggleBtn = document.getElementById('themeToggle');

if(localStorage.theme === 'dark'){
  document.documentElement.classList.add('dark');
}

toggleBtn.onclick = () => {
  document.documentElement.classList.toggle('dark');
  localStorage.theme =
    document.documentElement.classList.contains('dark')
    ? 'dark' : 'light';
}

/* ===== Segmented Control ===== */
function setMode(modeIndex) {

  currentMode = modeIndex;

  moveIndicator(modeIndex);

  renderBarChart(); // re-render only bar
}

function moveIndicator(index) {

  const indicator = document.getElementById("indicator");
  const width = 100 / 3;

  indicator.style.width = width + "%";
  indicator.style.transform = `translateX(${index * 100}%)`;
}

/* ===== Remove Skeleton After Load ===== */
window.addEventListener("load",()=>{
  setTimeout(()=>{
    document.querySelectorAll('.skeleton')
      .forEach(el=>el.classList.remove('skeleton'));
  },1200);
});

function buildSubmissionDataset(kelasInf, mode = 0) {

  return kelasInf.map(k => {

    let sudah = 0;

    if (mode === 0) {
      // Individu
      sudah = k.individuSudah || 0;
    }

    if (mode === 1) {
      // Kelompok
      sudah = k.kelompokSudah || 0;
    }

    if (mode === 2) {
      // Total (individu + kelompok unique max)
      sudah = Math.max(k.individuSudah || 0, k.kelompokSudah || 0);
    }

    return {
      kelas: k.kelas,
      sudah,
      belum: k.totalInformatika - sudah
    };

  });
}

function filterByTingkat(data, tingkat) {

  if (tingkat === "all") return data;

  return data.filter(k =>
    k.kelas.toLowerCase().startsWith(tingkat)
  );
}

function setTingkat(value) {
  currentTingkat = value;
  renderBarChart();
  renderTable(); // auto refresh table juga
}