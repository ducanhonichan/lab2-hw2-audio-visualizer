
export class AudioVisualizer {
  private readonly audioContext: AudioContext;
  private readonly analyser: AnalyserNode;
  private readonly frequencyData: Uint8Array<ArrayBuffer>;
  private animationFrameId: number | null = null;
  private isConnected = false;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.8;

    this.frequencyData = new Uint8Array(
      this.analyser.frequencyBinCount
    );
  }




connectOutput(): void {
  if (this.isConnected) return;

  this.analyser.connect(this.audioContext.destination);
  this.isConnected = true;
}






  getAnalyser(): AnalyserNode {
    return this.analyser;
  }

  getFrequencyData(): Uint8Array<ArrayBuffer> {
    this.analyser.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
  }

  getFrequencyBinCount(): number {
    return this.analyser.frequencyBinCount;
  }

  
start(canvas: HTMLCanvasElement): void {
  this.stop();

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D context is unavailable');
  }

  const draw = () => {
    const width = canvas.width;
    const height = canvas.height;

    context.clearRect(0, 0, width, height);

    const data = this.getFrequencyData();
    const barCount = 64;
    const barWidth = width / barCount;

    for (let i = 0; i < barCount; i++) {
      const index = Math.floor(i * data.length / barCount);
      const value = data[index];

      const barHeight = (value / 255) * height;

      context.fillStyle = '#38bdf8';
      context.fillRect(
        i * barWidth,
        height - barHeight,
        Math.max(barWidth - 2, 1),
        barHeight
      );
    }

    this.animationFrameId = requestAnimationFrame(draw);
  };

  this.animationFrameId = requestAnimationFrame(draw);
}

stop(): void {
  if (this.animationFrameId !== null) {
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }
}

}


