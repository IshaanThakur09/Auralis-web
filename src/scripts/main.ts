import '../styles/main.css';
import * as THREE from 'three';
import { APP_CONFIG } from './config';

function bootstrap() {
  try { initWebGLBackground(); } catch (e) { console.error('Error in initWebGLBackground:', e); }
  try { initThreeJSPlayer(); } catch (e) { console.error('Error in initThreeJSPlayer:', e); }
  try { init3DCardHoverPhysics(); } catch (e) { console.error('Error in init3DCardHoverPhysics:', e); }
  try { initLyricsScroller(); } catch (e) { console.error('Error in initLyricsScroller:', e); }
  try { initEqualizerVisualizer(); } catch (e) { console.error('Error in initEqualizerVisualizer:', e); }
  try { initPlayerControls(); } catch (e) { console.error('Error in initPlayerControls:', e); }
  try { initDownloadAndChecksum(); } catch (e) { console.error('Error in initDownloadAndChecksum:', e); }
  try { initMobileNavigation(); } catch (e) { console.error('Error in initMobileNavigation:', e); }
  try { initScrollEffects(); } catch (e) { console.error('Error in initScrollEffects:', e); }
  try { initFAQAccordion(); } catch (e) { console.error('Error in initFAQAccordion:', e); }
  try { initKeyframeSmoothScroll(); } catch (e) { console.error('Error in initKeyframeSmoothScroll:', e); }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

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
  const height = container.clientHeight || 540;

  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.z = width < 600 ? 7.2 : 6.8;

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

  // Outer Grand Torus Ring 1 (Prominent Olive Accent #d2e780 - Open-face dynamic angle)
  const ring1Geo = new THREE.TorusGeometry(4.7, 0.052, 16, 160);
  const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xd2e780, transparent: true, opacity: 0.96 });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = 0.42;
  ring1.rotation.y = 0.28;
  group.add(ring1);

  // Inner Intersecting Torus Ring 2 (Deep Muted Olive #687d3a - Crossed open angle)
  const ring2Geo = new THREE.TorusGeometry(4.1, 0.042, 16, 160);
  const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x687d3a, transparent: true, opacity: 0.9 });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = -0.52;
  ring2.rotation.y = 0.65;
  group.add(ring2);

  // Equatorial Orbital Ring 3 (Soft Olive #8ea05e - Wide open orbit)
  const ring3Geo = new THREE.TorusGeometry(4.4, 0.038, 16, 150);
  const ring3Mat = new THREE.MeshBasicMaterial({ color: 0x8ea05e, transparent: true, opacity: 0.85 });
  const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
  ring3.rotation.x = 0.85;
  ring3.rotation.z = 0.45;
  group.add(ring3);

  // Center Wireframe Icosahedron Core (Enlarged Soft Olive #d2e780)
  const coreGeo = new THREE.IcosahedronGeometry(2.8, 1);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xd2e780,
    wireframe: true,
    transparent: true,
    opacity: 0.45,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Orbiting Floating Particles (Olive tones - Expansive spread)
  const particleGeo = new THREE.BufferGeometry();
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 4.2 + Math.random() * 2.2;
    positions[i] = Math.cos(angle) * radius;
    positions[i + 1] = (Math.random() - 0.5) * 4.4;
    positions[i + 2] = Math.sin(angle) * radius;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xd2e780,
    size: 0.065,
    transparent: true,
    opacity: 0.85,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  group.add(particles);

  // Clean Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
  scene.add(ambientLight);

  const oliveLight = new THREE.PointLight(0xd2e780, 3.2, 30);
  oliveLight.position.set(4, 4, 4);
  scene.add(oliveLight);

  const forestLight = new THREE.PointLight(0x44532b, 2.4, 30);
  forestLight.position.set(-4, -4, 3);
  scene.add(forestLight);

  // Autonomous Smooth 3D Orbiting Loop (Zero Mouse/Hover Jitter)
  function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.0015;

    group.rotation.y = Math.sin(time * 0.35) * 0.3;
    group.rotation.x = Math.cos(time * 0.25) * 0.15;
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
    const h = container.clientHeight || 540;
    camera.aspect = w / h;
    camera.position.z = w < 600 ? 7.2 : 6.8;
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
 * 6. 3D Flashy Holographic Audio Waveform Seekbar Engine (Non-Interactive)
 */
