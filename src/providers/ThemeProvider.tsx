
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "high-contrast" | "system";
type Language = "en" | "he";
type Direction = "ltr" | "rtl";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultLanguage?: Language;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  language: Language;
  direction: Direction;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  language: "en",
  direction: "ltr",
  setTheme: () => null,
  setLanguage: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultLanguage = "en",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(`${storageKey}-theme`) as Theme) || defaultTheme
  );
  
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem(`${storageKey}-language`) as Language) || defaultLanguage
  );

  const [direction, setDirection] = useState<Direction>(
    language === "he" ? "rtl" : "ltr"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove("light", "dark", "high-contrast");
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    const newDirection = language === "he" ? "rtl" : "ltr";
    setDirection(newDirection);
    document.documentElement.setAttribute("dir", newDirection);
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  const value = {
    theme,
    language,
    direction,
    setTheme: (theme: Theme) => {
      localStorage.setItem(`${storageKey}-theme`, theme);
      setTheme(theme);
    },
    setLanguage: (language: Language) => {
      localStorage.setItem(`${storageKey}-language`, language);
      setLanguage(language);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  
  return context;
};
