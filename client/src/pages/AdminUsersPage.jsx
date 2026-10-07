import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { deleteUser, getUsers, updateUser } from "../services/users.service";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "../services/apiError";

function AdminUsersPage() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language === "ar" ? "ar" : "en";
  const { user, isAuthenticated, authLoading, openAuth } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const page = Number(searchParams.get("page")) || 1;
  const role = searchParams.get("role") || "";
  const search = searchParams.get("search") || "";

  useEffect(() => {
    if (authLoading || user?.role !== "ADMIN") return undefined;
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return null;
      setLoading(true);
      setError("");
      return getUsers({ page, limit: 12, ...(role ? { role } : {}), ...(search ? { search } : {}) });
    }).then((response) => {
      if (active && response) {
        setUsers(response.data || []);
        setMeta(response.meta || { page: 1, totalPages: 1, total: 0 });
      }
    }).catch((requestError) => {
      if (active) setError(getApiErrorMessage(requestError, t, "adminUsers.loadError"));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [authLoading, user?.role, page, role, search, refreshKey, t]);

  const updateQuery = (updates) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", "1");
    for (const [key, value] of Object.entries(updates)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setSearchParams(next);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    updateQuery({ search: String(data.get("search") || "").trim() });
  };

  const changeRole = async (target, nextRole) => {
    setError("");
    setNotice("");
    try {
      await updateUser(target._id, { role: nextRole });
      setNotice(t("adminUsers.roleUpdated"));
      setRefreshKey((value) => value + 1);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, t, "adminUsers.updateError"));
    }
  };

  const removeUser = async (target) => {
    const name = target.name?.[currentLanguage] || target.name?.en || target.email;
    if (!window.confirm(t("adminUsers.confirmDelete", { name }))) return;
    setError("");
    setNotice("");
    try {
      await deleteUser(target._id);
      setNotice(t("adminUsers.deleted"));
      setRefreshKey((value) => value + 1);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, t, "adminUsers.deleteError"));
    }
  };

  const setPage = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  if (authLoading) return <p role="status" className="p-8">{t("adminUsers.loadingAccount")}</p>;
  if (!isAuthenticated) return <div className="mx-auto max-w-2xl p-8 text-center"><p>{t("adminUsers.signIn")}</p><button onClick={openAuth} className="mt-4 rounded-full bg-(--ink) px-5 py-3 font-bold text-(--base)">{t("common.signIn")}</button></div>;
  if (user?.role !== "ADMIN") return <p role="alert" className="mx-auto max-w-2xl p-8 text-center text-red-700 dark:text-red-300">{t("adminUsers.accessRequired")}</p>;

  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8 md:px-12">
      <header className="mb-8">
        <span className="inline-flex rounded-full border border-(--line) bg-(--base) px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-(--muted)">{t("adminUsers.eyebrow")}</span>
        <h1 className="mt-4 text-4xl font-black text-(--ink)">{t("adminUsers.title")}</h1>
      </header>
      {notice && <p role="status" className="mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-4 text-emerald-800 dark:text-emerald-200">{notice}</p>}
      {error && <div role="alert" className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 p-4 text-red-800 dark:text-red-200"><p>{error}</p><button onClick={() => setRefreshKey((value) => value + 1)} className="mt-2 font-bold underline">{t("common.tryAgain")}</button></div>}
      <form onSubmit={submitSearch} className="mb-6 grid gap-3 rounded-3xl border border-(--line) bg-(--base) p-4 sm:grid-cols-[1fr_auto_auto]">
        <label className="grid gap-1 text-sm font-semibold text-(--ink)">{t("adminUsers.searchLabel")}<input key={search} name="search" defaultValue={search} maxLength={100} placeholder={t("adminUsers.searchPlaceholder")} className="min-h-11 rounded-xl border border-(--line) bg-(--panel) px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold text-(--ink)">{t("adminUsers.roleFilter")}<select value={role} onChange={(event) => updateQuery({ role: event.target.value })} className="min-h-11 rounded-xl border border-(--line) bg-(--panel) px-3"><option value="">{t("adminUsers.allRoles")}</option><option value="CUSTOMER">{t("adminUsers.customer")}</option><option value="ADMIN">{t("adminUsers.admin")}</option></select></label>
        <div className="flex items-end gap-2"><button type="submit" className="rounded-full bg-(--ink) px-5 py-3 font-bold text-(--base)">{t("adminUsers.searchAction")}</button><button type="button" onClick={() => setSearchParams(new URLSearchParams())} className="rounded-full border border-(--line) px-5 py-3 font-bold text-(--ink)">{t("adminUsers.clearFilters")}</button></div>
      </form>
      {loading ? <p role="status" className="rounded-2xl bg-(--base) p-6 text-(--muted)">{t("adminUsers.loading")}</p> : users.length === 0 ? <p className="rounded-2xl border border-(--line) bg-(--base) p-6 text-(--muted)">{t("adminUsers.empty")}</p> : (
        <div className="space-y-3">{users.map((target) => (
          <article key={target._id} className="flex flex-col gap-4 rounded-2xl border border-(--line) bg-(--base) p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">{target.imageUrl ? <img src={target.imageUrl} alt="" className="h-12 w-12 rounded-full object-cover" /> : <div aria-hidden="true" className="h-12 w-12 shrink-0 rounded-full bg-(--panel-strong)" />}<div className="min-w-0"><h2 className="truncate font-bold text-(--ink)">{target.name?.[currentLanguage] || target.name?.en || t("adminUsers.unnamed")}</h2><p className="break-all text-sm text-(--muted)">{target.email}</p></div></div>
            <div className="flex flex-wrap items-center gap-3"><label className="sr-only" htmlFor={`role-${target._id}`}>{t("adminUsers.changeRole", { name: target.email })}</label><select id={`role-${target._id}`} value={target.role} disabled={target._id === user._id} onChange={(event) => changeRole(target, event.target.value)} className="min-h-10 rounded-full border border-(--line) bg-(--panel) px-4 text-sm font-semibold disabled:opacity-50"><option value="CUSTOMER">{t("adminUsers.customer")}</option><option value="ADMIN">{t("adminUsers.admin")}</option></select><button type="button" disabled={target._id === user._id} onClick={() => removeUser(target)} className="rounded-full border border-red-200 dark:border-red-900 px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-300 disabled:opacity-40">{t("adminUsers.delete")}</button></div>
          </article>
        ))}</div>
      )}
      {!loading && users.length > 0 && meta.totalPages > 1 && <nav aria-label={t("adminUsers.pagesLabel")} className="mt-6 flex items-center justify-between"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-full border border-(--line) px-4 py-2 font-semibold disabled:opacity-40">{t("adminUsers.previous")}</button><span className="text-sm text-(--muted)">{t("adminUsers.page", { page: meta.page, pages: meta.totalPages, count: meta.total })}</span><button disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)} className="rounded-full border border-(--line) px-4 py-2 font-semibold disabled:opacity-40">{t("adminUsers.next")}</button></nav>}
    </main>
  );
}

export default AdminUsersPage;