function initPlayerControls() {
  const playBtn = document.getElementById('heroPlayBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const progressBar = document.getElementById('scrubberFill');
  const currentTimeEl = document.getElementById('currentTime');
  const barsTrack = document.getElementById('seekbarBarsTrack');

  const barEl = progressBar as HTMLElement;
  const timeEl = currentTimeEl as HTMLElement;

  // Initialize 28 dynamic 3D frequency equalizer bars
  const totalBars = 28;
  const barElements: HTMLElement[] = [];

  if (barsTrack) {
    barsTrack.innerHTML = '';
    for (let i = 0; i < totalBars; i++) {
      const bar = document.createElement('div');
      bar.className = 'seekbar-freq-bar';
      const initialHeight = 25 + Math.sin(i * 0.4) * 20 + (i % 3) * 12;
      bar.style.height = `${initialHeight}%`;
      barsTrack.appendChild(bar);
      barElements.push(bar);
    }
  }

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

  // Smooth 60 FPS continuous procedural 3D frequency seekbar playback tick
  function tickPlayback(now: number) {
    if (isPlaying) {
      const delta = (now - lastTimestamp) / 1000;
      currentElapsedSeconds += delta;
      if (currentElapsedSeconds >= totalSeconds) {
        currentElapsedSeconds = 0;
      }

      const progressPercent = (currentElapsedSeconds / totalSeconds) * 100;
      if (barEl) {
        barEl.style.width = `${progressPercent.toFixed(2)}%`;
      }
      if (timeEl) {
        timeEl.textContent = formatTime(currentElapsedSeconds);
      }

      // Dynamically animate 3D audio frequency equalizer bars
      const progressFraction = currentElapsedSeconds / totalSeconds;
      const activeBarIndex = Math.floor(progressFraction * totalBars);

      barElements.forEach((bar, idx) => {
        const freqOffset = Math.sin(now * 0.006 + idx * 0.5) * 30 + Math.cos(now * 0.003 + idx * 0.8) * 15;
        const dynamicH = Math.min(Math.max(20 + freqOffset + ((idx * 7) % 25), 12), 95);
        bar.style.height = `${dynamicH}%`;

        if (idx <= activeBarIndex) {
          bar.classList.add('is-played');
        } else {
          bar.classList.remove('is-played');
        }
      });
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
        link.download = 'Auralis-v1.0.0-universal.apk';
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
  const overlay = document.getElementById('mobileMenuOverlay');
  const drawerLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileBtn || !drawer) return;

  function toggleDrawer(open?: boolean) {
    if (!drawer || !mobileBtn) return;
    const willOpen = open !== undefined ? open : !drawer.classList.contains('is-open');

    drawer.classList.toggle('is-open', willOpen);
    mobileBtn.classList.toggle('is-active', willOpen);
    if (overlay) {
      overlay.classList.toggle('is-visible', willOpen);
    }
    document.body.classList.toggle('menu-open', willOpen);
    mobileBtn.setAttribute('aria-expanded', String(willOpen));
  }

  mobileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDrawer();
  });

  if (overlay) {
    overlay.addEventListener('click', () => toggleDrawer(false));
  }

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      toggleDrawer(false);
    }
  });

  // Auto-close when resized to desktop viewport
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && drawer.classList.contains('is-open')) {
      toggleDrawer(false);
    }
  });

  // Auto-close if user scrolls past a threshold
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (drawer.classList.contains('is-open')) {
      if (Math.abs(window.scrollY - lastScrollY) > 50) {
        toggleDrawer(false);
      }
    } else {
      lastScrollY = window.scrollY;
    }
  }, { passive: true });
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

