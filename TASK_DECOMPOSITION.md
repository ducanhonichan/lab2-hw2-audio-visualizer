
# Task Decomposition – HW2

## Project
Concurrent FIFO Audio Visualizer Queue Engine

## Objective
Build a React and TypeScript application that manages
audio loading and decoding through a FIFO queue,
supports cancellation, and visualizes audio frequencies
using the Web Audio API and Canvas.

## Phase 1: Project Initialization
- [x] Initialize React, TypeScript, and Vite.
- [x] Configure the development environment.
- [x] Initialize Git.
- [x] Verify the initial application.

## Phase 2: Contract-First Design
- [x] Define AudioTaskStatus.
- [x] Define AudioTask.
- [x] Define AudioQueueSnapshot.
- [x] Define AudioQueueOptions.

## Phase 3: FIFO Queue Engine
- [x] Implement AudioTaskQueue.
- [x] Implement enqueue() and processQueue().
- [x] Process downloads and decoding sequentially.
- [x] Implement task status tracking.
- [x] Verify FIFO completion order.

## Phase 4: Web Audio Integration
- [x] Implement AudioPlaybackController.
- [x] Implement AudioVisualizer.
- [x] Configure AnalyserNode with fftSize = 512.
- [x] Render frequency bars using Canvas.
- [x] Connect playback to the visualizer.

## Phase 5: Cancellation and Cleanup
- [x] Implement AbortController cancellation.
- [x] Prevent stale playback requests.
- [x] Implement pending-task cancellation.
- [x] Stop active AudioBufferSourceNodes.
- [x] Cancel requestAnimationFrame loops.
- [x] Close AudioContext during component cleanup.

## Phase 6: Testing
- [x] Test FIFO processing with three MP3 files.
- [x] Test pending-task cancellation.
- [x] Test Play and Stop interactions.
- [x] Verify the production build.
- [ ] Record the measured FPS result.
- [ ] Complete final verification.

## Phase 7: Documentation
- [x] Create project-rules.md.
- [x] Document three AI-assisted development issues.
- [x] Capture implementation and testing evidence.
- [ ] Complete the final Word report.
- [ ] Review all submission requirements.

## Phase 8: Version Control and Submission
- [x] Initialize the local Git repository.
- [ ] Commit the completed implementation.
- [ ] Push the project to GitHub.
- [ ] Verify the public repository link.
- [ ] Prepare the final submission links.
