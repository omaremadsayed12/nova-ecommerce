import { Package, Truck, CheckCheck } from "lucide-react";

const orders = [
  { id: "#NOVA-2048", item: "Chrono Series", date: "12 Aug 2024", status: "Delivered", color: "bg-emerald-100 text-emerald-700", icon: CheckCheck },
  { id: "#NOVA-2047", item: "Aero Leather Tote", date: "05 Aug 2024", status: "In Transit", color: "bg-amber-100 text-amber-700", icon: Truck },
  { id: "#NOVA-2046", item: "Luna Lamp", date: "20 Jul 2024", status: "Processing", color: "bg-slate-200 text-slate-700", icon: Package },
];

function MyOrdersPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-6 md:px-20">
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          My Orders
        </span>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.07em] text-slate-900">Track your purchases.</h1>
      </div>

      <div className="space-y-5">
        {orders.map((order) => {
          const Icon = order.icon;
          return (
            <div key={order.id} className="flex flex-col gap-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{order.id}</div>
                <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-900">{order.item}</h3>
                <p className="mt-1 text-sm text-slate-500">Ordered on {order.date}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold ${order.color}`}>
                  <Icon className="h-4 w-4" /> {order.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyOrdersPage;
