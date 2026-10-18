
export type AudioTaskStatus =
  | 'queued'
  | 'loading'
  | 'decoding'
  | 'completed'
  | 'cancelled'
  | 'failed';

export interface AudioTask {
  id: string;
  trackUrl: string;
  controller: AbortController;
  status: AudioTaskStatus;
  resolve: (buffer: AudioBuffer) => void;
  reject: (reason: unknown) => void;
}

export interface AudioQueueSnapshot {
  pending: number;
  processing: boolean;
  activeTaskId: string | null;
}

export interface AudioQueueOptions {
  audioContext: AudioContext;
  onQueueChange?: (snapshot: AudioQueueSnapshot) => void;
}
