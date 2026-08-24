/**
 * Ambient Audio Waveform Visualizer for Auralis Hero Player
 */

export class WaveformVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isPlaying: boolean = true;
  private animationFrameId: number | null = null;
  private barsCount: number = 32;
  private barHeights: number[] = [];
  private targetHeights: number[] = [];

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Could not get canvas 2d context');
    this.ctx = context;

    this.initBars();
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
    this.startAnimation();
  }

  private initBars() {
    this.barHeights = [];
    this.targetHeights = [];
    for (let i = 0; i < this.barsCount; i++) {
      this.barHeights.push(Math.random() * 0.4 + 0.1);
      this.targetHeights.push(Math.random() * 0.8 + 0.2);
    }
  }

  private handleResize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  public setPlaying(playing: boolean) {
    this.isPlaying = playing;
  }

  private startAnimation() {
    let lastTime = performance.now();

    const render = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      const rect = this.canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      this.ctx.clearRect(0, 0, width, height);

      const barWidth = Math.max(2, (width - (this.barsCount - 1) * 3) / this.barsCount);
      const gap = 3;

      // Update target heights periodically
      if (this.isPlaying) {
        for (let i = 0; i < this.barsCount; i++) {
          if (Math.random() < 0.15) {
            this.targetHeights[i] = Math.random() * 0.85 + 0.15;
          }
          // Smooth interpolation
          this.barHeights[i] += (this.targetHeights[i] - this.barHeights[i]) * Math.min(1, delta * 12);
        }
      } else {
        // Flatline / idle state when paused
        for (let i = 0; i < this.barsCount; i++) {
          this.barHeights[i] += (0.08 - this.barHeights[i]) * Math.min(1, delta * 6);
        }
      }

      // Draw rounded gradient bars
      for (let i = 0; i < this.barsCount; i++) {
        const x = i * (barWidth + gap);
        const barH = this.barHeights[i] * height;
        const y = (height - barH) / 2;

        const gradient = this.ctx.createLinearGradient(0, y, 0, y + barH);
        gradient.addColorStop(0, '#dbe7b5');
        gradient.addColorStop(0.5, '#a3e635');
        gradient.addColorStop(1, '#c084fc');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        if (this.ctx.roundRect) {
          this.ctx.roundRect(x, y, barWidth, Math.max(3, barH), 2);
        } else {
          this.ctx.rect(x, y, barWidth, Math.max(3, barH));
        }
        this.ctx.fill();
      }

      this.animationFrameId = requestAnimationFrame(render);
    };

    this.animationFrameId = requestAnimationFrame(render);
  }

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
