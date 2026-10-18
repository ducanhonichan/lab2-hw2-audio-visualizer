
# AI Failure Audit – HW2

## Project
Concurrent FIFO Audio Visualizer Queue Engine

## Purpose
Document three actual AI-assisted development failures,
their impact, verification, and corrective actions.


## Failure 1: Incorrect FIFO Queue Processing Trigger

### Initial AI-generated implementation
During the implementation of the AudioTaskQueue class,
the call to processQueue() was incorrectly placed inside
the finally block of processQueue() instead of enqueue().

### Observed problem
The implementation did not reliably trigger queue
processing when a new audio task was added.

The incorrect placement also introduced a risk of
unnecessary repeated processing calls.

### Root cause
The AI-assisted implementation placed the queue-processing
trigger in the wrong method.

The enqueue() method should start processing after a task
is added, while processQueue() should manage the execution
of queued tasks.

### Correction
Moved the following statement into enqueue():

void this.processQueue();

The processQueue() method retains its processing guard
and handles tasks sequentially using FIFO order.

### Verification evidence
- Reviewed the corrected audio-queue-controller.ts.
- Successfully executed three audio tasks.
- Confirmed completion order: Task 1, Task 2, Task 3.
- Figure 27: FIFO queue execution in Chrome DevTools.

### Lesson learned
AI-generated asynchronous control flow must be reviewed
carefully. Correct placement of function calls is essential
for reliable FIFO queue execution.





## Failure 2: Missing Cancellation Protection in Audio Playback

### Initial AI-generated implementation
The initial handlePlay() implementation awaited audio
loading and decoding before starting playback.

However, it did not check whether the user had pressed
Stop while the asynchronous operation was running.

### Identified problem
A potential race condition was identified during code review.

If the user pressed Stop before loading finished,
the earlier Play request could still complete and
start audio playback unexpectedly.

This was a design flaw in the initial implementation.
It was not independently verified as a runtime failure.

### Root cause
The initial implementation did not coordinate asynchronous
Play requests with Stop actions.

The Stop handler stopped the current audio source but
did not invalidate an unfinished loading request.

### Correction
Added a playback request identifier:

const requestId = ++playbackRequestRef.current;

Before starting playback, the implementation now checks:

if (requestId !== playbackRequestRef.current) {
  return;
}

The Stop handler increments the request identifier
and calls cancelActiveTask() to abort the active request.

Cancellation errors are also handled separately
from genuine playback failures.

### Verification evidence
- Figure 20: Playback request validation.
- Figure 22: AbortController integration with Stop.
- Figure 23: Cancellation error handling.
- Figure 37: Play/Stop regression testing.

### Lesson learned
AI-generated asynchronous code must account for
user interactions occurring before operations complete.

Request validation and cancellation are necessary
to prevent stale asynchronous results from changing
application behavior.



## Failure 3: Incomplete Audio Resource Cleanup

### Initial AI-generated implementation
The initial implementation created an AudioContext,
AudioPlaybackController, and AudioVisualizer.

Although playback and visualization could be stopped,
the React component did not initially implement
a complete unmount cleanup routine.

### Identified problem
Code review identified a potential resource management issue.

If the React component was unmounted while audio
processing was active, unfinished tasks and audio
resources might remain active unnecessarily.

This was a lifecycle design omission, not a
confirmed memory leak measured in the browser.

### Root cause
The initial AI-assisted implementation focused on
audio playback and visualization functionality
without fully addressing the React component lifecycle.

### Correction
Added a useEffect cleanup function to:

1. Invalidate outstanding playback requests.
2. Cancel the active audio task.
3. Cancel pending FIFO queue tasks.
4. Stop the current AudioBufferSourceNode.
5. Stop the requestAnimationFrame loop.
6. Close the AudioContext.

### Verification evidence
- Figure 32: React audio resource cleanup implementation.
- Figure 33: Successful TypeScript and Vite production build.
- Figure 34: Playback regression testing after cleanup.
- Figure 37: Repeated Play/Stop interaction testing.

### Lesson learned
AI-generated Web Audio applications require explicit
resource lifecycle management.

Functional playback alone does not demonstrate
proper cleanup or memory safety.

Resource cleanup must be reviewed and tested
separately from normal playback functionality.



## Conclusion

The AI Failure Audit identified three issues in the
AI-assisted development process:

1. Incorrect FIFO queue processing trigger placement.
2. Missing protection against stale asynchronous playback.
3. Incomplete React audio resource cleanup.

These findings demonstrate that AI-generated code
requires manual review, targeted testing, and
careful validation of asynchronous behavior.

The corrected implementation was validated through
FIFO execution tests, cancellation tests, playback
regression checks, and a successful production build.

