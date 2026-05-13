export function ignoreResizeObserverLoopErrors() {
  const resizeObserverLoopMessages = [
    'ResizeObserver loop completed with undelivered notifications.',
    'ResizeObserver loop limit exceeded',
  ];

  function isResizeObserverLoopMessage(message: unknown) {
    return typeof message === 'string' && resizeObserverLoopMessages.includes(message);
  }

  window.addEventListener(
    'error',
    (event) => {
      if (isResizeObserverLoopMessage(event.message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      if (isResizeObserverLoopMessage(event.reason?.message || event.reason)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );
}
