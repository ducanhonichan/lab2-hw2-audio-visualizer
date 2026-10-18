
# Project Rules – HW2

## Project Overview
Concurrent FIFO Audio Visualizer Queue Engine

## 1. Technology Stack
- React with TypeScript
- Vite
- Web Audio API
- HTML Canvas API

## 2. Type Safety
- Define TypeScript interfaces before implementation.
- Avoid using `any`.
- Validate TypeScript with `npm run build`.

## 3. FIFO Queue Processing
- Process audio tasks in first-in, first-out order.
- Prevent overlapping queue-processing loops.
- Handle download and decoding errors.
- Track pending and active tasks.

## 4. Cancellation and Memory Safety
- Use AbortController for cancellable downloads.
- Reject cancelled task promises.
- Ignore stale asynchronous playback results.
- Stop active AudioBufferSourceNodes.
- Cancel animation frames when visualization stops.
- Close AudioContext during component cleanup.

## 5. Visualization Performance
- Use AnalyserNode for frequency analysis.
- Use requestAnimationFrame for Canvas rendering.
- Avoid React state updates inside the animation loop.
- Reuse frequency data buffers where possible.

## 6. Testing and Verification
- Test FIFO processing with three audio files.
- Test pending-task cancellation.
- Test repeated Play and Stop interactions.
- Inspect browser Console for runtime errors.
- Verify the production build.

## 7. AI-Assisted Development
- Review AI-generated code before accepting it.
- Document identified implementation problems.
- Record corrective actions and verification evidence.
- Do not claim tests passed without actual results.