/**
 * 10. FAQ Accordion Accessibility & Sync
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll<HTMLDetailsElement>('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const summary = item.querySelector<HTMLElement>('.faq-summary');
    if (!summary) return;

    // Set initial ARIA state
    summary.setAttribute('aria-expanded', item.open ? 'true' : 'false');

    // Keep ARIA in sync with details toggle
    item.addEventListener('toggle', () => {
      summary.setAttribute('aria-expanded', item.open ? 'true' : 'false');
    });

    // Support browser Find in page / search-hidden-content
    item.addEventListener('beforematch', () => {
      item.open = true;
      summary.setAttribute('aria-expanded', 'true');
    });
  });
}

/**
 * 11. Cinematic Keyframe Smooth Scroll Engine
 * Aligned with Google Stitch Nocturnal Holographic Design Guidelines.
 * Ensures clicking navigation & action buttons (such as "Download" in the header)
 * executes a multi-frame cinematic keyframe scroll instead of an instant single-frame snap.
 */
let activeScrollAnimationId: number | null = null;
let restoreScrollBehaviorTimer: number | null = null;

function cancelCurrentScrollAnimation() {
  if (activeScrollAnimationId !== null) {
    cancelAnimationFrame(activeScrollAnimationId);
    activeScrollAnimationId = null;
  }
}

/**
 * Keyframe quartic easing curve:
 * Produces a gradual, refined camera launch, high-speed fluid transit,
 * and an ultra-soft settling deceleration into the target zone.
 */
function keyframeEaseInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

/**
 * Triggers Stitch Nocturnal Neon Olive bloom highlight on arrival
 */
function triggerArrivalHighlight(targetEl: HTMLElement | null) {
  if (!targetEl) return;
  const card = targetEl.classList.contains('download-glass-card')
    ? targetEl
    : targetEl.querySelector<HTMLElement>('.download-glass-card') || targetEl;

  card.classList.remove('arrival-pulse');
  // Trigger DOM reflow to restart CSS animation cleanly
  void card.offsetWidth;
  card.classList.add('arrival-pulse');

  setTimeout(() => {
    card.classList.remove('arrival-pulse');
  }, 1600);
}

/**
 * Programmatic Smooth Keyframe Scroller
 */
export function smoothScrollToTarget(
  target: HTMLElement | string,
  options: {
    duration?: number;
    offset?: number;
    onComplete?: () => void;
  } = {}
) {
  cancelCurrentScrollAnimation();

  const targetEl = typeof target === 'string'
    ? document.querySelector<HTMLElement>(target)
    : target;

  if (!targetEl) return;
  const destinationEl: HTMLElement = targetEl;

  const header = document.querySelector<HTMLElement>('.site-header');
  const headerHeight = header ? header.offsetHeight : 64;
  const extraOffset = options.offset !== undefined ? options.offset : 20;

  const startY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
  const targetRect = destinationEl.getBoundingClientRect();
  const maxScroll = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  ) - window.innerHeight;

  const targetY = Math.min(
    maxScroll,
    Math.max(0, targetRect.top + startY - headerHeight - extraOffset)
  );
  const distance = targetY - startY;

  // If already at target
  if (Math.abs(distance) < 4) {
    triggerArrivalHighlight(destinationEl);
    if (options.onComplete) options.onComplete();
    return;
  }

  // Calculate dynamic duration based on travel distance:
  // Short leaps (~400px): ~680ms, Massive leaps (top to bottom ~3000px): ~1100ms
  const distanceAbs = Math.abs(distance);
  const duration = options.duration || Math.min(1200, Math.max(650, Math.round(distanceAbs * 0.32 + 380)));

  // Temporarily set document scrollBehavior to auto so CSS doesn't fight rAF
  const docEl = document.documentElement;
  const prevScrollBehavior = docEl.style.scrollBehavior;
  docEl.style.scrollBehavior = 'auto';

  let startTime: number | null = null;
  const animationStartTime = performance.now();

  // Listeners to stop animation only if user intentionally scrolls
  function onWheelInterrupt(e: WheelEvent) {
    // Ignore initial inertia during first 150ms
    if (performance.now() - animationStartTime < 150) return;
    if (Math.abs(e.deltaY) > 4) {
      cancelCurrentScrollAnimation();
      docEl.style.scrollBehavior = prevScrollBehavior;
      removeInterruptListeners();
    }
  }

  function onTouchInterrupt() {
    if (performance.now() - animationStartTime < 150) return;
    cancelCurrentScrollAnimation();
    docEl.style.scrollBehavior = prevScrollBehavior;
    removeInterruptListeners();
  }

  function addInterruptListeners() {
    window.addEventListener('wheel', onWheelInterrupt, { passive: true });
    window.addEventListener('touchstart', onTouchInterrupt, { passive: true });
  }

  function removeInterruptListeners() {
    window.removeEventListener('wheel', onWheelInterrupt);
    window.removeEventListener('touchstart', onTouchInterrupt);
  }

  addInterruptListeners();

  function step(currentTime: number) {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = keyframeEaseInOutQuart(progress);

    const currentY = startY + distance * easedProgress;
    window.scrollTo({ top: currentY, behavior: 'auto' });
    document.documentElement.scrollTop = currentY;
    document.body.scrollTop = currentY;

    if (progress < 1) {
      activeScrollAnimationId = requestAnimationFrame(step);
    } else {
      activeScrollAnimationId = null;
      removeInterruptListeners();
      window.scrollTo({ top: targetY, behavior: 'auto' });
      document.documentElement.scrollTop = targetY;
      document.body.scrollTop = targetY;

      // Restore scroll behavior after animation completes
      if (restoreScrollBehaviorTimer) clearTimeout(restoreScrollBehaviorTimer);
      restoreScrollBehaviorTimer = window.setTimeout(() => {
        docEl.style.scrollBehavior = prevScrollBehavior;
      }, 50);

      // Trigger Stitch arrival highlight
      triggerArrivalHighlight(destinationEl);

      if (options.onComplete) {
        options.onComplete();
      }
    }
  }

  activeScrollAnimationId = requestAnimationFrame(step);
}

