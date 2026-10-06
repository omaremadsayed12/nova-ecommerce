import { AlertTriangle, RefreshCw } from "lucide-react";
import FlowUpTransition from "../components/common/Transitions/FlowUpTransition";
import { useTranslation } from "react-i18next";

function LoadingFailed() {
  const { t } = useTranslation();

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <FlowUpTransition>
      <main className="loading-page">
        <section className="loading-page__content">
          <div className="loading-page__icon">
            <AlertTriangle aria-hidden="true" strokeWidth={1.8} />
          </div>

          <p className="loading-page__eyebrow">{t("loadingFailed.eyebrow")}</p>
          <h1 className="loading-page__title">{t("loadingFailed.title")}</h1>
          <p className="loading-page__description">
            {t("loadingFailed.description")}
          </p>

          <button
            type="button"
            onClick={reloadPage}
            className="loading-page__button btn-primary"
          >
            <RefreshCw aria-hidden="true" />
            {t("loadingFailed.reload")}
          </button>

          <div className="loading-page__status">
            {t("loadingFailed.status")}
          </div>
        </section>
      </main>
    </FlowUpTransition>
  );
}

export default LoadingFailed;
