
import type {
  AudioQueueOptions,
  AudioQueueSnapshot,
  AudioTask,
} from '../types/audio-queue-contract';

export class AudioTaskQueue {
  private queue: AudioTask[] = [];
  private activeTask: AudioTask | null = null;
  private isProcessing = false;

  private readonly options: AudioQueueOptions;

constructor(options: AudioQueueOptions) {
  this.options = options;
}

  getSnapshot(): AudioQueueSnapshot {
    return {
      pending: this.queue.length,
      processing: this.isProcessing,
      activeTaskId: this.activeTask?.id ?? null,
    };
  }

  private notifyChange(): void {
    this.options.onQueueChange?.(this.getSnapshot());
  }
  
enqueue(trackUrl: string): Promise<AudioBuffer> {
  return new Promise<AudioBuffer>((resolve, reject) => {
    const task: AudioTask = {
      id: crypto.randomUUID(),
      trackUrl,
      controller: new AbortController(),
      status: 'queued',
      resolve,
      reject,
    };

    
    this.queue.push(task);
    this.notifyChange();
    void this.processQueue();
  });
}





cancelTask(taskId: string): boolean {
  const queuedIndex = this.queue.findIndex(
    (task) => task.id === taskId
  );

  if (queuedIndex !== -1) {
    const [task] = this.queue.splice(queuedIndex, 1);

    task.status = 'cancelled';
    task.controller.abort();
    task.reject(
      new DOMException('Audio task cancelled', 'AbortError')
    );

    this.notifyChange();
    return true;
  }

  if (this.activeTask?.id === taskId) {
    this.activeTask.controller.abort();
    return true;
  }

  return false;
}






cancelActiveTask(): boolean {
  const task = this.activeTask;

  if (!task) {
    return false;
  }

  task.controller.abort();
  return true;
}







cancelPendingTasks(): number {
  const pendingTasks = this.queue.splice(0);

  for (const task of pendingTasks) {
    task.status = 'cancelled';
    task.controller.abort();

    task.reject(
      new DOMException('Task cancelled', 'AbortError')
    );
  }

  this.notifyChange();

  return pendingTasks.length;
}











private async processQueue(): Promise<void> {
  if (this.isProcessing) return;

  this.isProcessing = true;
  this.notifyChange();

  try {
    while (this.queue.length > 0) {
      const task = this.queue.shift();

      if (!task) continue;

      this.activeTask = task;
      task.status = 'loading';
      this.notifyChange();

      try {
        const response = await fetch(task.trackUrl, {
          signal: task.controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();

        task.status = 'decoding';
        this.notifyChange();

        const audioBuffer =
          await this.options.audioContext.decodeAudioData(arrayBuffer);

        if (task.controller.signal.aborted) {
          throw new DOMException('Audio task cancelled', 'AbortError');
        }

        task.status = 'completed';
        task.resolve(audioBuffer);
      } catch (error) {
        task.status =
          task.controller.signal.aborted ? 'cancelled' : 'failed';

        task.reject(error);
      } finally {
        this.activeTask = null;
        this.notifyChange();
        
      }
    }
  } finally {
    this.isProcessing = false;
    this.notifyChange();

    
  }
}

}
