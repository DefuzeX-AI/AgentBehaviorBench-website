import { useSyncExternalStore } from 'react';

// Hash navigation keeps static hosting simple; no server rewrite is required.
function subscribe(listener) {
  window.addEventListener('hashchange', listener);
  return () => window.removeEventListener('hashchange', listener);
}

function getPath() {
  const path = window.location.hash.slice(1) || '/';
  return path.length > 1 ? path.replace(/\/$/, '') : path;
}

export function usePath() {
  return useSyncExternalStore(subscribe, getPath, () => '/');
}
