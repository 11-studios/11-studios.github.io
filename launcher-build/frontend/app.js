const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event;

const ui = {
  username: document.getElementById('username'),
  versionBtn: document.getElementById('versionBtn'),
  versionText: document.getElementById('versionText'),
  versionMenu: document.getElementById('versionMenu'),
  playBtn: document.getElementById('playBtn'),
  status: document.getElementById('status'),
  progress: document.getElementById('progressBar'),
  folder: document.getElementById('folderBtn'),
  min: document.getElementById('minBtn'),
  close: document.getElementById('closeBtn'),
};

let versions = [];
let selectedIndex = 0;
let launching = false;

function setStatus(text, progress = null) {
  ui.status.textContent = text || 'Hazır.';
  if (progress !== null) ui.progress.style.width = `${Math.max(0, Math.min(1, progress)) * 100}%`;
}

function sanitizeUsername(value) {
  return value.replace(/[^A-Za-z0-9_]/g, '').slice(0, 16);
}

function selectVersion(index, close = true) {
  if (!versions.length) return;
  selectedIndex = Math.max(0, Math.min(index, versions.length - 1));
  ui.versionText.textContent = versions[selectedIndex].label;
  ui.versionMenu.querySelectorAll('.version-item').forEach((node, i) => node.classList.toggle('selected', i === selectedIndex));
  if (close) ui.versionMenu.classList.add('hidden');
  ui.playBtn.disabled = launching || !versions.length;
}

function renderVersions(lastVersion = '') {
  ui.versionMenu.textContent = '';
  if (!versions.length) {
    ui.versionText.textContent = 'Sürüm listesi yükleniyor…';
    ui.playBtn.disabled = true;
    return;
  }
  const found = versions.findIndex(v => v.key === lastVersion || v.profileId === lastVersion || (v.kind === 'vanilla' && v.baseId === lastVersion));
  selectedIndex = found >= 0 ? found : Math.min(selectedIndex, versions.length - 1);
  const frag = document.createDocumentFragment();
  versions.forEach((v, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'version-item';
    b.textContent = v.label;
    b.title = v.label;
    b.addEventListener('click', () => selectVersion(i));
    frag.appendChild(b);
  });
  ui.versionMenu.appendChild(frag);
  selectVersion(selectedIndex, false);
}

async function refreshVersions(lastVersion = '') {
  try {
    if (!versions.length) setStatus('Sürüm listesi yükleniyor…', .02);
    const fresh = await invoke('refresh_versions');
    versions = fresh;
    renderVersions(lastVersion);
    setStatus(`${versions.length} sürüm hazır.`, 0);
  } catch (e) {
    if (!versions.length) {
      ui.versionText.textContent = 'Sürüm listesi alınamadı';
      setStatus(`Sürüm listesi alınamadı: ${e}`, 0);
    } else {
      setStatus(`${versions.length} önbellek sürümü hazır.`, 0);
    }
  }
}

ui.username.addEventListener('input', () => {
  const clean = sanitizeUsername(ui.username.value);
  if (clean !== ui.username.value) ui.username.value = clean;
});

ui.versionBtn.addEventListener('click', () => {
  if (!versions.length) return;
  ui.versionMenu.classList.toggle('hidden');
  if (!ui.versionMenu.classList.contains('hidden')) {
    const active = ui.versionMenu.children[selectedIndex];
    active?.scrollIntoView({ block: 'nearest' });
  }
});

document.addEventListener('mousedown', e => {
  if (!e.target.closest('.version-wrap')) ui.versionMenu.classList.add('hidden');
});

ui.playBtn.addEventListener('click', async () => {
  if (launching || !versions.length) return;
  const username = ui.username.value.trim();
  if (!/^[A-Za-z0-9_]{3,16}$/.test(username)) {
    setStatus('Oyuncu adı 3–16 karakter olmalı; harf, sayı ve _ kullanılabilir.', 0);
    ui.username.focus();
    return;
  }
  launching = true;
  ui.playBtn.disabled = true;
  ui.playBtn.textContent = 'HAZIRLANIYOR…';
  setStatus('Hazırlanıyor…', .04);
  try {
    await invoke('start_launch', { selection: versions[selectedIndex], username });
  } catch (e) {
    launching = false;
    ui.playBtn.disabled = false;
    ui.playBtn.textContent = 'OYNA';
    setStatus(String(e), 0);
  }
});

ui.folder.addEventListener('click', () => invoke('open_data_folder'));
ui.min.addEventListener('click', () => invoke('minimize_window'));
ui.close.addEventListener('click', () => invoke('close_window'));

listen('launch-progress', e => setStatus(e.payload.status, e.payload.progress));
listen('game-started', () => setStatus('Minecraft çalışıyor.', 1));
listen('game-exited', e => {
  launching = false;
  ui.playBtn.disabled = !versions.length;
  ui.playBtn.textContent = 'OYNA';
  ui.progress.style.width = '0%';
  setStatus(e.payload.exitCode === 0 ? 'Hazır.' : `Minecraft kapandı • çıkış kodu ${e.payload.exitCode}`, 0);
});
listen('launch-error', e => {
  launching = false;
  ui.playBtn.disabled = !versions.length;
  ui.playBtn.textContent = 'OYNA';
  setStatus(`Hata: ${e.payload}`, 0);
  alert(`Minecraft hazırlanamadı:\n\n${e.payload}`);
});

(async () => {
  const boot = await invoke('bootstrap');
  ui.username.value = sanitizeUsername(boot.username || '');
  versions = boot.versions || [];
  renderVersions(boot.lastVersion || '');
  if (versions.length) setStatus(`${versions.length} sürüm hazır.`, 0);
  if (!versions.length || boot.cacheStale) refreshVersions(boot.lastVersion || '');
})();
