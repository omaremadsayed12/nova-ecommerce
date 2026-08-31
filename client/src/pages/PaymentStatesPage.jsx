import { CheckCircle2, Clock3, XCircle } from "lucide-react";

const states = [
  { name: "Paid", detail: "Customer has completed payment.", icon: CheckCircle2, color: "bg-emerald-100 text-emerald-700" },
  { name: "Pending", detail: "Awaiting bank confirmation.", icon: Clock3, color: "bg-amber-100 text-amber-700" },
  { name: "Failed", detail: "Payment rejected or expired.", icon: XCircle, color: "bg-red-100 text-red-700" },
];

function PaymentStatesPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-6 md:px-20">
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Payment States
        </span>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.07em] text-slate-900">Transaction lifecycle.</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {states.map(({ name, detail, icon: Icon, color }) => (
          <div key={name} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className={`inline-flex rounded-full p-3 ${color}`}><Icon className="h-5 w-5" /></div>
            <h2 className="mt-6 text-3xl font-black tracking-[-0.06em] text-slate-900">{name}</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentStatesPage;
