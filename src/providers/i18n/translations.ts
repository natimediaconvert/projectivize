
export type Translations = {
  [key: string]: string;
};

type TranslationsMap = {
  en: Translations;
  he: Translations;
};

export const translations: TranslationsMap = {
  en: {
    // Navigation
    "dashboard": "Dashboard",
    "tasks": "Tasks",
    "myDay": "My Day",
    "projects": "Projects",
    "team": "Team",
    "reports": "Reports",
    "goals": "Goals",
    "settings": "Settings",

    // Common
    "search": "Search",
    "filter": "Filter",
    "clear": "Clear",
    "apply": "Apply",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "submit": "Submit",
    "loading": "Loading...",
    "noResults": "No results found",
    "error": "An error occurred",

    // Theme
    "lightMode": "Light Mode",
    "darkMode": "Dark Mode",
    "highContrastMode": "High Contrast Mode",
    "systemTheme": "System Theme",

    // Language
    "english": "English",
    "hebrew": "Hebrew",
    "language": "Language",
    
    // Accessibility
    "skipToContent": "Skip to content",
    "accessibilitySettings": "Accessibility Settings",
  },
  he: {
    // Navigation
    "dashboard": "לוח מחוונים",
    "tasks": "משימות",
    "myDay": "היום שלי",
    "projects": "פרויקטים",
    "team": "צוות",
    "reports": "דוחות",
    "goals": "יעדים",
    "settings": "הגדרות",

    // Common
    "search": "חיפוש",
    "filter": "סינון",
    "clear": "נקה",
    "apply": "החל",
    "save": "שמור",
    "cancel": "ביטול",
    "delete": "מחק",
    "edit": "ערוך",
    "create": "צור",
    "submit": "שלח",
    "loading": "טוען...",
    "noResults": "לא נמצאו תוצאות",
    "error": "אירעה שגיאה",

    // Theme
    "lightMode": "מצב בהיר",
    "darkMode": "מצב כהה",
    "highContrastMode": "מצב ניגודיות גבוהה",
    "systemTheme": "ערכת נושא מערכת",

    // Language
    "english": "אנגלית",
    "hebrew": "עברית",
    "language": "שפה",
    
    // Accessibility
    "skipToContent": "דלג לתוכן",
    "accessibilitySettings": "הגדרות נגישות",
  },
};
