import { useTranslation } from "react-i18next";

function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const sections = t("privacyPolicyPage.sections", { returnObjects: true });

  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-20 pt-8 md:px-12">
      <span className="inline-flex rounded-full border border-(--line) bg-(--base) px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-(--muted)">
        {t("privacyPolicyPage.eyebrow")}
      </span>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-(--ink) md:text-5xl">
        {t("privacyPolicyPage.title")}
      </h1>
      <p className="mt-5 text-lg leading-8 text-(--muted)">{t("privacyPolicyPage.intro")}</p>
      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="border-t border-(--line) pt-6">
            <h2 className="text-xl font-bold text-(--ink)">{section.title}</h2>
            <p className="mt-3 whitespace-pre-line leading-7 text-(--muted)">{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}

export default PrivacyPolicyPage;
