
import { AudioTaskQueue } from '../engine/audio-queue-controller';

export async function testAudioQueue(
  audioContext: AudioContext,
  trackUrls: string[]
): Promise<void> {
  const queue = new AudioTaskQueue({
    audioContext,
    onQueueChange: (snapshot) => {
      console.log('Queue state:', snapshot);
    },
  });

  console.log('FIFO test started');

  const tasks = trackUrls.map((url, index) => {
    console.log(`Enqueue task ${index + 1}`);

    return queue.enqueue(url).then(() => {
      console.log(`Completed task ${index + 1}`);
    });
  });

  await Promise.allSettled(tasks);

  console.log('FIFO test finished');
}










export async function testCancelPendingTasks(
  audioContext: AudioContext
): Promise<void> {
  const queue = new AudioTaskQueue({
    audioContext,
    onQueueChange: (snapshot) => {
      console.log('Cancel test queue state:', snapshot);
    },
  });

  console.log('Cancellation test started');

  const trackUrls = [
    '/audio/track1.mp3',
    '/audio/track2.mp3',
    '/audio/track3.mp3',
  ];

  const tasks = trackUrls.map((url, index) => {
    console.log(`Enqueue task ${index + 1}`);

    return queue.enqueue(url).then(
      () => `Task ${index + 1}: completed`,
      (error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return `Task ${index + 1}: cancelled`;
        }

        return `Task ${index + 1}: failed`;
      }
    );
  });

  const cancelledCount = queue.cancelPendingTasks();

  console.log(`Cancelled pending tasks: ${cancelledCount}`);

  const results = await Promise.all(tasks);

  results.forEach((result) => console.log(result));

  console.log('Cancellation test finished');
}
