import lottie from 'lottie-web';

const container = document.getElementById('lottie-container');
const versionList = document.getElementById('version-list');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const timeline = document.getElementById('timeline');
const frameReadout = document.getElementById('frame-readout');
const btnPrevFrame = document.getElementById('btn-prev-frame');
const btnNextFrame = document.getElementById('btn-next-frame');

// --- Version store ---
// Each entry: { label: string, src: string | null, data: object | null }
// src = URL path for path-loaded animations; data = parsed JSON for uploaded ones
const versions = [];
let activeIndex = -1;
let anim = null;
let isScrubbing = false;

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
  attachTimelineHandlers();
}

function attachTimelineHandlers() {
  if (!anim) return;

  const syncTimelineBounds = () => {
    const maxFrame = Math.max(0, Math.round((anim.totalFrames || 1) - 1));
    timeline.min = '0';
    timeline.max = String(maxFrame);
    updateTimelineFromAnim();
  };

  anim.addEventListener('DOMLoaded', syncTimelineBounds);
  anim.addEventListener('enterFrame', updateTimelineFromAnim);
  syncTimelineBounds();
}

function updateTimelineFromAnim() {
  if (!anim || isScrubbing) return;
  const current = clampFrame(Math.round(anim.currentFrame || 0));
  timeline.value = String(current);
  frameReadout.textContent = `${current} / ${timeline.max}`;
}

function clampFrame(value) {
  const min = Number(timeline.min || 0);
  const max = Number(timeline.max || 0);
  return Math.min(max, Math.max(min, value));
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
document.getElementById('btn-stop').addEventListener('click', () => {
  anim?.stop();
  updateTimelineFromAnim();
});

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

timeline.addEventListener('input', () => {
  if (!anim) return;
  isScrubbing = true;
  const frame = clampFrame(Number(timeline.value));
  anim.goToAndStop(frame, true);
  frameReadout.textContent = `${frame} / ${timeline.max}`;
});

timeline.addEventListener('change', () => {
  isScrubbing = false;
  updateTimelineFromAnim();
});

btnPrevFrame.addEventListener('click', () => {
  if (!anim) return;
  const frame = clampFrame(Math.round(anim.currentFrame || 0) - 1);
  anim.goToAndStop(frame, true);
  isScrubbing = false;
  updateTimelineFromAnim();
});

btnNextFrame.addEventListener('click', () => {
  if (!anim) return;
  const frame = clampFrame(Math.round(anim.currentFrame || 0) + 1);
  anim.goToAndStop(frame, true);
  isScrubbing = false;
  updateTimelineFromAnim();
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
