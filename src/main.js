import lottie from 'lottie-web';

// Default built-in demo animation (simple pulsing circle)
const demoAnimation = {
  v: '5.7.4', fr: 30, ip: 0, op: 60, w: 320, h: 320, nm: 'Demo', ddd: 0,
  assets: [],
  layers: [{
    ddd: 0, ind: 1, ty: 4, nm: 'Circle', sr: 1, ks: {
      o: { a: 0, k: 100 }, r: { a: 0, k: 0 },
      p: { a: 0, k: [160, 160, 0] },
      s: { a: 1, k: [
        { i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] }, t: 0,  s: [60, 60, 100] },
        { i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] }, t: 30, s: [100, 100, 100] },
        { t: 60, s: [60, 60, 100] }
      ]}
    },
    ao: 0, ip: 0, op: 60, st: 0,
    shapes: [{
      ty: 'gr', it: [
        { ty: 'el', s: { a: 0, k: [120, 120] }, p: { a: 0, k: [0, 0] } },
        { ty: 'fl', c: { a: 1, k: [
          { i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] }, t: 0,  s: [0.914, 0.271, 0.376, 1] },
          { i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] }, t: 30, s: [0.059, 0.204, 0.376, 1] },
          { t: 60, s: [0.914, 0.271, 0.376, 1] }
        ]}, o: { a: 0, k: 100 }, r: 1 },
        { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
      ]
    }]
  }]
};

const container = document.getElementById('lottie-container');

let anim = lottie.loadAnimation({
  container,
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: '/data.json',
});

// Controls
document.getElementById('btn-play').addEventListener('click', () => anim.play());
document.getElementById('btn-pause').addEventListener('click', () => anim.pause());
document.getElementById('btn-stop').addEventListener('click', () => { anim.stop(); });

const btnLoop = document.getElementById('btn-loop');
btnLoop.addEventListener('click', () => {
  const looping = btnLoop.dataset.looping === 'true';
  anim.setLoop(!looping);
  btnLoop.dataset.looping = String(!looping);
  btnLoop.textContent = !looping ? 'Loop: On' : 'Loop: Off';
});

document.getElementById('speed').addEventListener('input', (e) => {
  anim.setSpeed(parseFloat(e.target.value));
});

// Drag & drop / file picker
function loadJSON(data) {
  anim.destroy();
  anim = lottie.loadAnimation({
    container,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: data,
  });
  anim.setSpeed(parseFloat(document.getElementById('speed').value));
}

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');

dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) readFile(file);
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
      loadJSON(data);
      dropZone.textContent = `Loaded: ${file.name}`;
    } catch {
      dropZone.textContent = 'Invalid JSON file';
    }
  };
  reader.readAsText(file);
}

document.querySelector('#app').innerHTML = `
<section id="center">
  <div class="hero">
    <img src="${heroImg}" class="base" width="170" height="179">
    <img src="${javascriptLogo}" class="framework" alt="JavaScript logo"/>
    <img src="${viteLogo}" class="vite" alt="Vite logo" />
  </div>
  <div>
    <h1>Get started</h1>
    <p>Edit <code>src/main.js</code> and save to test <code>HMR</code></p>
  </div>
  <button id="counter" type="button" class="counter"></button>
</section>

<div class="ticks"></div>

<section id="next-steps">
  <div id="docs">
    <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#documentation-icon"></use></svg>
    <h2>Documentation</h2>
    <p>Your questions, answered</p>
    <ul>
      <li>
        <a href="https://vite.dev/" target="_blank">
          <img class="logo" src="${viteLogo}" alt="" />
          Explore Vite
        </a>
      </li>
      <li>
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
          <img class="button-icon" src="${javascriptLogo}" alt="">
          Learn more
        </a>
      </li>
    </ul>
  </div>
  <div id="social">
    <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#social-icon"></use></svg>
    <h2>Connect with us</h2>
    <p>Join the Vite community</p>
    <ul>
      <li><a href="https://github.com/vitejs/vite" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#github-icon"></use></svg>GitHub</a></li>
      <li><a href="https://chat.vite.dev/" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#discord-icon"></use></svg>Discord</a></li>
      <li><a href="https://x.com/vite_js" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#x-icon"></use></svg>X.com</a></li>
      <li><a href="https://bsky.app/profile/vite.dev" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#bluesky-icon"></use></svg>Bluesky</a></li>
    </ul>
  </div>
</section>

<div class="ticks"></div>
<section id="spacer"></section>
`

setupCounter(document.querySelector('#counter'))
