import {
  testAudioQueue,
  testCancelPendingTasks,
} from './tests/audio-queue-test';




import { useEffect, useRef, useState } from 'react';
import { AudioTaskQueue } from './engine/audio-queue-controller';
import { AudioVisualizer } from './engine/audio-visualizer';
import { AudioPlaybackController } from './engine/audio-playback-controller';
import './App.css';


function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
const audioContextRef = useRef<AudioContext | null>(null);
const queueRef = useRef<AudioTaskQueue | null>(null);
const visualizerRef = useRef<AudioVisualizer | null>(null);
const playbackRef = useRef<AudioPlaybackController | null>(null);
const playbackRequestRef = useRef(0);







useEffect(() => {
  return () => {
    playbackRequestRef.current += 1;

    queueRef.current?.cancelActiveTask();
    queueRef.current?.cancelPendingTasks();

    playbackRef.current?.stop();
    visualizerRef.current?.stop();

    const audioContext = audioContextRef.current;

    if (audioContext && audioContext.state !== 'closed') {
      void audioContext.close();
    }
  };
}, []);







  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState('Ready');

  
const initializeAudioEngine = () => {
  if (
    audioContextRef.current &&
    queueRef.current &&
    visualizerRef.current &&
    playbackRef.current
  ) {
    return;
  }

  const audioContext = new AudioContext();
  const visualizer = new AudioVisualizer(audioContext);

  visualizer.connectOutput();

  const queue = new AudioTaskQueue({
    audioContext,
  });

  const playback = new AudioPlaybackController(
    audioContext,
    visualizer.getAnalyser()
  );

  audioContextRef.current = audioContext;
  visualizerRef.current = visualizer;
  queueRef.current = queue;
  playbackRef.current = playback;
};

const handlePlay = async () => {
  if (!selectedFile) return;

   const requestId = ++playbackRequestRef.current;

  try {
    initializeAudioEngine();

    const audioContext = audioContextRef.current;
    const queue = queueRef.current;
    const playback = playbackRef.current;
    const visualizer = visualizerRef.current;

    if (!audioContext || !queue || !playback || !visualizer) {
      throw new Error('Audio engine initialization failed');
    }

    await audioContext.resume();

    setStatus('Loading audio...');

    const fileUrl = URL.createObjectURL(selectedFile);

    try {
      
const audioBuffer = await queue.enqueue(fileUrl);

if (requestId !== playbackRequestRef.current) {
  return;
}

playback.play(audioBuffer);



      if (canvasRef.current) {
        visualizer.start(canvasRef.current);
      }

      setStatus(`Playing: ${selectedFile.name}`);
    } finally {
      URL.revokeObjectURL(fileUrl);
    }
  
} catch (error) {
  if (requestId !== playbackRequestRef.current) {
    return;
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    setStatus('Stopped');
    return;
  }

  console.error('Audio playback failed:', error);
  setStatus('Failed to play audio');
}


};










const handleStop = () => {
  playbackRequestRef.current += 1;

  queueRef.current?.cancelActiveTask();

  playbackRef.current?.stop();
  visualizerRef.current?.stop();

  setStatus('Stopped');
};








const handleTestFIFO = async () => {
  const audioContext = new AudioContext();

  try {
    await testAudioQueue(audioContext, [
      '/audio/track1.mp3',
      '/audio/track2.mp3',
      '/audio/track3.mp3',
    ]);
  } finally {
    await audioContext.close();
  }
};










const handleTestCancellation = async () => {
  const audioContext = new AudioContext();

  try {
    await testCancelPendingTasks(audioContext);
  } catch (error) {
    console.error('Cancellation test failed:', error);
  } finally {
    await audioContext.close();
  }
};













  return (
    <main className="audio-app">
      <header>
        <h1>Concurrent FIFO Audio Visualizer</h1>
        <p>Web Audio API • FIFO Queue • FFT Visualizer</p>
      </header>

      <section aria-label="Audio player">
        <h2>Audio Player</h2>

        <label htmlFor="audio-file">Select an audio file</label>
        <input
          id="audio-file"
          type="file"
          accept="audio/*"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            setSelectedFile(file);
            setStatus(file ? `Selected: ${file.name}` : 'Ready');
          }}
        />

        <div>
          
<button
  type="button"
  disabled={!selectedFile}
  onClick={handlePlay}
>
  Play
</button>

          
<button type="button" onClick={handleStop}>
  Stop
</button>





<button type="button" onClick={handleTestFIFO}>
  Test FIFO Queue
</button>







<button type="button" onClick={handleTestCancellation}>
  Test Cancellation
</button>








        </div>

        <p role="status">{status}</p>
      </section>

      <section aria-label="Audio visualization">
        <h2>Frequency Visualizer</h2>
        <canvas
          ref={canvasRef}
          width={800}
          height={240}
          aria-label="Audio frequency visualization"
          role="img"
        />
      </section>
    </main>
  );
}

export default App;
