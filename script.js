// script.js — enhanced CPM/RPM calculator (uses structured ranges from data.json)
const defaultNiches = {
  "general": { cpm: { low: 1.5, mid: 3.0, high: 4.0 }, rpm: { low: 0.6, mid: 1.65, high: 2.4 } },
  "tech": { cpm: { low: 4.0, mid: 8.0, high: 12.0 }, rpm: { low: 2.5, mid: 4.4, high: 6.0 } }
};

async function loadNiches(){
  try{
    const res = await fetch('data.json', {cache: 'no-store'});
    if(!res.ok) throw new Error('no data.json');
    const data = await res.json();
    return data;
  }catch(e){
    return defaultNiches;
  }
}

function formatMoney(n){ return '$' + Number(n).toFixed(2); }

function asRange(valueOrObj){
  // Accept either a number (legacy) or an object {low, mid, high}
  if (valueOrObj == null) return null;
  if (typeof valueOrObj === 'number'){
    const mid = valueOrObj;
    const low = mid * 0.75;
    const high = mid * 1.25;
    return { low, mid, high };
  }
  if (typeof valueOrObj === 'object'){
    // ensure mid exists; if only low/high present, derive mid
    const low = Number(valueOrObj.low ?? valueOrObj.min ?? 0);
    const high = Number(valueOrObj.high ?? valueOrObj.max ?? 0);
    const mid = Number(valueOrObj.mid ?? ((low && high) ? ((low+high)/2) : valueOrObj ?? 0));
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

  // populate select, preserving insertion order from data.json
  Object.keys(niches).forEach(k => {
    const opt = document.createElement('option');
    opt.value = k;
    // nicer label: convert underscores and camel-case to spaced words
    opt.textContent = k.replace(/_/g, ' ').replace(/\b\w/g, s => s.toUpperCase());
    nicheEl.appendChild(opt);
  });

  function calculate(){
    const nicheKey = nicheEl.value || Object.keys(niches)[0];
    const entry = niches[nicheKey] || {};
    const views = Math.max(0, Number(viewsEl.value) || 0);

    const rpmRange = asRange(entry.rpm);
    const cpmRange = asRange(entry.cpm);

    // if rpmRange or cpmRange are missing, fallback to defaults
    const rpm = rpmRange ?? asRange(defaultNiches['general'].rpm);
    const cpm = cpmRange ?? asRange(defaultNiches['general'].cpm);

    const estMidRPM = (views/1000) * rpm.mid;
    const estLowRPM = (views/1000) * rpm.low;
    const estHighRPM = (views/1000) * rpm.high;

    const estMidCPM = (views/1000) * cpm.mid;
    const estLowCPM = (views/1000) * cpm.low;
    const estHighCPM = (views/1000) * cpm.high;

    resultEl.innerHTML = `
      <div class="summary">
        <p class="big">Estimated monthly revenue (RPM mid): <strong>${formatMoney(estMidRPM)}</strong></p>
        <p class="muted">Range: ${formatMoney(estLowRPM)} — ${formatMoney(estHighRPM)} (RPM)</p>
        <p class="muted">Advertiser CPM range: ${formatMoney(estLowCPM)} — ${formatMoney(estHighCPM)} (CPM)</p>
      </div>
      <div class="details">
        <p><strong>Selected niche:</strong> ${nicheKey.replace(/_/g,' ').replace(/\b\w/g, s => s.toUpperCase())}</p>
        <p><strong>RPM (per 1,000 views):</strong> ${formatMoney(rpm.low)} — ${formatMoney(rpm.mid)} — ${formatMoney(rpm.high)}</p>
        <p><strong>CPM (advertiser):</strong> ${formatMoney(cpm.low)} — ${formatMoney(cpm.mid)} — ${formatMoney(cpm.high)}</p>
      </div>
    `;
  }

  calcBtn.addEventListener('click', calculate);
  resetBtn.addEventListener('click', ()=>{
    viewsEl.value = 10000; nicheEl.selectedIndex = 0; resultEl.innerHTML = '';
  });

  // initial friendly content
  resultEl.innerHTML = '<p class="muted">Choose a niche and enter monthly views, then click Calculate.</p>';
}

document.addEventListener('DOMContentLoaded', init);
