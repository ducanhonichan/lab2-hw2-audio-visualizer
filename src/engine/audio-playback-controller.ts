
export class AudioPlaybackController {
  private activeSource: AudioBufferSourceNode | null = null;

  
private readonly audioContext: AudioContext;
private readonly analyser: AnalyserNode;

constructor(
  audioContext: AudioContext,
  analyser: AnalyserNode
) {
  this.audioContext = audioContext;
  this.analyser = analyser;
}


  play(buffer: AudioBuffer): void {
    this.stop();

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;

    source.connect(this.analyser);

    source.onended = () => {
      source.disconnect();
      source.onended = null;

      if (this.activeSource === source) {
        this.activeSource = null;
      }
    };

    this.activeSource = source;
    source.start();
  }

  stop(): void {
    const source = this.activeSource;
    if (!source) return;

    this.activeSource = null;
    source.onended = null;

    try {
      source.stop();
    } finally {
      source.disconnect();
    }
  }
}
