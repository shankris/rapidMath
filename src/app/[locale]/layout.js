// src/app/[locale]/layout.js

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import Header from "./Header/Header";
import Footer from "./Footer/Footer";

/* --------------------------------------------------
   Localized Application Layout
-------------------------------------------------- */

export default async function LocaleLayout({ children }) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Header />

      <div className='app-shell'>
        <main className='app-main'>{children}</main>

        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
