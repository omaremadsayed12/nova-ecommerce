import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { updateUser } from "../services/users.service";
import { useTranslation } from "react-i18next";
import { useToast } from "../context/ToastContext";
import { getApiErrorMessage } from "../services/apiError";

function AccountForm({ user }) {
  const { t } = useTranslation();
  const { setUser, openAuth } = useContext(AuthContext);
  const { showError, showSuccess } = useToast();
  const [name, setName] = useState({
    en: user.name?.en || "",
    ar: user.name?.ar || "",
  });
  const [email, setEmail] = useState(user.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if (password && password !== passwordConfirmation) {
      setError(t("accountPage.passwordMismatch"));
      return;
    }
    if (password && !currentPassword) {
      setError(t("accountPage.currentPasswordRequired"));
      return;
    }
    const form = new FormData();
    form.append("name", JSON.stringify(name));
    form.append("email", email);
    if (password) {
      form.append("currentPassword", currentPassword);
      form.append("password", password);
    }
    if (image) form.append("image", image);

    setSaving(true);
    try {
      const updatedUser = await updateUser(user._id, form);
      if (password) {
        showSuccess(t("accountPage.passwordUpdated"));
        localStorage.removeItem("access_token");
        setUser(null);
        openAuth();
        return;
      }
      setUser(updatedUser);
      showSuccess(t("accountPage.saved"));
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
      setImage(null);
      setNotice(t("accountPage.saved"));
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, t, "accountPage.saveError");
      setError(message);
      showError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 grid gap-5 rounded-3xl border border-(--line) bg-(--base) p-6 shadow-(--shadow-sm)">
      {user.imageUrl && <img src={user.imageUrl} alt="" className="h-24 w-24 rounded-full object-cover" />}
      <label className="grid gap-2 text-sm font-semibold text-(--ink)">{t("accountPage.nameEnglish")}<input required minLength={2} maxLength={50} value={name.en} onChange={(event) => setName((current) => ({ ...current, en: event.target.value }))} className="min-h-11 rounded-xl border border-(--line) bg-(--panel) px-3" /></label>
      <label className="grid gap-2 text-sm font-semibold text-(--ink)">{t("accountPage.nameArabic")}<input dir="rtl" maxLength={50} value={name.ar} onChange={(event) => setName((current) => ({ ...current, ar: event.target.value }))} className="min-h-11 rounded-xl border border-(--line) bg-(--panel) px-3" /></label>
      <label className="grid gap-2 text-sm font-semibold text-(--ink)">{t("accountPage.email")}<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-11 rounded-xl border border-(--line) bg-(--panel) px-3" /></label>
      {password && <label className="grid gap-2 text-sm font-semibold text-(--ink)">{t("accountPage.currentPassword")}<input required type="password" autoComplete="current-password" minLength={8} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="min-h-11 rounded-xl border border-(--line) bg-(--panel) px-3" /></label>}
      <label className="grid gap-2 text-sm font-semibold text-(--ink)">{t("accountPage.newPassword")}<input type="password" autoComplete="new-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-11 rounded-xl border border-(--line) bg-(--panel) px-3" /><span className="font-normal text-(--muted)">{t("accountPage.passwordHint")}</span></label>
      {password && <label className="grid gap-2 text-sm font-semibold text-(--ink)">{t("accountPage.confirmPassword")}<input required type="password" autoComplete="new-password" minLength={8} value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} className="min-h-11 rounded-xl border border-(--line) bg-(--panel) px-3" /></label>}
      <label className="grid gap-2 text-sm font-semibold text-(--ink)">{t("accountPage.photo")}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => setImage(event.target.files?.[0] || null)} className="min-h-11 rounded-xl border border-(--line) bg-(--panel) p-2" /></label>
      {error && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{error}</p>}
      {notice && <p role="status" className="text-sm text-emerald-700 dark:text-emerald-300">{notice}</p>}
      <button disabled={saving} className="justify-self-start rounded-full bg-(--ink) px-6 py-3 font-bold text-(--base) disabled:opacity-50">{saving ? t("accountPage.saving") : t("accountPage.save")}</button>
    </form>
  );
}

function AccountPage() {
  const { t } = useTranslation();
  const { user, isAuthenticated, authLoading, openAuth } = useContext(AuthContext);

  if (authLoading) return <p role="status" className="p-8">{t("accountPage.loading")}</p>;
  if (!isAuthenticated) return <div className="mx-auto max-w-2xl p-8 text-center"><p>{t("accountPage.signIn")}</p><button onClick={openAuth} className="mt-4 rounded-full bg-(--ink) px-5 py-3 font-bold text-(--base)">{t("common.signIn")}</button></div>;

  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-20 pt-8 md:px-12">
      <span className="inline-flex rounded-full border border-(--line) bg-(--base) px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-(--muted)">{t("accountPage.eyebrow")}</span>
      <h1 className="mt-4 text-4xl font-black text-(--ink)">{t("accountPage.title")}</h1>
      <p className="mt-3 text-(--muted)">{t("accountPage.description")}</p>
      <AccountForm key={user._id} user={user} />
      <Link to="/orders" className="mt-5 inline-flex font-semibold text-(--muted) underline">{t("accountPage.ordersLink")}</Link>
    </main>
  );
}

export default AccountPage;
