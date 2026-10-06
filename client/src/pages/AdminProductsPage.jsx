import { useCallback, useContext, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../services/product.service";

const emptyProduct = { name: { en: "", ar: "" }, description: { en: "", ar: "" }, category: { en: "", ar: "" }, price: "", stock: "0", currency: "USD", isActive: true, image: null };

function AdminProductsPage() {
  const { user, isAuthenticated, authLoading, openAuth } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getProducts(new URLSearchParams({ limit: "0", sortBy: "createdAt", method: "DESC" }));
      setProducts(response.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.error?.message || "Could not load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || user?.role !== "ADMIN") return undefined;
    const timer = window.setTimeout(loadProducts, 0);
    return () => window.clearTimeout(timer);
  }, [authLoading, user, loadProducts]);

  const beginCreate = () => { setEditing(null); setForm(emptyProduct); setFormOpen(true); setNotice(""); setError(""); };
  const beginEdit = (product) => {
    setEditing(product);
    setFormOpen(true);
    setForm({ name: { en: product.name?.en || "", ar: product.name?.ar || "" }, description: { en: product.description?.en || "", ar: product.description?.ar || "" }, category: { en: product.category?.en || "", ar: product.category?.ar || "" }, price: String(product.price), stock: String(product.stock), currency: product.currency || "USD", isActive: product.isActive !== false, image: null });
    setNotice(""); setError("");
  };

  const setText = (field, value, language) => setForm((current) => language ? { ...current, [field]: { ...current[field], [language]: value } } : { ...current, [field]: value });

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true); setError(""); setNotice("");
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editing) await updateProduct(editing._id, payload);
      else await createProduct(payload);
      setEditing(null); setForm(emptyProduct); setFormOpen(false); setNotice(editing ? "Product updated." : "Product created.");
      await loadProducts();
    } catch (requestError) {
      setError(requestError.response?.data?.error?.message || "Could not save this product.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (product) => {
    if (!window.confirm(`Delete ${product.name?.en || "this product"}?`)) return;
    setError(""); setNotice("");
    try {
      await deleteProduct(product._id);
      setNotice("Product deleted.");
      await loadProducts();
    } catch (requestError) {
      setError(requestError.response?.data?.error?.message || "Could not delete this product.");
    }
  };

  if (authLoading) return <div role="status" className="p-8">Loading account...</div>;
  if (!isAuthenticated) return <div className="mx-auto max-w-2xl p-8 text-center"><p>Sign in with an administrator account to manage products.</p><button onClick={openAuth} className="mt-4 rounded-full bg-slate-900 px-5 py-3 font-bold text-white">Sign in</button></div>;
  if (user?.role !== "ADMIN") return <div role="alert" className="mx-auto max-w-2xl p-8 text-center text-red-800">Administrator access is required to manage products.</div>;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8 md:px-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">Admin Products</span><h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">Inventory overview</h1></div><button onClick={beginCreate} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white"><Plus className="h-4 w-4" /> Add product</button></div>
      {notice && <p role="status" className="mb-4 rounded-xl bg-emerald-50 p-4 text-emerald-800">{notice}</p>}
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
      {formOpen && <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-bold">{editing ? "Edit product" : "New product"}</h2><button type="button" aria-label="Close product form" onClick={() => { setEditing(null); setForm(emptyProduct); setFormOpen(false); }}><X className="h-5 w-5" /></button></div>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold">Name (English)<input required minLength={2} value={form.name.en} onChange={(e) => setText("name", e.target.value, "en")} className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="text-sm font-semibold">Name (Arabic)<input value={form.name.ar} onChange={(e) => setText("name", e.target.value, "ar")} className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="text-sm font-semibold">Category (English)<input required minLength={2} value={form.category.en} onChange={(e) => setText("category", e.target.value, "en")} className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="text-sm font-semibold">Category (Arabic)<input value={form.category.ar} onChange={(e) => setText("category", e.target.value, "ar")} className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="text-sm font-semibold">Description (English)<textarea value={form.description.en} onChange={(e) => setText("description", e.target.value, "en")} className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="text-sm font-semibold">Description (Arabic)<textarea value={form.description.ar} onChange={(e) => setText("description", e.target.value, "ar")} className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="text-sm font-semibold">Price<input required type="number" min="0.01" step="0.01" value={form.price} onChange={(e) => setText("price", e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="text-sm font-semibold">Stock<input required type="number" min="0" step="1" value={form.stock} onChange={(e) => setText("stock", e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="text-sm font-semibold">Currency<input required minLength={3} maxLength={3} value={form.currency} onChange={(e) => setText("currency", e.target.value.toUpperCase())} className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="text-sm font-semibold">Product image<input type="file" accept="image/*" onChange={(e) => setText("image", e.target.files?.[0] || null)} className="mt-1 block w-full rounded-xl border p-3" /></label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.isActive} onChange={(e) => setText("isActive", e.target.checked)} /> Active in store</label>
          <div className="flex gap-3 md:col-span-2"><button disabled={saving} className="rounded-full bg-slate-900 px-5 py-3 font-bold text-white disabled:opacity-50">{saving ? "Saving..." : "Save product"}</button><button type="button" onClick={() => { setEditing(null); setForm(emptyProduct); setFormOpen(false); }} className="rounded-full border px-5 py-3 font-bold">Cancel</button></div>
        </form>
      </div>}
      {loading ? <p role="status" className="rounded-2xl bg-white p-6 text-slate-600">Loading products...</p> : products.length === 0 ? <p className="rounded-2xl bg-white p-6 text-slate-600">No products found.</p> : <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm"><table className="min-w-full text-left"><thead className="bg-slate-50"><tr className="text-xs uppercase tracking-wider text-slate-500"><th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">State</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product._id} className="border-t border-slate-100 text-sm"><td className="p-4 font-bold text-slate-900">{product.name?.en}</td><td className="p-4">{product.category?.en}</td><td className="p-4">{new Intl.NumberFormat(undefined,{style:"currency",currency:product.currency||"USD"}).format(product.price)}</td><td className="p-4">{product.stock}</td><td className="p-4">{product.isActive ? "Active" : "Hidden"}</td><td className="p-4"><div className="flex justify-end gap-2"><button aria-label={`Edit ${product.name?.en}`} onClick={() => beginEdit(product)} className="rounded-full border p-2"><Pencil className="h-4 w-4" /></button><button aria-label={`Delete ${product.name?.en}`} onClick={() => remove(product)} className="rounded-full border border-red-200 bg-red-50 p-2 text-red-600"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div>}
    </div>
  );
}

export default AdminProductsPage;
