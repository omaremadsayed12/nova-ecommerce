import { Pencil, Plus, Trash2 } from "lucide-react";

const products = [
  { name: "Chrono Series", category: "Accessories", price: "$249", stock: 18 },
  { name: "Aero Leather Tote", category: "Travel", price: "$189", stock: 12 },
  { name: "Canvas Low Top", category: "Footwear", price: "$145", stock: 24 },
  { name: "Luna Lamp", category: "Home", price: "$98", stock: 10 },
];

function AdminProductsPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 pb-20 pt-6 md:px-20">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Admin Products
          </span>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.07em] text-slate-900">Inventory Overview.</h1>
        </div>

        <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50">
            <tr className="text-sm uppercase tracking-[0.12em] text-slate-500">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.name} className="border-t border-slate-200 text-sm text-slate-700">
                <td className="p-4 font-bold text-slate-900">{product.name}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">{product.price}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-full border border-slate-200 p-2 text-slate-700"><Pencil className="h-4 w-4" /></button>
                    <button className="rounded-full border border-red-200 bg-red-50 p-2 text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProductsPage;
