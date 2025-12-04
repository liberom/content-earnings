// script.js — minimal CPM/RPM calculator
const defaultNiches = {
  "general": { cpm: 2, rpm: 1 },
  "tech": { cpm: 5, rpm: 3 },
  "finance": { cpm: 10, rpm: 6 },
  "lifestyle": { cpm: 1.5, rpm: 0.9 }
};

async function loadNiches(){
  try{
    const res = await fetch('data.json', {cache: 'no-store'});
    if(!res.ok) throw new Error('no data.json');
    return await res.json();
  }catch(e){
    return defaultNiches;
  }
}

function formatMoney(n){ return '$' + Number(n).toFixed(2); }

async function init(){
  const niches = await loadNiches();
  const nicheEl = document.getElementById('niche');
  const viewsEl = document.getElementById('views');
  const calcBtn = document.getElementById('calc');
  const resetBtn = document.getElementById('reset');
  const resultEl = document.getElementById('result');

  // populate
  Object.keys(niches).forEach(k => {
    const opt = document.createElement('option');
    opt.value = k; opt.textContent = k.charAt(0).toUpperCase() + k.slice(1);
    nicheEl.appendChild(opt);
  });

  function calculate(){
    const niche = nicheEl.value || 'general';
    const views = Number(viewsEl.value) || 0;
    const {cpm, rpm} = niches[niche] || niches['general'];
    const estByCPM = (views/1000) * cpm;
    const estByRPM = (views/1000) * rpm;
    resultEl.innerHTML = `<strong>${formatMoney(estByRPM)}</strong> (RPM estimate) — advertiser CPM suggests <em>${formatMoney(estByCPM)}</em>`;
  }

  calcBtn.addEventListener('click', calculate);
  resetBtn.addEventListener('click', ()=>{
    viewsEl.value = 10000; nicheEl.selectedIndex = 0; resultEl.textContent = '';
  });

  // initial calculation
  resultEl.textContent = '';
}

document.addEventListener('DOMContentLoaded', init);
