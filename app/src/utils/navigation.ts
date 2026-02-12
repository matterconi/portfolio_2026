"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useLocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function switchLocale(targetLocale: string) {
    const hash = window.location.hash;
    const newPathname = pathname.replace(/^\/[a-z]{2}/, `/${targetLocale}`);
    const search = searchParams.toString();
    const newUrl = `${newPathname}${search ? `?${search}` : ""}${hash}`;

    router.push(newUrl);
  }

  return { switchLocale };
}
