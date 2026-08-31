import { Activity, ArrowUpRight, CreditCard, ShoppingBag, Users } from "lucide-react";

const stats = [
  { label: "Total Revenue", value: "$84.2K", trend: "+18.2%", icon: CreditCard },
  { label: "Orders", value: "1,248", trend: "+12.8%", icon: ShoppingBag },
  { label: "Customers", value: "8,420", trend: "+9.6%", icon: Users },
  { label: "Conversion", value: "4.82%", trend: "+1.4%", icon: Activity },
];

const sales = [
  { name: "Accessories", amount: "$24.2K" },
  { name: "Travel", amount: "$18.7K" },
  { name: "Home", amount: "$16.4K" },
  { name: "Tech", amount: "$12.9K" },
];

function AdminDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-6 md:px-20">
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Admin Dashboard
        </span>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.07em] text-slate-900">Performance Overview.</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, trend, icon: Icon }) => (
          <div key={label} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">{label}</span>
              <div className="rounded-full bg-slate-100 p-2 text-slate-700"><Icon className="h-4 w-4" /></div>
            </div>
            <div className="mt-8 text-4xl font-black tracking-[-0.06em] text-slate-900">{value}</div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
              <ArrowUpRight className="h-3.5 w-3.5" /> {trend}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-900">Sales by category</h2>
          <div className="mt-6 space-y-5">
            {sales.map((sale) => (
              <div key={sale.name}>
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
                  <span>{sale.name}</span>
                  <span>{sale.amount}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-slate-900" style={{ width: `${Math.min(100, (parseFloat(sale.amount.replace(/[^0-9.]/g, '')) / 30) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-900">Recent Orders</h2>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span>#2048</span>
              <span className="font-bold text-slate-900">$249</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span>#2047</span>
              <span className="font-bold text-slate-900">$189</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span>#2046</span>
              <span className="font-bold text-slate-900">$98</span>
            </div>
            <div className="flex items-center justify-between">
              <span>#2045</span>
              <span className="font-bold text-slate-900">$320</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
