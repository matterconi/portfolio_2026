'use client';

import { useLayoutEffect } from 'react';

export default function ProjectScrollToTop({ slug }: { slug: string }) {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [slug]);

  return null;
}
