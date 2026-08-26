import '../styles/main.css';
import * as THREE from 'three';
import { APP_CONFIG } from './config';

document.addEventListener('DOMContentLoaded', () => {
  initWebGLBackground();
  initThreeJSPlayer();
  init3DCardHoverPhysics();
  initLyricsScroller();
  initEqualizerVisualizer();
  initPlayerControls();
  initDownloadAndChecksum();
  initMobileNavigation();
  initScrollEffects();
});

/**
 * 1. WebGL Organic Ambient Flow Shader (Background)
 */
function initWebGLBackground() {
  const canvas = document.getElementById('shader-bg-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  const rawGl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!rawGl) return;
  const gl = rawGl as WebGLRenderingContext;

  function resizeCanvas() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const vsSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fsSource = `
    precision highp float;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    varying vec2 v_uv;

    void main() {
      vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
      vec2 mouseNorm = (u_mouse.xy / u_resolution.xy) * 2.0 - 1.0;
      
      // Organic flow calculations
      for (float i = 1.0; i < 4.0; i++) {
        p.x += 0.35 / i * sin(i * 2.5 * p.y + u_time * 0.4 + 0.3 * i) + (mouseNorm.x * 0.08);
        p.y += 0.35 / i * cos(i * 2.5 * p.x + u_time * 0.4 + 0.3 * i) - (mouseNorm.y * 0.08);
      }

      // Brand Nocturnal Canvas & Exact Olive Colors
      vec3 midnight   = vec3(0.047, 0.055, 0.047); // #0c0e0c
      vec3 olive      = vec3(0.823, 0.906, 0.502); // #d2e780
      vec3 darkForest = vec3(0.133, 0.169, 0.106); // #222b1b

      float intensity = 0.5 + 0.5 * sin(p.x * 1.5 + p.y * 1.5 + u_time * 0.3);
      vec3 flowColor = mix(darkForest, olive, intensity * 0.35);
      vec3 finalColor = mix(midnight, flowColor, 0.28);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  function createShader(type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vs = createShader(gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return;

  const program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  const posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(program, 'u_time');
  const uRes = gl.getUniformLocation(program, 'u_resolution');
  const uMouse = gl.getUniformLocation(program, 'u_mouse');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = window.innerHeight - e.clientY;
  });

  function render(time: number) {
    resizeCanvas();
    gl.viewport(0, 0, canvas?.width || 0, canvas?.height || 0);
    if (uTime) gl.uniform1f(uTime, time * 0.001);
    if (uRes && canvas) gl.uniform2f(uRes, canvas.width, canvas.height);
    if (uMouse) gl.uniform2f(uMouse, mouseX, mouseY);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

/**
 * 2. Three.js 3D Holographic Orbit Sound Ring Scene (Hero Stage)
 */
function initThreeJSPlayer() {
  const container = document.getElementById('threejs-player-container');
  if (!container) return;

  container.innerHTML = '';

  const scene = new THREE.Scene();
  const width = container.clientWidth || 400;
  const height = container.clientHeight || 500;

  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.pointerEvents = 'none';

  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  // Outer Crisp Torus Ring 1 (Prominent Olive Accent #d2e780)
  const ring1Geo = new THREE.TorusGeometry(3.55, 0.038, 16, 140);
  const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xd2e780, transparent: true, opacity: 0.92 });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 2.3;
  group.add(ring1);

  // Inner Soundwave Ring 2 (Deep Muted Olive #687d3a)
  const ring2Geo = new THREE.TorusGeometry(2.95, 0.028, 16, 140);
  const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x687d3a, transparent: true, opacity: 0.85 });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.y = Math.PI / 3;
  group.add(ring2);

  // Equatorial Orbital Ring 3 (Soft Olive #8ea05e)
  const ring3Geo = new THREE.TorusGeometry(3.25, 0.024, 16, 130);
  const ring3Mat = new THREE.MeshBasicMaterial({ color: 0x8ea05e, transparent: true, opacity: 0.75 });
  const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
  ring3.rotation.x = Math.PI / 1.6;
  ring3.rotation.z = Math.PI / 5;
  group.add(ring3);

  // Center Wireframe Icosahedron Core (Enlarged Soft Olive #dced9a)
  const coreGeo = new THREE.IcosahedronGeometry(2.2, 1);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xdced9a,
    wireframe: true,
    transparent: true,
    opacity: 0.32,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Orbiting Floating Particles (Olive tones)
  const particleGeo = new THREE.BufferGeometry();
  const particleCount = 80;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3.2 + Math.random() * 1.6;
    positions[i] = Math.cos(angle) * radius;
    positions[i + 1] = (Math.random() - 0.5) * 3.6;
    positions[i + 2] = Math.sin(angle) * radius;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xd2e780,
    size: 0.055,
    transparent: true,
    opacity: 0.8,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  group.add(particles);

  // Clean Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const oliveLight = new THREE.PointLight(0xd2e780, 2.5, 25);
  oliveLight.position.set(4, 4, 4);
  scene.add(oliveLight);

  const forestLight = new THREE.PointLight(0x44532b, 2.0, 25);
  forestLight.position.set(-4, -4, 3);
  scene.add(forestLight);

  // Mouse Parallax Interaction
  let targetRotationX = 0;
  let targetRotationY = 0;
  let mouseTiltX = 0;
  let mouseTiltY = 0;

  window.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseTiltX = (e.clientX - centerX) / (window.innerWidth / 2);
    mouseTiltY = (e.clientY - centerY) / (window.innerHeight / 2);
  });

  function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.0015;

    targetRotationY = Math.sin(time * 0.5) * 0.2 + mouseTiltX * 0.4;
    targetRotationX = Math.cos(time * 0.4) * 0.15 + mouseTiltY * 0.3;

    group.rotation.y += (targetRotationY - group.rotation.y) * 0.06;
    group.rotation.x += (targetRotationX - group.rotation.x) * 0.06;
    group.position.y = Math.sin(time * 1.2) * 0.15;

    ring1.rotation.z += 0.007;
    ring2.rotation.z -= 0.011;
    ring3.rotation.y += 0.009;
    ring1.scale.setScalar(1 + Math.sin(time * 2) * 0.035);
    core.rotation.x += 0.004;
    core.rotation.y += 0.006;

    particles.rotation.y += 0.003;

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    const w = container.clientWidth || 400;
    const h = container.clientHeight || 500;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  animate();
}

/**
 * 3. 3D Card Hover Physics & Specular Lighting
 */
function init3DCardHoverPhysics() {
  const cards = document.querySelectorAll<HTMLElement>('.tilt-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (range: -10 to 10 deg)
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
    });
  });
}

/**
 * 4. Synchronized Real-Time Lyrics Ticker
 */
function initLyricsScroller() {
  const lyricsContainer = document.getElementById('lyricsTrackList');
  if (!lyricsContainer) return;

  const lines = lyricsContainer.querySelectorAll('.lyric-item');
  if (lines.length === 0) return;

  let activeIndex = 1;

  setInterval(() => {
    lines.forEach((line, idx) => {
      if (idx === activeIndex) {
        line.classList.add('is-active');
      } else {
        line.classList.remove('is-active');
      }
    });

    const translateY = (1 - activeIndex) * 28;
    lyricsContainer.style.transform = `translateY(${translateY}px)`;

    activeIndex = (activeIndex + 1) % lines.length;
  }, 2600);
}

/**
 * 5. Procedural Frequency Audio Equalizer
 */
function initEqualizerVisualizer() {
  const eqContainer = document.getElementById('equalizerBars');
  if (!eqContainer) return;

  const barCount = 18;
  eqContainer.innerHTML = '';

  const bars: HTMLElement[] = [];
  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement('div');
    bar.className = 'eq-bar';
    bar.style.height = `${15 + Math.random() * 70}%`;
    eqContainer.appendChild(bar);
    bars.push(bar);
  }

  setInterval(() => {
    bars.forEach((bar, index) => {
      const dynamicHeight = 15 + Math.sin(Date.now() * 0.005 + index * 0.4) * 35 + Math.random() * 45;
      bar.style.height = `${Math.min(Math.max(dynamicHeight, 8), 100)}%`;
    });
  }, 120);
}

/**
 * 6. 3D Holographic Animated Seekbar & Controls (Non-Interactive Seekbar)
 */
function initPlayerControls() {
  const playBtn = document.getElementById('heroPlayBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const progressBar = document.getElementById('scrubberFill');
  const currentTimeEl = document.getElementById('currentTime');

  const barEl = progressBar as HTMLElement;
  const timeEl = currentTimeEl as HTMLElement;

  let isPlaying = true;
  const totalSeconds = 230; // 3:50 total track time
  let currentElapsedSeconds = 101; // Start at 1:41 (44%)
  let lastTimestamp = performance.now();

  function formatTime(secs: number): string {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (playIcon && pauseIcon) {
        playIcon.style.display = isPlaying ? 'none' : 'block';
        pauseIcon.style.display = isPlaying ? 'block' : 'none';
      }
      lastTimestamp = performance.now();
    });
  }

  // Smooth continuous procedural 3D playback tick
  function tickPlayback(now: number) {
    if (isPlaying) {
      const delta = (now - lastTimestamp) / 1000;
      currentElapsedSeconds += delta;
      if (currentElapsedSeconds >= totalSeconds) {
        currentElapsedSeconds = 0;
      }
      const progressPercent = (currentElapsedSeconds / totalSeconds) * 100;
      barEl.style.width = `${progressPercent.toFixed(2)}%`;
      timeEl.textContent = formatTime(currentElapsedSeconds);
    }
    lastTimestamp = now;
    requestAnimationFrame(tickPlayback);
  }

  requestAnimationFrame((now) => {
    lastTimestamp = now;
    tickPlayback(now);
  });
}

/**
 * 7. APK Direct Download Handler
 */
function initDownloadAndChecksum() {
  const downloadBtns = document.querySelectorAll<HTMLElement>('[data-action="download-apk"]');

  downloadBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (APP_CONFIG.apkDownloadUrl && APP_CONFIG.apkDownloadUrl.trim() !== '') {
        showToast('Initiating Auralis APK download...');
        const link = document.createElement('a');
        link.href = APP_CONFIG.apkDownloadUrl;
        link.download = 'auralis.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        showToast('Redirecting to official GitHub releases...');
        setTimeout(() => {
          window.open(APP_CONFIG.githubRepoUrl, '_blank', 'noopener,noreferrer');
        }, 800);
      }
    });
  });
}

/**
 * 8. Mobile Navigation Drawer
 */
function initMobileNavigation() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileBtn || !drawer) return;

  function toggleDrawer(open?: boolean) {
    if (!drawer || !mobileBtn) return;
    const isOpen = open !== undefined ? open : !drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open', isOpen);
    mobileBtn.setAttribute('aria-expanded', String(isOpen));
  }

  mobileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDrawer();
  });

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  document.addEventListener('click', (e) => {
    if (drawer && drawer.classList.contains('is-open') && !drawer.contains(e.target as Node) && e.target !== mobileBtn) {
      toggleDrawer(false);
    }
  });
}

/**
 * 9. Scroll Effects for Header
 */
function initScrollEffects() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  });
}

/**
 * Toast Notification Utility
 */
function showToast(message: string) {
  let toastContainer = document.getElementById('toastNotification');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastNotification';
    toastContainer.className = 'toast-container';
    toastContainer.innerHTML = `<div class="toast-body"><span id="toastMsgText"></span></div>`;
    document.body.appendChild(toastContainer);
  }

  const msgText = document.getElementById('toastMsgText');
  if (msgText) msgText.textContent = message;

  toastContainer.classList.add('is-visible');
  setTimeout(() => {
    toastContainer?.classList.remove('is-visible');
  }, 3500);
}
