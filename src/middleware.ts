import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n/locales";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
