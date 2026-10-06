import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const states = [
  { key: "paid", icon: CheckCircle2, color: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300" },
  { key: "pending", icon: Clock3, color: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300" },
  { key: "failed", icon: XCircle, color: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300" },
];

function PaymentStatesPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-6 md:px-20">
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full border border-(--line) bg-(--base)/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-(--muted)">
          {t("paymentStates.label")}
        </span>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.07em] text-(--ink)">{t("paymentStates.title")}</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {states.map(({ key, icon: Icon, color }) => (
          <div key={key} className="rounded-[28px] border border-(--line) bg-(--base) p-6 shadow-(--shadow-sm)">
            <div className={`inline-flex rounded-full p-3 ${color}`}><Icon className="h-5 w-5" /></div>
            <h2 className="mt-6 text-3xl font-black tracking-[-0.06em] text-(--ink)">{t(`paymentStates.${key}`)}</h2>
            <p className="mt-3 text-base leading-7 text-(--muted)">{t(`paymentStates.${key}Detail`)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentStatesPage;
