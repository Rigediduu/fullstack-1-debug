'use strict';

// 0) Pieni apu
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// 1) Teema — virhe: localStorage avain sekoilee, event listener duplikoituu - korjattu
const themeBtn = $('#themeToggle');
const THEME_KEY = 'theme-preference';
function applyTheme(t) { document.documentElement.setAttribute('data-theme', t); }
function saveTheme(t) { localStorage.setItem('theme-preference', t); } // BUG: key typo
function loadTheme() { return localStorage.getItem('theme-preference') || 'light'; }
function toggleTheme() { const next = (loadTheme() === 'light') ? 'dark' : 'light'; applyTheme(next); saveTheme(next); }

// BUG: tuplalistener - korjattu
themeBtn.addEventListener('click', toggleTheme);
applyTheme(loadTheme());
saveTheme(loadTheme());

// 2) Haku — virhe: väärä API-osoite + virheenkäsittely puuttuu

// korjaus
// Vaihdettu endpoint sellaiseksi joka palauttaa arrayn (coffee/hot)
// Lisätty try/catch virheiden käsittelyyn, jotta fetch error ei kaada sovellusta
// Käytössä AbortController -> vanha request voidaan perua jos uusi haku lähetetään heti perään
// statusEl näyttää nyt lataustilan ja error/success -viestit selaimessa


const form = document.getElementById('searchForm');
const resultsEl = document.getElementById('results');
const statusEl = document.getElementById('status');

let currentCtrl = null; // muistetaan meneillään oleva request

async function searchImages(query, { signal } = {}) {

  // Valitse taulukon palauttava endpoint ja suodata hakusanalla
  const url = 'https://api.sampleapis.com/coffee/hot';

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('Unexpected response format');

  const q = (query || '').trim().toLowerCase();
  const filtered = q
    ? data.filter(item => (item.title || '').toLowerCase().includes(q))
    : data;

  return filtered.slice(0, 8).map(x => ({
    title: x.title || query || 'Coffee',
    url: x.image
  }));
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Peru aiempi request jos uusi haku käynnistyy
  if (currentCtrl) currentCtrl.abort();
  currentCtrl = new AbortController();

  const q = $('#q').value;
  statusEl.textContent = 'Ladataan…';
  statusEl.dataset.state = 'loading';
  resultsEl.innerHTML = '';

  try {
    const items = await searchImages(q, { signal: currentCtrl.signal });

    // Jos juuri tämä request peruutettiin, älä tee mitään
    if (currentCtrl.signal.aborted) return;

    if (!items.length) {
      statusEl.textContent = 'Ei tuloksia';
      statusEl.dataset.state = 'empty';
      return;
    }

    // Renderöi tulokset
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'card';
      li.innerHTML = `<strong>${item.title}</strong><br>
                      <img alt="" width="160" height="120" src="${item.url}">`;
      resultsEl.appendChild(li);
    });

    statusEl.textContent = `${items.length} tulosta`;
    statusEl.dataset.state = 'success';

  } catch (err) {
    if (err.name === 'AbortError') {
      statusEl.textContent = 'Peruttu';
      statusEl.dataset.state = 'aborted';
      return;
    }
    console.error('Haku epäonnistui:', err);
    statusEl.textContent = 'Virhe haussa';
    statusEl.dataset.state = 'error';
  } finally {
    currentCtrl = null;
  }
});

// 3) Laskuri — virhe: event delegation ja bubbling sekoilee
const counterBtn = $('.counter');
counterBtn.addEventListener('click', (e) => {
    if (e.target.classList.contains('count')) return; // BUG: estää klikin
    const span = $('.count', counterBtn);
    span.textContent = String(parseInt(span.textContent, 10) + 1);
});

// 4) Clipboard — virhe: ei permissioiden / https tarkistusta
$('#copyBtn').addEventListener('click', async () => {
    const text = $('#copyBtn').dataset.text;
    await navigator.clipboard.writeText(text); // BUG: voi heittää virheen
    alert('Kopioitu!');
});

// 5) IntersectionObserver — virhe: threshold/cleanup puuttuu
const box = document.querySelector('.observe-box');
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.intersectionRatio > 0.25) {
            box.textContent = 'Näkyvissä!';
        }
    });
});
io.observe(box);