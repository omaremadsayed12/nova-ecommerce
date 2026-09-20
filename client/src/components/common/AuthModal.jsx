import { useState } from "react";
import { X } from "lucide-react";
import { getCurrentUser, login, register } from "../../services/auth.service";
import { ToastContext } from "../../context/ToastContext";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import FlowUpTransition from "./Transations/FlowUpTransation";
import { AuthContext } from "../../context/AuthContext";
import { AnimatePresence } from "framer-motion";

function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [registerForm, setRegisterForm] = useState(false);
  const [englishName, setEnglishName] = useState("");
  const [arabicName, setArabicName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useContext(ToastContext);
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
      showError(
        error.response?.data?.error.message || t("authModal.loginFailure"),
      );
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
      setRegisterForm(false);
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.log(error.response);
      showError(
        error.response?.data?.error.message || t("authModal.signUpFailure"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <div className="auth-modal">
        <FlowUpTransition>
          {!registerForm && (
            <div className="auth-modal-container">
              <button onClick={onClose} className="close-btn">
                <X />
              </button>
              <h2>{t("authModal.loginForm.header")}</h2>
              <p>{t("authModal.loginForm.paragraph")}</p>
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
              </form>
              <div className="switch-caption">
                <p>{t("authModal.loginForm.switch.paragraph")}</p>
                <button onClick={() => setRegisterForm(true)}>
                  {t("authModal.loginForm.switch.button")}
                </button>
              </div>
            </div>
          )}
        </FlowUpTransition>

        <FlowUpTransition>
          {registerForm && (
            <div className="auth-modal-container">
              <button
                onClick={() => {
                  setRegisterForm(false);
                  onClose();
                }}
                className="close-btn"
              >
                <X />
              </button>
              <h2>{t("authModal.signUpForm.header")}</h2>
              <p>{t("authModal.signUpForm.paragraph")}</p>
              <form onSubmit={handleRegisterSubmit} className="auth-form">
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
              </form>
              <div className="switch-caption">
                <p>{t("authModal.signUpForm.switch.paragraph")}</p>
                <button onClick={() => setRegisterForm(false)}>
                  {t("authModal.signUpForm.switch.button")}
                </button>
              </div>
            </div>
          )}
        </FlowUpTransition>
      </div>
    </AnimatePresence>
  );
}

export default AuthModal;