function initKeyframeSmoothScroll() {
  const anchorLinks = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href) return;

      if (href === '#' || href === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetEl = document.querySelector<HTMLElement>(href);
      if (!targetEl) return;

      // Prevent native single-frame jump
      e.preventDefault();

      // If mobile navigation drawer is currently open, close it cleanly
      const drawer = document.getElementById('mobileDrawer');
      const mobileBtn = document.getElementById('mobileMenuBtn');
      const overlay = document.getElementById('mobileMenuOverlay');
      if (drawer?.classList.contains('is-open')) {
        drawer.classList.remove('is-open');
        mobileBtn?.classList.remove('is-active');
        mobileBtn?.setAttribute('aria-expanded', 'false');
        overlay?.classList.remove('is-visible');
        document.body.classList.remove('menu-open');
      }

      // Execute smooth keyframe scroll animation
      smoothScrollToTarget(targetEl, {
        onComplete: () => {
          // Update URL hash without causing an instant layout jump
          if (history.pushState) {
            history.pushState(null, '', href);
          } else {
            window.location.hash = href;
          }

          // Retain accessibility focus without browser jump
          targetEl.setAttribute('tabindex', '-1');
          targetEl.focus({ preventScroll: true });
        }
      });
    });
  });

  // Also support the brand logo to smooth scroll to top when already on the home page
  const brandLink = document.querySelector<HTMLAnchorElement>('.brand-link');
  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        e.preventDefault();
        cancelCurrentScrollAnimation();
        const startY = window.pageYOffset || document.documentElement.scrollTop || 0;
        if (startY > 10) {
          const docEl = document.documentElement;
          const prevScrollBehavior = docEl.style.scrollBehavior;
          docEl.style.scrollBehavior = 'auto';

          let startTime: number | null = null;
          const duration = Math.min(950, Math.max(500, Math.round(startY * 0.35)));

          function step(currentTime: number) {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = keyframeEaseInOutQuart(progress);
            window.scrollTo(0, startY * (1 - easedProgress));

            if (progress < 1) {
              activeScrollAnimationId = requestAnimationFrame(step);
            } else {
              activeScrollAnimationId = null;
              window.scrollTo(0, 0);
              docEl.style.scrollBehavior = prevScrollBehavior;
            }
          }
          activeScrollAnimationId = requestAnimationFrame(step);
        }
      }
    });
  }
}


