// script.js — robust CPM/RPM calculator with improved niche select handling
const defaultNiches = {
  general: { cpm: { low: 1.5, mid: 3.0, high: 4.0 }, rpm: { low: 0.6, mid: 1.65, high: 2.4 } },
  tech: { cpm: { low: 4.0, mid: 8.0, high: 12.0 }, rpm: { low: 2.5, mid: 4.4, high: 6.0 } }
};

async function loadNiches(){
  try{
    const res = await fetch('data.json', { cache: 'no-store' });
    if(!res.ok) throw new Error('no data.json');
    // Read as text to handle repositories where data.json may accidentally include
    // markdown fences (```json) or other wrappers. Strip common fences before parsing.
    let text = await res.text();
    // Remove leading/trailing triple backticks and optional language marker
    text = text.replace(/^\s*```[a-zA-Z]*\s*/,'').replace(/\s*```\s*$/,'');
    // Trim BOM if present
    text = text.replace(/^\uFEFF/, '');
    const data = JSON.parse(text);
    return data;
  }catch(e){
    // Graceful fallback to built-in defaults
    return defaultNiches;
  }
}

function formatMoney(n){ return '$' + Number(n).toFixed(2); }

function asRange(v){
  if (v == null) return null;
  if (typeof v === 'number'){
    const mid = v; return { low: mid*0.75, mid, high: mid*1.25 };
  }
  if (typeof v === 'object'){
    const low = Number(v.low ?? v.min ?? 0);
    const high = Number(v.high ?? v.max ?? 0);
    const mid = Number(v.mid ?? ((low && high) ? ((low+high)/2) : (v ?? 0)));
    return { low, mid, high };
  }
  return null;
}

async function init(){
  const niches = await loadNiches();
  const nicheEl = document.getElementById('niche');
  const viewsEl = document.getElementById('views');
  const calcBtn = document.getElementById('calc');
  const resetBtn = document.getElementById('reset');
  const resultEl = document.getElementById('result');

  // Clear any existing options (defensive)
  nicheEl.innerHTML = '';

  // Add a simple placeholder that is selectable on all platforms (disabled placeholders
  // cause inconsistent behavior on some mobile browsers).
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select a niche...';
  placeholder.selected = true;
  nicheEl.appendChild(placeholder);

  // Populate options preserving insertion order from data.json
  Object.keys(niches).forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = key.replace(/_/g,' ').replace(/\b\w/g, s => s.toUpperCase());
    nicheEl.appendChild(opt);
  });

  // Allow the user to press Enter on the select/input to calculate
  [nicheEl, viewsEl].forEach(el => el.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') calcBtn.click();
  }));

  function calculate(){
    // If user left placeholder (''), fallback to first data key or 'general'
    const raw = nicheEl.value;
    const chosen = raw === '' ? (Object.keys(niches)[0] || 'general') : raw;
    const entry = niches[chosen] || {};
    const views = Math.max(0, Number(viewsEl.value) || 0);

    const rpmRange = asRange(entry.rpm) ?? asRange(defaultNiches.general.rpm);
    const cpmRange = asRange(entry.cpm) ?? asRange(defaultNiches.general.cpm);

    const estMidRPM = (views/1000) * rpmRange.mid;
    const estLowRPM = (views/1000) * rpmRange.low;
    const estHighRPM = (views/1000) * rpmRange.high;

    const estMidCPM = (views/1000) * cpmRange.mid;
    const estLowCPM = (views/1000) * cpmRange.low;
    const estHighCPM = (views/1000) * cpmRange.high;

    // Only show the summary in results — detailed niche numbers removed for brevity
    resultEl.innerHTML = `
      <div class="summary">
        <p class="big">Estimated monthly revenue (RPM mid): <strong>${formatMoney(estMidRPM)}</strong></p>
        <p class="muted">Range: ${formatMoney(estLowRPM)} — ${formatMoney(estHighRPM)} (RPM)</p>
        <p class="muted">Advertiser CPM range: ${formatMoney(estLowCPM)} — ${formatMoney(estHighCPM)} (CPM)</p>
      </div>
    `;
  }

  calcBtn.addEventListener('click', calculate);
  resetBtn.addEventListener('click', ()=>{
    viewsEl.value = 10000;
    nicheEl.selectedIndex = 0; // placeholder
    resultEl.innerHTML = '<p class="muted">Choose a niche and enter monthly views, then click Calculate.</p>';
  });

  // initial friendly content
  resultEl.innerHTML = '<p class="muted">Choose a niche and enter monthly views, then click Calculate.</p>';
}

document.addEventListener('DOMContentLoaded', init);
