
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/providers/ThemeProvider";
import { useTranslation } from "@/providers/i18n/TranslationProvider";

export function LanguageToggle() {
  const { language, setLanguage } = useTheme();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="focus-visible:ring-2" aria-label="Change language">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          <span className="mr-2">{language === "en" ? "✓" : ""}</span>
          <span>{t("english")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("he")}>
          <span className="mr-2">{language === "he" ? "✓" : ""}</span>
          <span>{t("hebrew")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
