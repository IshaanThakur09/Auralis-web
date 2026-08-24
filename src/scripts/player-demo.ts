import { WaveformVisualizer } from './visualizer';

interface DemoTrack {
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  genre: string;
  coverGradient: string;
  lyrics: { time: number; text: string }[];
}

const DEMO_TRACKS: DemoTrack[] = [
  {
    title: 'Midnight Echoes',
    artist: 'Auralis Ambient Ensemble',
    album: 'Luminescent Horizons',
    duration: 218,
    genre: 'Ambient / Electronic',
    coverGradient: 'linear-gradient(135deg, #1e293b 0%, #3b0764 50%, #14532d 100%)',
    lyrics: [
      { time: 0, text: 'Drifting through the luminous soundscape...' },
      { time: 6, text: 'Echoes resonating in the silent dark' },
      { time: 12, text: 'Every wave aligned, pure and unconfined' },
      { time: 18, text: 'Your music, flowing effortlessly' },
      { time: 24, text: 'Synchronized in harmony and light' },
    ],
  },
  {
    title: 'Neon Driftway',
    artist: 'Kroma & Solar Pulse',
    album: 'Cybernetic Dreams',
    duration: 195,
    genre: 'Synthwave / Retro',
    coverGradient: 'linear-gradient(135deg, #701a75 0%, #4c1d95 50%, #064e3b 100%)',
    lyrics: [
      { time: 0, text: 'Neon lights reflecting on the chrome horizon' },
      { time: 5, text: 'Bass frequencies accelerating the pulse' },
      { time: 11, text: 'Zero latency in the shared room stream' },
      { time: 17, text: 'Listening together across the miles' },
      { time: 23, text: 'Auralis keeps the rhythm intact' },
    ],
  },
  {
    title: 'Velvet Horizon',
    artist: 'Serenade Trio',
    album: 'Acoustic Sessions Vol. 2',
    duration: 240,
    genre: 'Indie / Acoustic',
    coverGradient: 'linear-gradient(135deg, #14532d 0%, #064e3b 50%, #1e1b4b 100%)',
    lyrics: [
      { time: 0, text: 'Gentle chords upon an open evening breeze' },
      { time: 6, text: 'Words unfurling right on time' },
      { time: 12, text: 'Real-time lyrics matching every breath' },
      { time: 18, text: 'Clean sound, no ads, no interruptions' },
      { time: 24, text: 'Pure open source listening freedom' },
    ],
  },
];

export function initPlayerDemo() {
  const canvas = document.getElementById('heroVisualizerCanvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  const visualizer = new WaveformVisualizer(canvas);

  let currentTrackIndex = 0;
  let isPlaying = true;
  let currentTime = 14;
  let isLiked = false;
  let isShuffled = false;
  let isRepeat = false;

  // DOM elements
  const playBtn = document.getElementById('heroPlayBtn');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const likeBtn = document.getElementById('heroLikeBtn');
  const shuffleBtn = document.getElementById('heroShuffleBtn');
  const repeatBtn = document.getElementById('heroRepeatBtn');
  const titleEl = document.getElementById('heroTrackTitle');
  const artistEl = document.getElementById('heroTrackArtist');
  const genreBadge = document.getElementById('heroGenreBadge');
  const artWrap = document.getElementById('heroArtWrap');
  const progressFill = document.getElementById('heroProgressFill');
  const progressBarBg = document.getElementById('heroProgressBarBg');
  const currTimeEl = document.getElementById('heroCurrentTime');
  const totalTimeEl = document.getElementById('heroTotalTime');
  const lyricsPrevEl = document.getElementById('heroLyricPrev');
  const lyricsActiveEl = document.getElementById('heroLyricActive');
  const lyricsNextEl = document.getElementById('heroLyricNext');
  const speedChips = document.querySelectorAll('.speed-dial-chip');

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function updateTrackUI() {
    const track = DEMO_TRACKS[currentTrackIndex];
    if (titleEl) titleEl.textContent = track.title;
    if (artistEl) artistEl.textContent = track.artist;
    if (genreBadge) genreBadge.textContent = track.genre;
    if (totalTimeEl) totalTimeEl.textContent = formatTime(track.duration);
    if (artWrap) {
      artWrap.style.background = track.coverGradient;
    }
    updateLyricsUI();
  }

  function updateLyricsUI() {
    const track = DEMO_TRACKS[currentTrackIndex];
    let activeIdx = 0;
    for (let i = 0; i < track.lyrics.length; i++) {
      if (currentTime >= track.lyrics[i].time) {
        activeIdx = i;
      }
    }

    if (lyricsPrevEl) {
      lyricsPrevEl.textContent = activeIdx > 0 ? track.lyrics[activeIdx - 1].text : '•••';
    }
    if (lyricsActiveEl) {
      lyricsActiveEl.textContent = track.lyrics[activeIdx].text;
    }
    if (lyricsNextEl) {
      lyricsNextEl.textContent = activeIdx < track.lyrics.length - 1 ? track.lyrics[activeIdx + 1].text : '•••';
    }
  }

  function updateProgress() {
    const track = DEMO_TRACKS[currentTrackIndex];
    if (currTimeEl) currTimeEl.textContent = formatTime(currentTime);
    const percent = Math.min(100, (currentTime / track.duration) * 100);
    if (progressFill) progressFill.style.width = `${percent}%`;
    updateLyricsUI();
  }

  // Playback timer
  setInterval(() => {
    if (isPlaying) {
      const track = DEMO_TRACKS[currentTrackIndex];
      currentTime += 1;
      if (currentTime >= track.duration) {
        currentTime = 0;
        currentTrackIndex = (currentTrackIndex + 1) % DEMO_TRACKS.length;
        updateTrackUI();
      }
      updateProgress();
    }
  }, 1000);

  // Play / Pause Toggle
  playBtn?.addEventListener('click', () => {
    isPlaying = !isPlaying;
    visualizer.setPlaying(isPlaying);
    if (playBtn) {
      playBtn.innerHTML = isPlaying
        ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`
        : `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>`;
      playBtn.setAttribute('aria-label', isPlaying ? 'Pause demo' : 'Play demo');
    }
  });

  // Next Track
  nextBtn?.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % DEMO_TRACKS.length;
    currentTime = 0;
    updateTrackUI();
    updateProgress();
  });

  // Previous Track
  prevBtn?.addEventListener('click', () => {
    if (currentTime > 3) {
      currentTime = 0;
    } else {
      currentTrackIndex = (currentTrackIndex - 1 + DEMO_TRACKS.length) % DEMO_TRACKS.length;
      currentTime = 0;
    }
    updateTrackUI();
    updateProgress();
  });

  // Like Toggle
  likeBtn?.addEventListener('click', () => {
    isLiked = !isLiked;
    likeBtn.classList.toggle('liked', isLiked);
    likeBtn.innerHTML = isLiked
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
  });

  // Shuffle Toggle
  shuffleBtn?.addEventListener('click', () => {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active', isShuffled);
  });

  // Repeat Toggle
  repeatBtn?.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
  });

  // Seek bar click
  progressBarBg?.addEventListener('click', (e) => {
    const rect = progressBarBg.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const track = DEMO_TRACKS[currentTrackIndex];
    currentTime = ratio * track.duration;
    updateProgress();
  });

  // Speed dial chip clicks
  speedChips.forEach((chip, idx) => {
    chip.addEventListener('click', () => {
      speedChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      currentTrackIndex = idx % DEMO_TRACKS.length;
      currentTime = 0;
      updateTrackUI();
      updateProgress();
    });
  });

  // Initial render
  updateTrackUI();
  updateProgress();
}
