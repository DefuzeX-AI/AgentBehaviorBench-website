import { useEffect, useState } from 'react';

export function useResource(load) {
  const [state, setState] = useState({ status: 'loading', data: [], error: null });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading', data: [], error: null });
    Promise.resolve().then(load).then(
      (data) => { if (active) setState({ status: 'ready', data, error: null }); },
      (error) => { if (active) setState({ status: 'error', data: [], error }); },
    );
    return () => { active = false; };
  }, [load]);

  return state;
}
