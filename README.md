
# Concurrent FIFO Audio Visualizer Queue Engine

A React and TypeScript application demonstrating FIFO
audio task processing, cancellation, Web Audio API
playback, and real-time Canvas visualization.

## Technology Stack

- React
- TypeScript
- Vite
- Web Audio API
- HTML Canvas API

## Key Features

### 1. FIFO Audio Queue
- Processes audio tasks in first-in, first-out order.
- Downloads audio files using fetch().
- Decodes audio using AudioContext.decodeAudioData().
- Tracks pending and active tasks.

### 2. Cancellation
- Uses AbortController to cancel active downloads.
- Supports cancellation of pending tasks.
- Prevents stale playback requests after Stop.

### 3. Audio Playback
- Uses AudioBufferSourceNode for playback.
- Provides Play and Stop controls.
- Disconnects audio sources after playback.

### 4. Audio Visualization
- Uses AnalyserNode with fftSize = 512.
- Displays frequency data on HTML Canvas.
- Uses requestAnimationFrame for rendering.
- Avoids React state updates inside the animation loop.

### 5. Resource Cleanup
- Stops active audio playback.
- Cancels outstanding queue tasks.
- Cancels animation frames.
- Closes AudioContext during component cleanup.

## Installation

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

Open the local URL displayed by Vite.

## Production Build

```bash
npm run build
```

## Audio Test Files

The test utilities reference the following local files:

- public/audio/track1.mp3
- public/audio/track2.mp3
- public/audio/track3.mp3

These audio files are not included in the public repository.

To run the FIFO and cancellation tests, create the
public/audio/ directory and add three valid MP3 files
using the filenames above.

Use audio recordings you own or have permission to use.

## Testing

The application includes:

- FIFO Queue Test
- Pending Task Cancellation Test
- Play/Stop Interaction Test

Open the browser Developer Tools Console to inspect
test results.

## Project Structure

- src/types/ - TypeScript contracts
- src/engine/ - Queue, playback, and visualizer logic
- src/tests/ - Audio queue test utilities
- src/App.tsx - React application interface

## Documentation

- project-rules.md
- TASK_DECOMPOSITION.md
- AI_FAILURE_AUDIT.md

## AI-Assisted Development Audit

The project documents three implementation issues
identified during AI-assisted development:

1. Incorrect FIFO processing trigger placement.
2. Missing stale-request cancellation protection.
3. Incomplete audio resource cleanup.

See AI_FAILURE_AUDIT.md for details.

## Author

University Web Application Development Coursework
Lab 2 - Homework 2
