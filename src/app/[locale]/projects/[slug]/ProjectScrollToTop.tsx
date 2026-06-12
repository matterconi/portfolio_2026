'use client';

import { useLayoutEffect } from 'react';

export default function ProjectScrollToTop({ slug }: { slug: string }) {
  useLayoutEffect(() => {
    const html = document.documentElement;
    const previousScrollBehavior = html.style.scrollBehavior;

    html.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    html.scrollTop = 0;
    document.body.scrollTop = 0;
    html.style.scrollBehavior = previousScrollBehavior;
  }, [slug]);

  return null;
}
