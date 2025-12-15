import React, { useEffect, useState } from 'react';

// This component is safe to render on the server: it returns
// the same placeholder markup during SSR and on initial client render,
// then dynamically imports the real client-only `FreeMap` after mount.
export default function FreeMapClientLoader(props) {
  const [Cmp, setCmp] = useState(null);

  useEffect(() => {
    let mounted = true;
    import('./FreeMap.client')
      .then((mod) => {
        const comp = mod?.default ?? mod?.FreeMap ?? mod;
        if (mounted) setCmp(() => comp);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to load FreeMap client component', err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Server and initial client render: return the same placeholder div.
  if (!Cmp) {
    return <div style={{ width: '100%', height: '300px', zIndex: 0 }} />;
  }

  return <Cmp {...props} />;
}
