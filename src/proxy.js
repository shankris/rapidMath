// src/proxy.js

import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

/* --------------------------------------------------
   Internationalization Proxy
-------------------------------------------------- */

export default createMiddleware(routing);

/* --------------------------------------------------
   Proxy Matcher
-------------------------------------------------- */

export const config = {
  matcher: ["/((?!api|_next|dev|.*\\..*).*)"],
};
