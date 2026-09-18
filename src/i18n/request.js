// src/i18n/request.js

import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

/* --------------------------------------------------
   Load Locale Messages
-------------------------------------------------- */

async function loadMessages(locale) {
  const [common, dashboard, header, notifications, practice, quiz] = await Promise.all([import(`./messages/${locale}/common.json`), import(`./messages/${locale}/dashboard.json`), import(`./messages/${locale}/header.json`), import(`./messages/${locale}/notifications.json`), import(`./messages/${locale}/practice.json`), import(`./messages/${locale}/quiz.json`)]);

  return {
    Common: common.default,
    Dashboard: dashboard.default,
    Header: header.default,
    Notifications: notifications.default,
    Practice: practice.default,
    Quiz: quiz.default,
  };
}

/* --------------------------------------------------
   Next Intl Request Configuration
-------------------------------------------------- */

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;

  const locale = routing.locales.includes(requestedLocale) ? requestedLocale : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
