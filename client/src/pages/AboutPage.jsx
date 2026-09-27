import { ArrowLeft, ArrowRight, CreditCard, PackageCheck, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function AboutPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.resolvedLanguage === "ar" || i18n.language.startsWith("ar");
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={isArabic ? "ar" : "en"}
      className="mx-auto w-full max-w-360 px-6 pb-20 pt-10 md:px-20"
    >
      <section className="border-b border-slate-200 pb-12 pt-4 dark:border-slate-700 md:pb-16">
        <p className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-300">
          <ShoppingBag aria-hidden="true" className="h-4 w-4" />
          {t("about.eyebrow")}
        </p>
        <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tighter text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
          {t("about.title")}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
          {t("about.description")}
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {t("about.shopCta")}
          <Arrow aria-hidden="true" className="h-4 w-4" />
        </Link>
      </section>

      <section className="grid gap-8 border-b border-slate-200 py-12 dark:border-slate-700 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            {t("about.overviewLabel")}
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-slate-900 dark:text-white md:text-3xl">
            {t("about.overviewTitle")}
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
          {t("about.overviewDescription")}
        </p>
      </section>

      <section className="py-12 md:py-16">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            {t("about.commitmentsLabel")}
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-slate-900 dark:text-white md:text-3xl">
            {t("about.commitmentsTitle")}
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          <article className="border-t-2 border-blue-600 pt-5 dark:border-blue-400">
            <ShoppingBag aria-hidden="true" className="h-5 w-5 text-blue-700 dark:text-blue-300" />
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{t("about.selectionTitle")}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{t("about.selectionDescription")}</p>
          </article>
          <article className="border-t-2 border-blue-600 pt-5 dark:border-blue-400">
            <CreditCard aria-hidden="true" className="h-5 w-5 text-blue-700 dark:text-blue-300" />
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{t("about.paymentTitle")}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{t("about.paymentDescription")}</p>
          </article>
          <article className="border-t-2 border-blue-600 pt-5 dark:border-blue-400">
            <PackageCheck aria-hidden="true" className="h-5 w-5 text-blue-700 dark:text-blue-300" />
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{t("about.deliveryTitle")}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{t("about.deliveryDescription")}</p>
          </article>
        </div>
      </section>

      <section className="flex flex-col items-start justify-between gap-5 border-t border-slate-200 pt-8 dark:border-slate-700 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-black tracking-[-0.03em] text-slate-900 dark:text-white">{t("about.closingTitle")}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{t("about.closingDescription")}</p>
        </div>
        <Link
          to="/shop"
          className="inline-flex shrink-0 items-center gap-3 rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-slate-500 dark:border-slate-600 dark:text-white dark:hover:border-slate-400"
        >
          {t("about.shopCta")}
          <Arrow aria-hidden="true" className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}

export default AboutPage;