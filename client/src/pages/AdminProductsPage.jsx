import { useCallback, useContext, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../services/product.service";
import { getApiErrorMessage } from "../services/apiError";
import { useTranslation } from "react-i18next";

const emptyProduct = { name: { en: "", ar: "" }, description: { en: "", ar: "" }, category: { en: "", ar: "" }, price: "", stock: "0", currency: "USD", isActive: true, image: null };

function AdminProductsPage() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language === "ar" ? "ar" : "en";
  const locale = currentLanguage === "ar" ? "ar-EG-u-nu-latn" : "en-US";
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
      setError(getApiErrorMessage(requestError, t, "adminProducts.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

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
      setEditing(null); setForm(emptyProduct); setFormOpen(false); setNotice(editing ? t("adminProducts.updated") : t("adminProducts.created"));
      await loadProducts();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, t, "adminProducts.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (product) => {
    const productName = product.name?.[currentLanguage] || product.name?.en;
    const confirmation = productName ? t("adminProducts.confirmDelete", { name: productName }) : t("adminProducts.confirmDeleteFallback");
    if (!window.confirm(confirmation)) return;
    setError(""); setNotice("");
    try {
      await deleteProduct(product._id);
      setNotice(t("adminProducts.deleted"));
      await loadProducts();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, t, "adminProducts.deleteError"));
    }
  };

  if (authLoading) return <div role="status" className="p-8">{t("adminProducts.loadingAccount")}</div>;
  if (!isAuthenticated) return <div className="mx-auto max-w-2xl p-8 text-center"><p>{t("adminProducts.signIn")}</p><button onClick={openAuth} className="mt-4 rounded-full bg-(--ink) px-5 py-3 font-bold text-(--base)">{t("common.signIn")}</button></div>;
  if (user?.role !== "ADMIN") return <div role="alert" className="mx-auto max-w-2xl p-8 text-center text-red-800 dark:text-red-200">{t("adminProducts.accessRequired")}</div>;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8 md:px-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><span className="inline-flex rounded-full border border-(--line) bg-(--base) px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-(--muted)">{t("adminProducts.title")}</span><h1 className="mt-4 text-4xl font-black tracking-tight text-(--ink)">{t("adminProducts.overview")}</h1></div><button onClick={beginCreate} className="inline-flex items-center gap-2 rounded-full bg-(--ink) px-5 py-3 text-sm font-bold text-(--base)"><Plus className="h-4 w-4" /> {t("adminProducts.add")}</button></div>
      {notice && <p role="status" className="mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-4 text-emerald-800 dark:text-emerald-200">{notice}</p>}
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 p-4 text-red-800 dark:text-red-200">{error}</p>}
      {formOpen && <div className="mb-6 rounded-3xl border border-(--line) bg-(--base) p-6 shadow-(--shadow-sm)">
        <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-bold">{editing ? t("adminProducts.edit") : t("adminProducts.create")}</h2><button type="button" aria-label={t("adminProducts.closeForm")} onClick={() => { setEditing(null); setForm(emptyProduct); setFormOpen(false); }}><X className="h-5 w-5" /></button></div>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold">{t("adminProducts.nameEnglish")}<input required minLength={2} value={form.name.en} onChange={(e) => setText("name", e.target.value, "en")} className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="text-sm font-semibold">{t("adminProducts.nameArabic")}<input dir="rtl" value={form.name.ar} onChange={(e) => setText("name", e.target.value, "ar")} className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="text-sm font-semibold">{t("adminProducts.categoryEnglish")}<input required minLength={2} value={form.category.en} onChange={(e) => setText("category", e.target.value, "en")} className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="text-sm font-semibold">{t("adminProducts.categoryArabic")}<input dir="rtl" value={form.category.ar} onChange={(e) => setText("category", e.target.value, "ar")} className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="text-sm font-semibold">{t("adminProducts.descriptionEnglish")}<textarea value={form.description.en} onChange={(e) => setText("description", e.target.value, "en")} className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="text-sm font-semibold">{t("adminProducts.descriptionArabic")}<textarea dir="rtl" value={form.description.ar} onChange={(e) => setText("description", e.target.value, "ar")} className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="text-sm font-semibold">{t("adminProducts.price")}<input required type="number" min="0.01" step="0.01" value={form.price} onChange={(e) => setText("price", e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="text-sm font-semibold">{t("adminProducts.stock")}<input required type="number" min="0" step="1" value={form.stock} onChange={(e) => setText("stock", e.target.value)} className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="text-sm font-semibold">{t("adminProducts.currency")}<input required minLength={3} maxLength={3} value={form.currency} onChange={(e) => setText("currency", e.target.value.toUpperCase())} className="mt-1 w-full rounded-xl border p-3" /></label>
          <label className="text-sm font-semibold">{t("adminProducts.image")}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => setText("image", e.target.files?.[0] || null)} className="mt-1 block w-full rounded-xl border p-3" /></label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.isActive} onChange={(e) => setText("isActive", e.target.checked)} /> {t("adminProducts.active")}</label>
          <div className="flex gap-3 md:col-span-2"><button disabled={saving} className="rounded-full bg-(--ink) px-5 py-3 font-bold text-(--base) disabled:opacity-50">{saving ? t("adminProducts.saving") : t("adminProducts.save")}</button><button type="button" onClick={() => { setEditing(null); setForm(emptyProduct); setFormOpen(false); }} className="rounded-full border px-5 py-3 font-bold">{t("adminProducts.cancel")}</button></div>
        </form>
      </div>}
      {loading ? <p role="status" className="rounded-2xl bg-(--base) p-6 text-(--muted)">{t("adminProducts.loading")}</p> : products.length === 0 ? <p className="rounded-2xl bg-(--base) p-6 text-(--muted)">{t("adminProducts.empty")}</p> : <div className="overflow-x-auto rounded-3xl border border-(--line) bg-(--base) shadow-(--shadow-sm)"><table className="min-w-full text-start"><thead className="bg-(--panel)"><tr className="text-xs uppercase tracking-wider text-(--muted)"><th className="p-4">{t("adminProducts.product")}</th><th className="p-4">{t("adminProducts.category")}</th><th className="p-4">{t("adminProducts.price")}</th><th className="p-4">{t("adminProducts.stock")}</th><th className="p-4">{t("adminProducts.state")}</th><th className="p-4 text-end">{t("adminProducts.actions")}</th></tr></thead><tbody>{products.map((product) => {
        const productName = product.name?.[currentLanguage] || product.name?.en || "";
        return <tr key={product._id} className="border-t border-(--line) text-sm"><td className="p-4 font-bold text-(--ink)">{productName}</td><td className="p-4">{product.category?.[currentLanguage] || product.category?.en}</td><td className="p-4">{new Intl.NumberFormat(locale,{style:"currency",currency:product.currency||"USD"}).format(product.price)}</td><td className="p-4">{product.stock}</td><td className="p-4">{product.isActive ? t("adminProducts.active") : t("adminProducts.hidden")}</td><td className="p-4"><div className="flex justify-end gap-2"><button aria-label={t("adminProducts.editProduct", { name: productName })} onClick={() => beginEdit(product)} className="rounded-full border p-2"><Pencil className="h-4 w-4" /></button><button aria-label={t("adminProducts.deleteProduct", { name: productName })} onClick={() => remove(product)} className="rounded-full border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-2 text-red-600 dark:text-red-300"><Trash2 className="h-4 w-4" /></button></div></td></tr>;
      })}</tbody></table></div>}
    </div>
  );
}

export default AdminProductsPage;
