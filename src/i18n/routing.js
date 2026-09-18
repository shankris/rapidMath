// src/i18n/routing.js

import { defineRouting } from "next-intl/routing";
import { localeCodes } from "./languages";

/* --------------------------------------------------
   Internationalization Routing
-------------------------------------------------- */

export const routing = defineRouting({
  locales: localeCodes,
  defaultLocale: "en",
  localePrefix: "always",
});
