import lottie from 'lottie-web';

const container = document.getElementById('lottie-container');
const versionList = document.getElementById('version-list');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');

// --- Version store ---
// Each entry: { label: string, src: string | null, data: object | null }
// src = URL path for path-loaded animations; data = parsed JSON for uploaded ones
const versions = [];
let activeIndex = -1;
let anim = null;

function pad(n) {
  return String(n).padStart(3, '0');
}

function renderSidebar() {
  versionList.innerHTML = '';
  versions.forEach((v, i) => {
    const item = document.createElement('div');
    item.className = 'version-item' + (i === activeIndex ? ' active' : '');
    item.textContent = v.label;
    item.addEventListener('click', () => loadVersion(i));
    versionList.appendChild(item);
  });
}

function loadVersion(index) {
  const v = versions[index];
  if (!v) return;
  activeIndex = index;
  renderSidebar();

  if (anim) anim.destroy();

  const looping = document.getElementById('btn-loop').dataset.looping === 'true';
  const speed = parseFloat(document.getElementById('speed').value);

  const config = {
    container,
    renderer: 'svg',
    loop: looping,
    autoplay: true,
  };

  if (v.data) {
    config.animationData = v.data;
  } else {
    config.path = v.src;
  }

  anim = lottie.loadAnimation(config);
  anim.setSpeed(speed);
}

function addVersion(label, { src = null, data = null } = {}) {
  versions.push({ label, src, data });
  renderSidebar();
  loadVersion(versions.length - 1);
}

// Seed Version 001 from the public file
addVersion('Version 001', { src: '/data.json' });
addVersion('Version 002', { src: '/data_version_002.json' });

// --- Controls ---
document.getElementById('btn-play').addEventListener('click', () => anim?.play());
document.getElementById('btn-pause').addEventListener('click', () => anim?.pause());
document.getElementById('btn-stop').addEventListener('click', () => anim?.stop());

const btnLoop = document.getElementById('btn-loop');
btnLoop.addEventListener('click', () => {
  const looping = btnLoop.dataset.looping === 'true';
  anim?.setLoop(!looping);
  btnLoop.dataset.looping = String(!looping);
  btnLoop.textContent = !looping ? 'Loop: On' : 'Loop: Off';
});

const speedInput = document.getElementById('speed');
speedInput.addEventListener('input', (e) => {
  anim?.setSpeed(parseFloat(e.target.value));
});

document.getElementById('btn-reset-speed').addEventListener('click', () => {
  speedInput.value = 1;
  anim?.setSpeed(1);
});

// --- Drag & drop / file picker (adds a new version) ---
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) readFile(file);
  fileInput.value = '';
});

dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) readFile(file);
});

function readFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      const label = `Version ${pad(versions.length + 1)}`;
      addVersion(label, { data });
    } catch {
      dropZone.textContent = '⚠ Invalid JSON';
      setTimeout(() => { dropZone.innerHTML = '+ Drop Lottie JSON<br>to add version'; }, 2000);
    }
  };
  reader.readAsText(file);
}
