import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function PaymentSuccessPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-[1440px] items-center justify-center px-6 pb-20 pt-10 md:px-20">
      <div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <span className="mt-8 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
          Payment Success
        </span>
        <h1 className="mt-6 text-5xl font-black tracking-[-0.06em] text-slate-900">Thank you for your order.</h1>
        <p className="mt-4 text-lg text-slate-600">
          Your premium essentials are now on the way. A confirmation email with tracking details has been sent to your inbox.
        </p>

        <div className="mt-8 rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-left">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Order number</span>
            <span className="font-bold text-slate-900">#NOVA-2048</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
            <span>Estimated delivery</span>
            <span className="font-bold text-slate-900">2-4 business days</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link to="/shop" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:opacity-95">
            Continue Shopping
          </Link>
          <Link to="/orders" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-slate-300">
            View Orders <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
