import { useState } from "react";
import { X } from "lucide-react";
import { getCurrentUser, login, register } from "../../services/auth.service";
import { useToast } from "../../context/ToastContext";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import FlowUpTransition from "./Transitions/FlowUpTransition";
import { AuthContext } from "../../context/AuthContext";
import { AnimatePresence } from "framer-motion";
import { getApiErrorMessage } from "../../services/apiError";

function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [activeForm, setActiveForm] = useState("loginForm");
  const [englishName, setEnglishName] = useState("");
  const [arabicName, setArabicName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useToast();
  const { setUser } = useContext(AuthContext);
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.language;

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await login(email, password);
      localStorage.setItem("access_token", data.data.access_token);
      const user = await getCurrentUser();
      setUser(user.data);
      showSuccess(
        `${t("authModal.loginSuccess")} ${user.data.name[currentLanguage]}`,
      );
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      showError(getApiErrorMessage(error, t, "authModal.loginFailure"));
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const name = {
        en: englishName,
        ar: arabicName,
      };
      await register(name, email, password);
      const data = await login(email, password);
      localStorage.setItem("access_token", data.data.access_token);
      const user = await getCurrentUser();
      setUser(user.data);
      showSuccess(
        `${t("authModal.signUpSuccess")} ${user.data.name[currentLanguage]}`,
      );
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      showError(getApiErrorMessage(error, t, "authModal.signUpFailure"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-6">
        <FlowUpTransition>
            <div className="relative w-xl rounded-xl bg-(--base) p-8 shadow-(--shadow-xl)">
              <button onClick={onClose} className="absolute inset-e-5 top-5 rounded-full p-2 hover:bg-(--panel)">
                <X className="h-5 w-5"/>
              </button>
              <h2 className="text-3xl font-black tracking-tighter text-(--ink)">{t(`authModal.${activeForm}.header`)}</h2>
              <p className="mt-2 text-(--muted)">{t(`authModal.${activeForm}.paragraph`)}</p>
              { activeForm === "loginForm" ? (
              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div>
                  <label>{t("authModal.loginForm.email.label")}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t("authModal.loginForm.email.placeHolder")}
                  />
                </div>
                <div>
                  <label>{t("authModal.loginForm.password.label")}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder={t("authModal.loginForm.password.placeHolder")}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading
                    ? t("authModal.loginForm.button.loading")
                    : t("authModal.loginForm.button.text")}
                </button>
              </form>) : (<form onSubmit={handleRegisterSubmit} className="auth-form">
                <div className="flex gap-4">
                  <div className="flex flex-col gap-1">
                    <label>{t("authModal.signUpForm.englishName.label")}</label>
                    <input
                      type="name"
                      value={englishName}
                      onChange={(e) => setEnglishName(e.target.value)}
                      required
                      placeholder={t(
                        "authModal.signUpForm.englishName.placeHolder",
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>{t("authModal.signUpForm.arabicName.label")} </label>
                    <input
                      type="name"
                      value={arabicName}
                      onChange={(e) => setArabicName(e.target.value)}
                      placeholder={t(
                        "authModal.signUpForm.arabicName.placeHolder",
                      )}
                    />
                  </div>
                </div>
                <div>
                  <label>{t("authModal.signUpForm.email.label")}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t("authModal.signUpForm.email.placeHolder")}
                  />
                </div>
                <div>
                  <label>{t("authModal.signUpForm.password.label")}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder={t("authModal.signUpForm.password.placeHolder")}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading
                    ? t("authModal.signUpForm.button.loading")
                    : t("authModal.signUpForm.button.text")}
                </button>
              </form>)}
              <div className="switch-caption">
                <p>{t(`authModal.${activeForm}.switch.paragraph`)}</p>
                <button onClick={() => setActiveForm(activeForm ==="loginForm" ? "signUpForm" : "loginForm")}>
                  {t(`authModal.${activeForm}.switch.button`)}
                </button>
              </div>
            </div>
        </FlowUpTransition>
      </div>
    </AnimatePresence>
  );
}

export default AuthModal;
