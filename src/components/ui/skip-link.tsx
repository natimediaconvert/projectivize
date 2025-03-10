
import { useTranslation } from "@/providers/i18n/TranslationProvider";

export function SkipLink() {
  const { t } = useTranslation();
  
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-background text-foreground px-4 py-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {t("skipToContent")}
    </a>
  );
}
